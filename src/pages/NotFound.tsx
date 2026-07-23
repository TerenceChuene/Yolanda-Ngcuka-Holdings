import { Link } from 'react-router-dom'
import Waves from '../components/Waves'
import './NotFound.css'

const arrow = (
  <svg
    className="not-found__arrow"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 11L11 3M11 3H5.5M11 3V8.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function NotFound() {
  return (
    <main className="not-found" data-nav-tone="light">
      <Waves side="right" />
      <section className="not-found__inner">
        <p className="not-found__brand">Yolanda Ngcuka Holdings</p>
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="not-found__title">This page isn’t here</h1>
        <p className="not-found__lede">
          The link may be outdated, or the page may have moved. Head home or
          reach out — we’re happy to help.
        </p>
        <div className="not-found__actions">
          <Link className="not-found__btn not-found__btn--primary" to="/">
            Back home
            {arrow}
          </Link>
          <Link className="not-found__btn not-found__btn--ghost" to="/contact">
            Contact us
            {arrow}
          </Link>
        </div>
      </section>
    </main>
  )
}
