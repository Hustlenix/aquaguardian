'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter03_Crisis() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 2
  const ref = useRef<THREE.Group>(null)

  const particles = useMemo(() => {
    const pos = new Float32Array(100 * 3)
    for (let i = 0; i < 100; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (ref.current && isActive) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  if (!isActive) return null

  return (
    <group ref={ref}>
      <points geometry={particles}>
        <pointsMaterial
          size={0.1}
          color="#8A4A3A"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
