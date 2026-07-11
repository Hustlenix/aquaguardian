'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter05_RobotReveal() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 4
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const startTime = useRef<number | null>(null)

  useFrame((state) => {
    if (!meshRef.current || !isActive) return

    if (startTime.current === null) startTime.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startTime.current

    const grow = Math.min(elapsed / 1.5, 1)
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.06
    meshRef.current.scale.setScalar(grow * pulse)

    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3

    if (glowRef.current) {
      glowRef.current.scale.setScalar(grow * (1.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1))
      glowRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      ringRef.current.scale.setScalar(grow)
    }
  })

  if (!isActive) return null

  return (
    <group position={[0, 1, -6]}>
      {/* Outer glow ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.9, 1.2, 48]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glow aura */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.12}
          wireframe
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core robot */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00D4FF"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color="#00E5FF" intensity={2} distance={8} decay={1.5} />
    </group>
  )
}
