'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

interface RuinsProps {
  intact?: number
}

/**
 * Ancient temple ruins — a composed silhouette at the back of the scene:
 * a stepped platform, standing columns with broken shards, a fallen column
 * reaching toward the viewer, a half-buried archway, a toppled obelisk with
 * gold hieroglyphs, and scattered blocks. Everything degrades with `intact`:
 * columns shorten, the arch disappears, the obelisk topples further.
 */

function Pillar({
  x,
  z,
  height,
  intact,
  radius = 0.2,
}: {
  x: number
  z: number
  height: number
  intact: number
  radius?: number
}) {
  const brokenHeight = height * (0.3 + intact * 0.7)
  return (
    <group position={[x, 0.32 + brokenHeight / 2, z]}>
      <mesh>
        <cylinderGeometry args={[radius * 0.75, radius, brokenHeight, 8]} />
        <meshStandardMaterial color="#4A5A5A" roughness={0.9} metalness={0.12} flatShading />
      </mesh>
      {intact > 0.35 && (
        <group position={[0, brokenHeight / 2 + 0.02, 0]}>
          {/* Jagged broken top */}
          <mesh position={[0.05, 0.04, 0]} rotation={[0.4, 0, 0.2]}>
            <boxGeometry args={[0.22, 0.08, 0.22]} />
            <meshStandardMaterial color="#5A6A6A" roughness={0.85} metalness={0.2} flatShading />
          </mesh>
          <mesh position={[-0.06, 0.02, 0.03]} rotation={[0.2, 0.5, -0.35]}>
            <boxGeometry args={[0.14, 0.06, 0.14]} />
            <meshStandardMaterial color="#5A6A6A" roughness={0.85} metalness={0.2} flatShading />
          </mesh>
        </group>
      )}
      {intact > 0.6 && (
        <mesh position={[0, brokenHeight / 2 + 0.09, 0]}>
          <boxGeometry args={[0.55, 0.06, 0.55]} />
          <meshStandardMaterial color="#5A6A6A" roughness={0.85} metalness={0.2} flatShading />
        </mesh>
      )}
    </group>
  )
}

function Arch({ x, z, intact }: { x: number; z: number; intact: number }) {
  const sunk = 0.35 - intact * 0.15
  return (
    <group position={[x, 0.32, z]} rotation={[0, 0, 0.1]}>
      <mesh position={[0, 0.95 - sunk, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.07, 6, 10, Math.PI]} />
        <meshStandardMaterial color="#4A5A5A" roughness={0.9} metalness={0.12} flatShading />
      </mesh>
      <mesh position={[-0.48, 0.55 - sunk, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.1, 6]} />
        <meshStandardMaterial color="#4A5A5A" roughness={0.9} metalness={0.12} flatShading />
      </mesh>
      <mesh position={[0.48, 0.55 - sunk, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.1, 6]} />
        <meshStandardMaterial color="#4A5A5A" roughness={0.9} metalness={0.12} flatShading />
      </mesh>
    </group>
  )
}

export default function Ruins({ intact = 0.5 }: RuinsProps) {
  // Shared materials — one stone program for the whole set.
  const mats = useMemo(
    () => ({
      stone: new THREE.MeshStandardMaterial({
        color: '#4A5A5A',
        roughness: 0.9,
        metalness: 0.12,
        flatShading: true,
      }),
      cap: new THREE.MeshStandardMaterial({
        color: '#5A6A6A',
        roughness: 0.85,
        metalness: 0.2,
        flatShading: true,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#8A7A4A',
        roughness: 0.5,
        metalness: 0.4,
        emissive: '#D4AF37',
        emissiveIntensity: 0.9,
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: '#1A3A44',
        roughness: 0.6,
        metalness: 0.1,
        emissive: '#00E5FF',
        emissiveIntensity: 0.5,
      }),
    }),
    []
  )

  // Clean up WebGL resources to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      mats.stone.dispose()
      mats.cap.dispose()
      mats.gold.dispose()
      mats.cyan.dispose()
    }
  }, [mats])

  // Blocks scattered on the platform — layout randomized once per mount.
  const blocks = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        x: (Math.random() - 0.5) * 12,
        z: -15 - Math.random() * 5,
        s: 0.35 + Math.random() * 0.75,
        rot: Math.random() * Math.PI,
        tall: Math.random() > 0.6,
      })),
    []
  )

  if (intact < 0.05) return null

  // The hero obelisk topples further as the temple degrades.
  const topple = 0.22 + (1 - intact) * 0.4

  return (
    <group position={[0, -4, 0]}>
      {/* Stepped platform */}
      <mesh position={[0, 0.12, -17]} material={mats.stone}>
        <boxGeometry args={[18, 0.35, 11]} />
      </mesh>
      <mesh position={[0, 0.34, -17]} material={mats.stone}>
        <boxGeometry args={[11, 0.22, 6.5]} />
      </mesh>

      {/* Standing columns — back row taller for depth */}
      <Pillar x={-3.4} z={-18.6} height={7} intact={intact} />
      <Pillar x={3.4} z={-18.6} height={6} intact={intact} />
      <Pillar x={-3.4} z={-16} height={5.5} intact={intact} />
      <Pillar x={3.4} z={-16} height={4.5} intact={intact} radius={0.16} />

      {/* Fallen column — lies from the platform edge toward the viewer */}
      <group position={[-0.4, 0.55, -14.4]} rotation={[1.35, 0.15, 0]}>
        <mesh material={mats.stone}>
          <cylinderGeometry args={[0.16, 0.2, 4.6, 7]} />
        </mesh>
        <mesh position={[0, 0, 2.4]} rotation={[0.3, 0, 0.4]} material={mats.cap}>
          <boxGeometry args={[0.2, 0.24, 0.2]} />
        </mesh>
        {/* Cyan algae glow along the break */}
        <mesh position={[0.08, 0.05, 1.9]} material={mats.cyan}>
          <sphereGeometry args={[0.035, 6, 6]} />
        </mesh>
        <mesh position={[-0.07, 0.04, 1.6]} material={mats.cyan}>
          <sphereGeometry args={[0.025, 6, 6]} />
        </mesh>
      </group>

      {/* Half-buried archway, right of center */}
      {intact > 0.3 && <Arch x={2.2} z={-18.2} intact={intact} />}

      {/* Hero obelisk — toppled, gold hieroglyph band catching the light */}
      <group position={[0.6, 0.5, -21.4]} rotation={[topple, 0, 0.35]}>
        <mesh material={mats.stone}>
          <cylinderGeometry args={[0.14, 0.34, 5.5, 4]} />
        </mesh>
        <mesh position={[0, 0.4, 0.14]} rotation={[0, 0, 0]} material={mats.gold}>
          <boxGeometry args={[0.02, 1.7, 0.3]} />
        </mesh>
        <mesh position={[0.1, -0.2, 0.13]} rotation={[0, 0, 0.2]} material={mats.gold}>
          <boxGeometry args={[0.015, 0.6, 0.24]} />
        </mesh>
        {/* Base block half-sunk */}
        <mesh position={[0, -0.45, 0]} material={mats.cap}>
          <boxGeometry args={[1.1, 0.3, 0.9]} />
        </mesh>
      </group>

      {/* Scattered fallen blocks */}
      {blocks.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, 0.38 + (b.tall ? 0.2 : 0), b.z]}
          rotation={[0, b.rot, b.tall ? 0.5 : 0.12]}
          material={b.tall ? mats.cap : mats.stone}
        >
          <boxGeometry args={[b.s, b.s * (b.tall ? 0.9 : 0.45), b.s * 0.8]} />
        </mesh>
      ))}
    </group>
  )
}
