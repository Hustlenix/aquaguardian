# Bolt's Performance Journal - Critical Learnings

## 2026-03-31 - Canvas Shadow Blur vs Radial Gradient in Frame Loops
**Learning:** Using `ctx.shadowBlur` and `ctx.shadowColor` inside high-frequency `requestAnimationFrame` canvas rendering loops forces CPU-based software filtering/blurring on every frame, significantly slowing down animation framerates.
**Action:** Replace canvas shadow blur operations with `ctx.createRadialGradient` fills to achieve hardware-accelerated glowing particle/blip effects without triggering CPU software filter bottlenecks.
