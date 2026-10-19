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
- `public/_redirects` sends `www.raffaysajjad.com` to the apex domain and provides the SPA fallback.
