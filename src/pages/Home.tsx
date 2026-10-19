import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, scroll } from 'motion'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
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
import type { Clip } from '../content'
import { CLIPS } from '../clips'
import { Ask } from '../components/Ask'
import { Arrow, Headline, LocalTime, Reveal, RollWord, Spans } from '../components/Bits'
import { Device, MotionToggle } from '../components/Device'
import { CardStack } from '../components/Stack'
import { attachMagnet, onceInView, pop, settle } from '../lib/fx'
import { copyText, displayUrl, goTo, prefersReducedMotion } from '../lib/utils'
import { ProjectCard, StatusDot } from '../components/Project'

/** Writes the pointer position (-1..1) into motion values. The phones follow it through springs. Off for touch and reduced motion. */
function usePointerDrift(ref: React.RefObject<HTMLElement | null>, mx: MotionValue<number>, my: MotionValue<number>) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)))
      my.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)))
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, mx, my])
}

/** A hero line split into masked words. CSS keyframes play at first paint, so the headline never waits for JavaScript. */
function HeroWords({ text, from }: { text: string; from: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">
            <span style={{ '--k': from + i } as CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

const DRIFT = { stiffness: 90, damping: 16, mass: 0.7 }

/** One phone on its colour field: springs in on load, drifts and tilts with the pointer, parallaxes on scroll. */
function StagePhone({
  slug,
  display,
  bg,
  clip,
  dir,
  mx,
  my,
  progress,
  reduced,
}: {
  slug: string
  display: string
  bg: string
  clip: Clip
  dir: 1 | -1
  mx: MotionValue<number>
  my: MotionValue<number>
  progress: MotionValue<number>
  reduced: boolean
}) {
  const sx = useSpring(mx, DRIFT)
  const sy = useSpring(my, DRIFT)
  const x = useTransform(sx, (v) => v * -10 * dir)
  const y = useTransform(sy, (v) => v * -7 * dir)
  const rotateY = useTransform(sx, (v) => v * 5 * dir)
  const rotateX = useTransform(sy, (v) => v * -4 * dir)
  const lift = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, dir === 1 ? -34 : -72])
  return (
    <motion.figure className="stage" style={{ y: lift }}>
      <a className="stage-field" href={`/work/${slug}`} style={{ background: bg }} aria-label={`${display} case study`}>
        <span className="stage-rise" data-dir={dir}>
          <motion.span className="stage-device" style={{ x, y, rotateX, rotateY, transformPerspective: 900 }}>
            <Device kind="iphone" clip={clip} eager />
          </motion.span>
        </span>
      </a>
    </motion.figure>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const askRef = useRef<HTMLAnchorElement>(null)
  const reduced = !!useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  usePointerDrift(ref, mx, my)

  const finly = PROJECTS.find((p) => p.slug === 'finly')!
  const investolio = PROJECTS.find((p) => p.slug === 'investolio')!
  const stage = [
    { project: finly, clip: CLIPS['finly-voice'] },
    { project: investolio, clip: CLIPS['investolio-demo'] },
  ]

  // The phones spring up out of their colour fields once the page has hydrated.
  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const risers = Array.from(root.querySelectorAll<HTMLElement>('.stage-rise'))
    const runs = risers.map((el, i) => {
      const dir = Number(el.dataset.dir) || 1
      const a = animate(
        el,
        { y: ['88%', '0%'], rotate: [dir * 6, 0] },
        { type: 'spring', stiffness: 105, damping: 17, mass: 1, delay: 0.55 + i * 0.16 },
      )
      a.finished.then(() => settle(el), () => {})
      return a
    })
    return () => runs.forEach((a) => a.stop())
  }, [])

  useEffect(() => {
    const el = askRef.current
    return el ? attachMagnet(el, 0.16) : undefined
  }, [])

  const k = HERO.line[0].split(' ').length

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-h">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 id="hero-h" className="hero-h1">
            <span className="kicker mono hero-fade" style={{ '--t': '60ms' } as CSSProperties}>
              {HERO.kicker}
            </span>
            <span className="hero-line">
              <HeroWords text={HERO.line[0]} from={0} />
            </span>{' '}
            <em className="hero-line hero-em">
              <HeroWords text={HERO.line[1]} from={k} />
            </em>
          </h1>
          <p className="hero-sub hero-fade" style={{ '--t': '980ms' } as CSSProperties}>
            {HERO.sub[0]}
            {HERO.sub[1]}
            <a href="https://tiercel.io">Tiercel</a>.
          </p>
          <p className="hero-cta hero-fade" style={{ '--t': '1120ms' } as CSSProperties}>
            <a
              ref={askRef}
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
          <p className="stage-top mono hero-fade" style={{ '--t': '420ms' } as CSSProperties}>
            <span>
              <span className="dot is-live" aria-hidden="true" /> Currently shipping
            </span>
            <MotionToggle />
          </p>
          <div className="stage-pair">
            {stage.map((s, i) => (
              <StagePhone
                key={s.project.slug}
                slug={s.project.slug}
                display={s.project.display}
                bg={s.project.theme.bg}
                clip={s.clip}
                dir={i === 0 ? 1 : -1}
                mx={mx}
                my={my}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <Reveal as="ul" kind="stagger" delay={120} className="ledger" aria-label="Currently shipping">
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
        </Reveal>
      </div>
    </section>
  )
}

function AskSection() {
  return (
    <section id="ask" className="band ask-sec" aria-labelledby="ask-h">
      <div className="wrap ask-grid">
        <Reveal className="ask-intro">
          <Headline id="ask-h" className="band-h">
            {ASK.heading}
            <span className="amp">.</span>
          </Headline>
          <p className="band-lede">{ASK.lead}</p>
        </Reveal>
        <Reveal className="ask-main" delay={120}>
          <Ask />
        </Reveal>
      </div>
    </section>
  )
}

function WorkSection() {
  const lead = PROJECTS.slice(0, 2)
  const rest = PROJECTS.slice(2)
  return (
    <section id="work" className="sec" aria-labelledby="work-h">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="sec-label mono">Selected work ({String(PROJECTS.length).padStart(2, '0')})</p>
          <Headline id="work-h" className="sec-h">
            Four things I’ve built, and how.
          </Headline>
        </Reveal>
        <CardStack>
          {lead.map((p, i) => (
            <div key={p.slug} className="slot" style={{ '--i': i } as CSSProperties}>
              <Reveal className="card-wrap">
                <ProjectCard project={p} index={i} />
              </Reveal>
            </div>
          ))}
          <div className="slot slot-pair" style={{ '--i': lead.length } as CSSProperties}>
            {rest.map((p, i) => (
              <Reveal key={p.slug} className="card-wrap" delay={i * 90}>
                <ProjectCard project={p} index={lead.length + i} />
              </Reveal>
            ))}
          </div>
        </CardStack>
      </div>
    </section>
  )
}

/**
 * The five layers build up as you scroll: each block slides in from alternating
 * sides on its own stretch of scroll, a rail draws down the left, and a node
 * pops as each layer lands. Scroll-linked, so it reverses when you scroll back.
 */
function Anatomy() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrap = ref.current
    if (!wrap || prefersReducedMotion()) return
    const stops: (() => void)[] = []
    const fill = wrap.querySelector<HTMLElement>('.an-fill')
    if (fill) stops.push(scroll(animate(fill, { scaleY: [0, 1] }, { ease: 'linear' }), { target: wrap, offset: ['start 0.72', 'end 0.6'] }))
    wrap.querySelectorAll<HTMLElement>('.an-row').forEach((row, i) => {
      const side = i % 2 === 0 ? -1 : 1
      stops.push(
        scroll(animate(row, { opacity: [0, 1], x: [side * 96, 0] }, { ease: [0.2, 0.7, 0.2, 1] }), {
          target: row,
          offset: ['start 0.98', 'start 0.68'],
        }),
      )
      const dot = row.querySelector<HTMLElement>('.an-dot')
      if (dot) stops.push(onceInView(row, () => pop(dot), '0px 0px -32% 0px'))
    })
    return () => stops.forEach((stop) => stop())
  }, [])

  return (
    <section className="sec sec-tight" aria-labelledby="anatomy-h">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="sec-label mono">How a product gets built</p>
          <Headline id="anatomy-h" className="sec-h">
            From the first commit to the App Store, <em>one person owns every layer.</em>
          </Headline>
        </Reveal>
        <div ref={ref} className="anatomy-wrap">
          <span className="an-rail" aria-hidden="true">
            <span className="an-fill" />
          </span>
          <ol className="anatomy">
            {ANATOMY.map((step, i) => (
              <li key={step.label} className="an-row">
                <span className="an-dot" aria-hidden="true" />
                <span className="mono an-n">{String(i + 1).padStart(2, '0')}</span>
                <strong>{step.label}</strong>
                <span className="an-what">{step.what}</span>
                <span className="an-tech mono">{step.tech}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  // The rail draws down as you scroll; each role's node pops as the rail reaches it.
  useEffect(() => {
    const wrap = ref.current
    if (!wrap || prefersReducedMotion()) return
    const stops: (() => void)[] = []
    const fill = wrap.querySelector<HTMLElement>('.tl-fill')
    if (fill) stops.push(scroll(animate(fill, { scaleY: [0, 1] }, { ease: 'linear' }), { target: wrap, offset: ['start 0.62', 'end 0.62'] }))
    wrap.querySelectorAll<HTMLElement>('.tl').forEach((row) => {
      const dot = row.querySelector<HTMLElement>('.tl-dot')
      if (dot) stops.push(onceInView(row, () => pop(dot), '0px 0px -38% 0px'))
    })
    return () => stops.forEach((stop) => stop())
  }, [])

  return (
    <section id="experience" className="sec" aria-labelledby="exp-h">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="sec-label mono">Experience</p>
          <Headline id="exp-h" className="sec-h">
            Seven years of shipping for others, then for myself.
          </Headline>
        </Reveal>
        <div ref={ref} className="timeline-wrap">
          <span className="tl-rail" aria-hidden="true">
            <span className="tl-fill" />
          </span>
        <ol className="timeline">
          {TIMELINE.map((t) => (
            <Reveal as="li" key={`${t.org}-${t.from}`} className="tl">
              <span className="tl-dot" aria-hidden="true" />
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
        </div>

        <Reveal as="dl" kind="stagger" className="skills">
          {SKILLS.map((g) => (
            <div key={g.label}>
              <dt className="mono">{g.label}</dt>
              <dd>{g.items.join(', ')}</dd>
            </div>
          ))}
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
          <Headline id="now-h" className="sec-h sec-h-sm">
            Now
          </Headline>
          <Reveal as="ul" kind="stagger" className="now" delay={150}>
            {NOW.map((n) => (
              <li key={n.tag + n.body.length}>
                <span className="now-tag mono">{n.tag}</span>
                <p>
                  <Spans items={n.body} />
                </p>
              </li>
            ))}
          </Reveal>
        </Reveal>

        <Reveal as="section" id="writing" className="col" aria-labelledby="writing-h" delay={80}>
          <p className="sec-label mono">Field notes</p>
          <Headline id="writing-h" className="sec-h sec-h-sm">
            Writing
          </Headline>
          <Reveal as="ul" kind="stagger" className="writing" delay={150}>
            {WRITING.map((w) => (
              <li key={w.slug}>
                <a href={`${SITE.notesBase}/${w.slug}`}>
                  <span className="writing-title">{w.title}</span>
                  <Arrow dir="up-right" />
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
          </Reveal>
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
        <Reveal as="ul" kind="stagger" className="creds">
          {CREDENTIALS.map((c) => (
            <li key={c.label}>
              <span className="mono cred-year">{c.year}</span>
              <strong>{c.label}</strong>
              <span>{c.detail}</span>
              {c.badge ? <span className="medal mono">{c.badge}</span> : null}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/** The copy control rolls to "Copied" with a check that draws itself, then rolls back. */
function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  async function onClick() {
    if (!(await copyText(text, 'Email copied', { silent: true }))) return
    setDone(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 1900)
  }
  return (
    <>
      <button type="button" className={`link-btn copy-btn${done ? ' is-done' : ''}`} onClick={() => void onClick()}>
        {done ? (
          <svg className="copy-check" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
            <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" pathLength="1" />
          </svg>
        ) : null}
        <RollWord text={done ? 'Copied' : 'Copy'} />
      </button>
      <span className="sr-only" role="status">
        {done ? 'Email copied' : ''}
      </span>
    </>
  )
}

function Contact() {
  return (
    <section id="contact" className="band contact" aria-labelledby="contact-h">
      <div className="wrap">
        <Reveal>
          <p className="sec-label mono">Contact</p>
          <Headline id="contact-h" className="contact-h">
            Building something?{' '}
            <a className="contact-link" href={PARTNER.cta.href}>
              <em>Partner with Tiercel</em> <Arrow />
            </a>
          </Headline>
          <p className="band-lede">{PARTNER.lead}</p>
        </Reveal>

        <Reveal as="ul" kind="stagger" className="shapes">
          {PARTNER.shapes.map((s) => (
            <li key={s.title}>
              <strong>{s.title}</strong>
              <span>{s.body}</span>
            </li>
          ))}
        </Reveal>

        <Reveal className="contact-row" kind="stagger">
          <div>
            <p className="mono label">Email</p>
            <p className="email-row">
              <a className="email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <CopyButton text={PROFILE.email} />
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
