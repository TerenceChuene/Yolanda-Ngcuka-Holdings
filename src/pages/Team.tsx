import { Link } from 'react-router-dom'
import Waves from '../components/Waves'
import './Team.css'

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

const credentials = [
  {
    title: '16+ Years',
    subtitle: 'Industry Experience',
    tone: 'navy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Environmental Science',
    subtitle: 'Professional Qualification',
    tone: 'teal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5.5C7 4 10 4 12 5.5C14 4 17 4 20 5.5V18.5C17 17 14 17 12 18.5C10 17 7 17 4 18.5V5.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 5.5V18.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'SACNASP',
    subtitle: 'Registered Natural Scientist',
    tone: 'gold',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M9.5 12.2l1.7 1.7 3.4-3.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'EAPASA',
    subtitle: 'Registered EAP',
    tone: 'gold',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.1 4.3 4.7.7-3.4 3.3.8 4.7L12 13.9 7.8 16l.8-4.7L5.2 8l4.7-.7L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 16.5V20l2.5-1.4L14.5 20v-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function Team() {
  return (
    <main className="team" id="team">
      <div className="team__backdrop" aria-hidden="true" />
      <Waves side="right" />

      <section className="team__section">
        <header className="team__header">
          <div className="team__intro">
            <p className="team__eyebrow">Meet Our Team</p>
            <h1 className="team__title">Experience Team Members</h1>
          </div>
          <Link className="team__browse" to="/services">
            Browse Services
            {arrow}
          </Link>
        </header>

        <article className="member-card">
          <aside className="member-card__sidebar">
            <div className="member-card__avatar" aria-hidden="true">
              <span>YN</span>
            </div>
            <h2 className="member-card__name">Yolanda Ngcuka</h2>
            <p className="member-card__role">Managing Director</p>
            <span className="member-card__rule" />
            <p className="member-card__discipline">Environmental Scientist</p>
          </aside>

          <div className="member-card__body">
            <p className="member-card__bio">
              With over 16 years of experience in environmental science and
              mining regulatory compliance,{' '}
              <strong>Yolanda Ngcuka</strong> brings unparalleled expertise to
              every project. Her deep understanding of South Africa&apos;s
              environmental legislation, combined with hands-on field
              experience, ensures that clients receive technically sound and
              legally compliant solutions.
            </p>

            <ul className="member-card__ creds">
              {credentials.map((item) => (
                <li
                  key={item.title}
                  className={`member-cred member-cred--${item.tone}`}
                >
                  <span className="member-cred__icon">{item.icon}</span>
                  <div>
                    <p className="member-cred__title">{item.title}</p>
                    <p className="member-cred__subtitle">{item.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </main>
  )
}
