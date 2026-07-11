'use client'

import { useMemo } from 'react'

function Pillar({ position, height, radius, color }: {
  position: [number, number, number]
  height: number
  radius: number
  color: string
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius * 0.6, radius, height, 8, 3]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.2}
        flatShading
      />
    </mesh>
  )
}

function Branch({ position, rotation: [rx, ry, rz], length, color }: {
  position: [number, number, number]
  rotation: [number, number, number]
  length: number
  color: string
}) {
  return (
    <mesh position={position} rotation={[rx, ry, rz]}>
      <cylinderGeometry args={[0.05, 0.1, length, 5, 2]} />
      <meshStandardMaterial color={color} roughness={0.9} flatShading />
    </mesh>
  )
}

export default function Coral() {
  const configs = useMemo(() => [
    { x: -12, scale: 1 },
    { x: -5, scale: 0.7 },
    { x: 8, scale: 1.2 },
    { x: 15, scale: 0.8 },
  ], [])

  return (
    <group position={[0, 0, -15]}>
      {configs.map((c, i) => (
        <group key={i} position={[c.x, 0, 0]} scale={c.scale}>
          <Pillar
            position={[0, -5 + 2.5, 0]}
            height={5 + Math.random() * 3}
            radius={0.8 + Math.random() * 0.5}
            color={i % 2 === 0 ? '#5A7A8A' : '#7A6A5A'}
          />
          <Branch
            position={[0.3, -1, 0.2]}
            rotation={[0.3, 0.5, 0.2]}
            length={1.5}
            color="#8A9A7A"
          />
          <Branch
            position={[-0.2, 0, -0.1]}
            rotation={[-0.2, -0.3, 0.4]}
            length={1.2}
            color="#8A7A5A"
          />
        </group>
      ))}
    </group>
  )
}
