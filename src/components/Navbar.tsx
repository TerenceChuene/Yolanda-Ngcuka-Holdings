import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import './Navbar.css'

const arrow = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M3 11L11 3M11 3H5.5M11 3V8.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const links = [
  { label: 'Home', to: '/', section: 'home' },
  { label: 'About', to: '/#about', section: 'about' },
  { label: 'Service', to: '/#services', section: 'services' },
  { label: 'Team', to: '/#team', section: 'team' },
  { label: 'Projects', to: '/#projects', section: 'projects' },
  { label: 'Contact', to: '/#contact', section: 'contact' },
] as const

const SECTION_IDS = links.map((link) => link.section)

function getNavOffset() {
  const nav = document.querySelector('.navbar')
  return (nav?.getBoundingClientRect().height ?? 80) + 12
}

/** Scroll so the section top sits just below the sticky navbar. */
export function scrollToSection(sectionId: string) {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const el = document.getElementById(sectionId)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - getNavOffset()
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

function sectionFromScroll() {
  const marker = window.scrollY + getNavOffset() + 24
  let current: (typeof SECTION_IDS)[number] = 'home'

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = el.getBoundingClientRect().top + window.scrollY
    if (top <= marker) {
      current = id
    }
  }

  return current
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<(typeof SECTION_IDS)[number]>('home')
  const skipHashScroll = useRef(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  // Handle hash navigation after route changes (e.g. /about → /#team)
  useEffect(() => {
    if (location.pathname !== '/') return

    const id = location.hash.replace(/^#/, '')
    if (!id) return

    if (skipHashScroll.current) {
      skipHashScroll.current = false
      return
    }

    let cancelled = false
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) scrollToSection(id)
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (location.pathname !== '/') return

    let frame = 0

    function update() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setActiveSection(sectionFromScroll())
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [location.pathname])

  function isLinkActive(section: string) {
    if (location.pathname === `/${section}`) return true
    if (location.pathname !== '/') return false
    return activeSection === section
  }

  function goToSection(
    event: MouseEvent<HTMLAnchorElement>,
    section: (typeof SECTION_IDS)[number],
    to: string,
  ) {
    event.preventDefault()
    setActiveSection(section)
    setOpen(false)

    if (location.pathname !== '/') {
      navigate(to)
      return
    }

    // Already on home — update the URL and scroll immediately
    if (section === 'home') {
      skipHashScroll.current = true
      if (location.hash) navigate('/', { replace: true })
      scrollToSection('home')
      return
    }

    skipHashScroll.current = true
    if (location.hash !== `#${section}`) {
      navigate(`/#${section}`)
    }
    scrollToSection(section)
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Logo variant="navbar" />

        <nav className="navbar__nav" aria-label="Primary">
          <ul className={`navbar__links${open ? ' navbar__links--open' : ''}`}>
            {links.map((link) => {
              const active = isLinkActive(link.section)
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`navbar__link${active ? ' navbar__link--active' : ''}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={(event) => goToSection(event, link.section, link.to)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Link
            className="navbar__cta"
            to="/#contact"
            onClick={(event) => goToSection(event, 'contact', '/#contact')}
          >
            Get Consulting
            {arrow}
          </Link>

          <button
            type="button"
            className={`navbar__toggle${open ? ' navbar__toggle--open' : ''}`}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
