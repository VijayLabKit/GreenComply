import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Leaf, UploadCloud, FileCheck2, Send, ArrowRight, TrendingDown, Shield, Zap,
  HelpCircle, Lock, Globe2, FileBarChart,
} from 'lucide-react'
import { useAuth } from '../lib/auth'

const steps = [
  {
    icon: UploadCloud,
    title: 'Connect your data',
    text: 'Upload electricity bills, fuel logs, production and waste records — or enter them manually in minutes.',
    color: '#4CAF50',
  },
  {
    icon: FileCheck2,
    title: 'Auto-generate your report',
    text: 'GreenComply maps your operational data to BRSR and CBAM requirements and drafts the disclosures for you.',
    color: '#66BB6A',
  },
  {
    icon: Send,
    title: 'Export & submit',
    text: 'Download a submission-ready BRSR report or CBAM declaration, versioned and audit-tracked.',
    color: '#81C784',
  },
]

const stats = [
  { value: '200+', label: 'MSMEs onboarded' },
  { value: '₹4.2Cr', label: 'Carbon cost savings' },
  { value: '98%', label: 'Filing accuracy' },
  { value: '< 2 hrs', label: 'First report ready' },
]

const features = [
  {
    icon: TrendingDown,
    title: 'Emissions intelligence',
    desc: 'Scope 1, 2 & 3 tracking auto-computed from your raw operational data, with 12-month trends and facility-level breakdowns.',
  },
  {
    icon: FileBarChart,
    title: 'One-click BRSR & CBAM reports',
    desc: 'Generate SEBI-compliant BRSR disclosures and EU CBAM declarations instantly — real PDF and CSV downloads, no manual formatting.',
  },
  {
    icon: Shield,
    title: 'Supplier risk scoring',
    desc: 'Sustainability scores across your whole supply chain, with automatic flags for suppliers missing emissions data.',
  },
  {
    icon: Lock,
    title: 'Compliance vault',
    desc: 'All reports, certificates and evidence stored, versioned and audit-ready in one secure place.',
  },
  {
    icon: Globe2,
    title: 'Built for Indian exporters',
    desc: 'Designed around SEBI BRSR and EU CBAM rules for MSMEs exporting steel, cement, aluminium and more.',
  },
  {
    icon: Zap,
    title: 'Deadline tracking',
    desc: 'Filing deadlines, overdue alerts and a live activity feed, so nothing slips through before the regulator notices.',
  },
]

const faqs = [
  {
    q: 'What is BRSR and who needs to file it?',
    a: 'BRSR (Business Responsibility and Sustainability Reporting) is mandated by SEBI for listed companies and increasingly required from their top suppliers. MSMEs supplying to listed companies often need to comply.',
  },
  {
    q: 'What is CBAM and does it apply to my business?',
    a: 'CBAM (Carbon Border Adjustment Mechanism) applies if you export cement, steel, aluminium, fertilizers, electricity, or hydrogen to the EU. From 2026, importers must declare the embedded emissions.',
  },
  {
    q: 'Do I need technical expertise to use GreenComply?',
    a: 'No. You just upload your existing records — electricity bills, fuel logs, production volumes. GreenComply maps them to the correct regulatory fields and generates the report automatically.',
  },
  {
    q: 'Can I try the product without paying?',
    a: 'Yes. The demo runs against a fully populated steel manufacturer dataset (Himalayan Steel Works). No credit card, no configuration required — just create an account and explore.',
  },
  {
    q: 'Is my data secure?',
    a: 'All data is stored in Supabase Postgres with row-level security. Reports and evidence are stored in encrypted Supabase Storage. We never share your data with third parties.',
  },
]

function PublicNav({ active }) {
  const { isAuthed } = useAuth()
  const appLink = isAuthed ? '/app' : '/login'
  const appLabel = isAuthed ? 'Dashboard' : 'Log in'
  return (
    <header className="nav-glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-header flex items-center justify-center glow-pulse">
            <Leaf size={17} className="text-white" />
          </div>
          <span className="font-semibold text-ink tracking-tight">GreenComply</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
          <a href="#how" className={`hover:text-ink transition-colors ${active === 'how' ? 'text-forest-500' : ''}`}>How it works</a>
          <a href="#features" className={`hover:text-ink transition-colors ${active === 'features' ? 'text-forest-500' : ''}`}>Features</a>
          <a href="#faq" className={`hover:text-ink transition-colors ${active === 'faq' ? 'text-forest-500' : ''}`}>FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to={appLink} className="text-sm font-medium text-ink-soft hover:text-ink transition-colors hidden sm:block">
            {appLabel}
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 bg-forest-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25"
          >
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const location = useLocation()
  const { isAuthed } = useAuth()
  const appLink = isAuthed ? '/app' : '/login'
  const appLabel = isAuthed ? 'Dashboard' : 'Log in'
  const [active, setActive] = useState('')

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [location.hash])

  useEffect(() => {
    const sections = ['how', 'features', 'faq']
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="hero-bg min-h-screen">
      <PublicNav active={active} />

      {/* Hero */}
      <section className="pt-36 pb-28 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="max-w-3xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.25)', color: '#81C784' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
            BRSR · CBAM · MSME compliance — now in one platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink leading-[1.05] tracking-tight">
            Sustainability
            <span className="block" style={{ backgroundImage: 'linear-gradient(90deg,#66BB6A,#4CAF50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              compliance
            </span>
            for every MSME
          </h1>
          <p className="text-lg text-ink-soft mt-7 max-w-2xl leading-relaxed animate-slide-up-d1">
            Turn the electricity bills, fuel logs and production data you already keep into
            SEBI BRSR disclosures and EU CBAM declarations — without hiring an ESG consultant.
          </p>
          <div className="flex flex-wrap gap-3 mt-9 animate-slide-up-d2">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-forest-500 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-forest-400 transition-all shadow-xl shadow-forest-500/25 glow-pulse"
            >
              Start free demo <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              onClick={(e) => scrollTo(e, 'how')}
              className="flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl transition-all text-ink-soft hover:text-ink"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up-d3">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5 text-center">
              <p className="text-2xl font-bold text-forest-500">{s.value}</p>
              <p className="text-xs text-ink-soft mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 lg:px-10" style={{ background: 'rgba(15,30,17,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-ink">How it works</h2>
            <p className="text-ink-soft mt-3">From raw data to filed report in three steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="glass-card p-7 relative animate-rise" style={{ animationDelay: `${i * 0.12}s` }}>
                <div
                  className="absolute top-5 right-5 text-4xl font-black opacity-10 leading-none"
                  style={{ color: s.color }}
                >
                  {i + 1}
                </div>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
                <h3 className="font-semibold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-ink">Everything you need to stay compliant</h2>
            <p className="text-ink-soft mt-3 max-w-xl mx-auto">Purpose-built for Indian MSMEs exporting to the EU, from data entry to filed report.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:border-forest-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-forest-200 flex items-center justify-center mb-4 group-hover:bg-forest-300 transition-colors">
                  <f.icon size={19} className="text-forest-500" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 lg:px-10" style={{ background: 'rgba(15,30,17,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-12">
            <HelpCircle size={22} className="text-forest-500" />
            <h2 className="text-2xl font-semibold text-ink">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="card p-5 group cursor-pointer">
                <summary className="flex items-center justify-between font-medium text-ink text-sm list-none">
                  {faq.q}
                  <span className="text-ink-soft text-lg ml-4 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="text-sm text-ink-soft mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center" style={{ border: '1px solid rgba(76,175,80,0.25)' }}>
          <h2 className="text-3xl font-semibold text-ink mb-4">Ready to file your first compliance report?</h2>
          <p className="text-ink-soft mb-8 max-w-lg mx-auto">No setup required. The demo runs against a fully seeded steel manufacturer dataset — see the full product in minutes.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="flex items-center gap-2 bg-forest-500 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25">
              Start free demo <ArrowRight size={16} />
            </Link>
            <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="font-medium px-7 py-3.5 rounded-xl text-ink-soft hover:text-ink transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-10 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-forest-500" />
            <span>© 2026 GreenComply. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="hover:text-ink transition-colors">How it works</a>
            <a href="#faq" onClick={(e) => scrollTo(e, 'faq')} className="hover:text-ink transition-colors">FAQ</a>
            <Link to={appLink} className="hover:text-ink transition-colors">{appLabel}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
