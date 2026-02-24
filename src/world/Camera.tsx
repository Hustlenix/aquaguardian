'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { useStore } from '@/store/useStore'
import { sectionCameraPaths } from '@/data/sectionCameraPaths'
import * as THREE from 'three'

export default function CameraRig() {
  const { camera } = useThree()
  const activeSection = useStore((s) => s.activeSection)
  const target = useRef({ pos: new THREE.Vector3(0, 1, 8), look: new THREE.Vector3(0, -0.5, -3) })
  const current = useRef({ pos: new THREE.Vector3(0, 1, 8), look: new THREE.Vector3(0, -0.5, -3) })
  const timeRef = useRef(0)

  const path = sectionCameraPaths[activeSection]

  useFrame((state, delta) => {
    timeRef.current += delta * 0.5

    target.current.pos.set(path.position[0], path.position[1], path.position[2])
    target.current.look.set(path.lookAt[0], path.lookAt[1], path.lookAt[2])

    current.current.pos.lerp(target.current.pos, delta * 1.2)
    current.current.look.lerp(target.current.look, delta * 1.2)

    const breathe = Math.sin(timeRef.current * 0.3) * 0.015
    camera.position.copy(current.current.pos)
    camera.position.y += breathe
    camera.lookAt(current.current.look)
  })

  return null
}
