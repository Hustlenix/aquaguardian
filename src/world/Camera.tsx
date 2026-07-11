'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function CameraRig() {
  const { camera } = useThree()
  const timeRef = useRef(0)
  const target = useRef(new THREE.Vector3(0, -0.5, -3))

  useFrame((state, delta) => {
    timeRef.current += delta * 0.5

    const breatheY = Math.sin(timeRef.current * 0.3) * 0.02
    camera.position.y = 1 + breatheY

    const lookX = Math.sin(timeRef.current * 0.1) * 0.3
    target.current.set(lookX, -0.3 + Math.sin(timeRef.current * 0.2) * 0.1, -3)
    camera.lookAt(target.current)
  })

  return null
}
