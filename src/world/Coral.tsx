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
    <mesh scale={Math.max(0.1, intact)}>
      <tubeGeometry args={[curve, 8, radius, 5, false]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} flatShading />
    </mesh>
  )
}

function CoralCluster({ x, z, scale, color, intact, phase }: {
  x: number
  z: number
  scale: number
  color: string
  intact: number
  phase: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const swaySpeed = 0.08 + Math.random() * 0.06

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * swaySpeed + phase) * 0.03 * intact
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * swaySpeed * 0.7 + phase * 1.2) * 0.015 * intact
    }
  })

  const fadedColor = useMemo(() => {
    const c = new THREE.Color(color)
    c.lerp(new THREE.Color('#4A5A5A'), 1 - intact)
    return c.getStyle()
  }, [color, intact])

  return (
    <group ref={groupRef} position={[x, 0, z]} scale={scale * Math.max(0.1, intact)}>
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color={fadedColor} roughness={0.7} flatShading />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + phase
        return (
          <Tube
            key={i}
            points={[[0, -2.5, 0], [Math.sin(angle) * 0.3, -2.2, Math.cos(angle) * 0.3], [Math.sin(angle) * 0.5, -2.0, Math.cos(angle) * 0.5]]}
            radius={0.04}
            color={fadedColor}
            intact={intact}
          />
        )
      })}
    </group>
  )
}

export default function Coral({ intact = 1 }: CoralProps) {
  const phases = useMemo(() =>
    Array.from({ length: 14 }, () => Math.random() * Math.PI * 2),
  [])

  const clusters = useMemo(() => [
    { x: -8, z: -6, scale: 1.5, color: '#D4856A' },
    { x: -4, z: -9, scale: 1.0, color: '#6A9AB5' },
    { x: 5, z: -5, scale: 1.8, color: '#C4A55A' },
    { x: 9, z: -10, scale: 1.2, color: '#6A9AB5' },
    { x: 0, z: -12, scale: 1.4, color: '#D4856A' },
    { x: -6, z: -14, scale: 0.8, color: '#C4A55A' },
    { x: 7, z: -15, scale: 1.1, color: '#6A9AB5' },
    { x: -10, z: -3, scale: 0.6, color: '#B57A5A' },
    { x: 3, z: -8, scale: 0.9, color: '#7A9A7A' },
    { x: -2, z: -16, scale: 1.0, color: '#C4956A' },
    { x: 10, z: -6, scale: 0.7, color: '#5A8A9A' },
    { x: -7, z: -11, scale: 0.8, color: '#A47A5A' },
    { x: 4, z: -13, scale: 0.6, color: '#6A9A8A' },
    { x: -9, z: -8, scale: 0.5, color: '#B58A6A' },
  ], [])

  return (
    <group>
      {clusters.map((c, i) => (
        <CoralCluster key={i} x={c.x} z={c.z} scale={c.scale} color={c.color} intact={intact} phase={phases[i]} />
      ))}
    </group>
  )
}
