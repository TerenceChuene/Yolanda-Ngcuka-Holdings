import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const { admin, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  if (!loading && admin) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login__atmosphere" aria-hidden="true" />
      <div className="admin-login__panel">
        <div className="admin-login__brand">
          <p className="admin-login__eyebrow">Yolanda Ngcuka Holdings</p>
          <h1 className="admin-login__title">Admin Portal</h1>
          <p className="admin-login__lede">
            Sign in to manage public notices, documents, and expirations.
          </p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="admin-login__error" role="alert">
              {error}
            </div>
          )}

          <label className="admin-login__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ynh.co.za"
              required
            />
          </label>

          <label className="admin-login__field">
            <span>Password</span>
            <div className="admin-login__password">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="admin-login__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button className="admin-login__submit" type="submit" disabled={submitting || loading}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
