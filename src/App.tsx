import {
  LINKS,
  NOTES_BASE_URL,
  NOW,
  PROFILE,
  WORK,
  WRITING,
  isTodo,
  type Span,
} from './content'

function Todo({
  children,
  compact = false,
}: {
  children: string
  compact?: boolean
}) {
  return (
    <span className="todo" title="Placeholder: fill this in in src/content.ts">
      {compact ? null : <span className="todo-flag">placeholder</span>}
      {compact ? '' : ' '}TODO(raffay)
      {children ? `: ${children}` : ''}
    </span>
  )
}

function Spans({ items }: { items: Span[] }) {
  return (
    <>
      {items.map((item, i) => {
        if (typeof item === 'string') return item
        if ('todo' in item) return <Todo key={i}>{item.todo}</Todo>
        return (
          <a key={i} href={item.href}>
            {item.text}
          </a>
        )
      })}
    </>
  )
}

function Period({ value }: { value: string }) {
  if (!isTodo(value)) return <>{value}</>
  const rest = value.replace('TODO(raffay)', '').trim()
  return (
    <>
      <Todo compact>{''}</Todo>
      {rest ? ` ${rest}` : ''}
    </>
  )
}

function displayUrl(href: string) {
  return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="page">
        <header className="bar">
          <h1 className="name">{PROFILE.name}</h1>
          <nav aria-label="Sections">
            <ul className="nav">
              <li>
                <a href="#now">Now</a>
              </li>
              <li>
                <a href="#work">Work</a>
              </li>
              <li>
                <a href="#writing">Writing</a>
              </li>
            </ul>
          </nav>
        </header>

        <main id="main">
          <section className="row intro" aria-label="Introduction">
            <div className="margin">
              <img
                className="photo"
                src={PROFILE.photo}
                alt={PROFILE.photoAlt}
                width={320}
                height={320}
              />
              <p className="mono meta">{PROFILE.location}</p>
            </div>
            <div className="body">
              {PROFILE.intro.map((paragraph, i) => (
                <p key={i}>
                  <Spans items={paragraph} />
                </p>
              ))}
            </div>
          </section>

          <section id="now" aria-labelledby="now-h">
            <div className="row head">
              <p className="margin mono meta">
                Updated{' '}
                <time dateTime={PROFILE.updatedIso}>{PROFILE.updated}</time>
              </p>
              <h2 id="now-h" className="body">
                Now
              </h2>
            </div>
            <ol className="log">
              {NOW.map((entry, i) => (
                <li key={i} className="row">
                  <p className="margin mono meta">
                    <time dateTime={entry.iso}>{entry.date}</time>
                    <span className="tag">{entry.tag}</span>
                  </p>
                  <p className="body">
                    <Spans items={entry.body} />
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="work" aria-labelledby="work-h">
            <div className="row head">
              <span className="margin" aria-hidden="true" />
              <h2 id="work-h" className="body">
                Work
              </h2>
            </div>
            <ul className="log">
              {WORK.map((item) => (
                <li key={item.name} className="row">
                  <p className="margin mono meta">
                    <span className="tag">{item.label}</span>
                    <span>
                      <Period value={item.period} />
                    </span>
                  </p>
                  <p className="body">
                    <a href={item.href}>{item.name}</a>
                    <br />
                    <span className="sub">{item.body}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="writing" aria-labelledby="writing-h">
            <div className="row head">
              <span className="margin" aria-hidden="true" />
              <h2 id="writing-h" className="body">
                Writing
              </h2>
            </div>
            <ul className="log">
              {WRITING.map((note) => (
                <li key={note.slug} className="row">
                  <p className="margin mono meta">
                    <time dateTime={note.date}>{note.date}</time>
                  </p>
                  <p className="body">
                    <a href={`${NOTES_BASE_URL}/${note.slug}`}>{note.title}</a>
                  </p>
                </li>
              ))}
              <li className="row">
                <span className="margin" aria-hidden="true" />
                <p className="body sub">
                  <a href={NOTES_BASE_URL}>All notes on tiercel.io</a> →
                </p>
              </li>
            </ul>
          </section>

          <section id="elsewhere" aria-labelledby="elsewhere-h">
            <div className="row head">
              <span className="margin" aria-hidden="true" />
              <h2 id="elsewhere-h" className="body">
                Elsewhere
              </h2>
            </div>
            <ul className="log">
              {LINKS.map((link) => (
                <li key={link.label} className="row">
                  <p className="margin mono meta">{link.label}</p>
                  <p className="body">
                    {isTodo(link.href) ? (
                      <Todo>{`${link.label} URL`}</Todo>
                    ) : (
                      <a href={link.href}>{displayUrl(link.href)}</a>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="contact" aria-labelledby="contact-h">
            <div className="row head">
              <span className="margin" aria-hidden="true" />
              <h2 id="contact-h" className="body">
                Contact
              </h2>
            </div>
            <div className="log">
              <p className="row">
                <span className="margin mono meta">Email</span>
                <span className="body">
                  <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                </span>
              </p>
              <p className="row">
                <span className="margin mono meta">Hiring</span>
                <span className="body">
                  Hiring a team? <a href="https://tiercel.io">Tiercel Labs →</a>
                </span>
              </p>
            </div>
          </section>
        </main>

        <footer className="row foot">
          <span className="margin" aria-hidden="true" />
          <p className="body mono meta">
            Set in Newsreader and JetBrains Mono.
          </p>
        </footer>
      </div>
    </>
  )
}
