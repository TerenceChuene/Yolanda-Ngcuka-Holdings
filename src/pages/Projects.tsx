import { useEffect, useState } from 'react'
import { fetchProjects, projectImageUrl, type Project } from '../api/projects'
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

export default function Projects() {
  const [active, setActive] = useState<Category>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchProjects()
        if (!cancelled) {
          setProjects(data)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load projects right now.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

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

        {loading ? (
          <p className="projects__status" data-reveal>
            Loading projects…
          </p>
        ) : error ? (
          <p className="projects__status" data-reveal>
            {error}
          </p>
        ) : visible.length === 0 ? (
          <p className="projects__status" data-reveal>
            No projects in this category yet.
          </p>
        ) : (
          <ul className="projects__grid">
            {visible.map((project) => {
              const isOpen = expanded === project.id
              return (
                <li key={project.id} className="project-card" data-reveal>
                  <article>
                    <div className="project-card__media">
                      <img
                        src={projectImageUrl(project.image_url)}
                        alt=""
                        width={900}
                        height={300}
                        loading="lazy"
                        decoding="async"
                      />
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
        )}

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
