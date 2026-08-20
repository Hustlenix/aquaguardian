## 2026-03-30 - HTML5 Canvas shadowBlur Bottleneck in Animation Loops

**Learning:** Using `ctx.shadowBlur` and `ctx.shadowColor` inside frequent canvas `requestAnimationFrame` loops triggers expensive software-rasterized Gaussian blur passes every frame. Replacing canvas shadow properties with hardware-accelerated 2D radial gradients (`ctx.createRadialGradient`) achieves the same glow visual effect without CPU rasterization bottlenecks.

**Action:** Avoid setting `shadowBlur` in high-framerate canvas animation loops; prefer radial gradients or pre-rendered offscreen sprite canvases instead.
