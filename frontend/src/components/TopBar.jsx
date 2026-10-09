import { useEffect, useRef, useState } from 'react'
import { Menu, Bell, ChevronDown, CalendarClock, LogOut, User } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../lib/auth'
import { useToast } from './Toast'

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

export default function TopBar({ title, subtitle, onMenu }) {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [bellOpen, setBellOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deadlines, setDeadlines] = useState([])
  const bellRef = useRef(null)
  const menuRef = useRef(null)

  useOutsideClose(bellRef, () => setBellOpen(false))
  useOutsideClose(menuRef, () => setMenuOpen(false))

  useEffect(() => {
    let alive = true
    api.get('/api/dashboard/deadlines')
      .then((r) => { if (alive) setDeadlines(Array.isArray(r.data) ? r.data : []) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  const initials = (user?.email || 'GU')
    .split('@')[0]
    .split(/[._-]/)
    .map((p) => p[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  const doLogout = () => {
    logout()
    toast.info('You have been signed out.')
    window.location.assign('/')
  }

  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20"
      style={{
        background: 'rgba(8,15,9,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden text-ink-soft hover:text-ink">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-ink leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-ink-soft hidden sm:block mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen((o) => !o)}
            className="relative text-ink-soft hover:text-ink transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {deadlines.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber" />
            )}
          </button>
          {bellOpen && (
            <div
              className="absolute right-0 top-10 w-80 glass-popover p-3 animate-fade-in"
              style={{ maxHeight: 340, overflowY: 'auto' }}
            >
              <p className="text-xs font-semibold text-ink-soft px-2 pb-2">Deadline reminders</p>
              {deadlines.length === 0 ? (
                <p className="text-xs text-ink-soft px-2 py-3">No deadlines tracked yet.</p>
              ) : (
                deadlines.map((d, i) => {
                  const days = d.daysLeft ?? d.days_left ?? 0
                  const urgent = days <= 14
                  return (
                    <div key={i} className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.04]">
                      <CalendarClock size={14} className={urgent ? 'text-amber mt-0.5' : 'text-forest-500 mt-0.5'} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{d.label}</p>
                        <p className="text-xs text-ink-soft">
                          {d.date} · {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 pl-4 hover:opacity-80 transition-opacity"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#2E7D32,#66BB6A)' }}
            >
              {initials || 'GU'}
            </div>
            <div className="hidden sm:block text-sm text-left">
              <p className="font-medium text-ink leading-tight">{user?.email?.split('@')[0] ?? 'Guest'}</p>
              <p className="text-xs text-ink-soft leading-tight">Compliance Admin</p>
            </div>
            <ChevronDown size={14} className={`text-ink-soft hidden sm:block transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 glass-popover p-2 animate-fade-in">
              <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-ink-soft">Signed in as</p>
                <p className="text-sm text-ink truncate">{user?.email ?? '—'}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); window.location.assign('/app/settings') }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-soft hover:text-ink hover:bg-white/[0.05] transition-all"
              >
                <User size={15} /> Account settings
              </button>
              <button
                onClick={doLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-soft hover:text-danger hover:bg-danger/10 transition-all"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
