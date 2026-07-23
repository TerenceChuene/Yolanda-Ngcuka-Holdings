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

    let scheduled = false
    const scheduleWatch = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        watch()
      })
    }

    const mutations = new MutationObserver(scheduleWatch)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
    }
  }, [location.pathname])

  return null
}
