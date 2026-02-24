'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter09_Impact() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 8
  const groupRef = useRef<THREE.Group>(null)

  const barCount = 10
  const barWidth = 0.3
  const gap = 0.1
  const totalWidth = barCount * (barWidth + gap) - gap
  const startX = -totalWidth / 2

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => ({
      x: startX + i * (barWidth + gap),
      phase: (i / barCount) * Math.PI * 2,
      color: i < barCount / 2 ? '#00B8A0' : '#D4AF37',
      baseHeight: 0.2 + Math.random() * 0.3,
    }))
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !isActive) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
  })

  if (!isActive) return null

  return (
    <group ref={groupRef} position={[0, -0.5, -5]}>
      {/* Floor line */}
      <mesh position={[0, -0.01, 0]}>
        <planeGeometry args={[totalWidth + 0.6, 0.02]} />
        <meshBasicMaterial color="#4A8A9A" transparent opacity={0.3} />
      </mesh>

      {/* Bars */}
      {bars.map((bar, i) => (
        <AnimatedBar
          key={i}
          x={bar.x}
          phase={bar.phase}
          color={bar.color}
          baseHeight={bar.baseHeight}
          width={barWidth}
        />
      ))}

      {/* Axis label points */}
      {bars.map((bar, i) => (
        <mesh key={`dot-${i}`} position={[bar.x, -0.08, 0]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color={bar.color} transparent opacity={0.4} />
        </mesh>
      ))}

      <pointLight color="#00B8A0" intensity={0.8} distance={5} decay={1.5} />
    </group>
  )
}

function AnimatedBar({
  x,
  phase,
  color,
  baseHeight,
  width,
}: {
  x: number
  phase: number
  color: string
  baseHeight: number
  width: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const heightFactor = 0.5 + Math.sin(t * 0.8 + phase) * 0.4
    const height = Math.max(0.05, baseHeight * (1 + heightFactor))
    ref.current.scale.y = height / baseHeight
    ref.current.position.y = (height / 2) - (baseHeight / 2)

    // Pulse emissive intensity
    const eIntensity = 0.15 + Math.sin(t * 1.2 + phase) * 0.15
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = eIntensity
  })

  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <boxGeometry args={[width, baseHeight, 0.1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        roughness={0.4}
        metalness={0.5}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}
