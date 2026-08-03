'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SceneState } from '@/types'

interface EnvironmentProps {
  sceneState: SceneState
}

export default function Environment({ sceneState }: EnvironmentProps) {
  const fogSettings = useMemo(() => {
    const fog = sceneState.lighting
    return {
      color: new THREE.Color(fog.fogColor),
      near: fog.fogNear,
      far: fog.fogFar,
    }
  }, [sceneState])

  useFrame(({ scene }) => {
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(fogSettings.color)
      scene.fog.near = fogSettings.near
      scene.fog.far = fogSettings.far
    }
  })

  const particleGeo = useMemo(() => {
    const positions = new Float32Array(300)
    for (let i = 0; i < 300; i++) {
      positions[i] = (Math.random() - 0.5) * 30
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  // Clean up geometry on unmount to prevent WebGL memory leaks.
  useEffect(() => {
    return () => {
      particleGeo.dispose()
    }
  }, [particleGeo])

  return (
    <points geometry={particleGeo}>
      <pointsMaterial
        size={0.03}
        color="#88CCFF"
        transparent
        opacity={0.08}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
