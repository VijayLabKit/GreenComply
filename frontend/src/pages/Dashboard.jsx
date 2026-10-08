import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts'
import { Gauge, Wind, CalendarClock, AlertTriangle, Clock } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { KpiCard, SectionCard, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import api from '../lib/api'
import { formatActivityTime } from '../data/mockData'
import {
  kpis as mockKpis, emissionsTrend as mockTrend, brsrCategoryScores,
  deadlines as mockDeadlines, activityFeed as mockActivity,
} from '../data/mockData'

function DeadlinePill({ daysLeft }) {
  if (daysLeft < 0) {
    return (
      <span className="text-xs font-medium shrink-0 px-2.5 py-1 rounded-full bg-danger/10 text-danger border border-danger/20">
        {Math.abs(daysLeft)}d overdue
      </span>
    )
  }
  return (
    <span
      className={`text-xs font-medium shrink-0 px-2.5 py-1 rounded-full ${
        daysLeft <= 14
          ? 'bg-amber/10 text-amber border border-amber/20'
          : 'bg-forest-200 text-forest-500 border border-forest-300/30'
      }`}
    >
      {daysLeft}d left
    </span>
  )
}

export default function Dashboard() {
  const [kpis,      setKpis]      = useState(null)
  const [trend,     setTrend]     = useState(null)
  const [deadlines, setDeadlines] = useState(null)
  const [activity,  setActivity]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [fallback,  setFallback]  = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let alive = true
    const results = { kpis: false, trend: false, deadlines: false, activity: false }
    const mark = (key) => {
      results[key] = true
      if (Object.values(results).every(Boolean) && alive) setLoading(false)
    }
    const applyFallback = (setter, fb) => {
      setter(fb)
      setFallback(true)
    }

    setLoading(true)
    setError(null)
    setFallback(false)

    api.get('/api/dashboard/kpis')
      .then((r) => { if (alive) { setKpis(r.data); mark('kpis') } })
      .catch(() => { if (alive) { applyFallback(setKpis, mockKpis); mark('kpis') } })
    api.get('/api/dashboard/deadlines')
      .then((r) => { if (alive) { setDeadlines(r.data); mark('deadlines') } })
      .catch(() => { if (alive) { applyFallback(setDeadlines, mockDeadlines); mark('deadlines') } })
    api.get('/api/dashboard/activity')
      .then((r) => { if (alive) { setActivity(r.data); mark('activity') } })
      .catch(() => { if (alive) { applyFallback(setActivity, mockActivity); mark('activity') } })
    api.get('/api/emissions/trend')
      .then((r) => { if (alive) { setTrend(r.data); mark('trend') } })
      .catch(() => { if (alive) { applyFallback(setTrend, mockTrend); mark('trend') } })

    return () => { alive = false }
  }, [reloadKey])

  const retry = () => setReloadKey((k) => k + 1)

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Himalayan Steel Works Pvt. Ltd. · FY 2025-26">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-5 space-y-3"><Skeleton className="h-3 w-32" /><Skeleton className="h-32 w-full" /></div>
          <div className="card p-5 space-y-3 lg:col-span-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-44 w-full" /></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-5 space-y-4"><Skeleton className="h-3 w-36" /><Skeleton className="h-24 w-full" /></div>
          <div className="card p-5 space-y-4 lg:col-span-2"><Skeleton className="h-3 w-32" /><Skeleton className="h-28 w-full" /></div>
        </div>
      </DashboardLayout>
    )
  }

  // normalise field names from Supabase (snake_case) or mock (camelCase)
  const compliance  = kpis?.complianceScore   ?? kpis?.compliance_score   ?? 0
  const emissions   = kpis?.totalEmissions    ?? kpis?.total_emissions     ?? 0
  const trendPct    = kpis?.emissionsTrendPct ?? kpis?.emissions_trend_pct ?? 0
  const reportsDue  = kpis?.reportsDue        ?? kpis?.reports_due         ?? 0
  const nextDL      = kpis?.nextDeadline      ?? kpis?.next_deadline       ?? ''
  const riskFlags   = kpis?.riskFlags         ?? kpis?.risk_flags          ?? 0

  const chartData = (trend ?? []).map((r) => ({
    month:  r.month  ?? r.period,
    scope1: Number(r.scope1),
    scope2: Number(r.scope2),
    scope3: Number(r.scope3),
  }))

  return (
    <DashboardLayout title="Dashboard" subtitle="Himalayan Steel Works Pvt. Ltd. · FY 2025-26">
      {fallback && <FallbackBanner />}
      {error && !fallback && <ErrorState message={error} onRetry={retry} />}

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Compliance Score"       value={`${compliance}%`}                  trend="+3 pts this quarter"          icon={Gauge}         tone="forest" />
        <KpiCard label="Total CO₂e Emissions"   value={`${Number(emissions).toLocaleString()} tCO₂e`} trend={`+${trendPct}% vs last period`} trendDirection="down" icon={Wind} tone="amber" />
        <KpiCard label="Reports Due"            value={reportsDue}                         trend={nextDL}                       icon={CalendarClock}  tone="forest" />
        <KpiCard label="Risk Flags"             value={riskFlags}                          trend="Supplier & data gaps"         trendDirection="down" icon={AlertTriangle} tone="danger" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <SectionCard title="Compliance by category" subtitle="BRSR — Environment, Social, Governance" className="lg:col-span-1">
          <div className="grid grid-cols-3 gap-2">
            {brsrCategoryScores.map((c) => (
              <div key={c.category} className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={100}>
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: c.score, fill: '#4CAF50' }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.06)' }} dataKey="value" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <p className="text-sm font-semibold text-ink -mt-4">{c.score}%</p>
                <p className="text-xs text-ink-soft mt-2 text-center">{c.category}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Emissions trend" subtitle="Scope 1 / 2 / 3 — last 12 months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
              <defs>
                {[['s1','#1B5E20'],['s2','#43A047'],['s3','#81C784']].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(232,245,233,0.45)' }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 11, fill: 'rgba(232,245,233,0.45)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, background: '#112015', border: '1px solid rgba(76,175,80,0.2)', color: '#E8F5E9', fontSize: 12 }} />
              <Area type="monotone" dataKey="scope1" stackId="1" stroke="#1B5E20" fill="url(#s1)" name="Scope 1" />
              <Area type="monotone" dataKey="scope2" stackId="1" stroke="#43A047" fill="url(#s2)" name="Scope 2" />
              <Area type="monotone" dataKey="scope3" stackId="1" stroke="#81C784" fill="url(#s3)" name="Scope 3" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Deadlines + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <SectionCard title="Upcoming deadlines" className="lg:col-span-1">
          <div className="space-y-3">
            {(deadlines ?? []).map((d, i) => {
              const daysLeft = Number(d.daysLeft ?? d.days_left ?? 0)
              return (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{d.label}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{d.date}</p>
                  </div>
                  <DeadlinePill daysLeft={daysLeft} />
                </div>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" className="lg:col-span-2">
          <div className="space-y-4">
            {(activity ?? []).slice(0, 8).map((a, i) => (
              <div key={a.id ?? i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)' }}>
                  <Clock size={13} className="text-forest-500" />
                </div>
                <div>
                  <p className="text-sm text-ink">{a.text}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{formatActivityTime(a)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  )
}
