'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { sectionCameraPaths } from '@/data/sectionCameraPaths'
import * as THREE from 'three'

const TOUCH_MAX = 0.35

/**
 * CameraRig — cinematic scroll camera.
 *
 * - Frame-rate-independent damping (THREE.MathUtils.damp) on position,
 *   look-target and FOV, so easing is identical at any refresh rate.
 * - Section changes get a short "impulse": the damp lambda temporarily
 *   sharpens and the camera starts slightly further from the target, so
 *   chapter transitions feel deliberate but never jerk.
 * - Subtle handheld breathing, micro roll, look-at drift and pointer/touch
 *   parallax keep the frame alive without ever feeling mechanical.
 */
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
      touchGoal.current.x = Math.max(
        -TOUCH_MAX,
        Math.min(TOUCH_MAX, touchGoal.current.x + dx * 0.003),
      )
      touchGoal.current.y = Math.max(
        -TOUCH_MAX,
        Math.min(TOUCH_MAX, touchGoal.current.y + dy * 0.003),
      )
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
  // Scratch vector for the look target — no per-frame allocation.
  const lookScratch = useRef(new THREE.Vector3())
  // Section-change impulse: 1 → 0, sharpens damping and pushes the camera
  // slightly out so the transition reads as an intentional move.
  const impulse = useRef(0)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    timeRef.current += dt * 0.5
    const t = timeRef.current

    if (prevSection.current !== activeSection) {
      timeRef.current = 0
      impulse.current = 1
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

    // Impulse: momentarily sharper damping + a small overshoot offset.
    const imp = impulse.current
    impulse.current *= 1 - Math.exp(-2.2 * dt)
    const sharp = 1 + imp * 1.4

    const baseLambda = (path.lerpSpeed ?? 1.2) * 2.2
    const lambda = baseLambda * sharp
    const fovDamp = 1 - Math.exp(-lambda * 0.7 * dt)

    const cur = current.current
    const tgt = target.current

    // Overshoot: damp toward a point slightly beyond the target.
    const overX = (tgt.pos.x - cur.pos.x) * 0.1 * imp
    const overY = (tgt.pos.y - cur.pos.y) * 0.1 * imp
    const overZ = (tgt.pos.z - cur.pos.z) * 0.1 * imp

    cur.pos.x = THREE.MathUtils.damp(cur.pos.x, tgt.pos.x + overX, lambda, dt)
    cur.pos.y = THREE.MathUtils.damp(cur.pos.y, tgt.pos.y + overY, lambda, dt)
    cur.pos.z = THREE.MathUtils.damp(cur.pos.z, tgt.pos.z + overZ, lambda, dt)
    cur.look.x = THREE.MathUtils.damp(cur.look.x, tgt.look.x, lambda * 0.85, dt)
    cur.look.y = THREE.MathUtils.damp(cur.look.y, tgt.look.y, lambda * 0.85, dt)
    cur.look.z = THREE.MathUtils.damp(cur.look.z, tgt.look.z, lambda * 0.85, dt)
    cur.fov += (tgt.fov - cur.fov) * fovDamp * 1.5

    // Touch offset eases toward its goal (0 when not touching).
    touchCurrent.current.lerp(touchGoal.current, 1 - Math.exp(-4 * dt))

    // Handheld breathing — two incommensurate harmonics, very subtle.
    const breathe = Math.sin(t * 0.4) * 0.018 + Math.sin(t * 0.83 + 1.7) * 0.007
    const swayX = Math.sin(t * 0.22) * 0.005
    const swayZ = Math.cos(t * 0.31 + 0.6) * 0.005

    // Look-at drift: the gaze slowly orbits the section focus point.
    const driftX = Math.sin(t * 0.18) * 0.045
    const driftY = Math.cos(t * 0.24) * 0.03

    const parallaxX = pointer.x * 0.015
    const parallaxY = pointer.y * 0.008

    camera.position.set(cur.pos.x, cur.pos.y, cur.pos.z)
    camera.position.y += breathe
    camera.position.x += swayX + parallaxX + touchCurrent.current.x * 0.6
    camera.position.z += swayZ + parallaxY * 0.3 + Math.abs(touchCurrent.current.y) * 0.2

    // Reuse one scratch vector for the look target.
    lookScratch.current.set(cur.look.x + driftX, cur.look.y + driftY, cur.look.z)
    lookScratch.current.x += pointer.x * 0.01 + touchCurrent.current.x * 0.3
    lookScratch.current.y += pointer.y * 0.006 - touchCurrent.current.y * 0.2
    camera.lookAt(lookScratch.current)

    // Micro roll — a whisper of lens roll so the frame never feels locked.
    camera.rotateZ(Math.sin(t * 0.35) * 0.0016 + Math.sin(t * 0.71 + 2) * 0.0008)

    const perspCam = camera as THREE.PerspectiveCamera
    perspCam.fov += (cur.fov - perspCam.fov) * fovDamp * 1.5
    perspCam.updateProjectionMatrix()
  })

  return null
}
