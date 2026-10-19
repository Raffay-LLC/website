import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Span } from '../content'
import { prefersReducedMotion, useLocalTime, TOAST_EVENT } from '../lib/utils'

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
      {city} <span className="tnum">{time}</span>
    </>
  ) : (
    <>
      It’s <span className="tnum">{time}</span> in {city}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

/** Fades and lifts an element in as it enters the viewport. Visible without JavaScript. */
export function Reveal({
  as = 'div',
  className = '',
  delay = 0,
  children,
  ...rest
}: {
  as?: 'div' | 'section' | 'li' | 'article'
  className?: string
  delay?: number
  children: ReactNode
  id?: string
  'aria-labelledby'?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92) return
    el.classList.add('rv-wait')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('rv-in')
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`rv ${className}`.trim()}
      style={delay ? ({ '--d': `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
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

