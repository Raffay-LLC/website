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
  headline: string
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
  role: 'Founder',
  /** Plain-language description, used in the page title and meta. */
  headline: 'Software engineer and founder of Tiercel',
  location: 'Lahore, Pakistan',
  email: 'contact@raffaysajjad.com',
  url: 'https://raffaysajjad.com',
  photo: '/founder.webp',
  photoAlt:
    'Portrait of Raffay Sajjad, software engineer and founder of Tiercel, in a navy blazer and black sweater',
  updated: 'Oct 2026',
  updatedIso: '2026-10',
  intro: [
    [
      'I’m Raffay Sajjad, a software engineer and the founder of ',
      { text: 'Tiercel', href: 'https://tiercel.io' },
      ', where I build AI-powered apps like ',
      { text: 'Finly', href: 'https://heyfinly.com' },
      ' and Investolio.',
    ],
    [
      // TODO(raffay): link Investolio here once it has a public URL.
      'Tiercel is an independent software company. Finly is an AI expense tracker for iPhone and Android, and Investolio is a dividend and portfolio tracker that is in beta. We also partner with companies that want to build their own AI-powered apps.',
    ],
    [
      'I’m based in Lahore, Pakistan, and by day I do engineering at ',
      { text: 'Trafilea', href: 'https://trafilea.com' },
      '. I write up what I learn along the way as field notes on ',
      { text: 'the Tiercel journal', href: 'https://tiercel.io/notes' },
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
      'Investolio, a dividend and portfolio tracker, which is in beta. I also build AI-powered apps with partner companies through ',
      { text: 'Tiercel', href: 'https://tiercel.io' },
      '.',
    ],
  },
  {
    date: 'Oct 2026',
    iso: '2026-10',
    tag: 'shipping',
    body: [
      { text: 'Finly', href: 'https://heyfinly.com' },
      ', the AI expense tracker for iPhone and Android, is growing organically since I paused paid ads.',
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
    name: 'Tiercel',
    href: 'https://tiercel.io',
    label: 'Founder',
    period: `${TODO}–now`,
    body: 'An independent software company building AI-powered apps, and a partner for companies that want to build theirs.',
  },
  {
    name: 'Finly',
    href: 'https://heyfinly.com',
    label: 'Built',
    period: TODO,
    body: 'An AI expense tracker for iPhone and Android.',
  },
  {
    name: 'Investolio',
    // TODO(raffay): add the public URL once Investolio is live. Until then it
    // links to Tiercel.
    href: 'https://tiercel.io',
    label: 'Building',
    period: `${TODO}–now`,
    body: 'A dividend and portfolio tracker, now in beta.',
  },
  {
    name: 'Trafilea',
    href: 'https://trafilea.com',
    label: 'Engineering',
    period: `${TODO}–now`,
    body: 'Engineering at Trafilea.',
  },
]

/**
 * Real notes from tiercel.io/notes (titles, slugs and dates from the Tiercel
 * repo). The four field notes come first (lib/notes/field-notes.ts on
 * tiercel-labs design/product-company, still marked draft there), then the
 * older notes, newest first.
 */
export const WRITING: WritingEntry[] = [
  {
    title: 'Receipt scanning in production',
    slug: 'receipt-scanning-in-production',
    date: '2026-10-19',
  },
  {
    title: 'Confirm before you write: a tool-calling assistant for money',
    slug: 'confirm-before-you-write-a-tool-calling-assistant-for-money',
    date: '2026-10-19',
  },
  {
    title: 'A market-data service with no API keys',
    slug: 'a-market-data-service-with-no-api-keys',
    date: '2026-10-19',
  },
  {
    title: 'Shipping an Expo app with self-hosted OTA updates',
    slug: 'shipping-an-expo-app-with-self-hosted-ota-updates',
    date: '2026-10-19',
  },
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
