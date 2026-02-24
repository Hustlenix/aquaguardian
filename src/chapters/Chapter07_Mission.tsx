'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter07_Mission() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 6
  const groupRef = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.LineSegments>(null)

  const waypoints = useMemo(() => {
    const points: { pos: [number, number, number]; phase: number }[] = []
    const count = 7
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const angle = (t - 0.5) * Math.PI * 0.8
      points.push({
        pos: [Math.sin(angle) * 3.5, Math.cos(angle) * 0.8 - 0.2, -4],
        phase: (i / count) * Math.PI * 2,
      })
    }
    return points
  }, [])

  const lineObj = useMemo(() => {
    const positions = new Float32Array(waypoints.length * 3)
    waypoints.forEach((wp, i) => {
      positions[i * 3] = wp.pos[0]
      positions[i * 3 + 1] = wp.pos[1]
      positions[i * 3 + 2] = wp.pos[2]
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.LineBasicMaterial({
      color: '#D4AF37',
      transparent: true,
      opacity: 0.4,
    })
    return new THREE.Line(geo, mat)
  }, [waypoints])

  useFrame((state) => {
    if (!groupRef.current || !isActive) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
  })

  if (!isActive) return null

  return (
    <group ref={groupRef}>
      {/* Path line */}
      <primitive object={lineObj} />

      {/* Waypoint markers */}
      {waypoints.map((wp, i) => (
        <FloatingMarker key={i} position={wp.pos} phase={wp.phase} index={i} />
      ))}

      {/* Starting point glow */}
      <mesh position={waypoints[0].pos}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
      </mesh>

      {/* End point glow */}
      <mesh position={waypoints[waypoints.length - 1].pos}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function FloatingMarker({
  position,
  phase,
  index,
}: {
  position: [number, number, number]
  phase: number
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const float = Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.15
    ref.current.position.y = position[1] + float
    ref.current.rotation.y = state.clock.elapsedTime * 0.5 + index
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + phase) * 0.2

    const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.3
    ref.current.scale.setScalar(0.15 * pulse)
  })

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial
        color="#D4AF37"
        emissive="#D4AF37"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.7}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}
