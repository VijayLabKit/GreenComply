import { useState } from 'react'
import { FileDown, RefreshCw, Loader2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, StatusBadge, Button, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import { useToast } from '../components/Toast'
import { cbamShipments as mockShipments } from '../data/mockData'
import { useApi, downloadFile } from '../hooks/useApi'
import api from '../lib/api'

const euEtsPrice = 82.4

export default function CBAMReport() {
  const toast = useToast()
  const { data, loading, error, usingFallback, retry } = useApi('/api/reports/cbam', { fallback: mockShipments })
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)

  const shipments = (data ?? []).map((s) => ({
    id:                s.id ?? s.shipment_ref,
    product:           s.product,
    tonnes:            s.tonnes,
    emissionsPerTonne: s.emissionsPerTonne ?? s.emissions_per_tonne,
    carbonCost:        s.carbonCost        ?? s.carbon_cost,
    status:            s.status,
    declarationDue:    s.declarationDue    ?? s.declaration_due,
  }))

  const generate = async () => {
    setGenerating(true)
    try {
      await api.post('/api/reports/cbam/generate')
      toast.success('CBAM declaration regenerated from the shipment ledger.')
      retry()
    } catch {
      toast.error('Could not regenerate the declaration — please try again.')
    }
    setGenerating(false)
  }

  const exportDeclaration = async () => {
    setExporting(true)
    try {
      const filename = await downloadFile('/api/reports/cbam/export', 'CBAM_Declaration_Q3_2026.csv')
      toast.success(`Export ready — ${filename}`)
    } catch {
      toast.error('Export failed — please try again.')
    }
    setExporting(false)
  }

  if (loading) {
    return (
      <DashboardLayout title="CBAM Report" subtitle="EU Carbon Border Adjustment Mechanism declarations">
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3"><Skeleton className="h-3 w-28" /><Skeleton className="h-8 w-32" /></div>
          ))}
        </div>
        <div className="card p-5 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </DashboardLayout>
    )
  }

  const totalCost    = shipments.reduce((s, r) => s + Number(r.carbonCost ?? 0), 0)
  const totalTonnes  = shipments.reduce((s, r) => s + Number(r.tonnes ?? 0), 0)
  const overdueCount = shipments.filter((s) => s.status === 'Overdue').length

  return (
    <DashboardLayout title="CBAM Report" subtitle="EU Carbon Border Adjustment Mechanism declarations">
      {usingFallback && <FallbackBanner />}
      {error && !usingFallback && <ErrorState message={error} onRetry={retry} />}

      {/* Summary KPIs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ['Total product volume',   `${totalTonnes.toLocaleString()} t`],
          ['Estimated carbon cost',  `€${totalCost.toLocaleString()}`],
          ['EU ETS reference price', `€${euEtsPrice} /tCO₂e`],
        ].map(([label, value]) => (
          <SectionCard key={label}>
            <p className="text-sm text-ink-soft">{label}</p>
            <p className="text-2xl font-semibold text-ink mt-1">{value}</p>
          </SectionCard>
        ))}
      </div>

      {overdueCount > 0 && (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm animate-fade-in"
          style={{ background: 'rgba(239,83,80,0.07)', border: '1px solid rgba(239,83,80,0.25)', color: '#EF5350' }}
        >
          ⚠ {overdueCount} declaration{overdueCount > 1 ? 's are' : ' is'} past the quarterly deadline — export and submit as soon as possible to limit penalties.
        </div>
      )}

      {/* Shipments table */}
      <SectionCard
        title="Shipment declarations"
        subtitle="Embedded emissions calculated per tonne, by product"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={generate} disabled={generating}>
              {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {generating ? 'Generating…' : 'Re-generate'}
            </Button>
            <Button onClick={exportDeclaration} disabled={exporting}>
              {exporting ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
              {exporting ? 'Exporting…' : 'Export CSV'}
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[720px]">
            <thead
              className="text-xs text-ink-soft"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <tr>
                {['Shipment ID', 'Product', 'Tonnes', 'tCO₂e / tonne', 'Carbon cost (€)', 'Due', 'Status'].map((h, i) => (
                  <th key={h} className={`font-medium px-5 py-3 ${i >= 2 && i <= 4 ? 'text-right' : 'text-left'} last:text-left`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shipments.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-5 py-3 font-medium text-ink">{r.id}</td>
                  <td className="px-5 py-3 text-ink-soft">{r.product}</td>
                  <td className="px-5 py-3 text-right text-ink">{Number(r.tonnes).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-ink">{r.emissionsPerTonne}</td>
                  <td className="px-5 py-3 text-right font-medium text-ink">€{Number(r.carbonCost).toLocaleString()}</td>
                  <td className="px-5 py-3 text-ink-soft text-xs">{r.declarationDue ?? '—'}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Checklist */}
      <SectionCard title="Declaration checklist" subtitle="Required for EU customs submission">
        <ul className="space-y-2.5">
          {[
            'Installation-level emissions data verified',
            'Default emission values applied where actuals unavailable',
            'Importer EORI number linked',
            'Q3 quarterly declaration deadline: 30 Sep 2026 — 1 shipment overdue',
          ].map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-sm text-ink-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-500 shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </SectionCard>
    </DashboardLayout>
  )
}
