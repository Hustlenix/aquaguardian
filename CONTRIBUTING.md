# Contributing to AquaGuardian

Thanks for taking the time to contribute. This project is a personal showcase of interactive 3D web engineering, and every improvement — big or small — is welcome.

## Ground Rules

- The ocean-conservation content is **educational and explicitly fictional**. Do not add fabricated statistics or claims that could read as real collection records. The dataset in `database.json` is generated demo data and should stay labeled as such.
- Keep the experience **fast**: the 3D scene is the centerpiece, but it must respect the quality tiers (mobile/medium/high) and never tank the frame rate on mid-range hardware.
- Preserve the design system — colors, typography, and motion tokens live in `src/tokens/` and `src/app/globals.css`. Use them instead of ad-hoc values.

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (http://localhost:3000)
4. Create a branch: `git checkout -b feat/your-feature`

## Making Changes

- Run the linter before committing: `npm run lint`
- Run a production build to confirm types and static export still work: `npm run build`
- For the static export path: `STATIC_EXPORT=true npm run build`
- Write meaningful commit messages that describe what changed and why. Follow the existing style (e.g. `Upgrade 3D scene: …`, `Fix internal links for static export`).
- Keep changes small and reviewable. One logical change per commit.

## 3D Scene Work

- Scene components live in `src/world/`. Each mesh should subscribe narrowly to the Zustand store slices it reads (see `src/store/`) to avoid full-canvas re-renders.
- New GPU effects belong in `src/shaders/` as `.ts` + `.glsl` pairs.
- Postprocessing goes in `src/world/Effects.tsx` and must be gated by the store's quality tier.
- If you change scene behavior, run `npm run build` and eyeball the result at high and low quality.

## Documentation

If you change user-facing behavior, build tooling, or deployment, update the README and add an entry to CHANGELOG.md under the appropriate version.

## Questions

Open an issue for bugs or feature ideas. For anything else, a discussion is fine — this is a friendly project.
