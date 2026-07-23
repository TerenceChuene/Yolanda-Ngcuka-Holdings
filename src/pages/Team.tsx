import { Link } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
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

type Credential = {
  label: string
  detail: string
}

type TeamMember = {
  index: string
  initials: string
  name: string
  role: string
  discipline: string
  focus: string[]
  bio: ReactNode
  credentials: Credential[]
}

const teamMembers: TeamMember[] = [
  {
    index: '01',
    initials: 'YN',
    name: 'Yolanda Ngcuka',
    role: 'Managing Director',
    discipline: 'Environmental Scientist',
    focus: ['Regulatory Compliance', 'Mining Lifecycle'],
    bio: (
      <>
        With over 16 years of experience in environmental science and mining
        regulatory compliance, <strong>Yolanda Ngcuka</strong> brings
        unparalleled expertise to every project. Her deep understanding of South
        Africa&apos;s environmental legislation, combined with hands-on field
        experience, ensures that clients receive technically sound and legally
        compliant solutions.
      </>
    ),
    credentials: [
      { label: '16+ Years', detail: 'Industry Experience' },
      { label: 'Environmental Science', detail: 'Professional Qualification' },
      { label: 'SACNASP', detail: 'Registered Natural Scientist' },
      { label: 'EAPASA', detail: 'Registered EAP' },
    ],
  },
  {
    index: '02',
    initials: 'MR',
    name: 'Mashudu Randela',
    role: 'Environmental Specialist',
    discipline: 'EIAs & Compliance Monitoring',
    focus: ['EIA Applications', 'Stakeholder Engagement'],
    bio: (
      <>
        An Environmental Specialist with over 5 years of experience, including 3
        years in the private sector and 2 years in the public sector, focusing
        on Environmental Impact Assessments (EIAs), compliance monitoring, and
        stakeholder engagement. Skilled in managing EIA applications, drafting
        environmental authorisations, and conducting site inspections to ensure
        compliance with legislation and client requirements. Experienced in
        preparing detailed environmental reports, advisory notes, and management
        documentation to support project approvals and business objectives.
        Demonstrates proven ability to collaborate effectively with regulators,
        stakeholders, and communities while promoting sustainable development and
        operational efficiency. Holds an Honours Degree in Environmental Sciences
        and Resource Studies from the University of Limpopo (2019) and has
        completed a Course in Biodiversity. Currently in the process of
        registering with EAPASA to strengthen professional credibility as an
        Environmental Assessment Practitioner.
      </>
    ),
    credentials: [
      { label: '5+ Years', detail: 'Industry Experience' },
      {
        label: 'Honours Degree',
        detail: 'Environmental Sciences & Resource Studies',
      },
      { label: 'Biodiversity', detail: 'Specialist Course Completed' },
      { label: 'EAPASA', detail: 'Registration In Progress' },
    ],
  },
  {
    index: '03',
    initials: 'PK',
    name: 'Pogisho Kgasago',
    role: 'Ecologist',
    discipline: 'Ecological Assessments',
    focus: ['Biodiversity', 'Habitat Surveys'],
    bio: (
      <>
        A qualified Ecologist with a Bachelor&apos;s degree in Life Sciences from
        the University of Johannesburg and an Honours degree in Environmental
        Management. She has 4 years of experience in ecological assessments,
        biodiversity monitoring, and environmental management, specialising in
        habitat assessments, species surveys, and ecological reporting. Pogisho
        is skilled in applying ecological principles to support Environmental
        Impact Assessments, rehabilitation planning, and compliance monitoring.
        She demonstrates strong analytical, problem-solving, and stakeholder
        engagement skills, contributing to sustainable environmental management
        practices across various projects. Pogisho is a registered professional
        with SACNASP (South African Council for Natural Scientific Professions)
        as Ecologist.
      </>
    ),
    credentials: [
      { label: '4 Years', detail: 'Ecological Experience' },
      { label: 'Honours Degree', detail: 'Environmental Management' },
      { label: 'SACNASP', detail: 'Registered Ecologist' },
      { label: 'BSc Life Sciences', detail: 'University of Johannesburg' },
    ],
  },
  {
    index: '04',
    initials: 'MM',
    name: 'Marcia Mphaphul',
    role: 'Senior Environmental Practitioner',
    discipline: 'EIAs & Environmental Authorisations',
    focus: ['Authorisations', 'Compliance'],
    bio: (
      <>
        A Senior Environmental Practitioner with 10 years of experience in the
        environmental management industry, specialising in Environmental Impact
        Assessments, compliance monitoring, and environmental authorisations.
        Holds a BSc in Environmental Science from the University of Venda and is
        a registered professional with EAPASA, ensuring adherence to professional
        standards and credibility. Skilled in preparing environmental reports,
        managing regulatory submissions, and providing expert advice to support
        sustainable project implementation and compliance with South African
        environmental legislation.
      </>
    ),
    credentials: [
      { label: '10 Years', detail: 'Industry Experience' },
      { label: 'BSc Environmental Science', detail: 'University of Venda' },
      { label: 'EAPASA', detail: 'Registered Professional' },
      { label: 'Authorisations', detail: 'EIA & Compliance Specialist' },
    ],
  },
]

export default function Team() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <main className="team" id="team" data-nav-tone="light">
      <div className="team__backdrop" aria-hidden="true" />
      <Waves side="right" />

      <section className="team__section">
        <header className="team__header" data-reveal>
          <div className="team__intro">
            <p className="team__eyebrow">Company Team</p>
            <h1 className="team__title">Experienced Practitioners Behind Every Mandate</h1>
          </div>
          <p className="team__lede">
            A specialist bench of environmental scientists, assessment
            practitioners, and ecologists delivering technically sound, legally
            compliant work across the mining lifecycle.
          </p>
        </header>

        <ul className="team__roster">
          {teamMembers.map((member) => {
            const isOpen = expanded === member.name
            return (
              <li
                key={member.name}
                data-reveal
              >
                <article
                  className={`member${isOpen ? ' member--open' : ''}`}
                >
                  <button
                    type="button"
                    className="member__toggle"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpanded(isOpen ? null : member.name)
                    }
                  >
                    <span className="member__index" aria-hidden="true">
                      {member.index}
                    </span>

                    <span className="member__monogram" aria-hidden="true">
                      {member.initials}
                    </span>

                    <span className="member__identity">
                      <span className="member__name">{member.name}</span>
                      <span className="member__role">{member.role}</span>
                      <span className="member__discipline">
                        {member.discipline}
                      </span>
                    </span>

                    <span className="member__focus">
                      {member.focus.map((item) => (
                        <span key={item} className="member__tag">
                          {item}
                        </span>
                      ))}
                    </span>

                    <span className="member__action">
                      {isOpen ? 'Close' : 'Profile'}
                      {arrow}
                    </span>
                  </button>

                  <div
                    className="member__panel"
                    hidden={!isOpen}
                  >
                    <p className="member__bio">{member.bio}</p>
                    <ul className="member__creds">
                      {member.credentials.map((item) => (
                        <li key={`${member.name}-${item.label}`}>
                          <p className="member__cred-label">{item.label}</p>
                          <p className="member__cred-detail">{item.detail}</p>
                        </li>
                      ))}
                    </ul>
                    <Link className="member__cta" to="/#contact">
                      Enquire with this specialist
                      {arrow}
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
