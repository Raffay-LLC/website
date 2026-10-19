import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import './index.css'
import App from './App.tsx'
import { normalizeRoute } from './routes.ts'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App route={normalizeRoute(window.location.pathname)} />
  </StrictMode>
)

// The production build ships prerendered markup (scripts/prerender.mjs), so
// hydrate it. In `yarn dev` the root is empty and the app renders client-side.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
