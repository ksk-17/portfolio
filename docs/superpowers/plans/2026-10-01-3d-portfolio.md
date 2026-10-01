# 3D Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Create React App/MUI portfolio with a clean, Apple-style Vite + React site that has a tilting headshot hero, 3D contact-icon dock, interactive education globe, stacked experience cards and a project carousel.

**Architecture:** Mostly plain React + CSS (design tokens, light/dark) with Motion for animation. 3D appears in exactly four places: a lazy-loaded react-three-fiber hero backdrop, CSS-3D headshot card, CSS-3D contact icons, and a COBE globe whose pins are real HTML buttons positioned by a tested projection function. All copy lives in `src/data/*`; every 3D piece has a static fallback (no WebGL / reduced motion / narrow screens).

**Tech Stack:** Vite, React 19, Motion (`motion/react`), COBE, three + @react-three/fiber + @react-three/drei (lazy), Vitest + Testing Library + jsdom, Playwright MCP for visual checks, gh-pages.

**Spec:** `docs/superpowers/specs/2026-10-01-3d-portfolio-design.md`

## Global Constraints

- Vite + React 19 replace Create React App; Vite `base: "/portfolio/"`; deploy script `gh-pages -d dist`; homepage `https://ksk-17.github.io/portfolio`.
- MUI and EmailJS (contact form, `.env`) are removed. No Skills section, no Certifications section.
- Total JS < ~350 KB gzipped with three.js loaded lazily (`React.lazy`) and only for the hero backdrop.
- 3D backdrop is skipped when WebGL is unavailable, `prefers-reduced-motion` is set, or viewport < 768 px; globe falls back to the school tabs only.
- Layouts must work at 375 px, 768 px and 1440 px with no horizontal page scroll.
- Colours/type/radius/shadow are CSS custom properties in `src/styles/tokens.css`; dark mode via `prefers-color-scheme`; text contrast ≥ 4.5:1; all interactive elements are real `<a>`/`<button>` with labels and visible focus.
- Contact links (exact): email `sumanthkumarkotagudem@gmail.com`; LinkedIn `https://www.linkedin.com/in/ksk-17/`; GitHub `https://github.com/ksk-17`; Kaggle `https://www.kaggle.com/ksk872`.
- Fix copy typos while migrating: "INdia" → "India", "Intellignece" → "Intelligence".
- Content that does not exist yet (SAP role, SKILL Lab bullets, logos, screenshots, resume) uses clearly marked placeholders and must never break layout.
- Work happens in a git worktree on branch `revamp-3d` so the user's uncommitted edits on `master` are untouched.
- Every commit message ends with the trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (pass as a second `-m`).
- Test command: `npx vitest run` (from the worktree root). Build: `npm run build`.

## Review Focus

1. **WebGL unavailable or cobe throws** → Education still shows tabs + panel; page does not crash (Task 6 tests).
2. **Clipboard API missing/rejected** → email tile still works and the toast shows the address to copy by hand (Task 5 test).
3. **Logo image 404s** → monogram fallback renders, not a broken-image icon (Task 2 test).
4. **375 px viewport** → no horizontal overflow, nav collapses to menu (Task 9 Playwright check).
5. **Deployed under `/portfolio/`** → all asset URLs go through `asset()` using `BASE_URL`; a root-relative `/image.png` would 404 on GitHub Pages (Task 0 test).

---

## File Structure

```
index.html                         # Vite entry, fonts, meta
vite.config.js                     # base, react plugin, vitest config
src/main.jsx                       # mounts <App/>
src/App.jsx                        # MotionConfig + Nav + sections
src/styles/tokens.css global.css   # design tokens, resets, shared classes
src/test/setup.js                  # jsdom mocks (matchMedia, IO, canvas)
src/lib/asset.js                   # BASE_URL-aware asset paths
src/data/{profile,education,experience,projects}.js
src/hooks/{useWebGL,useActiveSection}.js
src/components/ui/{Reveal,Logo,Toast}.jsx
src/components/Nav/Nav.jsx + Nav.css
src/components/Hero/{Hero,HeadshotCard,RoleTicker,Backdrop3D}.jsx + Hero.css
src/components/ContactDock/{ContactDock,Icon3D,glyphs}.jsx + ContactDock.css
src/components/Education/{Education,Globe,SchoolPanel,globeMath}.jsx|js + Education.css
src/components/Experience/{Experience,StackCard}.jsx + Experience.css
src/components/Projects/{Projects,ProjectCard,Cover}.jsx + Projects.css
src/components/Footer.jsx
```

---

### Task 0: Worktree, Vite scaffold, tokens, test harness

**Files:**
- Create: `index.html`, `vite.config.js`, `package.json` (rewrite), `src/main.jsx`, `src/App.jsx`, `src/styles/tokens.css`, `src/styles/global.css`, `src/test/setup.js`, `src/lib/asset.js`, `src/lib/asset.test.js`, `src/App.test.jsx`
- Delete (in worktree): all CRA `src/**`, `public/index.html`, `public/skill-logos/**`, `.env`, `package-lock.json`
- Keep: `public/image.png`, `.gitignore` (append `dist`)

**Interfaces:**
- Produces: `asset(path: string): string` in `src/lib/asset.js` (prefixes `import.meta.env.BASE_URL`, strips leading `/`); test setup providing `matchMedia`, `IntersectionObserver`, `ResizeObserver`, `canvas.getContext → null` mocks; CSS variables `--bg --surface --text --muted --line --accent --radius --shadow --font --nav-h`.

- [ ] **Step 1: Create the worktree and strip CRA**

```bash
cd /d/data-science/portfolio
git worktree add ../portfolio-3d -b revamp-3d
cd ../portfolio-3d
git rm -rq src public/skill-logos public/index.html .env package-lock.json
printf "\ndist\n" >> .gitignore
```

- [ ] **Step 2: Write `package.json` and install**

```json
{
  "name": "portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://ksk-17.github.io/portfolio",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

```bash
npm install react@19 react-dom@19 motion cobe three @react-three/fiber @react-three/drei
npm install -D vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event gh-pages
```
Expected: installs without peer-dependency errors (React 19 is supported by @react-three/fiber 9).

- [ ] **Step 3: Write the failing tests**

`src/lib/asset.test.js`:
```js
import { describe, it, expect } from "vitest";
import { asset } from "./asset";

describe("asset", () => {
  it("prefixes the Vite base URL", () => {
    expect(asset("image.png")).toBe(`${import.meta.env.BASE_URL}image.png`);
  });
  it("strips a leading slash so GitHub Pages subpath works", () => {
    expect(asset("/logos/sap.svg")).toBe(`${import.meta.env.BASE_URL}logos/sap.svg`);
    expect(asset("/logos/sap.svg").startsWith("//")).toBe(false);
  });
});
```

`src/App.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the page heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sumanth Kumar Kotagudem");
});
```

- [ ] **Step 4: Run to verify failure**

Run: `npx vitest run`
Expected: FAIL (modules `./asset`, `./App` not found; no vite config yet).

- [ ] **Step 5: Implement scaffold**

`vite.config.js`:
```js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/portfolio/",
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: "./src/test/setup.js", css: false },
});
```

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sumanth Kumar Kotagudem — AI Engineer & Researcher</title>
    <meta name="description" content="Portfolio of Sumanth Kumar Kotagudem: AI engineer and researcher working on knowledge-graph-grounded LLMs and neuro-symbolic vision reasoning." />
    <meta name="theme-color" content="#fbfbfd" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`src/lib/asset.js`:
```js
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, "");
```

`src/main.jsx`:
```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.jsx` (stub, grows in later tasks):
```jsx
import { MotionConfig } from "motion/react";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <h1>Sumanth Kumar Kotagudem</h1>
      </main>
    </MotionConfig>
  );
}
```

`src/styles/tokens.css`:
```css
:root {
  --bg: #fbfbfd;
  --surface: #ffffff;
  --surface-2: #f5f5f7;
  --text: #1d1d1f;
  --muted: #6e6e73;
  --line: rgba(0, 0, 0, 0.08);
  --accent: #0071e3;
  --radius: 28px;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  --font: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
  --nav-h: 56px;
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --surface: #1c1c1e;
    --surface-2: #2c2c2e;
    --text: #f5f5f7;
    --muted: #a1a1a6;
    --line: rgba(255, 255, 255, 0.12);
    --accent: #2997ff;
    --shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  }
}
```

`src/styles/global.css`:
```css
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0; background: var(--bg); color: var(--text); font-family: var(--font);
  line-height: 1.5; -webkit-font-smoothing: antialiased; overflow-x: clip;
}
img { max-width: 100%; display: block; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; border-radius: 8px; }

.section { max-width: 1100px; margin: 0 auto; padding: clamp(72px, 11vw, 150px) 24px 0; scroll-margin-top: var(--nav-h); }
.section__title { font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.03em; line-height: 1.05; margin: 0 0 12px; font-weight: 700; }
.section__sub { color: var(--muted); font-size: clamp(1.05rem, 2vw, 1.35rem); max-width: 640px; margin: 0 0 40px; }
.eyebrow { color: var(--muted); font-weight: 500; margin: 0 0 8px; }

.skip-link { position: absolute; left: -999px; top: 8px; background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 999px; z-index: 100; }
.skip-link:focus { left: 12px; }

.logo { border-radius: 12px; object-fit: contain; background: #fff; flex: none; }
.logo--mono { display: inline-grid; place-items: center; font-weight: 700; font-size: 0.8rem; color: #fff; background: linear-gradient(135deg, #0071e3, #6e5bff); }

.toast {
  position: fixed; left: 50%; bottom: 28px; transform: translate(-50%, 24px); opacity: 0; pointer-events: none;
  background: var(--text); color: var(--bg); padding: 12px 20px; border-radius: 999px; font-size: 0.95rem;
  transition: opacity 0.25s, transform 0.25s; z-index: 60; max-width: calc(100vw - 32px);
}
.toast[data-show="true"] { opacity: 1; transform: translate(-50%, 0); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

`src/test/setup.js`:
```js
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

window.matchMedia = window.matchMedia || ((query) => ({
  matches: false, media: query, onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
}));

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
globalThis.IntersectionObserver = globalThis.IntersectionObserver || NoopObserver;
globalThis.ResizeObserver = globalThis.ResizeObserver || NoopObserver;

HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
Element.prototype.scrollBy = Element.prototype.scrollBy || vi.fn();
```

- [ ] **Step 6: Run to verify pass**

Run: `npx vitest run`
Expected: PASS (3 tests).

- [ ] **Step 7: Verify dev build and commit**

Run: `npm run build`
Expected: build succeeds, `dist/` created.

```bash
git add -A
git commit -m "chore: replace CRA with Vite scaffold, tokens and test harness" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 1: Content data files

**Files:**
- Create: `src/data/profile.js`, `src/data/education.js`, `src/data/experience.js`, `src/data/projects.js`, `src/data/data.test.js`

**Interfaces:**
- Produces (all named exports):
  - `profile: { name, shortName, roles: string[], lede, email, headshot, links: { linkedin, github, kaggle } }`
  - `education: Array<{ id, school, shortName, degree, dates, gpa, location: { label, lat, lng }, logo, coursework: string[], highlights: Array<{ title, text }> }>`
  - `experience: Array<{ id, role, company, dates, logo, summary: string[], details: string[], placeholder?: true }>`
  - `projects: Array<{ slug, title, summary, metric?, tags: string[], github }>`

- [ ] **Step 1: Write the failing test**

`src/data/data.test.js`:
```js
import { describe, it, expect } from "vitest";
import { profile } from "./profile";
import { education } from "./education";
import { experience } from "./experience";
import { projects } from "./projects";

const allText = JSON.stringify({ profile, education, experience, projects });

describe("content data", () => {
  it("has the exact contact links", () => {
    expect(profile.email).toBe("sumanthkumarkotagudem@gmail.com");
    expect(profile.links.linkedin).toBe("https://www.linkedin.com/in/ksk-17/");
    expect(profile.links.github).toBe("https://github.com/ksk-17");
    expect(profile.links.kaggle).toBe("https://www.kaggle.com/ksk872");
  });
  it("education entries have unique ids and valid coordinates", () => {
    expect(new Set(education.map((e) => e.id)).size).toBe(education.length);
    education.forEach((e) => {
      expect(Math.abs(e.location.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(e.location.lng)).toBeLessThanOrEqual(180);
      expect(e.coursework.length).toBeGreaterThan(0);
    });
  });
  it("experience covers JPMC, SAP and the research role with unique ids", () => {
    expect(new Set(experience.map((e) => e.id)).size).toBe(experience.length);
    const companies = experience.map((e) => e.company).join("|");
    expect(companies).toMatch(/JPMorgan/);
    expect(companies).toMatch(/SAP/);
    expect(companies).toMatch(/SKILL Lab/);
  });
  it("every project has a GitHub https link, tags and a summary", () => {
    expect(projects.length).toBe(5);
    projects.forEach((p) => {
      expect(p.github).toMatch(/^https:\/\/github\.com\/ksk-17\//);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(40);
    });
  });
  it("has fixed the known typos", () => {
    expect(allText).not.toMatch(/INdia|Intellignece/);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/data`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement data files**

`src/data/profile.js`:
```js
export const profile = {
  name: "Sumanth Kumar Kotagudem",
  shortName: "Sumanth",
  roles: ["ML Engineer", "ML Researcher", "Software Engineer"],
  lede:
    "I build generalizable, explainable AI. M.S. in Artificial Intelligence at San José State University (graduating Fall 2026), previously Software Engineer at JPMorgan Chase. I'm looking for industry research roles and collaborations in knowledge-graph-grounded LLMs and neuro-symbolic vision reasoning.",
  email: "sumanthkumarkotagudem@gmail.com",
  headshot: "image.png",
  links: {
    linkedin: "https://www.linkedin.com/in/ksk-17/",
    github: "https://github.com/ksk-17",
    kaggle: "https://www.kaggle.com/ksk872",
  },
};
```

`src/data/education.js`:
```js
export const education = [
  {
    id: "sjsu",
    school: "San José State University",
    shortName: "SJSU",
    degree: "M.S. in Artificial Intelligence",
    dates: "Jan 2025 – Dec 2026",
    gpa: "3.67",
    location: { label: "San Jose, California", lat: 37.3352, lng: -121.8811 },
    logo: "logos/sjsu.svg",
    coursework: [
      "Machine Learning",
      "Artificial Intelligence and Data Engineering",
      "Math for Data Science",
      "Reinforcement Learning",
      "Natural Language Processing",
      "Recommender Systems",
    ],
    highlights: [
      {
        title: "Master's thesis — Neuro-Symbolic Vision Reasoning Models",
        text: "Strengthening visual reasoning by combining neural learning with structured symbolic reasoning.",
      },
    ],
  },
  {
    id: "vnr",
    school: "VNR Vignana Jyothi Institute of Engineering and Technology",
    shortName: "VNR VJIET",
    degree: "B.Tech in Computer Science and Business Systems",
    dates: "Aug 2019 – May 2023",
    gpa: "3.67",
    location: { label: "Hyderabad, India", lat: 17.54, lng: 78.386 },
    logo: "logos/vnrvjiet.png",
    coursework: [
      "Linear Algebra",
      "Statistics",
      "Machine Learning",
      "Artificial Intelligence",
      "Data Mining",
      "Data Structures and Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Compiler Design",
    ],
    highlights: [
      {
        title: "Major project — Old Photo Restoration with two VAEs",
        text: "Led development of a restoration system combining two variational autoencoders to remove scratches and dust and fill missing regions; trained on the VOC dataset.",
      },
      {
        title: "Mini project — Lip Movement Detection",
        text: "CNN + LSTM lip-reading system reaching 91% accuracy transcribing spoken words from video.",
      },
    ],
  },
];
```

`src/data/experience.js`:
```js
export const experience = [
  {
    id: "skill-lab",
    role: "Research Assistant",
    company: "SKILL Lab, San José State University",
    dates: "Present",
    logo: "logos/sjsu.svg",
    summary: [
      "Fusing Knowledge Graphs into Large Language Models for biomedical reasoning, under Prof. Jelena Gligorijevic.",
    ],
    details: [],
  },
  {
    id: "sap",
    role: "Role details coming soon",
    company: "SAP",
    dates: "—",
    logo: "logos/sap.svg",
    summary: ["Details will be added here."],
    details: [],
    placeholder: true,
  },
  {
    id: "jpmc-swe",
    role: "Software Engineer",
    company: "JPMorgan Chase",
    dates: "Jun 2023 – Dec 2024",
    logo: "logos/jpmc.svg",
    summary: [
      "Built core modules of the JADE Catalog, an enterprise data-governance platform covering 40k+ applications and 200k+ data sources.",
      "Shipped Spring Boot microservices on AWS/Kubernetes with PostgreSQL, Kafka and Terraform; kept data-sync pipelines at 99.9% availability.",
      "Added Elasticsearch-backed search that made locating compliance artifacts 10x faster.",
    ],
    details: [
      "Engineered dynamic workflows automating application and data-resource certification against evolving compliance frameworks.",
      "Refactored legacy monolithic services into modular microservices for faster deployments, better fault isolation and independent scaling.",
      "Designed a cross-application notification framework giving real-time visibility into compliance status, registration progress and pipeline failures.",
      "Supported React.js frontend development during critical feature sprints.",
      "Acted as liaison during production incidents and major releases, leading root-cause analysis and hotfixes; ran demos and knowledge transfers for leadership and end users.",
    ],
  },
  {
    id: "jpmc-intern",
    role: "Software Engineer Intern",
    company: "JPMorgan Chase",
    dates: "Jan 2023 – May 2024",
    logo: "logos/jpmc.svg",
    summary: ["Internship preceding the full-time Software Engineer role."],
    details: [],
  },
];
```

`src/data/projects.js`:
```js
export const projects = [
  {
    slug: "rag-research-assistant",
    title: "RAG-Based Research Assistant",
    summary:
      "AI research assistant using RAG with FAISS, SentenceTransformers and OpenAI APIs for semantic search over academic literature, with PDF/arXiv ingestion, citation-backed Q&A and summarization in a chat interface.",
    tags: ["RAG", "FAISS", "SentenceTransformers", "OpenAI"],
    github: "https://github.com/ksk-17/research_assistant_using_rag/tree/master",
  },
  {
    slug: "qlora-phi2",
    title: "Fine-Tuning LLMs with QLoRA",
    summary:
      "Fine-tuned microsoft/phi-2 on DialogSum using QLoRA with 4-bit quantization and LoRA adapters, improving summarization quality and contextual fluency with efficient parameter tuning.",
    metric: "+13.39% ROUGE",
    tags: ["QLoRA", "PEFT", "phi-2", "PyTorch"],
    github: "https://github.com/ksk-17/finetuning-using-qlora/blob/master/fine-tune-llm-using-qlora.ipynb",
  },
  {
    slug: "cyclegan-monet",
    title: "Style Transfer with CycleGAN",
    summary:
      "CycleGAN built from scratch in PyTorch for unpaired translation between landscape photos and Monet-style paintings, using adversarial, cycle-consistency and identity losses for stable training.",
    metric: "MiFID 69.25",
    tags: ["GANs", "PyTorch", "Computer Vision"],
    github: "https://github.com/ksk-17/CycleGAN-Monet-Art-Generator/blob/master/i-m-something-of-a-painter-myself-cyclegan.ipynb",
  },
  {
    slug: "hybrid-music-recsys",
    title: "Music Recommendation with Hybrid Filtering",
    summary:
      "Hybrid recommender combining content-based and collaborative filtering (PCA, K-Means, SVD) on the Million Song Dataset, with adaptive logic that resolves cold-start and sparsity issues.",
    metric: "Improved F1@5",
    tags: ["RecSys", "SVD", "K-Means", "PCA"],
    github: "https://github.com/ksk-17/music_recommendation_using_hybrid_filtering",
  },
  {
    slug: "ventilator-pressure",
    title: "Ventilator Pressure Prediction",
    summary:
      "Bi-LSTM model predicting ventilator pressure from time-series data using domain-specific and lag-based feature engineering, a custom training loop and k-fold cross-validation.",
    metric: "MAE 0.8045",
    tags: ["Bi-LSTM", "Time series", "Kaggle"],
    github: "https://github.com/ksk-17/Ventilator-Pressure-Prediction/tree/master",
  },
];
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/data`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "feat: add typed content data for profile, education, experience, projects" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Hooks and UI primitives

**Files:**
- Create: `src/hooks/useWebGL.js`, `src/hooks/useActiveSection.js`, `src/hooks/hooks.test.jsx`, `src/components/ui/Reveal.jsx`, `src/components/ui/Logo.jsx`, `src/components/ui/Toast.jsx`, `src/components/ui/ui.test.jsx`

**Interfaces:**
- Produces:
  - `useWebGL(): boolean`
  - `useActiveSection(ids: string[]): string | null`
  - `<Reveal as?="div" delay?={0} {...motionProps}>children</Reveal>`
  - `<Logo src?: string, name: string, size?: number />` (falls back to a monogram when `src` is missing or the image errors)
  - `<Toast message: string />` (`role="status"`, `data-show` "true"/"false")

- [ ] **Step 1: Write the failing tests**

`src/hooks/hooks.test.jsx`:
```jsx
import { render, screen, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWebGL } from "./useWebGL";
import { useActiveSection } from "./useActiveSection";

describe("useWebGL", () => {
  it("is false when no WebGL context can be created", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    expect(renderHook(() => useWebGL()).result.current).toBe(false);
  });
  it("is false when getContext throws", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => { throw new Error("boom"); });
    expect(renderHook(() => useWebGL()).result.current).toBe(false);
  });
  it("is true when a context exists", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({}));
    expect(renderHook(() => useWebGL()).result.current).toBe(true);
  });
});

describe("useActiveSection", () => {
  let callback;
  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      constructor(cb) { callback = cb; }
      observe() {} unobserve() {} disconnect() {}
    };
  });
  function Probe() {
    const active = useActiveSection(["a", "b"]);
    return (
      <div>
        <div id="a" /><div id="b" />
        <span data-testid="out">{active ?? "none"}</span>
      </div>
    );
  }
  it("reports the section that intersects", () => {
    render(<Probe />);
    expect(screen.getByTestId("out")).toHaveTextContent("none");
    act(() => callback([{ isIntersecting: true, target: { id: "b" } }]));
    expect(screen.getByTestId("out")).toHaveTextContent("b");
  });
});
```

`src/components/ui/ui.test.jsx`:
```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "./Logo";
import Toast from "./Toast";
import Reveal from "./Reveal";

describe("Logo", () => {
  it("shows a monogram when there is no src", () => {
    render(<Logo name="SAP" />);
    expect(screen.getByText("SAP")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });
  it("falls back to the monogram when the image fails to load", () => {
    render(<Logo name="San Jose State University" src="/missing.png" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("SJS")).toBeInTheDocument();
  });
});

describe("Toast", () => {
  it("is announced politely and reflects visibility", () => {
    const { rerender } = render(<Toast message="" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-show", "false");
    rerender(<Toast message="Copied" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-show", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
});

describe("Reveal", () => {
  it("renders its children", () => {
    render(<Reveal><p>hello</p></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/hooks src/components/ui`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement**

`src/hooks/useWebGL.js`:
```js
import { useState } from "react";

export function useWebGL() {
  const [ok] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  });
  return ok;
}
```

`src/hooks/useActiveSection.js`:
```js
import { useEffect, useState } from "react";

export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join("|");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}
```

`src/components/ui/Reveal.jsx`:
```jsx
import { motion } from "motion/react";

export default function Reveal({ children, delay = 0, as = "div", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

`src/components/ui/Logo.jsx`:
```jsx
import { useState } from "react";

function monogram(name) {
  const words = name.split(/\s+/).filter(Boolean);
  return words.length === 1 ? name.slice(0, 4).toUpperCase() : words.map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

export default function Logo({ src, name, size = 48 }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <span className="logo logo--mono" style={{ width: size, height: size }} aria-hidden="true">
        {monogram(name)}
      </span>
    );
  }
  return (
    <img className="logo" src={src} alt={`${name} logo`} width={size} height={size} onError={() => setFailed(true)} />
  );
}
```

`src/components/ui/Toast.jsx`:
```jsx
export default function Toast({ message }) {
  return (
    <div className="toast" role="status" aria-live="polite" data-show={message ? "true" : "false"}>
      {message}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: add WebGL/active-section hooks and Reveal, Logo, Toast primitives" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Navigation and app shell

**Files:**
- Create: `src/components/Nav/Nav.jsx`, `src/components/Nav/Nav.css`, `src/components/Nav/Nav.test.jsx`, `src/components/Footer.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `profile.shortName`, `useActiveSection(ids)`.
- Produces: `<Nav />` (anchor links to `#education #experience #projects #contact`, brand → `#top`); `<Footer />`; `App` layout `<Nav/><main>…</main><Footer/>` with a skip link to `#education`.

- [ ] **Step 1: Write the failing test**

`src/components/Nav/Nav.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Nav from "./Nav";

describe("Nav", () => {
  it("links to every section", () => {
    render(<Nav />);
    ["Education", "Experience", "Projects", "Contact"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `#${label.toLowerCase()}`);
    });
  });
  it("toggles the mobile menu and closes it after choosing a link", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close/i })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "false");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/Nav`
Expected: FAIL (Nav not found).

- [ ] **Step 3: Implement**

`src/components/Nav/Nav.jsx`:
```jsx
import { useState } from "react";
import { profile } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import "./Nav.css";

const links = [
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
const observed = ["education", "experience", "projects"];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(observed);
  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Primary">
        <a className="nav__brand" href="#top">{profile.shortName}</a>
        <button className="nav__toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
        <ul id="nav-links" className="nav__links" data-open={open}>
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

`src/components/Nav/Nav.css`:
```css
.nav {
  position: fixed; inset: 0 0 auto 0; z-index: 50; height: var(--nav-h);
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--line);
}
.nav__inner { max-width: 1100px; margin: 0 auto; height: 100%; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
.nav__brand { font-weight: 600; text-decoration: none; letter-spacing: -0.01em; }
.nav__links { display: flex; gap: 28px; list-style: none; margin: 0; padding: 0; }
.nav__links a { text-decoration: none; color: var(--muted); font-size: 0.92rem; transition: color 0.2s; }
.nav__links a:hover, .nav__links a[aria-current="true"] { color: var(--text); }
.nav__toggle { display: none; background: none; border: 0; color: var(--text); font: inherit; font-size: 0.95rem; cursor: pointer; padding: 8px; }

@media (max-width: 720px) {
  .nav__toggle { display: block; }
  .nav__links {
    position: absolute; top: var(--nav-h); left: 0; right: 0; flex-direction: column; gap: 0;
    background: var(--bg); border-bottom: 1px solid var(--line); padding: 8px 24px 16px;
    display: none;
  }
  .nav__links[data-open="true"] { display: flex; }
  .nav__links a { display: block; padding: 12px 0; font-size: 1.1rem; }
}
```

`src/components/Footer.jsx`:
```jsx
import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer style={{ textAlign: "center", color: "var(--muted)", padding: "96px 24px 48px", fontSize: "0.9rem" }}>
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
```

`src/App.jsx`:
```jsx
import { MotionConfig } from "motion/react";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#education">Skip to content</a>
      <Nav />
      <main>
        <h1 id="top">Sumanth Kumar Kotagudem</h1>
      </main>
      <Footer />
    </MotionConfig>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: add translucent nav with mobile menu and footer" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Hero (headshot card, role ticker, lazy 3D backdrop)

**Files:**
- Create: `src/components/Hero/Hero.jsx`, `HeadshotCard.jsx`, `RoleTicker.jsx`, `Backdrop3D.jsx`, `Hero.css`, `Hero.test.jsx`
- Modify: `src/App.jsx` (replace the stub `<h1>` with `<Hero />`)

**Interfaces:**
- Consumes: `profile`, `asset()`, `useWebGL()`, `useReducedMotion` from `motion/react`, `<ContactDock />` (Task 5 — Hero imports it; until Task 5 lands, create a temporary `src/components/ContactDock/ContactDock.jsx` exporting `export default function ContactDock(){ return <div id="contact" /> }`, replaced in Task 5).
- Produces: `<Hero />` renders `<section id="top">` with the only `<h1>`; `<HeadshotCard src alt />`; `<RoleTicker roles interval? />`; `<Backdrop3D />` (default export, lazy-imported).

- [ ] **Step 1: Write the failing test**

`src/components/Hero/Hero.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "./Hero";
import { profile } from "../../data/profile";

describe("Hero", () => {
  it("shows the name as the single h1 and the first role", () => {
    render(<Hero />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    expect(screen.getByText(profile.roles[0])).toBeInTheDocument();
  });
  it("renders the headshot with alt text and a BASE_URL-aware src", () => {
    render(<Hero />);
    const img = screen.getByAltText(new RegExp(profile.name));
    expect(img.getAttribute("src")).toBe(`${import.meta.env.BASE_URL}image.png`);
  });
  it("does not mount the 3D backdrop when WebGL is unavailable", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".backdrop3d")).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/Hero`
Expected: FAIL (Hero not found).

- [ ] **Step 3: Implement**

`src/components/Hero/RoleTicker.jsx`:
```jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function RoleTicker({ roles, interval = 2400 }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), interval);
    return () => clearInterval(t);
  }, [reduced, roles.length, interval]);

  if (reduced) return <p className="ticker">{roles.join(" · ")}</p>;
  return (
    <p className="ticker">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
```

`src/components/Hero/HeadshotCard.jsx`:
```jsx
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function HeadshotCard({ src, alt }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const imgX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { px.set(0); py.set(0); }

  return (
    <div className="headshot" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div className="headshot__card" style={{ rotateX, rotateY, transformPerspective: 900 }}>
        <div className="headshot__glow" aria-hidden="true" />
        <motion.img className="headshot__img" src={src} alt={alt} style={{ x: imgX, y: imgY }} width="420" height="420" fetchPriority="high" />
      </motion.div>
    </div>
  );
}
```

`src/components/Hero/Backdrop3D.jsx`:
```jsx
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function Shape({ position, kind, color, scale = 1 }) {
  return (
    <Float speed={1.2} rotationIntensity={1.2} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        {kind === "knot" && <torusKnotGeometry args={[0.6, 0.2, 128, 16]} />}
        {kind === "icosa" && <icosahedronGeometry args={[0.8, 1]} />}
        {kind === "sphere" && <sphereGeometry args={[0.6, 48, 48]} />}
        <meshPhysicalMaterial color={color} roughness={0.15} metalness={0.1} clearcoat={1} />
      </mesh>
    </Float>
  );
}

export default function Backdrop3D() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="backdrop3d" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 3]} intensity={2} />
        <Shape position={[-4.2, 1.8, -1]} kind="knot" color="#8ab4ff" />
        <Shape position={[4.4, -1.6, -2]} kind="icosa" color="#ffb3c7" scale={1.2} />
        <Shape position={[3.2, 2.2, -3]} kind="sphere" color="#b8f0d0" />
      </Canvas>
    </div>
  );
}
```

`src/components/Hero/Hero.jsx`:
```jsx
import { lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import { profile } from "../../data/profile";
import { asset } from "../../lib/asset";
import { useWebGL } from "../../hooks/useWebGL";
import Reveal from "../ui/Reveal";
import HeadshotCard from "./HeadshotCard";
import RoleTicker from "./RoleTicker";
import ContactDock from "../ContactDock/ContactDock";
import "./Hero.css";

const Backdrop3D = lazy(() => import("./Backdrop3D"));

export default function Hero() {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  const wide = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
  const show3D = webgl && !reduced && wide;

  return (
    <section id="top" className="hero">
      {show3D && (
        <Suspense fallback={null}>
          <Backdrop3D />
        </Suspense>
      )}
      <div className="hero__grid">
        <Reveal className="hero__copy">
          <p className="eyebrow">Hello, I’m</p>
          <h1 className="hero__name">{profile.name}</h1>
          <RoleTicker roles={profile.roles} />
          <p className="hero__lede">{profile.lede}</p>
          <ContactDock />
        </Reveal>
        <HeadshotCard src={asset(profile.headshot)} alt={`Portrait of ${profile.name}`} />
      </div>
    </section>
  );
}
```

`src/components/Hero/Hero.css`:
```css
.hero { position: relative; min-height: 100svh; display: grid; align-items: center; padding: calc(var(--nav-h) + 32px) 24px 64px; overflow: clip; }
.backdrop3d { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.hero__grid { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; align-items: center; }
.hero__name { font-size: clamp(2.6rem, 7vw, 5rem); line-height: 1; letter-spacing: -0.04em; margin: 0 0 16px; font-weight: 700; }
.ticker { font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 600; margin: 0 0 20px; min-height: 2.4rem; background: linear-gradient(90deg, #0071e3, #bf5af2); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero__lede { color: var(--muted); font-size: clamp(1.05rem, 1.8vw, 1.25rem); max-width: 560px; margin: 0 0 32px; }

.headshot { display: grid; place-items: center; perspective: 900px; }
.headshot__card {
  position: relative; width: min(100%, 380px); aspect-ratio: 1; border-radius: 40px; overflow: hidden;
  background: var(--surface); box-shadow: var(--shadow), inset 0 0 0 1px var(--line); transform-style: preserve-3d;
}
.headshot__glow { position: absolute; inset: -20%; background: radial-gradient(circle at 30% 20%, rgba(0,113,227,.35), transparent 55%), radial-gradient(circle at 80% 90%, rgba(191,90,242,.3), transparent 50%); }
.headshot__img { position: relative; width: 112%; height: 112%; max-width: none; margin: -6%; object-fit: cover; }

@media (max-width: 860px) {
  .hero { min-height: auto; padding-top: calc(var(--nav-h) + 24px); }
  .hero__grid { grid-template-columns: 1fr; gap: 32px; }
  .headshot { order: -1; }
  .headshot__card { width: min(70vw, 280px); }
}
```

`src/App.jsx` main body → `<main><Hero /></main>` (import Hero).

Temporary `src/components/ContactDock/ContactDock.jsx`:
```jsx
export default function ContactDock() { return <div id="contact" />; }
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 5: Visual check with Playwright MCP**

Run `npm run dev` in the background. With the Playwright MCP tools: `browser_navigate` to `http://localhost:5173/portfolio/`, `browser_resize` 1440×900 → `browser_take_screenshot`; resize 375×800 → screenshot. `browser_console_messages` must show no errors. Expected: headshot card beside the copy at 1440 (3D shapes visible behind), stacked headshot-first at 375 with no shapes; hover over the card tilts it.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add hero with tilting headshot, role ticker and lazy 3D backdrop" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Contact dock with 3D icons

**Files:**
- Create (replace temp): `src/components/ContactDock/ContactDock.jsx`, `Icon3D.jsx`, `glyphs.jsx`, `ContactDock.css`, `ContactDock.test.jsx`

**Interfaces:**
- Consumes: `profile`, `<Toast message />`, `motion`, `useAnimationControls`.
- Produces: `<ContactDock />` (wrapper `id="contact"`); `<Icon3D label href tone external? onClick?>{glyph}</Icon3D>`; glyph components `MailGlyph GitHubGlyph LinkedInGlyph KaggleGlyph`.

- [ ] **Step 1: Write the failing test**

`src/components/ContactDock/ContactDock.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactDock from "./ContactDock";
import { profile } from "../../data/profile";

beforeEach(() => {
  // mailto navigation is not implemented in jsdom; keep the click inert
  document.addEventListener("click", (e) => e.target.closest?.("a")?.href?.startsWith("mailto:") && e.preventDefault(), { capture: true });
});

describe("ContactDock", () => {
  it("renders four labelled links with safe external targets", () => {
    render(<ContactDock />);
    const gh = screen.getByRole("link", { name: /github/i });
    expect(gh).toHaveAttribute("href", profile.links.github);
    expect(gh).toHaveAttribute("target", "_blank");
    expect(gh.getAttribute("rel")).toMatch(/noopener/);
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute("href", profile.links.linkedin);
    expect(screen.getByRole("link", { name: /kaggle/i })).toHaveAttribute("href", profile.links.kaggle);
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("copies the email and confirms with a toast", async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const user = userEvent.setup({ writeToClipboard: false });
    render(<ContactDock />);
    await user.click(screen.getByRole("link", { name: /email/i }));
    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(await screen.findByRole("status")).toHaveTextContent(/copied/i);
  });

  it("shows the address when the clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const user = userEvent.setup({ writeToClipboard: false });
    render(<ContactDock />);
    await user.click(screen.getByRole("link", { name: /email/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(profile.email);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/ContactDock`
Expected: FAIL (temp ContactDock renders no links).

- [ ] **Step 3: Implement**

`src/components/ContactDock/glyphs.jsx`:
```jsx
const common = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };

export const MailGlyph = () => (
  <svg {...common}><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7h15.2L12 12.2zM4 9.1V17h16V9.1l-8 5.5-8-5.5z" /></svg>
);
export const GitHubGlyph = () => (
  <svg {...common}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
);
export const LinkedInGlyph = () => (
  <svg {...common}><text x="12" y="17.5" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="Inter, Arial, sans-serif">in</text></svg>
);
export const KaggleGlyph = () => (
  <svg {...common}><text x="12" y="18" textAnchor="middle" fontSize="18" fontWeight="800" fontFamily="Inter, Arial, sans-serif">k</text></svg>
);
```

`src/components/ContactDock/Icon3D.jsx`:
```jsx
import { motion, useAnimationControls } from "motion/react";

export default function Icon3D({ label, href, tone, external = true, onClick, children }) {
  const controls = useAnimationControls();
  function handleClick(e) {
    controls.start({ rotateY: [0, 360], transition: { duration: 0.7, ease: "easeInOut" } });
    onClick?.(e);
  }
  return (
    <motion.a
      className="icon3d"
      href={href}
      aria-label={label}
      onClick={handleClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ "--tone": tone, transformPerspective: 600 }}
      animate={controls}
      whileHover={{ rotateX: -14, rotateY: 14, y: -10 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      <span className="icon3d__side" aria-hidden="true" />
      <span className="icon3d__face" aria-hidden="true">{children}</span>
      <span className="icon3d__label" aria-hidden="true">{label}</span>
    </motion.a>
  );
}
```

`src/components/ContactDock/ContactDock.jsx`:
```jsx
import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import Toast from "../ui/Toast";
import Icon3D from "./Icon3D";
import { MailGlyph, GitHubGlyph, LinkedInGlyph, KaggleGlyph } from "./glyphs";
import "./ContactDock.css";

export default function ContactDock() {
  const [toast, setToast] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  function flash(message) {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  }

  async function onEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      flash("Email copied — opening your mail app");
    } catch {
      flash(`Copy it manually: ${profile.email}`);
    }
  }

  return (
    <div id="contact" className="dock" role="group" aria-label="Contact">
      <Icon3D label="Email" href={`mailto:${profile.email}`} tone="#ff5f57" external={false} onClick={onEmail}><MailGlyph /></Icon3D>
      <Icon3D label="LinkedIn" href={profile.links.linkedin} tone="#0a66c2"><LinkedInGlyph /></Icon3D>
      <Icon3D label="GitHub" href={profile.links.github} tone="#24292f"><GitHubGlyph /></Icon3D>
      <Icon3D label="Kaggle" href={profile.links.kaggle} tone="#20beff"><KaggleGlyph /></Icon3D>
      <Toast message={toast} />
    </div>
  );
}
```

`src/components/ContactDock/ContactDock.css`:
```css
.dock { display: flex; flex-wrap: wrap; gap: 20px; scroll-margin-top: calc(var(--nav-h) + 40px); }
.icon3d {
  position: relative; display: grid; justify-items: center; gap: 10px; text-decoration: none; color: var(--text);
  transform-style: preserve-3d; -webkit-tap-highlight-color: transparent;
}
.icon3d__face {
  position: relative; z-index: 1; width: 68px; height: 68px; border-radius: 20px; display: grid; place-items: center; color: #fff;
  background: linear-gradient(145deg, color-mix(in srgb, var(--tone) 78%, #fff), var(--tone));
  box-shadow: inset 0 2px 0 rgba(255,255,255,.45), inset 0 -6px 12px rgba(0,0,0,.18), 0 14px 28px color-mix(in srgb, var(--tone) 40%, transparent);
  transform: translateZ(14px);
}
.icon3d__side {
  position: absolute; top: 6px; left: 0; width: 68px; height: 68px; border-radius: 20px;
  background: color-mix(in srgb, var(--tone) 55%, #000); transform: translateZ(0);
}
.icon3d__label { font-size: 0.78rem; color: var(--muted); }
@media (max-width: 480px) { .dock { gap: 14px; } .icon3d__face, .icon3d__side { width: 60px; height: 60px; } }
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 5: Visual check**

Playwright MCP: screenshot the hero at 1440 and 375; `browser_hover` an icon → it tilts/lifts; `browser_click` the GitHub icon → new tab opens to the GitHub URL (check `browser_tabs`); click Email → toast appears.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add 3D contact icon dock with spin-on-click and email copy" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Education globe

**Files:**
- Create: `src/components/Education/globeMath.js`, `globeMath.test.js`, `Globe.jsx`, `SchoolPanel.jsx`, `Education.jsx`, `Education.css`, `Education.test.jsx`
- Modify: `src/App.jsx` (add `<Education />` after `<Hero />`)

**Interfaces:**
- Consumes: `education`, `Logo`, `Reveal`, `useWebGL`, `asset`, `cobe` default export `createGlobe(canvas, options)` returning `{ destroy() }`.
- Produces:
  - `GLOBE_RADIUS_RATIO: number`
  - `focusAngles(lat, lng, fromPhi = 0): { phi, theta }` — angles that turn the globe so (lat,lng) faces the viewer, with `phi` unwrapped to within π of `fromPhi`
  - `projectPin(lat, lng, phi, theta): { x, y, visible }` — unit-sphere screen coords (x right, y up, each in [-1,1]) and whether the point faces the viewer
  - `<Globe schools selectedId onSelect />`, `<SchoolPanel school />`, `<Education />` (`<section id="education">`).

- [ ] **Step 1: Check the installed cobe API before coding**

Run: `cat node_modules/cobe/package.json | grep '"version"'` and read `node_modules/cobe/README.md`.
Expected: confirm the option names used in Step 4 (`devicePixelRatio, width, height, phi, theta, dark, diffuse, mapSamples, mapBrightness, baseColor, markerColor, glowColor, markers, onRender`). If the installed version renames an option, adapt only the options object in `Globe.jsx`; everything else in this task is independent of it. If it supports `arcs`, add one arc between the two school locations; if not, skip arcs (spec says arc; this is the only deviation and must be reported).

- [ ] **Step 2: Write the failing tests**

`src/components/Education/globeMath.test.js`:
```js
import { describe, it, expect } from "vitest";
import { focusAngles, projectPin } from "./globeMath";

const places = [
  [37.3352, -121.8811],
  [17.54, 78.386],
  [0, 0],
  [-33.9, 151.2],
];

describe("globeMath", () => {
  it.each(places)("focusAngles brings (%f, %f) to the centre of the disc", (lat, lng) => {
    const { phi, theta } = focusAngles(lat, lng);
    const p = projectPin(lat, lng, phi, theta);
    expect(p.visible).toBe(true);
    expect(Math.abs(p.x)).toBeLessThan(1e-9);
    expect(Math.abs(p.y)).toBeLessThan(1e-9);
  });
  it("hides the antipode", () => {
    const { phi, theta } = focusAngles(37.3352, -121.8811);
    expect(projectPin(-37.3352, 58.1189, phi, theta).visible).toBe(false);
  });
  it("unwraps phi to the shortest rotation from the current angle", () => {
    const { phi } = focusAngles(17.54, 78.386, 20);
    expect(Math.abs(phi - 20)).toBeLessThanOrEqual(Math.PI + 1e-9);
  });
  it("keeps projected coordinates inside the unit disc", () => {
    const p = projectPin(10, 20, 1.1, 0.3);
    expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1 + 1e-9);
  });
});
```

`src/components/Education/Education.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { education } from "../../data/education";

vi.mock("cobe", () => ({ default: vi.fn(() => ({ destroy: vi.fn() })) }));

import Education from "./Education";
import Globe from "./Globe";

describe("Education without WebGL", () => {
  it("still lets visitors switch schools via tabs", async () => {
    const user = userEvent.setup();
    render(<Education />);
    expect(screen.getByRole("heading", { level: 2, name: "Education" })).toBeInTheDocument();
    expect(screen.getByText(education[0].degree)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: new RegExp(education[1].shortName) }));
    expect(screen.getByText(education[1].degree)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: new RegExp(education[1].shortName) })).toHaveAttribute("aria-selected", "true");
  });
});

describe("Globe", () => {
  it("renders one pin button per school and reports selection", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Globe schools={education} selectedId={education[0].id} onSelect={onSelect} />);
    const pin = screen.getByRole("button", { name: new RegExp(education[1].location.label) });
    await user.click(pin);
    expect(onSelect).toHaveBeenCalledWith(education[1].id);
  });
  it("does not crash when cobe throws", () => {
    return import("cobe").then(({ default: createGlobe }) => {
      createGlobe.mockImplementationOnce(() => { throw new Error("no webgl"); });
      expect(() => render(<Globe schools={education} selectedId="sjsu" onSelect={() => {}} />)).not.toThrow();
    });
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run src/components/Education`
Expected: FAIL (modules not found).

- [ ] **Step 4: Implement**

`src/components/Education/globeMath.js`:
```js
const TAU = Math.PI * 2;
export const GLOBE_RADIUS_RATIO = 0.4; // calibrate against cobe's rendered disc in Step 6

export function focusAngles(lat, lng, fromPhi = 0) {
  const raw = 1.5 * Math.PI - (lng * Math.PI) / 180;
  const phi = raw + TAU * Math.round((fromPhi - raw) / TAU);
  return { phi, theta: (lat * Math.PI) / 180 };
}

export function projectPin(lat, lng, phi, theta) {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180 - Math.PI;
  const x0 = -Math.cos(la) * Math.cos(lo);
  const y0 = Math.sin(la);
  const z0 = Math.cos(la) * Math.sin(lo);
  const x1 = x0 * Math.cos(phi) + z0 * Math.sin(phi);
  const z1 = -x0 * Math.sin(phi) + z0 * Math.cos(phi);
  const y2 = y0 * Math.cos(theta) - z1 * Math.sin(theta);
  const z2 = y0 * Math.sin(theta) + z1 * Math.cos(theta);
  return { x: x1, y: y2, visible: z2 > 0 };
}
```

`src/components/Education/Globe.jsx`:
```jsx
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { focusAngles, projectPin, GLOBE_RADIUS_RATIO } from "./globeMath";

export default function Globe({ schools, selectedId, onSelect }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pinRefs = useRef({});
  const current = useRef({ phi: 0, theta: 0.3 });
  const target = useRef({ phi: 0, theta: 0.3 });
  const drag = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const s = schools.find((x) => x.id === selectedId);
    if (s) target.current = focusAngles(s.location.lat, s.location.lng, current.current.phi);
  }, [selectedId, schools]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const size = canvas.offsetWidth || 560;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let globe;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: current.current.phi,
        theta: current.current.theta,
        dark: dark ? 1 : 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: dark ? 6 : 5,
        baseColor: dark ? [0.25, 0.25, 0.3] : [1, 1, 1],
        markerColor: [0, 0.44, 0.89],
        glowColor: dark ? [0.1, 0.1, 0.2] : [0.92, 0.94, 1],
        markers: schools.map((s) => ({ location: [s.location.lat, s.location.lng], size: 0.07 })),
        onRender: (state) => {
          if (!drag.current) {
            const c = current.current, t = target.current;
            c.phi += (t.phi - c.phi) * 0.08;
            c.theta += (t.theta - c.theta) * 0.08;
          }
          state.phi = current.current.phi;
          state.theta = current.current.theta;
          const R = size * GLOBE_RADIUS_RATIO, half = size / 2;
          schools.forEach((s) => {
            const el = pinRefs.current[s.id];
            if (!el) return;
            const p = projectPin(s.location.lat, s.location.lng, state.phi, state.theta);
            el.style.transform = `translate(${half + p.x * R}px, ${half - p.y * R}px) translate(-50%, -50%)`;
            el.style.opacity = p.visible ? 1 : 0;
            el.style.pointerEvents = p.visible ? "auto" : "none";
          });
        },
      });
    } catch {
      setFailed(true);
      return undefined;
    }
    return () => globe.destroy();
  }, [schools]);

  function down(e) {
    drag.current = { x: e.clientX };
    target.current = { ...current.current };
  }
  function move(e) {
    if (!drag.current) return;
    current.current.phi += (e.clientX - drag.current.x) / 200;
    drag.current.x = e.clientX;
    target.current = { ...current.current };
  }
  function up() { drag.current = null; }

  return (
    <div ref={wrapRef} className="globe" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
      {!failed && <canvas ref={canvasRef} className="globe__canvas" aria-hidden="true" />}
      {!failed &&
        schools.map((s) => (
          <button
            key={s.id}
            ref={(el) => { pinRefs.current[s.id] = el; }}
            className="globe__pin"
            data-active={s.id === selectedId}
            aria-label={`${s.shortName} — ${s.location.label}`}
            onClick={() => onSelect(s.id)}
            style={{ opacity: 0 }}
          >
            <span className="globe__pin-dot" />
            <span className="globe__pin-label">{s.shortName}</span>
          </button>
        ))}
    </div>
  );
}
```
Note: pins render on first paint, so the first Globe test finds them while cobe is mocked. If cobe throws, the effect sets `failed`, the canvas and pins are removed, and `Education` keeps working through its always-rendered tabs.

`src/components/Education/SchoolPanel.jsx`:
```jsx
import { AnimatePresence, motion } from "motion/react";
import Logo from "../ui/Logo";
import { asset } from "../../lib/asset";

export default function SchoolPanel({ school }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={school.id}
        className="school"
        role="tabpanel"
        id={`panel-${school.id}`}
        aria-labelledby={`tab-${school.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <header className="school__head">
          <Logo src={asset(school.logo)} name={school.shortName} size={56} />
          <div>
            <h3 className="school__degree">{school.degree}</h3>
            <p className="school__meta">{school.school} · {school.dates}</p>
            <p className="school__meta">GPA {school.gpa} · {school.location.label}</p>
          </div>
        </header>
        {school.highlights.map((h) => (
          <div key={h.title} className="school__highlight">
            <h4>{h.title}</h4>
            <p>{h.text}</p>
          </div>
        ))}
        <h4 className="school__label">Coursework</h4>
        <ul className="chips">
          {school.coursework.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </motion.article>
    </AnimatePresence>
  );
}
```

`src/components/Education/Education.jsx`:
```jsx
import { useState } from "react";
import { education } from "../../data/education";
import { useWebGL } from "../../hooks/useWebGL";
import Reveal from "../ui/Reveal";
import Globe from "./Globe";
import SchoolPanel from "./SchoolPanel";
import "./Education.css";

export default function Education() {
  const [selectedId, setSelectedId] = useState(education[0].id);
  const webgl = useWebGL();
  const school = education.find((s) => s.id === selectedId);

  return (
    <section id="education" className="section">
      <Reveal>
        <h2 className="section__title">Education</h2>
        <p className="section__sub">From Hyderabad to San Jose. Drag the globe, or pick a school.</p>
      </Reveal>
      <div className="edu">
        {webgl && (
          <Reveal className="edu__globe">
            <Globe schools={education} selectedId={selectedId} onSelect={setSelectedId} />
          </Reveal>
        )}
        <div className="edu__detail">
          <div role="tablist" aria-label="Schools" className="edu__tabs">
            {education.map((s) => (
              <button
                key={s.id}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={s.id === selectedId}
                aria-controls={`panel-${s.id}`}
                onClick={() => setSelectedId(s.id)}
              >
                {s.shortName}
              </button>
            ))}
          </div>
          <SchoolPanel school={school} />
        </div>
      </div>
    </section>
  );
}
```

`src/components/Education/Education.css`:
```css
.edu { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.edu:not(:has(.edu__globe)) { grid-template-columns: 1fr; max-width: 720px; }
.globe { position: relative; width: min(100%, 520px); aspect-ratio: 1; margin: 0 auto; touch-action: pan-y; cursor: grab; }
.globe:active { cursor: grabbing; }
.globe__canvas { width: 100%; height: 100%; display: block; }
.globe__pin { position: absolute; top: 0; left: 0; display: flex; align-items: center; gap: 8px; background: none; border: 0; padding: 6px; cursor: pointer; color: var(--text); font: inherit; transition: opacity 0.2s; }
.globe__pin-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent); }
.globe__pin[data-active="true"] .globe__pin-dot { animation: pulse 1.8s infinite; }
.globe__pin-label { font-size: 0.8rem; font-weight: 600; background: var(--surface); padding: 3px 9px; border-radius: 999px; box-shadow: var(--shadow); white-space: nowrap; }
@keyframes pulse { 50% { box-shadow: 0 0 0 10px color-mix(in srgb, var(--accent) 0%, transparent); } }

.edu__tabs { display: inline-flex; background: var(--surface-2); padding: 4px; border-radius: 999px; margin-bottom: 20px; }
.edu__tabs button { border: 0; background: none; color: var(--muted); font: inherit; font-weight: 500; padding: 8px 18px; border-radius: 999px; cursor: pointer; }
.edu__tabs button[aria-selected="true"] { background: var(--surface); color: var(--text); box-shadow: 0 1px 6px rgba(0,0,0,.12); }

.school { background: var(--surface); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow), inset 0 0 0 1px var(--line); }
.school__head { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
.school__degree { margin: 0 0 4px; font-size: 1.35rem; letter-spacing: -0.02em; }
.school__meta { margin: 0; color: var(--muted); font-size: 0.92rem; }
.school__highlight h4 { margin: 16px 0 4px; font-size: 1rem; }
.school__highlight p { margin: 0; color: var(--muted); }
.school__label { margin: 22px 0 10px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; margin: 0; padding: 0; }
.chips li { background: var(--surface-2); border-radius: 999px; padding: 5px 12px; font-size: 0.82rem; }

@media (max-width: 860px) { .edu { grid-template-columns: 1fr; gap: 24px; } .globe { width: min(100%, 380px); } }
```

`src/App.jsx`: add `import Education from "./components/Education/Education";` and render `<Hero /><Education />`.

- [ ] **Step 5: Run to verify pass**

Run: `npx vitest run`
Expected: PASS (math, tabs, globe tests).

- [ ] **Step 6: Calibrate the pins against cobe with Playwright MCP**

Run dev server; navigate to `#education`; screenshot at 1440. The blue cobe marker for the selected school must sit exactly under its HTML pin dot. If the pin is mirrored or offset: (a) adjust `GLOBE_RADIUS_RATIO` until the pin tracks the rim correctly when you drag, (b) if horizontal motion is mirrored, negate `phi` sign in `projectPin`/`focusAngles` consistently and update the unit tests' expectations accordingly (they assert the self-consistency property, which still must hold). Click the Hyderabad pin → the globe eases to India and the panel swaps. Resize to 375 → globe above the panel, no horizontal scroll.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add education section with interactive globe and school panel" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Experience stack

**Files:**
- Create: `src/components/Experience/StackCard.jsx`, `Experience.jsx`, `Experience.css`, `Experience.test.jsx`
- Modify: `src/App.jsx` (add `<Experience />` after `<Education />`)

**Interfaces:**
- Consumes: `experience`, `Logo`, `Reveal`, `asset`.
- Produces: `<StackCard item index />` (sticky card, `--i` CSS var = index); `<Experience />` (`<section id="experience">`).

- [ ] **Step 1: Write the failing test**

`src/components/Experience/Experience.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Experience from "./Experience";
import { experience } from "../../data/experience";

describe("Experience", () => {
  it("renders every role", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { level: 2, name: "Experience" })).toBeInTheDocument();
    experience.forEach((e) => expect(screen.getByText(e.company, { exact: false })).toBeInTheDocument());
    expect(screen.getAllByRole("article")).toHaveLength(experience.length);
  });
  it("expands and collapses extra details", async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const swe = experience.find((e) => e.details.length);
    expect(screen.queryByText(swe.details[0])).toBeNull();
    const btn = screen.getByRole("button", { name: /show more/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(swe.details[0])).toBeInTheDocument();
    await user.click(btn);
    expect(screen.queryByText(swe.details[0])).toBeNull();
  });
  it("marks placeholder entries so they can be styled as pending", () => {
    const { container } = render(<Experience />);
    expect(container.querySelectorAll("[data-placeholder='true']")).toHaveLength(experience.filter((e) => e.placeholder).length);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/Experience`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/components/Experience/StackCard.jsx`:
```jsx
import { useState } from "react";
import Logo from "../ui/Logo";
import { asset } from "../../lib/asset";

export default function StackCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const hasMore = item.details.length > 0;
  return (
    <article className="stack__card" style={{ "--i": index }} data-placeholder={item.placeholder ? "true" : undefined}>
      <header className="stack__head">
        <Logo src={asset(item.logo)} name={item.company} size={52} />
        <div>
          <h3 className="stack__role">{item.role}</h3>
          <p className="stack__meta">{item.company} · {item.dates}</p>
        </div>
      </header>
      <ul className="stack__list">
        {item.summary.map((s) => <li key={s}>{s}</li>)}
        {open && item.details.map((d) => <li key={d}>{d}</li>)}
      </ul>
      {hasMore && (
        <button className="stack__more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </article>
  );
}
```

`src/components/Experience/Experience.jsx`:
```jsx
import { experience } from "../../data/experience";
import Reveal from "../ui/Reveal";
import StackCard from "./StackCard";
import "./Experience.css";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <Reveal>
        <h2 className="section__title">Experience</h2>
        <p className="section__sub">Research, and building enterprise-scale platforms.</p>
      </Reveal>
      <div className="stack">
        {experience.map((item, i) => <StackCard key={item.id} item={item} index={i} />)}
      </div>
    </section>
  );
}
```

`src/components/Experience/Experience.css`:
```css
.stack { display: grid; gap: 28px; }
.stack__card {
  position: sticky; top: calc(var(--nav-h) + 24px + var(--i) * 18px);
  background: var(--surface); border-radius: var(--radius); padding: clamp(22px, 4vw, 36px);
  box-shadow: var(--shadow), inset 0 0 0 1px var(--line);
}
.stack__head { display: flex; gap: 16px; align-items: center; margin-bottom: 14px; }
.stack__role { margin: 0; font-size: clamp(1.25rem, 2.6vw, 1.7rem); letter-spacing: -0.02em; }
.stack__meta { margin: 2px 0 0; color: var(--muted); }
.stack__list { margin: 0; padding-left: 1.2em; display: grid; gap: 8px; color: var(--text); max-width: 760px; }
.stack__more { margin-top: 16px; background: none; border: 0; color: var(--accent); font: inherit; font-weight: 500; cursor: pointer; padding: 4px 0; }
.stack__card[data-placeholder="true"] { opacity: 0.6; border: 1px dashed var(--line); }
@media (max-width: 720px) { .stack__card { position: relative; top: auto; } }
```

`src/App.jsx`: render `<Hero /><Education /><Experience />`.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 5: Visual check**

Playwright MCP: scroll to `#experience` at 1440 (`browser_evaluate` `window.scrollTo`), screenshot at two scroll offsets → later cards slide over earlier ones; at 375 cards are plain stacked blocks.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add experience section with sticky stacking cards" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Projects carousel

**Files:**
- Create: `src/components/Projects/Cover.jsx`, `ProjectCard.jsx`, `Projects.jsx`, `Projects.css`, `Projects.test.jsx`
- Modify: `src/App.jsx` (add `<Projects />` after `<Experience />`)

**Interfaces:**
- Consumes: `projects`, `Reveal`, `motion`.
- Produces: `<Cover slug title />` (deterministic gradient cover); `<ProjectCard project />`; `<Projects />` (`<section id="projects">`, region labelled "Projects", prev/next buttons labelled "Previous project"/"Next project", ArrowLeft/ArrowRight keys scroll when the region is focused).

- [ ] **Step 1: Write the failing test**

`src/components/Projects/Projects.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Projects from "./Projects";
import Cover from "./Cover";
import { projects } from "../../data/projects";

beforeEach(() => { Element.prototype.scrollBy = vi.fn(); });

describe("Projects", () => {
  it("shows every project with a GitHub link", () => {
    render(<Projects />);
    projects.forEach((p) => {
      const link = screen.getByRole("link", { name: new RegExp(`${p.title}.*GitHub`, "i") });
      expect(link).toHaveAttribute("href", p.github);
      expect(link).toHaveAttribute("target", "_blank");
    });
  });
  it("scrolls the track from the arrow buttons and keyboard", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole("button", { name: /next project/i }));
    expect(Element.prototype.scrollBy).toHaveBeenLastCalledWith(expect.objectContaining({ left: expect.any(Number) }));
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /previous project/i }));
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeLessThan(0);
    screen.getByRole("region", { name: /projects/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
  });
});

describe("Cover", () => {
  it("is deterministic per slug", () => {
    const a = render(<Cover slug="x" title="Alpha Beta" />).container.innerHTML;
    const b = render(<Cover slug="x" title="Alpha Beta" />).container.innerHTML;
    expect(a).toBe(b);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/Projects`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/components/Projects/Cover.jsx`:
```jsx
function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export default function Cover({ slug, title }) {
  const h = hash(slug);
  const a = h % 360;
  const b = (a + 60 + ((h >> 8) % 80)) % 360;
  const mark = title.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  return (
    <div className="cover" style={{ background: `linear-gradient(135deg, hsl(${a} 80% 62%), hsl(${b} 85% 52%))` }} aria-hidden="true">
      <span className="cover__orb" />
      <span className="cover__mark">{mark}</span>
    </div>
  );
}
```

`src/components/Projects/ProjectCard.jsx`:
```jsx
import { motion } from "motion/react";
import Cover from "./Cover";

export default function ProjectCard({ project }) {
  const { slug, title, summary, metric, tags, github } = project;
  return (
    <motion.article
      className="pcard"
      style={{ transformPerspective: 1000 }}
      whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <Cover slug={slug} title={title} />
      <div className="pcard__body">
        {metric && <p className="pcard__metric">{metric}</p>}
        <h3 className="pcard__title">{title}</h3>
        <p className="pcard__summary">{summary}</p>
        <ul className="chips">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
        <a className="pcard__link" href={github} target="_blank" rel="noopener noreferrer" aria-label={`${title} on GitHub`}>
          View on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </motion.article>
  );
}
```

`src/components/Projects/Projects.jsx`:
```jsx
import { useRef } from "react";
import { projects } from "../../data/projects";
import Reveal from "../ui/Reveal";
import ProjectCard from "./ProjectCard";
import "./Projects.css";

export default function Projects() {
  const track = useRef(null);

  function scrollByCard(dir) {
    const el = track.current;
    const card = el.querySelector(".pcard");
    const step = (card?.getBoundingClientRect().width || 320) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="section__title">Projects</h2>
        <p className="section__sub">Selected work in LLMs, generative models and recommender systems.</p>
      </Reveal>
      <div className="carousel__controls">
        <button onClick={() => scrollByCard(-1)} aria-label="Previous project">←</button>
        <button onClick={() => scrollByCard(1)} aria-label="Next project">→</button>
      </div>
      <div
        ref={track}
        className="carousel"
        role="region"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); scrollByCard(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); scrollByCard(-1); }
        }}
      >
        {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}
```

`src/components/Projects/Projects.css`:
```css
.carousel__controls { display: flex; gap: 10px; justify-content: flex-end; margin-bottom: 16px; }
.carousel__controls button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: var(--surface); color: var(--text); font-size: 1.1rem; cursor: pointer; }
.carousel__controls button:hover { background: var(--surface-2); }
.carousel { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 12px 24px 40px; margin: 0 -24px; scrollbar-width: none; perspective: 1000px; }
.carousel::-webkit-scrollbar { display: none; }
.pcard { flex: 0 0 min(84vw, 340px); scroll-snap-align: start; background: var(--surface); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow), inset 0 0 0 1px var(--line); display: flex; flex-direction: column; }
.cover { position: relative; aspect-ratio: 16 / 10; overflow: hidden; display: grid; place-items: center; }
.cover__orb { position: absolute; width: 70%; aspect-ratio: 1; border-radius: 50%; right: -15%; top: -25%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%); }
.cover__mark { position: relative; font-size: 3.4rem; font-weight: 700; letter-spacing: -0.04em; color: rgba(255,255,255,.95); text-shadow: 0 6px 24px rgba(0,0,0,.25); }
.pcard__body { padding: 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.pcard__metric { margin: 0; color: var(--accent); font-weight: 600; font-size: 0.85rem; }
.pcard__title { margin: 0; font-size: 1.25rem; letter-spacing: -0.02em; line-height: 1.2; }
.pcard__summary { margin: 0; color: var(--muted); font-size: 0.95rem; flex: 1; }
.pcard__link { color: var(--accent); text-decoration: none; font-weight: 500; margin-top: 6px; }
.pcard__link:hover { text-decoration: underline; }
```

`src/App.jsx`: render `<Hero /><Education /><Experience /><Projects />`.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 5: Visual check**

Playwright MCP: scroll to `#projects` at 1440 and 375; screenshot; click next arrow and confirm the track scrolls (`browser_evaluate` on `.carousel` `scrollLeft > 0`); hover a card to see tilt.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add project carousel with generated covers and GitHub links" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Assets, polish, integration test, verification, README

**Files:**
- Create: `public/logos/*` (best effort), `public/favicon.svg`, `src/App.integration.test.jsx`, `README.md` (rewrite)
- Modify: `index.html` (favicon + OG tags)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Write the failing integration test**

`src/App.integration.test.jsx`:
```jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders all sections and nothing for removed ones", () => {
    const { container } = render(<App />);
    ["Education", "Experience", "Projects"].forEach((name) =>
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument()
    );
    expect(screen.queryByRole("heading", { name: /skills|certifications/i })).toBeNull();
    expect(container.querySelector("form")).toBeNull();
    ["top", "education", "experience", "projects", "contact"].forEach((id) =>
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    );
  });
  it("has exactly one h1 and a skip link", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it passes or reveals gaps**

Run: `npx vitest run`
Expected: PASS if Tasks 3–8 are wired in `App.jsx` as specified (App renders `<Hero/><Education/><Experience/><Projects/>` inside `<main>`). If FAIL, fix `App.jsx` wiring only.

- [ ] **Step 3: Logos and favicon (best effort, never blocking)**

Try to obtain official/Wikimedia logo files for SJSU, VNR VJIET, JPMorgan Chase and SAP (use WebSearch/WebFetch or `curl -L -o`) into `public/logos/` using exactly the filenames referenced in `src/data`: `sjsu.svg`, `vnrvjiet.png`, `jpmc.svg`, `sap.svg`. Check each file is a real image (`file public/logos/*`) and that its licence/trademark use is acceptable for a personal portfolio. Any file that cannot be obtained is simply omitted — `Logo` falls back to a monogram. Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0071e3"/><stop offset="1" stop-color="#bf5af2"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><text x="32" y="43" text-anchor="middle" font-family="Arial" font-weight="700" font-size="32" fill="#fff">SK</text></svg>
```
In `index.html` `<head>` add:
```html
<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg" />
<meta property="og:title" content="Sumanth Kumar Kotagudem — AI Engineer & Researcher" />
<meta property="og:description" content="Knowledge-graph-grounded LLMs and neuro-symbolic vision reasoning." />
<meta property="og:type" content="website" />
```

- [ ] **Step 4: Full verification pass**

Run: `npm run build` — expected success; record gzipped sizes from Vite output. Confirm the main entry chunk + CSS gzip is well under 350 KB and the three.js code is in a separate lazy chunk.
Run: `npx vite preview --host 127.0.0.1 --port 4173` (background) and use Playwright MCP against `http://127.0.0.1:4173/portfolio/`:
1. Screenshots at 375, 768, 1440 px for hero, education, experience, projects (light mode), then `browser_emulate_media` `colorScheme: "dark"` and repeat the 1440 hero + education.
2. At 375 px run `browser_evaluate`: `document.documentElement.scrollWidth <= window.innerWidth` → must be `true`.
3. `browser_emulate_media` `reducedMotion: "reduce"` + reload → no `.backdrop3d`; ticker shows all roles joined; no console errors.
4. Pin click swaps the education panel; carousel arrows scroll; GitHub/LinkedIn/Kaggle icons open the right URLs; nav links scroll to the right sections and highlight while scrolling.
5. `browser_network_requests`: no 404s for `image.png`, `favicon.svg`, logos that exist.
6. `browser_console_messages`: no errors.
Fix anything found, then re-run `npx vitest run`.

- [ ] **Step 5: README**

Replace `README.md` with: what the site is, `npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run deploy` (GitHub Pages), where to edit content (`src/data/*`), how to swap the headshot (`public/image.png`) and logos (`public/logos/`), and a note on the placeholders (SAP role, SKILL Lab bullets, project covers).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add logos, favicon, meta tags, integration test and README" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Hand off (do not deploy unprompted)**

Report: test results, bundle sizes, screenshots taken, remaining placeholders, and content questions (intern dates overlap, duplicate GPA, SAP and SKILL Lab details, arcs on the globe if cobe lacked support). Then use `superpowers:finishing-a-development-branch`; `npm run deploy` publishes to GitHub Pages and requires the user's explicit go-ahead.
