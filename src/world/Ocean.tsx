'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function Ocean() {
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    gradient.addColorStop(0, '#0A3A5C')
    gradient.addColorStop(0.2, '#041425')
    gradient.addColorStop(0.5, '#020B15')
    gradient.addColorStop(1, '#010B13')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 4, 512)
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    return texture
  }, [])

  return (
    <>
      {/* Ocean gradient background */}
      <mesh>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={gradientTexture} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Test object — gold sphere at origin, remove after confirming Canvas works */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.2} />
      </mesh>
    </>
  )
}
