'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const POP_DURATION = 0.4
const SURFACE_Y = 7.2

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

export default function Bubbles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const baseSizes = useRef<number[]>([])
  const speeds = useRef<number[]>([])
  const phases = useRef<number[]>([])
  const popTimers = useRef<number[]>([])

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const alphas = new Float32Array(count)
    baseSizes.current = []
    speeds.current = []
    phases.current = []
    popTimers.current = []

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = -3.5 - Math.random() * 1.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
      const size = 0.03 + Math.random() * 0.12
      sizes[i] = size
      alphas[i] = 1
      baseSizes.current.push(size)
      speeds.current.push(0.3 + Math.random() * 1.8)
      phases.current.push(Math.random() * Math.PI * 2)
      popTimers.current.push(0)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    return geo
  }, [count])

  // Dispose of geometry when count changes or on unmount to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

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

  // Dispose of material on unmount to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  useEffect(() => {
    material.uniforms.uOpacity.value = 0.3
  }, [material])

  useFrame((state, delta) => {
    if (!ref.current) return

    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const sizes = ref.current.geometry.attributes.aSize.array as Float32Array
    const alphas = ref.current.geometry.attributes.aAlpha.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      if (popTimers.current[i] <= 0) {
        pos[i * 3 + 1] += speeds.current[i] * delta * 0.5
        pos[i * 3] += Math.sin(t * 0.5 + phases.current[i]) * delta * 0.15
        pos[i * 3 + 2] += Math.cos(t * 0.4 + phases.current[i] * 1.3) * delta * 0.08
        sizes[i] = baseSizes.current[i] * (1 + Math.sin(t * 0.3 + i) * 0.12)
        alphas[i] = 1

        if (pos[i * 3 + 1] > SURFACE_Y) {
          popTimers.current[i] = POP_DURATION
          pos[i * 3 + 1] = SURFACE_Y
        }
      } else {
        popTimers.current[i] -= delta
        const k = Math.max(popTimers.current[i] / POP_DURATION, 0)
        sizes[i] = baseSizes.current[i] * 1.1 * k
        alphas[i] = k * k

        if (popTimers.current[i] <= 0) {
          pos[i * 3] = (Math.random() - 0.5) * 18
          pos[i * 3 + 1] = -3.5 - Math.random() * 1.5
          pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
          baseSizes.current[i] = 0.03 + Math.random() * 0.12
          speeds.current[i] = 0.3 + Math.random() * 1.8
          alphas[i] = 1
        }
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.attributes.aSize.needsUpdate = true
    ref.current.geometry.attributes.aAlpha.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} />
}
