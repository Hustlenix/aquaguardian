'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter04_Discovery() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 3
  const ref = useRef<THREE.Group>(null)

  const ruins = useMemo(() => {
    const items: {
      pos: [number, number, number]
      rot: [number, number, number]
      scale: number
      phase: number
      speed: number
      type: 'octa' | 'column'
      color: string
    }[] = []

    const colors = ['#00B8A0', '#008A7A', '#00D4B8']
    const types: ('octa' | 'column')[] = ['octa', 'column']

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 1.8 + Math.random() * 1.2
      items.push({
        pos: [
          Math.cos(angle) * radius,
          -1 + (Math.random() - 0.5) * 1.5,
          -5 + Math.sin(angle) * radius * 0.6,
        ],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
        type: types[i % types.length],
        color: colors[i % colors.length],
      })
    }
    return items
  }, [])

  useFrame((state) => {
    if (!ref.current || !isActive) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  if (!isActive) return null

  return (
    <group ref={ref}>
      {ruins.map((r, i) => (
        <PulsingMesh key={i} data={r} />
      ))}
      <ambientLight intensity={0.3} color="#00B8A0" />
      <pointLight position={[0, 1, -4]} color="#00D4B8" intensity={0.8} distance={6} />
    </group>
  )
}

function PulsingMesh({ data }: {
  data: {
    pos: [number, number, number]
    rot: [number, number, number]
    scale: number
    phase: number
    speed: number
    type: 'octa' | 'column'
    color: string
  }
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const pulse = 1 + Math.sin(state.clock.elapsedTime * data.speed + data.phase) * 0.15
    meshRef.current.scale.setScalar(data.scale * pulse)
    meshRef.current.rotation.x += 0.005
    meshRef.current.rotation.z += 0.003
  })

  if (data.type === 'octa') {
    return (
      <mesh ref={meshRef} position={data.pos} rotation={data.rot} scale={data.scale}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} position={data.pos} rotation={data.rot} scale={data.scale}>
      <cylinderGeometry args={[0.06, 0.12, 0.6, 6]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.2}
        roughness={0.5}
        metalness={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
