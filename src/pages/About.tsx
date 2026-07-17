import { Link } from 'react-router-dom'
import aboutTeam from '../assets/about-team.png'
import founderAvatar from '../assets/founder-avatar.png'
import './About.css'

const arrow = (
  <svg
    className="about-arrow"
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

export default function About() {
  return (
    <main className="about" id="about">
      <section className="about__section">
        <div className="about__media">
          <div className="about__image-wrap">
            <img
              className="about__image"
              src={aboutTeam}
              alt="Team collaborating around a table in a modern workspace"
            />
          </div>

          <aside className="about__quote">
            <div className="about__quote-head">
              <img
                className="about__avatar"
                src={founderAvatar}
                alt=""
                width={48}
                height={48}
              />
              <p className="about__attribution">
                <span className="about__name">Forman Cobid</span>
                <span className="about__role">, Founder</span>
              </p>
            </div>
            <p className="about__quote-text">
              <span className="about__marks" aria-hidden="true">
                ”
              </span>
              Grass face saw beginning meat fod creeping eaven dominion intercom
              created behold.
            </p>
          </aside>
        </div>

        <div className="about__copy">
          <p className="about__eyebrow">About Company</p>
          <h1 className="about__title">
          Environmental Excellence, Rooted in Integrity 
          </h1>
          <div className="about__body">
            <p>
            Established in 2023, Yolanda Ngcuka Holdings (Pty) Ltd is a 100% black-woman-owned environmental consulting firm specialising in environmental management and regulatory compliance for the mining sector.

We support projects across the full mining lifecycle—from exploration and feasibility through to operations, rehabilitation, and closure. Our team combines deep technical expertise with an unwavering commitment to sustainable development and legal compliance.

Headquartered in Newcastle, KwaZulu-Natal, we serve mining operations across South Africa, providing the scientific rigour and regulatory knowledge that responsible mining demands.
            </p>
            
          </div>
          <div className="about__actions">
            <Link className="about-btn" to="/services">
              Learn More
              {arrow}
            </Link>
            
          </div>
        </div>
      </section>
    </main>
  )
}
