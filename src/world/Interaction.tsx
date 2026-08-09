'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { debrisPositions, debrisRegistry } from './Seabed'
import { setForcedTarget } from './Robot'
import { useStore } from '@/store/useStore'
import { ensureAudio } from '@/lib/audio'

/**
 * Click-to-collect — raycasts pointer hits against the visible debris meshes
 * and hands the winning item to the robot's collection cycle via
 * `setForcedTarget`. Also renders a small cyan ripple at the click point.
 *
 * Only active on the hero section at high quality; the canvas wrapper gets
 * pointer events from World.tsx, and the HUD/sections sit above it.
 */

const RIPPLE_LIFE = 0.85

export default function Interaction() {
  const { gl, camera, raycaster } = useThree()
  const quality = useStore((s) => s.quality)
  const activeSection = useStore((s) => s.activeSection)
  const rippleRef = useRef<THREE.Mesh>(null)
  const rippleMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const ripple = useRef({ active: false, born: 0, pos: new THREE.Vector3() })

  useEffect(() => {
    const el = gl.domElement
    const onPointerDown = (e: PointerEvent) => {
      if (quality <= 0.75 || activeSection !== 'hero') return
      // Any interaction can unlock audio — the HUD mute stays in control.
      ensureAudio()
      const ndc = new THREE.Vector2(
        (e.clientX / el.clientWidth) * 2 - 1,
        -(e.clientY / el.clientHeight) * 2 + 1
      )
      raycaster.setFromCamera(ndc, camera)
      const targets: THREE.Mesh[] = []
      for (const h of debrisRegistry) {
        if (h.mesh && h.mesh.visible) targets.push(h.mesh)
      }
      if (targets.length === 0) return
      const hits = raycaster.intersectObjects(targets, false)
      if (hits.length === 0) return
      const mesh = hits[0].object as THREE.Mesh
      const index = debrisRegistry.findIndex((h) => h.mesh === mesh)
      if (index < 0) return
      const d = debrisPositions[index]
      if (!d) return
      setForcedTarget(index, d.x, d.y, d.z)
      // Ripple feedback at the clicked spot.
      ripple.current.active = true
      ripple.current.born = performance.now()
      ripple.current.pos.copy(hits[0].point)
      if (rippleRef.current) rippleRef.current.visible = true
    }
    el.addEventListener('pointerdown', onPointerDown)
    return () => el.removeEventListener('pointerdown', onPointerDown)
  }, [gl, camera, raycaster, quality, activeSection])

  useFrame(() => {
    const r = ripple.current
    if (!r.active) return
    const age = (performance.now() - r.born) / 1000
    if (age >= RIPPLE_LIFE) {
      r.active = false
      if (rippleRef.current) rippleRef.current.visible = false
      return
    }
    const k = age / RIPPLE_LIFE
    if (rippleRef.current) {
      rippleRef.current.position.copy(r.pos)
      rippleRef.current.scale.setScalar(0.15 + k * 1.5)
    }
    if (rippleMatRef.current) {
      rippleMatRef.current.opacity = 0.4 * (1 - k)
    }
  })

  return (
    <mesh ref={rippleRef} visible={false} renderOrder={10}>
      <ringGeometry args={[0.9, 1, 24]} />
      <meshBasicMaterial
        ref={rippleMatRef}
        color="#00E5FF"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
