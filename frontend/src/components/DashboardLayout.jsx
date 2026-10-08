import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function DashboardLayout({ title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen" style={{ background: '#080F09' }}>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
