'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import {
  oceanGradientVertexShader,
  oceanGradientFragmentShader,
} from '@/shaders/oceanGradient'

interface OceanSurfaceProps {
  topColor?: string
  /** 0..1 — how far the bright surface color reaches down the water column. */
  clarity?: number
}

export default function OceanSurface({ topColor = '#1A6B8A', clarity = 0.8 }: OceanSurfaceProps) {
  const quality = useStore((s) => s.quality)

  // High segment count only at high quality; lower on mobile/medium.
  const segments = useMemo(() => (quality > 0.75 ? 96 : 48), [quality])

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(120, 120, segments, segments),
    [segments]
  )

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader: oceanGradientVertexShader,
      fragmentShader: oceanGradientFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 1 },
        uClarity: { value: clarity },
        uTopColor: { value: new THREE.Color(topColor) },
        uDeepColor: { value: new THREE.Color('#010B13') },
        uLightDir: { value: new THREE.Vector3(0.4, 0.9, -0.25).normalize() },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    return m
  }, [topColor, clarity])

  // Prevent memory leaks by disposing of imperatively created ThreeJS resources on unmount or change.
  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  // Keep the surface color in sync with scene-state driven color changes.
  useEffect(() => {
    ;(material.uniforms.uTopColor.value as THREE.Color).set(topColor)
  }, [material, topColor])

  useEffect(() => {
    material.uniforms.uClarity.value = clarity
  }, [material, clarity])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    material.uniforms.uTime.value = t
    // Gentle swell breathing: ±8% amplitude so the ocean feels alive, not looped.
    material.uniforms.uAmplitude.value = 1 + Math.sin(t * 0.3) * 0.08
  })

  return (
    <mesh
      position={[0, 0.5, 0]}
      geometry={geometry}
      material={material}
      renderOrder={-1}
    />
  )
}
