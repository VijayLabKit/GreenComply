import { Link } from 'react-router-dom'
import { Leaf, Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(76,175,80,0.08) 0%, transparent 60%), #080F09' }}
    >
      <div className="text-center max-w-md animate-slide-up">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-2xl gradient-header flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-semibold text-xl text-ink tracking-tight">GreenComply</span>
        </div>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.25)' }}>
          <Compass size={28} className="text-forest-500" />
        </div>
        <h1 className="text-5xl font-bold text-ink mb-3">404</h1>
        <p className="text-ink-soft mb-8">This page doesn&apos;t exist or has been moved. Check the URL or head back to safety.</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/app"
            className="flex items-center gap-2 bg-forest-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25"
          >
            Go to dashboard
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-ink-soft hover:text-ink font-medium px-5 py-2.5 rounded-xl transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={15} /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
