'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number
  color?: string
  opacity?: number
  speed?: number
}

export default function Particles({ count = 200, color = '#88CCFF', opacity = 0.4, speed = 0.3 }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null)
  const offsetsRef = useRef<Float32Array>(new Float32Array(count))

  const geometry = useMemo(() => {
    offsetsRef.current = new Float32Array(count)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = Math.random() * 20 - 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5
      offsetsRef.current[i] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }, [count])

  const colorObj = useMemo(() => new THREE.Color(color), [color])

  useFrame((state) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      const s = speed * 0.003
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed + offsetsRef.current[i]) * s
        pos[i * 3] += Math.cos(state.clock.elapsedTime * speed * 0.7 + offsetsRef.current[i] * 0.5) * s * 0.5
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.2}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color={colorObj}
        opacity={opacity}
        sizeAttenuation
      />
    </points>
  )
}
