# AGENTS.md

React 18 fan site for Twenty One Pilots, built with Vite. Deployed on Vercel.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — production build to `dist/`.
- `npm run lint` — ESLint; Prettier is enforced as an **error** (`prettier/prettier`). Run this after edits.
- Many pre-existing files use CRLF line endings and currently fail `prettier/prettier`. Do not reformat unrelated files; check only changed JS/JSX with `npx eslint <paths>`.
- `npm run preview` — serve the production build.
- There is no test script or test suite. Do not invent one.

Prettier config: double quotes, semicolons, 2-space indent. ESLint ignores `dist/`.

## Architecture

- SPA entry: `src/main.jsx` → `src/App.jsx`, which owns all routes (`/`, `/discography`, `/discography/:type/:albumName`, `/tour`, `/lore`, `/games`, `/games/:gameId`).
- Pages live in `src/pages/<Name>Page/`, components in `src/components/<Name>/`; each component folder colocates its own CSS file.
- Music data is in `src/data/` and re-exported through `src/data/index.js` (`ALBUMS`, `LIVE_ALBUMS`, `EXTENDED_PLAYS`, `SINGLES`, `MEMBERS`). Lore data is in `src/data/lore/*.js` and imported per-file, not through the barrel.
- Album URLs are derived, not stored: slug is `name.toLowerCase().replace(/\s+/g, "-")`, and `:type` must be one of `albums`, `live-albums`, `extended-plays`, `singles` (see `src/pages/AlbumPage/AlbumPage.jsx:17`). Adding an album requires putting it in the matching array.
- Lore items are `{ name, description, img }` and render via `LoreCard` with `type` = `ally` | `villain` | `location` | `concept` | `symbol`.
- Games are in `src/data/games.js` as `GAMES` (`{ id, name, description, image, status }`). `GamesPage` renders `GameCard`s in an auto-fill grid; `/games/:gameId` maps known IDs to components in `GamePage` (`guess-the-songs` → `SongGuesser`) and keeps the coming-soon placeholder for everything else.
- `SongGuesser` (`src/components/Games/SongGuesser/`) quizzes studio albums from `ALBUMS` only. Matching/index helpers live in `src/utils/songGuesser.js`; normalization ignores case, accents, punctuation, extra spaces, and parenthetical/bracketed suffixes. The best run persists in localStorage under `top-fan:song-guesser:best:v1`, and results render through `src/components/Games/GameResultModal/`.
- Imports use `react-router` (not `react-router-dom`), even though both are installed.

## Asset handling (easy to get wrong)

- Album/member data stores string paths like `"/covers/albums/vessel.webp"` / `"/members/tyler.png"`. These are resolved by `getAssetUrl` in `src/utils/assets.js`, which relies on `import.meta.glob`. New covers must go under `src/assets/covers/**` and new member images under `src/assets/members/**`, then be referenced through `getAssetUrl`.
- Lore data instead imports image files directly (e.g. `import clancyImg from "../../assets/lore/allies/clancy.webp"`). Follow that pattern for lore.
- Other one-off images (including `src/data/games.js` cover art) are imported directly as modules.

## Tour API / deployment

- `api/tour.js` is a Vercel serverless function that proxies Bandsintown and formats events as `{ date, location, venue, tickets }`, with CORS and 24h edge caching headers.
- Vite does **not** serve `/api/tour` during `npm run dev`; `TourPage` will show its error state. Test the function with `npx vercel dev` instead of plain `vite`.
- `vercel.json` rewrites all non-`/api/` paths to `index.html` for client-side routing. Deployment is through Vercel (no CI workflows or GitHub Actions in the repo).
- `scraping-test.js` is a standalone Playwright scratch script (`node scraping-test.js`), not part of the app or npm scripts; it scrapes the official tour page and needs Playwright browsers installed.
