'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number
  color?: string
  opacity?: number
  speed?: number
}

/**
 * Per-particle twinkle: two-harmonic sinusoidal opacity pulse with phase
 * offset (plankton shimmer) — the second harmonic keeps it organic, not looped.
 */
const twinkleVertexShader = `
  attribute float aPhase;
  attribute float aSize;

  uniform float uTime;

  varying float vTwinkle;

  void main() {
    vTwinkle = 0.55
      + 0.35 * sin(uTime * 1.4 + aPhase * 6.2831853)
      + 0.10 * sin(uTime * 2.6 + aPhase * 9.0);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (280.0 / max(0.1, -mvPosition.z)), 1.0, 56.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const twinkleFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(uColor, alpha * uOpacity * vTwinkle);
  }
`

/** World-space drift volume; particles wrap seamlessly at the walls. */
const BOUNDS = {
  x: 26,
  yMin: -6,
  yMax: 16,
  zMin: -32,
  zMax: 6,
} as const

interface LayerConfig {
  count: number
  color: string
  opacity: number
  speed: number
  sizeBase: number
  spreadMul: number
  /** Upward buoyancy bias — plankton rises, snow sinks. */
  buoyancy: number
  /** Scale of the wander wobble. */
  wobble: number
}

function ParticleLayer({
  config,
}: {
  config: LayerConfig
}) {
  const ref = useRef<THREE.Points>(null)
  const safeCount = Math.max(1, config.count)

  // Per-particle velocities + phases, pre-allocated once.
  const vel = useRef<Float32Array>(new Float32Array(safeCount * 3))
  const phases = useRef<Float32Array>(new Float32Array(safeCount))

  const geometry = useMemo(() => {
    vel.current = new Float32Array(safeCount * 3)
    phases.current = new Float32Array(safeCount)
    const pos = new Float32Array(safeCount * 3)
    const sizes = new Float32Array(safeCount)
    const phaseAttr = new Float32Array(safeCount)

    const span = (BOUNDS.zMax - BOUNDS.zMin) * 0.55
    for (let i = 0; i < safeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2 * config.spreadMul
      pos[i * 3 + 1] = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin)
      pos[i * 3 + 2] = BOUNDS.zMin + Math.random() * span * config.spreadMul
      // Small per-particle drift velocity + shared buoyancy.
      vel.current[i * 3] = (Math.random() - 0.5) * 0.02 * config.speed
      vel.current[i * 3 + 1] = (Math.random() - 0.5) * 0.01 * config.speed + config.buoyancy
      vel.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02 * config.speed
      phases.current[i] = Math.random() * Math.PI * 2
      sizes[i] = config.sizeBase * (0.5 + Math.random() * 1)
      phaseAttr[i] = Math.random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phaseAttr, 1))
    return geo
  }, [safeCount, config.sizeBase, config.spreadMul, config.speed, config.buoyancy])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: twinkleVertexShader,
        fragmentShader: twinkleFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(config.color) },
          uOpacity: { value: config.opacity },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [config.color, config.opacity]
  )

  useEffect(() => {
    ;(material.uniforms.uColor.value as THREE.Color).set(config.color)
  }, [material, config.color])

  useEffect(() => {
    material.uniforms.uOpacity.value = config.opacity
  }, [material, config.opacity])

  // Clean up WebGL resources to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    if (!ref.current) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const v = vel.current
    const ph = phases.current

    for (let i = 0; i < safeCount; i++) {
      // Velocity drift + sinusoidal wobble.
      pos[i * 3] += v[i * 3] * dt + Math.sin(t * 0.4 + ph[i]) * config.wobble * dt
      pos[i * 3 + 1] += v[i * 3 + 1] * dt + Math.sin(t * 0.55 + ph[i] * 1.7) * config.wobble * 0.5 * dt
      pos[i * 3 + 2] += v[i * 3 + 2] * dt + Math.cos(t * 0.3 + ph[i] * 0.9) * config.wobble * 0.7 * dt

      // Seamless wrap.
      const x = pos[i * 3]
      const y = pos[i * 3 + 1]
      const z = pos[i * 3 + 2]
      if (x > BOUNDS.x) pos[i * 3] = -BOUNDS.x
      else if (x < -BOUNDS.x) pos[i * 3] = BOUNDS.x
      if (y > BOUNDS.yMax) pos[i * 3 + 1] = BOUNDS.yMin
      else if (y < BOUNDS.yMin) pos[i * 3 + 1] = BOUNDS.yMax
      if (z > BOUNDS.zMax) pos[i * 3 + 2] = BOUNDS.zMin
      else if (z < BOUNDS.zMin) pos[i * 3 + 2] = BOUNDS.zMax
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

export default function Particles(props: ParticlesProps) {
  const deviceTier = useStore((s) => s.deviceTier)
  const quality = useStore((s) => s.quality)

  // Mobile budget: halve counts, enlarge sprites so the plankton field stays
  // visible on small, high-density screens. (See the quality matrix in World.tsx.)
  const isMobile = deviceTier === 'low' || quality < 0.75
  const mul = isMobile ? 0.5 : 1
  const sizeMul = isMobile ? 1.4 : 1

  const baseCount = Math.max(1, Math.round((props.count ?? 200) * mul))
  const speed = Math.max(0.001, props.speed ?? 0.3)

  const layers = useMemo<LayerConfig[]>(
    () => [
      // Fine dust — scene-tinted, everywhere.
      {
        count: Math.round(baseCount * 2),
        color: props.color ?? '#88BBDD',
        opacity: (props.opacity ?? 0.4) * 0.8,
        speed,
        sizeBase: 0.035 * sizeMul,
        spreadMul: 1.6,
        buoyancy: 0.004 * speed,
        wobble: 0.06 * speed,
      },
      // Plankton motes — larger, warm-tinted, slow rise.
      {
        count: Math.round(baseCount * 1.1),
        color: '#D8C890',
        opacity: (props.opacity ?? 0.4) * 0.5,
        speed: speed * 0.6,
        sizeBase: 0.09 * sizeMul,
        spreadMul: 1.1,
        buoyancy: 0.02 * speed,
        wobble: 0.12 * speed,
      },
      // Marine snow — sparse, slow sink.
      {
        count: Math.round(baseCount * 0.6),
        color: '#9AB8CC',
        opacity: (props.opacity ?? 0.4) * 0.4,
        speed: speed * 0.45,
        sizeBase: 0.055 * sizeMul,
        spreadMul: 1.3,
        buoyancy: -0.012 * speed,
        wobble: 0.045 * speed,
      },
    ],
    [baseCount, sizeMul, speed, props.color, props.opacity]
  )

  return (
    <group>
      {layers.map((cfg, i) => (
        <ParticleLayer key={i} config={cfg} />
      ))}
    </group>
  )
}
