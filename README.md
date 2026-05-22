# 🌊 AquaGuardian — AI-Powered Ocean Restoration & Storytelling

> **A cinematic, immersive underwater experience where deep-sea mystery meets autonomous environmental engineering.** Explore a living 3D ocean, follow an AI guardian's mission, and discover the data behind ocean restoration — built as a premium web experience, not a brochure.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00E5FF?style=flat-square&logo=github)](https://hustlenix.github.io/aquaguardian/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=flat-square&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Framer%20Motion-88CE02?style=flat-square&logo=greensock)](https://gsap.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-764ABC?style=flat-square)](https://zustand.docs.pmnd.rs/)

---

## 🖼️ Screenshots

| Cinematic hero | Impact dashboard |
|---|---|
| ![AquaGuardian hero](assets/screenshots/hero.png) | ![Impact dashboard](assets/screenshots/dashboard.png) |

| Mission tracking | Educational mode |
|---|---|
| ![Mission tracking](assets/screenshots/missions.png) | ![Educational mode](assets/screenshots/learn.png) |

---

## 🐚 What Is AquaGuardian?

AquaGuardian is an interactive, narrative-driven storytelling experience built around a fictional-but-grounded vision of autonomous ocean restoration. It feels less like a landing page and more like a cinematic journey: as you scroll, a real-time 3D underwater world responds — light shafts bend, fish scatter, the AquaGuardian robot scans the seabed, and an AI command narrative unfolds in chapters.

The experience blends:

- **A real-time 3D ocean environment** — custom GLSL shaders for water caustics, volumetric light rays, and bioluminescent atmosphere, rendered with Three.js + React Three Fiber
- **Scroll-driven cinematic narrative** — a chaptered story arc from surface descent to ocean restoration, choreographed with GSAP and Framer Motion
- **A digital command center** — a full set of product-style routes: live dashboard, mission tracking, community challenges, educational content, an AI assistant, and a mobile companion view
- **Performance-aware rendering** — adaptive DPR, device-tier detection, and reduced-motion support so the experience stays smooth and accessible everywhere

---

## 🧭 The Narrative Arc

The homepage tells an 11-chapter story (mapped in `src/data/chapters.ts`): **Arrival** at the ocean's edge, **Descent** through the fading light, the **Crisis** of pollution and reef decay, the **Discovery** of ancient ruins, the **Robot Reveal**, **AI Command** telemetry, the **Mission**, **Technology Stations**, **Impact Metrics**, the vision of a restored **Future Atlantis**, and the final **Call to Action**.

---

## ✨ Key Features & Routes

| Route | Purpose |
|---|---|
| `/` | Cinematic 3D hero + scroll-driven narrative sections (Mission, Technology, Impact, Team, Contact) |
| `/dashboard` | Impact dashboard with live-style telemetry and ocean-health metrics |
| `/missions` | Conservation mission tracker |
| `/challenges` | Community challenge mode |
| `/learn` | Educational content about marine ecosystems and restoration science |
| `/assistant` | AI assistant layer explaining the world, robotics, and mission context |
| `/mobile` | Mobile-first companion experience for field teams |
| `/privacy` | Privacy policy |

---

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 15 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS 4 with a strict design-token system (`src/tokens/`) |
| 3D | Three.js, React Three Fiber, custom GLSL shaders (`src/shaders/`) |
| Motion | GSAP, Framer Motion, Lenis smooth scroll |
| State | Zustand (`src/store/`) |
| Quality | ESLint + Prettier, typed components, reduced-motion hooks |

**Engineering highlights**

- **Custom shaders over heavy geometry** — volumetric light rays and water caustics are computed procedurally on the GPU instead of rendering expensive spotlights and geometry.
- **Modular scene isolation** — individual meshes (kelp, fish, particles) subscribe only to the Zustand slices they need, avoiding full-canvas re-renders.
- **Unidirectional narrative state** — scroll position drives discrete environmental properties (debris count, lighting, robot scan-beams) through a single store.
- **Accessibility first** — `prefers-reduced-motion` is respected by JS motion and CSS animation alike; high-contrast foreground values throughout.

---

## 📁 Project Structure

```text
AquaGuardian_FullStack/
├── .github/workflows/      # GitHub Pages CI/CD
├── assets/                 # Models, textures, HDRs, audio, screenshots
├── public/                 # Favicon set, manifest, OG image, robots, sitemap
├── scripts/                # Asset-generation helpers
├── src/
│   ├── app/                # App Router pages, layouts, metadata, loading/template
│   ├── components/
│   │   ├── animations/     # Text reveals, stagger, counter animations
│   │   ├── sections/       # Hero, Mission, Impact, Technology, Timeline, FAQ…
│   │   └── ui/             # Navigation, buttons, glass panels, dashboard widgets
│   ├── data/               # Chapters, impact data, scene states
│   ├── hooks/              # useReducedMotion, useDeviceTier, useSceneManager
│   ├── lib/                # GSAP/Lenis configuration, constants
│   ├── shaders/            # GLSL fragment & vertex shaders
│   ├── store/              # Zustand global state
│   ├── tokens/             # Colors, motion, spacing, typography, elevation
│   └── world/              # R3F canvas: World, Lighting, Seabed, Robot, Fish…
├── package.json
└── next.config.ts          # Static export + basePath handling
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install & develop

```bash
npm install
npm run dev        # http://localhost:3000
```

### Build & lint

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

The export lands in `out/`. The GitHub Actions workflow (`.github/workflows/gh-pages.yml`) runs exactly this, then deploys to **https://hustlenix.github.io/aquaguardian/**.

---

## ♿ Accessibility

Motion is a core part of the experience — but so is respecting the user. `useReducedMotion` detects `prefers-reduced-motion` and scales back camera movement, reveals, and the loader; a global CSS guard collapses CSS animations as well. Keyboard navigation is supported with high-visibility cyan focus rings, and text meets high-contrast thresholds against the abyssal palette.

---

## 📜 Credits & Notes

- Built as a polished showcase of interactive web experience design, 3D storytelling, and frontend engineering.
- AI tools were used to accelerate prototyping, UI iteration, and implementation support; final product direction and technical decisions were reviewed and refined by the human author.
- Ocean conservation content is framed as an informed, evidence-aware vision — no fabricated metrics.

> *"The sea, once it casts its spell, holds one in its net of wonder forever."* — Jacques Yves Cousteau

Developed with 💙 by the AquaGuardian team.
