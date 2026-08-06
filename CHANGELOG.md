# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Boids fish schooling.** Three schools (22/12/8 fish at high quality, 12/8 low) now flock with cohesion, alignment, separation, boundary-avoidance, seabed avoidance, and wander behavior — plus banked turns, tail-flick, and an exclusion zone that keeps the schools clear of the robot's base.
- **Procedural instanced reef.** Four coral archetypes (branch, plate, stalk, fern) grown from a seeded PRNG for deterministic layout: ~50 colonies in four draw calls, per-instance sway, and a bleaching lerp when the reef's intact state drops.
- **Ancient ruins composition.** A stepped temple platform with broken pillars, a fallen column glowing with cyan algae, a half-buried arch, and a toppled gold-hieroglyph obelisk whose tilt increases as `intact` falls; shared materials keep it to one geometry pass per element.
- **Layered atmosphere.** A silhouette ridge silhouette, three gradient fog bands, and rising glow motes now frame the scene behind the seabed (`Environment.tsx`, previously a stub).
- **Camera cinematography.** Section-path easing via `THREE.MathUtils.damp`, a sharpening impulse with ~10% overshoot on section change, handheld breathing, micro-roll, look drift, portrait FOV widening, and preserved touch parallax — with zero per-frame allocations.
- **Robot presence.** Emissive eyes with blink clock and glow discs, pulsing chest core, antenna ping rings, dual counter-rotating scan rings with a sweep plane, pickup-beam pulse, and banking yaw/roll in turns; the debris collection cycle contract (idle → seek → hover → return, 12 s respawn, 8 s cooldown) is unchanged.
- **Living particles and bubbles.** Particles now layer dust (warm, buoyant), plankton, and sinking marine snow with velocity drift and sinusoidal wobble; bubbles gain dual-harmonic wobble, surface hold, pop shrink/fade, and rare chains of up to five.
- **Instanced kelp and rocks.** Kelp is a single instanced mesh with GPU sway via an `onBeforeCompile` phase attribute (was one mesh per stalk); seabed rocks are instanced, and the debris registry was refactored to be StrictMode-safe.

### Changed
- **Volumetric ocean grade.** The ocean gradient now blends mid-water and sun colors with depth haze (`uMidColor`/`uSunColor`/`uHazeColor`/`uHazeDensity`) synced to the store's fog color; waves gained a fifth octave and swell-breathing amplitude (±8%).
- **Animated caustics.** Caustics now breathe (`uScale`), drift, and slowly rotate with an edge fade, replacing the static overlay.
- **Bending light shafts.** Volumetric rays bend with 3D sway (`uTime`/`uHeight`), shimmer, and per-ray core-width/radius pulsing.
- **Cinematic light rig.** Key light orbits and warms/cools per section, hemispherical + ambient split, a cyan under-bounce light, a robot spotlight with damped target, and a camera-following rim light.
- **Quality-gated postprocessing.** High quality renders Bloom + SSAO (half resolution) + Depth of Field + ACES filmic tone mapping + vignette + film grain + chromatic aberration; low quality renders bloom only, with the normal pass disabled.
- **Determinism and performance.** All animation loops use pre-allocated scratch vectors and refs — no per-frame allocations; coral, kelp, rocks, and silhouettes are instanced; low-tier counts scale down for mobile.

## [1.0.0] - 2026-08-05

### Added
- **Full-stack API layer.** New shared persistence helper `src/lib/dataStore.ts` (atomic writes, in-memory cache) backed by `database.json`; new routes under `src/app/api/` — `GET /api/missions`, `POST /api/missions/toggle`, `GET /api/challenges`, `POST /api/challenges/join`, `GET /api/learn`, `POST /api/learn/complete`, `POST /api/assistant`, `POST /api/subscribe`; `GET /api/stats` refactored onto the same store. Seeded `database.json` with 6 missions, 4 challenges, and 6 real-content learn modules.
- **Dual-mode data layer.** `src/lib/api.ts` gives every ecosystem page a single fetch-with-fallback helper: real APIs in server mode, bundled seed data + localStorage (`aqua-missions`, `aqua-challenges`, `aqua-learn`) on the static GitHub Pages export.
- **Deepened ecosystem pages.** `/missions` gained toggleable completion with optimistic updates, a progress bar, and reset; `/challenges` gained difficulty badges, participant counts, deadlines, and persistent join state; `/learn` became six expandable accordion modules with per-module completion; `/assistant` is now a working chat UI with suggested prompts and category-matched answers; `/mobile` shows a phone-frame mockup of the companion app; `/dashboard` gained a pure-SVG chart of the last 12 collection events.
- **Mobile 3D quality.** Quality matrix documented in `World.tsx` — dpr capped at `[1, 1.5]` on mobile vs `[1, 2]` on desktop, bloom-only effects with multisampling 0 on low tiers, particles halved and enlarged on mobile, touch-drag camera parallax, and a wider FOV with a pulled-back camera on portrait screens.
- **Robot patrol & collection.** The robot now drifts on a slow idle patrol sway, and periodically seeks the nearest debris item, hovers ~2s under a pulsing cyan pickup beam, collects it (item hides, respawns ~12s later via the Seabed debris registry), and returns to base.

## [0.9.0] - 2026-08-05

### Changed
- Upgraded the entire 3D scene to a cinematic quality tier: bloom, vignette, film grain, and chromatic aberration postprocessing now render (previously defined but never wired into the scene).
- Rebuilt volumetric light shafts with true radial falloff and sway; fixed the off-axis bright band in the old falloff.
- Layered multi-octave ocean waves with white glint cores, breathing amplitude, and depth-based clarity.
- Added animated procedural caustics drifting across the seabed with a warm gold cast.
- Particles now twinkle on two harmonics; bubbles wobble, size-vary, and pop at the surface; fish schools grew to 40 at high quality; kelp sways harder at the tips.
- Robot: idle hover anchored to scene-state position, antenna sway, chest-core pulse with cyan glow when activated.

## [0.8.0] - 2026-08-03

### Added
- Real Ocean Data section backed by a generated, reproducible dataset.

### Removed
- Remaining fabricated/unsourced claims from all copy; the dataset is now explicitly labeled demo data.

## [0.7.0] - 2026-08-01

### Added
- MIT license.
- Asset validation and screenshot-check scripts that fail the build on rotted or missing assets.
- Native C data generator (`scripts/native/ocean_metrics.c`) with deterministic seeding.

### Fixed
- Internal links for static export; cleaned dead code and unused dependencies.
- Sitemap updated to the final route set.

## [0.6.0] - 2026-06-19

### Added
- Framework-free splash page (`public/splash.html`) with a canvas sonar sweep.
- Regenerated dataset with cleaned values.

## [0.5.0] - 2026-06-05

### Added
- Dashboard wiring for the generated ocean dataset.
- Build-time Python tooling (`screenshot_check.py`, `validate_assets.py`, `analyze_ocean_data.py`, `generate_social_banner.py`).

## [0.4.0] - 2026-05-22

### Added
- README screenshots gallery and rewritten project documentation.

## [0.3.0] - 2026-05-09

### Added
- Favicon set, web manifest, and Open Graph image.
- Cleaned lint configuration; removed legacy files.

## [0.2.0] - 2026-04-28

### Added
- Branded sonar loader and page transitions.
- Expanded experience modes (dashboard, missions, challenges, learn, assistant, mobile).
- Reduced-motion guard and glass highlight polish.

### Fixed
- Build regressions; restored scene rendering.

## [0.1.0] - 2026-03-29

### Added
- Full landing page: 14 sections, hero to footer.
- Cinematic 3D underwater scene: ocean gradient, floating particles, coral, light rays, bubbles, fog, seabed, robot.
- Scroll-driven camera choreography and scene states.
- GitHub Pages deployment via GitHub Actions.
- UI/UX audit pass: counters, reduced motion, CTAs, headings, gallery.

[Unreleased]: https://github.com/Hustlenix/aquaguardian/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v1.0.0
[0.9.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.9.0
[0.8.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.8.0
[0.7.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.7.0
[0.6.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.6.0
[0.5.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.5.0
[0.4.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.4.0
[0.3.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.3.0
[0.2.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.2.0
[0.1.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.1.0
