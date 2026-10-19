import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ASK, PROFILE } from '../content'
import { matchAnswer } from '../lib/ask'
import { Arrow } from './Bits'

type Source = 'live' | 'prewritten'
type Message = { role: 'user' | 'assistant'; content: string; source?: Source }
type Mode = 'unknown' | 'live' | 'static'

const MAX_USER_TURNS = 3

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
  const [mode, setMode] = useState<Mode>('unknown')
  const logRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const userTurns = messages.filter((m) => m.role === 'user').length
  const limitReached = userTurns >= MAX_USER_TURNS && !pending

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => () => abortRef.current?.abort(), [])

  function answerStatically(question: string): Message {
    const qa = matchAnswer(question)
    if (qa) return { role: 'assistant', source: 'prewritten', content: qa.answer }
    return {
      role: 'assistant',
      source: 'prewritten',
      content: `I don’t have an answer to that one. Try one of the suggested questions, or email ${PROFILE.email}.`,
    }
  }

  async function ask(raw: string) {
    const question = raw.trim().slice(0, ASK.maxQuestionLength)
    if (!question || pending || userTurns >= MAX_USER_TURNS) return
    setInput('')
    const history = messages
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
          setMessages([...next, answerStatically(question)])
        }
      } else if (res.status === 429) {
        setMessages([...next, answerStatically(question)])
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
        <div ref={logRef} className="ask-log" role="log" aria-live="polite" aria-label="Conversation">
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
              disabled={pending}
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
