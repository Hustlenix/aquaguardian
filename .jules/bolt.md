# Bolt's Performance Journal

## 2026-08-10 - HTML5 Canvas shadowBlur CPU Bottleneck
**Learning:** Using HTML5 Canvas `shadowBlur` and `shadowColor` inside frequent animation loops (like `requestAnimationFrame`) is a well-known CPU/GPU performance bottleneck. Browsers struggle to render blurred shadows efficiently in 2D canvases because they require a costly gaussian blur operation on the CPU or an inefficient GPU pass on every frame. Replacing them with hardware-accelerated radial gradients (`createRadialGradient`) or simple multi-pass drawing yields substantial performance wins without breaking visual expectations.
**Action:** Replace `shadowBlur` inside canvas animation loops with hardware-accelerated radial gradients (`createRadialGradient`).
