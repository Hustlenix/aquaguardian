'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoralProps {
  intact: number
}

function Tube({ points, radius, color, intact }: {
  points: [number, number, number][]
  radius: number
  color: string
  intact: number
}) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    )
  }, [points])

  return (
    <mesh scale={intact}>
      <tubeGeometry args={[curve, 10, radius, 5, false]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} flatShading />
    </mesh>
  )
}

function CoralCluster({ x, z, scale, color, intact }: {
  x: number
  z: number
  scale: number
  color: string
  intact: number
}) {
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1 + offset) * 0.02 * intact
    }
  })

  return (
    <group ref={groupRef} position={[x, 0, z]} scale={scale * intact}>
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + offset
        return (
          <Tube
            key={i}
            points={[[0, -2.5, 0], [Math.sin(angle) * 0.3, -2.2, Math.cos(angle) * 0.3], [Math.sin(angle) * 0.5, -2.0, Math.cos(angle) * 0.5]]}
            radius={0.04}
            color={color}
            intact={intact}
          />
        )
      })}
    </group>
  )
}

export default function Coral({ intact = 1 }: CoralProps) {
  const clusters = useMemo(() => [
    { x: -8, z: -6, scale: 1.5, color: '#D4856A' },
    { x: -4, z: -9, scale: 1.0, color: '#6A9AB5' },
    { x: 5, z: -5, scale: 1.8, color: '#C4A55A' },
    { x: 9, z: -10, scale: 1.2, color: '#6A9AB5' },
    { x: 0, z: -12, scale: 1.4, color: '#D4856A' },
    { x: -6, z: -14, scale: 0.8, color: '#C4A55A' },
    { x: 7, z: -15, scale: 1.1, color: '#6A9AB5' },
  ], [])

  return (
    <group>
      {clusters.map((c, i) => (
        <CoralCluster key={i} x={c.x} z={c.z} scale={c.scale} color={c.color} intact={intact} />
      ))}
    </group>
  )
}
