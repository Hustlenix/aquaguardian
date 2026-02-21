'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

function Tube({ points, radius, color }: {
  points: [number, number, number][]
  radius: number
  color: string
}) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    )
  }, [points])

  return (
    <mesh>
      <tubeGeometry args={[curve, 12, radius, 6, false]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.1}
        flatShading
      />
    </mesh>
  )
}

function Kelp({ x, z, height, color }: {
  x: number
  z: number
  height: number
  color: string
}) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 8
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const sway = Math.sin(t * Math.PI * 2) * 0.4 * t
      pts.push([sway, -3.5 + t * height, 0])
    }
    return pts
  }, [height])

  return (
    <group position={[x, 0, z]}>
      <Tube points={points} radius={0.04 + height * 0.01} color={color} />
    </group>
  )
}

function CoralHead({ x, y, z, scale, color }: {
  x: number
  y: number
  z: number
  scale: number
  color: string
}) {
  const branches = useMemo(() => {
    const b = []
    const count = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const len = 0.3 + Math.random() * 0.5
      b.push({
        rx: Math.sin(angle) * len,
        ry: Math.random() * 0.3 + 0.4,
        rz: Math.cos(angle) * len,
        radius: 0.04 + Math.random() * 0.04,
      })
    }
    return b
  }, [])

  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
      {branches.map((b, i) => (
        <Tube
          key={i}
          points={[[0, -0.2, 0], [b.rx * 0.5, b.ry * 0.5, b.rz * 0.5], [b.rx, b.ry, b.rz]]}
          radius={b.radius}
          color={color}
        />
      ))}
    </group>
  )
}

export default function Coral() {
  const clusters = useMemo(() => [
    { x: -6, z: -4, scale: 1.5 },
    { x: -3, z: -6, scale: 1 },
    { x: 4, z: -3, scale: 1.8 },
    { x: 7, z: -7, scale: 1.2 },
    { x: 0, z: -8, scale: 1.4 },
  ], [])

  return (
    <group>
      {clusters.map((c, i) => {
        const baseColor = i % 2 === 0 ? '#6B8E8A' : '#8A6B5A'
        const headColor = i % 3 === 0 ? '#D4856A' : i % 3 === 1 ? '#6A9AB5' : '#C4A55A'
        const kelpColor = i % 2 === 0 ? '#4A7A5A' : '#5A7A4A'
        return (
          <group key={i} position={[c.x, 0, c.z]} scale={c.scale}>
            <CoralHead x={0} y={-2.5} z={0} scale={1} color={headColor} />
            <CoralHead x={0.4} y={-2.8} z={0.3} scale={0.7} color={headColor} />
            {Array.from({ length: 3 }, (_, j) => (
              <Kelp
                key={j}
                x={-0.3 + j * 0.3}
                z={0.2 + j * 0.15}
                height={1 + Math.random() * 0.5}
                color={kelpColor}
              />
            ))}
          </group>
        )
      })}
    </group>
  )
}
