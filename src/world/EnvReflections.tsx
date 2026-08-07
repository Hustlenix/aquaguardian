'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * Procedural reflection rig — NO presets. drei Environment presets fetch
 * .hdr files from a CDN at runtime, which is a network dependency on a
 * statically-exported site; this rig is 100% local and committed-code-only.
 *
 * Baked once (frames={1}) at a modest resolution: the robot's materials have
 * metallicFactor 0.4, so the rig adds a gold key from above and a cyan rim —
 * matching the scene's gold/cyan aesthetic — without any texture files.
 * Only rendered on the high-quality tier; mobile keeps the existing rig.
 */
export default function EnvReflections() {
  return (
    <Environment resolution={64} frames={1} background={false}>
      {/* Gold key from the top — the "sun through the water" sheen */}
      <Lightformer
        form="rect"
        intensity={2}
        color="#D4AF37"
        position={[0, 5, 0]}
        rotation-x={Math.PI / 2}
        scale={[6, 6, 1]}
      />
      {/* Cyan rim from behind-left — silhouette edge on the robot */}
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#00E5FF"
        position={[-4, 0, -4]}
        rotation-y={Math.PI / 2}
        scale={[6, 3, 1]}
      />
      {/* Cool fill from behind-right — separation from the abyss */}
      <Lightformer
        form="rect"
        intensity={1}
        color="#6AB8D8"
        position={[4, 0, -4]}
        rotation-y={-Math.PI / 2}
        scale={[6, 3, 1]}
      />
      {/* Soft neutral fill from the camera side so metals never go black */}
      <Lightformer
        form="rect"
        intensity={0.5}
        color="#B8D4E3"
        position={[0, 1, 4]}
        scale={[8, 3, 1]}
      />
    </Environment>
  )
}
