import { useSyncExternalStore } from 'react'

export function displayUrl(href: string) {
  return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

const formatters = new Map<string, Intl.DateTimeFormat>()

function timeIn(timeZone: string): string {
  let f = formatters.get(timeZone)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone })
    formatters.set(timeZone, f)
  }
  return f.format(new Date()).replace(/\s?(AM|PM)/, (_, m: string) => ` ${m.toLowerCase()}`)
}

function subscribeClock(fn: () => void) {
  const id = window.setInterval(fn, 15_000)
  return () => window.clearInterval(id)
}

/** "9:42 pm", or an empty string on the server and before hydration. */
export function useLocalTime(timeZone: string): string {
  return useSyncExternalStore(
    subscribeClock,
    () => timeIn(timeZone),
    () => '',
  )
}

const reducedQuery = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(reducedQuery).matches
}

export const TOAST_EVENT = 'site:toast'

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }))
}

export async function copyText(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast(message)
  } catch {
    toast(`Copy failed. It is ${text}`)
  }
}

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export function currentTheme(): 'light' | 'dark' {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* storage unavailable: the choice lasts for this visit */
  }
  toast(`${next === 'dark' ? 'Dark' : 'Light'} theme`)
}

/** "⌘" on Apple platforms, "Ctrl" elsewhere. Renders "⌘" on the server. */
export function useModKey(): string {
  return useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'),
    () => '⌘',
  )
}

/** Go to a section on the home page, from anywhere. */
export function goTo(id: string, route: string, focusId?: string) {
  if (route !== '/') {
    window.location.href = `/#${id}`
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  if (focusId) {
    window.setTimeout(
      () => document.getElementById(focusId)?.focus({ preventScroll: true }),
      prefersReducedMotion() ? 0 : 450,
    )
  }
}
