'use client'

import { useMemo } from 'react'

interface RuinsProps {
  intact?: number
}

function Pillar({ x, z, height, intact }: { x: number; z: number; height: number; intact: number }) {
  const brokenHeight = height * (0.3 + intact * 0.7)
  return (
    <group position={[x, -4 + brokenHeight / 2, z]}>
      <mesh>
        <cylinderGeometry args={[0.15, 0.2, brokenHeight, 6]} />
        <meshStandardMaterial color="#5A6A6A" roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      {intact > 0.6 && (
        <mesh position={[0, brokenHeight / 2 + 0.05, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#6A7A7A" roughness={0.8} metalness={0.2} />
        </mesh>
      )}
    </group>
  )
}

function Arch({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, -3.5, z]}>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.4, 0.06, 6, 8, Math.PI]} />
        <meshStandardMaterial color="#5A6A6A" roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      <mesh position={[-0.4, -0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 5]} />
        <meshStandardMaterial color="#5A6A6A" roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      <mesh position={[0.4, -0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 5]} />
        <meshStandardMaterial color="#5A6A6A" roughness={0.9} metalness={0.1} flatShading />
      </mesh>
    </group>
  )
}

export default function Ruins({ intact = 0.5 }: RuinsProps) {
  const pillars = useMemo(() => [
    { x: -12, z: -18, height: 3.0 },
    { x: -10, z: -18, height: 2.5 },
    { x: -14, z: -16, height: 2.0 },
    { x: 10, z: -20, height: 2.8 },
    { x: 12, z: -18, height: 2.2 },
    { x: 14, z: -20, height: 1.8 },
    { x: -5, z: -22, height: 2.0 },
    { x: 5, z: -24, height: 1.5 },
  ], [])

  const arches = useMemo(() => [
    { x: -11, z: -17 },
    { x: 11, z: -19 },
  ], [])

  if (intact < 0.05) return null

  return (
    <group>
      {pillars.map((p, i) => (
        <Pillar key={`p${i}`} x={p.x} z={p.z} height={p.height} intact={intact} />
      ))}
      {intact > 0.3 && arches.map((a, i) => (
        <Arch key={`a${i}`} x={a.x} z={a.z} />
      ))}
    </group>
  )
}
