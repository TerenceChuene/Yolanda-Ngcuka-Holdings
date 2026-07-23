import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Reveal.css'

const PENDING = '[data-reveal]:not(.is-revealed)'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function reveal(el: Element) {
  el.classList.add('is-revealed')
}

function revealAll(root: ParentNode = document) {
  root.querySelectorAll(PENDING).forEach(reveal)
}

/**
 * Observes [data-reveal] elements and reveals them as they enter the viewport.
 */
export default function RevealObserver() {
  const location = useLocation()

  useEffect(() => {
    if (prefersReducedMotion()) {
      revealAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      {
        // Any visible pixel is enough — tall sections failed at 0.12 + negative rootMargin.
        threshold: 0,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    const watch = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>(PENDING).forEach((el) => {
        observer.observe(el)
      })
    }

    watch()

    const mutations = new MutationObserver(() => watch())
    mutations.observe(document.body, { childList: true, subtree: true })

    // Safety net: anything still hidden after scrolling/resizing gets a second look.
    const rescue = () => {
      document.querySelectorAll<HTMLElement>(PENDING).forEach((el) => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        if (rect.top < vh && rect.bottom > 0) {
          reveal(el)
          observer.unobserve(el)
        }
      })
    }

    window.addEventListener('scroll', rescue, { passive: true })
    window.addEventListener('resize', rescue)

    // Catch above-the-fold content on the next frame.
    const frame = requestAnimationFrame(rescue)

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      observer.disconnect()
      window.removeEventListener('scroll', rescue)
      window.removeEventListener('resize', rescue)
    }
  }, [location.pathname])

  return null
}
