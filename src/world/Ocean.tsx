'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import {
  oceanGradientVertexShader,
  oceanGradientFragmentShader,
} from '@/shaders/oceanGradient'

export default function OceanSurface({ topColor = '#1A6B8A' }: { topColor?: string }) {
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
        uTopColor: { value: new THREE.Color(topColor) },
        uDeepColor: { value: new THREE.Color('#010B13') },
        uLightDir: { value: new THREE.Vector3(0.4, 0.9, -0.25).normalize() },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    return m
  }, [topColor])

  // Keep the surface color in sync with scene-state driven color changes.
  useEffect(() => {
    ;(material.uniforms.uTopColor.value as THREE.Color).set(topColor)
  }, [material, topColor])

  useFrame((state) => {
<<<<<<< HEAD
    if (!ref.current) return
    timeRef.current += state.clock.getDelta()
    const t = timeRef.current
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]
      const wave1 = Math.sin(x * 0.3 + t * 0.4) * 0.08
      const wave2 = Math.cos(z * 0.25 + t * 0.3) * 0.06
      const wave3 = Math.sin((x + z) * 0.15 + t * 0.2) * 0.04
      positions[i + 1] = wave1 + wave2 + wave3
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.computeVertexNormals()
=======
    material.uniforms.uTime.value = state.clock.elapsedTime
>>>>>>> 2c79eb6 (Polish README and document AI-assisted build)
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
