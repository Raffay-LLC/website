import { useEffect, useRef, type CSSProperties } from 'react'
import {
  ANATOMY,
  CREDENTIALS,
  HERO,
  LINKS,
  NOW,
  ASK,
  PARTNER,
  PROFILE,
  PROJECTS,
  SHIPPING,
  SITE,
  SKILLS,
  TIMELINE,
  WRITING,
} from '../content'
import { CLIPS } from '../clips'
import { Ask } from '../components/Ask'
import { Arrow, LocalTime, Reveal, Spans } from '../components/Bits'
import { Device, MotionToggle } from '../components/Device'
import { copyText, displayUrl, goTo, prefersReducedMotion } from '../lib/utils'
import { ProjectCard, StatusDot } from '../components/Project'

/** Writes the pointer position to CSS variables so the hero devices can drift. Transform only; off for touch and reduced motion. */
function usePointerDrift(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let x = 0
    let y = 0
    const apply = () => {
      raf = 0
      el.style.setProperty('--mx', x.toFixed(3))
      el.style.setProperty('--my', y.toFixed(3))
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      if (!raf) raf = requestAnimationFrame(apply)
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  usePointerDrift(ref)
  const finly = PROJECTS.find((p) => p.slug === 'finly')!
  const investolio = PROJECTS.find((p) => p.slug === 'investolio')!
  const stage = [
    { project: finly, kind: 'iphone' as const, clip: CLIPS['finly-voice'] },
    { project: investolio, kind: 'iphone' as const, clip: CLIPS['investolio-demo'] },
  ]

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-h">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 id="hero-h" className="hero-h1">
            <span className="kicker mono">{HERO.kicker}</span>
            <span className="hero-line">{HERO.line[0]}</span>{' '}
            <em className="hero-line hero-em">{HERO.line[1]}</em>
          </h1>
          <p className="hero-sub">
            {HERO.sub[0]}
            {HERO.sub[1]}
            <a href="https://tiercel.io">Tiercel</a>.
          </p>
          <p className="hero-cta">
            <a
              className="askbar"
              href="#ask"
              onClick={(e) => {
                e.preventDefault()
                goTo('ask', '/', 'ask-input')
              }}
            >
              <span className="askbar-prompt" aria-hidden="true">
                &gt;
              </span>
              <span>Ask about my work</span>
              <kbd className="kbd" aria-hidden="true">
                /
              </kbd>
            </a>
            <a className="btn-link" href="#work">
              See what I’ve shipped <Arrow dir="down" />
            </a>
            <a className="btn-link" href={`mailto:${PROFILE.email}`}>
              Email me
            </a>
          </p>
        </div>

        <div className="hero-stage" role="group" aria-label="Currently shipping: Finly and Investolio running on iPhone">
          <p className="stage-top mono">
            <span>
              <span className="dot is-live" aria-hidden="true" /> Currently shipping
            </span>
            <MotionToggle />
          </p>
          <div className="stage-pair">
            {stage.map((s, i) => (
              <figure key={s.project.slug} className="stage" style={{ '--i': i } as CSSProperties}>
                <a className="stage-field" href={`/work/${s.project.slug}`} style={{ background: s.project.theme.bg }} aria-label={`${s.project.display} case study`}>
                  <span className="stage-device">
                    <Device kind={s.kind} clip={s.clip} eager />
                  </span>
                </a>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <ul className="ledger" aria-label="Currently shipping">
          {SHIPPING.map((row) => (
            <li key={row.slug}>
              <a href={`/work/${row.slug}`}>
                <span className="ledger-top mono">
                  <StatusDot live={row.state === 'live'} />
                  {row.status}
                </span>
                <strong>{row.name}</strong>
                <span className="ledger-line">{row.line}</span>
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function AskSection() {
  return (
    <section id="ask" className="band ask-sec" aria-labelledby="ask-h">
      <div className="wrap ask-grid">
        <Reveal className="ask-intro">
          <h2 id="ask-h" className="band-h">
            {ASK.heading}
            <span className="amp">.</span>
          </h2>
          <p className="band-lede">{ASK.lead}</p>
        </Reveal>
        <Reveal className="ask-main" delay={80}>
          <Ask />
        </Reveal>
      </div>
    </section>
  )
}

function WorkSection() {
  return (
    <section id="work" className="sec" aria-labelledby="work-h">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="sec-label mono">Selected work ({String(PROJECTS.length).padStart(2, '0')})</p>
          <h2 id="work-h" className="sec-h">
            Four things I’ve built, and how.
          </h2>
        </Reveal>
        <div className="cards">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} className="card-wrap">
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Anatomy() {
  return (
    <section className="sec sec-tight" aria-labelledby="anatomy-h">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="sec-label mono">How a product gets built</p>
          <h2 id="anatomy-h" className="sec-h">
            From the first commit to the App Store, <em>one person owns every layer.</em>
          </h2>
        </Reveal>
        <Reveal>
          <ol className="anatomy">
            {ANATOMY.map((step, i) => (
              <li key={step.label}>
                <span className="mono an-n">{String(i + 1).padStart(2, '0')}</span>
                <strong>{step.label}</strong>
                <span className="an-what">{step.what}</span>
                <span className="an-tech mono">{step.tech}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="sec" aria-labelledby="exp-h">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="sec-label mono">Experience</p>
          <h2 id="exp-h" className="sec-h">
            Seven years of shipping for others, then for myself.
          </h2>
        </Reveal>
        <ol className="timeline">
          {TIMELINE.map((t) => (
            <Reveal as="li" key={`${t.org}-${t.from}`} className="tl">
              <p className="tl-when mono">
                <time dateTime={t.from}>{t.period.split('–')[0]}</time>
                {'–'}
                {t.to ? <time dateTime={t.to}>{t.period.split('–')[1]}</time> : <span>{t.period.split('–')[1]}</span>}
              </p>
              <div className="tl-who">
                <h3>
                  {t.org}
                </h3>
                <p>{t.role}</p>
                <p className="tl-place mono">{t.place}</p>
              </div>
              <div className="tl-what">
                <p>{t.impact}</p>
                {t.stack.length ? (
                  <ul className="tags tags-sm">
                    {t.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="tl-links mono">
                  {t.projectSlug ? (
                    <a href={`/work/${t.projectSlug}`}>
                      Case study <Arrow />
                    </a>
                  ) : null}
                  {t.orgHref ? (
                    <a href={t.orgHref}>
                      {displayUrl(t.orgHref)} <Arrow dir="up-right" />
                    </a>
                  ) : null}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <dl className="skills">
            {SKILLS.map((g) => (
              <div key={g.label}>
                <dt className="mono">{g.label}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

function NowAndWriting() {
  return (
    <section className="sec" aria-label="Now and writing">
      <div className="wrap two-col">
        <Reveal as="section" id="now" className="col" aria-labelledby="now-h">
          <p className="sec-label mono">
            <time dateTime={PROFILE.updatedIso}>{PROFILE.updated}</time>
          </p>
          <h2 id="now-h" className="sec-h sec-h-sm">
            Now
          </h2>
          <ul className="now">
            {NOW.map((n) => (
              <li key={n.tag + n.body.length}>
                <span className="now-tag mono">{n.tag}</span>
                <p>
                  <Spans items={n.body} />
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" id="writing" className="col" aria-labelledby="writing-h" delay={80}>
          <p className="sec-label mono">Field notes</p>
          <h2 id="writing-h" className="sec-h sec-h-sm">
            Writing
          </h2>
          <ul className="writing">
            {WRITING.map((w) => (
              <li key={w.slug}>
                <a href={`${SITE.notesBase}/${w.slug}`}>
                  <span>{w.title}</span>
                  <time className="mono" dateTime={w.date}>
                    {new Date(w.date + 'T00:00:00Z').toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </time>
                </a>
              </li>
            ))}
          </ul>
          <p className="more mono">
            <a href={SITE.notesBase}>
              All notes on the Tiercel journal <Arrow />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Credentials() {
  return (
    <section className="sec sec-tight" aria-labelledby="cred-h">
      <div className="wrap">
        <h2 id="cred-h" hidden>
          Education and credentials
        </h2>
        <ul className="creds">
          {CREDENTIALS.map((c) => (
            <Reveal as="li" key={c.label}>
              <span className="mono cred-year">{c.year}</span>
              <strong>{c.label}</strong>
              <span>{c.detail}</span>
              {c.badge ? <span className="medal mono">{c.badge}</span> : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="band contact" aria-labelledby="contact-h">
      <div className="wrap">
        <Reveal>
          <p className="sec-label mono">Contact</p>
          <h2 id="contact-h" className="contact-h">
            Building something?{' '}
            <a className="contact-link" href={PARTNER.cta.href}>
              <em>Partner with Tiercel</em> <Arrow />
            </a>
          </h2>
          <p className="band-lede">{PARTNER.lead}</p>
        </Reveal>

        <Reveal>
          <ul className="shapes">
            {PARTNER.shapes.map((s) => (
              <li key={s.title}>
                <strong>{s.title}</strong>
                <span>{s.body}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="contact-row">
          <div>
            <p className="mono label">Email</p>
            <p className="email-row">
              <a className="email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <button type="button" className="link-btn" onClick={() => void copyText(PROFILE.email, 'Email copied')}>
                Copy
              </button>
            </p>
          </div>
          <div>
            <p className="mono label">Elsewhere</p>
            <ul className="socials">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>
                    {l.label} <Arrow dir="up-right" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono label">Right now</p>
            <p className="clock-long">
              <LocalTime timeZone={PROFILE.timeZone} city="Lahore" fallback={PROFILE.location} />
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <AskSection />
      <WorkSection />
      <Anatomy />
      <Experience />
      <NowAndWriting />
      <Credentials />
      <Contact />
    </main>
  )
}
