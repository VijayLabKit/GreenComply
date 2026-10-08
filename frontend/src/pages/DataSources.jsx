import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Zap, Fuel, Droplets, Trash2, Package, Users2, Truck, CheckCircle2, FileText, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, ProgressBar, Button, Skeleton, ErrorState } from '../components/ui'
import { useToast } from '../components/Toast'
import { dataSources as mockSources } from '../data/mockData'
import api from '../lib/api'

const icons = {
  electricity: Zap, fuel: Fuel, water: Droplets, waste: Trash2,
  raw_material: Package, labor: Users2, transport: Truck,
}

// simple CSV text → array of objects
function parseCSV(text) {
  const [headerLine, ...rows] = text.trim().split('\n')
  const headers = headerLine.split(',').map((h) => h.trim())
  return rows
    .filter(Boolean)
    .map((row) => {
      const vals = row.split(',')
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? '').trim()]))
    })
}

export default function DataSources() {
  const toast = useToast()
  const [sources,   setSources]   = useState(mockSources)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [active,    setActive]    = useState('electricity')
  const [manualForm, setManualForm] = useState({ facility: 'Siliguri Plant A', period: '2026-08', value: '', unit: 'kWh' })
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState('')
  const [csvRows,   setCsvRows]   = useState([])
  const [csvFile,   setCsvFile]   = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    api.get('/api/data-sources')
      .then((r) => {
        if (!alive) return
        const data = Array.isArray(r.data) && r.data.length ? r.data : mockSources
        // normalise snake_case from Supabase
        setSources(data.map((d) => ({
          id: d.id ?? d.category,
          name: d.name ?? d.category,
          completeness: d.completeness ?? d.completeness_pct ?? 0,
          lastUpdated: d.lastUpdated ?? d.last_updated ?? '—',
        })))
      })
      .catch((e) => { if (alive) setError(e?.message || 'Could not load data sources') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [reloadKey])

  const source = sources.find((d) => d.id === active) ?? sources[0]

  /* ── CSV pick & preview ────────────────────────────────────── */
  const onFilePick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result)
      if (parsed.length === 0) {
        toast.error('That CSV has no data rows.')
        return
      }
      setCsvRows(parsed.slice(0, 10))
      toast.info(`Parsed ${parsed.length} row${parsed.length === 1 ? '' : 's'} — review the preview before uploading.`)
    }
    reader.onerror = () => toast.error('Could not read that file.')
    reader.readAsText(file)
    e.target.value = ''
  }

  /* ── CSV upload to backend ─────────────────────────────────── */
  const uploadCSV = async () => {
    if (!csvFile) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', csvFile)
      const r = await api.post(`/api/data-sources/${active}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (r.data.preview) setCsvRows(r.data.preview.slice(0, 10))
      setSources((prev) =>
        prev.map((s) => s.id === active ? { ...s, completeness: Math.min(100, s.completeness + 5), lastUpdated: new Date().toISOString().split('T')[0] } : s)
      )
      toast.success(`${r.data.rows_parsed ?? csvRows.length} rows imported into ${source.name}.`)
      setCsvFile(null)
      setCsvRows([])
    } catch {
      toast.error('Upload failed — check your connection and try again.')
    }
    setUploading(false)
  }

  /* ── Manual entry ──────────────────────────────────────────── */
  const saveEntry = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      await api.post(`/api/data-sources/${active}/entry`, {
        facility: manualForm.facility,
        period:   manualForm.period,
        value:    parseFloat(manualForm.value),
        unit:     manualForm.unit,
      })
      setManualForm((f) => ({ ...f, value: '' }))
      setSources((prev) =>
        prev.map((s) => s.id === active ? { ...s, completeness: Math.min(100, s.completeness + 2), lastUpdated: new Date().toISOString().split('T')[0] } : s)
      )
      toast.success(`Entry saved for ${source.name}.`)
    } catch (err) {
      setSaveError(err?.response?.data?.detail || 'Could not save the entry — please retry.')
    }
    setSaving(false)
  }

  const unitMap = { electricity: 'kWh', fuel: 'litres', water: 'm³', waste: 'tonnes', raw_material: 'tonnes', labor: 'headcount', transport: 'tonne-km' }

  if (loading) {
    return (
      <DashboardLayout title="Data Sources" subtitle="Keep operational data fresh so reports stay accurate">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Data Sources" subtitle="Keep operational data fresh so reports stay accurate">
      {error ? (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : (
        <>
          {/* Source cards */}
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
            {sources.map((d) => {
              const Icon     = icons[d.id] ?? Zap
              const isActive = d.id === active
              const pct      = Number(d.completeness ?? 0)
              return (
                <button
                  key={d.id}
                  onClick={() => { setActive(d.id); setCsvRows([]); setCsvFile(null) }}
                  className="card p-5 text-left transition-all hover:border-forest-500/30"
                  style={isActive ? { border: '1px solid rgba(76,175,80,0.45)', boxShadow: '0 0 16px rgba(76,175,80,0.1)' } : {}}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)' }}>
                      <Icon size={17} className="text-forest-500" />
                    </div>
                    {pct === 100 && <CheckCircle2 size={17} className="text-forest-500" />}
                  </div>
                  <p className="font-medium text-ink mt-3 text-sm">{d.name}</p>
                  <p className="text-xs text-ink-soft mt-1">Updated {d.lastUpdated}</p>
                  <div className="mt-3">
                    <ProgressBar value={pct} tone={pct < 80 ? 'amber' : 'forest'} />
                    <p className="text-xs text-ink-soft mt-1.5">{pct}% complete</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Manual entry */}
            <SectionCard title={`Manual entry — ${source.name}`} subtitle="Add or update a reading for this category">
              <form className="space-y-4" onSubmit={saveEntry}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-ink-soft block mb-1.5">Facility</label>
                    <select
                      className="input-dark"
                      value={manualForm.facility}
                      onChange={(e) => setManualForm({ ...manualForm, facility: e.target.value })}
                    >
                      <option>Siliguri Plant A</option>
                      <option>Siliguri Plant B</option>
                      <option>Jalpaiguri Warehouse</option>
                      <option>Cooch Behar Depot</option>
                      <option>Logistics Fleet</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-soft block mb-1.5">Reporting period</label>
                    <input
                      type="month"
                      className="input-dark"
                      value={manualForm.period}
                      onChange={(e) => setManualForm({ ...manualForm, period: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-soft block mb-1.5">Value</label>
                  <div className="flex">
                    <input
                      required
                      type="number"
                      step="any"
                      min="0"
                      placeholder={`e.g. 18420`}
                      value={manualForm.value}
                      onChange={(e) => setManualForm({ ...manualForm, value: e.target.value })}
                      className="input-dark rounded-r-none flex-1"
                    />
                    <span
                      className="px-3 py-2 text-sm text-ink-soft"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none', borderRadius: '0 10px 10px 0' }}
                    >
                      {unitMap[active] ?? 'units'}
                    </span>
                  </div>
                </div>
                {saveError && (
                  <p className="flex items-center gap-2 text-sm text-danger px-3 py-2 rounded-lg" style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)' }}>
                    <AlertCircle size={14} /> {saveError}
                  </p>
                )}
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save entry'}</Button>
              </form>
            </SectionCard>

            {/* CSV upload */}
            <SectionCard title="CSV upload" subtitle="Bulk import readings for this category">
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFilePick} id="csv-upload-input" />
              <div className="flex items-center gap-2 mb-4">
                <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                  <FileText size={14} /> Pick CSV file
                </Button>
                {csvFile && (
                  <Button onClick={uploadCSV} disabled={uploading}>
                    <UploadCloud size={14} />
                    {uploading ? 'Uploading…' : `Upload "${csvFile.name}"`}
                  </Button>
                )}
              </div>

              {csvRows.length > 0 ? (
                <>
                  <p className="text-xs text-ink-soft mb-3">
                    Preview — {csvFile?.name} · {csvRows.length} rows shown
                  </p>
                  <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <table className="w-full text-sm">
                      <thead style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <tr>
                          {Object.keys(csvRows[0]).map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-ink-soft px-3 py-2.5">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvRows.map((row, i) => (
                          <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {Object.values(row).map((v, j) => (
                              <td key={j} className="px-3 py-2 text-ink-soft text-xs">{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-10 text-center cursor-pointer hover:border-forest-500/40 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => fileRef.current?.click()}
                >
                  <UploadCloud size={28} className="text-ink-soft mb-2 opacity-50" />
                  <p className="text-sm text-ink-soft">Click to pick a CSV file</p>
                  <p className="text-xs text-ink-soft mt-1 opacity-60">Headers: date, facility, value (+ any extras)</p>
                </div>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
