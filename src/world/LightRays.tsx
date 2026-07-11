'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface LightRaysProps {
  color?: string
  opacity?: number
}

export default function LightRays({ color = '#88CCFF', opacity = 0.12 }: LightRaysProps) {
  const rayColor = useMemo(() => new THREE.Color(color), [color])

  const configs = useMemo(() =>
    Array.from({ length: 6 }, () => ({
      x: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 14 - 2,
      width: 0.3 + Math.random() * 0.8,
      height: 7 + Math.random() * 9,
      rotation: (Math.random() - 0.5) * 0.15,
    })),
  [])

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
            color={rayColor}
            transparent
            opacity={opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
