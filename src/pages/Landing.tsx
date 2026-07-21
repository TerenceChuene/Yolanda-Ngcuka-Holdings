import { Link } from 'react-router-dom'
import consultant from '../assets/consultant.png'
import Waves from '../components/Waves'
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
      <Waves />

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
