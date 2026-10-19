# raffaysajjad.com

Personal site of Raffay Sajjad. Vite, React and TypeScript, deployed on Netlify.

## Develop

```sh
yarn install
yarn dev        # local dev server
yarn build      # type-check and build to dist/
yarn preview    # serve the production build
yarn lint
```

## Editing content

Everything on the page lives in `src/content.ts` (`PROFILE`, `NOW`, `WORK`, `WRITING`, `LINKS`). `src/App.tsx` only renders it.

Unfilled values are marked `TODO(raffay)` and show up on the page with a visible "placeholder" flag. Run `grep -rn "TODO(raffay)" src` to list them. To update the Now log, add an entry to `NOW` and bump `PROFILE.updated`.

## Notes

- Fonts (Newsreader, JetBrains Mono) are self-hosted through `@fontsource-variable`.
- `public/_redirects` sends `www.raffaysajjad.com` to the apex domain, serves `/` from `index.html` and returns a real 404 (`public/404.html`) for every other path.
- Prerendering: `yarn build` also builds `src/entry-server.tsx` (`renderToString`) and `scripts/prerender.mjs` writes the rendered markup and the JSON-LD (`src/seo.ts`, generated from `content.ts`) into `dist/index.html`, so crawlers that do not run JavaScript see the full page. The client hydrates it (`src/main.tsx`). Check with `curl -s -A "OAI-SearchBot" <url> | grep "<h1"`.
- `public/robots.txt` allows search, citation and training bots. To opt out of training, flip the Allow lines for GPTBot, ClaudeBot, Google-Extended, Applebot-Extended and CCBot.

## Measurement (not implemented)

- Google Search Console and Bing Webmaster Tools (including the AI Performance report).
- A GA4 custom channel group "AI Assistants", above Referral, with source regex `chatgpt.com|chat.openai.com|perplexity.ai|claude.ai|gemini.google.com|copilot.microsoft.com|edgeservices.bing.com`.
- A monthly panel of 20 to 30 prompts across ChatGPT, Perplexity, Claude, Gemini and AI Mode.
