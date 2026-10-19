import { renderToString } from 'react-dom/server'
import App from './App'
import { buildKnowledge } from './knowledge'
import { ROUTES } from './routes'
import { headTags, jsonLdScripts } from './seo'
import { SITE } from './content'

export { ROUTES, SITE, buildKnowledge }

/** Build-time only: called by scripts/prerender.mjs, once per route. */
export function render(route: string) {
  const { title, meta } = headTags(route)
  return {
    html: renderToString(<App route={route} />),
    title,
    meta,
    jsonLd: jsonLdScripts(route),
  }
}
