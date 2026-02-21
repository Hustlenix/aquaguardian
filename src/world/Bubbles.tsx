'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Bubbles({ count = 40 }) {
  const ref = useRef<THREE.Points>(null)
  const speeds = useRef<number[]>([])

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    speeds.current = []
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = Math.random() * 10 - 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
      speeds.current.push(0.5 + Math.random() * 1.5)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }, [count])

  useFrame((state, delta) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += speeds.current[i] * delta * 0.5
        pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * delta * 0.1
        if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = -3
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color="#AAE0FF"
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}
