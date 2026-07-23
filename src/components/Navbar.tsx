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
  { label: 'Notices', to: '/notices', section: 'notices', page: true },
  { label: 'Contact', to: '/#contact', section: 'contact' },
] as const

const SECTION_IDS = links
  .filter((link) => !('page' in link && link.page))
  .map((link) => link.section)

type NavTone = 'light' | 'dark'

function getNavOffset() {
  const nav = document.querySelector('.navbar')
  return (nav?.getBoundingClientRect().height ?? 80) + 12
}

/** Sample the section under the sticky bar and read its declared nav tone. */
function toneFromScroll(): NavTone {
  const nav = document.querySelector('.navbar')
  const probeY = (nav?.getBoundingClientRect().bottom ?? 80) + 1
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-tone]'))
  let tone: NavTone = 'light'

  sections.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top <= probeY && rect.bottom > probeY) {
      const value = el.dataset.navTone
      if (value === 'dark' || value === 'light') tone = value
    }
  })

  return tone
}

function syncNavHeightVar(nav: HTMLElement) {
  const height = Math.ceil(nav.getBoundingClientRect().height)
  document.documentElement.style.setProperty('--nav-height', `${height}px`)
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
  const [tone, setTone] = useState<NavTone>(() =>
    typeof window !== 'undefined' && window.location.pathname === '/' && !window.location.hash
      ? 'dark'
      : 'light',
  )
  const [activeSection, setActiveSection] = useState<(typeof SECTION_IDS)[number]>('home')
  const skipHashScroll = useRef(false)
  const navRef = useRef<HTMLElement>(null)

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
    const nav = navRef.current
    if (!nav) return

    let frame = 0

    function update() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // Keep --nav-height stable while the mobile menu is expanded.
        if (navRef.current && !navRef.current.classList.contains('navbar--open')) {
          syncNavHeightVar(navRef.current)
        }
        setTone(toneFromScroll())
        if (location.pathname === '/') {
          setActiveSection(sectionFromScroll())
        }
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(nav)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver.disconnect()
    }
  }, [location.pathname, location.hash])

  // Re-sample tone when the menu opens/closes (height changes the probe line).
  useEffect(() => {
    setTone(toneFromScroll())
  }, [open])

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
    <header
      ref={navRef}
      className={`navbar navbar--on-${tone}${open ? ' navbar--open' : ''}`}
      data-tone={tone}
    >
      <div className="navbar__inner">
        <Logo variant="navbar" />

        <nav className="navbar__nav" aria-label="Primary">
          <ul className={`navbar__links${open ? ' navbar__links--open' : ''}`}>
            {links.map((link) => {
              const active = isLinkActive(link.section)
              const isPage = 'page' in link && link.page
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`navbar__link${active ? ' navbar__link--active' : ''}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={(event) => {
                      if (isPage) {
                        setOpen(false)
                        return
                      }
                      goToSection(
                        event,
                        link.section as (typeof SECTION_IDS)[number],
                        link.to,
                      )
                    }}
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
