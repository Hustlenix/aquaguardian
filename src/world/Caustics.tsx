'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import {
  waterCausticsVertexShader,
  waterCausticsFragmentShader,
} from '@/shaders/waterCaustics'

interface CausticsProps {
  intensity?: number
}

// Big flat additive plane with an animated procedural caustic pattern,
// projected onto the seabed. Tint follows the scene-state theming
// (lightRayColor mixed toward cyan).
export default function Caustics({ intensity = 0.35 }: CausticsProps) {
  const sceneState = useStore((s) => s.sceneState)
  const quality = useStore((s) => s.quality)

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader: waterCausticsVertexShader,
      fragmentShader: waterCausticsFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#7FDFFF') },
        uOpacity: { value: 0.35 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    return m
  }, [])

  // Scene-state-driven tint: base the caustics on the section's ray color,
  // pulled toward a cool cyan so it always reads as water light.
  useEffect(() => {
    const tint = new THREE.Color(sceneState.environment.lightRayColor)
    tint.lerp(new THREE.Color('#7FDFFF'), 0.5)
    ;(material.uniforms.uColor.value as THREE.Color).copy(tint)
  }, [material, sceneState.environment.lightRayColor])

  // Softer caustics on low quality tiers.
  useEffect(() => {
    const op = quality > 0.75 ? intensity : intensity * 0.55
    material.uniforms.uOpacity.value = op
  }, [material, intensity, quality])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh position={[0, -3.82, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[42, 28]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
