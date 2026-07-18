import { API_BASE } from './config'

const TOKEN_KEY = 'ynh_admin_token'

export type AdminUser = {
  id: string
  email: string
  name: string
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function authHeaders(): HeadersInit {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  return data
}

export async function fetchAdminMe(): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Session expired')
  return data
}
