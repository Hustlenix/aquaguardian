# 🌊 AquaGuardian: AI-Powered Ocean Restoration & Storytelling

> **An interactive, cinematic 3D storytelling and digital command center experience that merges deep-sea mystery with autonomous environmental engineering.**

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-flat&logo=next.js)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-blue?style=flat-flat&logo=three.js)](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
[![GSAP](https://img.shields.io/badge/Animations-GSAP%20%26%20Framer-green?style=flat-flat)](https://gsap.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?style=flat-flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 🧭 Creative North Star: "The Sovereign Vault" & Atlantean Bioluminescence

The design system of **AquaGuardian** is engineered to transcend typical environmental or web interfaces. Its creative concept, **"The Sovereign Vault,"** mirrors a high-tech underwater command facility where ancient, regal oceanic majesty meets cutting-edge autonomous AI engineering.

We avoid flat, generic components by establishing a disciplined darkroom canvas:

- **Matte Abyssal Depth:** The backdrop is a rich, near-black foundation (`#020817`) that mimics the fading light of the ocean floor, preventing visual noise.
- **Bioluminescent Overlays:** Light, color, and glowing indicators serve as active signals. Neon primary glows (`#0EA5E9`) and cyan details represent system pulses and active AI tracking.
- **Atlantean Gold Accents:** Sophisticated chiseled borders and metallic trim (`#D4AF37`) are reserved for high-value details and critical navigation anchors.
- **Organic Glassmorphism:** Instead of traditional drop shadows or hard dividers, sections are defined through backdrop-blurred translucent panels that stack seamlessly on top of each other, allowing Three.js light rays to bleed through organically.

---

## 🛠 Technical Stack & Engineering Philosophy

This project is built as an elite, high-performance web experience. The architecture balances rich 3D graphics with lightweight, accessible frontend components:

### 1. 3D Underworld Rendering (WebGL/Three.js/Fiber)

- **`@react-three/fiber` & `@react-three/drei`:** Power the immersive real-time 3D underwater simulation including the seabed, ruins, coral reefs, kelp forests, light rays, bubbling particles, swimming fish, and the autonomous guardian robot.
- **Volumetric & Caustic Shaders:** Custom GLSL shaders render high-fidelity water caustics and volumetric light shafts, simulating underwater light scattering with minimal CPU/GPU overhead.
- **`PerformanceMonitor` & `AdaptiveDpr`:** Dynamically adapt pixel ratios and scene detail levels (`0.5x` to `1.5x` dpr) in real-time, protecting frame rates on lower-end mobile devices and thermal throttling laptops.

### 2. Kinetic Animation & Cinematic Scroll-Triggering

- **Zustand State Mainframe:** Houses the global narrative state, linking the active scroll position to discrete environmental properties (e.g., debris count, lighting intensity, robot scan-beams).
- **GSAP & Framer Motion:** Synchronize UI panel overlays with R3F camera movements. Scroll-linked path interpolation guides the virtual camera through 11 cinematic chapters: Descent, Crisis, Discovery, Robot Reveal, AI, and more.
- **Lenis Smooth Scroll:** Provides hardware-accelerated, unified smooth momentum scrolling across all browsers, removing stutter during rapid navigation.

### 3. Structural Design & Styling System

- **TailwindCSS (v4):** Utilized with strict CSS variables to maintain design token integrity across layout padding, border roundedness, and typography.
- **High-Contrast Typography Scale:**
  - **Display & Headlines:** _Cinzel_ & _Cormorant Garamond_ project an authoritative, chiseled, and regal tone.
  - **Interface & Specs:** _Space Grotesk_ & _Inter_ are utilized for high-density telemetry readouts, status indicators, and numeric data to reinforce the precision AI theme.
- **Semantic Accessibility (WCAG):** Integrated high-contrast foreground values and reduced-motion hook detection (`useReducedMotion`) to automatically bypass heavy 3D rotations or rapid flashes for users with vestibular sensitivities.

---

## 📖 Guided Chapters: The Narrative Flow

The platform tells an interactive story structured into **11 distinct chapters**, as mapped within `src/data/chapters.ts`:

1. **Arrival:** Approaching the deep ocean's threshold.
2. **Descent:** Descending into the deep abyss with fading surface light.
3. **Crisis:** Witnessing the catastrophic impact of plastic pollution and reef decay.
4. **Discovery:** Finding ancient Atlantean architectural ruins.
5. **Robot Reveal:** Unleashing the **AquaGuardian Autonomous Robot**.
6. **AI Command:** Establishing the neural telemetry and monitoring channels.
7. **Mission:** Outlining the core task of deep-sea cleaning.
8. **Technology Stations:** Interacting with sonar, micro-filtration, and navigation modules.
9. **Impact Metrics:** Reviewing projections (tons extracted, coral regrowth, species protected).
10. **Future Atlantis:** Imagining a restored, fully bioluminescent marine ecosystem.
11. **Call to Action (CTA):** Inviting users to register, support, and join the restoration fleet.

---

## 🔬 Behind the Scenes: Core Engineering Decisions

### 🌲 Modular Scene & State Isolation

By coupling Zustand with React-Three-Fiber, we achieve **unidirectional data-flow** that avoids re-rendering the entire canvas. Individual mesh items (like kelp or particles) subscribe _only_ to the specific slice of state they require. For example, when the robot scan-beam is activated, only the `<Robot />` component triggers a redraw.

### 🔍 Custom Shaders vs. Mesh Density

To create rich underwater atmosphere without dropping frames, we substituted heavy 3D geometry with custom GLSL shaders:

- **Volumetric Light Rays:** Rather than rendering heavy spotlights with shadow maps, we used a single procedural volumetric light ray shader applied to a cone geometry.
- **Water Caustics:** The undulating light reflection on the seabed is animated via a procedural noise fragment shader, mimicking caustics mathematically at the GPU level.

### ♿ Accessibility and Inclusivity

We respect the user's system preferences. Our custom React hooks (`useReducedMotion`) dynamically scale back the speed of camera movements and animations. For users who prefer minimal stimulation, heavy cinematic camera transitions are smoothed out or replaced with immediate cross-fades, ensuring that everyone can experience the story of ocean restoration.

---

## 🚀 Getting Started & Local Development

### Prerequisites

- **Node.js:** `v18.x` or higher
- **npm** or **bun** / **yarn**

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Create a Production Build

```bash
npm run build
```

### 4. Code Quality & Formatting

We maintain standard linting and formatting across our entire codebase:

```bash
npm run lint    # Run ESLint rules
npm run format  # Format codebase using Prettier
```

---

## 🌌 Repository Structure

```bash
├── public/               # Favicons, Webmanifest, static assets
├── src/
│   ├── app/              # Next.js App Router (Layouts, API endpoints, Pages)
│   ├── chapters/         # Story chapters (Chapter01 to Chapter11 layouts)
│   ├── components/
│   │   ├── animations/   # Text reveals, counter animations, float behaviors
│   │   ├── sections/     # Core narrative sections (Hero, Problem, Team, FAQ)
│   │   └── ui/           # Navigation, loading, dashboards, and glass panels
│   ├── data/             # Cinematic camera paths, scene state tables, chapters list
│   ├── hooks/            # useReducedMotion, useScrollProgress, useDeviceTier
│   ├── lib/              # Core libraries configuration (GSAP, Lenis, utils)
│   ├── shaders/          # Custom GLSL fragment and vertex shaders
│   ├── store/            # Zustand global state (useStore)
│   └── world/            # R3F Canvas components (World, Lighting, Seabed, Robot, Kelp, Fish)
├── package.json          # Main manifest
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.ts    # Tailwind styling tokens
```

---

## 🌐 Deployments & Production Readyness

- **Self-Healing Error Boundaries:** The R3F Canvas is wrapped inside an `<ErrorBoundary />`. If a WebGL context is lost, the layout automatically falls back to an elegant static high-fidelity CSS representation, guaranteeing 100% uptime.
- **Serverless Subscriptions:** Includes built-in Next.js App Router API routes under `src/app/api` for subscribing users and collecting anonymous telemetry.

---

_“The sea, once it casts its spell, holds one in its net of wonder forever.”_ — **Jacques Yves Cousteau**

Developed with 💙 by **Jules** and the **AquaGuardian Team**.
