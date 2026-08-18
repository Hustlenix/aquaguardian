## 2026-03-30 - Replace HTML5 Canvas shadowBlur with Radial Gradient
**Learning:** Using `ctx.shadowBlur` and `ctx.shadowColor` inside 60fps `requestAnimationFrame` loops triggers costly CPU Gaussian blur rasterization on every frame in Canvas 2D contexts.
**Action:** Replace `shadowBlur` in Canvas animation loops with hardware-accelerated radial gradients (`ctx.createRadialGradient`) or pre-rendered offscreen sprites.
