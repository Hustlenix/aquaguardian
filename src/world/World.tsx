'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import OceanSurface from './Ocean'
import CameraRig from './Camera'
import Lighting from './Lighting'
import Particles from './Particles'
import Bubbles from './Bubbles'
import Coral from './Coral'
import Seabed from './Seabed'
import LightRays from './LightRays'
import Robot from './Robot'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useStore } from '@/store/useStore'

function SceneContent() {
  const sceneState = useStore((s) => s.sceneState)
  const { lighting, water, environment, particles: particleCfg } = sceneState

  const fogColor = useMemo(() => new THREE.Color(lighting.fogColor), [lighting.fogColor])

  return (
    <>
      <color attach="background" args={[water.topColor]} />
      <fog attach="fog" args={[fogColor, lighting.fogNear, lighting.fogFar]} />
      <Suspense fallback={null}>
        <OceanSurface topColor={water.topColor} />
        <Seabed debrisCount={environment.debrisCount} />
        <Coral intact={environment.templeIntact} />
        <LightRays color={environment.lightRayColor} opacity={environment.lightRayOpacity} />
        <Particles count={particleCfg.count} color={particleCfg.color} opacity={particleCfg.opacity} speed={particleCfg.speed} />
        <Bubbles />
        <Robot
          visible={sceneState.robot.visible}
          activated={sceneState.robot.activated}
          scale={sceneState.robot.scale}
          position={sceneState.robot.position}
          scanBeam={sceneState.robot.scanBeam}
        />
        <CameraRig />
        <Lighting
          ambientIntensity={lighting.ambientIntensity}
          ambientColor={lighting.ambientColor}
          directionalIntensity={lighting.directionalIntensity}
          directionalColor={lighting.directionalColor}
          directionalPosition={lighting.directionalPosition}
          pointIntensity={lighting.pointIntensity}
          pointColor={lighting.pointColor}
        />
      </Suspense>
    </>
  )
}

export default function World() {
  const { setQuality } = useStore()

  return (
    <ErrorBoundary>
      <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
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
