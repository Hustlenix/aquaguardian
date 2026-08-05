# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- None pending.

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

[Unreleased]: https://github.com/Hustlenix/aquaguardian/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.9.0
[0.8.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.8.0
[0.7.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.7.0
[0.6.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.6.0
[0.5.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.5.0
[0.4.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.4.0
[0.3.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.3.0
[0.2.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.2.0
[0.1.0]: https://github.com/Hustlenix/aquaguardian/releases/tag/v0.1.0
