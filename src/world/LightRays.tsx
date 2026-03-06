'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightRaysProps {
  color?: string
  opacity?: number
}

export default function LightRays({ color = '#88CCFF', opacity = 0.12 }: LightRaysProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rayColor = useMemo(() => new THREE.Color(color), [color])

  const configs = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 22,
      z: (Math.random() - 0.5) * 18 - 2,
      width: 0.2 + Math.random() * 0.7,
      height: 5 + Math.random() * 11,
      rotOffset: (Math.random() - 0.5) * 0.2,
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    })),
  [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as THREE.Mesh
      const cfg = configs[i]
      const sway = Math.sin(t * cfg.speed + cfg.phase) * 0.04
      mesh.position.x = cfg.x + Math.sin(t * cfg.speed * 0.5 + cfg.phase) * 0.3
      mesh.rotation.z = cfg.rotOffset + sway
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = opacity * (0.7 + Math.sin(t * cfg.speed * 0.3 + cfg.phase) * 0.3)
    }
  })

  return (
    <group ref={groupRef}>
      {configs.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, -1.5 + c.height / 2, c.z]}
          rotation={[0, 0, c.rotOffset]}
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
