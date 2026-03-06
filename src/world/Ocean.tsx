'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function OceanSurface({ topColor = '#1A6B8A' }: { topColor?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    gradient.addColorStop(0, topColor)
    gradient.addColorStop(0.1, '#0F4A6B')
    gradient.addColorStop(0.3, '#082A40')
    gradient.addColorStop(0.5, '#041525')
    gradient.addColorStop(1, '#010B13')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 4, 512)
    const tex = new THREE.CanvasTexture(canvas)
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearFilter
    return tex
  }, [topColor])

  useFrame((state) => {
    if (!ref.current) return
    timeRef.current += state.clock.getDelta()
    const t = timeRef.current
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]
      const wave1 = Math.sin(x * 0.3 + t * 0.4) * 0.08
      const wave2 = Math.cos(z * 0.25 + t * 0.3) * 0.06
      const wave3 = Math.sin((x + z) * 0.15 + t * 0.2) * 0.04
      positions[i + 1] = (wave1 + wave2 + wave3)
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <planeGeometry args={[120, 120, 80, 80]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}
