import { useState } from 'react'
import { AlertTriangle, Plus, X, Check, Loader2, Trash2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, Button, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'
import { suppliers as mockSuppliers } from '../data/mockData'
import { useApi } from '../hooks/useApi'
import api from '../lib/api'

function scoreColor(score) {
  if (score >= 70) return 'text-forest-500'
  if (score >= 50) return 'text-amber'
  return 'text-danger'
}

function AddSupplierModal({ onClose, onAdd }) {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', material: '', distanceKm: '', sustainabilityScore: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    let ok = false
    try {
      const r = await api.post('/api/suppliers', {
        name:                form.name,
        material:            form.material,
        distanceKm:          Number(form.distanceKm),
        sustainabilityScore: Number(form.sustainabilityScore),
      })
      onAdd({
        id:                  r.data.id ?? Date.now(),
        name:                r.data.name ?? form.name,
        material:            r.data.material ?? form.material,
        distanceKm:          r.data.distance_km ?? Number(form.distanceKm),
        sustainabilityScore: r.data.sustainability_score ?? Number(form.sustainabilityScore),
        flag:                r.data.flag ?? Number(form.sustainabilityScore) < 50,
      })
      toast.success(`Supplier "${form.name}" added.`)
      ok = true
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not add the supplier — please retry.')
    }
    setSaving(false)
    if (ok) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card w-full max-w-md p-7 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">Add supplier</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-soft block mb-1.5">Supplier name</label>
            <input required className="input-dark" placeholder="e.g. Terai Alloys Pvt Ltd"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-soft block mb-1.5">Material supplied</label>
            <input required className="input-dark" placeholder="e.g. Steel Billets"
              value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Distance (km)</label>
              <input required type="number" min="0" className="input-dark" placeholder="42"
                value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-soft block mb-1.5">Sustainability score (0–100)</label>
              <input required type="number" min="0" max="100" className="input-dark" placeholder="65"
                value={form.sustainabilityScore} onChange={(e) => setForm({ ...form, sustainabilityScore: e.target.value })} />
            </div>
          </div>
          {error && (
            <p className="text-sm text-danger px-3 py-2 rounded-lg" style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)' }}>
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Adding…' : 'Add supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Suppliers() {
  const toast = useToast()
  const { data, loading, error, usingFallback, retry } = useApi('/api/suppliers', { fallback: mockSuppliers })
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const suppliers = (data ?? mockSuppliers).map((s) => ({
    id:                  s.id,
    name:                s.name,
    material:            s.material,
    distanceKm:          s.distance_km ?? s.distanceKm ?? 0,
    sustainabilityScore: Number(s.sustainability_score ?? s.sustainabilityScore ?? 0),
    flag:                s.flag ?? false,
  }))

  const addSupplier = (s) => {
    retry() // re-sync with server state (activity log, ordering)
    // Optimistic: ensure the new row shows even if refetch lags.
    setImmediateDataIfMissing(s)
  }

  // Local overlay so the optimistic row appears instantly.
  const [overlay, setOverlay] = useState([])
  const setImmediateDataIfMissing = (s) => setOverlay((prev) => (prev.some((x) => x.id === s.id) ? prev : [...prev, s]))
  const visible = [
    ...overlay.filter((o) => !suppliers.some((s) => s.id === o.id)),
    ...suppliers,
  ]

  const doDelete = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await api.delete(`/api/suppliers/${confirmDelete.id}`)
      toast.success(`Supplier "${confirmDelete.name}" removed.`)
      setOverlay((prev) => prev.filter((x) => x.id !== confirmDelete.id))
      setConfirmDelete(null)
      retry()
    } catch {
      toast.error('Could not remove the supplier — please retry.')
    }
    setDeleting(false)
  }

  const flagged = visible.filter((s) => s.flag).length
  const scored  = visible.filter((s) => s.sustainabilityScore > 0)
  const avgScore = scored.length
    ? Math.round(scored.reduce((s, x) => s + x.sustainabilityScore, 0) / scored.length)
    : 0

  if (loading) {
    return (
      <DashboardLayout title="Suppliers" subtitle="Sustainability scoring and transport emissions across your supply chain">
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-16" /></div>
          ))}
        </div>
        <div className="card p-5 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Suppliers" subtitle="Sustainability scoring and transport emissions across your supply chain">
      {showModal && (
        <AddSupplierModal onClose={() => setShowModal(false)} onAdd={addSupplier} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Remove supplier"
          message={`Remove "${confirmDelete.name}" from the supplier directory? Their emissions data and history will be disassociated from your reports.`}
          confirmLabel="Remove"
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
          busy={deleting}
        />
      )}

      {usingFallback && <FallbackBanner />}
      {error && !usingFallback && <ErrorState message={error} onRetry={retry} />}

      <div className="grid sm:grid-cols-3 gap-4">
        <SectionCard>
          <p className="text-sm text-ink-soft">Active suppliers</p>
          <p className="text-2xl font-semibold text-ink mt-1">{visible.length}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-ink-soft">Avg. sustainability score</p>
          <p className={`text-2xl font-semibold mt-1 ${scoreColor(avgScore)}`}>{avgScore}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-ink-soft">Missing data flags</p>
          <p className="text-2xl font-semibold text-danger mt-1">{flagged}</p>
        </SectionCard>
      </div>

      <SectionCard
        title="Supplier directory"
        action={
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Add supplier
          </Button>
        }
      >
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[680px]">
            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <tr>
                {['Supplier', 'Material supplied', 'Distance (km)', 'Sustainability score', 'Status', ''].map((h, i) => (
                  <th key={h || i} className={`text-xs font-medium text-ink-soft px-5 py-3 ${i >= 2 && i <= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-5 py-3 font-medium text-ink">{s.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{s.material}</td>
                  <td className="px-5 py-3 text-right text-ink-soft">{s.distanceKm}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${scoreColor(s.sustainabilityScore)}`}>
                    {s.sustainabilityScore === 0 ? '—' : s.sustainabilityScore}
                  </td>
                  <td className="px-5 py-3">
                    {s.flag ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-danger bg-danger/10 px-2.5 py-1 rounded-full border border-danger/20">
                        <AlertTriangle size={11} /> {s.sustainabilityScore === 0 ? 'No data' : 'Missing data'}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-forest-500 bg-forest-200 px-2.5 py-1 rounded-full border border-forest-300/30">Up to date</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setConfirmDelete(s)}
                      className="text-ink-soft hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger/10"
                      title="Remove supplier"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </DashboardLayout>
  )
}
