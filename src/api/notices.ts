import { API_BASE } from './config'
import { authHeaders, clearStoredToken } from './auth'

export type Notice = {
  id: string
  title: string
  file_url: string
  file_type: string
  upload_date: string
  expires_at: string
  is_active?: boolean
}

export function noticeFileUrl(fileUrl: string) {
  if (fileUrl.startsWith('http')) return fileUrl
  return `${API_BASE}${fileUrl}`
}

async function handleAuthFailure(res: Response) {
  if (res.status === 401) {
    clearStoredToken()
  }
}

export async function fetchActiveNotices(): Promise<Notice[]> {
  const res = await fetch(`${API_BASE}/api/notices`)
  if (!res.ok) throw new Error('Failed to load notices')
  return res.json()
}

export async function fetchAllNotices(): Promise<Notice[]> {
  const res = await fetch(`${API_BASE}/api/notices/admin`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(
      res.status === 401
        ? 'Session expired. Please sign in again.'
        : 'Failed to load notices',
    )
  }
  return res.json()
}

export async function createNotice(formData: FormData): Promise<Notice> {
  const res = await fetch(`${API_BASE}/api/notices`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(data.error || 'Failed to create notice')
  }
  return data
}

export async function deleteNotice(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/notices/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(data.error || 'Failed to delete notice')
  }
}

/** Word docs should download; PDFs and images open in a new tab. */
export function noticeLinkProps(fileType: string): {
  target?: '_blank'
  download?: boolean
  rel?: string
} {
  const type = fileType.toLowerCase()
  if (type === 'doc' || type === 'docx') {
    return { download: true }
  }
  return { target: '_blank', rel: 'noopener noreferrer' }
}
