'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { volumetricLightVertexShader, volumetricLightFragmentShader } from '@/shaders/volumetricLight'

interface LightRaysProps {
  color?: string
  opacity?: number
}

interface RayConfig {
  x: number
  z: number
  radius: number
  height: number
  yTop: number
  tiltX: number
  tiltZ: number
  phase: number
  speed: number
}

export default function LightRays({ color = '#88CCFF', opacity = 0.12 }: LightRaysProps) {
  const quality = useStore((s) => s.quality)
  const groupRef = useRef<THREE.Group>(null)
  const rayColor = useMemo(
    () => new THREE.Color(color).lerp(new THREE.Color('#FFFFFF'), 0.25),
    [color]
  )

  const radialSegments = useMemo(() => (quality > 0.75 ? 24 : 12), [quality])

  const configs = useMemo<RayConfig[]>(
    () =>
      Array.from({ length: 6 }, () => ({
        x: (Math.random() - 0.5) * 20,
        z: -2 - Math.random() * 10,
        radius: 0.35 + Math.random() * 0.65,
        height: 8 + Math.random() * 8,
        yTop: 5.5 + Math.random() * 2,
        tiltX: (Math.random() - 0.5) * 0.12,
        tiltZ: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.2,
      })),
    []
  )

  // One material per ray so each shaft can pulse its own opacity.
  const materials = useMemo(
    () =>
      configs.map((c) => {
        const m = new THREE.ShaderMaterial({
          vertexShader: volumetricLightVertexShader,
          fragmentShader: volumetricLightFragmentShader,
          uniforms: {
            uColor: { value: rayColor.clone() },
            uOpacity: { value: opacity },
            uCoreWidth: { value: 1.6 + Math.random() * 1.2 },
            uRadius: { value: c.radius },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        })
        return m
      }),
    [configs, rayColor, opacity]
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as THREE.Mesh
      const cfg = configs[i]
      // Slow, drifting sway — god rays bending in the current.
      mesh.rotation.x = cfg.tiltX + Math.cos(t * cfg.speed * 0.7 + cfg.phase) * 0.02
      mesh.rotation.z = cfg.tiltZ + Math.sin(t * cfg.speed + cfg.phase) * 0.025
      mesh.position.x = cfg.x + Math.sin(t * cfg.speed * 0.5 + cfg.phase) * 0.5
      mesh.position.y =
        cfg.yTop - cfg.height / 2 + Math.sin(t * cfg.speed * 0.4 + cfg.phase * 1.7) * 0.15
      const mat = mesh.material as THREE.ShaderMaterial
      mat.uniforms.uOpacity.value = opacity * (0.65 + Math.sin(t * cfg.speed * 0.8 + cfg.phase) * 0.3)
    }
  })

  return (
    <group ref={groupRef}>
      {configs.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, c.yTop - c.height / 2, c.z]}
          rotation={[c.tiltX, 0, c.tiltZ]}
          material={materials[i]}
        >
          {/* openEnded so the base cap (which would break the shader fade) is omitted */}
          <coneGeometry args={[c.radius, c.height, radialSegments, 1, true]} />
        </mesh>
      ))}
    </group>
  )
}
