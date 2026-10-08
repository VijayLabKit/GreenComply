import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Database, FileBarChart, Ship, Wind,
  Users, FolderOpen, Settings as SettingsIcon, Leaf, X, LogOut,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useToast } from './Toast'

const links = [
  { to: '/app',              label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/app/data-sources', label: 'Data Sources',     icon: Database },
  { to: '/app/brsr',         label: 'BRSR Report',      icon: FileBarChart },
  { to: '/app/cbam',         label: 'CBAM Report',      icon: Ship },
  { to: '/app/emissions',    label: 'Emissions Tracker', icon: Wind },
  { to: '/app/suppliers',    label: 'Suppliers',         icon: Users },
  { to: '/app/documents',    label: 'Documents',         icon: FolderOpen },
  { to: '/app/settings',     label: 'Settings',          icon: SettingsIcon },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const toast = useToast()

  const logoutAndGo = () => {
    logout()
    toast.info('You have been signed out.')
    navigate('/')
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 shrink-0 flex flex-col
          border-r border-white/[0.07]
          transform transition-transform duration-250
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: '#080F09' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-header flex items-center justify-center glow-pulse">
              <Leaf size={17} className="text-white" />
            </div>
            <span className="font-semibold text-ink tracking-tight">GreenComply</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-soft hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-forest-500/15 text-forest-500 border border-forest-500/20'
                    : 'text-ink-soft hover:text-ink hover:bg-white/[0.05]'
                }`
              }
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.07]">
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(76,175,80,0.07)', border: '1px solid rgba(76,175,80,0.15)' }}>
            <p className="text-xs font-semibold text-forest-500 mb-0.5">Himalayan Steel Works</p>
            <p className="text-xs text-ink-soft truncate">{user?.email ?? 'Signed in'}</p>
          </div>
          <button
            onClick={logoutAndGo}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-white/[0.05] transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
