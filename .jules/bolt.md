# Bolt's Performance Journal

## 2026-03-22 - Replacing Canvas shadowBlur with Radial Gradients in Animation Loops
**Learning:** Setting `ctx.shadowBlur` and `ctx.shadowColor` inside frequent canvas `requestAnimationFrame` render loops (like the sonar animation in `public/splash.html`) causes severe CPU bottlenecks because the canvas 2D rendering engine performs expensive software/rasterized Gaussian blurs on every frame for all rendered elements.
**Action:** Replace `shadowBlur` and `shadowColor` in canvas animation loops with hardware-accelerated radial gradients (`ctx.createRadialGradient`), which achieve identical glow effects without CPU rasterization overhead.
