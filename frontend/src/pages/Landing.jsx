import { Link } from 'react-router-dom'
import { Leaf, UploadCloud, FileCheck2, Send, Check, ArrowRight } from 'lucide-react'

const steps = [
  { icon: UploadCloud, title: 'Connect your data', text: 'Upload electricity bills, fuel logs, production and waste records — or connect them manually in minutes.' },
  { icon: FileCheck2, title: 'Auto-generate your report', text: 'GreenComply maps your operational data to BRSR and CBAM requirements and drafts the disclosures for you.' },
  { icon: Send, title: 'Export & submit', text: 'Download a submission-ready BRSR report or CBAM declaration, versioned and audit-tracked.' },
]

const tiers = [
  {
    name: 'Starter',
    price: '₹6,999',
    period: '/month',
    desc: 'For a single unit getting BRSR-ready for the first time.',
    features: ['1 facility', 'BRSR report generator', 'Manual data entry', 'Email support'],
  },
  {
    name: 'Growth',
    price: '₹16,999',
    period: '/month',
    desc: 'For manufacturers tracking emissions across multiple units.',
    features: ['Up to 5 facilities', 'BRSR + Emissions Tracker', 'CSV bulk uploads', 'Supplier scoring', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Export-Ready',
    price: '₹34,999',
    period: '/month',
    desc: 'For exporters who need CBAM declarations alongside BRSR.',
    features: ['Unlimited facilities', 'BRSR + CBAM', 'XML/CSV declaration export', 'Compliance vault', 'Dedicated advisor'],
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-forest-50">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-header flex items-center justify-center">
            <Leaf size={19} className="text-white" />
          </div>
          <span className="font-semibold text-lg text-forest-700 tracking-tight">GreenComply</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#3C4A3C]">
          <a href="#how" className="hover:text-forest-700">How it works</a>
          <a href="#pricing" className="hover:text-forest-700">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-forest-700 hidden sm:block">Log in</Link>
          <Link to="/signup" className="bg-forest-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-forest-900 transition-colors">
            Get started
          </Link>
        </div>
      </header>

      <section className="px-6 lg:px-12 pt-12 pb-20 max-w-5xl">
        <p className="text-forest-500 text-sm font-medium mb-4">BRSR · CBAM · MSME compliance</p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] max-w-3xl">
          Compliance-ready sustainability reporting for every MSME
        </h1>
        <p className="text-ink-soft text-lg mt-5 max-w-2xl leading-relaxed">
          Turn the electricity bills, fuel logs and production data you already keep into
          SEBI BRSR disclosures and EU CBAM declarations — without hiring an ESG consultant.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/signup" className="bg-forest-700 text-white font-medium px-5 py-3 rounded-lg hover:bg-forest-900 transition-colors flex items-center gap-2">
            Start free demo <ArrowRight size={16} />
          </Link>
          <a href="#how" className="border border-forest-200 text-forest-700 font-medium px-5 py-3 rounded-lg hover:bg-forest-100 transition-colors">
            See how it works
          </a>
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-ink-soft">
          <span>Trusted by 200+ manufacturers</span>
          <span className="hidden sm:inline">·</span>
          <span>Built for steel, cement, textiles & chemicals exporters</span>
        </div>
      </section>

      <section id="how" className="px-6 lg:px-12 py-16 bg-white border-y border-forest-100">
        <h2 className="text-2xl font-semibold text-ink mb-10">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl">
          {steps.map((s, i) => (
            <div key={s.title}>
              <div className="w-11 h-11 rounded-xl bg-forest-50 flex items-center justify-center mb-4">
                <s.icon size={20} className="text-forest-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="px-6 lg:px-12 py-20">
        <h2 className="text-2xl font-semibold text-ink mb-2">Pricing that scales with your exports</h2>
        <p className="text-ink-soft mb-10">Simple monthly plans. Cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`card p-6 flex flex-col ${t.highlight ? 'border-forest-500 border-2 shadow-md' : ''}`}
            >
              {t.highlight && (
                <span className="text-xs font-medium text-forest-700 bg-forest-100 rounded-full px-2.5 py-1 w-fit mb-3">
                  Most popular
                </span>
              )}
              <h3 className="font-semibold text-lg text-ink">{t.name}</h3>
              <p className="text-sm text-ink-soft mt-1 mb-4">{t.desc}</p>
              <p className="text-3xl font-semibold text-ink">
                {t.price} <span className="text-sm font-normal text-ink-soft">{t.period}</span>
              </p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="text-sm text-[#3C4A3C] flex items-start gap-2">
                    <Check size={15} className="text-forest-500 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-6 text-center font-medium px-4 py-2.5 rounded-lg transition-colors ${
                  t.highlight ? 'bg-forest-700 text-white hover:bg-forest-900' : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
                }`}
              >
                Choose {t.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-8 border-t border-forest-100 text-sm text-ink-soft flex flex-wrap justify-between gap-3">
        <span>© 2026 GreenComply. All rights reserved.</span>
        <span>Built for MSME exporters in India</span>
      </footer>
    </div>
  )
}
