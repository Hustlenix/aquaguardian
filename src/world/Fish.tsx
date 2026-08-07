'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { useStore } from '@/store/useStore'

interface FishProps {
  visible?: boolean
}

const FISH_COLORS = ['#D4AF37', '#88CCFF', '#6AD0A0', '#E8A060', '#A080D0']

/**
 * Flocking weights — tuned for slow, graceful underwater schooling rather
 * than frantic bird-swarm behaviour. Neighbour checks are O(n²) per school,
 * but schools are capped at ~22 fish so the whole scene stays ~40 agents.
 */
const COHESION = 0.55
const ALIGNMENT = 0.95
const SEPARATION = 2.8
const BOUNDARY = 1.2
const WANDER = 0.35
const MAX_SPEED = 1.5
const MAX_FORCE = 0.7
const NEIGHBOR_RADIUS = 2.8
const SEPARATION_RADIUS = 0.9
/** The robot patrol zone — fish steer around it. */
const EXCLUSION = new THREE.Vector3(0, -1, -8)
const EXCLUSION_RADIUS = 2.8
const SEABED_Y = -3.5

/** Canonical heading (geometry nose points +Z after the rotateX bake). */
const FORWARD = new THREE.Vector3(0, 0, 1)
const WORLD_UP = new THREE.Vector3(0, 1, 0)

interface SchoolSpec {
  center: [number, number, number]
  half: [number, number, number]
  count: number
}

interface FishAgent {
  pos: THREE.Vector3
  vel: THREE.Vector3
  size: number
  color: THREE.Color
  phase: number
}

function FishSchool({ spec }: { spec: SchoolSpec }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Reusable scratch objects — zero allocation inside the frame loop.
  const T = useMemo(
    () => ({
      center: new THREE.Vector3(),
      coh: new THREE.Vector3(),
      align: new THREE.Vector3(),
      sep: new THREE.Vector3(),
      steer: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      prevDir: new THREE.Vector3(0, 0, 1),
      right: new THREE.Vector3(),
      pitchAxis: new THREE.Vector3(),
      toExcl: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      q2: new THREE.Quaternion(),
    }),
    []
  )

  const agents = useMemo<FishAgent[]>(() => {
    // A shared drift bias makes the school wander as a unit.
    const bias = new THREE.Vector3(
      (Math.random() - 0.5) * 0.35,
      (Math.random() - 0.5) * 0.12,
      (Math.random() - 0.5) * 0.35
    )
    const arr: FishAgent[] = []
    for (let i = 0; i < spec.count; i++) {
      arr.push({
        pos: new THREE.Vector3(
          spec.center[0] + (Math.random() - 0.5) * spec.half[0] * 1.4,
          spec.center[1] + (Math.random() - 0.5) * spec.half[1] * 1.4,
          spec.center[2] + (Math.random() - 0.5) * spec.half[2] * 1.4
        ),
        vel: new THREE.Vector3(
          bias.x + (Math.random() - 0.5) * 0.3,
          bias.y + (Math.random() - 0.5) * 0.15,
          bias.z + (Math.random() - 0.5) * 0.3
        ),
        size: 0.8 + Math.random() * 0.5,
        color: new THREE.Color(FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)]),
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [spec])

  // Geometry is shared by every fish: one draw call for the whole school.
  const geometry = useMemo(() => {
    // Sleeker fish body: flattened, elongated ellipsoid (nose +Z).
    const body = new THREE.SphereGeometry(0.07, 12, 8)
    body.scale(1, 0.55, 1.6)
    // Tail fin: vertical plane at the rear (root near z=-0.08).
    const fin = new THREE.PlaneGeometry(0.1, 0.12)
    fin.rotateY(Math.PI / 2)
    fin.translate(0, 0, -0.1)
    // Merge so the whole fish is ONE instanced geometry (single draw call).
    const merged = mergeGeometries([body, fin])!
    // Flag fin vertices so the vertex shader can swish the tail.
    const bodyCount = body.attributes.position.count
    const aFin = new Float32Array(merged.attributes.position.count)
    aFin.fill(1, bodyCount)
    merged.setAttribute('aFin', new THREE.BufferAttribute(aFin, 1))
    // Per-instance phase so tails swish out of sync.
    merged.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(new Float32Array(spec.count), 1)
    )
    return merged
  }, [spec])

  const timeUniform = useMemo(() => ({ value: 0 }), [])

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.45,
      metalness: 0.25,
      side: THREE.DoubleSide, // tail fin plane is visible from both sides
      emissive: '#0A1620',
      emissiveIntensity: 0.6,
    })
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nattribute float aFin;\nattribute float aPhase;'
        )
        .replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          // Tail swish: fin vertices rotate around the local Y axis at the tail
          // root. Body vertices (aFin = 0) are left untouched.
          float sw = aFin * sin(uTime * 9.0 + aPhase) * 0.35;
          vec3 tp = vec3(0.0, 0.0, -0.08);
          vec3 p = transformed - tp;
          float c = cos(sw);
          float s = sin(sw);
          transformed = vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c) + tp;
          `
        )
    }
    return m
  }, [timeUniform])

  // Instance colors + tail phases are static per fish — set once.
  useLayoutEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < agents.length; i++) {
      ref.current.setColorAt(i, agents[i].color)
    }
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    const aPhase = geometry.getAttribute('aPhase') as THREE.InstancedBufferAttribute
    for (let i = 0; i < agents.length; i++) {
      aPhase.setX(i, agents[i].phase)
    }
    aPhase.needsUpdate = true
  }, [agents, geometry])

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    // School centroid for cohesion.
    T.center.set(0, 0, 0)
    for (let i = 0; i < agents.length; i++) T.center.add(agents[i].pos)
    T.center.multiplyScalar(1 / agents.length)

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i]
      T.coh.set(0, 0, 0)
      T.align.set(0, 0, 0)
      T.sep.set(0, 0, 0)
      let n = 0

      for (let j = 0; j < agents.length; j++) {
        if (j === i) continue
        const b = agents[j]
        const dx = b.pos.x - a.pos.x
        const dy = b.pos.y - a.pos.y
        const dz = b.pos.z - a.pos.z
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 > NEIGHBOR_RADIUS * NEIGHBOR_RADIUS) continue
        n++
        T.coh.add(b.pos)
        T.align.add(b.vel)
        if (d2 < SEPARATION_RADIUS * SEPARATION_RADIUS && d2 > 1e-6) {
          const d = Math.sqrt(d2)
          T.sep.addScaledVector(T.tmp.set(dx / d, dy / d, dz / d), 1 / d)
        }
      }

      T.steer.set(0, 0, 0)

      if (n > 0) {
        // Cohesion — pull toward the school centroid.
        T.coh.multiplyScalar(1 / n).sub(a.pos)
        if (T.coh.lengthSq() > 1e-6) T.steer.addScaledVector(T.coh.normalize(), COHESION)
        // Alignment — match neighbour velocity.
        T.align.multiplyScalar(1 / n)
        T.steer.addScaledVector(T.align, ALIGNMENT)
        // Separation — push away from crowded neighbours.
        T.steer.addScaledVector(T.sep, SEPARATION)
      }

      // Roam boundary — soft spring back into the school's volume.
      for (const axis of ['x', 'y', 'z'] as const) {
        const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
        const h = spec.half[idx]
        const c = spec.center[idx]
        const d = a.pos[axis] - c
        if (d > h) T.steer[axis] -= (d - h) * BOUNDARY
        else if (d < -h) T.steer[axis] += (-h - d) * BOUNDARY
      }

      // Seabed avoidance.
      if (a.pos.y < SEABED_Y) T.steer.y += (SEABED_Y - a.pos.y) * 4

      // Robot exclusion zone — the school flows around the patrol area.
      T.toExcl.subVectors(a.pos, EXCLUSION)
      const exclDist = T.toExcl.length()
      if (exclDist < EXCLUSION_RADIUS && exclDist > 1e-4) {
        T.steer.addScaledVector(T.toExcl.normalize(), (EXCLUSION_RADIUS - exclDist) * 2.2)
      }

      // Wander — organic meander on multiple harmonics.
      T.steer.x += Math.sin(t * 0.4 + a.phase) * WANDER
      T.steer.y += Math.sin(t * 0.55 + a.phase * 1.7) * WANDER * 0.6
      T.steer.z += Math.cos(t * 0.35 + a.phase * 0.9) * WANDER

      // Integrate (steering force clamped, speed clamped).
      if (T.steer.lengthSq() > MAX_FORCE * MAX_FORCE) T.steer.clampLength(0, MAX_FORCE)
      a.vel.addScaledVector(T.steer, dt)
      const sp = a.vel.length()
      if (sp > MAX_SPEED) a.vel.multiplyScalar(MAX_SPEED / sp)
      a.pos.addScaledVector(a.vel, dt)

      // Orientation — face velocity, bank into turns, tail-flick undulation.
      if (sp > 0.08) {
        T.dir.copy(a.vel).normalize()

        T.q.setFromUnitVectors(FORWARD, T.dir)

        // Bank into the turn: yaw-rate proxy from horizontal velocity change.
        const bank = THREE.MathUtils.clamp(
          (a.vel.x * T.prevDir.z - a.vel.z * T.prevDir.x) * 0.9,
          -0.5,
          0.5
        )
        T.q2.setFromAxisAngle(T.dir, -bank)
        T.q.multiply(T.q2)

        // Tail-flick pitch undulation around the lateral axis.
        T.right.crossVectors(T.dir, WORLD_UP)
        if (T.right.lengthSq() > 1e-6) {
          T.right.normalize()
          T.pitchAxis.crossVectors(T.right, T.dir).normalize()
          T.q2.setFromAxisAngle(T.pitchAxis, Math.sin(t * 7 + a.phase) * 0.07)
          T.q.multiply(T.q2)
        }

        dummy.quaternion.copy(T.q)
        T.prevDir.copy(T.dir)
      }

      dummy.position.copy(a.pos)
      dummy.scale.setScalar(a.size)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, spec.count]}
      frustumCulled={false}
    />
  )
}

export default function Fish({ visible = false }: FishProps) {
  const quality = useStore((s) => s.quality)
  if (!visible) return null

  // High quality: 3 schools (~42 fish). Low/medium: 2 smaller schools.
  const specs: SchoolSpec[] =
    quality > 0.75
      ? [
          { center: [0, 0.2, -9], half: [10, 3.6, 6], count: 22 },
          { center: [-5, -0.8, -13], half: [6, 2.8, 5], count: 12 },
          { center: [6.5, -1.2, -12], half: [5, 2.6, 4.5], count: 8 },
        ]
      : [
          { center: [0, 0, -9.5], half: [9, 3.2, 5.5], count: 12 },
          { center: [-5, -1, -13], half: [6, 2.6, 5], count: 8 },
        ]

  return (
    <group>
      {specs.map((s, i) => (
        <FishSchool key={i} spec={s} />
      ))}
    </group>
  )
}
