'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightRaysProps {
  color?: string
  opacity?: number
}

export default function LightRays({ color = '#88CCFF', opacity = 0.12 }: LightRaysProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rayColor = useMemo(
    () => new THREE.Color(color).lerp(new THREE.Color('#FFFFFF'), 0.3),
    [color]
  )

  // Vertical alpha fade: transparent at the apex, full in the middle, soft at the base.
  const textures = useMemo(() => {
    const make = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 256
      const ctx = canvas.getContext('2d')!
      const grad = ctx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(0.2, 'rgba(255,255,255,1)')
      grad.addColorStop(0.75, 'rgba(255,255,255,0.85)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 256)
      return new THREE.CanvasTexture(canvas)
    }
    return [make(), make()]
  }, [])

  const configs = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: (Math.random() - 0.5) * 22,
        z: (Math.random() - 0.5) * 18 - 2,
        width: 0.2 + Math.random() * 0.7,
        height: 5 + Math.random() * 11,
        rotOffset: (Math.random() - 0.5) * 0.2,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as THREE.Mesh
      const cfg = configs[i]
      const sway = Math.sin(t * cfg.speed + cfg.phase) * 0.035
      mesh.position.x = cfg.x + Math.sin(t * cfg.speed * 0.5 + cfg.phase) * 0.4
      mesh.position.y =
        -1.2 + cfg.height / 2 + Math.sin(t * cfg.speed * 0.4 + cfg.phase * 1.7) * 0.15
      mesh.rotation.z = cfg.rotOffset + sway
      mesh.rotation.y = Math.sin(t * cfg.speed * 0.3 + cfg.phase) * 0.06
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = opacity * (0.65 + Math.sin(t * cfg.speed * 0.35 + cfg.phase) * 0.25)
    }
  })

  return (
    <group ref={groupRef}>
      {configs.map((c, i) => (
        <mesh key={i} position={[c.x, -1.5 + c.height / 2, c.z]} rotation={[0, 0, c.rotOffset]}>
          <planeGeometry args={[c.width, c.height]} />
          <meshBasicMaterial
            map={textures[i % 2]}
            color={rayColor}
            transparent
            opacity={opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
