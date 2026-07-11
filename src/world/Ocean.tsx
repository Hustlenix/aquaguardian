'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function OceanSurface() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    gradient.addColorStop(0, '#1A6B8A')
    gradient.addColorStop(0.15, '#0F4A6B')
    gradient.addColorStop(0.35, '#082A40')
    gradient.addColorStop(0.6, '#041525')
    gradient.addColorStop(1, '#010B13')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 4, 512)
    const tex = new THREE.CanvasTexture(canvas)
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearFilter
    return tex
  }, [])

  return (
    <mesh>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}
