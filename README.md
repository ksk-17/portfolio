# Portfolio — Sumanth Kumar Kotagudem

Apple-style personal site built with Vite + React 19. 3D is used sparingly: a tilting headshot card,
CSS-3D contact icons and a COBE education globe. Light/dark toggle in the nav (remembers your choice,
otherwise follows the system). The globe falls back to the school tabs when WebGL is unavailable.

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

## Still to fill

- JPMorgan Chase logo (`logo: null` shows a monogram; SJSU, VNR VJIET and SAP logos are included)
- VNR VJIET GPA (currently 3.67, unconfirmed)
- Project cover images (currently generated gradients)
