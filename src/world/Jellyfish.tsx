'use client'

import { useRef, type ElementRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshDistortMaterial } from '@react-three/drei'
import { useStore } from '@/store/useStore'

interface JellyProps {
  position: [number, number, number]
  phase: number
  color: string
}

const TENTACLE_COUNT = 7

/**
 * One translucent jellyfish: a distorting dome + a ring of thin strands that
 * wave with per-jelly phase offsets. No lights of its own — the existing rig
 * lights it, and the additive-ish translucency feeds the scene Bloom. Each
 * jellyfish is an independent instance; there is no shared state.
 */
function Jelly({ position, phase, color }: JellyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const skirtRef = useRef<THREE.Group>(null)
  const domeMat = useRef<ElementRef<typeof MeshDistortMaterial>>(null)
  const strandRefs = useRef<(THREE.Group | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = groupRef.current
    if (!g) return

    // Slow mid-water drift + gentle bob.
    g.position.set(
      position[0] + Math.sin(t * 0.15 + phase) * 0.8,
      position[1] + Math.sin(t * 0.4 + phase * 2) * 0.3,
      position[2] + Math.cos(t * 0.12 + phase) * 0.6
    )

    // Dome distortion breathes slowly.
    if (domeMat.current) {
      domeMat.current.distort = 0.24 + Math.sin(t * 0.9 + phase) * 0.12
    }

    // The tentacle skirt sways and slowly yaws as a unit...
    if (skirtRef.current) {
      skirtRef.current.rotation.y = Math.sin(t * 0.5 + phase) * 0.5
    }
    // ...while each strand waves individually with a phase offset.
    strandRefs.current.forEach((strand, i) => {
      if (!strand) return
      strand.rotation.z = Math.sin(t * 1.3 + phase + i * 0.9) * 0.16
    })
  })

  const strands = Array.from({ length: TENTACLE_COUNT }, (_, i) => {
    const a = (i / TENTACLE_COUNT) * Math.PI * 2
    return { a, x: Math.sin(a) * 0.3, z: Math.cos(a) * 0.3 }
  })

  return (
    <group ref={groupRef} position={position} scale={0.85 + phase * 0.05}>
      {/* Dome — distorted icosahedron, translucent so the grade + bloom read it */}
      <mesh>
        <icosahedronGeometry args={[0.38, 2]} />
        <MeshDistortMaterial
          ref={domeMat}
          color={color}
          emissive="#6FE0FF"
          emissiveIntensity={0.35}
          transparent
          opacity={0.42}
          roughness={0.25}
          metalness={0.05}
          distort={0.24}
          speed={0.9}
        />
      </mesh>
      {/* Inner glow core the bloom picks up */}
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshBasicMaterial
          color="#CFF6FF"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Tentacle skirt — thin strands hanging from the dome rim */}
      <group ref={skirtRef} position={[0, -0.32, 0]}>
        {strands.map((s, i) => (
          <group
            key={i}
            ref={(el) => {
              strandRefs.current[i] = el
            }}
            position={[s.x, 0, s.z]}
            rotation={[0, -s.a, 0]}
          >
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.018, 0.005, 0.64, 5]} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.32}
                roughness={0.5}
                metalness={0.05}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

/**
 * A small school of jellyfish in the mid-water column near the hero area.
 * Counts respect the quality tier: 3 on high, 2 on low/mobile.
 */
export default function Jellyfish() {
  const quality = useStore((s) => s.quality)

  const jellies: JellyProps[] =
    quality > 0.75
      ? [
          { position: [-4.5, 2.2, -9.5], phase: 0.3, color: '#BFEFFF' },
          { position: [3.5, 2.8, -11.5], phase: 2.1, color: '#FFFFFF' },
          { position: [-1, 1.4, -13.5], phase: 4.4, color: '#9FE8FF' },
        ]
      : [
          { position: [-4.5, 2.2, -9.5], phase: 0.3, color: '#BFEFFF' },
          { position: [3.5, 2.8, -11.5], phase: 2.1, color: '#FFFFFF' },
        ]

  return (
    <group>
      {jellies.map((j, i) => (
        <Jelly key={i} position={j.position} phase={j.phase} color={j.color} />
      ))}
    </group>
  )
}
