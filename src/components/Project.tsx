import { useEffect, useRef, type CSSProperties } from 'react'
import { animate, stagger } from 'motion'
import type { Project } from '../content'
import { CLIPS } from '../clips'
import { Arrow, CountUp } from './Bits'
import { onceInView, settle } from '../lib/fx'
import { prefersReducedMotion } from '../lib/utils'
import { themeVars } from '../lib/project'
import { Device } from './Device'

export function StatusDot({ live }: { live: boolean }) {
  return <span className={`dot${live ? ' is-live' : ''}`} aria-hidden="true" />
}

export function DeviceStack({ project, eager = false }: { project: Project; eager?: boolean }) {
  return (
    <div className={`device-stack n-${project.devices.length}`}>
      {project.devices.map((d, i) => (
        <figure key={d.clip} className="dev" style={{ '--i': i } as CSSProperties}>
          <div className="dev-in">
            <Device kind={d.kind} clip={CLIPS[d.clip]} eager={eager} />
          </div>
        </figure>
      ))}
    </div>
  )
}

/** A case-study card on the home page. Product cards carry real device recordings; the rest are typographic. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasDevices = project.devices.length > 0
  const flip = hasDevices && project.slug !== 'finly'
  const highlights = project.built.slice(0, 3)
  const ref = useRef<HTMLElement>(null)

  // The phones spring up into place the first time the card comes into view.
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const devs = Array.from(el.querySelectorAll<HTMLElement>('.card-media .dev'))
    if (!devs.length) return
    return onceInView(
      el,
      () => {
        animate(
          devs,
          { y: [56, 0], rotate: [3.5, 0], opacity: [0, 1] },
          { type: 'spring', stiffness: 130, damping: 19, mass: 1, delay: stagger(0.12, { startDelay: 0.18 }) },
        ).finished.then(() => settle(devs))
      },
      '0px 0px -22% 0px',
    )
  }, [])

  return (
    <article
      ref={ref}
      className={`card ${hasDevices ? 'card-dev' : 'card-type'}${flip ? ' is-flip' : ''} card-${project.slug}`}
      style={themeVars(project)}
    >
      <div className="card-text">
        <p className="card-meta mono">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.period}</span>
          <span className="card-status">
            <StatusDot live={project.status.live} />
            {project.status.label}
          </span>
        </p>
        <h3 className="card-title">
          <a className="card-link" href={`/work/${project.slug}`}>
            {project.display}
          </a>
        </h3>
        <p className="card-tag">{project.tagline}</p>
        {highlights.length ? (
          <ul className="card-bullets">
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : null}
        {project.outcomes.length ? (
          <dl className="card-outcomes">
            {project.outcomes.map((o) => (
              <div key={o.label}>
                <dt>
                  <CountUp value={o.figure} />
                </dt>
                <dd>{o.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="card-stack mono">{project.stack.slice(0, 6).join(' · ')}</p>
        <p className="card-actions">
          <span className="card-more">
            Read the case study <Arrow />
          </span>
          <a className="card-ext" href={project.href}>
            {project.hrefLabel} <Arrow dir="up-right" />
          </a>
        </p>
      </div>
      {hasDevices ? (
        <div className="card-media">
          <DeviceStack project={project} />
        </div>
      ) : null}
      <span className="card-dim" aria-hidden="true" />
    </article>
  )
}
