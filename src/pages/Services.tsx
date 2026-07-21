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
    title: 'Environmental Management Services',
    description:
      'We manage the full application process to efficiently secure your mining and environmental approvals.',
    featured: false,
  },
  {
    title: 'Environmental Audits & Compliance',
    description:
      'horough environmental auditing to ensure your operations meet all legislative requirements and industry best practices.',
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
    <main className="services" id="services">
      <section className="services__section">
        <header className="services__header">
          <div className="services__intro">
            <p className="services__eyebrow">Our Services</p>
            <h1 className="services__title">
              We Provide The Best Service For Consulting
            </h1>
          </div>
          <p className="services__lede">
          Comprehensive environmental consulting services tailored to the mining sector, ensuring full regulatory compliance at every stage.
          </p>
        </header>

        <ul className="services__grid">
          {services.map((service) => (
            <li key={service.title}>
              <a
                className={`service-card${service.featured ? ' service-card--featured' : ''}`}
                href="#browse"
              >
                <span className="service-card__rule" aria-hidden="true" />
                <h2 className="service-card__title">{service.title}</h2>
                <p className="service-card__text">{service.description}</p>
                <span className="service-card__action" aria-hidden="true">
                  {arrowIcon}
                </span>
              </a>
            </li>
          ))}
        </ul>

       
      </section>
    </main>
  )
}
