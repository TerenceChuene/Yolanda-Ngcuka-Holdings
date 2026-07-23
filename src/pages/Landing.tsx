import { Link } from 'react-router-dom'
import './Landing.css'

const arrow = (
  <svg
    className="btn-arrow"
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

const HERO_SRC = '/bg-1-750.webp'
const HERO_SRCSET = '/bg-1-750.webp 750w, /bg-1-1100.webp 1100w, /bg-1.webp 1400w'

export default function Landing() {
  return (
    <main className="landing" id="home" data-nav-tone="dark">
      <div className="landing__media" aria-hidden="true">
        <img
          className="landing__media-img"
          src={HERO_SRC}
          srcSet={HERO_SRCSET}
          sizes="100vw"
          alt=""
          width={1400}
          height={1050}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="landing__veil" aria-hidden="true" />

      <section className="hero">
        <div className="hero__copy">
          <h1 className="hero__title" data-reveal>
            <span>Promoting Responsible & Sustainable Mining</span>
            <span>Practices</span>
          </h1>
          <p className="hero__lede" data-reveal>
            A 100% black-woman-owned environmental consulting firm delivering
            expert regulatory compliance and sustainable solutions across the
            full mining lifecycle.
          </p>
          <div className="hero__actions" data-reveal>
            <Link className="btn btn--primary" to="/#contact">
              Get Consulting
              {arrow}
            </Link>
            <Link className="btn btn--ghost" to="/#about">
              About our firm
              {arrow}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
