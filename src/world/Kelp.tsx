'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface KelpProps {
  density?: number
}

function KelpStalk({ x, z, height, phase, color }: {
  x: number; z: number; height: number; phase: number; color: string
}) {
  const ref = useRef<THREE.Group>(null)
  const segments = 8
  const segHeight = height / segments

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const children = ref.current.children
    for (let i = 0; i < segments; i++) {
      const mesh = children[i] as THREE.Mesh
      const sway = Math.sin(t * 0.4 + phase + i * 0.5) * 0.08 * (i / segments)
      mesh.position.x = sway * (i * 0.3)
      mesh.rotation.z = sway * 0.5
    }
  })

  return (
    <group ref={ref} position={[x, -4, z]}>
      {Array.from({ length: segments }, (_, i) => (
        <mesh key={i} position={[0, i * segHeight + segHeight / 2, 0]}>
          <boxGeometry args={[0.03, segHeight * 1.1, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

export default function Kelp({ density = 0.5 }: KelpProps) {
  const stalks = useMemo(() => {
    const count = Math.round(8 + density * 12)
    const arr: { x: number; z: number; height: number; phase: number; color: string }[] = []
    const colors = ['#2A6A3A', '#3A7A4A', '#1A5A2A', '#4A8A5A']
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 28,
        z: -5 - Math.random() * 14,
        height: 1.5 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [density])

  if (density < 0.05) return null

  return (
    <group>
      {stalks.map((s, i) => (
        <KelpStalk key={i} x={s.x} z={s.z} height={s.height} phase={s.phase} color={s.color} />
      ))}
    </group>
  )
}
