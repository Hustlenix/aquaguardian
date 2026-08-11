## 2026-03-01 - [Canvas rendering optimization]
**Learning:** HTML5 Canvas `shadowBlur` and `shadowColor` inside frequent animation frame loops (such as requestAnimationFrame) is a major CPU bottleneck because it forces costly CPU-side software blurring operations and invalidates canvas context states frequently. Replacing them with a hardware-accelerated `createRadialGradient` radial gradient glow yields massive performance wins.
**Action:** Always avoid `shadowBlur` in high-frequency loop paths on the canvas; use radial gradients for hardware-accelerated glowing/blurred shapes.
