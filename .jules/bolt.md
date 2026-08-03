## 2025-02-18 - [React Three Fiber WebGL Memory Disposals]

**Learning:** Programmatic/imperative creation of Three.js objects (such as `THREE.BufferGeometry`, `THREE.ShaderMaterial`, and `THREE.CanvasTexture`) inside `useMemo` hooks is not automatically tracked or disposed of by React Three Fiber's scene graph JSX. When components unmount (e.g., during page navigation in Next.js) or state dependencies update, the GPU memory remains allocated, causing severe WebGL memory leaks that can eventually crash the browser or degrade rendering performance.
**Action:** Always hook into React's life cycle with `useEffect` to invoke `.dispose()` on imperatively-allocated geometries, materials, and textures when the component unmounts or when the resource dependencies change.
