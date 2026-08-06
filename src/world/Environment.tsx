'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

/**
 * Layered underwater atmosphere:
 * - distant rock/ridge silhouettes that fade into the fog (instanced, static),
 * - drifting volumetric haze bands (cheap gradient shader planes),
 * - glowing plankton motes drifting near the camera (points).
 * All layers are tuned to stay nearly free on the frame budget.
 */

const fogPlaneVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fogPlaneFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    // Soft vertical band, mid-height of the plane.
    float band = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
    // Slow horizontal density drift — the haze never reads as static.
    float drift = 0.65 + 0.35 * sin(vUv.x * 3.1 + uTime * 0.05 + uSeed) * cos(vUv.y * 2.2 + uTime * 0.04);
    float alpha = band * drift * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

interface FogLayerConfig {
  pos: [number, number, number]
  size: [number, number]
  rotY: number
  opacity: number
  seed: number
}

function FogLayer({ cfg }: { cfg: FogLayerConfig }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fogPlaneVertexShader,
        fragmentShader: fogPlaneFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color('#7FB4D8') },
          uOpacity: { value: cfg.opacity },
          uTime: { value: 0 },
          uSeed: { value: cfg.seed },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [cfg.opacity, cfg.seed]
  )

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  const [width, height] = cfg.size

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, 1, 1),
    [width, height]
  )

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={cfg.pos}
      rotation={[0, cfg.rotY, 0]}
      renderOrder={2}
    />
  )
}

function SilhouetteRidge({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const baseColor = useMemo(() => new THREE.Color('#021521'), [])

  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 52,
        z: -28 - Math.random() * 12,
        s: 1.6 + Math.random() * 3.4,
        y: -4.6 + Math.random() * 1.4,
        rotY: Math.random() * Math.PI,
      })),
    [count]
  )

  useLayoutEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      dummy.position.set(d.x, d.y, d.z)
      dummy.rotation.set(0, d.rotY, 0)
      dummy.scale.set(d.s * (0.6 + Math.random() * 0.8), d.s, d.s * (0.6 + Math.random() * 0.8))
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
      ref.current.setColorAt(i, baseColor)
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [data, baseColor, dummy])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#FFFFFF" roughness={1} metalness={0} flatShading />
    </instancedMesh>
  )
}

function GlowMotes({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const phases = useRef<Float32Array>(new Float32Array(count))
  const offsets = useRef<Float32Array>(new Float32Array(count))

  const geometry = useMemo(() => {
    phases.current = new Float32Array(count)
    offsets.current = new Float32Array(count)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = -3 + Math.random() * 11
      pos[i * 3 + 2] = 1 - Math.random() * 12
      phases.current[i] = Math.random() * Math.PI * 2
      offsets.current[i] = 0.3 + Math.random() * 0.7
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += offsets.current[i] * 0.02 * dt
      pos[i * 3] += Math.sin(t * 0.3 + phases.current[i]) * 0.015 * dt
      pos[i * 3 + 2] += Math.cos(t * 0.25 + phases.current[i] * 1.3) * 0.01 * dt
      // Wrap back down when they float too high.
      if (pos[i * 3 + 1] > 8.5) {
        pos[i * 3 + 1] = -3
        pos[i * 3] = (Math.random() - 0.5) * 24
        pos[i * 3 + 2] = 1 - Math.random() * 12
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#88CCFF"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export default function Environment() {
  const quality = useStore((s) => s.quality)
  const high = quality > 0.75

  const fogLayers = useMemo<FogLayerConfig[]>(
    () => [
      { pos: [-4, 1.5, -13], size: [56, 16], rotY: 0.08, opacity: 0.055, seed: 0.0 },
      { pos: [5, 0.5, -19], size: [60, 15], rotY: -0.1, opacity: 0.045, seed: 2.1 },
      { pos: [-2, -1, -27], size: [64, 14], rotY: 0.05, opacity: 0.06, seed: 4.3 },
    ],
    []
  )

  return (
    <group>
      <SilhouetteRidge count={high ? 16 : 10} />
      {fogLayers.map((cfg, i) => (
        <FogLayer key={i} cfg={cfg} />
      ))}
      <GlowMotes count={high ? 70 : 40} />
    </group>
  )
}
