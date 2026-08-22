# Underwater Scene Visual Upgrade — Design Spec

**Date:** 2026-08-06
**Status:** Approved (user selected "Full phased implementation"; robot asset = Quaternius Animated Robot)

## Goal

Substantially raise the visual quality of the AquaGuardian R3F underwater scene across four independent upgrade tracks — robot hero asset, ocean life, water surface/caustics, lighting & post — while preserving the existing quality-tier budget system, the procedural architecture, the scene's aesthetic (abyss #010B13, gold #D4AF37, cyan #00E5FF), and the GitHub Pages static-export constraint.

## Architecture

The scene is a fully procedural R3F world (16 files in `src/world/`, 3 custom shaders in `src/shaders/`) with a quality-tier system (`useStore().quality`, high > 0.75, mobile ≤ 0.75). Each upgrade phase is an isolated, independently reviewable change that follows existing file boundaries — no new architectural layers, no state-model changes, no bundler changes. All runtime assets are CC0-licensed, downloaded once, and committed to the repo (GitHub Pages is served from the `gh-pages` branch, so committed assets ship directly).

## Tech Stack

- Next.js 15.2 (static export), React 19, three 0.174, @react-three/fiber 9.1, drei 10.7.7, @react-three/postprocessing 3.0.4, zustand 5
- Tooling to be added in Phase 1: `gltfjsx` (`npx @pmndrs/gltfjsx` — no permanent dependency needed; transform step is one-time) and `@gltf-transform/cli` (one-time, can be invoked via `npx`)

## Global Constraints

- **Licensing:** Only CC0 assets. No CC BY, no CC BY-NC-SA, no NC derivatives. Verify the license badge on the exact download page before committing any file.
- **Bundle size:** Total committed asset payload ≤ 3 MB (GitHub Pages soft limits; current site is tiny). Robot GLB target ≤ 1 MB (gltfjsx `--transform` + `--compress` / gltf-transform `meshopt`).
- **Quality tiers:** High (> 0.75) gets full effects and high counts; mobile/medium keeps the existing bloom-only post path. New geometry (jellyfish, fish swap, caustics) must have reduced counts/segments on low quality exactly like existing components do.
- **No WebGPU:** FFT ocean, GPGPU water, and compute caustics are out of scope (browser support gaps on Linux/mobile).
- **No drei `Water`/`Water2`:** drei 10.7.7 does not export them (verified in node_modules). Water-surface ripple is done via a custom shader extension of the existing `oceanGradient` material.
- **No shadow maps:** castShadow stays false everywhere (verified budget decision in Lighting.tsx).
- **No texture > 2048²** and no .hdr environment files committed (use drei `Environment` with a lightweight preset path or procedural env).
- **Do not commit LFS:** GitHub Pages doesn't serve LFS. Keep every file under the 100 MB push limit (trivially true here).
- **Do not break:** the section-scroll state machine (`useStore` activeSection), the robot motion system, the boids simulation, the static export build (`npm run build` must pass), and `npm run lint`.
- **Verification per phase:** `npm run lint` and `npm run build` must pass; visual sanity via dev server at the end of each phase.
- **Aesthetic:** preserve abyss dark, gold/cyan accent palette, cinematic post grade (ACES).

## Phase 1 — Robot Hero Asset (GLB swap)

**Decision (user-approved):** Quaternius Animated Robot (CC0).

**Context:** `src/world/Robot.tsx` is currently 100% procedural primitives (534 lines) with a rich, battle-tested motion system: idle hover drift, heading yaw + roll into travel, head scan, antenna sway, chest-core pulse + cyan point light, eye blink with glow discs, ping ring, scan rings, pickup beam, collection cycle state machine (idle → seek → hover → return) driven by `debrisRegistry` from `Seabed.tsx`. Only the **visual mesh** is being swapped; the motion system, lights, and effects are preserved.

**Asset (user-approved):** Quaternius **Animated Robot** — CC0 (Public Domain), humanoid robot matching the AUV identity. Download source: Poly Pizza `https://poly.pizza/m/QCm7qe9uNJ` (Animated Robot by Quaternius, GLTF format, Public Domain CC0). Fallback (also CC0): three.js `RobotExpressive.glb` by Tomás Laulhé / mods Don McCurdy — `https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb` (CC0 verified in three.js repo/examples). Exact download URL for the Poly Pizza file is fetched from the model page at execution time; license badge re-verified on that page before committing.

**Work:**
1. Download the Quaternius Animated Robot GLB (from Poly Pizza page; fallback RobotExpressive.glb).
2. Optimize: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt` (or gltfjsx `--transform --compress`) to get well under the 1 MB target.
3. Generate JSX with `npx @pmndrs/gltfjsx out.glb --types --shadows=false` → `src/world/RobotModel.tsx` (new file next to the other scene files in `src/world/`, which is the established pattern).
4. Rewrite `Robot.tsx`'s visual layer: replace the procedural body/head/arms/base meshes with `<RobotModel>` inside the existing motion `group`, keeping: hover/positioning, yaw/roll, head group (attach to the model's head bone if named, else drive the whole model), antenna sway (map to existing antenna bone or drop), core light, eye glow (if model has emissive eyes, keep a billboard glow disc on the head), ping ring, scan rings, pickup beam.
5. The model's own animation clips (it has ~34) are NOT used — the existing procedural motion system stays the driver. `useAnimations` is not needed.
6. If the model has named bones for head/antenna, drive those via refs into the group; otherwise animate the whole model group. Exact bone mapping is an implementation detail resolved at build time (inspect the generated JSX from gltfjsx for bone names).
7. Fallback path: if the downloaded model fails to load or is unexpectedly large, keep the procedural body and swap only materials (metalness/roughness map upgrade) — decision gate at Phase 1 review.

**Deliverable:** Robot renders as the Quaternius model with all existing motion, lights, scan effects, and the collection cycle intact; build + lint pass; asset committed.

## Phase 2 — Ocean Life Pack

**Context:** `Fish.tsx` has a strong CPU boids sim (~42 fish, 22-fish schools, exclusion zone) with a cone body; `Kelp.tsx` uses InstancedMesh with `onBeforeCompile` sway and box blades.

### 2a. Jellyfish (new file `src/world/Jellyfish.tsx`)

- 2–3 jellyfish near the mid-water column (hero area), using drei `MeshDistortMaterial` on an icosahedron dome + tentacle strands (thin cylinder/capsule primitives, gently waving via `useFrame` per-jellyfish phase offset).
- Colors: soft cyan/white translucent bodies (transparent, opacity ~0.4, additive-ish) that the existing Bloom picks up.
- Count: 3 on high, 1–2 on low/mobile. No lights added (existing rig lights them).
- Each jellyfish is an independent component instance; no shared state.

### 2b. Fish body swap

- Replace the cone body with a sleeker fish shape: flattened ellipsoid body (sphere scaled non-uniformly) + simple tail fin plane with a light vertex wiggle, OR a low-poly CC0 fish GLB (Quaternius Fish pack is CC0) — decision: use a simple parametric body (2 primitives) to keep the boids untouched and avoid a new asset download. Keep the boids sim logic and count exactly as-is.
- Keep the existing movement (the cone currently aligns to velocity — same alignment applies to the new body; tail wiggle adds life).

### 2c. Kelp blade reshape

- In `Kelp.tsx`, change blade geometry from box to a tapered strip (custom BufferGeometry or a scaled plane/cylinder segment) with the existing sway shader; keep InstancedMesh, keep counts, keep `onBeforeCompile` sway. Taper = base wide, tip narrow.

**Deliverable:** jellyfish component (new), fish visual swap, kelp reshape; counts respect quality tiers; boids behavior unchanged; lint + build pass.

## Phase 3 — Water Surface & Caustics

### 3a. Ocean surface ripple

- `src/world/Ocean.tsx`: extend the existing `oceanGradient` vertex shader with a two-octave Gerstner-like ripple (sum of sines displacing Y and perturbing normals) so the ceiling surface reads as living water. Keep the existing gradient/color logic in the fragment shader untouched.
- Amplitude tuned so the robot section and hero silhouette remain readable (the surface is at y=0.5, well above the action — safe to be lively).
- Segments already 96/48 by tier — keep.

### 3b. Projected caustics upgrade

- `src/world/Caustics.tsx`: keep the current procedural sum-of-abs-sines fragment approach as the base, but add a second high-frequency octave + a slow directional "sun angle" drift so the pattern moves coherently (light rays from the surface direction), and reduce the grid-scale breathing. No drei `Caustics` projection (it's a real-time light-projection effect that needs a light source + normal pass; the current additive plane approach is cheaper and already integrates with the grade).
  - Note: the research report evaluated drei `Caustics`; the recommendation adopted here is to upgrade the existing shader (cheaper, tier-friendly) rather than switch to drei Caustics. This is a deliberate deviation from the report's "projected drei Caustics" phrasing — the report itself flagged cost concerns. If visual results are weak, the Phase 3 review gate can revisit drei `Caustics` (it IS exported by drei 10.7.7).
- Optionally add subtle caustic shimmer to the seabed material via `onBeforeCompile` only if it's cheap; otherwise keep to the plane.

**Deliverable:** living ripple surface + improved caustic pattern; tier-adaptive; lint + build pass.

## Phase 4 — Lighting & Post

### 4a. Environment reflections

- Add `drei <Environment>` with `background={false}` using a **custom `Lightformer` rig only** (no preset): drei presets fetch .hdr files from a CDN at runtime, which is a network dependency on a statically-exported site and adds no committed-file control. A procedural Lightformer rig has zero network, zero files, and full aesthetic control. Verify drei Environment does not clash with the custom `Environment.tsx` atmosphere (it doesn't — different concerns; the custom file stays as-is).
- Keep it cheap: Environment only renders at high quality; skip on mobile (`{isHigh && <Environment .../>}`). Consider `resolution={32}`.
- Add subtle `Lightformer` strips to give the robot a gold/cyan sheen matching the aesthetic (gold key from the top, cyan rim).

### 4b. LUT color grade

- `src/world/Effects.tsx`: add `LUT` from `@react-three/postprocessing` with a mild teal-and-orange-ish underwater LUT (or a `HueSaturation` + `BrightnessContrast` pair if no LUT texture is committed — decision: use `HueSaturation`/`BrightnessContrast` to avoid committing a texture; the report verified both are exported by postprocessing 3.0.4).
- Apply only on high quality, after ToneMapping, tuned to deepen the abyss and warm the gold.

### 4c. Light rig consolidation

- `src/world/Lighting.tsx`: the rig has 9 lights (hemisphere + ambient + directional + 6 point). Consolidate: remove the two lowest-value static point lights (lines 137, 157–158 candidates), keep the animated key/bounce/rim/robot-spot. Target: 7 lights. Verify no visible change in the grade at high quality (the removed lights were fill helpers).

**Deliverable:** reflections on metal, graded color, leaner rig; mobile path unchanged; lint + build pass.

## Phase 5 — Final Review

- `@reviewer` pass over all changed files (Robot.tsx, RobotModel.tsx, Jellyfish.tsx, Fish.tsx, Kelp.tsx, Ocean.tsx, Caustics.tsx, Lighting.tsx, Effects.tsx, + any new files).
- Full `npm run build` + `npm run lint` + dev-server visual check on hero, robot, and mobile-tier.
- Asset license audit: list committed files + their license provenance.
- Summary report to user.

## Out of Scope (Do-Not list, from research)

WebGPU/FFT water, drei Water/Water2, raymarched water shaders, transmission-materials water, NC-licensed assets, shadow maps, textures > 2048², Git LFS, HDR environment files, robot animation-clip playback (motion system stays procedural), restructuring the store or scroll system, any bundler/config changes.

## Risk & Effort

| Phase | Risk | Effort | Mitigation |
|---|---|---|---|
| 1 Robot swap | Low–Med (asset pipeline, bone mapping) | Med | gltfjsx one-time; keep procedural fallback; verify CC0 on download page |
| 2 Ocean life | Low (new component, primitive swaps) | Med | tier counts; no sim changes |
| 3 Water/caustics | Low (shader-only) | Low–Med | keep fragment grade intact; visual gate |
| 4 Lighting/post | Low | Low | mobile path untouched; 9→7 lights |

## Verification Plan

Per phase: `npm run lint`; `npm run build`; dev-server visual check (high tier + mobile tier). Final: reviewer pass + asset license audit + summary.
