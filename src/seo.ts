import { LINKS, PROFILE, isTodo } from './content'

/**
 * Structured data for the page, generated from content.ts so it cannot drift
 * from what is rendered. Used at build time by scripts/prerender.mjs (through
 * src/entry-server.tsx).
 */
export function buildJsonLd() {
  const sameAs = [
    'https://tiercel.io',
    'https://heyfinly.com',
    ...LINKS.filter((l) => !isTodo(l.href)).map((l) => l.href),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: PROFILE.url + '/',
    name: `${PROFILE.name}, ${PROFILE.headline}`,
    mainEntity: {
      '@type': 'Person',
      name: PROFILE.name,
      url: PROFILE.url + '/',
      image: PROFILE.url + PROFILE.photo,
      jobTitle: PROFILE.role,
      description: `${PROFILE.name} is a ${PROFILE.headline.charAt(0).toLowerCase()}${PROFILE.headline.slice(1)}, where he builds AI-powered apps like Finly and Investolio.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressCountry: 'PK',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Tiercel',
        url: 'https://tiercel.io',
      },
      knowsAbout: [
        'AI engineering',
        'React Native',
        'Expo',
        'mobile apps',
        'TypeScript',
      ],
      sameAs,
    },
  }
}

/** JSON for an inline <script>; `<` is escaped so content cannot close the tag. */
export function jsonLdScript() {
  const json = JSON.stringify(buildJsonLd(), null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}
