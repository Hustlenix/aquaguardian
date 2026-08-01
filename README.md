# 🌊 AquaGuardian

AquaGuardian is an interactive 3D ocean-restoration experience built with Next.js, Three.js, and React Three Fiber. As you scroll, a real-time underwater world renders in the browser — light shafts, caustics, and fish — while an autonomous guardian robot surveys the seabed and an eleven-chapter story arc unfolds from surface descent to a restored future ocean. The site is a fully static export, deployed on GitHub Pages with no server runtime.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00E5FF?style=flat-square&logo=github)](https://hustlenix.github.io/aquaguardian/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock)](https://gsap.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-0055FF?style=flat-square&logo=framer)](https://motion.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=flat-square&logo=zustand)](https://zustand.docs.pmnd.rs/)

---

## Screenshots

| Cinematic hero | Impact dashboard |
|---|---|
| ![AquaGuardian hero](assets/screenshots/hero.png) | ![Impact dashboard](assets/screenshots/dashboard.png) |

| Mission tracking | Educational mode |
|---|---|
| ![Mission tracking](assets/screenshots/missions.png) | ![Educational mode](assets/screenshots/learn.png) |

The repo also includes a framework-free companion page — [`public/splash.html`](public/splash.html) is plain HTML, CSS, and vanilla JS (canvas sonar sweep included). It ships with the static export and is served from GitHub Pages at <https://hustlenix.github.io/aquaguardian/splash.html>.

---

## What Is AquaGuardian?

The project started as an experiment in what a product site can be when the background is a real-time 3D scene instead of a static image. The theme is a fictional-but-grounded vision of autonomous ocean restoration: an AI-operated guardian robot that collects debris, monitors reef health, and reports its impact. The storytelling is optimistic and educational rather than documentary — the goal is to make ocean-conservation concepts tangible through a visual narrative.

The experience itself is a mix of two things:

- **A cinematic scroll experience.** The homepage is an eleven-chapter narrative rendered over a live 3D ocean. The scene responds to scroll position — lighting changes as you descend, debris appears during the crisis chapters, and the robot's scan beams sweep the seabed during the reveal.
- **A small product ecosystem.** Beyond the homepage, there are real routes: an impact dashboard, a mission tracker, community challenges, a learning section, an AI assistant page, and a mobile companion view. They share one design system and one data pipeline.

---

## The Narrative Arc

The homepage story is defined in [`src/data/chapters.ts`](src/data/chapters.ts) and rendered as eleven scroll-driven chapters:

| # | Chapter | # | Chapter |
|---|---|---|---|
| 1 | Arrival | 7 | Mission |
| 2 | Descent | 8 | Technology |
| 3 | Crisis | 9 | Impact |
| 4 | Discovery | 10 | Future Atlantis |
| 5 | Robot Reveal | 11 | Call to Action |
| 6 | AI | | |

Each chapter has its own visual state in the scene — lighting, fog, fish behavior, and robot activity are all driven by a single scroll-tracked store, so the world and the story stay in sync.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Cinematic 3D hero plus narrative sections: Mission, Problem, Solution, How It Works, Technology, Prototype, Experience Modes, Impact, Timeline, Gallery, FAQ, Team, Contact |
| `/dashboard` | Impact dashboard with ocean-health metrics from the generated dataset |
| `/missions` | Conservation mission tracker |
| `/challenges` | Community challenge mode |
| `/learn` | Educational content about marine ecosystems and restoration science |
| `/assistant` | AI assistant layer explaining the world, robotics, and mission context |
| `/mobile` | Mobile-first companion experience for field teams |
| `/privacy` | Privacy policy |

---

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 15 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS 4 with a design-token system in `src/tokens/` |
| 3D | Three.js, React Three Fiber, custom GLSL shaders in `src/shaders/` |
| Motion | GSAP, Framer Motion, Lenis smooth scroll |
| State | Zustand (`src/store/`) |
| Quality | ESLint, Prettier, typed components, reduced-motion hooks |

A few implementation details worth noting:

- **Shaders instead of light sources.** Water caustics, volumetric light rays, and the gradient atmosphere are computed procedurally on the GPU rather than rendered with expensive spotlights and geometry. The scene looks heavy but stays light.
- **Scene components subscribe narrowly to state.** Individual meshes (kelp, fish, particles, robot) subscribe only to the Zustand slices they read, which avoids full-canvas re-renders when the scroll position updates.
- **Unidirectional narrative state.** Scroll position drives discrete scene properties (debris count, lighting, scan-beam activity) through a single store — one source of truth for both the story and the world.
- **Deterministic data pipeline.** The dashboard dataset is generated by a native C tool and aggregated by a Python script (details below), so the numbers are reproducible on any machine.

---

## Project Structure

```text
AquaGuardian_FullStack/
├── .github/workflows/      # GitHub Pages CI/CD (lint + static export + deploy)
├── assets/screenshots/     # README gallery images
├── public/                 # Favicon set, manifest, OG image, robots, sitemap, splash page
├── scripts/                # Python build tooling + native C generator
├── src/
│   ├── app/                # App Router pages, layout, metadata, loading/template
│   ├── chapters/           # Eleven story chapters (Chapter01…Chapter11)
│   ├── components/
│   │   ├── animations/     # Text reveals, stagger, counter animations
│   │   ├── sections/       # Hero, Mission, Impact, Technology, Timeline, FAQ…
│   │   └── ui/             # Navigation, buttons, glass panels, dashboard widgets
│   ├── data/               # Chapters, impact data, scene states, generated analysis
│   ├── hooks/              # useReducedMotion, useDeviceTier, useSceneManager
│   ├── lib/                # GSAP/Lenis configuration, constants
│   ├── shaders/            # GLSL fragment and vertex shaders
│   ├── store/              # Zustand global state
│   ├── tokens/             # Colors, motion, spacing, typography, elevation
│   ├── types/              # Shared TypeScript types
│   └── world/              # R3F canvas: World, Lighting, Seabed, Robot, Fish…
├── database.json           # Committed demo dataset (regenerated by the C tool)
├── package.json
└── next.config.ts          # Static export + basePath handling
```

---

## Getting Started

### Prerequisites

- Node.js 18.18 or newer (the CI workflow uses Node 22)
- npm

### Install and develop

```bash
npm install
npm run dev        # http://localhost:3000
```

### Build, lint, and format

```bash
npm run build      # production build
npm run lint       # ESLint
npm run format     # Prettier
```

### Static export (GitHub Pages)

The project is configured for fully static hosting:

```bash
STATIC_EXPORT=true npm run build
```

(PowerShell: `$env:STATIC_EXPORT = "true"; npm run build`)

The export lands in `out/` with the `/aquaguardian` base path applied. The workflow in `.github/workflows/gh-pages.yml` runs lint plus this exact build, then deploys to <https://hustlenix.github.io/aquaguardian/> on every push to `main`. The dev-only API route under `src/app/api` is set aside during the static build, since Pages has no server runtime.

### Build-time scripts

The Python tooling runs at build time and fails loudly when something is off:

```bash
python scripts/screenshot_check.py    # fail if a screenshot rotted into a blank image
python scripts/validate_assets.py     # fail if a referenced asset went missing
python scripts/analyze_ocean_data.py  # database.json -> src/data/ocean_analysis.json
python scripts/generate_social_banner.py  # renders public/social-banner.svg
```

The C data generator is optional — the committed `database.json` already matches the default seed. To regenerate it:

```bash
gcc -O2 -std=c99 scripts/native/ocean_metrics.c -o scripts/native/ocean_metrics
./scripts/native/ocean_metrics             # default seed 20260701, 24 events
./scripts/native/ocean_metrics --seed 42 --events 100
```

---

## Accessibility

Motion is central to the experience, so it is also the first thing we scale back for users who ask for it. `useReducedMotion` detects `prefers-reduced-motion` and reduces camera movement, reveals, and the loader; a global CSS guard collapses CSS animations as well. Keyboard navigation is supported with high-visibility focus rings, and text is set at high-contrast values against the dark palette.

---

## Credits and Notes

AquaGuardian is a personal showcase project exploring interactive 3D storytelling, design systems, and frontend engineering. The conservation content is an educational vision built from public sources — the dashboard dataset is generated demo data, not real collection records, and we have deliberately avoided fabricating metrics.

> "The sea, once it casts its spell, holds one in its net of wonder forever." — Jacques-Yves Cousteau

Licensed under the [MIT License](LICENSE).
