import { useState, useEffect, useRef } from 'react'
import {
  ArrowUpRight,
  Smartphone,
  Layers,
  BrainCircuit,
  Users,
  ShieldCheck,
  GitBranch,
  TrendingUp,
  Globe,
  Lock,
  BarChart3,
  Mic,
  Camera,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Star,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'We build iOS and Android apps from scratch — design, development, App Store launch, and everything in between.',
  },
  {
    icon: Layers,
    title: 'Backend & System Architecture',
    description: 'Reliable APIs, databases, and cloud infrastructure that grow with your business without breaking under pressure.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Integration',
    description: 'We add AI features that actually work — smart automation, personalized recommendations, and data-driven insights.',
  },
  {
    icon: Users,
    title: 'Tech Leadership',
    description: 'Need a senior engineer to guide your team or make key technical decisions? We step in without the full-time cost.',
  },
  {
    icon: GitBranch,
    title: 'Cloud & DevOps',
    description: 'AWS deployments, automated pipelines, monitoring and security — your infrastructure running the way it should.',
  },
  {
    icon: ShieldCheck,
    title: 'Security & Compliance',
    description: 'Security audits and compliance preparation for companies handling sensitive financial or personal data.',
  },
]

const FINLY_FEATURES = [
  {
    icon: TrendingUp,
    title: 'See your full net worth',
    body: 'All your bank accounts, investments, and assets in one place — always up to date.',
  },
  {
    icon: Mic,
    title: 'Add expenses by voice',
    body: 'Just say "Lunch $20 and Taxi $15 yesterday" — Finly logs it in under 3 seconds.',
  },
  {
    icon: Camera,
    title: 'Scan receipts instantly',
    body: "Snap a photo and Finly's AI extracts every detail automatically. No manual typing.",
  },
  {
    icon: Lock,
    title: 'No bank password. Ever.',
    body: 'Unlike Mint or Rocket Money, Finly never asks for your bank login. Your data stays yours.',
  },
  {
    icon: Globe,
    title: 'Multi-currency support',
    body: 'Track PKR, USD, AED, GBP and 30+ currencies with live exchange rates built in.',
  },
  {
    icon: BarChart3,
    title: 'AI-powered insights',
    body: 'Spot spending leaks, understand patterns, and get personalized suggestions — automatically.',
  },
]

// ─── Smooth scroll helper ─────────────────────────────────────────────────────

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── Products Dropdown ────────────────────────────────────────────────────────

function ProductsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        Products
        <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
          {/* Arrow */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />

          <a
            href="https://heyfinly.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors group"
          >
            {/* Finly icon */}
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-base">F</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-semibold text-gray-900 text-sm">Finly AI</p>
                <ArrowUpRight size={12} strokeWidth={2} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Private expense tracker &amp; AI personal finance app. No bank passwords. 4.6 ★ on the App Store.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">iOS &amp; Android</span>
                <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free to try</span>
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="bg-white text-gray-800 antialiased">

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 bg-white transition-all duration-200 ${scrolled ? 'shadow-sm border-b border-gray-100' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-gray-900">Raffay LLC</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <button onClick={() => scrollTo('services')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
              Services
            </button>
            <ProductsDropdown />
            <button onClick={() => scrollTo('about')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
              About
            </button>
            <button onClick={() => scrollTo('contact')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://heyfinly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              Try Finly
              <ArrowUpRight size={13} strokeWidth={2} />
            </a>
            <button
              onClick={() => scrollTo('contact')}
              className="hidden md:inline-flex bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Work with us
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-500"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 space-y-4">
            {[
              { label: 'Services', id: 'services' },
              { label: 'Finly AI', id: 'finly' },
              { label: 'About', id: 'about' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => { scrollTo(id); setMenuOpen(false) }}
                className="block w-full text-left text-sm text-gray-700 font-medium py-1"
              >
                {label}
              </button>
            ))}
            <a
              href="https://heyfinly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-indigo-600 font-semibold"
            >
              Try Finly AI <ArrowUpRight size={13} strokeWidth={2} />
            </a>
          </div>
        )}
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="max-w-3xl">
            {/* <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              Now taking on new projects
            </span> */}

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
              We build great<br />
              software for<br />
              <span className="text-indigo-600">businesses worldwide.</span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-xl mb-10">
              Raffay LLC is a US-based software company. We build mobile apps, web platforms,
              and AI-powered products — and we ship our own products too.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Start a project
                <ArrowUpRight size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollTo('services')}
                className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-300 transition-colors"
              >
                See our services
              </button>
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <section className="border-y border-gray-100 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { n: '3+', label: 'Years in business' },
                { n: '25+', label: 'Happy clients' },
                { n: '3', label: 'Continents served' },
                { n: '1,500+', label: 'Finly AI installs' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{n}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────────── */}
        <section id="services" className="below-fold max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">What we do</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From mobile apps to AI products, we handle the full build — design, development, and delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-7 border border-gray-100 rounded-2xl hover:shadow-md hover:border-gray-200 transition-[box-shadow,border-color] duration-200">
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={1.75} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Finly AI Product Showcase ─────────────────────────────────────── */}
        <section id="finly" className="below-fold bg-indigo-600 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-24">

            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">
              <div>
                <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 shrink-0" />
                  Live on iOS &amp; Android
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
                  Meet Finly AI — the finance app that respects your privacy.
                </h2>
                <p className="text-indigo-100 text-lg leading-relaxed mb-3">
                  Most finance apps need your bank password. Finly never does. Track every expense by voice or receipt scan, see your full financial picture in real time, and let AI surface insights — all without handing over your data.
                </p>
                <p className="text-indigo-200 text-sm mb-8">
                  Built and owned by Raffay LLC · Available free on App Store &amp; Google Play
                </p>

                {/* Ratings row */}
                <div className="flex flex-wrap items-center gap-5 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-300 fill-yellow-300" />
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm">4.6</span>
                    <span className="text-indigo-200 text-xs">App Store rating</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-indigo-100 text-sm">1,500+ installs</span>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-indigo-100 text-sm">Zero data tracking</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://heyfinly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    Get Finly for free
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </a>
                  <a
                    href="https://heyfinly.com/#pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:border-white/60 transition-colors text-sm"
                  >
                    See pricing
                  </a>
                </div>
              </div>

              {/* Pricing card */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Finly Pro</p>
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Launch deal</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-bold text-gray-900">$2.49</span>
                  <span className="text-gray-400 text-sm mb-2">/month</span>
                </div>
                <p className="text-xs text-gray-400 mb-6">Billed $29.99/year · Was $119.99 · Save 75%</p>

                <ul className="space-y-3 mb-7">
                  {[
                    'Unlimited voice expense entry',
                    'Unlimited AI receipt scanning',
                    'AI-powered spending insights',
                    'Multi-currency support',
                    'Cloud backup & CSV export',
                    'Priority support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle size={15} strokeWidth={2} className="text-indigo-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://heyfinly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
                >
                  Start free trial
                </a>
                <p className="text-center text-xs text-gray-400 mt-3">Cancel anytime · No questions asked</p>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FINLY_FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={18} strokeWidth={1.75} className="text-white" />
                  </div>
                  <p className="font-bold text-white mb-1.5">{title}</p>
                  <p className="text-indigo-100 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* Compare callout */}
            <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-white text-sm">
                <span className="font-semibold">Switching from Mint, YNAB, or Rocket Money?</span>
                <span className="text-indigo-200"> Finly doesn't sell your data or require bank linking.</span>
              </p>
              <a
                href="https://heyfinly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white font-semibold text-sm border border-white/40 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                See comparisons <ArrowUpRight size={13} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        {/* ── About ────────────────────────────────────────────────────────── */}
        <section id="about" className="below-fold max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 tracking-tight">Who we are</h2>
              <p className="text-gray-500 leading-relaxed text-lg mb-5">
                We're a small, senior team. You don't get passed off to a junior developer after
                the first call — you work directly with the people who will actually build your product.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Raffay LLC is registered in Wyoming, United States. Our engineering team
                is based in Lahore, Pakistan. We've been building software for clients in the US,
                UK, UAE, and beyond for over 7 years.
              </p>
              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
              >
                Get in touch
                <ArrowUpRight size={15} strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Senior engineers only', desc: "Every project is handled by someone with 7+ years of experience. No juniors." },
                { title: 'Fixed pricing, no surprises', desc: "We agree on scope and price up front. What we quote is what you pay." },
                { title: 'You own everything', desc: "All code and IP transfers to you on delivery. No strings attached." },
                { title: 'US-registered business', desc: "All contracts under US law. W-9 and EIN available on request." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                  <CheckCircle size={20} strokeWidth={1.75} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial ──────────────────────────────────────────────────── */}
        <section className="below-fold bg-gray-50 border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl font-semibold text-gray-900 leading-snug mb-6">
              "They delivered exactly what was scoped, on time and on budget. The code quality
              was exceptional and the team communicated clearly throughout."
            </blockquote>
            <p className="text-gray-500 text-sm font-medium">— Director of Engineering, FinTech startup (US)</p>
          </div>
        </section>

        {/* ── Tech ─────────────────────────────────────────────────────────── */}
        <section className="below-fold max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Technologies we work with</h2>
            <p className="text-gray-400 text-sm">Modern tools, proven in production</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['React Native', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'AWS', 'PostgreSQL', 'OpenAI', 'Terraform', 'Docker', 'GitHub Actions', 'Expo', 'Tailwind CSS', 'Go'].map((tech) => (
              <span key={tech} className="text-sm text-gray-600 border border-gray-200 px-4 py-1.5 rounded-full bg-white hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        <section id="contact" className="below-fold bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Let's build something.</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Tell us what you're working on. We'll respond within one business day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              {[
                { icon: Mail, label: 'Email', value: 'contact@raffaysajjad.com', href: 'mailto:contact@raffaysajjad.com' },
                { icon: Phone, label: 'Phone', value: '+1 (323) 739-1571', href: 'tel:+13237391571' },
                { icon: MapPin, label: 'Address', value: '30 N Gould St, Sheridan WY 82801', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <Icon size={20} strokeWidth={1.75} className="text-indigo-400 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-white font-medium hover:text-indigo-300 transition-colors break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-white font-medium leading-relaxed">{value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="mailto:contact@raffaysajjad.com"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-4 rounded-xl transition-colors text-base"
              >
                Send us a message
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Raffay LLC</p>
                <p className="text-xs text-gray-500">30 N Gould St, Sheridan WY 82801, USA</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-gray-500">
              <button onClick={() => scrollTo('services')} className="hover:text-gray-300 transition-colors">Services</button>
              <button onClick={() => scrollTo('finly')} className="hover:text-gray-300 transition-colors">Finly AI</button>
              <button onClick={() => scrollTo('about')} className="hover:text-gray-300 transition-colors">About</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-gray-300 transition-colors">Contact</button>
              <a href="https://heyfinly.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors flex items-center gap-1">
                heyfinly.com <ArrowUpRight size={10} />
              </a>
            </div>

            <p className="text-xs text-gray-600">© {new Date().getFullYear()} Raffay LLC. All rights reserved.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-600 leading-relaxed">
              Raffay LLC is a US limited liability company registered in Wyoming. EIN available on request.
              Finly AI is a product of Raffay LLC. Finly: Private Expense Tracker™ is a registered trademark.
              Nothing on this site is financial or legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
