import { QA_LIST, type QA } from '../content'

/** Static routing: pick the pre-written answer that best matches the words in a question. */
export function matchAnswer(question: string): QA | null {
  const q = question.trim().toLowerCase()
  const exact = QA_LIST.find((a) => a.question.toLowerCase() === q)
  if (exact) return exact
  const words = new Set(q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean))
  let best: QA | null = null
  let bestScore = 0
  for (const qa of QA_LIST) {
    let score = 0
    for (const k of qa.keywords) if (words.has(k)) score += 1
    if (score > bestScore) {
      best = qa
      bestScore = score
    }
  }
  return bestScore > 0 ? best : null
}
