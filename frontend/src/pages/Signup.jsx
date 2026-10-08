import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../lib/auth'

const SECTORS = [
  'Steel & Cement Manufacturing',
  'Iron & Steel (Primary)',
  'Aluminium & Non-Ferrous Metals',
  'Textiles & Apparel',
  'Chemicals & Petrochemicals',
  'Fertilizers & Agrochemicals',
  'Food Processing & Beverages',
  'Electronics & Semiconductors',
  'Automotive Components',
  'Pharmaceuticals & Biotech',
  'Paper & Pulp',
  'Glass & Ceramics',
  'Plastics & Rubber',
  'Coal & Mining',
  'Oil & Gas (Downstream)',
  'Construction Materials',
  'Leather & Footwear',
  'Gems & Jewellery',
  'Logistics & Warehousing',
  'Renewable Energy',
  'Engineering & Capital Goods',
  'Other Manufacturing',
]

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    companyName: '', gstin: '', sector: SECTORS[0],
    email: '', password: '', exportStatus: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await signup(form)
      navigate('/onboarding')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || 'Could not create your account — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(76,175,80,0.08) 0%, transparent 60%), #080F09',
      }}
    >
      <div className="w-full max-w-md animate-slide-up">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-10 h-10 rounded-2xl gradient-header flex items-center justify-center glow-pulse">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-semibold text-xl text-ink tracking-tight">GreenComply</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-xl font-semibold text-ink mb-1">Create your account</h1>
          <p className="text-sm text-ink-soft mb-7">Set up your company profile to get started.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Company name</label>
              <input
                id="signup-company"
                required
                placeholder="Himalayan Steel Works Pvt. Ltd."
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="input-dark"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-ink-soft block mb-1.5">GSTIN</label>
                <input
                  id="signup-gstin"
                  required
                  placeholder="19AABCH1234Q1ZP"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-soft block mb-1.5">Industry sector</label>
                <select
                  id="signup-sector"
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  className="input-dark"
                >
                  {SECTORS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Work email</label>
              <input
                id="signup-email"
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
                id="signup-password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
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

            <label
              className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <input
                id="signup-export"
                type="checkbox"
                checked={form.exportStatus}
                onChange={(e) => setForm({ ...form, exportStatus: e.target.checked })}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#4CAF50' }}
              />
              <div>
                <p className="text-sm font-medium text-ink">We export to the EU</p>
                <p className="text-xs text-ink-soft mt-0.5">CBAM declarations will be enabled for your account</p>
              </div>
            </label>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-forest-500 text-white font-semibold py-3 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25 disabled:opacity-60 mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-ink-soft text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-500 font-medium hover:text-forest-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
