import { API_BASE } from './config'
import { authHeaders, clearStoredToken } from './auth'

export type ProjectCategory = 'feedlot' | 'mining'

export type Project = {
  id: string
  title: string
  subtitle: string
  meta: string
  description: string
  category: ProjectCategory
  image_url: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

export function projectImageUrl(imageUrl: string) {
  if (imageUrl.startsWith('http')) return imageUrl
  return `${API_BASE}${imageUrl}`
}

async function handleAuthFailure(res: Response) {
  if (res.status === 401) {
    clearStoredToken()
  }
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects`)
  if (!res.ok) throw new Error('Failed to load projects')
  return res.json()
}

export async function fetchAllProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects/admin`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(
      res.status === 401
        ? 'Session expired. Please sign in again.'
        : 'Failed to load projects',
    )
  }
  return res.json()
}

export async function createProject(formData: FormData): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(data.error || 'Failed to create project')
  }
  return data
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(data.error || 'Failed to update project')
  }
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    await handleAuthFailure(res)
    throw new Error(data.error || 'Failed to delete project')
  }
}
