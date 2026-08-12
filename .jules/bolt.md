# Bolt's Journal - Critical Learnings Only

## 2026-08-12 - HTML5 Canvas shadowBlur Bottleneck
**Learning:** Using `shadowBlur` and `shadowColor` in canvas animations is extremely expensive because the browser has to render the blur using CPU shadow algorithms on every single frame, causing severe frame rate drops. Replaying it with `createRadialGradient` is highly hardware-accelerated and provides an equivalent or better glowing effect without the performance cost.
**Action:** Replace `shadowBlur` and `shadowColor` with `createRadialGradient` for glowing blips/elements in canvas frame loops.
