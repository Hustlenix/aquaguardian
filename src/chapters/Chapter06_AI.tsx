'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter06_AI() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 5
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!isActive) return

    const t = state.clock.elapsedTime

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.2
      ring1Ref.current.rotation.z = t * 0.25
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 1.8 + Math.sin(t * 0.4 + 1) * 0.25
      ring2Ref.current.rotation.z = -t * 0.4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.35 + 2) * 0.3
      ring3Ref.current.rotation.z = t * 0.55
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08)
    }
    if (groupRef.current) {
      groupRef.current.position.y = 0.5 + Math.sin(t * 0.4) * 0.15
    }
  })

  if (!isActive) return null

  return (
    <group ref={groupRef} position={[0, 0.5, -5]}>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 1 - outer large */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.6, 0.75, 64]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring 2 - mid */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.9, 1.05, 64]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring 3 - inner tight */}
      <mesh ref={ring3Ref}>
        <ringGeometry args={[0.35, 0.45, 48]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Data dots around rings */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        return (
          <DataDot
            key={i}
            angle={angle}
            radius={0.9}
            index={i}
          />
        )
      })}

      <pointLight color="#00E5FF" intensity={1.5} distance={6} decay={1.5} />
    </group>
  )
}

function DataDot({ angle, radius, index }: { angle: number; radius: number; index: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 1.2 + index * 0.5) * 0.3
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulse
  })

  return (
    <mesh
      ref={ref}
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
    >
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial
        color="#75FFE8"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
