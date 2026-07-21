import { Link } from 'react-router-dom'
import consultant from '../assets/consultant.png'
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

export default function Landing() {
  return (
    <main className="landing" id="home">
      <div className="landing__waves" aria-hidden="true">
        <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-20 120C40 70 90 160 160 100C230 40 280 90 340 55C380 32 410 20 450 40"
            stroke="var(--green)"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <path
            d="M-10 145C50 95 110 175 175 120C240 65 300 110 360 80C400 60 430 50 470 70"
            stroke="var(--gold)"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
        </svg>
      </div>

      <section className="hero">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span>Promoting Responsible & Sustainable Mining</span>
            <span>Practices</span>
          </h1>
          <p className="hero__lede">
          A 100% black-woman-owned environmental consulting firm delivering expert regulatory compliance and sustainable solutions across the full mining lifecycle.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/#contact">
              Get Consulting
              {arrow}
            </Link>
            <Link className="btn btn--ghost" to="/#about">
              Learn More
              {arrow}
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <img
            className="hero__portrait"
            src={consultant}
            alt="Yolanda Ngcuka, environmental consulting professional"
          />
        </div>
      </section>
    </main>
  )
}
