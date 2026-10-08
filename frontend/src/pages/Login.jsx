import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: 'vijay@himalayansteel.example', password: '' })
  const [error, setError] = useState(params.get('expired') ? 'Your session expired — please log in again.' : '')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(location.state?.from || '/app', { replace: true })
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || 'Login failed — check your email and password, or try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(76,175,80,0.08) 0%, transparent 60%), #080F09',
      }}
    >
      <div className="w-full max-w-sm animate-slide-up">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-10 h-10 rounded-2xl gradient-header flex items-center justify-center glow-pulse">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-semibold text-xl text-ink tracking-tight">GreenComply</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-xl font-semibold text-ink mb-1">Welcome back</h1>
          <p className="text-sm text-ink-soft mb-7">Log in to your compliance dashboard.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Work email</label>
              <input
                id="login-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Password</label>
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-dark"
              />
            </div>
            {error && (
              <p className="text-sm text-danger px-3 py-2 rounded-lg" style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)' }}>
                {error}
              </p>
            )}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-forest-500 text-white font-semibold py-3 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25 disabled:opacity-60 mt-1"
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-ink-soft text-center mt-6">
            New to GreenComply?{' '}
            <Link to="/signup" className="text-forest-500 font-medium hover:text-forest-400 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        <p className="text-xs text-ink-soft text-center mt-6">
          Demo: vijay@himalayansteel.example / greencomply-demo
        </p>
      </div>
    </div>
  )
}
