import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { Sparkles } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import {
  scopeBreakdown as mockScope, facilityEmissions as mockFacility,
  emissionFactors as mockFactors, recommendations as mockRecs,
} from '../data/mockData'
import { useApi } from '../hooks/useApi'

const COLORS = ['#4CAF50', '#66BB6A', '#A5D6A7']

const mockSummary = {
  scopeBreakdown: mockScope,
  facilityEmissions: mockFacility,
  emissionFactors: mockFactors,
  recommendations: mockRecs,
}

export default function EmissionsTracker() {
  const summary = useApi('/api/emissions/summary', { fallback: mockSummary })

  if (summary.loading) {
    return (
      <DashboardLayout title="Emissions Tracker" subtitle="Scope 1, 2 and 3 emissions across all facilities">
        <div className="grid lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-4"><Skeleton className="h-3 w-32" /><Skeleton className="h-52 w-full" /></div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  const raw   = summary.data ?? mockSummary
  const scope = raw.scopeBreakdown    ?? raw.scope_breakdown    ?? mockScope
  const facility = raw.facilityEmissions ?? raw.facility_emissions ?? mockFacility
  const factors  = raw.emissionFactors   ?? raw.emission_factors   ?? mockFactors
  const recs     = raw.recommendations   ?? mockRecs

  const tooltipStyle = {
    borderRadius: 10,
    background: '#112015',
    border: '1px solid rgba(76,175,80,0.2)',
    color: '#E8F5E9',
    fontSize: 12,
  }

  return (
    <DashboardLayout title="Emissions Tracker" subtitle="Scope 1, 2 and 3 emissions across all facilities">
      {summary.usingFallback && <FallbackBanner />}
      {summary.error && !summary.usingFallback && <ErrorState message={summary.error} onRetry={summary.retry} />}

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Scope breakdown" subtitle="Share of total tCO₂e, current period">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={scope} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {scope.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center -mt-2">
            {scope.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-xs text-ink-soft">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {s.name} · {s.value} t
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Facility-wise emissions" subtitle="tCO₂e by site, current period">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facility} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'rgba(232,245,233,0.45)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="facility" type="category" width={130} tick={{ fontSize: 11, fill: 'rgba(232,245,233,0.45)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="emissions" fill="#4CAF50" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Emission factor reference" subtitle="Auto-applied based on fuel / electricity type">
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {factors.map((f) => (
              <div
                key={f.source}
                className="flex items-center justify-between py-3 text-sm"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-ink-soft">{f.source}</span>
                <span className="font-medium text-ink">{f.factor}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Reduction recommendations" subtitle="Generated from your emissions profile">
          <div className="space-y-3">
            {recs.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3.5"
                style={{ background: 'rgba(76,175,80,0.07)', border: '1px solid rgba(76,175,80,0.15)' }}
              >
                <Sparkles size={15} className="text-forest-500 mt-0.5 shrink-0" />
                <p className="text-sm text-ink-soft leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  )
}
