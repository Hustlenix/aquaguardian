'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { useStore } from '@/store/useStore'
import { sectionCameraPaths } from '@/data/sectionCameraPaths'
import * as THREE from 'three'

export default function CameraRig() {
  const { camera, pointer } = useThree()
  const activeSection = useStore((s) => s.activeSection)
  const path = sectionCameraPaths[activeSection]

  const target = useRef({
    pos: new THREE.Vector3(path.position[0], path.position[1], path.position[2]),
    look: new THREE.Vector3(path.lookAt[0], path.lookAt[1], path.lookAt[2]),
    fov: path.fov ?? 60,
  })

  const current = useRef({
    pos: new THREE.Vector3(path.position[0], path.position[1], path.position[2]),
    look: new THREE.Vector3(path.lookAt[0], path.lookAt[1], path.lookAt[2]),
    fov: path.fov ?? 60,
  })

  const timeRef = useRef(0)
  const prevSection = useRef(activeSection)

  useFrame((state, delta) => {
    timeRef.current += delta * 0.5
    const t = timeRef.current

    const lerpSpeed = path.lerpSpeed ?? 1.2
    const dampFactor = 1 - Math.exp(-lerpSpeed * delta * 2.5)

    if (prevSection.current !== activeSection) {
      timeRef.current = 0
      prevSection.current = activeSection
    }

    target.current.pos.set(path.position[0], path.position[1], path.position[2])
    target.current.look.set(path.lookAt[0], path.lookAt[1], path.lookAt[2])
    target.current.fov = path.fov ?? 60

    current.current.pos.lerp(target.current.pos, dampFactor)
    current.current.look.lerp(target.current.look, dampFactor)
    current.current.fov += (target.current.fov - current.current.fov) * dampFactor * 0.5

    const breathe = Math.sin(t * 0.3) * 0.015
    const swayX = Math.sin(t * 0.15) * 0.003
    const swayZ = Math.cos(t * 0.2) * 0.003

    const parallaxX = pointer.x * 0.015
    const parallaxY = pointer.y * 0.008

    camera.position.copy(current.current.pos)
    camera.position.y += breathe
    camera.position.x += swayX + parallaxX
    camera.position.z += swayZ + parallaxY * 0.3

    const lookTarget = new THREE.Vector3().copy(current.current.look)
    lookTarget.x += pointer.x * 0.01
    lookTarget.y += pointer.y * 0.006
    camera.lookAt(lookTarget)

    const perspCam = camera as THREE.PerspectiveCamera
    perspCam.fov += (current.current.fov - perspCam.fov) * dampFactor * 1.5
    perspCam.updateProjectionMatrix()
  })

  return null
}
