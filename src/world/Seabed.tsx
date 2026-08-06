'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SeabedProps {
  debrisCount?: number
}

/**
 * Shared debris registry — the bridge between Seabed and Robot.
 * Seabed owns the debris meshes; Robot (Robot.tsx) reads these to plan its
 * collection mini-cycle: `debrisPositions` holds world-space targets,
 * `debrisRegistry` holds per-item mesh handles so the robot can hide an item
 * (visible = false) and schedule its respawn via `hiddenUntil`.
 */
export interface DebrisHandle {
  mesh: THREE.Mesh | null
  hiddenUntil: number
}

export const debrisPositions: { x: number; y: number; z: number; size: number }[] = []
export const debrisRegistry: DebrisHandle[] = []

/**
 * Baseline ambient debris: the scene-state machine is currently dormant
 * (setSceneState is never called at runtime), so `debrisCount` stays 0 and
 * the seabed would otherwise be empty forever. A small fixed patrol set
 * gives the robot something to collect in the live hero scene; whenever a
 * scene state with real debris is applied, it replaces this baseline.
 */
const BASELINE_DEBRIS = 3

/** One instanced draw call for all the scattered rocks. */
function Rocks({ count = 10 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const rocks = useMemo(() => {
    const base = new THREE.Color('#3A4A4A')
    const warm = new THREE.Color('#4A5A4A')
    const arr: { x: number; y: number; z: number; s: number; rotY: number; c: THREE.Color }[] = []
    for (let i = 0; i < count; i++) {
      const s = 0.5 + Math.random() * 1.2
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: -4 + s * 0.2,
        z: -5 - Math.random() * 16,
        s,
        rotY: Math.random() * Math.PI,
        c: base.clone().lerp(warm, Math.random() * 0.5),
      })
    }
    return arr
  }, [count])

  useLayoutEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < rocks.length; i++) {
      const r = rocks[i]
      dummy.position.set(r.x, r.y, r.z)
      dummy.rotation.set((Math.random() - 0.5) * 0.5, r.rotY, (Math.random() - 0.5) * 0.3)
      dummy.scale.setScalar(r.s)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
      ref.current.setColorAt(i, r.c)
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [rocks, dummy])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.9} metalness={0.1} flatShading />
    </instancedMesh>
  )
}

function Debris({ count }: { count: number }) {
  const items = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      rot: [number, number, number]
      scale: number
      color: string
      shape: 'box' | 'bottle' | 'bag'
    }[] = []
    const shapes: ('box' | 'bottle' | 'bag')[] = ['box', 'bottle', 'bag']
    const cleanColors = ['#5A4A3A', '#6A5A4A', '#4A5A5A']
    const pollutedColors = ['#7A5A3A', '#8A4A3A', '#6A4A4A', '#5A5A3A', '#8A6A3A']

    // Rebuild the registry from scratch for the new set (StrictMode-safe:
    // clearing first makes double-invocation idempotent).
    debrisPositions.length = 0
    debrisRegistry.length = 0

    for (let i = 0; i < count; i++) {
      const isPolluted = i > count * 0.3
      const colorSet = isPolluted ? pollutedColors : cleanColors
      const pos: [number, number, number] = [
        (Math.random() - 0.5) * 24,
        -3.5 + Math.random() * 0.5,
        (Math.random() - 0.5) * 18,
      ]
      const scale = 0.05 + Math.random() * 0.15
      arr.push({
        pos,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      })
      debrisPositions.push({ x: pos[0], y: pos[1], z: pos[2], size: scale })
      debrisRegistry.push({ mesh: null, hiddenUntil: 0 })
    }
    return arr
  }, [count])

  // Respawn hidden debris once its cooldown (set by the robot) has elapsed.
  useFrame((state) => {
    const now = state.clock.elapsedTime
    for (let i = 0; i < debrisRegistry.length; i++) {
      const handle = debrisRegistry[i]
      if (handle.mesh && handle.hiddenUntil > 0 && now >= handle.hiddenUntil) {
        handle.mesh.visible = true
        handle.hiddenUntil = 0
      }
    }
  })

  return (
    <group>
      {items.map((d, i) => (
        <mesh
          key={i}
          position={d.pos}
          rotation={d.rot}
          scale={d.scale}
          ref={(mesh) => {
            debrisRegistry[i].mesh = mesh
          }}
        >
          {d.shape === 'box' && <boxGeometry args={[0.2, 0.05, 0.15]} />}
          {d.shape === 'bottle' && <cylinderGeometry args={[0.03, 0.05, 0.2, 5]} />}
          {d.shape === 'bag' && <boxGeometry args={[0.15, 0.08, 0.12]} />}
          <meshStandardMaterial color={d.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export default function Seabed({ debrisCount = 0 }: SeabedProps) {
  const geo = useMemo(() => {
    const w = 50
    const d = 40
    const segments = 40
    const positions = new Float32Array((segments + 1) * (segments + 1) * 3)
    const colors = new Float32Array((segments + 1) * (segments + 1) * 3)
    let idx = 0
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * w
        const z = (j / segments - 0.5) * d
        const yNoise =
          Math.sin(i * 0.3) * Math.cos(j * 0.4) * 0.4 +
          Math.sin(i * 0.7 + j * 0.5) * 0.2 +
          (Math.random() - 0.5) * 0.3
        positions[idx] = x
        positions[idx + 1] = -4 + yNoise
        positions[idx + 2] = z
        const brightness = 0.3 + yNoise * 0.1 + 0.1
        colors[idx] = 0.15 * brightness
        colors[idx + 1] = 0.2 * brightness
        colors[idx + 2] = 0.25 * brightness
        idx += 3
      }
    }
    const indices: number[] = []
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j
        const b = i * (segments + 1) + j + 1
        const c = (i + 1) * (segments + 1) + j
        const d2 = (i + 1) * (segments + 1) + j + 1
        indices.push(a, b, c)
        indices.push(b, d2, c)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.setIndex(indices)
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group>
      <mesh geometry={geo} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      <Rocks />
      <Debris count={debrisCount > 0 ? debrisCount : BASELINE_DEBRIS} />
    </group>
  )
}
