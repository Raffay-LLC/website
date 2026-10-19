/**
 * All site content lives here. App.tsx only renders it.
 *
 * Anything that Raffay still has to supply is marked TODO(raffay) and is
 * rendered in the UI with a visible "placeholder" treatment (see .todo in
 * index.css). Search for `TODO(raffay)` to find every one.
 */

export const TODO = 'TODO(raffay)'

/** True when a value is an unfilled placeholder. */
export const isTodo = (value: string) => value.startsWith(TODO)

/** Inline content: plain text, a link, or a visible placeholder. */
export type Span =
  | string
  | { text: string; href: string }
  | { todo: string }

export type Profile = {
  name: string
  role: string
  location: string
  email: string
  url: string
  photo: string
  photoAlt: string
  intro: Span[][]
  updated: string
  updatedIso: string
}

export type NowTag = 'building' | 'shipping' | 'reading'

export type NowEntry = {
  /** Month + year, shown in the margin. */
  date: string
  /** ISO year-month for the <time> element. */
  iso: string
  tag: NowTag
  body: Span[]
}

export type WorkEntry = {
  name: string
  href: string
  /** Mono label in the margin. */
  label: string
  /** Mono period/date line in the margin. */
  period: string
  body: string
}

export type WritingEntry = {
  title: string
  slug: string
  /** ISO date, YYYY-MM-DD. */
  date: string
}

export type LinkEntry = {
  label: string
  href: string
}

export const PROFILE: Profile = {
  name: 'Raffay Sajjad',
  role: 'Software engineer and founder',
  location: 'Lahore, Pakistan',
  email: 'contact@raffaysajjad.com',
  url: 'https://raffaysajjad.com',
  photo: '/founder.webp',
  photoAlt: 'Raffay Sajjad',
  updated: 'Oct 2026',
  updatedIso: '2026-10',
  intro: [
    [
      'I’m Raffay, a software engineer in Lahore, Pakistan. By day I do engineering at ',
      { text: 'Trafilea', href: 'https://trafilea.com' },
      '. On the side I run ',
      { text: 'Tiercel Labs', href: 'https://tiercel.io' },
      ', which audits how teams use Cursor, Claude Code and Codex and builds its own products.',
    ],
    [
      'One of those products is ',
      { text: 'Finly', href: 'https://heyfinly.com' },
      ', an AI expense tracker I built that is live on iOS and Android. I write about AI engineering on ',
      { text: 'the Tiercel notes', href: 'https://tiercel.io/notes' },
      '.',
    ],
  ],
}

export const NOW: NowEntry[] = [
  {
    date: 'Oct 2026',
    iso: '2026-10',
    tag: 'building',
    body: [
      'The AI engineering audit at ',
      { text: 'Tiercel Labs', href: 'https://tiercel.io' },
      ', for teams that write code with Cursor, Claude Code and Codex.',
    ],
  },
  {
    date: 'Oct 2026',
    iso: '2026-10',
    tag: 'shipping',
    body: [
      { text: 'Finly', href: 'https://heyfinly.com' },
      ' is growing organically since I paused paid ads.',
    ],
  },
  {
    date: 'Oct 2026',
    iso: '2026-10',
    tag: 'reading',
    body: [{ todo: 'add what you are reading right now' }],
  },
]

export const WORK: WorkEntry[] = [
  {
    name: 'Tiercel Labs',
    href: 'https://tiercel.io',
    label: 'Founder',
    period: `${TODO}–now`,
    body: 'Runs AI engineering audits for teams using Cursor, Claude Code and Codex, and builds its own products.',
  },
  {
    name: 'Finly',
    href: 'https://heyfinly.com',
    label: 'Built',
    period: TODO,
    body: 'An AI expense tracker, live on iOS and Android.',
  },
  {
    name: 'Trafilea',
    href: 'https://trafilea.com',
    label: 'Engineering',
    period: `${TODO}–now`,
    body: 'Engineering at Trafilea.',
  },
]

/** Real notes from tiercel.io/notes (titles, slugs and dates from the Tiercel repo). */
export const WRITING: WritingEntry[] = [
  {
    title: 'Decision models vs chat models in a real workflow.',
    slug: 'decision-models-vs-chat-models-in-workflows',
    date: '2026-09-18',
  },
  {
    title: 'Local models when data cannot leave.',
    slug: 'local-models-when-data-cannot-leave',
    date: '2026-01-20',
  },
  {
    title: 'The cost of retries and review.',
    slug: 'the-cost-of-retries-and-review',
    date: '2025-12-09',
  },
  {
    title: 'Shadow AI needs a lighter governance model.',
    slug: 'shadow-ai-needs-a-lighter-governance',
    date: '2025-10-14',
  },
  {
    title: 'Lab speed is not field pull requests.',
    slug: 'copilot-lab-speed-vs-field-pull-requests',
    date: '2024-09-10',
  },
  {
    title: 'Measure the work. Not the tokens.',
    slug: 'measure-the-work-not-the-tokens',
    date: '2024-07-18',
  },
]

export const NOTES_BASE_URL = 'https://tiercel.io/notes'

export const LINKS: LinkEntry[] = [
  { label: 'GitHub', href: `${TODO}: https://github.com/<handle>` },
  { label: 'LinkedIn', href: `${TODO}: https://www.linkedin.com/in/<handle>` },
  { label: 'X', href: `${TODO}: https://x.com/<handle>` },
]
