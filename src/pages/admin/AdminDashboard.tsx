import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  createNotice,
  deleteNotice,
  fetchAllNotices,
  noticeFileUrl,
  type Notice,
} from '../../api/notices'
import {
  createProject,
  deleteProject,
  fetchAllProjects,
  projectImageUrl,
  updateProject,
  type Project,
  type ProjectCategory,
} from '../../api/projects'
import { useAuth } from '../../context/AuthContext'
import './AdminDashboard.css'

const NOTICE_ACCEPTED =
  '.pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg'

const IMAGE_ACCEPTED = '.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp'

type Tab = 'notices' | 'projects'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function daysLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

const emptyProjectForm = {
  title: '',
  subtitle: '',
  meta: '',
  description: '',
  category: 'mining' as ProjectCategory,
}

export default function AdminDashboard() {
  const { admin, loading: authLoading, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('notices')

  const [notices, setNotices] = useState<Notice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingNotices, setLoadingNotices] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionGone, setSessionGone] = useState(false)

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<'30' | '60'>('30')

  const [projectForm, setProjectForm] = useState(emptyProjectForm)
  const [projectImage, setProjectImage] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSessionError = useCallback((msg: string) => {
    if (msg.toLowerCase().includes('session')) {
      setSessionGone(true)
      return true
    }
    return false
  }, [])

  const loadNotices = useCallback(async () => {
    try {
      const data = await fetchAllNotices()
      setNotices(data)
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not load notices.'
      if (handleSessionError(msg)) return
      setError(msg.includes('Failed') ? 'Could not load notices. Is the API running?' : msg)
    } finally {
      setLoadingNotices(false)
    }
  }, [handleSessionError])

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchAllProjects()
      setProjects(data)
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not load projects.'
      if (handleSessionError(msg)) return
      setError(msg.includes('Failed') ? 'Could not load projects. Is the API running?' : msg)
    } finally {
      setLoadingProjects(false)
    }
  }, [handleSessionError])

  useEffect(() => {
    if (!admin) return
    loadNotices()
    loadProjects()
  }, [admin, loadNotices, loadProjects])

  const stats = useMemo(() => {
    const now = Date.now()
    const active = notices.filter((n) => new Date(n.expires_at).getTime() > now)
    const expired = notices.length - active.length
    const expiringSoon = active.filter((n) => daysLeft(n.expires_at) <= 7).length
    return {
      total: notices.length,
      active: active.length,
      expired,
      expiringSoon,
      projects: projects.length,
      feedlot: projects.filter((p) => p.category === 'feedlot').length,
      mining: projects.filter((p) => p.category === 'mining').length,
    }
  }, [notices, projects])

  const activeNotices = useMemo(
    () => notices.filter((n) => new Date(n.expires_at) > new Date()),
    [notices],
  )
  const expiredNotices = useMemo(
    () => notices.filter((n) => new Date(n.expires_at) <= new Date()),
    [notices],
  )

  if (authLoading) {
    return (
      <main className="dash">
        <p className="dash__boot">Loading portal…</p>
      </main>
    )
  }

  if (!admin || sessionGone) {
    return <Navigate to="/admin/login" replace />
  }

  async function handleNoticeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!title.trim()) {
      setError('Please enter a notice title.')
      return
    }
    if (!file) {
      setError('Please choose a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('duration_days', duration)
    formData.append('file', file)

    setSubmitting(true)
    try {
      await createNotice(formData)
      setTitle('')
      setFile(null)
      setDuration('30')
      ;(event.target as HTMLFormElement).reset()
      setMessage('Notice published to the public site.')
      await loadNotices()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed.'
      if (handleSessionError(msg)) return
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleNoticeDelete(id: string) {
    if (!window.confirm('Delete this notice and its file permanently?')) return

    setDeletingId(id)
    setMessage(null)
    setError(null)
    try {
      await deleteNotice(id)
      setMessage('Notice deleted.')
      setNotices((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed.'
      if (handleSessionError(msg)) return
      setError(msg)
    } finally {
      setDeletingId(null)
    }
  }

  function startEditProject(project: Project) {
    setEditingId(project.id)
    setProjectForm({
      title: project.title,
      subtitle: project.subtitle,
      meta: project.meta,
      description: project.description,
      category: project.category,
    })
    setProjectImage(null)
    setMessage(null)
    setError(null)
  }

  function cancelEditProject() {
    setEditingId(null)
    setProjectForm(emptyProjectForm)
    setProjectImage(null)
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setError(null)

    const { title: pTitle, subtitle, meta, description, category } = projectForm
    if (!pTitle.trim() || !subtitle.trim() || !meta.trim() || !description.trim()) {
      setError('Please fill in all project fields.')
      return
    }
    if (!editingId && !projectImage) {
      setError('Please choose a project image.')
      return
    }

    const formData = new FormData()
    formData.append('title', pTitle.trim())
    formData.append('subtitle', subtitle.trim())
    formData.append('meta', meta.trim())
    formData.append('description', description.trim())
    formData.append('category', category)
    if (projectImage) formData.append('image', projectImage)

    setSubmitting(true)
    try {
      if (editingId) {
        await updateProject(editingId, formData)
        setMessage('Project updated.')
      } else {
        await createProject(formData)
        setMessage('Project published to the public site.')
      }
      cancelEditProject()
      ;(event.target as HTMLFormElement).reset()
      await loadProjects()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed.'
      if (handleSessionError(msg)) return
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleProjectDelete(id: string) {
    if (!window.confirm('Delete this project and its image permanently?')) return

    setDeletingId(id)
    setMessage(null)
    setError(null)
    try {
      await deleteProject(id)
      setMessage('Project deleted.')
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (editingId === id) cancelEditProject()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed.'
      if (handleSessionError(msg)) return
      setError(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="dash">
      <div className="dash__glow" aria-hidden="true" />

      <header className="dash__top">
        <div>
          <p className="dash__eyebrow">Content Management</p>
          <h1 className="dash__title">Dashboard</h1>
        </div>
        <div className="dash__user">
          <div className="dash__user-meta">
            <span className="dash__user-name">{admin.name}</span>
            <span className="dash__user-email">{admin.email}</span>
          </div>
          <button type="button" className="dash__logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="dash__tabs" aria-label="Dashboard sections">
        <button
          type="button"
          className={`dash__tab${tab === 'notices' ? ' dash__tab--active' : ''}`}
          aria-selected={tab === 'notices'}
          onClick={() => {
            setTab('notices')
            setMessage(null)
            setError(null)
          }}
        >
          Notices
        </button>
        <button
          type="button"
          className={`dash__tab${tab === 'projects' ? ' dash__tab--active' : ''}`}
          aria-selected={tab === 'projects'}
          onClick={() => {
            setTab('projects')
            setMessage(null)
            setError(null)
          }}
        >
          Projects
        </button>
      </nav>

      {tab === 'notices' ? (
        <section className="dash__stats" aria-label="Notice statistics">
          <article className="dash__stat">
            <p className="dash__stat-label">Active</p>
            <p className="dash__stat-value">{stats.active}</p>
          </article>
          <article className="dash__stat">
            <p className="dash__stat-label">Expiring ≤ 7 days</p>
            <p className="dash__stat-value">{stats.expiringSoon}</p>
          </article>
          <article className="dash__stat">
            <p className="dash__stat-label">Expired</p>
            <p className="dash__stat-value">{stats.expired}</p>
          </article>
          <article className="dash__stat">
            <p className="dash__stat-label">Total</p>
            <p className="dash__stat-value">{stats.total}</p>
          </article>
        </section>
      ) : (
        <section className="dash__stats dash__stats--3" aria-label="Project statistics">
          <article className="dash__stat">
            <p className="dash__stat-label">Total projects</p>
            <p className="dash__stat-value">{stats.projects}</p>
          </article>
          <article className="dash__stat">
            <p className="dash__stat-label">Feedlot</p>
            <p className="dash__stat-value">{stats.feedlot}</p>
          </article>
          <article className="dash__stat">
            <p className="dash__stat-label">Mining</p>
            <p className="dash__stat-value">{stats.mining}</p>
          </article>
        </section>
      )}

      {(message || error) && (
        <div className={`dash__alert${error ? ' dash__alert--error' : ''}`} role="status">
          {error || message}
        </div>
      )}

      {tab === 'notices' ? (
        <div className="dash__grid">
          <section className="dash__card" aria-labelledby="upload-heading">
            <h2 id="upload-heading" className="dash__card-title">
              Publish notice
            </h2>
            <p className="dash__card-lede">
              Uploads appear on the public site until they expire.
            </p>

            <form className="dash__form" onSubmit={handleNoticeSubmit}>
              <label className="dash__field">
                <span>Notice title</span>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q2 Environmental Compliance Report"
                  maxLength={200}
                  required
                />
              </label>

              <label className="dash__field">
                <span>Document</span>
                <input
                  type="file"
                  name="file"
                  accept={NOTICE_ACCEPTED}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
                <span className="dash__hint">PDF, Word, or image · max 10 MB</span>
              </label>

              <fieldset className="dash__fieldset">
                <legend>Expiration</legend>
                <label className="dash__radio">
                  <input
                    type="radio"
                    name="duration"
                    value="30"
                    checked={duration === '30'}
                    onChange={() => setDuration('30')}
                  />
                  30 Days
                </label>
                <label className="dash__radio">
                  <input
                    type="radio"
                    name="duration"
                    value="60"
                    checked={duration === '60'}
                    onChange={() => setDuration('60')}
                  />
                  60 Days
                </label>
              </fieldset>

              <button className="dash__submit" type="submit" disabled={submitting}>
                {submitting ? 'Publishing…' : 'Publish notice'}
              </button>
            </form>
          </section>

          <section className="dash__card dash__card--wide" aria-labelledby="active-heading">
            <div className="dash__card-head">
              <div>
                <h2 id="active-heading" className="dash__card-title">
                  Active notices
                </h2>
                <p className="dash__card-lede">Visible on the public website right now.</p>
              </div>
              <Link className="dash__site-link" to="/notices" target="_blank" rel="noreferrer">
                View public page
              </Link>
            </div>

            {loadingNotices ? (
              <p className="dash__empty">Loading notices…</p>
            ) : activeNotices.length === 0 ? (
              <p className="dash__empty">No active notices. Publish one to get started.</p>
            ) : (
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Uploaded</th>
                      <th>Expires</th>
                      <th>Left</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {activeNotices.map((notice) => (
                      <tr key={notice.id}>
                        <td>
                          <a
                            href={noticeFileUrl(notice.file_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dash__file-link"
                          >
                            {notice.title}
                          </a>
                        </td>
                        <td>
                          <span className="dash__type">{notice.file_type.toUpperCase()}</span>
                        </td>
                        <td>{formatDate(notice.upload_date)}</td>
                        <td>{formatDate(notice.expires_at)}</td>
                        <td>
                          <span
                            className={`dash__days${daysLeft(notice.expires_at) <= 7 ? ' dash__days--warn' : ''}`}
                          >
                            {daysLeft(notice.expires_at)}d
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="dash__delete"
                            disabled={deletingId === notice.id}
                            onClick={() => handleNoticeDelete(notice.id)}
                          >
                            {deletingId === notice.id ? '…' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {expiredNotices.length > 0 && (
              <details className="dash__expired">
                <summary>Expired ({expiredNotices.length})</summary>
                <div className="dash__table-wrap">
                  <table className="dash__table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Expired</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {expiredNotices.map((notice) => (
                        <tr key={notice.id}>
                          <td>{notice.title}</td>
                          <td>{formatDate(notice.expires_at)}</td>
                          <td>
                            <button
                              type="button"
                              className="dash__delete"
                              disabled={deletingId === notice.id}
                              onClick={() => handleNoticeDelete(notice.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </section>
        </div>
      ) : (
        <div className="dash__grid">
          <section className="dash__card" aria-labelledby="project-form-heading">
            <h2 id="project-form-heading" className="dash__card-title">
              {editingId ? 'Edit project' : 'Add project'}
            </h2>
            <p className="dash__card-lede">
              {editingId
                ? 'Update details below. Leave the image blank to keep the current one.'
                : 'New projects appear on the public Projects section.'}
            </p>

            <form className="dash__form" onSubmit={handleProjectSubmit}>
              <label className="dash__field">
                <span>Title</span>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Molobeng Coal Mining"
                  maxLength={200}
                  required
                />
              </label>

              <label className="dash__field">
                <span>Subtitle</span>
                <input
                  type="text"
                  value={projectForm.subtitle}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Vryheid, KZN — 2024"
                  maxLength={200}
                  required
                />
              </label>

              <label className="dash__field">
                <span>Meta</span>
                <input
                  type="text"
                  value={projectForm.meta}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, meta: e.target.value }))
                  }
                  placeholder="e.g. Vryheid, KwaZulu-Natal · 2024"
                  maxLength={200}
                  required
                />
              </label>

              <label className="dash__field">
                <span>Category</span>
                <select
                  value={projectForm.category}
                  onChange={(e) =>
                    setProjectForm((f) => ({
                      ...f,
                      category: e.target.value as ProjectCategory,
                    }))
                  }
                  required
                >
                  <option value="feedlot">Feedlot</option>
                  <option value="mining">Mining</option>
                </select>
              </label>

              <label className="dash__field">
                <span>Description</span>
                <textarea
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Project summary shown on the public site…"
                  rows={5}
                  maxLength={4000}
                  required
                />
              </label>

              <label className="dash__field">
                <span>{editingId ? 'Replace image (optional)' : 'Image'}</span>
                <input
                  type="file"
                  accept={IMAGE_ACCEPTED}
                  onChange={(e) => setProjectImage(e.target.files?.[0] ?? null)}
                  required={!editingId}
                />
                <span className="dash__hint">PNG, JPG, or WEBP · max 10 MB</span>
              </label>

              <div className="dash__form-actions">
                <button className="dash__submit" type="submit" disabled={submitting}>
                  {submitting
                    ? 'Saving…'
                    : editingId
                      ? 'Save changes'
                      : 'Publish project'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    className="dash__cancel"
                    onClick={cancelEditProject}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="dash__card dash__card--wide" aria-labelledby="projects-list-heading">
            <div className="dash__card-head">
              <div>
                <h2 id="projects-list-heading" className="dash__card-title">
                  Portfolio projects
                </h2>
                <p className="dash__card-lede">Shown on the public website under Projects.</p>
              </div>
              <Link className="dash__site-link" to="/#projects" target="_blank" rel="noreferrer">
                View public section
              </Link>
            </div>

            {loadingProjects ? (
              <p className="dash__empty">Loading projects…</p>
            ) : projects.length === 0 ? (
              <p className="dash__empty">No projects yet. Add one to get started.</p>
            ) : (
              <div className="dash__table-wrap">
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Category</th>
                      <th>Meta</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <div className="dash__project-cell">
                            <img
                              className="dash__thumb"
                              src={projectImageUrl(project.image_url)}
                              alt=""
                              width={56}
                              height={36}
                              loading="lazy"
                            />
                            <div>
                              <p className="dash__project-title">{project.title}</p>
                              <p className="dash__project-sub">{project.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="dash__type">
                            {project.category.toUpperCase()}
                          </span>
                        </td>
                        <td>{project.meta}</td>
                        <td>
                          <div className="dash__row-actions">
                            <button
                              type="button"
                              className="dash__edit"
                              onClick={() => startEditProject(project)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="dash__delete"
                              disabled={deletingId === project.id}
                              onClick={() => handleProjectDelete(project.id)}
                            >
                              {deletingId === project.id ? '…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
