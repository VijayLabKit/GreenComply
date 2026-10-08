import { useEffect, useState } from 'react'
import { ChevronDown, FileDown, RefreshCw, Loader2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, ProgressBar, Button, StatusBadge, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import { useToast } from '../components/Toast'
import { brsrPrinciples as mockPrinciples, company as mockCompany } from '../data/mockData'
import { useApi, downloadFile } from '../hooks/useApi'
import api from '../lib/api'

const narratives = {
  1: 'The Board reviews the Code of Conduct annually; 100% of employees completed anti-bribery training in FY25-26. No cases of corruption were reported during the period.',
  2: 'All finished steel and cement products undergo third-party quality testing. 96% of production complies with BIS safety standards.',
  4: 'Stakeholder grievance data collection started mid-year; community and supplier grievance disclosures are still being compiled.',
  5: 'Human rights due diligence is partially rolled out — supplier-level assessments cover 60% of Tier-1 spend so far.',
  6: 'Total energy intensity per tonne of production reduced by 4.1% versus the previous year, driven by furnace efficiency upgrades at Plant A.',
  8: 'Inclusive growth disclosures are the least complete section — local procurement spend and apprenticeship data are missing for two quarters.',
}

function mockPayload() {
  const c = Math.round(mockPrinciples.reduce((s, p) => s + p.completeness, 0) / mockPrinciples.length)
  return { company: mockCompany, principles: mockPrinciples, completeness: c, status: 'draft', categoryScores: [] }
}

export default function BRSRReport() {
  const toast = useToast()
  const { data, loading, error, usingFallback, retry } = useApi('/api/reports/brsr', { fallback: mockPayload() })
  const [open, setOpen] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)

  const principles   = data?.principles   ?? mockPrinciples
  const completeness = data?.completeness ?? 0
  const status       = data?.status       ?? 'draft'
  const companyInfo  = data?.company      ?? mockCompany
  const categoryScores = data?.categoryScores ?? data?.category_scores ?? []

  const generate = async () => {
    setGenerating(true)
    try {
      await api.post('/api/reports/brsr/generate')
      toast.success('BRSR report regenerated from the latest data.')
      retry()
    } catch {
      toast.error('Could not regenerate the report — please try again.')
    }
    setGenerating(false)
  }

  const exportPdf = async () => {
    setExporting(true)
    try {
      const filename = await downloadFile('/api/reports/brsr/export', 'BRSR_Annual_Report_FY25-26.pdf')
      toast.success(`Export ready — ${filename}`)
    } catch {
      toast.error('Export failed — please try again.')
    }
    setExporting(false)
  }

  if (loading) {
    return (
      <DashboardLayout title="BRSR Report" subtitle="Business Responsibility and Sustainability Reporting (SEBI)">
        <div className="card p-5 space-y-4"><Skeleton className="h-8 w-72" /><Skeleton className="h-2 w-full" /></div>
        <div className="card p-5 space-y-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="BRSR Report" subtitle="Business Responsibility and Sustainability Reporting (SEBI)">
      {usingFallback && <FallbackBanner />}
      {error && !usingFallback && <ErrorState message={error} onRetry={retry} />}

      {/* Header card */}
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm text-ink-soft">Report completeness</p>
              <StatusBadge status={status} />
            </div>
            <p className="text-2xl font-semibold text-ink">{completeness}% of required fields populated</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" onClick={generate} disabled={generating}>
              {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {generating ? 'Generating…' : 'Re-generate'}
            </Button>
            <Button onClick={exportPdf} disabled={exporting}>
              {exporting ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
              {exporting ? 'Exporting…' : 'Export PDF report'}
            </Button>
          </div>
        </div>
        <div className="mt-4"><ProgressBar value={completeness} /></div>
      </SectionCard>

      {/* Section A */}
      <SectionCard title="Section A — General Disclosures" subtitle="Auto-filled from company profile">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ['Legal name',         companyInfo.name ?? '—'],
            ['CIN / GSTIN',        companyInfo.gstin ?? '—'],
            ['Sector',             companyInfo.sector ?? '—'],
            ['Listing status',     'Unlisted — top supplier disclosure'],
            ['Employees',          `${companyInfo.employees ?? 412} (378 permanent, 34 contractual)`],
            ['Turnover (FY25-26)', `₹${companyInfo.turnover_cr ?? companyInfo.turnoverCr ?? '186.4'} Cr`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-ink-soft">{k}</span>
              <span className="font-medium text-ink">{v}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section B */}
      <SectionCard title="Section B — Management & Process" subtitle="Auto-computed from policy & governance data">
        <p className="text-sm text-ink-soft leading-relaxed">
          Sustainability oversight sits with a Board-level ESG committee that meets quarterly.
          Policies covering environment, labor and human rights are reviewed annually and
          published on the company's investor relations page. Grievance redressal is
          available to employees, suppliers and local communities via a dedicated channel.
        </p>
      </SectionCard>

      {/* Section C — Principles */}
      <SectionCard title="Section C — Principle-wise Performance" subtitle="9 NGRBC principles">
        <div className="space-y-2">
          {principles.map((p) => (
            <div
              key={p.id}
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <button
                onClick={() => setOpen(open === p.id ? null : p.id)}
                className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <span
                    className="text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-forest-500"
                    style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.25)' }}
                  >
                    {p.id}
                  </span>
                  <span className="text-sm font-medium text-ink">{p.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs w-10 text-right font-medium ${p.completeness < 50 ? 'text-danger' : 'text-ink-soft'}`}>{p.completeness}%</span>
                  <div className="w-20 hidden sm:block"><ProgressBar value={p.completeness} tone={p.completeness < 50 ? 'danger' : p.completeness < 80 ? 'amber' : 'forest'} /></div>
                  <ChevronDown size={16} className={`text-ink-soft transition-transform ${open === p.id ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {open === p.id && (
                <div
                  className="px-4 pb-4 pt-2 text-sm text-ink-soft leading-relaxed"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(76,175,80,0.04)' }}
                >
                  {narratives[p.id] || 'Auto-generated narrative drawn from linked data sources for this principle, ready for compliance officer review.'}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </DashboardLayout>
  )
}
