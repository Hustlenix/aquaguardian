# Bolt's Performance Journal

This performance journal documents critical performance patterns, lessons, and codebase-specific optimizations.

## 2025-05-15 - HTML5 Canvas Shadow Blur Overhead in Animation Loops
**Learning:** Using `ctx.shadowColor` and `ctx.shadowBlur` inside canvas animation loops (such as `requestAnimationFrame` loops) introduces a severe performance penalty. These operations force the canvas context to perform CPU-bound Gaussian blur or offscreen compositing passes on every single frame, quickly tanking frame rates on low-end and mobile devices.
**Action:** Replace `shadowBlur` and `shadowColor` properties with lightweight, hardware-accelerated equivalents like `createRadialGradient` or pre-rendered offscreen sprites to construct smooth glow effects efficiently.
