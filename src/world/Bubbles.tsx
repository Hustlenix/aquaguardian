'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

const POP_DURATION = 0.4
/** Brief hold at the surface before the bubble bursts. */
const SURFACE_HOLD = 0.18
const SURFACE_Y = 7.2
/** Chance that a bubble spawns as part of a rising stream (chain). */
const CHAIN_CHANCE = 0.2
const CHAIN_MAX = 5

const bubbleVertexShader = `
  attribute float aSize;
  attribute float aAlpha;

  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (300.0 / max(0.1, -mvPosition.z)), 1.0, 40.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const bubbleFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    float body = smoothstep(0.5, 0.35, r) * 0.35;
    float rim = exp(-pow((r - 0.36) * 16.0, 2.0)) * 0.85;
    float alpha = (body + rim) * vAlpha;
    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`

interface BubbleState {
  size: number
  speed: number
  phase: number
  wobble: number
  wobble2: number
  /** 0 = rising, else seconds left of hold/pop. */
  holdTimer: number
  popTimer: number
  alpha: number
}

export default function Bubbles({ count = 80 }: { count?: number }) {
  const quality = useStore((s) => s.quality)
  const safeCount = Math.max(1, quality > 0.75 ? count : Math.round(count / 2))

  const ref = useRef<THREE.Points>(null)
  const state = useRef<BubbleState[]>([])

  const geometry = useMemo(() => {
    const pos = new Float32Array(safeCount * 3)
    const sizes = new Float32Array(safeCount)
    const alphas = new Float32Array(safeCount)
    state.current = []

    // Spawn in small vertical chains (~20% of bubbles) so streams read as
    // rising from the seabed, not random static points.
    for (let i = 0; i < safeCount; i++) {
      const chained = Math.random() < CHAIN_CHANCE
      const chainLen = chained ? 2 + Math.floor(Math.random() * (CHAIN_MAX - 1)) : 1
      const x = (Math.random() - 0.5) * 18
      const z = (Math.random() - 0.5) * 14 - 3
      const baseY = -3.5 - Math.random() * 1.5

      for (let c = 0; c < chainLen && i + c < safeCount; c++) {
        const j = i + c
        // Wider size variance — a mix of fine mist and visible orbs.
        const size = 0.02 + Math.random() * 0.14
        pos[j * 3] = x + (Math.random() - 0.5) * 0.12
        pos[j * 3 + 1] = baseY - c * 0.28
        pos[j * 3 + 2] = z + (Math.random() - 0.5) * 0.12
        sizes[j] = size
        alphas[j] = 0.5 + Math.random() * 0.5
        state.current.push({
          size,
          speed: 0.3 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          wobble: 0.08 + Math.random() * 0.2,
          wobble2: 0.05 + Math.random() * 0.15,
          holdTimer: 0,
          popTimer: 0,
          alpha: alphas[j],
        })
      }
      i += chainLen - 1
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    return geo
  }, [safeCount])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: bubbleVertexShader,
        fragmentShader: bubbleFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color('#C8E8FF') },
          uOpacity: { value: 0.3 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useEffect(() => {
    material.uniforms.uOpacity.value = 0.3
  }, [material])

  useFrame((stateFrame, delta) => {
    if (!ref.current) return
    const dt = Math.min(delta, 0.05)

    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const sizes = ref.current.geometry.attributes.aSize.array as Float32Array
    const alphas = ref.current.geometry.attributes.aAlpha.array as Float32Array
    const t = stateFrame.clock.elapsedTime
    const n = state.current.length

    const respawn = (i: number) => {
      pos[i * 3] = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = -3.5 - Math.random() * 1.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
      const s = state.current[i]
      s.size = 0.02 + Math.random() * 0.14
      s.speed = 0.3 + Math.random() * 1.8
      s.wobble = 0.08 + Math.random() * 0.2
      s.wobble2 = 0.05 + Math.random() * 0.15
      s.holdTimer = 0
      s.popTimer = 0
      sizes[i] = s.size
      alphas[i] = s.alpha
    }

    for (let i = 0; i < n; i++) {
      const s = state.current[i]

      if (s.popTimer <= 0 && s.holdTimer <= 0) {
        // Rising — two-harmonic wobble keeps the path organic.
        pos[i * 3 + 1] += s.speed * dt * 0.5
        pos[i * 3] +=
          Math.sin(t * 0.5 + s.phase) * s.wobble * dt +
          Math.sin(t * 1.3 + s.phase * 2.1) * s.wobble2 * dt * 0.6
        pos[i * 3 + 2] +=
          Math.cos(t * 0.4 + s.phase * 1.3) * s.wobble * dt * 0.6 +
          Math.cos(t * 1.1 + s.phase * 0.7) * s.wobble2 * dt * 0.4
        sizes[i] = s.size * (1 + Math.sin(t * 0.3 + s.phase) * 0.12)
        alphas[i] = s.alpha

        if (pos[i * 3 + 1] >= SURFACE_Y) {
          s.holdTimer = SURFACE_HOLD
          pos[i * 3 + 1] = SURFACE_Y
        }
      } else if (s.holdTimer > 0) {
        // Held at the surface — slight lateral drift before bursting.
        s.holdTimer -= dt
        pos[i * 3] += Math.sin(t * 0.8 + s.phase) * 0.06 * dt
        if (s.holdTimer <= 0) {
          s.popTimer = POP_DURATION
          pos[i * 3 + 1] = SURFACE_Y
        }
      } else {
        // Popping — shrinks and fades out.
        s.popTimer -= dt
        const k = Math.max(s.popTimer / POP_DURATION, 0)
        sizes[i] = s.size * 1.15 * k
        alphas[i] = s.alpha * k * k
        if (s.popTimer <= 0) respawn(i)
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.attributes.aSize.needsUpdate = true
    ref.current.geometry.attributes.aAlpha.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} />
}
