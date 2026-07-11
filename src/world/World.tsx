'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Suspense } from 'react'
import Ocean from './Ocean'
import CameraRig from './Camera'
import Lighting from './Lighting'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useStore } from '@/store/useStore'

function SceneContent() {
  return (
    <Suspense fallback={null}>
      <Ocean />
      <CameraRig />
      <Lighting />
    </Suspense>
  )
}

export default function World() {
  const { setQuality } = useStore()

  return (
    <ErrorBoundary>
      <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 1, 10], fov: 60, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={(state) => {
            state.gl.setClearColor('#010B13')
            console.log('Canvas created successfully')
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
