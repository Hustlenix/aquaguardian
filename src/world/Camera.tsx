'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { sectionCameraPaths } from '@/data/sectionCameraPaths'
import * as THREE from 'three'

const TOUCH_MAX = 0.35

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

  // Touch-drag parallax: accumulated single-finger drag offset (clamped),
  // eased back to zero when the finger lifts. The 3D canvas sits behind the
  // page (pointer-events: none), so we listen on window — this is what makes
  // the background feel alive on phones.
  const touchGoal = useRef(new THREE.Vector2(0, 0))
  const touchCurrent = useRef(new THREE.Vector2(0, 0))
  const lastTouch = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    const onMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !lastTouch.current) return
      const dx = e.touches[0].clientX - lastTouch.current.x
      const dy = e.touches[0].clientY - lastTouch.current.y
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      touchGoal.current.x = Math.max(-TOUCH_MAX, Math.min(TOUCH_MAX, touchGoal.current.x + dx * 0.003))
      touchGoal.current.y = Math.max(-TOUCH_MAX, Math.min(TOUCH_MAX, touchGoal.current.y + dy * 0.003))
    }
    const onEnd = () => {
      lastTouch.current = null
      touchGoal.current.set(0, 0)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [])

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

    // Portrait phones: widen the FOV slightly and push the camera back so the
    // scene fills the tall frame nicely (smoothly re-evaluated on rotate).
    const isPortrait = state.size.height > state.size.width
    const portraitFovBonus = isPortrait ? 8 : 0
    const portraitPushBack = isPortrait ? 1.15 : 1

    target.current.pos.set(path.position[0], path.position[1], path.position[2] * portraitPushBack)
    target.current.look.set(path.lookAt[0], path.lookAt[1], path.lookAt[2])
    target.current.fov = (path.fov ?? 60) + portraitFovBonus

    current.current.pos.lerp(target.current.pos, dampFactor)
    current.current.look.lerp(target.current.look, dampFactor)
    current.current.fov += (target.current.fov - current.current.fov) * dampFactor * 0.5

    // Touch offset eases toward its goal (0 when not touching).
    touchCurrent.current.lerp(touchGoal.current, 1 - Math.exp(-4 * delta))

    const breathe = Math.sin(t * 0.3) * 0.015
    const swayX = Math.sin(t * 0.15) * 0.003
    const swayZ = Math.cos(t * 0.2) * 0.003

    const parallaxX = pointer.x * 0.015
    const parallaxY = pointer.y * 0.008

    camera.position.copy(current.current.pos)
    camera.position.y += breathe
    camera.position.x += swayX + parallaxX + touchCurrent.current.x * 0.6
    camera.position.z += swayZ + parallaxY * 0.3 + Math.abs(touchCurrent.current.y) * 0.2

    const lookTarget = new THREE.Vector3().copy(current.current.look)
    lookTarget.x += pointer.x * 0.01 + touchCurrent.current.x * 0.3
    lookTarget.y += pointer.y * 0.006 - touchCurrent.current.y * 0.2
    camera.lookAt(lookTarget)

    const perspCam = camera as THREE.PerspectiveCamera
    perspCam.fov += (current.current.fov - perspCam.fov) * dampFactor * 1.5
    perspCam.updateProjectionMatrix()
  })

  return null
}
