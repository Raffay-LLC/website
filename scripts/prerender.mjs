// Build-time prerender. Runs after `vite build` and `vite build --ssr`:
// renders <App /> to a string and writes it, plus the JSON-LD, into
// dist/index.html so crawlers that do not run JavaScript see the full page.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const htmlPath = path.join(root, 'dist/index.html')
const ssrDir = path.join(root, 'dist-ssr')

const { render } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)
const { html, jsonLd } = render()

let template = await readFile(htmlPath, 'utf8')

for (const marker of ['<div id="root"></div>', '<!--jsonld-->']) {
  if (!template.includes(marker)) {
    throw new Error(`prerender: marker not found in dist/index.html: ${marker}`)
  }
}

template = template
  .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
  .replace('<!--jsonld-->', () => jsonLd)

await writeFile(htmlPath, template)
await rm(ssrDir, { recursive: true, force: true })
console.log(`prerendered dist/index.html (${template.length} bytes)`)
