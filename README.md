# Portfolio — Sumanth Kumar Kotagudem

**Live site: https://ksk-17.github.io/portfolio/**

Apple-style personal site built with Vite + React 19. 3D is used sparingly: a tilting headshot card,
CSS-3D contact icons and a COBE education globe. Light/dark toggle in the nav (remembers your choice,
otherwise follows the system). The globe falls back to the school tabs when WebGL is unavailable.

Sections: Hero (with an "I like" interests row), Education, Experience, Skills, Projects, Contact.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/portfolio/
npm test         # vitest
npm run build
npm run deploy   # builds and publishes dist/ to GitHub Pages via gh-pages (https://ksk-17.github.io/portfolio/)
```

## Edit content

All copy lives in `src/data/` (`profile.js`, `education.js`, `experience.js`, `skills.js`, `projects.js`).
`profile.js` also holds the intro text and the hobby chips (`interests`, each with an emoji).

- Headshot: replace `public/avatar.webp`.
- Logos: drop a file in `public/logos/` and set the `logo` field in `src/data/` (e.g. `"logos/sjsu.svg"`). `logo: null` shows a monogram.
- Projects: see [Projects section](#projects-section) below.

## Projects section

Data lives in `src/data/projects.js`; the UI is in `src/components/Projects/`.

**Adding or editing a project** — add an object to the `projects` array (order = display order):

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | yes | Unique id; also seeds the gradient colours of the placeholder cover |
| `title` | yes | |
| `summary` | yes | Take it from the repo's README; if there is none, write it from reading the code. Only describe what exists |
| `tags` | yes | Short chips |
| `github` | yes | `https://github.com/...` (the data test allows `ksk-17`, `CR2004` and `AkankshaThalla-24`; extend it for other owners) |
| `metric` | no | One headline result from the README, shown above the title |
| `context` | no | Small line under the title, e.g. a hackathon or course name |
| `image` | no | Path under `public/`, e.g. `"projects/cardguard.webp"`. Omit to keep the gradient placeholder |

Keep personal to-do notes (what you still plan to improve) out of the data; the site only shows what the project is.

**Images** — use a screenshot from the project's README if it has one: download it to `public/projects/` and set `image`.
Cards without `image` keep the generated gradient cover (`Cover.jsx`).

**More projects card** — the last card links to your GitHub repositories; edit `moreProjects` at the top of `projects.js`.

**Carousel behaviour** — no arrow buttons. Every 10 s the track nudges 90 px and returns, so it reads as scrollable.
The nudge pauses on hover/focus or when the tab is hidden, and is off under `prefers-reduced-motion`.
Keyboard left/right arrows still scroll when the carousel is focused.

When the project count changes, update the count in `src/data/data.test.js`.

## Skills section

Data lives in `src/data/skills.js` (grouped, curated: only the skills that matter, drawn from the resume, profile and projects).
Each item is `{ name, icon? }`. `icon` is a key in `src/components/Skills/skillIcons.js`, which imports individual icons from
the `simple-icons` package (kept explicit so the bundle stays small). To add an icon, import it there and add the key.
Skills with no icon (e.g. Java, AWS, which `simple-icons` no longer ships) show a monogram badge.
