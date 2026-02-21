'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 200 }) {
  const ref = useRef<THREE.Points>(null)

  const { geometry } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const size = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30 + 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      size[i] = Math.random() * 2 + 1
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1))
    return { positions: pos, sizes: size, geometry: geo }
  }, [count])

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(180, 220, 255, 0.8)')
    gradient.addColorStop(0.3, 'rgba(180, 220, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(180, 220, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.002
        pos[i * 3] += Math.sin(state.clock.elapsedTime * 0.15 + i * 0.5) * 0.001
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        map={texture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color="#B4DCFF"
        opacity={0.6}
      />
    </points>
  )
}
