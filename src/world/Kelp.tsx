'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface KelpProps {
  density?: number
}

const KELP_COLORS = ['#2A6A3A', '#3A7A4A', '#1A5A2A', '#4A8A5A']

/** Upper bound for instancing (density ≤ 1 → at most 20 stalks). */
const MAX_STALKS = 24

interface StalkSpec {
  x: number
  z: number
  height: number
  phase: number
  rotY: number
  color: THREE.Color
}

/**
 * Kelp field as ONE InstancedMesh: a shared blade geometry, per-instance
 * phase/color, and the sway computed on the GPU via onBeforeCompile — the
 * tips sweep through the current while the base stays anchored. This replaces
 * dozens of tiny per-segment meshes with a single draw call.
 */
function KelpField({ density }: { density: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const timeUniform = useMemo(() => ({ value: 0 }), [])

  const count = Math.min(MAX_STALKS, Math.round(8 + density * 12))

  const geometry = useMemo(() => {
    // Tapered blade: a thin prism, wide at the base, narrowing to the tip.
    // Spans y -0.5..0.5 so the sway shader's "k = position.y*0.5+0.5" keeps
    // working unchanged (0 at the root, 1 at the tip).
    const rings = 4
    const halfDepth = 0.02
    const positions: number[] = []
    const indices: number[] = []
    for (let i = 0; i <= rings; i++) {
      const t = i / rings
      const y = -0.5 + t
      const halfW = 0.045 - t * (0.045 - 0.012) // 0.045 base → 0.012 tip
      positions.push(
        -halfW, y, halfDepth,
        halfW, y, halfDepth,
        halfW, y, -halfDepth,
        -halfW, y, -halfDepth
      )
    }
    for (let i = 0; i < rings; i++) {
      const a = i * 4
      const b = a + 4
      // front, right, back, left faces
      indices.push(a, b, b + 1, a, b + 1, a + 1)
      indices.push(a + 1, b + 1, b + 2, a + 1, b + 2, a + 2)
      indices.push(a + 2, b + 2, b + 3, a + 2, b + 3, a + 3)
      indices.push(a + 3, b + 3, b, a + 3, b, a)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    g.setIndex(indices)
    g.computeVertexNormals()
    const phases = new Float32Array(MAX_STALKS)
    for (let i = 0; i < MAX_STALKS; i++) phases[i] = Math.random() * Math.PI * 2
    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    return g
  }, [])

  const stalks = useMemo<StalkSpec[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 28,
        z: -5 - Math.random() * 14,
        height: 1.5 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI,
        color: new THREE.Color(KELP_COLORS[Math.floor(Math.random() * KELP_COLORS.length)]),
      })),
    [count]
  )

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.85,
      metalness: 0,
      flatShading: true,
      side: THREE.DoubleSide,
      emissive: '#04120A',
      emissiveIntensity: 0.3,
    })
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aPhase;')
        .replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          // k: 0 at the base → 1 at the tip (box spans -0.5..0.5 in y).
          float k = position.y * 0.5 + 0.5;
          float sway = sin(uTime * 0.85 + aPhase) * (0.10 + 0.42 * k * k);
          transformed.x += sway * k;
          transformed.z += cos(uTime * 0.65 + aPhase * 1.3) * 0.07 * k * k;
          `
        )
    }
    return m
  }, [timeUniform])

  // Per-stalk color set once.
  useLayoutEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < stalks.length; i++) {
      ref.current.setColorAt(i, stalks[i].color)
    }
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [stalks])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    timeUniform.value = state.clock.elapsedTime
    const t = state.clock.elapsedTime
    for (let i = 0; i < stalks.length; i++) {
      const s = stalks[i]
      dummy.position.set(s.x, -4 + s.height / 2, s.z)
      dummy.rotation.set(0, s.rotY + Math.sin(t * 0.05 + s.phase) * 0.12, 0)
      const w = 0.8 + (i % 5) * 0.12
      dummy.scale.set(w, s.height, w)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geometry, material, MAX_STALKS]} count={count} frustumCulled={false} />
  )
}

export default function Kelp({ density = 0.5 }: KelpProps) {
  if (density < 0.05) return null
  return <KelpField density={density} />
}
