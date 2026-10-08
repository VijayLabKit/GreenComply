import { useEffect, useState } from 'react'
import { Save, UserPlus, X, Loader2, Mail } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, Button, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import { useToast } from '../components/Toast'
import { company as mockCompany } from '../data/mockData'
import { useApi } from '../hooks/useApi'
import api from '../lib/api'

const SECTORS = [
  'Steel & Cement Manufacturing','Iron & Steel (Primary)','Aluminium & Non-Ferrous Metals',
  'Textiles & Apparel','Chemicals & Petrochemicals','Fertilizers & Agrochemicals',
  'Food Processing & Beverages','Electronics & Semiconductors','Automotive Components',
  'Pharmaceuticals & Biotech','Paper & Pulp','Glass & Ceramics','Plastics & Rubber',
  'Coal & Mining','Oil & Gas (Downstream)','Construction Materials','Leather & Footwear',
  'Gems & Jewellery','Logistics & Warehousing','Renewable Energy','Engineering & Capital Goods',
  'Other Manufacturing',
]

const team = [
  { name: 'Compliance Admin', role: 'Admin',  email: 'admin.greencomply@gmail.com' },
  { name: 'Anjali Rao',     role: 'Editor', email: 'anjali@himalayansteel.example' },
  { name: 'Pradeep Sharma', role: 'Viewer', email: 'pradeep@himalayansteel.example' },
]

const PREFS_KEY = 'gc_preferences'

const defaultPrefs = {
  'reg-brsr': true, 'reg-cbam': true, 'reg-iso': false,
  'notif-deadlines': true, 'notif-completeness': true, 'notif-supplier': true,
}

function loadPrefs() {
  try {
    return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }
  } catch {
    return { ...defaultPrefs }
  }
}

function InviteModal({ onClose, onInvite }) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Viewer')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    // Simulated invite — no mail server is configured in this deployment.
    await new Promise((r) => setTimeout(r, 600))
    onInvite({ name: email.split('@')[0].replace(/[._]/g, ' '), role, email })
    toast.success(`Invite sent to ${email} (${role}).`)
    setBusy(false)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass-card w-full max-w-sm p-7 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">Invite team member</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-soft block mb-1.5">Work email</label>
            <input required type="email" className="input-dark" placeholder="name@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-soft block mb-1.5">Role</label>
            <select className="input-dark" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={busy}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
              {busy ? 'Sending…' : 'Send invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Settings() {
  const toast = useToast()
  const { data, loading, error, usingFallback, retry } = useApi('/api/company/profile', { fallback: mockCompany })
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState(loadPrefs)
  const [showInvite, setShowInvite] = useState(false)
  const [invited, setInvited] = useState([])

  useEffect(() => {
    if (data) {
      setProfile({
        name:     data.name     ?? '',
        gstin:    data.gstin    ?? '',
        sector:   data.sector   ?? SECTORS[0],
        location: data.location ?? '',
      })
    }
  }, [data])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/api/company/profile', profile)
      toast.success('Company profile saved.')
      retry()
    } catch {
      toast.error('Could not save your profile — please retry.')
    }
    setSaving(false)
  }

  const togglePref = (key, label) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
    toast.info(`${label} ${next[key] ? 'enabled' : 'disabled'}.`)
  }

  if (loading || !profile) {
    return (
      <DashboardLayout title="Settings" subtitle="Company profile, team access and notifications">
        <div className="card p-5 space-y-4">
          <Skeleton className="h-3 w-32" />
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Settings" subtitle="Company profile, team access and notifications">
      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={(m) => setInvited((prev) => [...prev, m])} />
      )}

      {usingFallback && <FallbackBanner />}
      {error && !usingFallback && <ErrorState message={error} onRetry={retry} />}

      {/* Company profile */}
      <SectionCard title="Company profile">
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company name"    value={profile.name}     onChange={(v) => setProfile({ ...profile, name: v })} />
            <Field label="GSTIN"           value={profile.gstin}    onChange={(v) => setProfile({ ...profile, gstin: v })} />
            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Industry sector</label>
              <select
                className="input-dark"
                value={profile.sector}
                onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
              >
                {SECTORS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Field label="Location"        value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} />
          </div>
          <Button type="submit" disabled={saving} className="mt-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </SectionCard>

      {/* Team */}
      <SectionCard title="Team members" action={<Button variant="secondary" onClick={() => setShowInvite(true)}><UserPlus size={15} /> Invite member</Button>}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[...team, ...invited].map((m) => (
            <div
              key={m.email}
              className="flex items-center justify-between py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                  style={{ background: 'linear-gradient(135deg,#2E7D32,#66BB6A)', color: 'white' }}
                >
                  {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink capitalize">{m.name}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{m.email}</p>
                </div>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: m.role === 'Admin' ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${m.role === 'Admin' ? 'rgba(76,175,80,0.25)' : 'rgba(255,255,255,0.1)'}`,
                  color: m.role === 'Admin' ? '#81C784' : 'rgba(232,245,233,0.6)',
                }}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Regulation subscriptions */}
      <SectionCard title="Regulation subscriptions">
        <div className="space-y-3">
          <ToggleRow prefKey="reg-brsr" prefs={prefs} onToggle={togglePref} label="BRSR (India / SEBI)" desc="Annual sustainability disclosure" />
          <ToggleRow prefKey="reg-cbam" prefs={prefs} onToggle={togglePref} label="CBAM (EU)" desc="Quarterly carbon border declarations" />
          <ToggleRow prefKey="reg-iso"  prefs={prefs} onToggle={togglePref} label="ISO 14001 tracking" desc="Environmental management system alignment" />
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notification preferences">
        <div className="space-y-3">
          <ToggleRow prefKey="notif-deadlines"    prefs={prefs} onToggle={togglePref} label="Deadline reminders"       desc="14, 7 and 1 days before filing" />
          <ToggleRow prefKey="notif-completeness" prefs={prefs} onToggle={togglePref} label="Data completeness alerts" desc="When a category drops below 80%" />
          <ToggleRow prefKey="notif-supplier"     prefs={prefs} onToggle={togglePref} label="Supplier risk flags"      desc="When a supplier is missing required data" />
        </div>
      </SectionCard>
    </DashboardLayout>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-soft block mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-dark"
      />
    </div>
  )
}

function ToggleRow({ label, desc, prefKey, prefs, onToggle }) {
  const checked = Boolean(prefs[prefKey])
  return (
    <button
      type="button"
      onClick={() => onToggle(prefKey, label)}
      className="flex items-center justify-between gap-4 w-full text-left cursor-pointer p-3.5 rounded-xl transition-colors hover:bg-white/[0.03]"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      role="switch"
      aria-checked={checked}
    >
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-soft mt-0.5">{desc}</p>
      </div>
      {/* Custom toggle */}
      <div
        className="relative rounded-full cursor-pointer transition-all shrink-0"
        style={{
          height: '22px', width: '40px',
          background: checked ? '#4CAF50' : 'rgba(255,255,255,0.12)',
          transition: 'background 0.2s',
        }}
      >
        <div
          className="absolute top-0.5 rounded-full bg-white shadow transition-all"
          style={{ width: '18px', height: '18px', left: checked ? '19px' : '2px', transition: 'left 0.2s' }}
        />
      </div>
    </button>
  )
}
