# ⚡ Bolt's Performance Journal

This performance journal is maintained to document critical learnings, codebase-specific performance patterns, and optimization insights.

## 2025-02-19 - WebGL GPU Memory Leaks in React Three Fiber (R3F)
**Learning:** In React Three Fiber (R3F), imperatively allocated Three.js objects (such as geometries, materials, and textures) created inside hooks like `useMemo` are not automatically garbage-collected or disposed of when their dependencies change or when the component unmounts. Instead, they linger on the GPU, causing severe WebGL memory leaks during page navigation, hot reloading, or quality setting adjustments.
**Action:** Always clean up and manually dispose of these imperatively allocated resources (using `.dispose()`) within `useEffect` cleanup functions whenever they are created in `useMemo` or imperatively inside the component.

## 2025-02-19 - CPU Vertex-Level Displacement & ComputeNormals Bottlenecks
**Learning:** Performing vertex-level displacement animations on the CPU inside `useFrame` loops and calling `.computeVertexNormals()` inside frame loops on dynamic geometries are major bottlenecks. It causes heavy CPU-to-GPU data transfer overhead and redundant math computations.
**Action:** Offload dynamic vertex displacement animations to GPU vertex shaders (e.g., using `THREE.ShaderMaterial`), and avoid computing normals for flat/basic materials or on every frame.
