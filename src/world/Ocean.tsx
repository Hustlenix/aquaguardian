'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import {
  oceanGradientVertexShader,
  oceanGradientFragmentShader,
} from '@/shaders/oceanGradient'
import { OCEAN_COLORS } from '@/lib/constants'

interface OceanSurfaceProps {
  topColor?: string
  /** 0..1 — how far the bright surface color reaches down the water column. */
  clarity?: number
}

export default function OceanSurface({ topColor = '#1A6B8A', clarity = 0.8 }: OceanSurfaceProps) {
  const quality = useStore((s) => s.quality)
  const fogColor = useStore((s) => s.sceneState.lighting.fogColor)

  // High segment count only at high quality; lower on mobile/medium.
  const segments = useMemo(() => (quality > 0.75 ? 96 : 48), [quality])

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(120, 120, segments, segments),
    [segments]
  )

  // Derived colors: the mid stop sits between the surface color and the
  // abyss; haze matches the scene fog so the surface melts into the depths.
  const derived = useMemo(
    () => ({
      mid: new THREE.Color(topColor).lerp(new THREE.Color(OCEAN_COLORS.deep), 0.55),
      sun: new THREE.Color(OCEAN_COLORS.sun),
      haze: new THREE.Color(fogColor),
    }),
    [topColor, fogColor]
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
        uMidColor: { value: derived.mid },
        uDeepColor: { value: new THREE.Color(OCEAN_COLORS.deep) },
        uSunColor: { value: derived.sun },
        uHazeColor: { value: derived.haze },
        uHazeDensity: { value: 0.045 },
        uLightDir: { value: new THREE.Vector3(0.4, 0.9, -0.25).normalize() },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    return m
  }, [topColor, clarity, derived])

  // Keep the surface colors in sync with scene-state driven changes.
  useEffect(() => {
    ;(material.uniforms.uTopColor.value as THREE.Color).set(topColor)
    ;(material.uniforms.uMidColor.value as THREE.Color).copy(derived.mid)
  }, [material, topColor, derived])

  useEffect(() => {
    material.uniforms.uClarity.value = clarity
  }, [material, clarity])

  useEffect(() => {
    ;(material.uniforms.uHazeColor.value as THREE.Color).copy(derived.haze)
  }, [material, derived])

  // Clean up WebGL resources to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

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
