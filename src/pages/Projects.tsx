import { useState } from 'react'
import project1 from '../assets/project-1.png'
import project2 from '../assets/project-2.png'
import project3 from '../assets/project-3.png'
import project4 from '../assets/project-4.png'
import Waves from '../components/Waves'
import './Projects.css'

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

type Category = 'all' | 'feedlot' | 'mining'

const filters: { id: Category; label: string }[] = [
  { id: 'all', label: 'Discover All' },
  { id: 'feedlot', label: 'Feedlot Projects' },
  { id: 'mining', label: 'Mining Projects' },
]

const projects = [
  {
    id: 'vps-gauteng',
    category: 'feedlot' as Category,
    title: 'Feedlot Projects',
    subtitle: 'VPS Gauteng — 2025',
    meta: 'Gauteng · 2025',
    image: project1,
    description:
      'Environmental authorisation and compliance management for multiple feedlot operations in Gauteng, including development of environmental management plans, regulatory submissions, monitoring programmes, and rehabilitation strategies to minimise environmental impacts and support sustainable agricultural operations.',
  },
  {
    id: 'molobeng',
    category: 'mining' as Category,
    title: 'Molobeng Coal Mining',
    subtitle: 'Vryheid, KwaZulu-Natal — 2024',
    meta: 'Vryheid, KwaZulu-Natal · 2024',
    image: project2,
    description:
      'Environmental management and rehabilitation planning for coal mining operations, including water quality monitoring, biodiversity assessments, and progressive rehabilitation strategies.',
  },
  {
    id: 'dundee',
    category: 'mining' as Category,
    title: 'Dundee Mining',
    subtitle: 'Kuruman, Northern Cape — 2023',
    meta: 'Kuruman, Northern Cape · 2023',
    image: project3,
    description:
      'Comprehensive environmental auditing and monitoring services for active mining operations, ensuring ongoing regulatory compliance and environmental performance tracking.',
  },
  {
    id: 'dandee',
    category: 'mining' as Category,
    title: 'Dandee Mining',
    subtitle: 'Kenhardt, Northern Cape — 2023',
    meta: 'Kenhardt, Northern Cape · 2023',
    image: project4,
    description:
      'Environmental authorisation and compliance management for mining operations in the Northern Cape region, including full EA application and environmental management programme development.',
  },
]

export default function Projects() {
  const [active, setActive] = useState<Category>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const visible =
    active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <main className="projects" id="projects" data-nav-tone="light">
      <Waves />
      <section className="projects__section">
        <header className="projects__header" data-reveal>
          <p className="projects__eyebrow">Project &amp; Case Studies</p>
          <h1 className="projects__title">Our Environmental Projects</h1>
        </header>

        <div
          className="projects__filters"
          role="tablist"
          aria-label="Project categories"
          data-reveal
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active === filter.id}
              className={`projects__filter${active === filter.id ? ' projects__filter--active' : ''}`}
              onClick={() => setActive(filter.id)}
            >
              {filter.label}
              {filter.id === 'all' ? arrow : null}
            </button>
          ))}
        </div>

        <ul className="projects__grid">
          {visible.map((project, index) => {
            const isOpen = expanded === project.id
            return (
              <li
                key={project.id}
                className="project-card"
                data-reveal
              >
                <article>
                  <div className="project-card__media">
                    <img src={project.image} alt="" />
                  </div>
                  <h2 className="project-card__title">{project.title}</h2>
                  <p className="project-card__subtitle">{project.subtitle}</p>
                  <p
                    className={`project-card__desc${isOpen ? ' project-card__desc--open' : ''}`}
                  >
                    {project.description}
                  </p>
                  <div className="project-card__footer">
                    <span className="project-card__meta">{project.meta}</span>
                    <button
                      type="button"
                      className="project-card__more"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setExpanded(isOpen ? null : project.id)
                      }
                    >
                      {isOpen ? 'Show Less' : 'Read More'}
                      {arrow}
                    </button>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        <div className="projects__cta" data-reveal>
          <button
            type="button"
            className="projects__all"
            onClick={() => {
              setActive('all')
              setExpanded(null)
            }}
          >
            All Recent Projects
            {arrow}
          </button>
        </div>
      </section>
    </main>
  )
}
