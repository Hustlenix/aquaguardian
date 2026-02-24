'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter08_Technology() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 7
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)

  const structures = useMemo(() => {
    const items: {
      pos: [number, number, number]
      rot: [number, number, number]
      type: 'box' | 'cylinder'
      args: [number, number, number]
      color: string
      phase: number
    }[] = []

    const colors = ['#4A8A9A', '#5DAABC', '#3A7A8A', '#6BC4D4']
    const layout = [
      { dx: 0, dz: 0, type: 'cylinder' as const, w: 0.5, h: 0.8, d: 0.5 },
      { dx: -0.7, dz: 0.5, type: 'box' as const, w: 0.3, h: 0.5, d: 0.3 },
      { dx: 0.7, dz: 0.4, type: 'box' as const, w: 0.4, h: 0.6, d: 0.4 },
      { dx: -0.4, dz: -0.6, type: 'cylinder' as const, w: 0.25, h: 0.4, d: 0.25 },
      { dx: 0.5, dz: -0.5, type: 'cylinder' as const, w: 0.2, h: 0.35, d: 0.2 },
      { dx: 0, dz: 0.8, type: 'box' as const, w: 0.6, h: 0.15, d: 0.6 },
    ]

    layout.forEach((l, i) => {
      items.push({
        pos: [-2 + l.dx, -0.5 + l.h / 2, -5 + l.dz],
        rot: [0, 0, 0],
        type: l.type,
        args: l.type === 'box' ? [l.w, l.h, l.d] : [l.w, l.h, l.d],
        color: colors[i % colors.length],
        phase: (i / layout.length) * Math.PI * 2,
      })
    })
    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !isActive) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.3
    if (innerRef.current) {
      innerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  if (!isActive) return null

  return (
    <group ref={groupRef} position={[-2, -0.5, -5]}>
      <group ref={innerRef}>
        {structures.map((s, i) => (
          <TechPiece key={i} data={s} />
        ))}
      </group>

      {/* Base platform */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 24]} />
        <meshStandardMaterial
          color="#4A8A9A"
          transparent
          opacity={0.15}
          roughness={0.6}
          metalness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy core */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial
          color="#6BC4D4"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color="#4A8A9A" intensity={1} distance={5} decay={1.5} />
    </group>
  )
}

function TechPiece({
  data,
}: {
  data: {
    pos: [number, number, number]
    rot: [number, number, number]
    type: 'box' | 'cylinder'
    args: [number, number, number]
    color: string
    phase: number
  }
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.008
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 + data.phase) * 0.05

    const hover = Math.sin(state.clock.elapsedTime * 0.5 + data.phase) * 0.04
    ref.current.position.y = data.pos[1] + hover
  })

  const Geometry = data.type === 'box' ? (
    <boxGeometry args={data.args} />
  ) : (
    <cylinderGeometry args={[data.args[0], data.args[0] * 1.1, data.args[1], 12]} />
  )

  return (
    <mesh ref={ref} position={data.pos} rotation={data.rot}>
      {Geometry}
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.15}
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}
