// Build-time prerender. Runs after `vite build` and `vite build --ssr`:
//   - renders every route in src/routes.ts to a string and writes it, with its
//     own <title>, meta tags and JSON-LD, to dist/<route>/index.html so that
//     crawlers that do not run JavaScript see the full page;
//   - writes dist/sitemap.xml from the same route list;
//   - writes netlify/functions/knowledge.json, the content the "Ask about my
//     work" function is grounded in.
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, ROUTES, SITE, buildKnowledge } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
for (const marker of ['<div id="root"></div>', '<!--jsonld-->', '<!--meta-->', '<title>Raffay Sajjad</title>']) {
  if (!template.includes(marker)) {
    throw new Error(`prerender: marker not found in dist/index.html: ${marker}`)
  }
}

// Preload the latin web fonts the first screen uses, so the swap from the
// fallback face lands before first paint and the headline does not reflow.
const assets = await readdir(path.join(dist, 'assets'))
const preload = assets
  .filter((f) => /^(fraunces-latin-opsz-(normal|italic)|geist-latin-wght-normal|geist-mono-latin-wght-normal)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('\n    ')

for (const route of ROUTES) {
  const { html, title, meta, jsonLd } = render(route)
  const page = template
    .replace('<title>Raffay Sajjad</title>', () => `<title>${title.replace(/&/g, '&amp;')}</title>`)
    .replace('<!--meta-->', () => `${meta}\n    ${preload}`)
    .replace('<!--jsonld-->', () => jsonLd)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)

  const out = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, page)
  console.log(`prerendered ${route} -> ${path.relative(root, out)} (${page.length} bytes)`)
}

const urls = ROUTES.map((route) => {
  const loc = route === '/' ? `${SITE.url}/` : `${SITE.url}${route}`
  const priority = route === '/' ? '1.0' : '0.7'
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${SITE.lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}).join('\n')
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
console.log(`wrote dist/sitemap.xml (${ROUTES.length} urls)`)

await mkdir(path.join(root, 'netlify/functions'), { recursive: true })
await writeFile(
  path.join(root, 'netlify/functions/knowledge.json'),
  JSON.stringify(buildKnowledge(), null, 2) + '\n',
)
console.log('wrote netlify/functions/knowledge.json')

await rm(ssrDir, { recursive: true, force: true })
