/**
 * All site content lives here. The components only render it, and
 * src/knowledge.ts derives the JSON that the "Ask about my work" function is
 * grounded in, so the page and the answers cannot drift apart.
 *
 * Fact-checking: every line that is NOT taken directly from the founder's CV
 * or the brief carries a `// FACT-CHECK` comment. Search for it:
 *   grep -n "FACT-CHECK" src/content.ts
 * Nothing in here invents an employer, degree, award or named client.
 */

/** Inline content: plain text or a link. */
export type Span = string | { text: string; href: string }

export type DeviceKind = 'iphone' | 'android'

export type Clip = {
  id: string
  mp4: string
  webm: string
  poster: string
  alt: string
  caption: string
  /** Second to start from. */
  start?: number
}

export type Profile = {
  name: string
  role: string
  /** Plain-language description, used in titles, meta and JSON-LD. */
  headline: string
  location: string
  timeZone: string
  email: string
  url: string
  photo: string
  photoAlt: string
  updated: string
  updatedIso: string
}

export type Outcome = { figure: string; label: string }

export type ProjectSlug = 'finly' | 'investolio' | 'reelife' | 'trafilea'

export type Project = {
  slug: ProjectSlug
  name: string
  /** Short display name, set large. */
  display: string
  /** One line under the name. */
  tagline: string
  kind: 'product' | 'employer'
  period: string
  role: string
  status: { label: string; live: boolean }
  /** Where the work lives. */
  href: string
  hrefLabel: string
  platforms: string
  /** The problem it addresses. */
  problem: string[]
  /** What was built, as architecture bullets. */
  built: string[]
  stack: string[]
  outcomes: Outcome[]
  /** Solid colour world for the card and the page header. No gradients. */
  theme: { bg: string; ink: string; mute: string; rule: string }
  /** Which real recordings play on which frame; none means a typographic card. */
  devices: { kind: DeviceKind; clip: string }[]
  /** Slugs of related field notes on tiercel.io/notes. */
  notes: string[]
  seo: { title: string; description: string }
}

export type TimelineEntry = {
  org: string
  orgHref?: string
  role: string
  place: string
  period: string
  /** ISO year-month, for the <time> element. */
  from: string
  to: string | null
  impact: string
  stack: string[]
  projectSlug?: ProjectSlug
}

export type Credential = {
  label: string
  detail: string
  year: string
  /** Optional small badge, e.g. a medal. */
  badge?: string
}

export type NowTag = 'building' | 'shipping' | 'writing'

export type NowEntry = {
  date: string
  iso: string
  tag: NowTag
  body: Span[]
}

export type WritingEntry = {
  title: string
  slug: string
  /** ISO date, YYYY-MM-DD. */
  date: string
}

export type LinkEntry = { label: string; href: string; handle: string }

export type QA = {
  /** Stable id. */
  id: string
  question: string
  answer: string
  /** Lower-case words that route a free-text question here when no live model is available. */
  keywords: string[]
}

const INVESTOLIO_URL = 'https://tiercel.io/products/investolio'

export const SITE = {
  url: 'https://raffaysajjad.com',
  /** Where the field notes live. */
  notesBase: 'https://tiercel.io/notes',
  /** Sitemap <lastmod>. Bump together with PROFILE.updated. */
  lastmod: '2026-10-19',
}

export const PROFILE: Profile = {
  name: 'Raffay Sajjad',
  role: 'Staff product engineer',
  // FACT-CHECK: "staff product engineer" is positioning language. His CV title at Trafilea is Staff Frontend Engineer & Tech Lead.
  headline: 'Staff product engineer and founder of Tiercel',
  location: 'Lahore, Pakistan',
  timeZone: 'Asia/Karachi',
  email: 'contact@raffaysajjad.com',
  url: SITE.url,
  photo: '/founder.webp',
  photoAlt:
    'Portrait of Raffay Sajjad, staff product engineer and founder of Tiercel, in a navy blazer and black sweater',
  updated: 'Oct 2026',
  updatedIso: '2026-10',
}

/**
 * Hero copy. Chosen from six options (see the build report). The line is the
 * takeaway of the founder's own field note on receipt scanning.
 */
export const HERO = {
  kicker: 'Raffay Sajjad, staff product engineer',
  line: ['The model call is the easy part.', 'I build the rest.'],
  /** Credit for the line, linked. */
  lineSource: {
    text: 'Receipt scanning in production',
    href: `${SITE.notesBase}/receipt-scanning-in-production`,
  },
  sub: [
    'I ship AI products end to end: the app, the server, the model calls, the billing and the App Store listing. ',
    // FACT-CHECK: "seven years" is derived from CV dates (Apr 2019 to Oct 2026).
    'Seven years building for other companies, now my own through ',
  ] as const,
}

export type ShippingRow = {
  slug: ProjectSlug
  name: string
  state: 'live' | 'beta'
  status: string
  line: string
}

/** The "Currently shipping" ledger. */
export const SHIPPING: ShippingRow[] = [
  {
    slug: 'finly',
    name: 'Finly',
    state: 'live',
    status: 'On iPhone and Android',
    line: 'AI expense tracker. Voice, receipts, statements.',
  },
  {
    slug: 'investolio',
    name: 'Investolio',
    state: 'beta',
    status: 'In beta',
    line: 'Dividend and portfolio tracker. iOS, Android, web.',
  },
  {
    slug: 'reelife',
    name: 'Reelife',
    state: 'live',
    status: 'On the Shopify App Store',
    line: 'A Shopify SaaS app, run on the side since 2023.',
  },
]

export type AnatomyStep = { label: string; what: string; tech: string }

/**
 * "Anatomy of one of my products": the five layers I own on a single product,
 * drawn from Finly.
 */
export const ANATOMY: AnatomyStep[] = [
  {
    label: 'App',
    what: 'One codebase for iPhone and Android.',
    tech: 'React Native, Expo, TypeScript',
  },
  {
    label: 'Server',
    what: 'The API, the queues, the data.',
    tech: 'Node, Express, Postgres, Prisma, Redis, BullMQ',
  },
  {
    label: 'Models',
    what: 'Voice, vision and a tool-calling assistant.',
    tech: 'OpenAI and Anthropic, Whisper',
  },
  {
    label: 'Billing',
    what: 'How it earns money.',
    // FACT-CHECK: Finly's subscription billing is assumed (in-app subscriptions); Reelife's is the Shopify Billing API (CV).
    tech: 'In-app subscriptions, Shopify Billing API',
  },
  {
    label: 'Release',
    what: 'Store listing, then updates over the air.',
    tech: 'App Store, Google Play, self-hosted OTA on Railway',
  },
]

export const PROJECTS: Project[] = [
  {
    slug: 'finly',
    name: 'Finly: Budget Expense Tracker',
    display: 'Finly',
    tagline: 'An AI expense tracker for iPhone and Android.',
    kind: 'product',
    period: '2025–now',
    // FACT-CHECK: "Built end to end, solo" assumes he built it alone.
    role: 'Built end to end',
    status: { label: 'Live on iPhone and Android', live: true },
    href: 'https://heyfinly.com',
    hrefLabel: 'heyfinly.com',
    platforms: 'iPhone, Android',
    problem: [
      // FACT-CHECK: problem framing is written for the page, not taken from the CV. The "no bank login" point is from the Tiercel product copy.
      'Expense trackers ask for a lot of typing or for your bank login, and people stop logging after a week. Finly makes entry nearly free: say it, photograph it, or import a statement, then confirm.',
    ],
    built: [
      'Voice entry, receipt scanning and PDF or CSV statement import, each turning raw input into draft transactions.',
      // FACT-CHECK: receipt-scanning and confirm-token details are taken from the Tiercel field notes (receipt-scanning-in-production, confirm-before-you-write...).
      'Receipt scanning is one vision-model call that returns a JSON array of drafts, matched to the user’s own categories. Nothing saves until the user confirms.',
      'A tool-calling assistant that confirms before it writes. The model proposes; the server holds the action behind a short-lived token until the user taps confirm.',
      'A React Native and Expo app for iPhone and Android, talking to a Node and Express API on Postgres with Prisma.',
      'Statement imports run as background jobs on Redis and BullMQ, so a big PDF never blocks the app.',
      'OpenAI and Anthropic models behind the API, with Whisper for voice.',
      'A self-hosted over-the-air update server on Railway, so fixes reach users without a store review.',
    ],
    stack: [
      'React Native',
      'Expo',
      'Node',
      'Express',
      'Postgres',
      'Prisma',
      'Redis',
      'BullMQ',
      'OpenAI',
      'Anthropic',
      'Railway',
    ],
    outcomes: [
      { figure: '2', label: 'platforms, one codebase' },
      { figure: '3', label: 'ways in: voice, receipt, statement' },
      // FACT-CHECK: growth claim comes from the previous site copy ("growing organically since I paused paid ads"), not the CV. Add real numbers if he wants them public.
      { figure: 'Organic', label: 'growth since paid ads paused' },
    ],
    theme: { bg: '#2E2A8C', ink: '#F5F5F2', mute: '#C3C0F0', rule: '#5450B4' },
    devices: [
      { kind: 'iphone', clip: 'finly-voice' },
      { kind: 'android', clip: 'finly-categories' },
    ],
    notes: ['receipt-scanning-in-production', 'confirm-before-you-write-a-tool-calling-assistant-for-money', 'shipping-an-expo-app-with-self-hosted-ota-updates'],
    seo: {
      title: 'Finly: an AI expense tracker I built end to end',
      description:
        'Case study: Finly, an AI expense tracker for iPhone and Android with voice entry, receipt scanning, statement import and a tool-calling assistant that confirms before it writes. React Native, Node, Postgres.',
    },
  },
  {
    slug: 'investolio',
    name: 'Investolio',
    display: 'Investolio',
    tagline: 'A dividend and portfolio tracker for iOS, Android and web.',
    kind: 'product',
    period: '2026–now',
    role: 'Built end to end',
    status: { label: 'In beta', live: false },
    href: INVESTOLIO_URL,
    hrefLabel: 'tiercel.io/products/investolio',
    platforms: 'iOS, Android, web',
    problem: [
      // FACT-CHECK: problem framing is written for the page.
      'Dividend investors keep asking what they will be paid, and when. The answer lives across brokerage statements and spreadsheets, and it needs prices from a data feed that is not free.',
    ],
    built: [
      'An Interactive Brokers sync, so a portfolio arrives without retyping a position.',
      'Offline-first: the app reads from an on-device cache, opens with no connection and syncs in the background.',
      'Its own keyless market-data service: prices, dividends and FX from free public sources, each with an ordered fallback, stored in Postgres.',
      // FACT-CHECK: the fallback-chain and merge details are from the Tiercel field note "A market-data service with no API keys".
      'Dividends merged from two sources, with a tolerance so a one-day ex-date disagreement is not counted twice.',
      // FACT-CHECK: dividend calendar, forecasts and ratings come from the Tiercel product page, not the CV.
      'A dividend calendar, income forecasts and a per-holding dividend rating.',
      'One Expo and React Native codebase for iOS, Android and web.',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Node', 'Postgres'],
    outcomes: [
      { figure: '3', label: 'platforms, one codebase' },
      { figure: '0', label: 'paid market-data APIs' },
      { figure: 'Beta', label: 'in testing now' },
    ],
    theme: { bg: '#0B4D3C', ink: '#F5F5F2', mute: '#A9D8C6', rule: '#2F7561' },
    devices: [{ kind: 'iphone', clip: 'investolio-demo' }],
    notes: ['a-market-data-service-with-no-api-keys'],
    seo: {
      title: 'Investolio: a dividend tracker with its own market-data service',
      description:
        'Case study: Investolio, a dividend and portfolio tracker for iOS, Android and web, in beta. Interactive Brokers sync, offline-first, and a keyless market-data service with fallbacks.',
    },
  },
  {
    slug: 'reelife',
    name: 'Reelife',
    display: 'Reelife',
    // FACT-CHECK: the CV facts do not say what Reelife does for merchants. Replace this line with a one-sentence description.
    tagline: 'A Shopify SaaS app, live on the Shopify App Store.',
    kind: 'product',
    period: 'Jun 2023–now',
    // FACT-CHECK: "built end to end" assumes he built Reelife alone.
    role: 'Side project, built end to end',
    status: { label: 'On the Shopify App Store', live: true },
    href: 'https://apps.shopify.com/reelife',
    hrefLabel: 'apps.shopify.com/reelife',
    platforms: 'Shopify',
    problem: [
      // FACT-CHECK: written for the page. Rewrite with what Reelife actually does for a merchant.
      'Shopify merchants need software that installs from the App Store, bills through Shopify and shows them what is happening as it happens.',
    ],
    built: [
      // FACT-CHECK: "embedded in the Shopify admin" is assumed; the CV only says Remix frontend.
      'A Remix frontend embedded in the Shopify admin.',
      'Nest.js microservices behind it, packaged with Docker and run on Kubernetes.',
      'Hosting on AWS.',
      'Subscriptions through the Shopify Billing API.',
      'A real-time dashboard for merchants.',
    ],
    stack: ['Remix', 'Nest.js', 'AWS', 'Docker', 'Kubernetes', 'Shopify Billing API'],
    outcomes: [
      // FACT-CHECK: an older CV says "10 merchants". Confirm the current number before stating one.
      { figure: 'Merchants', label: 'use it on Shopify' },
      { figure: '2023', label: 'live since June' },
      { figure: 'Billing', label: 'through the Shopify Billing API' },
    ],
    theme: { bg: '#F0E7D6', ink: '#14130F', mute: '#5C5748', rule: '#CFC3AB' },
    devices: [],
    notes: [],
    seo: {
      title: 'Reelife: a Shopify SaaS app on Remix, Nest.js and Kubernetes',
      description:
        'Case study: Reelife, a Shopify SaaS app used by merchants. Remix frontend, Nest.js microservices, AWS, Docker and Kubernetes, Shopify Billing API and a real-time merchant dashboard.',
    },
  },
  {
    slug: 'trafilea',
    name: 'Trafilea',
    display: 'Trafilea',
    tagline: 'Tech lead on a flagship e-commerce platform.',
    kind: 'employer',
    period: 'Jul 2022–now',
    role: 'Staff Frontend Engineer & Tech Lead',
    status: { label: 'Current role', live: true },
    href: 'https://trafilea.com',
    hrefLabel: 'trafilea.com',
    platforms: 'Web, remote from Montevideo, UY',
    problem: [
      // FACT-CHECK: problem framing is written for the page. The CV gives the outcomes, not the brief.
      'A flagship e-commerce platform where every extra second of load time and every sluggish interaction costs sales, and a team that needed a clear technical direction.',
    ],
    built: [
      'Led a team of four engineers in the Business Support Division as Tech Lead.',
      // FACT-CHECK: "render paths, bundles and interaction cost" is illustrative; the CV only says React/Next.js performance work.
      'React and Next.js performance work across the platform: render paths, bundles and interaction cost.',
      'REST and GraphQL integration between the storefront and the services behind it.',
      'Migrated applications to AWS EC2 with Docker.',
      'Mentored engineers on the team.',
    ],
    stack: ['React', 'Next.js', 'GraphQL', 'REST', 'AWS EC2', 'Docker'],
    outcomes: [
      { figure: '+15%', label: 'UI responsiveness' },
      { figure: '−10%', label: 'load times' },
      { figure: '4', label: 'person team led' },
    ],
    theme: { bg: '#14130F', ink: '#F4F1EA', mute: '#A9A598', rule: '#3A3830' },
    devices: [],
    notes: [],
    seo: {
      title: 'Trafilea: tech lead on a flagship e-commerce platform',
      description:
        'Case study: Raffay Sajjad as Staff Frontend Engineer and Tech Lead at Trafilea since July 2022. Led a team of four; React and Next.js performance work, +15% UI responsiveness and 10% faster loads.',
    },
  },
]

export const TIMELINE: TimelineEntry[] = [
  {
    org: 'Tiercel',
    orgHref: 'https://tiercel.io',
    role: 'Founder',
    place: 'Lahore, Pakistan',
    period: '2026–now',
    // FACT-CHECK: the start month is unknown; only the year (2026) is given.
    from: '2026',
    to: null,
    impact:
      'An independent software company that builds AI-powered apps, and partners with companies to build theirs.',
    // FACT-CHECK: stack summarised from the products Tiercel builds.
    stack: ['React Native', 'Expo', 'Node', 'Postgres', 'LLM APIs'],
  },
  {
    org: 'Trafilea Inc.',
    orgHref: 'https://trafilea.com',
    role: 'Staff Frontend Engineer & Tech Lead',
    place: 'Montevideo, UY (remote)',
    period: 'Jul 2022–now',
    from: '2022-07',
    to: null,
    impact:
      'Led a team of four on a flagship e-commerce platform. +15% UI responsiveness, −10% load times, apps moved to AWS EC2 with Docker.',
    stack: ['React', 'Next.js', 'GraphQL', 'AWS', 'Docker'],
    projectSlug: 'trafilea',
  },
  {
    org: 'Reelife',
    orgHref: 'https://apps.shopify.com/reelife',
    role: 'Founder, side project',
    place: 'Shopify App Store',
    period: 'Jun 2023–now',
    from: '2023-06',
    to: null,
    impact:
      'A Shopify SaaS app with Shopify Billing and a real-time merchant dashboard, used by Shopify merchants.',
    stack: ['Remix', 'Nest.js', 'AWS', 'Kubernetes'],
    projectSlug: 'reelife',
  },
  {
    org: 'Planto Ltd.',
    role: 'Senior Frontend Engineer',
    place: 'Hong Kong SAR',
    period: 'Apr–Oct 2022',
    from: '2022-04',
    to: '2022-10',
    impact:
      'On a financial management app: +20% UI responsiveness, a class-to-hooks migration and a testing strategy.',
    stack: ['React', 'React Native'],
  },
  {
    org: 'Netsol Technologies',
    role: 'Senior Software Engineer',
    // FACT-CHECK: the CV reads "SSr. Software Engineer". Confirm the exact title.
    place: 'Lahore, Pakistan',
    period: 'Jan 2021–Apr 2022',
    from: '2021-01',
    to: '2022-04',
    impact: '+30% interface responsiveness, client delivery and code reviews.',
    stack: ['React', 'Next.js'],
  },
  {
    org: 'Power Information Technology Company',
    role: 'Software Engineer',
    place: 'Lahore, Pakistan',
    period: 'Apr 2019–Dec 2020',
    from: '2019-04',
    to: '2020-12',
    // FACT-CHECK: "FRS" is expanded here as functional requirement specifications.
    impact: 'B2B apps, and functional requirement specification (FRS) documents for 10+ projects.',
    stack: [],
  },
]

export const CREDENTIALS: Credential[] = [
  {
    label: 'MS Computer Science',
    detail: 'LUMS',
    year: '2022',
  },
  {
    label: 'BS Computer Engineering',
    detail: 'FAST-NUCES',
    year: '2020',
    badge: 'Bronze Medalist, Cum Laude',
  },
  {
    label: 'React certificate',
    detail: 'Toggl',
    year: '2024',
  },
]

export type SkillGroup = { label: string; items: string[] }

export const SKILLS: SkillGroup[] = [
  {
    label: 'Product',
    items: ['React', 'Next.js', 'Remix', 'React Native', 'Expo', 'TypeScript'],
  },
  {
    label: 'Server and infra',
    items: ['Node', 'Nest', 'Express', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    label: 'AI in production',
    items: [
      'OpenAI and Anthropic tool calling',
      'Vision extraction',
      'Whisper',
    ],
  },
  {
    label: 'Practice',
    items: ['Cursor', 'Claude Code', 'Codex', 'Team leadership'],
  },
]

export const NOW: NowEntry[] = [
  {
    date: 'Oct 2026',
    iso: '2026-10',
    tag: 'building',
    body: [
      { text: 'Investolio', href: INVESTOLIO_URL },
      ', the dividend and portfolio tracker, which is in beta, and AI-powered apps for partner companies through ',
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
      ', the AI expense tracker for iPhone and Android, which is growing organically since I paused paid ads.',
      // FACT-CHECK: "growing organically since I paused paid ads" is carried over from the previous version of this site.
    ],
  },
  {
    date: 'Oct 2026',
    iso: '2026-10',
    tag: 'writing',
    body: [
      'Four field notes written from the Finly and Investolio code, on receipt scanning, confirm-before-write assistants, a keyless market-data service and self-hosted OTA updates. They are on ',
      { text: 'the Tiercel journal', href: SITE.notesBase },
      '.',
    ],
  },
]

/**
 * Notes published on tiercel.io/notes. The four field notes first, then the
 * older notes, newest first. Titles and slugs come from tiercel-labs.
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
]

export const LINKS: LinkEntry[] = [
  { label: 'GitHub', href: 'https://github.com/RaffaySajjad', handle: 'RaffaySajjad' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/raffay-sajjad',
    handle: 'raffay-sajjad',
  },
  { label: 'X', href: 'https://x.com/raffaysajjad', handle: '@raffaysajjad' },
]

export type PartnerShape = { title: string; body: string }

/** What "partner with Tiercel" can mean. */
export const PARTNER = {
  heading: 'Building something? Partner with Tiercel',
  lead: 'Tiercel is an independent software company. Besides its own apps, it partners with companies that want to build theirs.',
  cta: { text: 'Partner with Tiercel', href: 'https://tiercel.io' },
  shapes: [
    // FACT-CHECK: these three engagement shapes are invented to make the offer concrete. Confirm or rewrite what Tiercel actually offers.
    {
      title: 'Zero to App Store',
      body: 'An AI-powered app built end to end, from the first commit to the store listing.',
    },
    {
      title: 'AI feature in your product',
      body: 'Voice, vision or an assistant added to an app you already run, with the guardrails to ship it.',
    },
    {
      title: 'A staff-level hand on your team',
      body: 'Architecture, performance and technical leadership on a web or mobile platform.',
    },
  ] satisfies PartnerShape[],
}

/** Ask about my work. */
export const ASK = {
  heading: 'Ask about my work',
  lead: 'Ask anything about my experience and products. Answers come from this site’s content only.',
  placeholder: 'What would you like to know?',
  chips: [
    'What has Raffay shipped?',
    'What’s his experience with AI in production?',
    'Is he open to partner work?',
    'What stack does he use?',
  ],
  maxQuestionLength: 280,
}

/**
 * Pre-written answers. They are shown as the suggested-question fallback when
 * no live model is configured, and published on the page as a short FAQ. They
 * are written from the content above and nothing else.
 */
// FACT-CHECK: all answers below are written from the content above, so they inherit every FACT-CHECK note in this file.
export const QA_LIST: QA[] = [
  {
    id: 'shipped',
    question: 'What has Raffay shipped?',
    answer:
      'Three products of his own. Finly: Budget Expense Tracker (2025 to now) is an AI expense tracker for iPhone and Android with voice entry, receipt scanning, PDF and CSV statement import and an assistant that confirms before it writes. Investolio (2026 to now, in beta) is a dividend and portfolio tracker for iOS, Android and web. Reelife (June 2023 to now) is a Shopify SaaS app used by Shopify merchants. Before that he shipped for other companies: Trafilea, Planto and Netsol.',
    keywords: ['shipped', 'built', 'ship', 'products', 'product', 'apps', 'made', 'finly', 'investolio', 'reelife', 'portfolio', 'projects', 'work'],
  },
  {
    id: 'ai',
    question: 'What’s his experience with AI in production?',
    answer:
      'Finly runs LLM features in production: voice entry with Whisper, receipt scanning with a vision model that returns draft transactions, PDF and CSV statement import, and a tool-calling assistant that confirms before it writes. It uses OpenAI and Anthropic models behind a Node API. He also writes up what he learns as field notes on the Tiercel journal, such as receipt scanning in production and confirm-before-you-write assistants.',
    keywords: ['ai', 'llm', 'llms', 'model', 'models', 'openai', 'anthropic', 'claude', 'gpt', 'whisper', 'vision', 'production', 'agent', 'assistant', 'tool', 'machine', 'learning'],
  },
  {
    id: 'partner',
    question: 'Is he open to partner work?',
    answer:
      'Yes. Tiercel, the company he founded, partners with companies that want to build their own AI-powered apps. The way to start is an email to contact@raffaysajjad.com.',
    keywords: ['partner', 'partnership', 'hire', 'hiring', 'available', 'availability', 'open', 'freelance', 'contract', 'consult', 'work', 'engage', 'tiercel', 'client', 'clients'],
  },
  {
    id: 'stack',
    question: 'What stack does he use?',
    answer:
      'On the front end: React, Next.js, Remix, React Native with Expo, and TypeScript. On the back end: Node, Nest and Express, GraphQL, Postgres with Prisma, and Redis with BullMQ. For infrastructure: AWS, Docker, Kubernetes, CI/CD and Railway. For AI: OpenAI and Anthropic tool calling, vision extraction and Whisper. He also builds with Cursor, Claude Code and Codex.',
    keywords: ['stack', 'tech', 'technology', 'technologies', 'tools', 'languages', 'language', 'react', 'typescript', 'node', 'aws', 'docker', 'kubernetes', 'framework', 'frameworks', 'uses', 'use'],
  },
  {
    id: 'experience',
    question: 'Where has he worked?',
    answer:
      'Trafilea (July 2022 to now, remote from Montevideo) as Staff Frontend Engineer and Tech Lead, leading a team of four. Planto Ltd. in Hong Kong SAR (April to October 2022) as Senior Frontend Engineer. Netsol Technologies in Lahore (January 2021 to April 2022). Power Information Technology Company in Lahore (April 2019 to December 2020) as a Software Engineer. Since 2026 he is also the founder of Tiercel.',
    keywords: ['worked', 'work', 'experience', 'career', 'employer', 'employers', 'trafilea', 'planto', 'netsol', 'power', 'job', 'jobs', 'history', 'years', 'role', 'lead', 'leadership', 'team'],
  },
  {
    id: 'education',
    question: 'Where did he study?',
    answer:
      'An MS in Computer Science from LUMS (2022), and a BS in Computer Engineering from FAST-NUCES (2020), where he was a Bronze Medalist and graduated Cum Laude. He also holds a Toggl React certificate (2024).',
    keywords: ['study', 'studied', 'education', 'degree', 'university', 'lums', 'fast', 'nuces', 'school', 'college', 'masters', 'bachelor', 'medal', 'certificate', 'certification', 'graduated'],
  },
  {
    id: 'where',
    question: 'Where is he based?',
    answer:
      'Lahore, Pakistan (Pakistan Standard Time, UTC+5). He works remotely with a team whose home base is Montevideo, Uruguay.',
    keywords: ['where', 'based', 'location', 'live', 'lives', 'country', 'city', 'timezone', 'time', 'lahore', 'pakistan', 'remote'],
  },
  {
    id: 'contact',
    question: 'How can I contact him?',
    answer:
      'Email contact@raffaysajjad.com. He is also on GitHub (RaffaySajjad), LinkedIn (raffay-sajjad) and X (@raffaysajjad).',
    keywords: ['contact', 'email', 'reach', 'message', 'linkedin', 'github', 'twitter', 'social', 'touch', 'talk'],
  },
]
