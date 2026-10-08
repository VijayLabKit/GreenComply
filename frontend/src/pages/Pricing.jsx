import { Link } from 'react-router-dom'
import { Leaf, Check, ArrowRight, HelpCircle } from 'lucide-react'

const tiers = [
  {
    name: 'Starter',
    price: '₹6,999',
    period: '/month',
    desc: 'For a single unit getting BRSR-ready for the first time.',
    features: ['1 facility', 'BRSR report generator', 'Manual data entry', 'Email support', 'Compliance vault (5 docs)'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹16,999',
    period: '/month',
    desc: 'For manufacturers tracking emissions across multiple units.',
    features: ['Up to 5 facilities', 'BRSR + Emissions Tracker', 'CSV bulk uploads', 'Supplier scoring', 'Priority support', 'Compliance vault (50 docs)'],
    cta: 'Most popular',
    highlight: true,
  },
  {
    name: 'Export-Ready',
    price: '₹34,999',
    period: '/month',
    desc: 'For exporters who need CBAM declarations alongside BRSR.',
    features: ['Unlimited facilities', 'BRSR + CBAM full suite', 'XML/CSV declaration export', 'Compliance vault (unlimited)', 'Dedicated advisor', 'API access'],
    cta: 'Contact sales',
    highlight: false,
  },
]

const faqs = [
  {
    q: 'What is BRSR and who needs to file it?',
    a: 'BRSR (Business Responsibility and Sustainability Reporting) is mandated by SEBI for listed companies and increasingly required from their top 250 suppliers. MSMEs supplying to listed companies often need to comply.',
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
    q: 'Can I try the product without a subscription?',
    a: 'Yes. The demo mode runs against a fully populated steel manufacturer dataset (Himalayan Steel Works). No credit card, no configuration required — just sign up and explore.',
  },
  {
    q: 'Is my data secure?',
    a: 'All data is stored in Supabase Postgres with row-level security. Reports and evidence are stored in encrypted Supabase Storage. We never share your data with third parties.',
  },
]

function PublicNav() {
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
          <Link to="/#how" className="hover:text-ink transition-colors">How it works</Link>
          <Link to="/pricing" className="text-forest-500">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-ink transition-colors hidden sm:block">Log in</Link>
          <Link to="/signup" className="flex items-center gap-1.5 bg-forest-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-forest-400 transition-all shadow-lg shadow-forest-500/25">
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Pricing() {
  return (
    <div style={{ background: '#080F09', minHeight: '100vh' }}>
      <PublicNav />

      {/* Header */}
      <section className="pt-36 pb-16 px-6 lg:px-10 max-w-7xl mx-auto text-center animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.25)', color: '#81C784' }}>
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-ink mb-4">
          Pricing that scales with your exports
        </h1>
        <p className="text-ink-soft text-lg max-w-xl mx-auto">
          Monthly plans, cancel anytime. Start with the demo — no credit card required.
        </p>
      </section>

      {/* Tiers */}
      <section className="px-6 lg:px-10 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className="animate-rise flex flex-col"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="flex-1 rounded-2xl p-7 flex flex-col"
                style={
                  t.highlight
                    ? { background: 'linear-gradient(160deg,#1A3320,#0F2014)', border: '1px solid rgba(76,175,80,0.35)', boxShadow: '0 8px 40px rgba(76,175,80,0.15)' }
                    : { background: '#0F1E11', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {t.highlight && (
                  <span className="self-start text-xs font-semibold text-white bg-forest-500 rounded-full px-3 py-1 mb-4">
                    Most popular
                  </span>
                )}
                <h2 className="text-xl font-semibold text-ink">{t.name}</h2>
                <p className="text-sm text-ink-soft mt-1 mb-5">{t.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-ink">{t.price}</span>
                  <span className="text-ink-soft text-sm ml-1">{t.period}</span>
                </div>
                <ul className="space-y-3 flex-1 mb-7">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <Check size={15} className="text-forest-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`text-center font-semibold px-4 py-3 rounded-xl transition-all ${
                    t.highlight
                      ? 'bg-forest-500 text-white hover:bg-forest-400 shadow-lg shadow-forest-500/25'
                      : 'text-ink hover:text-forest-500 transition-colors'
                  }`}
                  style={!t.highlight ? { border: '1px solid rgba(255,255,255,0.12)' } : {}}
                >
                  {t.cta === 'Most popular' ? 'Choose Growth' : `Choose ${t.name}`}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ink-soft mt-8">
          All plans include: Supabase-backed storage · Row-level security · API access · 30-day data retention
        </p>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 lg:px-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
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

      {/* Footer */}
      <footer className="px-6 lg:px-10 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-forest-500" />
            <span>© 2026 GreenComply. All rights reserved.</span>
          </div>
          <span>Built for MSME exporters in India</span>
        </div>
      </footer>
    </div>
  )
}
