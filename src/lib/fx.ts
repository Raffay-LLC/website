import { animate, stagger } from 'motion'
import { prefersReducedMotion } from './utils'

/**
 * Motion helpers (Motion, motion.dev). Rules every helper follows:
 *  - the markup is always fully visible without JavaScript; the hidden "before"
 *    state lives in CSS under `html.js` and `prefers-reduced-motion: no-preference`;
 *  - animation runs from that state to the natural one, then the `is-in` class
 *    takes over and the inline styles are cleared;
 *  - transform and opacity only.
 */

export const EXPO = [0.16, 1, 0.3, 1] as const
export const SPRING = { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 } as const
export const POP = { type: 'spring', stiffness: 520, damping: 17, mass: 0.6 } as const

export function motionOK() {
  return !prefersReducedMotion()
}

/** Calls `run` once, the first time `el` scrolls into view. Returns a cleanup. */
export function onceInView(el: Element, run: () => void, margin = '0px 0px -9% 0px') {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        run()
      }
    },
    { rootMargin: margin, threshold: 0.01 },
  )
  io.observe(el)
  return () => io.disconnect()
}

/** Hands an element back to CSS once its entrance has played. */
export function settle(targets: Element | Element[], host: Element = Array.isArray(targets) ? targets[0] : targets) {
  host.classList.add('is-in')
  for (const t of Array.isArray(targets) ? targets : [targets]) {
    const s = (t as HTMLElement).style
    s.opacity = ''
    s.transform = ''
    s.clipPath = ''
  }
}

export function rise(el: HTMLElement, delay = 0) {
  animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.85, ease: EXPO, delay }).finished.then(() => settle(el))
}

export function staggerChildren(el: HTMLElement, delay = 0, gap = 0.07) {
  const kids = Array.from(el.children) as HTMLElement[]
  if (!kids.length) return settle(el)
  animate(kids, { opacity: [0, 1], y: [22, 0] }, { duration: 0.8, ease: EXPO, delay: stagger(gap, { startDelay: delay }) }).finished.then(() =>
    settle(kids, el),
  )
}

/** Unmasks the `.w > span` words of a headline, left to right, line by line. */
export function unmaskWords(el: HTMLElement, delay = 0) {
  const words = Array.from(el.querySelectorAll<HTMLElement>('.w > span'))
  if (!words.length) return settle(el)
  animate(words, { y: ['112%', '0%'] }, { duration: 0.95, ease: EXPO, delay: stagger(0.05, { startDelay: delay }) }).finished.then(() => {
    el.classList.add('is-in')
    for (const w of words) w.style.transform = ''
  })
}

export function pop(el: HTMLElement, delay = 0) {
  animate(el, { scale: [0, 1] }, { ...POP, delay }).finished.then(() => settle(el))
}

/** A small spring pull toward the pointer. Fine pointers only. Returns a cleanup. */
export function attachMagnet(el: HTMLElement, pull = 0.2) {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  let x = 0
  let y = 0
  const to = (nx: number, ny: number, stiffness: number, damping: number) => {
    x = nx
    y = ny
    animate(el, { x: nx, y: ny }, { type: 'spring', stiffness, damping, mass: 0.5 })
  }
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2 - x
    const cy = r.top + r.height / 2 - y
    to((e.clientX - cx) * pull, (e.clientY - cy) * pull * 1.4, 260, 20)
  }
  const leave = () => to(0, 0, 220, 14)
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
    el.style.transform = ''
  }
}
