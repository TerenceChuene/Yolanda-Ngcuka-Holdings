import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  { label: 'Home', to: '/', hash: '' },
  { label: 'About', to: '/#about', hash: 'about' },
  { label: 'Service', to: '/#services', hash: 'services' },
  { label: 'Team', to: '/#team', hash: 'team' },
  { label: 'Projects', to: '/#projects', hash: 'projects' },
  { label: 'Contact', to: '/#contact', hash: 'contact' },
]

function isActive(pathname: string, hash: string, linkHash: string) {
  const cleanHash = hash.replace(/^#/, '')
  if (linkHash === '') {
    return pathname === '/' && cleanHash === ''
  }
  if (pathname === `/${linkHash}`) return true
  return pathname === '/' && cleanHash === linkHash
}

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Logo variant="navbar" />

        <nav className="navbar__nav" aria-label="Primary">
          <ul className={`navbar__links${open ? ' navbar__links--open' : ''}`}>
            {links.map((link) => {
              const active = isActive(
                location.pathname,
                location.hash,
                link.hash,
              )
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`navbar__link${active ? ' navbar__link--active' : ''}`}
                    onClick={() => {
                      if (link.hash === '' && location.pathname === '/') {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <Link className="navbar__cta" to="/#contact">
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
    </header>
  )
}
