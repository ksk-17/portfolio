# Portfolio — Sumanth Kumar Kotagudem

Apple-style personal site built with Vite + React 19. 3D is used sparingly: a lazy-loaded
react-three-fiber hero backdrop, a tilting headshot card, CSS-3D contact icons and a COBE education globe.
Every 3D piece has a static fallback (no WebGL, reduced motion, small screens).

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/portfolio/
npm test         # vitest
npm run build
npm run deploy   # builds and publishes dist/ to GitHub Pages via gh-pages
```

## Edit content

All copy lives in `src/data/` (`profile.js`, `education.js`, `experience.js`, `projects.js`).

- Headshot: replace `public/image.png`.
- Logos: drop a file in `public/logos/` and set the `logo` field in `src/data/` (e.g. `"logos/sjsu.svg"`). `logo: null` shows a monogram.
- Project covers are generated gradients; real screenshots can be added later.

## Placeholders still to fill

- SAP role (title, dates, bullets) in `src/data/experience.js`
- SKILL Lab research assistant bullets and start date
- JPMC intern dates (currently overlap the full-time role) and the two GPAs (both 3.67)
- Logos for SJSU, VNR VJIET and JPMorgan Chase
