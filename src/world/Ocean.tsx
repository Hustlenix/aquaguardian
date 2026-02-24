'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function OceanSurface({ topColor = '#1A6B8A' }: { topColor?: string }) {
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

  return (
    <mesh>
      <planeGeometry args={[120, 120]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}
