'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

interface CoralProps {
  intact: number
}

/** Abyss-friendly coral palette. */
const PALETTE = [
  '#D4856A',
  '#C4A55A',
  '#6A9AB5',
  '#7A9A7A',
  '#B57A5A',
  '#5A8A9A',
  '#C4956A',
  '#A47A5A',
]

/** Bleached grey the reef fades toward as `intact` drops. */
const BLEACH = new THREE.Color('#4A5A5A')

/**
 * Deterministic PRNG (mulberry32) so reef layout is stable per mount —
 * no layout reshuffle between renders.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ROBOT_EXCLUSION = { x: 0, z: -8, r: 2.6 }
const CENTER_HALF_WIDTH = 1.3
const CENTER_MIN_Z = -7

/** Pick a seabed spot: two dense reef zones plus scattered stragglers. */
function randomPlacement(rand: () => number): { x: number; z: number } {
  const roll = rand()
  let x: number
  let z: number
  if (roll < 0.55) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * 3.6
    x = -6 + Math.cos(a) * r
    z = -9.5 + Math.sin(a) * r
  } else if (roll < 0.8) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * 3.2
    x = 6.5 + Math.cos(a) * r
    z = -11.5 + Math.sin(a) * r
  } else {
    x = (rand() - 0.5) * 24
    z = -2.5 - rand() * 13.5
  }
  // Keep the robot patrol zone clear.
  const dx = x - ROBOT_EXCLUSION.x
  const dz = z - ROBOT_EXCLUSION.z
  if (dx * dx + dz * dz < ROBOT_EXCLUSION.r * ROBOT_EXCLUSION.r) {
    z = -8 - ROBOT_EXCLUSION.r - rand() * 6
  }
  // Keep the center camera path clear.
  if (Math.abs(x) < CENTER_HALF_WIDTH && z > CENTER_MIN_Z) {
    x = (Math.abs(x) + 1.6) * (rand() > 0.5 ? 1 : -1)
  }
  return { x, z }
}

interface CoralInstance {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: [number, number, number]
  color: string
  phase: number
}

/**
 * One archetype rendered as a single InstancedMesh: canonical geometry,
 * per-instance matrix + instance color, organic sway in the frame loop.
 * Four archetypes ≈ 4 draw calls for the whole reef (vs ~120 before).
 */
function InstancedCoral({
  geometry,
  instances,
  maxCount,
  swaySpeed,
  intact,
}: {
  geometry: THREE.BufferGeometry
  instances: CoralInstance[]
  maxCount: number
  swaySpeed: number
  intact: number
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const baseColors = useMemo(() => instances.map((i) => new THREE.Color(i.color)), [instances])
  const scratch = useMemo(() => new THREE.Color(), [])
  const lastIntact = useRef(intact)
  const count = instances.length

  useLayoutEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < count; i++) ref.current.setColorAt(i, baseColors[i])
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [baseColors, count])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    const intactScale = Math.max(0.1, intact)

    for (let i = 0; i < count; i++) {
      const inst = instances[i]
      const sway = Math.sin(t * swaySpeed + inst.phase)
      dummy.position.set(inst.pos[0], inst.pos[1], inst.pos[2])
      dummy.rotation.set(
        inst.rot[0] + Math.sin(t * swaySpeed * 0.8 + inst.phase * 1.3) * 0.012,
        inst.rot[1] + sway * 0.035,
        inst.rot[2] + Math.sin(t * swaySpeed * 0.6 + inst.phase) * 0.02
      )
      dummy.scale.set(
        inst.scale[0] * intactScale,
        inst.scale[1] * intactScale,
        inst.scale[2] * intactScale
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // Bleach toward grey as the reef degrades — upload colors only on change.
    if (Math.abs(intact - lastIntact.current) > 0.01) {
      lastIntact.current = intact
      for (let i = 0; i < count; i++) {
        scratch.copy(baseColors[i]).lerp(BLEACH, 1 - intact)
        mesh.setColorAt(i, scratch)
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, maxCount]}
      count={count}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color="#FFFFFF"
        roughness={0.65}
        metalness={0.1}
        flatShading
        emissive="#0A1620"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  )
}

/** Canonical geometries — one per archetype, shared by every instance. */
function makeBranchGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.02, 0.3, 0.05),
    new THREE.Vector3(0.09, 0.62, 0.02),
    new THREE.Vector3(0.16, 0.95, -0.06),
  ])
  return new THREE.TubeGeometry(curve, 8, 0.045, 6, false)
}

function makeStalkGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.012, 0.35, 0.02),
    new THREE.Vector3(-0.02, 0.7, 0),
  ])
  return new THREE.TubeGeometry(curve, 6, 0.05, 5, false)
}

function makePlateGeometry() {
  return new THREE.ConeGeometry(0.55, 0.09, 5)
}

function makeFernGeometry() {
  return new THREE.ConeGeometry(0.03, 0.85, 4)
}

export default function Coral({ intact = 1 }: CoralProps) {
  const quality = useStore((s) => s.quality)
  const high = quality > 0.75
  const tier = high ? 'high' : 'low'

  const counts = useMemo(
    () =>
      high
        ? { branch: 14, plate: 8, stalk: 16, fern: 12 }
        : { branch: 8, plate: 5, stalk: 9, fern: 6 },
    [high]
  )

  const instances = useMemo(() => {
    const rand = mulberry32(0x51a63)
    const pickColor = () => PALETTE[Math.floor(rand() * PALETTE.length)]
    const build = (
      n: number,
      sMin: number,
      sMax: number,
      yMin: number,
      yMax: number
    ): CoralInstance[] =>
      Array.from({ length: n }, () => {
        const { x, z } = randomPlacement(rand)
        const s = sMin + rand() * (sMax - sMin)
        return {
          pos: [x, -3.95 + rand() * 0.15, z],
          rot: [0, rand() * Math.PI * 2, 0],
          scale: [s, s * (yMin + rand() * (yMax - yMin)), s],
          color: pickColor(),
          phase: rand() * Math.PI * 2,
        }
      })

    return {
      branches: build(counts.branch, 0.7, 1.5, 1.1, 1.9),
      plates: build(counts.plate, 0.6, 1.6, 0.8, 1.1),
      stalks: build(counts.stalk, 0.6, 1.4, 1.0, 2.0),
      ferns: build(counts.fern, 0.7, 1.8, 1.3, 2.4),
    }
  }, [counts])

  const geometries = useMemo(
    () => ({
      branch: makeBranchGeometry(),
      plate: makePlateGeometry(),
      stalk: makeStalkGeometry(),
      fern: makeFernGeometry(),
    }),
    []
  )

  return (
    <group>
      <InstancedCoral
        key={`branch-${tier}`}
        geometry={geometries.branch}
        instances={instances.branches}
        maxCount={counts.branch}
        swaySpeed={0.5}
        intact={intact}
      />
      <InstancedCoral
        key={`plate-${tier}`}
        geometry={geometries.plate}
        instances={instances.plates}
        maxCount={counts.plate}
        swaySpeed={0.35}
        intact={intact}
      />
      <InstancedCoral
        key={`stalk-${tier}`}
        geometry={geometries.stalk}
        instances={instances.stalks}
        maxCount={counts.stalk}
        swaySpeed={0.42}
        intact={intact}
      />
      <InstancedCoral
        key={`fern-${tier}`}
        geometry={geometries.fern}
        instances={instances.ferns}
        maxCount={counts.fern}
        swaySpeed={0.55}
        intact={intact}
      />
    </group>
  )
}
