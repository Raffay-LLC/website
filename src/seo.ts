import {
  CREDENTIALS,
  LINKS,
  PROFILE,
  PROJECTS,
  QA_LIST,
  SITE,
  type Project,
} from './content'

export type RouteMeta = {
  route: string
  title: string
  description: string
  canonical: string
  ogType: 'profile' | 'article'
}

const HOME_DESCRIPTION = `${PROFILE.name} is a staff-level product engineer and the founder of Tiercel. He ships AI products end to end: Finly, Investolio and Reelife. Based in Lahore, Pakistan.`

export function projectFor(route: string): Project | undefined {
  const m = /^\/work\/([a-z-]+)$/.exec(route)
  return m ? PROJECTS.find((p) => p.slug === m[1]) : undefined
}

export function routeMeta(route: string): RouteMeta {
  const project = projectFor(route)
  if (project) {
    return {
      route,
      title: `${project.seo.title} | ${PROFILE.name}`,
      description: project.seo.description,
      canonical: `${SITE.url}${route}`,
      ogType: 'article',
    }
  }
  return {
    route: '/',
    title: `${PROFILE.name} | ${PROFILE.headline}`,
    description: HOME_DESCRIPTION,
    canonical: `${SITE.url}/`,
    ogType: 'profile',
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** The <title> and <meta> tags for a route. Replaces <!--meta--> in the template. */
export function headTags(route: string): { title: string; meta: string } {
  const m = routeMeta(route)
  const image = `${SITE.url}/og.png`
  const imageAlt = `${PROFILE.name}: the model call is the easy part, I build the rest.`
  const lines = [
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="author" content="${esc(PROFILE.name)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:type" content="${m.ogType === 'profile' ? 'profile' : 'article'}" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:site_name" content="${esc(PROFILE.name)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    ...(m.ogType === 'profile'
      ? [
          `<meta property="profile:first_name" content="Raffay" />`,
          `<meta property="profile:last_name" content="Sajjad" />`,
        ]
      : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@raffaysajjad" />`,
    `<meta name="twitter:creator" content="@raffaysajjad" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
  ]
  return { title: m.title, meta: lines.join('\n    ') }
}

const personRef = { '@id': `${SITE.url}/#person` }

function person() {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: PROFILE.name,
    url: `${SITE.url}/`,
    image: `${SITE.url}${PROFILE.photo}`,
    jobTitle: PROFILE.role,
    description: `${PROFILE.name} is a staff-level product engineer and the founder of Tiercel, an independent company that builds AI-powered apps like Finly and Investolio.`,
    email: `mailto:${PROFILE.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
    worksFor: [
      { '@type': 'Organization', name: 'Tiercel', url: 'https://tiercel.io' },
      { '@type': 'Organization', name: 'Trafilea Inc.', url: 'https://trafilea.com' },
    ],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Lahore University of Management Sciences (LUMS)' },
      {
        '@type': 'CollegeOrUniversity',
        name: 'National University of Computer and Emerging Sciences (FAST-NUCES)',
      },
    ],
    hasCredential: CREDENTIALS.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: `${c.label}, ${c.detail}, ${c.year}`,
    })),
    knowsAbout: [
      'AI engineering',
      'LLM tool calling',
      'React',
      'Next.js',
      'React Native',
      'Expo',
      'TypeScript',
      'Node.js',
      'Shopify apps',
      'AWS',
    ],
    sameAs: [
      'https://tiercel.io',
      'https://heyfinly.com',
      'https://apps.shopify.com/reelife',
      ...LINKS.map((l) => l.href),
    ],
  }
}

function breadcrumbs(route: string, project?: Project) {
  const items = [{ name: 'Home', url: `${SITE.url}/` }]
  if (project) items.push({ name: project.display, url: `${SITE.url}${route}` })
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

const CATEGORY: Record<string, string> = {
  finly: 'FinanceApplication',
  investolio: 'FinanceApplication',
  reelife: 'BusinessApplication',
}

export function buildJsonLd(route: string): object[] {
  const project = projectFor(route)
  if (!project) {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: `${SITE.url}/`,
        name: `${PROFILE.name}, ${PROFILE.headline}`,
        mainEntity: person(),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: QA_LIST.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      },
    ]
  }

  const about =
    project.kind === 'product'
      ? {
          '@type': 'SoftwareApplication',
          name: project.name,
          url: project.href,
          description: project.tagline,
          applicationCategory: CATEGORY[project.slug],
          operatingSystem: project.platforms,
          author: personRef,
          ...(project.slug === 'reelife'
            ? {}
            : {
                publisher: {
                  '@type': 'Organization',
                  name: 'Tiercel',
                  url: 'https://tiercel.io',
                },
              }),
        }
      : { '@type': 'Organization', name: 'Trafilea Inc.', url: project.href }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: `${SITE.url}${route}`,
      name: project.seo.title,
      description: project.seo.description,
      isPartOf: { '@type': 'WebSite', name: PROFILE.name, url: `${SITE.url}/` },
      author: person(),
      about,
    },
    { '@context': 'https://schema.org', ...breadcrumbs(route, project) },
  ]
}

/** JSON for inline <script> tags; `<` is escaped so content cannot close a tag. */
export function jsonLdScripts(route: string): string {
  return buildJsonLd(route)
    .map(
      (obj) =>
        `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, '\\u003c')}\n</script>`,
    )
    .join('\n    ')
}
