import Waves from '../components/Waves'
import { Link } from 'react-router-dom'
import './Services.css'

const arrowIcon = (
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

const services = [
  {
    title: 'Authorisation Services',
    description:
      'EA applications, BARs, S&EIA, WULA, public participation, and specialist studies for mining and related activities.',
    featured: false,
  },
  {
    title: 'Environmental Audits & Compliance',
    description:
      'Thorough environmental auditing to ensure your operations meet all legislative requirements and industry best practices.',
    featured: false,
  },
  {
    title: 'Environmental Monitoring',
    description:
      'Systematic monitoring programmes to track environmental conditions and ensure ongoing compliance with permit requirements.',
    featured: false,
  },
  {
    title: 'Rehabilitation & Closure Planning',
    description:
      'Strategic planning for mine rehabilitation and closure that meets regulatory standards and restores ecological integrity.',
    featured: false,
  },
]

export default function Services() {
  return (
    <main className="services" id="services" data-nav-tone="light">
      <Waves />
      <section className="services__section">
        <header className="services__header" data-reveal>
          <div className="services__intro">
            <p className="services__eyebrow">Our Services</p>
            <h1 className="services__title">
              We Provide The Best Service For Consulting
            </h1>
          </div>
          <p className="services__lede">
            Comprehensive environmental consulting services tailored to the
            mining sector, ensuring full regulatory compliance at every stage.
          </p>
        </header>

        <ul className="services__grid">
          {services.map((service) => (
            <li
              key={service.title}
              data-reveal
            >
              <Link
                className={`service-card${service.featured ? ' service-card--featured' : ''}`}
                to="/services-page"
              >
                <span className="service-card__rule" aria-hidden="true" />
                <h2 className="service-card__title">{service.title}</h2>
                <p className="service-card__text">{service.description}</p>
                <span className="service-card__action" aria-hidden="true">
                  {arrowIcon}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="services__cta"
          data-reveal
        >
          <Link className="services__browse" to="/services-page">
            View Core Services
            {arrowIcon}
          </Link>
        </div>
      </section>
    </main>
  )
}
