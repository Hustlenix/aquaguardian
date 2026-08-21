## 2025-05-18 - Static InstancedMesh Attribute Updates in R3F
**Learning:** Calling `ref.current.setColorAt` and setting `ref.current.instanceColor.needsUpdate = true` on every frame inside `useFrame` for static instance colors incurs unnecessary CPU loop overhead and forces WebGL to re-upload the entire instance color attribute buffer to the GPU 60 times per second.
**Action:** Initialize static instance attributes (such as instance colors) inside a `useEffect` hook on mount/change, and only update dynamic attributes (like `instanceMatrix`) inside the `useFrame` render loop.
