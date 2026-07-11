'use client'

import { useMemo } from 'react'
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

export default function Lighting({
  ambientIntensity = 0.4,
  ambientColor = '#B8D4E3',
  directionalIntensity = 1,
  directionalColor = '#B8D4E3',
  directionalPosition = [5, 10, -5],
  pointIntensity = 0.5,
  pointColor = '#D4AF37',
}: LightingProps) {
  const dColor = useMemo(() => new THREE.Color(directionalColor), [directionalColor])
  const aColor = useMemo(() => new THREE.Color(ambientColor), [ambientColor])
  const pColor = useMemo(() => new THREE.Color(pointColor), [pointColor])

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={aColor} />
      <directionalLight
        position={directionalPosition}
        intensity={directionalIntensity}
        color={dColor}
      />
      <pointLight position={[0, 5, 0]} intensity={pointIntensity} color={pColor} />
      <pointLight position={[-3, 0, 2]} intensity={0.3} color="#00E5FF" />
    </>
  )
}
