# Bolt's Performance Journal

## 2026-08-07 - Canvas Shadow Performance Optimization
**Learning:** Using HTML5 Canvas `shadowBlur` and `shadowColor` inside frequent animation frame loops (such as requestAnimationFrame running at 60 FPS) is a major CPU/GPU rendering bottleneck. It triggers heavy rendering calculations on the browser's 2D context. Replacing these legacy shadow properties with a hardware-accelerated radial gradient (`createRadialGradient`) yields substantial performance wins, dramatically lowering CPU load and improving frame stability while achieving visually identical glowing effects.
**Action:** Always avoid `shadowBlur` and `shadowColor` inside high-frequency animation loops; offload glow/blur effects to hardware-accelerated radial gradients or webGL shaders.
