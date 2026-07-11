'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export default function CameraRig() {
  const { camera } = useThree()
  const timeRef = useRef(0)
  const initialPos = useRef<{ x: number; y: number; z: number } | null>(null)

  useFrame((state, delta) => {
    if (!initialPos.current) {
      initialPos.current = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    }
    timeRef.current += delta
    const breathe = Math.sin(timeRef.current * 0.3) * 0.03
    camera.position.y = (initialPos.current?.y ?? 1) + breathe
    camera.lookAt(0, 0, 0)
  })

  return null
}
