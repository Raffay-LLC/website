import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ASK, PROFILE } from '../content'
import { matchAnswer } from '../lib/ask'
import { animate } from 'motion'
import { Arrow, Reveal } from './Bits'
import { prefersReducedMotion } from '../lib/utils'

type Source = 'live' | 'prewritten'
type Message = { role: 'user' | 'assistant'; content: string; source?: Source; streaming?: boolean }
type Mode = 'unknown' | 'live' | 'static'

const MAX_USER_TURNS = 3
/** Pre-written answers are streamed in at roughly this pace, word by word. */
const WORD_MS = 26

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/**
 * Flies a copy of the clicked chip into the input, so the question visibly
 * lands where a typed one would. Resolves when the copy has arrived.
 */
async function flyChipToInput(chip: HTMLElement, input: HTMLElement | null) {
  if (!input || prefersReducedMotion()) return
  const from = chip.getBoundingClientRect()
  const to = input.getBoundingClientRect()
  const ghost = chip.cloneNode(true) as HTMLElement
  ghost.removeAttribute('id')
  ghost.setAttribute('aria-hidden', 'true')
  ghost.tabIndex = -1
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: '0',
    zIndex: '90',
    pointerEvents: 'none',
    willChange: 'transform',
  })
  document.body.appendChild(ghost)
  chip.style.visibility = 'hidden'
  // The text of the input starts a little in from its left edge.
  const dx = to.left + 4 - (from.left + 16)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const scale = Math.min(1, Math.max(0.6, (to.width - 8) / from.width))
  try {
    await animate(ghost, { x: [0, dx], y: [0, dy], scale: [1, scale] }, { type: 'spring', stiffness: 230, damping: 25, mass: 0.8 }).finished
    animate(ghost, { opacity: [1, 0] }, { duration: 0.12 })
  } finally {
    window.setTimeout(() => {
      ghost.remove()
      chip.style.visibility = ''
    }, 140)
  }
}

/** Make bare URLs and the email address clickable, nothing else. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]*[^\s).,;:!?]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <a key={i} href={part}>
              {part.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )
        }
        if (/^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/.test(part)) return <a key={i} href={`mailto:${part}`}>{part}</a>
        return part
      })}
    </>
  )
}

export function Ask() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [flying, setFlying] = useState(false)
  const [mode, setMode] = useState<Mode>('unknown')
  const logRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const runRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const userTurns = messages.filter((m) => m.role === 'user').length
  const limitReached = userTurns >= MAX_USER_TURNS && !pending

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(
    () => () => {
      runRef.current += 1
      abortRef.current?.abort()
    },
    [],
  )

  function answerStatically(question: string): Message {
    const qa = matchAnswer(question)
    if (qa) return { role: 'assistant', source: 'prewritten', content: qa.answer }
    return {
      role: 'assistant',
      source: 'prewritten',
      content: `I don’t have an answer to that one. Try one of the suggested questions, or email ${PROFILE.email}.`,
    }
  }

  /** Types a pre-written answer in word by word. Instant under reduced motion. */
  async function streamStatic(history: Message[], question: string) {
    const answer = answerStatically(question)
    if (prefersReducedMotion()) {
      setMessages([...history, answer])
      return
    }
    const run = ++runRef.current
    setPending(true)
    setMessages([...history, { ...answer, content: '', streaming: true }])
    await wait(320)
    const tokens = answer.content.match(/\S+\s*/g) ?? [answer.content]
    let text = ''
    for (const token of tokens) {
      if (runRef.current !== run) return
      text += token
      setMessages([...history, { ...answer, content: text, streaming: true }])
      await wait(WORD_MS + Math.min(40, token.trim().length * 2) * (/[.,;:!?]\s*$/.test(token) ? 3 : 0.4))
    }
    if (runRef.current !== run) return
    setMessages([...history, answer])
    setPending(false)
  }

  async function ask(raw: string) {
    const question = raw.trim().slice(0, ASK.maxQuestionLength)
    if (!question || pending || userTurns >= MAX_USER_TURNS) return
    setInput('')
    const history = messages
    const next: Message[] = [...history, { role: 'user', content: question }]
    setMessages(next)

    if (mode === 'static') {
      await streamStatic(next, question)
      return
    }

    setPending(true)
    const controller = new AbortController()
    abortRef.current = controller

    // Only live answers are replayed to the model, and only complete pairs.
    const payload: { role: string; content: string }[] = []
    for (let i = 0; i + 1 < history.length; i += 2) {
      if (history[i + 1].source === 'live') {
        payload.push({ role: 'user', content: history[i].content }, { role: 'assistant', content: history[i + 1].content })
      }
    }
    payload.push({ role: 'user', content: question })

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      })

      if (res.ok && res.headers.get('x-ask') === 'live' && res.body) {
        setMode('live')
        setMessages([...next, { role: 'assistant', source: 'live', content: '', streaming: true }])
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let text = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          text += decoder.decode(value, { stream: true })
          const snapshot = text
          setMessages([...next, { role: 'assistant', source: 'live', content: snapshot, streaming: true }])
        }
        if (!text.trim()) {
          await streamStatic(next, question)
        } else {
          setMessages([...next, { role: 'assistant', source: 'live', content: text }])
        }
      } else if (res.status === 429) {
        await streamStatic(next, question)
      } else {
        // 503 (no key), a missing function in preview/dev, or an upstream error.
        setMode('static')
        await streamStatic(next, question)
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMode('static')
        await streamStatic(next, question)
      }
    } finally {
      setPending(false)
    }
  }

  /** A chip flies into the input, lands as the typed question, then sends. */
  async function askFromChip(chip: string, button: HTMLElement) {
    if (pending || flying || userTurns >= MAX_USER_TURNS) return
    setFlying(true)
    try {
      await flyChipToInput(button, inputRef.current)
      if (!prefersReducedMotion() && inputRef.current) {
        setInput(chip)
        await wait(170)
      }
    } finally {
      setFlying(false)
    }
    void ask(chip)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void ask(input)
  }

  function reset() {
    abortRef.current?.abort()
    runRef.current += 1
    setMessages([])
    setPending(false)
  }

  return (
    <div className="ask">
      <Reveal className="ask-chips" kind="stagger" delay={260} role="group" aria-label="Suggested questions">
        {ASK.chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className="chip"
            onClick={(e) => void askFromChip(chip, e.currentTarget)}
            disabled={pending || flying || userTurns >= MAX_USER_TURNS}
          >
            {chip}
          </button>
        ))}
      </Reveal>

      <div className="ask-panel">
        <div ref={logRef} className="ask-log" role="log" aria-live="polite" aria-busy={pending} aria-label="Conversation">
          {messages.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              <p className="msg-body">
                {m.content ? (
                  m.role === 'assistant' ? (
                    <Linkified text={m.content} />
                  ) : (
                    m.content
                  )
                ) : (
                  <span className="thinking mono" aria-label="Thinking">
                    …
                  </span>
                )}
                {m.streaming && m.content ? <span className="caret" aria-hidden="true" /> : null}
              </p>
            </div>
          ))}
        </div>

        {limitReached ? (
          <div className="ask-limit">
            <p>That’s {MAX_USER_TURNS} questions for this chat.</p>
            <button type="button" className="link-btn" onClick={reset}>
              Start a new chat
            </button>
          </div>
        ) : (
          <form className="ask-form" onSubmit={onSubmit}>
            <span className="ask-prompt mono" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              id="ask-input"
              aria-label="Ask a question about Raffay’s work"
              className="ask-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ASK.placeholder}
              maxLength={ASK.maxQuestionLength}
              autoComplete="off"
              enterKeyHint="send"
              disabled={pending || flying}
            />
            <button type="submit" className="ask-send" disabled={pending || !input.trim()}>
              Ask <Arrow />
            </button>
          </form>
        )}
      </div>

      <p className="ask-note mono">{ASK.label}</p>
    </div>
  )
}
