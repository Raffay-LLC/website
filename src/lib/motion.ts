import { useSyncExternalStore } from 'react'

/* One switch for every recording on the site (WCAG 2.2.2). */
let paused = false
const listeners = new Set<() => void>()
export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
export function setPaused(value: boolean) {
  paused = value
  listeners.forEach((fn) => fn())
}
export const getPaused = () => paused
export const getServerPaused = () => false

const reducedQuery = '(prefers-reduced-motion: reduce)'
function subscribeReduced(fn: () => void) {
  const mq = window.matchMedia(reducedQuery)
  mq.addEventListener('change', fn)
  return () => mq.removeEventListener('change', fn)
}
const getReduced = () => window.matchMedia(reducedQuery).matches
const getServerReduced = () => false

export function useMotionAllowed() {
  const isPaused = useSyncExternalStore(subscribe, getPaused, getServerPaused)
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getServerReduced)
  return !isPaused && !reduced
}

