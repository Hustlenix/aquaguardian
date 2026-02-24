'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter10_FutureAtlantis() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 9
  const groupRef = useRef<THREE.Group>(null)

  const gridSize = 5
  const spacing = 1.5
  const offset = (gridSize - 1) * spacing / 2

  const towers = useMemo(() => {
    const items: {
      x: number
      z: number
      height: number
      radius: number
      phase: number
    }[] = []

    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        const dist = Math.sqrt(
          (ix - Math.floor(gridSize / 2)) ** 2 +
          (iz - Math.floor(gridSize / 2)) ** 2
        )
        items.push({
          x: ix * spacing - offset,
          z: iz * spacing - offset,
          height: 0.8 + Math.random() * 1.2 + (1 - dist / 3) * 0.4,
          radius: 0.06 + Math.random() * 0.04,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }
    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !isActive) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.15
    groupRef.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05
  })

  if (!isActive) return null

  return (
    <group ref={groupRef} position={[0, -2, -8]} scale={0.5}>
      {/* Ground plane glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[gridSize * spacing + 1, gridSize * spacing + 1]} />
        <meshBasicMaterial
          color="#4AE0D0"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Towers */}
      {towers.map((tower, i) => (
        <Tower key={i} data={tower} />
      ))}

      {/* Ambient blue light */}
      <pointLight color="#4AE0D0" intensity={1} distance={10} decay={1.5} />
      <pointLight color="#D4AF37" intensity={0.5} distance={8} decay={1.5} />
    </group>
  )
}

function Tower({
  data,
}: {
  data: { x: number; z: number; height: number; radius: number; phase: number }
}) {
  const tipRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (tipRef.current) {
      const glow = 0.5 + Math.sin(t * 1.5 + data.phase) * 0.4
      const mat = tipRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = glow

      tipRef.current.position.y = data.height + 0.04 + Math.sin(t * 0.8 + data.phase) * 0.02
    }

    if (bodyRef.current) {
      bodyRef.current.rotation.y += 0.002
    }
  })

  const isGold = Math.abs(data.x) < 0.3 && Math.abs(data.z) < 0.3

  return (
    <group position={[data.x, 0, data.z]}>
      {/* Tower body */}
      <mesh ref={bodyRef} position={[0, data.height / 2, 0]}>
        <cylinderGeometry args={[data.radius, data.radius * 1.3, data.height, 8]} />
        <meshStandardMaterial
          color={isGold ? '#D4AF37' : '#4AE0D0'}
          emissive={isGold ? '#D4AF37' : '#4AE0D0'}
          emissiveIntensity={isGold ? 0.3 : 0.15}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glowing tip */}
      <mesh ref={tipRef} position={[0, data.height, 0]}>
        <sphereGeometry args={[data.radius * 1.8, 8, 8]} />
        <meshBasicMaterial
          color={isGold ? '#D4AF37' : '#4AE0D0'}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Small glow aura */}
      <mesh position={[0, data.height, 0]}>
        <sphereGeometry args={[data.radius * 3, 8, 8]} />
        <meshBasicMaterial
          color={isGold ? '#FFD700' : '#7AFFF0'}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
