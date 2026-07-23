import { lazy, Suspense, useEffect, useState } from 'react'
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

  useEffect(() => {
    if (showRest) return

    let cancelled = false
    const reveal = () => {
      if (!cancelled) setShowRest(true)
    }

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(reveal, { timeout: 900 })
    } else {
      timeoutId = setTimeout(reveal, 150)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [showRest])

  useEffect(() => {
    if (hash) setShowRest(true)
  }, [hash])

  return (
    <>
      <Landing />
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
