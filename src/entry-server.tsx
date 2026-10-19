import { renderToString } from 'react-dom/server'
import App from './App'
import { jsonLdScript } from './seo'

/** Build-time only: called by scripts/prerender.mjs. */
export function render() {
  return {
    html: renderToString(<App />),
    jsonLd: jsonLdScript(),
  }
}
