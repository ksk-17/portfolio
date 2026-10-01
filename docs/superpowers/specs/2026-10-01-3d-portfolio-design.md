# 3D Portfolio Revamp — Design Spec

Date: 2026-10-01 · Approach: **A — Hybrid "Apple product page"**

## 1. Intent

A portfolio for Sumanth Kumar Kotagudem aimed at recruiters and research labs (industry research roles, collaboration with professors/PhD students). It should read like an Apple product page: clean, generous whitespace, large type, restrained motion. 3D is used in a few deliberate moments, not as a full-screen scene. Recruiters skim, so every section must be readable in seconds, on mobile, and without WebGL.

**Success criteria**
- First paint of readable content < 2 s on a mid-range laptop; total JS < ~350 KB gzipped (three.js loaded lazily, only for the hero backdrop).
- Every section has one signature interaction and still works with `prefers-reduced-motion` and with WebGL unavailable.
- Looks right at 375 px, 768 px, 1440 px wide.
- Deploys to GitHub Pages at `https://ksk-17.github.io/portfolio` via the existing `npm run deploy`.
- Skills and Certifications sections are not present.

## 2. Sections

| # | Section | Signature interaction |
|---|---|---|
| 1 | **Intro** | Headshot in a floating glass card that tilts toward the pointer (CSS 3D, parallax layers) over a lazy-loaded R3F backdrop of soft floating shapes. Name, typed rotating role line (ML Engineer / Researcher / Software Engineer), 2–3 line intro, then the **contact dock**. |
| 2 | **Education** | A COBE globe with two pins (San Jose, Hyderabad) joined by an arc. Drag to rotate; click a pin (or swipe the card carousel under the globe) and the globe eases to that location while a detail panel swaps in (logo, degree, dates, GPA, coursework, projects). |
| 3 | **Experience** | Vertical stack of cards that pin and slide over each other as you scroll (JPMC SWE, JPMC intern, SAP, SJSU SKILL Lab research assistant). Each card: logo, role, dates, 3–4 headline bullets, "expand" for the rest. |
| 4 | **Projects** | Horizontal scroll-snap row of tall cards: cover art, title, one-line summary, tech tags, GitHub link; 3D tilt on hover. Arrow buttons + keyboard + swipe. |
| 5 | **Contact** | Lives in the Intro as a **dock of 3D icon tiles**: Email, LinkedIn, GitHub, Kaggle (+ resume if provided). Tiles are chunky, glossy, with depth; hover tilts and lifts, click plays a press-and-spin animation, then performs the action (mailto / open link). Email also offers copy-to-clipboard with a toast. The old EmailJS form is dropped. |

Sticky top nav: translucent blur bar (Apple style) with section anchors and active-section highlight; collapses to a menu button on mobile.

## 3. Technical design

**Stack**
- **Vite + React 19** replacing Create React App (CRA is deprecated). Vite `base: "/portfolio/"`; keep `gh-pages -d dist`.
- **Motion (framer-motion)** for scroll reveals, shared transitions, tilt springs.
- **COBE** for the globe (≈5 KB); markers are HTML buttons positioned with CSS anchor/projection so they are accessible and clickable.
- **@react-three/fiber + drei + three**, loaded with `React.lazy` + `Suspense`, used only for the hero backdrop. Skipped on small screens, `prefers-reduced-motion`, or no WebGL (static gradient fallback).
- Contact icons use **CSS 3D transforms** (layered faces + shadows, SVG glyphs), not WebGL, to avoid multiple canvases/contexts and keep them crisp and cheap.
- Plain CSS with design tokens (custom properties) for colour, type scale, radius, shadow; light and dark via `prefers-color-scheme`. MUI is removed to cut bundle size and escape the "default Material" look.
- Font: Inter (or SF-like system stack with Inter fallback), large weight contrast.

**Structure**
```
src/
  main.jsx, App.jsx
  styles/tokens.css, global.css
  data/        profile.js education.js experience.js projects.js
  components/
    Nav/  Hero/ (HeadshotCard, Backdrop3D, RoleTicker)  ContactDock/ (Icon3D)
    Education/ (Globe, SchoolPanel)  Experience/ (StackCard)
    Projects/ (ProjectCard, Cover)  ui/ (Reveal, Toast)
  hooks/ useReducedMotion, useWebGL, useActiveSection
public/  logos/  headshot.*  projects/
```
Content lives in `src/data/*` so copy edits never touch components. Each component takes plain props and has one job.

**Assets and fallbacks (nothing blocks the build)**
- Headshot: existing `public/image.png`, shown with a duotone ring/parallax treatment; swap in a stylized/illustrated version later by replacing one file. Photo-to-3D avatar services are not used (Ready Player Me shut down Jan 2026; others are paid/unvetted).
- Logos for SJSU, VNR VJIET, JPMC, SAP: fetched from official/Wikimedia sources where licence permits; otherwise monogram placeholders.
- Project covers: generated per-project gradient/SVG cover art (no screenshots available); replaceable by `public/projects/<slug>.png`.

**Content to be carried over / corrected**
- Carry over: intro text (shortened), JPMC role bullets (condensed), 5 projects, education coursework, links (LinkedIn `ksk-17`, GitHub `ksk-17`, Kaggle `ksk872`, email `sumanthkumarkotagudem@gmail.com`).
- Fix: "INdia" typo; "Intellignece"; JPMC intern dates (`Jan'23 – May'24` overlaps full-time start Jun'23 — needs confirming).
- **Missing, will be placeholders until supplied:** SAP role (title, dates, bullets); SKILL Lab RA bullets beyond the intro paragraph; M.S. vs B.Tech GPA (both currently 3.67 — possible copy error); resume file; project metrics/screenshots.

## 4. Behaviour details

- **Reduced motion / no WebGL:** all animations become fades or are removed; globe shows static with pins still clickable; backdrop is a CSS gradient.
- **Keyboard/a11y:** pins, dock icons, cards and carousel controls are real buttons/links with labels; visible focus rings; colour contrast ≥ 4.5:1.
- **Performance:** lazy-load three.js and globe; images `loading="lazy"` with dimensions; pause globe/backdrop rendering when off-screen (IntersectionObserver); cap DPR at 2.
- **Errors:** WebGL context failure → fallback render, no crash; clipboard failure → toast shows the address to copy manually.

## 5. Verification (via Playwright MCP + build)

1. `npm run build` succeeds; bundle sizes reported.
2. Screenshots at 375 / 768 / 1440 px for each section, light and dark.
3. Interaction checks: nav scroll, pin click swaps panel, project carousel, dock click behaviours, reduced-motion emulation, WebGL-disabled fallback.
4. No console errors; all outbound links resolve.

## 6. Out of scope

Skills section, certifications section, blog, CMS, audio, playable 3D world, full-screen scroll-driven R3F scene (approach B), photo-to-3D-avatar generation.

## 7. Delivery plan (high level; detailed plan comes after spec approval)

1. Scaffold Vite, tokens, nav, data files, deploy config.
2. Hero + contact dock.
3. Education globe.
4. Experience stack.
5. Projects carousel.
6. Polish, a11y, performance, Playwright verification, deploy.

Work happens in a git worktree so your current uncommitted edits stay untouched.
