'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { waterCausticsVertexShader, waterCausticsFragmentShader } from '@/shaders/waterCaustics'

interface CausticsProps {
  color?: string
  opacity?: number
}

/**
 * Animated procedural caustics projected onto the seabed.
 * A big flat plane just above the floor with an animated sum-of-abs-sines
 * caustic pattern; the pattern is procedural in the fragment shader so the
 * plane stays cheap even at high quality. The plane drifts, rotates and
 * the cell scale breathes so the light never reads as a frozen decal.
 */
export default function Caustics({ color = '#7FD4E8', opacity = 0.22 }: CausticsProps) {
  const quality = useStore((s) => s.quality)
  const meshRef = useRef<THREE.Mesh>(null)

  // High segment count only at high quality; lower on mobile/medium.
  const segments = useMemo(() => (quality > 0.75 ? 96 : 32), [quality])

  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 48, segments, segments), [segments])

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader: waterCausticsVertexShader,
      fragmentShader: waterCausticsFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uColor: { value: new THREE.Color(color) },
        uWarmColor: { value: new THREE.Color('#D4AF37') },
        uOpacity: { value: opacity },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    return m
  }, [color, opacity])

  // Keep the tint in sync with scene-state driven color changes.
  useEffect(() => {
    ;(material.uniforms.uColor.value as THREE.Color).set(color)
  }, [material, color])

  useEffect(() => {
    material.uniforms.uOpacity.value = opacity
  }, [material, opacity])

  // Clean up imperatively allocated WebGL resources to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    material.uniforms.uTime.value = t
    // Cell scale breathes only slightly — the sun-angle drift in the shader
    // now carries the motion, so heavy breathing would fight it.
    material.uniforms.uScale.value = 0.95 + Math.sin(t * 0.12) * 0.05
    if (meshRef.current) {
      // Imperceptible drift + rotation — living light, not a static decal.
      meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.015
      meshRef.current.position.x = Math.sin(t * 0.03) * 0.4
      meshRef.current.position.z = -6 + Math.cos(t * 0.025) * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, -3.55, -6]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={1}
    />
  )
}
