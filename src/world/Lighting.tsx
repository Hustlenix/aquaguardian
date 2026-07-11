'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightingProps {
  ambientIntensity?: number
  ambientColor?: string
  directionalIntensity?: number
  directionalColor?: string
  directionalPosition?: [number, number, number]
  pointIntensity?: number
  pointColor?: string
}

function CausticPattern({ intensity = 0.3 }: { intensity?: number }) {
  const ref = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const r = 8 + Math.random() * 24
      const alpha = 0.02 + Math.random() * 0.06
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`
      ctx.fill()
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(8, 4)
    return tex
  }, [])

  useFrame((state) => {
    if (ref.current) {
      texture.offset.x += Math.sin(state.clock.elapsedTime * 0.08) * 0.002
      texture.offset.y += Math.cos(state.clock.elapsedTime * 0.06) * 0.002
    }
  })

  if (intensity < 0.05) return null

  return (
    <mesh
      ref={ref}
      position={[0, 8, -3]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[25, 25, 1]}
    >
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={intensity * 0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Lighting({
  ambientIntensity = 0.4,
  ambientColor = '#B8D4E3',
  directionalIntensity = 1,
  directionalColor = '#B8D4E3',
  directionalPosition = [5, 10, -5],
  pointIntensity = 0.5,
  pointColor = '#D4AF37',
}: LightingProps) {
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const dColor = useMemo(() => new THREE.Color(directionalColor), [directionalColor])
  const aColor = useMemo(() => new THREE.Color(ambientColor), [ambientColor])
  const pColor = useMemo(() => new THREE.Color(pointColor), [pointColor])
  const skyColor = useMemo(() => new THREE.Color(ambientColor), [ambientColor])
  const groundColor = useMemo(() => new THREE.Color('#010B13'), [])

  useFrame((state) => {
    if (dirRef.current) {
      const t = state.clock.elapsedTime
      dirRef.current.position.x = directionalPosition[0] + Math.sin(t * 0.05) * 1.5
      dirRef.current.position.z = directionalPosition[2] + Math.cos(t * 0.04) * 1.5
    }
  })

  return (
    <>
      <hemisphereLight
        intensity={ambientIntensity * 0.7}
        color={skyColor}
        groundColor={groundColor}
      />
      <ambientLight intensity={ambientIntensity * 0.3} color={aColor} />
      <directionalLight
        ref={dirRef}
        position={directionalPosition}
        intensity={directionalIntensity}
        color={dColor}
        castShadow={false}
      />
      <pointLight position={[0, 5, 0]} intensity={pointIntensity} color={pColor} distance={20} decay={1.5} />
      <pointLight position={[-3, 0, 2]} intensity={0.3} color="#00E5FF" distance={12} decay={1} />

      {/* Rim backlight for silhouette definition */}
      <pointLight position={[-8, -2, -12]} intensity={0.5} color="#4A8AAA" distance={15} decay={1} />
      <pointLight position={[8, -1, -10]} intensity={0.3} color="#6AA0B0" distance={12} decay={1} />

      {/* Caustic projection */}
      <CausticPattern intensity={directionalIntensity * 0.15} />
    </>
  )
}
