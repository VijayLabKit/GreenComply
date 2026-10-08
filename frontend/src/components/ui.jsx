import { ArrowUpRight, ArrowDownRight, AlertCircle, RefreshCw, WifiOff } from 'lucide-react'

/* ── KPI Card ──────────────────────────────────────────────────────── */
export function KpiCard({ label, value, trend, trendDirection = 'up', icon: Icon, tone = 'forest' }) {
  const toneMap = {
    forest: 'bg-forest-200 text-forest-600',
    amber:  'bg-amber/15 text-amber',
    danger: 'bg-danger/15 text-danger',
  }
  const good = trendDirection === 'up'
  return (
    <div className="card p-5 animate-rise">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-soft font-medium">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${toneMap[tone]}`}>
            <Icon size={17} />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold mt-3 text-ink">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${good ? 'text-forest-500' : 'text-danger'}`}>
          {good ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend}
        </p>
      )}
    </div>
  )
}

/* ── Section Card ──────────────────────────────────────────────────── */
export function SectionCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title    && <h3 className="font-semibold text-ink text-sm">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-soft mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

/* ── Progress Bar ──────────────────────────────────────────────────── */
export function ProgressBar({ value, tone = 'forest' }) {
  const toneMap = { forest: 'bg-forest-500', amber: 'bg-amber', danger: 'bg-danger' }
  return (
    <div className="progress-track">
      <div
        className={`h-full rounded-full ${toneMap[tone]} transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

/* ── Status Badge ──────────────────────────────────────────────────── */
export function StatusBadge({ status }) {
  const map = {
    Draft:     'bg-amber/10 text-amber border border-amber/20',
    Ready:     'bg-forest-200 text-forest-600 border border-forest-300',
    Submitted: 'bg-forest-500/20 text-forest-500 border border-forest-500/30',
    Overdue:   'bg-danger/10 text-danger border border-danger/20',
    'At risk': 'bg-danger/10 text-danger border border-danger/20',
    Compliant: 'bg-forest-200 text-forest-600 border border-forest-300',
    Missing:   'bg-danger/10 text-danger border border-danger/20',
    generated: 'bg-forest-200 text-forest-600 border border-forest-300',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-forest-200 text-forest-600'}`}>
      {status}
    </span>
  )
}

/* ── Button ────────────────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:   'bg-forest-500 text-white hover:bg-forest-400 shadow-lg shadow-forest-500/20',
    secondary: 'bg-forest-200 text-forest-600 hover:bg-forest-300 border border-forest-300/40',
    ghost:     'text-forest-500 hover:bg-forest-200',
    danger:    'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20',
  }
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* ── Divider ───────────────────────────────────────────────────────── */
export function Divider() {
  return <div className="border-t border-white/[0.06]" />
}

/* ── Skeleton loader ───────────────────────────────────────────────── */
export function Skeleton({ className = '', style }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ background: 'rgba(255,255,255,0.06)', ...style }}
    />
  )
}

export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`card p-5 space-y-3 ${className}`}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-40" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" style={{}} />
      ))}
    </div>
  )
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3"><Skeleton className="h-3 w-20" /></td>
      ))}
    </tr>
  )
}

/* ── Error state with retry ────────────────────────────────────────── */
export function ErrorState({ message = 'Something went wrong', onRetry, compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-xl ${compact ? 'py-6 px-4' : 'py-12 px-6'}`}
      style={{ border: '1px solid rgba(239,83,80,0.25)', background: 'rgba(239,83,80,0.05)' }}
    >
      <AlertCircle size={compact ? 20 : 28} className="text-danger mb-2" />
      <p className={`text-ink font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-forest-500 hover:text-forest-400 transition-colors px-3 py-1.5 rounded-lg"
          style={{ border: '1px solid rgba(76,175,80,0.3)' }}
        >
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  )
}

/* ── Fallback banner (mock data shown) ─────────────────────────────── */
export function FallbackBanner() {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs animate-fade-in"
      style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.25)', color: '#FFB300' }}
    >
      <WifiOff size={13} className="shrink-0" />
      Couldn&apos;t reach the server — showing demo data. Changes may not be saved.
    </div>
  )
}
