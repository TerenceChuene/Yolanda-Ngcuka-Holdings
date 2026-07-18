import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearStoredToken,
  fetchAdminMe,
  getStoredToken,
  loginAdmin,
  setStoredToken,
  type AdminUser,
} from '../api/auth'

type AuthState = {
  admin: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function restore() {
      const token = getStoredToken()
      if (!token) {
        if (!cancelled) setLoading(false)
        return
      }
      try {
        const me = await fetchAdminMe()
        if (!cancelled) setAdmin(me)
      } catch {
        clearStoredToken()
        if (!cancelled) setAdmin(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, admin: user } = await loginAdmin(email, password)
    setStoredToken(token)
    setAdmin(user)
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setAdmin(null)
  }, [])

  const value = useMemo(
    () => ({ admin, loading, login, logout }),
    [admin, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
