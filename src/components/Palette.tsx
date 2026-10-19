import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'motion'
import { LINKS, PROFILE, PROJECTS, SITE, WRITING } from '../content'
import { copyText, currentTheme, goTo, prefersReducedMotion, toggleTheme, useModKey } from '../lib/utils'

type Item = {
  id: string
  group: string
  label: string
  hint?: string
  keywords?: string
  run: () => void
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

/** Header button plus the ⌘K dialog. Also owns the global shortcuts. */
export function Palette({ route }: { route: string }) {
  const [open, setOpen] = useState(false)
  // The dialog stays mounted while it plays its exit.
  const [mounted, setMounted] = useState(false)
  if (open && !mounted) setMounted(true)
  const mod = useModKey()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault()
        goTo('ask', route, 'ask-input')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [route])

  return (
    <>
      <button
        type="button"
        className="jump"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+K Meta+K"
      >
        <span>Jump to</span>
        <kbd className="kbd" aria-hidden="true">
          {mod}
          {mod === '⌘' ? '' : ' '}K
        </kbd>
      </button>
      {mounted ? <PaletteDialog route={route} open={open} onClose={() => setOpen(false)} onExited={() => setMounted(false)} /> : null}
    </>
  )
}

const IN = { type: 'spring', stiffness: 520, damping: 33, mass: 0.8 } as const

function PaletteDialog({ route, open, onClose, onExited }: { route: string; open: boolean; onClose: () => void; onExited: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const runAfter = useRef<(() => void) | null>(null)
  const finish = () => {
    onExited()
    const run = runAfter.current
    runAfter.current = null
    // Let focus return to where it was, then act.
    if (run) window.setTimeout(run, 0)
  }
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo<Item[]>(() => {
    const go = (id: string, focusId?: string) => () => goTo(id, route, focusId)
    const open = (href: string) => () => {
      window.location.href = href
    }
    const external = (href: string) => () => {
      window.open(href, '_blank', 'noopener')
    }
    return [
      { id: 'ask', group: 'Go to', label: 'Ask about my work', hint: '/', keywords: 'question chat ai claude', run: go('ask', 'ask-input') },
      { id: 'work', group: 'Go to', label: 'Selected work', keywords: 'projects case studies', run: go('work') },
      { id: 'experience', group: 'Go to', label: 'Experience', keywords: 'career timeline jobs', run: go('experience') },
      { id: 'now', group: 'Go to', label: 'Now', keywords: 'log current building', run: go('now') },
      { id: 'writing', group: 'Go to', label: 'Writing', keywords: 'notes blog field notes', run: go('writing') },
      { id: 'contact', group: 'Go to', label: 'Contact and partner work', keywords: 'email hire partner tiercel', run: go('contact') },
      ...PROJECTS.map((p) => ({
        id: `p-${p.slug}`,
        group: 'Case studies',
        label: p.display,
        hint: p.period,
        keywords: `${p.name} ${p.tagline}`,
        run: open(`/work/${p.slug}`),
      })),
      ...WRITING.slice(0, 4).map((w) => ({
        id: `w-${w.slug}`,
        group: 'Field notes',
        label: w.title,
        hint: 'tiercel.io',
        run: external(`${SITE.notesBase}/${w.slug}`),
      })),
      {
        id: 'email',
        group: 'Actions',
        label: 'Copy email address',
        hint: PROFILE.email,
        keywords: 'contact mail',
        run: () => void copyText(PROFILE.email, 'Email copied'),
      },
      {
        id: 'theme',
        group: 'Actions',
        label: `Switch to ${currentTheme() === 'dark' ? 'light' : 'dark'} theme`,
        keywords: 'dark light mode appearance',
        run: toggleTheme,
      },
      ...LINKS.map((l) => ({
        id: `l-${l.label}`,
        group: 'Elsewhere',
        label: l.label,
        hint: l.handle,
        run: external(l.href),
      })),
      { id: 'tiercel', group: 'Elsewhere', label: 'Tiercel', hint: 'tiercel.io', keywords: 'company', run: external('https://tiercel.io') },
    ]
  }, [route])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => `${it.label} ${it.keywords ?? ''} ${it.group}`.toLowerCase().includes(q))
  }, [items, query])

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0))
  const activeId = results[activeIndex]?.id

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    document.documentElement.classList.add('lock')
    inputRef.current?.focus()
    return () => {
      document.documentElement.classList.remove('lock')
      previous?.focus?.()
    }
  }, [])

  useEffect(() => {
    if (activeId) document.getElementById(`pal-${activeId}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  // Spring in on open, a quick scale and fade out on close.
  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return
    if (prefersReducedMotion()) {
      if (!open) finish()
      return
    }
    if (open) {
      const a = [
        animate(overlay, { opacity: [0, 1] }, { duration: 0.18, ease: 'easeOut' }),
        animate(panel, { opacity: [0, 1], scale: [0.95, 1], y: [-14, 0] }, { ...IN, opacity: { duration: 0.14 } }),
      ]
      return () => a.forEach((x) => x.stop())
    }
    const a = [
      animate(overlay, { opacity: 0 }, { duration: 0.14, ease: 'easeIn' }),
      animate(panel, { opacity: 0, scale: 0.97, y: -8 }, { duration: 0.14, ease: [0.4, 0, 1, 1] }),
    ]
    a[0].finished.then(finish, () => {})
    return () => a.forEach((x) => x.stop())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function choose(item: Item | undefined) {
    if (!item) return
    runAfter.current = item.run
    onClose()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(Math.min(activeIndex + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(Math.max(activeIndex - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[activeIndex])
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog: the input is its only tab stop.
      e.preventDefault()
      inputRef.current?.focus()
    }
  }

  let lastGroup = ''
  return (
    <div ref={overlayRef} className="pal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="pal"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a section, project or link"
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="pal-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="pal-list"
          aria-activedescendant={activeId ? `pal-${activeId}` : undefined}
          aria-label="Search"
          placeholder="Search sections, case studies, notes, links"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          autoComplete="off"
          spellCheck={false}
        />
        <ul id="pal-list" className="pal-list" role="listbox" aria-label="Results">
          {results.length === 0 ? <li className="pal-empty">Nothing matches “{query}”.</li> : null}
          {results.map((it, i) => {
            const header = it.group !== lastGroup
            lastGroup = it.group
            return (
              <li key={it.id} role="presentation">
                {header ? <p className="pal-group mono">{it.group}</p> : null}
                <div
                  id={`pal-${it.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className="pal-item"
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(it)}
                >
                  <span>{it.label}</span>
                  {it.hint ? <span className="pal-hint mono">{it.hint}</span> : null}
                </div>
              </li>
            )
          })}
        </ul>
        <p className="pal-foot mono" aria-hidden="true">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span>/ ask</span>
        </p>
      </div>
    </div>
  )
}
