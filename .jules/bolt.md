# Bolt's Performance Journal

## 2025-02-17 - WebGL Memory Leak Prevention in React Three Fiber (R3F)
**Learning:** In React Three Fiber (R3F), imperatively allocated Three.js objects (such as geometries and materials) created inside `useMemo` hooks are not automatically managed by R3F's virtual DOM reconciliation. If a component unmounts (e.g. during client-side routing) or if state changes trigger recreation of these objects, the old ones are completely leaked in the WebGL context, leading to a severe GPU memory leak (VRAM) that degrades performance over time.
**Action:** Always call `.dispose()` on any imperatively instantiated geometries, materials, textures, or render targets inside a `useEffect` cleanup hook to safely release GPU resources from the WebGL context.
