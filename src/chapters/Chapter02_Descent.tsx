'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter02_Descent() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 1
  const particlesRef = useRef<THREE.Points>(null)
  const count = 80

  const particles = useRef(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = Math.random() * 12 - 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }).current()

  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= 0.01
        if (pos[i * 3 + 1] < -6) pos[i * 3 + 1] = 6
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  if (!isActive) return null

  return (
    <points ref={particlesRef} geometry={particles}>
      <pointsMaterial
        size={0.04}
        color="#1A3A4A"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
