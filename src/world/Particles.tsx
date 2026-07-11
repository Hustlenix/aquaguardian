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

function ParticleLayer({
  count,
  color,
  opacity,
  speed,
  sizeBase,
  spreadMul,
  yRange,
  yOffset,
}: ParticlesProps & { sizeBase: number; spreadMul: number; yRange: [number, number]; yOffset: number }) {
  const ref = useRef<THREE.Points>(null)
  const offsetsRef = useRef<Float32Array>(new Float32Array(count!))

  const geometry = useMemo(() => {
    offsetsRef.current = new Float32Array(count!)
    const pos = new Float32Array(count! * 3)
    const sizes = new Float32Array(count!)
    for (let i = 0; i < count!; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50 * spreadMul
      pos[i * 3 + 1] = yRange[0] + Math.random() * (yRange[1] - yRange[0]) + yOffset
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 * spreadMul - 5
      offsetsRef.current[i] = Math.random() * Math.PI * 2
      sizes[i] = sizeBase * (0.5 + Math.random() * 1)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [count, sizeBase, spreadMul, yRange, yOffset])

  const colorObj = useMemo(() => new THREE.Color(color), [color])

  useFrame((state) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      const s = speed! * 0.003
      for (let i = 0; i < count!; i++) {
        pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed! + offsetsRef.current[i]) * s
        pos[i * 3] += Math.cos(state.clock.elapsedTime * speed! * 0.7 + offsetsRef.current[i] * 0.5) * s * 0.5
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={sizeBase}
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

export default function Particles(props: ParticlesProps) {
  return (
    <group>
      <ParticleLayer
        {...props}
        sizeBase={0.08}
        spreadMul={1.2}
        yRange={[-3, 12]}
        yOffset={0}
      />
      <ParticleLayer
        {...props}
        count={Math.round((props.count ?? 200) * 2.5)}
        sizeBase={0.03}
        spreadMul={1.5}
        yRange={[-5, 15]}
        yOffset={0}
        opacity={(props.opacity ?? 0.4) * 0.35}
        speed={(props.speed ?? 0.3) * 0.5}
        color="#88BBDD"
      />
    </group>
  )
}
