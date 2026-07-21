import { useEffect, useState } from 'react'
import {
  fetchActiveNotices,
  noticeFileUrl,
  noticeLinkProps,
  type Notice,
} from '../api/notices'
import './Notices.css'

function isImageType(type: string) {
  const t = type.toLowerCase()
  return t === 'png' || t === 'jpg' || t === 'jpeg'
}

function fileCategory(type: string) {
  const t = type.toLowerCase()
  if (t === 'pdf') return 'PDF Document'
  if (t === 'doc' || t === 'docx') return 'Word Document'
  if (isImageType(t)) return 'Image Notice'
  return type.toUpperCase()
}

function splitDate(iso: string) {
  const d = new Date(iso)
  return {
    day: d.toLocaleDateString(undefined, { day: '2-digit' }),
    month: d.toLocaleDateString(undefined, { month: 'short' }),
  }
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchActiveNotices()
        if (!cancelled) {
          setNotices(data)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Unable to load notices right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="notices" id="notices" aria-busy="true">
        <div className="notices__inner">
          <p className="notices__status">Loading notices…</p>
        </div>
      </section>
    )
  }

  if (error || notices.length === 0) {
    return null
  }

  return (
    <section className="notices" id="notices">
      <div className="notices__inner">
        <header className="notices__header">
          <div className="notices__heading">
            <p className="notices__eyebrow">Notices & Updates</p>
            <h2 className="notices__title">Official public notices & documents</h2>
          </div>
          
        </header>

        <ul className="notices__grid">
          {notices.map((notice, index) => {
            const linkProps = noticeLinkProps(notice.file_type)
            const href = noticeFileUrl(notice.file_url)
            const { day, month } = splitDate(notice.upload_date)
            const image = isImageType(notice.file_type)

            return (
              <li
                key={notice.id}
                className="notices__item"
                style={{ animationDelay: `${0.06 + index * 0.06}s` }}
              >
                <a
                  className="notice-card"
                  href={href}
                  target={linkProps.target}
                  rel={linkProps.rel}
                  download={linkProps.download}
                >
                  <div className="notice-card__media">
                    {image ? (
                      <img
                        className="notice-card__image"
                        src={href}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`notice-card__placeholder notice-card__placeholder--${notice.file_type.toLowerCase()}`}
                        aria-hidden="true"
                      >
                        <span className="notice-card__ext">
                          {notice.file_type.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="notice-card__date">
                      <span className="notice-card__day">{day}</span>
                      <span className="notice-card__month">{month}</span>
                    </div>
                  </div>

                  <p className="notice-card__category">{fileCategory(notice.file_type)}</p>
                  <h3 className="notice-card__title">{notice.title}</h3>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
