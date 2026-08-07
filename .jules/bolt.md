## 2026-08-06 - WebGL GPU Resource Disposal Leak Pattern
**Learning:** In React Three Fiber (R3F) and Three.js applications, imperatively allocating geometries, materials, or textures inside `useMemo` hooks is common but leaks GPU VRAM on route transitions or Hot Module Replacement (HMR). Standard garbage collection only cleans up the JavaScript references, leaving the allocated buffers on the GPU.
**Action:** Always manually call `.dispose()` on geometries and materials in a `useEffect` cleanup function when they are imperatively constructed.
