'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import OceanSurface from './Ocean'
import CameraRig from './Camera'
import Lighting from './Lighting'
import Particles from './Particles'
import Bubbles from './Bubbles'
import Coral from './Coral'
import Seabed from './Seabed'
import LightRays from './LightRays'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useStore } from '@/store/useStore'

function SceneContent() {
  return (
    <>
      <color attach="background" args={['#010B13']} />
      <fog attach="fog" args={['#041525', 8, 25]} />
      <Suspense fallback={null}>
        <OceanSurface />
        <Seabed />
        <Coral />
        <LightRays />
        <Particles />
        <Bubbles />
        <CameraRig />
        <Lighting />
      </Suspense>
    </>
  )
}

export default function World() {
  const { setQuality } = useStore()

  return (
    <ErrorBoundary>
      <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 1, 8], fov: 60, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={(state) => {
            state.gl.setClearColor('#010B13')
          }}
          onError={(err) => console.error('Canvas error:', err)}
        >
          <AdaptiveDpr pixelated />
          <PerformanceMonitor
            onDecline={() => setQuality(0.75)}
            onFallback={() => setQuality(0.5)}
          />
          <SceneContent />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
