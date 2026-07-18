import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  createNotice,
  deleteNotice,
  fetchAllNotices,
  noticeFileUrl,
  type Notice,
} from '../../api/notices'
import { useAuth } from '../../context/AuthContext'
import './AdminDashboard.css'

const ACCEPTED =
  '.pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg'

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

export default function AdminDashboard() {
  const { admin, loading: authLoading, logout } = useAuth()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionGone, setSessionGone] = useState(false)

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<'30' | '60'>('30')

  const loadNotices = useCallback(async () => {
    try {
      const data = await fetchAllNotices()
      setNotices(data)
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not load notices.'
      if (msg.toLowerCase().includes('session')) {
        setSessionGone(true)
        return
      }
      setError(msg.includes('Failed') ? 'Could not load notices. Is the API running?' : msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!admin) return
    loadNotices()
  }, [admin, loadNotices])

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
    }
  }, [notices])

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      if (msg.toLowerCase().includes('session')) {
        setSessionGone(true)
        return
      }
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
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
      if (msg.toLowerCase().includes('session')) {
        setSessionGone(true)
        return
      }
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
          <p className="dash__eyebrow">Notice Management</p>
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

      {(message || error) && (
        <div className={`dash__alert${error ? ' dash__alert--error' : ''}`} role="status">
          {error || message}
        </div>
      )}

      <div className="dash__grid">
        <section className="dash__card" aria-labelledby="upload-heading">
          <h2 id="upload-heading" className="dash__card-title">
            Publish notice
          </h2>
          <p className="dash__card-lede">
            Uploads appear on the public site until they expire.
          </p>

          <form className="dash__form" onSubmit={handleSubmit}>
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
                accept={ACCEPTED}
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
            <Link className="dash__site-link" to="/#notices" target="_blank" rel="noreferrer">
              View public page
            </Link>
          </div>

          {loading ? (
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
                          onClick={() => handleDelete(notice.id)}
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
                            onClick={() => handleDelete(notice.id)}
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
    </main>
  )
}
