'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number
  color?: string
  opacity?: number
  speed?: number
}

// Per-particle twinkle & movement: sinusoidal opacity pulse and position drift with phase offset.
// Optimized: Movement calculation offloaded entirely to the GPU's vertex shader to avoid heavy CPU loop
// and costly WebGL vertex buffer uploads (needsUpdate = true) on every single frame.
const twinkleVertexShader = `
  attribute float aPhase;
  attribute float aSize;

  uniform float uTime;
  uniform float uSpeed;

  varying float vTwinkle;

  void main() {
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.4 + aPhase * 6.2831853);

    // Smooth drifting animation computed entirely on the GPU
    vec3 animatedPos = position;
    animatedPos.y += sin(uTime * uSpeed + aPhase * 6.2831853) * 0.18;
    animatedPos.x += cos(uTime * uSpeed * 0.7 + aPhase * 3.1415926) * 0.13;

    vec4 mvPosition = modelViewMatrix * vec4(animatedPos, 1.0);
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

function ParticleLayer({
  count,
  color,
  opacity,
  speed,
  sizeBase,
  spreadMul,
  yRange,
  yOffset,
}: ParticlesProps & {
  sizeBase: number
  spreadMul: number
  yRange: [number, number]
  yOffset: number
}) {
  const ref = useRef<THREE.Points>(null)
  const safeCount = Math.max(1, count ?? 200)
  const safeOpacity = opacity ?? 0.4
  const safeSpeed = Math.max(0.001, speed ?? 0.3)

  const geometry = useMemo(() => {
    const pos = new Float32Array(safeCount * 3)
    const sizes = new Float32Array(safeCount)
    const phases = new Float32Array(safeCount)

    for (let i = 0; i < safeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50 * spreadMul
      pos[i * 3 + 1] = yRange[0] + Math.random() * (yRange[1] - yRange[0]) + yOffset
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 * spreadMul - 5
      sizes[i] = sizeBase * (0.5 + Math.random() * 1)
      phases[i] = Math.random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return geo
  }, [safeCount, sizeBase, spreadMul, yRange, yOffset])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: twinkleVertexShader,
        fragmentShader: twinkleFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: safeSpeed },
          uColor: { value: new THREE.Color(color ?? '#88BBDD') },
          uOpacity: { value: safeOpacity },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, safeOpacity, safeSpeed]
  )

  useEffect(() => {
    ;(material.uniforms.uColor.value as THREE.Color).set(color ?? '#88BBDD')
  }, [material, color])

  useEffect(() => {
    material.uniforms.uOpacity.value = safeOpacity
  }, [material, safeOpacity])

  // Single uniform update per frame instead of 700-iteration CPU loop and buffer re-upload
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <points ref={ref} geometry={geometry} material={material} />
  )
}

export default function Particles(props: ParticlesProps) {
  return (
    <group>
      <ParticleLayer {...props} sizeBase={0.08} spreadMul={1.2} yRange={[-3, 12]} yOffset={0} />
      <ParticleLayer
        {...props}
        count={Math.round((props.count ?? 200) * 2.5)}
        sizeBase={0.03}
        spreadMul={1.5}
        yRange={[-5, 15]}
        yOffset={0}
        opacity={(props.opacity ?? 0.4) * 0.35}
        speed={(props.speed ?? 0.3) * 0.5}
        color="#88BBDD"
      />
    </group>
  )
}
