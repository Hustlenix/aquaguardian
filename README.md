# 🌊 AquaGuardian

AquaGuardian is an interactive 3D ocean-restoration experience built with Next.js, Three.js, and React Three Fiber. As you scroll, a real-time underwater world renders in the browser — light shafts, caustics, and fish — while an autonomous guardian robot surveys the seabed, patrols, and collects debris, and an eleven-chapter story arc unfolds from surface descent to a restored future ocean. The site runs in two modes: a **full-stack server mode** (`npm run dev` / `npm run start`) with real API routes and JSON persistence, and a **fully static export** for GitHub Pages where every page gracefully falls back to bundled data and localStorage.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00E5FF?style=flat-square&logo=github)](https://hustlenix.github.io/aquaguardian/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock)](https://gsap.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-0055FF?style=flat-square&logo=framer)](https://motion.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=flat-square&logo=zustand)](https://zustand.docs.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-D4AF37?style=flat-square)](LICENSE)

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

- **A cinematic scroll experience.** The homepage is an eleven-chapter narrative rendered over a live 3D ocean. The scene responds to scroll position — lighting changes as you descend, debris appears during the crisis chapters, and the robot's scan beams sweep the seabed during the reveal. The robot also patrols on its own: it drifts along a slow idle sway and periodically dives toward the nearest piece of debris, hovers over it under a cyan pickup beam, collects it (the item fades and respawns about 12 seconds later), and returns to its post.
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

## Interactive Experience

The hero is not a passive render — it is a playable simulation with a live HUD:

| Control | What happens |
|---|---|
| **WASD / arrow keys** (desktop, hero) | Directly pilot the guardian. Input is mapped onto the camera plane so the cinematic path keeps working; hold keys to fly, release and the AI resumes after a short coast. A "Piloting" badge appears and the thruster hum ramps up. |
| **Click a debris item** (desktop, hero) | A `THREE.Raycaster` picks the item, a cyan ripple marks the click, and the robot's collection cycle (seek → hover → collect) takes over to retrieve it. |
| **HUD (top-right)** | "Collected X / N" counter, "Ocean Health" percentage, and a mute toggle for the procedural audio. |
| **Autonomous patrol** | Always on by default: the robot drifts, picks the nearest visible debris, hovers under a cyan pickup beam, collects, and returns — with or without you. |

Every collection produces three feedback signals: a particle burst (additive points with buoyant drift), a synthesized pickup blip (Web Audio API — no audio files), and a **water-clarity state change**: as the ratio of collected-to-total debris rises, the exponential fog recedes and the ocean's clarity uniform brightens, so the sea visibly clears as you clean it. Debris respawns ~12 seconds later and ocean health eases back down — the feedback loop runs both ways.

---

## Algorithmic Challenges

- **Underwater light attenuation (fog).** Light decays exponentially with depth following Beer-Lambert extinction, I = I₀·e^(−μd), where I₀ is the surface irradiance, μ the water turbidity and d the depth. The scene approximates this with `THREE.Fog` (near/far) plus a custom depth-haze shader; the cleanup mechanic lerps the fog range toward clarity as debris is collected.
- **Gerstner-style surface ripples.** The ocean ceiling displaces each vertex with a summed set of travelling sine waves (two octaves), perturbing normals so the light response rolls with the swell; a slow wind vector rotates the pattern so the surface never loops.
- **Caustics.** The seabed overlay is a procedural sum-of-abs-sines pattern computed in the fragment shader with two frequency octaves and a coherent "sun angle" drift — refracted light that moves as one, for the cost of a single blended plane.
- **Boids schooling.** Three fish schools each run the classic Reynolds rules — cohesion (steer toward the school centroid), alignment (match neighbour heading), separation (avoid crowding) — plus a wander term and an exclusion zone that keeps fish clear of the robot. All vectors are pre-allocated scratch objects; the loop allocates nothing per frame.
- **Kinematic targeting.** The robot approaches debris by easing an offset toward a normalized displacement vector, v̂ = v/‖v‖, with angle-aware yaw damping (`atan2` + wrapped-angle interpolation) and a gentle roll into turns — no pathfinding, just smooth pursuit.
- **Click-to-collect raycasting.** Pointer hits are unprojected through the camera to a ray (`Raycaster.setFromCamera`); the nearest visible debris mesh intersection drives the robot's next target.
- **GPU memory discipline.** Everything disposable — geometries, materials, textures — is `.dispose()`d on unmount, and `useFrame` allocates nothing; the reef, kelp, rocks and debris are instanced, keeping total draw calls well under 50.

---

## Full-Stack Mode

AquaGuardian is a dual-mode application. Every ecosystem page (missions, challenges, learn, assistant, dashboard, mobile) works identically in both modes:

| Mode | How to run | APIs | Persistence |
|---|---|---|---|
| **Server mode** | `npm run dev` or `npm run start` | Real route handlers under `src/app/api/` | `src/lib/dataStore.ts` reads/writes `database.json` at the project root (in-memory cache, atomic temp-file writes). Progress survives restarts. |
| **Static mode** | `STATIC_EXPORT=true npm run build` → `out/` (GitHub Pages) | CI moves `src/app/api` aside before the build, so no routes ship | `src/lib/api.ts` bundled fallback data + localStorage keys (`aqua-missions`, `aqua-challenges`, `aqua-learn`). Progress survives reloads on the visitor's device. |

`src/lib/api.ts` is the single entry point for pages: it tries `fetch('/api/...')` with a short timeout and falls back to bundled seed data when the request fails (e.g. on Pages). The assistant's canned answers live in both `src/app/api/assistant/route.ts` and `src/lib/api.ts` with identical logic, so the chat behaves the same with or without a server.

### API endpoints

All routes are JSON under `src/app/api/`, and all mutations persist through `src/lib/dataStore.ts` into `database.json`:

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/stats` | — | `{ totalPlastic, collections: [{ amount, location, timestamp }], missions, challenges, learn, subscribers }` |
| GET | `/api/missions` | — | `{ missions: [{ id, title, description, category, impact, completed }] }` |
| POST | `/api/missions/toggle` | `{ id }` | `{ mission }` — toggled mission |
| GET | `/api/challenges` | — | `{ challenges: [{ id, title, description, difficulty, participants, deadline }] }` |
| POST | `/api/challenges/join` | `{ id }` | `{ challenge }` — participants incremented |
| GET | `/api/learn` | — | `{ modules: [{ id, title, summary, completed, lessons: [{ title, body }] }] }` |
| POST | `/api/learn/complete` | `{ id }` | `{ module }` — marked completed |
| POST | `/api/assistant` | `{ prompt }` | `{ response }` — canned, category-matched answer |
| POST | `/api/subscribe` | `{ email }` | `{ success }` — email added to `subscribers` |

Every route wraps its work in try/catch and returns `{ error }` with a 500 on failure (400 for missing/invalid input).

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Cinematic 3D hero plus narrative sections: Mission, Problem, Solution, How It Works, Technology, Prototype, Experience Modes, Impact, Timeline, Real Ocean Data, FAQ, Team, Contact |
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

- **Shaders instead of light sources.** Water caustics, volumetric light rays, and the layered atmosphere are computed procedurally on the GPU rather than rendered with expensive spotlights and geometry. The scene looks heavy but stays light.
- **Instancing everywhere it matters.** The reef is one draw call per coral archetype, kelp is a single instanced mesh with GPU sway, and rocks, debris, and ridge silhouettes are all instanced — hundreds of objects collapsed into a handful of draw calls.
- **Scene components subscribe narrowly to state.** Individual meshes (kelp, fish, particles, robot) subscribe only to the Zustand slices they read, which avoids full-canvas re-renders when the scroll position updates.
- **Unidirectional narrative state.** Scroll position drives discrete scene properties (debris count, lighting, scan-beam activity) through a single store — one source of truth for both the story and the world.
- **Deterministic worlds.** Coral placement uses a seeded PRNG, so every visit renders the same reef; fish schooling, bubbles, and particles use only pre-allocated scratch vectors and refs, so the animation loop allocates nothing per frame.
- **Dual-mode data layer.** Server routes persist through `src/lib/dataStore.ts` into `database.json` (atomic writes, in-memory cache); pages read data exclusively through `src/lib/api.ts`, which falls back to bundled seeds + localStorage so the static export stays fully interactive.
- **Deterministic data pipeline.** The dashboard dataset is generated by a native C tool and aggregated by a Python script (details below), so the numbers are reproducible on any machine.

---

## Rendering Architecture

The underwater scene lives in `src/world/` and is composed on a single R3F canvas. `World.tsx` mounts the subsystems; everything else is a leaf with narrow Zustand subscriptions.

```text
Canvas
└── SceneContent
    ├── Ocean            # gradient depth haze + 5-octave vertex waves + swell breathing
    ├── LightRays        # volumetric shafts (GLSL bend + shimmer, uHeight uniform)
    ├── Caustics         # animated caustic overlay, alpha-blended over the seabed
    ├── Lighting         # key/warm rim/cyan bounce rig, robot spotlight (damped target)
    ├── Environment      # silhouette ridge, fog bands, rising glow motes
    ├── EnvReflections   # Lightformer rig — gold key + cyan rim sheen on the robot
    ├── Seabed           # instanced rocks + debris registry (shared with Robot)
    ├── Kelp             # one instanced mesh, GPU sway via onBeforeCompile phase attribute
    ├── Coral            # 4 archetypes × 1 instanced mesh, seeded placement, bleaching
    ├── Ruins            # platform, pillars, fallen column, obelisk, buried arch
    ├── Fish             # 3 boids schools (cohesion/alignment/separation/wander)
    ├── Jellyfish        # distorting dome + tentacle strands (drei MeshDistortMaterial)
    ├── Robot            # debris cycle: idle → seek → hover → return + WASD pilot + click override
    ├── Interaction      # raycaster click-to-collect + cyan click ripple
    ├── PickupBursts     # additive particle burst on every collection
    ├── Particles        # dust + plankton + marine snow layers
    ├── Bubbles          # dual-harmonic wobble, chains, surface pop
    ├── Camera           # damped path easing, section-change impulse, handheld breathing
    └── Effects          # quality-gated postprocessing stack
```

**Quality tiers.** A single `quality` value (0–1) from the store gates detail: school sizes and fish count, coral archetype counts, kelp density, particle/bubble counts, and the postprocessing stack. High quality renders Bloom + SSAO (half resolution) + Depth of Field + ACES filmic tone mapping + vignette, noise, and chromatic aberration; low quality renders bloom alone, with `enableNormalPass` and heavy effects disabled — so the scene scales cleanly from laptops down to phones.

**The robot's contract.** `Seabed.tsx` exports `debrisPositions`, `debrisRegistry`, and a `DebrisHandle { mesh, hiddenUntil }` used by `Robot.tsx` for its collect cycle. The cycle (idle → seek → hover → return, with 12 s respawn and 8 s cooldown) is the baseline; visitors can interrupt it with direct WASD piloting (which pauses the cycle and hands back control after a coast) or override its target by clicking a debris item (`setForcedTarget` feeds the cycle's idle phase). Every collection notifies the HUD store, plays the pickup blip, fires a particle burst, and brightens the water — one shared feedback path.

**Camera.** `Camera.tsx` follows pre-authored section paths (`src/data/sectionCameraPaths.ts`) with exponential damping, adds a sharpening impulse with a 10% overshoot when the section changes, and layers in handheld breathing, look drift, micro-roll, portrait FOV widening, and touch parallax.

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
│   │   └── api/            # Server-mode API routes (stats, missions, challenges, learn, assistant, subscribe)
│   ├── chapters/           # Eleven story chapters (Chapter01…Chapter11)
│   ├── components/
│   │   ├── animations/     # Text reveals, stagger, counter animations
│   │   ├── sections/       # Hero, Mission, Impact, Technology, Timeline, FAQ…
│   │   └── ui/             # Navigation, buttons, glass panels, dashboard widgets
│   ├── data/               # Chapters, impact data, scene states, generated analysis
│   ├── hooks/              # useReducedMotion, useDeviceTier, useSceneManager
│   ├── lib/                # api.ts (dual-mode data layer), dataStore.ts (server persistence), GSAP/Lenis config
│   ├── shaders/            # GLSL fragment and vertex shaders
│   ├── store/              # Zustand global state
│   ├── tokens/             # Colors, motion, spacing, typography, elevation
│   ├── types/              # Shared TypeScript types
│   └── world/              # R3F canvas: World, Lighting, Seabed, Robot, Fish…
├── database.json           # Committed demo dataset + server-mode persistence store
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

The export lands in `out/` with the `/aquaguardian` base path applied. The workflow in `.github/workflows/gh-pages.yml` runs lint plus this exact build, then deploys to <https://hustlenix.github.io/aquaguardian/> on every push to `main`. The API routes under `src/app/api` are moved aside during the static build (Pages has no server runtime), and every page automatically falls back to bundled data + localStorage via `src/lib/api.ts` — see [Full-Stack Mode](#full-stack-mode).

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
