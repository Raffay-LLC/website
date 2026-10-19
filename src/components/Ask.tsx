import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ASK, PROFILE, QA_LIST } from '../content'
import { matchAnswer } from '../lib/ask'
import { Arrow } from './Bits'

type Source = 'live' | 'prewritten'
type Message = { role: 'user' | 'assistant'; content: string; source?: Source; example?: boolean }
type Mode = 'unknown' | 'live' | 'static'

const MAX_USER_TURNS = 3

/** Shown before the first question so the panel is never empty. Not sent to the model and not counted. */
const EXAMPLE_QA = QA_LIST.find((q) => q.id === 'partner') ?? QA_LIST[0]
const EXAMPLE: Message[] = [
  { role: 'user', content: EXAMPLE_QA.question, example: true },
  { role: 'assistant', content: EXAMPLE_QA.answer, source: 'prewritten', example: true },
]

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
  const [messages, setMessages] = useState<Message[]>(EXAMPLE)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [mode, setMode] = useState<Mode>('unknown')
  const logRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const userTurns = messages.filter((m) => m.role === 'user' && !m.example).length
  const limitReached = userTurns >= MAX_USER_TURNS && !pending

  useEffect(() => {
    const el = logRef.current
    // Follow the conversation, but leave the example where it is on first paint.
    if (el && messages.some((m) => !m.example)) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => () => abortRef.current?.abort(), [])

  function answerStatically(question: string, note?: string): Message {
    const qa = matchAnswer(question)
    const lead = note ? `${note} ` : ''
    if (qa) return { role: 'assistant', source: 'prewritten', content: lead + qa.answer }
    return {
      role: 'assistant',
      source: 'prewritten',
      content: `${lead}I can only answer a set of pre-written questions right now. Try one of the suggested ones, or email ${PROFILE.email}.`,
    }
  }

  async function ask(raw: string) {
    const question = raw.trim().slice(0, ASK.maxQuestionLength)
    if (!question || pending || userTurns >= MAX_USER_TURNS) return
    setInput('')
    const history = messages.filter((m) => !m.example)
    const next: Message[] = [...history, { role: 'user', content: question }]
    setMessages(next)

    if (mode === 'static') {
      setMessages([...next, answerStatically(question)])
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
        setMessages([...next, { role: 'assistant', source: 'live', content: '' }])
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let text = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          text += decoder.decode(value, { stream: true })
          const snapshot = text
          setMessages([...next, { role: 'assistant', source: 'live', content: snapshot }])
        }
        if (!text.trim()) {
          setMessages([...next, answerStatically(question, 'The live model sent nothing back.')])
        }
      } else if (res.status === 429) {
        setMessages([
          ...next,
          answerStatically(question, 'Too many questions from this network, so here is the pre-written answer instead.'),
        ])
      } else {
        // 503 (no key), a missing function in preview/dev, or an upstream error.
        setMode('static')
        setMessages([...next, answerStatically(question)])
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMode('static')
        setMessages([...next, answerStatically(question)])
      }
    } finally {
      setPending(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void ask(input)
  }

  function reset() {
    abortRef.current?.abort()
    setMessages([])
    setPending(false)
  }

  const statusText =
    mode === 'live'
      ? 'Live answers from Claude, limited to the content of this site.'
      : mode === 'static'
        ? 'The live model is not connected here, so these are pre-written answers from the same content.'
        : 'Answered by Claude from this site’s content only. If the live model is off, you get pre-written answers.'

  return (
    <div className="ask">
      <div className="ask-chips" role="group" aria-label="Suggested questions">
        {ASK.chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className="chip"
            onClick={() => void ask(chip)}
            disabled={pending || userTurns >= MAX_USER_TURNS}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="ask-panel">
        <div
          ref={logRef}
          className="ask-log"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          tabIndex={messages.length ? 0 : -1}
        >
          {messages.length === 0 ? (
            <p className="ask-empty mono">
              <span className="ask-caret" aria-hidden="true" />
              Pick a question above, or type your own.
            </p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`msg msg-${m.role}${m.example ? ' is-example' : ''}`}>
                <p className="msg-who mono">
                  {m.example
                    ? m.role === 'user'
                      ? 'Example question'
                      : 'Example answer, pre-written'
                    : m.role === 'user'
                      ? 'You'
                      : m.source === 'live'
                        ? 'Claude · live'
                        : 'Pre-written'}
                </p>
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
                </p>
              </div>
            ))
          )}
        </div>

        {limitReached ? (
          <div className="ask-limit">
            <p>That is the {MAX_USER_TURNS}-question limit for one chat.</p>
            <button type="button" className="link-btn" onClick={reset}>
              Start a new chat
            </button>
          </div>
        ) : (
          <form className="ask-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="ask-input">
              Your question about Raffay’s work
            </label>
            <span className="ask-prompt mono" aria-hidden="true">
              &gt;
            </span>
            <input
              id="ask-input"
              className="ask-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ASK.placeholder}
              maxLength={ASK.maxQuestionLength}
              autoComplete="off"
              enterKeyHint="send"
              disabled={pending}
            />
            <button type="submit" className="ask-send" disabled={pending || !input.trim()}>
              Ask <Arrow />
            </button>
          </form>
        )}
      </div>

      <p className="ask-note mono">{statusText}</p>
    </div>
  )
}

/** The pre-written answers as plain, crawlable text (also published as FAQPage JSON-LD). */
export function ShortAnswers() {
  const shown = QA_LIST
  return (
    <details className="short-answers">
      <summary>
        <span>Prefer reading? The short answers</span>
        <Arrow dir="down" />
      </summary>
      <dl>
        {shown.map((qa) => (
          <div key={qa.id}>
            <dt>{qa.question}</dt>
            <dd>{qa.answer}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}
