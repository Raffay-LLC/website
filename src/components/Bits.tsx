import { Children, cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { animate } from 'motion'
import type { Span } from '../content'
import { prefersReducedMotion, useLocalTime, TOAST_EVENT } from '../lib/utils'
import { EXPO, onceInView, rise, staggerChildren, unmaskWords } from '../lib/fx'

export function Spans({ items }: { items: Span[] }) {
  return (
    <>
      {items.map((item, i) =>
        typeof item === 'string' ? (
          item
        ) : (
          <a key={i} href={item.href}>
            {item.text}
          </a>
        ),
      )}
    </>
  )
}

export function Arrow({ dir = 'right' }: { dir?: 'right' | 'up-right' | 'down' | 'left' }) {
  const paths = {
    right: 'M2 8h11M9 4l4 4-4 4',
    left: 'M14 8H3M7 4L3 8l4 4',
    'up-right': 'M4 12L12 4M5.5 4H12v6.5',
    down: 'M8 2v11M4 9l4 4 4-4',
  }
  return (
    <svg className="arrow" viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path d={paths[dir]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Live local time                                                     */
/* ------------------------------------------------------------------ */

export function LocalTime({
  timeZone,
  city,
  fallback,
  short = false,
}: {
  timeZone: string
  city: string
  fallback: string
  short?: boolean
}) {
  const time = useLocalTime(timeZone)
  if (!time) return <>{fallback}</>
  return short ? (
    <>
      {city} <Roll text={time} />
    </>
  ) : (
    <>
      It’s <Roll text={time} /> in {city}
    </>
  )
}

/** One character (or word) slot that rolls the old value up and out as the new one rises in. */
function RollSlot({ value }: { value: string }) {
  const [state, setState] = useState({ cur: value, prev: '' })
  if (state.cur !== value) setState({ cur: value, prev: state.cur })
  const curRef = useRef<HTMLSpanElement>(null)
  const prevRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!state.prev) return
    const cur = curRef.current
    const prev = prevRef.current
    if (!cur || !prev || prefersReducedMotion()) {
      setState((s) => ({ ...s, prev: '' }))
      return
    }
    const opts = { duration: 0.55, ease: EXPO } as const
    animate(cur, { y: ['105%', '0%'], opacity: [0, 1] }, opts)
    animate(prev, { y: ['0%', '-105%'], opacity: [1, 0] }, opts).finished.then(() => setState((s) => ({ ...s, prev: '' })))
  }, [state.prev])

  return (
    <span className="roll-slot">
      {state.prev ? (
        <span ref={prevRef} className="roll-prev" aria-hidden="true">
          {state.prev}
        </span>
      ) : null}
      <span ref={curRef} className="roll-cur">
        {state.cur}
      </span>
    </span>
  )
}

/** Text whose characters roll when they change. Slots are keyed from the right so the minutes roll, not the hour. */
export function Roll({ text, className = 'tnum' }: { text: string; className?: string }) {
  const chars = Array.from(text)
  return (
    <span className={className}>
      {chars.map((c, i) => (
        <RollSlot key={chars.length - i} value={c} />
      ))}
    </span>
  )
}

/** A single word that rolls to another word (Copy / Copied). */
export function RollWord({ text }: { text: string }) {
  return <RollSlot value={text} />
}

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

type RevealTag = 'div' | 'section' | 'li' | 'article' | 'ul' | 'ol' | 'dl' | 'p'

/**
 * Enters the viewport once. `rise` lifts the element; `stagger` lifts its
 * children one after another. The hidden start state is CSS under `html.js`,
 * so the prerendered HTML is fully visible without JavaScript.
 */
export function Reveal({
  as = 'div',
  className = '',
  delay = 0,
  kind = 'rise',
  children,
  ...rest
}: {
  as?: RevealTag
  className?: string
  delay?: number
  kind?: 'rise' | 'stagger'
  children: ReactNode
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    return onceInView(el, () => (kind === 'stagger' ? staggerChildren(el, delay / 1000) : rise(el, delay / 1000)))
  }, [kind, delay])
  const Tag = as as 'div'
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={`rv${kind === 'stagger' ? ' rv-stagger' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}

/** Splits text into masked words so a heading can unmask line by line. Only strings and inline elements. */
function splitWords(children: ReactNode, keyPrefix = 'w'): ReactNode {
  return Children.map(children, (child, ci) => {
    if (typeof child === 'string') {
      const words = child.split(/\s+/).filter(Boolean)
      const lead = /^\s/.test(child)
      const trail = /\s$/.test(child)
      return (
        <>
          {lead ? ' ' : null}
          {words.map((w, i) => (
            <span key={`${keyPrefix}-${ci}-${i}`}>
              <span className="w">
                <span>{w}</span>
              </span>
              {i < words.length - 1 || trail ? ' ' : null}
            </span>
          ))}
        </>
      )
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>
      return cloneElement(el, { key: `${keyPrefix}-${ci}` }, splitWords(el.props.children, `${keyPrefix}-${ci}`))
    }
    return child
  })
}

/** A section heading whose words rise out of line masks when it scrolls into view. */
export function Headline({
  as = 'h2',
  className = '',
  children,
  ...rest
}: { as?: 'h1' | 'h2' | 'h3'; className?: string; children: ReactNode } & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    return onceInView(el, () => unmaskWords(el))
  }, [])
  const Tag = as as 'h2'
  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={`rw ${className}`.trim()} {...rest}>
      {splitWords(children)}
    </Tag>
  )
}

/** Counts a real metric up from zero when it scrolls into view ("+15%", "−10%", "2x"). The text is final in the HTML. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    const m = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/.exec(value)
    if (!el || !m || prefersReducedMotion()) return
    const [, pre, num, post] = m
    const target = parseFloat(num)
    const decimals = num.includes('.') ? num.split('.')[1].length : 0
    let controls: { stop: () => void } | undefined
    const stopWatch = onceInView(
      el,
      () => {
        controls = animate(0, target, {
          duration: 1.1,
          ease: EXPO,
          onUpdate: (v) => {
            el.textContent = `${pre}${v.toFixed(decimals)}${post}`
          },
          onComplete: () => {
            el.textContent = value
          },
        })
      },
      '0px 0px -12% 0px',
    )
    return () => {
      stopWatch()
      controls?.stop()
      el.textContent = value
    }
  }, [value])
  return (
    <span ref={ref} className="tnum">
      {value}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Toast + clipboard                                                   */
/* ------------------------------------------------------------------ */

export function Toaster() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    let timer = 0
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setMessage(''), 2400)
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast)
      window.clearTimeout(timer)
    }
  }, [])
  return (
    <div className="toaster" role="status" aria-live="polite">
      {message ? <p className="toast">{message}</p> : null}
    </div>
  )
}

