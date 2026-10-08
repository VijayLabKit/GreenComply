import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Check, UploadCloud, Keyboard, Plug, Loader2 } from 'lucide-react'
import api from '../lib/api'
import { useToast } from '../components/Toast'

const steps = ['Company profile', 'Data source', 'Regulations']

// Wizard state survives refreshes within the browser session.
const STORAGE_KEY = 'gc_onboarding'

function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export default function Onboarding() {
  const navigate = useNavigate()
  const toast = useToast()
  const draft = loadDraft()

  const [step, setStep] = useState(draft.step ?? 0)
  const [dataSource, setDataSource] = useState(draft.dataSource ?? 'manual')
  const [regs, setRegs] = useState(draft.regs ?? { brsr: true, cbam: true })
  const [profile, setProfile] = useState(draft.profile ?? null)
  const [saving, setSaving] = useState(false)

  // Prefill step 1 from the real company profile created at signup.
  useEffect(() => {
    if (profile) return
    api.get('/api/company/profile')
      .then((r) => setProfile(r.data))
      .catch(() => setProfile(null))
  }, [profile])

  const persist = (patch) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, dataSource, regs, profile, ...patch }))
  }

  const goTo = (next) => {
    setStep(next)
    persist({ step: next })
  }

  const finish = async () => {
    setSaving(true)
    try {
      await api.put('/api/company/profile', {
        exportStatus: regs.cbam,
      })
      toast.success('Setup complete — welcome to GreenComply!')
      sessionStorage.removeItem(STORAGE_KEY)
      navigate('/app')
    } catch {
      toast.error('Could not save your preferences — continuing anyway.')
      sessionStorage.removeItem(STORAGE_KEY)
      navigate('/app')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(76,175,80,0.08) 0%, transparent 60%), #080F09',
      }}
    >
      <div className="w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-10 h-10 rounded-2xl gradient-header flex items-center justify-center glow-pulse">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-semibold text-xl text-ink tracking-tight">GreenComply</span>
        </div>

        {/* Step indicator — clickable to revisit completed steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => i < step && goTo(i)}
              className={`flex-1 text-left ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`h-1 rounded-full transition-all duration-400 ${i <= step ? 'bg-forest-500' : 'bg-white/10'}`} />
              <p className={`text-xs mt-2 font-medium transition-colors ${i === step ? 'text-forest-500' : 'text-ink-soft'}`}>{s}</p>
            </button>
          ))}
        </div>

        <div className="glass-card p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-ink text-lg">Confirm your company profile</h2>
              {!profile ? (
                <div className="flex items-center gap-2 text-sm text-ink-soft py-6 justify-center">
                  <Loader2 size={15} className="animate-spin" /> Loading your profile…
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Company', profile.name ?? '—'],
                    ['GSTIN', profile.gstin ?? '—'],
                    ['Sector', profile.sector ?? '—'],
                    ['Location', profile.location ?? '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-ink-soft">{label}</p>
                      <p className="text-sm font-medium text-ink mt-0.5 truncate">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-ink text-lg">How will you bring in data?</h2>
              <div className="space-y-2.5">
                {[
                  { id: 'manual', icon: Keyboard, label: 'Manual entry',       desc: 'Enter figures directly into forms per category.' },
                  { id: 'csv',    icon: UploadCloud, label: 'Upload CSV',       desc: 'Bulk upload bills, logs and production data.' },
                  { id: 'api',    icon: Plug,        label: 'Connect an API',   desc: 'Simulate a live connection to your utility provider.' },
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => { setDataSource(o.id); persist({ dataSource: o.id }) }}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
                      dataSource === o.id
                        ? 'border-forest-500/50 bg-forest-500/08'
                        : 'hover:bg-white/[0.04]'
                    }`}
                    style={{ border: `1px solid ${dataSource === o.id ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.08)'}` }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <o.icon size={16} className="text-forest-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{o.label}</p>
                      <p className="text-xs text-ink-soft mt-0.5">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-ink text-lg">Which regulations apply to you?</h2>
              {[
                { id: 'brsr', label: 'BRSR (India / SEBI)', desc: 'Required for listed companies and their top suppliers.' },
                { id: 'cbam', label: 'CBAM (EU Carbon Border Adjustment)', desc: 'Required if you export steel, cement, aluminium or fertilizer to the EU.' },
              ].map((reg) => (
                <label
                  key={reg.id}
                  className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                  style={{ border: `1px solid ${regs[reg.id] ? 'rgba(76,175,80,0.35)' : 'rgba(255,255,255,0.08)'}`, background: regs[reg.id] ? 'rgba(76,175,80,0.06)' : 'transparent' }}
                >
                  <input
                    type="checkbox"
                    checked={regs[reg.id]}
                    onChange={(e) => { const next = { ...regs, [reg.id]: e.target.checked }; setRegs(next); persist({ regs: next }) }}
                    className="mt-0.5 w-4 h-4"
                    style={{ accentColor: '#4CAF50' }}
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">{reg.label}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{reg.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-7">
            {step > 0 && (
              <button
                onClick={() => goTo(step - 1)}
                className="px-5 py-3 rounded-xl font-medium text-ink-soft hover:text-ink transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => (step < steps.length - 1 ? goTo(step + 1) : finish())}
              disabled={saving}
              className="flex-1 bg-forest-500 text-white font-semibold py-3 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <><Loader2 size={16} className="animate-spin" /> Saving…</>
              ) : step < steps.length - 1 ? (
                'Continue'
              ) : (
                <><Check size={16} /> Go to dashboard</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
