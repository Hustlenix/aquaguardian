'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function LightRays({ count = 5 }) {
  const configs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 16,
      z: (Math.random() - 0.5) * 12 - 2,
      width: 0.3 + Math.random() * 0.6,
      height: 6 + Math.random() * 8,
      opacity: 0.08 + Math.random() * 0.12,
      rotation: (Math.random() - 0.5) * 0.15,
    })),
  [count])

  return (
    <group>
      {configs.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, -2 + c.height / 2, c.z]}
          rotation={[0, 0, c.rotation]}
        >
          <planeGeometry args={[c.width, c.height]} />
          <meshBasicMaterial
            color="#88CCFF"
            transparent
            opacity={c.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
