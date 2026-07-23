import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Landing from './pages/Landing'

const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Team = lazy(() => import('./pages/Team'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))

function Home() {
  const { hash } = useLocation()
  const [showRest, setShowRest] = useState(() => Boolean(hash))
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hash) setShowRest(true)
  }, [hash])

  useEffect(() => {
    if (showRest) return

    const node = sentinelRef.current
    if (!node) return

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    // Keep below-fold sections off the network until the hero is near leaving
    // the viewport — frees bandwidth for LCP on slow mobile connections.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowRest(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(node)

    const scheduleFallback = () => {
      timeoutId = window.setTimeout(() => setShowRest(true), 1800)
    }
    if (document.readyState === 'complete') scheduleFallback()
    else window.addEventListener('load', scheduleFallback, { once: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('load', scheduleFallback)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [showRest])

  return (
    <>
      <Landing />
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
      {showRest ? (
        <Suspense fallback={null}>
          <About />
          <Services />
          <Team />
          <Projects />
          <Contact />
        </Suspense>
      ) : null}
    </>
  )
}

export default Home
