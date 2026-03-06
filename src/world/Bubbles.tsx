'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Bubbles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const speeds = useRef<number[]>([])
  const phases = useRef<number[]>([])

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    speeds.current = []
    phases.current = []
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = Math.random() * 12 - 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
      sizes[i] = 0.03 + Math.random() * 0.12
      speeds.current.push(0.3 + Math.random() * 1.8)
      phases.current.push(Math.random() * Math.PI * 2)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [count])

  useFrame((state, delta) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      const sizes = ref.current.geometry.attributes.size.array as Float32Array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += speeds.current[i] * delta * 0.4
        const wobble = Math.sin(state.clock.elapsedTime * 0.5 + phases.current[i]) * delta * 0.15
        pos[i * 3] += wobble
        pos[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.4 + phases.current[i] * 1.3) * delta * 0.08
        if (pos[i * 3 + 1] > 8) {
          pos[i * 3 + 1] = -3
          pos[i * 3] = (Math.random() - 0.5) * 18
          pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
        }
        sizes[i] = (0.03 + Math.random() * 0.01) * (1 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.2)
      }
      ref.current.geometry.attributes.position.needsUpdate = true
      ref.current.geometry.attributes.size.needsUpdate = true
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color="#C8E8FF"
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}
