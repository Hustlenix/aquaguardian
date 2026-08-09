'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Pickup burst — a small cloud of rising particles that pops whenever the
 * robot collects a debris item. Cheaper than a full particle pool: bursts are
 * rare (a few per minute), so each burst renders as its own <points> with a
 * fading additive material and per-particle buoyant drift.
 *
 * The frame loop (Robot.tsx) calls `triggerBurst` — module state, no React
 * re-render storm. This component bridges into React state only on a collect.
 */

interface Burst {
  id: number
  pos: THREE.Vector3
  vels: THREE.Vector3[]
  born: number
}

const LIFETIME = 1.4
const PARTICLES = 16
const SPREAD = 1.1

let burstSetter: ((fn: (prev: Burst[]) => Burst[]) => void) | null = null
let burstId = 0

export function triggerBurst(x: number, y: number, z: number): void {
  burstSetter?.((prev) => {
    const vels: THREE.Vector3[] = []
    for (let i = 0; i < PARTICLES; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = Math.random() * SPREAD
      vels.push(
        new THREE.Vector3(
          Math.cos(theta) * r,
          0.25 + Math.random() * 0.55,
          Math.sin(theta) * r
        )
      )
    }
    const next: Burst[] = [...prev, { id: ++burstId, pos: new THREE.Vector3(x, y, z), vels, born: performance.now() }]
    // Keep at most 3 bursts alive to bound draw calls.
    return next.slice(-3)
  })
}

export default function PickupBursts() {
  const [bursts, setBursts] = useState<Burst[]>([])

  useEffect(() => {
    burstSetter = setBursts
    return () => {
      burstSetter = null
    }
  }, [])

  // Prune expired bursts (sparingly — only when one actually dies).
  useFrame(() => {
    if (bursts.length === 0) return
    const now = performance.now()
    if (bursts.some((b) => now - b.born > LIFETIME * 1000)) {
      setBursts((prev) => prev.filter((b) => now - b.born <= LIFETIME * 1000))
    }
  })

  return (
    <>
      {bursts.map((b) => (
        <BurstPoints key={b.id} burst={b} />
      ))}
    </>
  )
}

function BurstPoints({ burst }: { burst: Burst }) {
  const ref = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const positionsRef = useRef<Float32Array>(new Float32Array(PARTICLES * 3))

  useEffect(() => {
    for (let i = 0; i < PARTICLES; i++) {
      positionsRef.current[i * 3] = burst.pos.x
      positionsRef.current[i * 3 + 1] = burst.pos.y
      positionsRef.current[i * 3 + 2] = burst.pos.z
    }
  }, [burst])

  useFrame(() => {
    const age = (performance.now() - burst.born) / 1000
    if (age >= LIFETIME) return
    const p = positionsRef.current
    for (let i = 0; i < PARTICLES; i++) {
      const v = burst.vels[i]
      const x = burst.pos.x + v.x * age
      // Buoyant rise with a touch of drag.
      const y = burst.pos.y + (v.y * age - age * age * 0.25)
      const z = burst.pos.z + v.z * age
      p[i * 3] = x
      p[i * 3 + 1] = y
      p[i * 3 + 2] = z
    }
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true
      ref.current.geometry.computeBoundingSphere()
    }
    if (matRef.current) {
      matRef.current.opacity = Math.max(0, 1 - age / LIFETIME) * 0.55
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positionsRef.current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#00E5FF"
        size={0.07}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
