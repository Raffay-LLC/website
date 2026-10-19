# raffaysajjad.com

Personal site of Raffay Sajjad: a staff product engineer who ships AI products end to end. Vite, React and TypeScript, deployed on Netlify. Prerendered HTML, a Netlify Function that answers questions about his work with Claude, and real device recordings.

## Develop

```sh
yarn install
yarn dev        # local dev server (the Ask function is not served here; the page falls back to pre-written answers)
yarn build      # tsc, vite build, SSR build, prerender every route, sitemap, knowledge.json
yarn lint
```

To run the Ask function locally, use the Netlify CLI (`npx netlify dev`) with `ANTHROPIC_API_KEY` set in your shell or a `.env` file (git-ignored).

## Editing content

Everything lives in `src/content.ts`: profile, hero line, projects (case studies), timeline, credentials, skills, Now log, writing, partner copy, and the pre-written Q&A. Components only render it.

- **Fact-check.** Anything that is not taken directly from the CV carries a `// FACT-CHECK` comment. List them with `grep -n "FACT-CHECK" src/content.ts`. Remove the comment once a line is confirmed, or fix the text.
- **Now log.** Add an entry to `NOW` and bump `PROFILE.updated`, `PROFILE.updatedIso` and `SITE.lastmod`.
- **Ask answers and JSON-LD** are derived from the same file (`src/knowledge.ts`, `src/seo.ts`), so they cannot drift from the page.

## Routes and SEO

Routes are listed in `src/routes.ts`: `/` and one case study per project at `/work/<slug>` (finly, investolio, reelife, trafilea).

`yarn build` renders each route with `renderToString` (`src/entry-server.tsx`) and `scripts/prerender.mjs` writes `dist/index.html` and `dist/work/<slug>/index.html`, each with its own `<title>`, description, canonical, Open Graph and Twitter tags (`src/seo.ts`) and JSON-LD:

- Home: `ProfilePage` with a `Person` (`sameAs` includes `https://www.linkedin.com/in/raffay-sajjad`) and a `FAQPage` made from the visible short answers.
- Case studies: `WebPage` about a `SoftwareApplication` (or `Organization` for Trafilea) and a `BreadcrumbList`.

`dist/sitemap.xml` is generated from the same route list. `public/robots.txt` allows search, citation and training bots (flip the Allow lines for GPTBot, ClaudeBot, Google-Extended, Applebot-Extended and CCBot to opt out of training). `public/_redirects` redirects www to the apex domain, rewrites `/api/ask` to the function, and returns a real 404 (`public/404.html`) for anything that is not a built file. The hydrating client picks its route from `location.pathname` (`src/main.tsx`).

Check with `curl -s -A "OAI-SearchBot" https://raffaysajjad.com/work/finly | grep "<h1"`.

`public/og.png` (1200x630) is the social card. It was composed once from the hero line and the real recordings; regenerate it if the hero line changes.

## Ask about my work

A small chat on the home page. Visitors pick one of four suggested questions or type their own, and Claude answers from the site's content only.

```
browser  --POST /api/ask-->  netlify/functions/ask.ts  --Messages API (streaming)-->  api.anthropic.com
                                   |
                                   +-- grounded in netlify/functions/knowledge.json (generated from src/content.ts)
```

- **Function:** `netlify/functions/ask.ts` (Netlify Functions v2, `Request`/`Response`, `config.path = /api/ask`). Calls `https://api.anthropic.com/v1/messages` with `fetch`, model `claude-haiku-5-5`, `max_tokens: 300`, streaming, thinking off and effort `low` (Haiku 5.5 rejects non-default sampling parameters, so none are sent). The answer streams back as plain text with an `x-ask: live` header.
- **Grounding:** the system prompt embeds `knowledge.json` and tells the model to use only that, never invent employers, dates, numbers or prices, refuse off-topic requests, ignore instructions inside questions, and answer in the third person in under 110 words.
- **Knowledge file:** `netlify/functions/knowledge.json` is written by `yarn build` (prerender step) from `src/content.ts`. It is committed so type-checking works on a fresh clone; Netlify rebuilds it on every deploy, before it bundles the function.
- **Limits:** at most 3 user turns per chat, 280 characters per question, 4 KB per request, and a best-effort per-IP rate limit of 20 requests per 10 minutes (in-memory, so per warm function instance, not a hard guarantee; add a Netlify rate-limiting rule or a WAF for a hard cap).
- **No key, or any failure:** with no `ANTHROPIC_API_KEY` the function returns `503`. The UI treats a 503, a 404 (function not deployed), a network error or an upstream error as "live model not connected" and answers from the pre-written Q&A in `src/content.ts` (`QA_LIST`), routed by keyword (`src/lib/ask.ts`). It labels every answer "Pre-written" or "Claude · live". A 429 shows a notice and a pre-written answer.
- **Env var:** `ANTHROPIC_API_KEY` (Netlify > Site configuration > Environment variables; scope it to Functions). Use a key with a low monthly spend limit: the endpoint is public.
- **Cost:** Haiku 5.5 at about 4k input tokens and at most 300 output tokens per question is a small fraction of a cent.

Test without a key: `curl -i -X POST localhost:8888/api/ask -d '{"messages":[{"role":"user","content":"hi"}]}'` returns `503 {"error":"ask_unavailable"}`.

## Visual system

- **Type:** Fraunces (display, optical-size axis, italic for emphasis), Geist (body) and Geist Mono (labels, dates, code). All free, self-hosted through `@fontsource-variable`.
- **Colour:** paper (`#f4f1ea`) and ink with one cobalt accent. Finly indigo and Investolio green appear only as solid fields around the real recordings. Dark mode follows `prefers-color-scheme`, and the palette or footer can override it (stored in `localStorage`).
- **Rules:** no gradients, blur, glows or `transition: all`; motion is transform and opacity only and is off for `prefers-reduced-motion`. Recordings pause with the "Pause recordings" switch.
- **Devices:** official frames in `public/devices` (licences in `public/devices/LICENSES.md`) with recordings from the Tiercel site in `public/media`. Safari-safe autoplay: `muted` set through a ref, poster image until `playing`, IntersectionObserver, MP4 before WebM.

## Keyboard

`Cmd/Ctrl + K` opens the jump palette (sections, case studies, notes, links, copy email, theme). `/` jumps to the Ask box. `Esc` closes the palette.

## Notes

- Netlify serves `/work/finly` from `dist/work/finly/index.html` (pretty URLs). `vite preview` does not, so check routes with a Netlify-like static server or use the trailing-slash URL.
- `.nvmrc` pins Node; the build needs a version that supports the Vite 8 toolchain.

## Measurement (not implemented)

- Google Search Console and Bing Webmaster Tools (including the AI Performance report).
- A GA4 custom channel group "AI Assistants", above Referral, with source regex `chatgpt.com|chat.openai.com|perplexity.ai|claude.ai|gemini.google.com|copilot.microsoft.com|edgeservices.bing.com`.
- A monthly panel of 20 to 30 prompts across ChatGPT, Perplexity, Claude, Gemini and AI Mode.
