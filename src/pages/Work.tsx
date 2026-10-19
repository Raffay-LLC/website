import { PARTNER, PROFILE, SITE, WRITING, type Project } from '../content'
import { Arrow, Reveal } from '../components/Bits'
import { DeviceStack, StatusDot } from '../components/Project'
import { nextProject, themeVars } from '../lib/project'
import { MotionToggle } from '../components/Device'

export default function Work({ project }: { project: Project }) {
  const next = nextProject(project.slug)
  const notes = project.notes
    .map((slug) => WRITING.find((w) => w.slug === slug))
    .filter((w): w is NonNullable<typeof w> => !!w)
  const hasDevices = project.devices.length > 0

  return (
    <main id="main" className="case">
      <header className="case-head" style={themeVars(project)}>
        <div className="wrap case-head-in">
          <div className="case-head-text">
            <p className="crumbs mono">
              <a href="/#work">
                <Arrow dir="left" /> All work
              </a>
            </p>
            <p className="kicker mono">
              Case study · {project.kind === 'employer' ? 'Employer' : 'Product'} · {project.period}
            </p>
            <h1 className="case-title">{project.name}</h1>
            <p className="case-tag">{project.tagline}</p>
            <dl className="case-meta">
              <div>
                <dt className="mono">Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt className="mono">Platforms</dt>
                <dd>{project.platforms}</dd>
              </div>
              <div>
                <dt className="mono">Status</dt>
                <dd>
                  <StatusDot live={project.status.live} />
                  {project.status.label}
                </dd>
              </div>
            </dl>
            <p>
              <a className="btn btn-card" href={project.href}>
                {project.hrefLabel} <Arrow dir="up-right" />
              </a>
            </p>
          </div>
          {hasDevices ? (
            <div className="case-media">
              <DeviceStack project={project} eager />
              <MotionToggle />
            </div>
          ) : (
            <dl className="case-stats">
              {project.outcomes.map((o) => (
                <div key={o.label}>
                  <dt>{o.figure}</dt>
                  <dd>{o.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <div className="wrap case-body">
        <Reveal as="section" className="case-sec" aria-labelledby="problem-h">
          <h2 id="problem-h" className="sec-label mono">
            The problem
          </h2>
          <div className="case-prose">
            {project.problem.map((t) => (
              <p key={t} className="lede">
                {t}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="case-sec" aria-labelledby="built-h">
          <h2 id="built-h" className="sec-label mono">
            {project.kind === 'employer' ? 'What I did' : 'What I built'}
          </h2>
          <ul className="built">
            {project.built.map((b, i) => (
              <li key={b}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <p>{b}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="case-sec" aria-labelledby="stack-h">
          <h2 id="stack-h" className="sec-label mono">
            Stack
          </h2>
          <ul className="tags">
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Reveal>

        {hasDevices ? (
          <Reveal as="section" className="case-sec" aria-labelledby="out-h">
            <h2 id="out-h" className="sec-label mono">
              Outcomes
            </h2>
            <dl className="outcomes">
              {project.outcomes.map((o) => (
                <div key={o.label}>
                  <dt>{o.figure}</dt>
                  <dd>{o.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {notes.length ? (
          <Reveal as="section" className="case-sec" aria-labelledby="notes-h">
            <h2 id="notes-h" className="sec-label mono">
              Field notes from this code
            </h2>
            <ul className="notes-list">
              {notes.map((n) => (
                <li key={n.slug}>
                  <a href={`${SITE.notesBase}/${n.slug}`}>
                    {n.title} <Arrow dir="up-right" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <Reveal as="section" className="case-sec case-next" aria-labelledby="next-h">
          <h2 id="next-h" className="sec-label mono">
            Next
          </h2>
          <a className="next-link" href={`/work/${next.slug}`} style={themeVars(next)}>
            <span className="mono">{next.period}</span>
            <strong>{next.display}</strong>
            <span>{next.tagline}</span>
            <Arrow />
          </a>
          <p className="case-cta">
            Building something?{' '}
            <a href={PARTNER.cta.href}>
              {PARTNER.cta.text} <Arrow />
            </a>{' '}
            or email <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
          </p>
        </Reveal>
      </div>
    </main>
  )
}
