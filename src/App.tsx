import { PROFILE } from './content'
import { LocalTime, Toaster } from './components/Bits'
import { toggleTheme, useModKey } from './lib/utils'
import { Palette } from './components/Palette'
import Home from './pages/Home'
import Work from './pages/Work'
import { projectFor } from './seo'

function Header({ route }: { route: string }) {
  const base = route === '/' ? '' : '/'
  const links = [
    ['Work', '#work'],
    ['Experience', '#experience'],
    ['Now', '#now'],
    ['Writing', '#writing'],
    ['Contact', '#contact'],
  ]
  return (
    <header className="bar">
      <div className="wrap bar-in">
        <a className="brand" href="/" aria-label={`${PROFILE.name}, home`}>
          <span className="brand-mark" aria-hidden="true" />
          {PROFILE.name}
        </a>
        <nav aria-label="Sections">
          <ul className="nav">
            {links.map(([label, hash]) => (
              <li key={hash}>
                <a href={`${base}${hash}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="bar-right">
          <span className="clock mono" aria-label="Local time in Lahore">
            <LocalTime timeZone={PROFILE.timeZone} city="Lahore" fallback="Lahore, PK" short />
          </span>
          <Palette route={route} />
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const mod = useModKey()
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <p>
          © 2026 {PROFILE.name}. Made in Lahore. Updated <time dateTime={PROFILE.updatedIso}>{PROFILE.updated}</time>.
        </p>
        <p className="foot-keys mono">
          <span>
            <kbd className="kbd">{mod === '⌘' ? '⌘K' : `${mod} K`}</kbd> jump
          </span>
          <span>
            <kbd className="kbd">/</kbd> ask
          </span>
          <button type="button" className="link-btn" onClick={toggleTheme}>
            Switch theme
          </button>
        </p>
      </div>
    </footer>
  )
}

export default function App({ route }: { route: string }) {
  const project = projectFor(route)
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header route={route} />
      {project ? <Work project={project} /> : <Home />}
      <Footer />
      <Toaster />
    </>
  )
}
