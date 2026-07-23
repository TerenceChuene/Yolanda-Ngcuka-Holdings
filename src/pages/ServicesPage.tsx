import { Link } from 'react-router-dom'
import Waves from '../components/Waves'
import serviceAuthorisation from '../assets/service-authorisation.jpg'
import serviceAudits from '../assets/service-audits.jpg'
import serviceMonitoring from '../assets/service-monitoring.jpg'
import serviceRehabilitation from '../assets/service-rehabilitation.jpg'
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

const coreServices = [
  {
    number: '01',
    title: 'Authorisation Services',
    image: serviceAuthorisation,
    imageAlt: 'Professional preparing and signing regulatory application documents',
    items: [
      'Environmental Authorisation (EA) applications for mining and related activities',
      'Basic Assessment Reports (BARs) and Scoping & Environmental Impact Assessments (S&EIA)',
      'Regulatory liaison with competent authorities',
      'Public Participation Processes (PPP)',
      'WULA Application',
      'Specialist Studies (Wetlands Delineation, Aquatic Impact Assessment, Terrestrial/Biodiversity Impact Assessment, Social Impact Assessment & Agricultural Impact Assessment)',
    ],
  },
  {
    number: '02',
    title: 'Environmental Audits and Compliance',
    image: serviceAudits,
    imageAlt: 'Environmental professional conducting a field compliance assessment',
    items: [
      'Environmental compliance audits (internal and external)',
      'Legal compliance assessments',
      'Environmental Management Programme (EMPr) audits',
      'Due diligence audits for operations',
    ],
  },
  {
    number: '03',
    title: 'Environmental Monitoring',
    image: serviceMonitoring,
    imageAlt: 'Consultant monitoring water quality at a project site',
    items: [
      'Ongoing environmental monitoring programmes',
      'Water, soil, air quality, and biodiversity monitoring',
      'Compliance monitoring against licence and permit conditions',
      'Noise and Dust Monitoring',
      'Environmental performance reporting',
    ],
  },
  {
    number: '04',
    title: 'Rehabilitation and Closure Planning',
    image: serviceRehabilitation,
    imageAlt: 'Hands nurturing a young seedling representing land rehabilitation',
    items: [
      'Rehabilitation plans',
      'Progressive rehabilitation strategies',
      'Closure planning and final rehabilitation plans',
      'Post-closure environmental monitoring and reporting',
    ],
  },
]

export default function ServicesPage() {
  return (
    <main className="services services--page" id="services" data-nav-tone="light">
      <section className="services__band">
        <Waves side="right" />
        <div className="services__section services__section--page">
          <header className="services__header" data-reveal>
            <div className="services__intro">
              <p className="services__eyebrow">Core Services</p>
              <h1 className="services__title">
                End-to-end environmental solutions for mining
              </h1>
            </div>
            <p className="services__lede">
              From authorisations and specialist studies through audits,
              monitoring, and closure planning — practical support across the
              full project lifecycle.
            </p>
          </header>
        </div>
      </section>

      {coreServices.map((service, index) => {
        const reversed = index % 2 === 1
        return (
          <section
            key={service.title}
            className={`services__detail${reversed ? ' services__detail--alt' : ''}${reversed ? ' services__detail--reverse' : ''}`}
            aria-labelledby={`service-${service.number}`}
          >
            <Waves side={reversed ? 'right' : 'left'} />
            <div className="services__detail-inner">
              <div
                className="services__detail-media"
                data-reveal={reversed ? 'right' : 'left'}
              >
                <div className="services__detail-image-wrap">
                  <img
                    className="services__detail-image"
                    src={service.image}
                    alt={service.imageAlt}
                  />
                </div>
              </div>
              <div
                className="services__detail-copy"
                data-reveal={reversed ? 'left' : 'right'}
              >
                <p className="services__eyebrow">{service.number}</p>
                <h2
                  className="services__detail-title"
                  id={`service-${service.number}`}
                >
                  {service.title}
                </h2>
                <ul className="services__detail-list">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )
      })}

      <section className="services__band services__band--cta">
        <Waves />
        <div className="services__cta" data-reveal>
          <Link className="services__browse" to="/contact">
            Discuss Your Project
            {arrowIcon}
          </Link>
        </div>
      </section>
    </main>
  )
}
