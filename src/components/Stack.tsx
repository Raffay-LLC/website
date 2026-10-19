import { useEffect, useRef, type ReactNode } from 'react'
import { scroll } from 'motion'

const DESKTOP = '(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)'
const MIN_SCALE = 0.925
const MAX_DIM = 0.42

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * "Selected work" as a stacking deck (desktop). Each `.slot` is `position:
 * sticky` in CSS, so a card pins under the header and the next one slides up
 * over it. This hook adds the depth: as the next card covers a pinned one, the
 * pinned card scales down and dims. Progress is read from the next slot's real
 * position each frame, so it stays correct while that slot is itself stuck.
 * Below 900px, on short windows and under reduced motion nothing is attached
 * and the cards are a normal stacked list.
 */
export function CardStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const mq = window.matchMedia(DESKTOP)
    let stopScroll: (() => void) | undefined
    let ro: ResizeObserver | undefined

    const teardown = () => {
      stopScroll?.()
      ro?.disconnect()
      stopScroll = undefined
      ro = undefined
      for (const slot of root.querySelectorAll<HTMLElement>(':scope > .slot')) {
        slot.style.removeProperty('--h')
        const card = slot.querySelector<HTMLElement>('.card')
        const dim = slot.querySelector<HTMLElement>('.card-dim')
        if (card) card.style.transform = ''
        if (dim) dim.style.opacity = ''
      }
    }

    const setup = () => {
      teardown()
      if (!mq.matches) return
      const slots = Array.from(root.querySelectorAll<HTMLElement>(':scope > .slot'))
      const cards = slots.map((s) => s.querySelector<HTMLElement>('.card'))
      const dims = slots.map((s) => s.querySelector<HTMLElement>('.card-dim'))
      let tops: number[] = []
      let heights: number[] = []

      const measure = () => {
        heights = slots.map((s) => {
          const pad = parseFloat(getComputedStyle(s).paddingBottom) || 0
          return s.offsetHeight - pad
        })
        slots.forEach((s, i) => s.style.setProperty('--h', `${heights[i]}px`))
        tops = slots.map((s) => parseFloat(getComputedStyle(s).top) || 0)
      }
      measure()
      ro = new ResizeObserver(measure)
      slots.forEach((s) => ro!.observe(s))

      const frame = () => {
        for (let i = 0; i < slots.length - 1; i++) {
          const card = cards[i]
          if (!card) continue
          // Overlap begins when the next slot's top meets this card's bottom,
          // and ends when the next slot reaches its own pinned position.
          const start = tops[i] + heights[i]
          const end = tops[i + 1]
          const p = clamp01((start - slots[i + 1].getBoundingClientRect().top) / Math.max(1, start - end))
          card.style.transform = p > 0 ? `scale(${(1 - (1 - MIN_SCALE) * p).toFixed(4)})` : ''
          const dim = dims[i]
          if (dim) dim.style.opacity = p > 0 ? (MAX_DIM * p).toFixed(3) : ''
        }
      }
      frame()
      stopScroll = scroll(frame)
    }

    setup()
    mq.addEventListener('change', setup)
    return () => {
      mq.removeEventListener('change', setup)
      teardown()
    }
  }, [])

  return (
    <div ref={ref} className="cards">
      {children}
    </div>
  )
}
