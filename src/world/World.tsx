'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import OceanSurface from './Ocean'
import Caustics from './Caustics'
import CameraRig from './Camera'
import Lighting from './Lighting'
import Particles from './Particles'
import Bubbles from './Bubbles'
import Coral from './Coral'
import Seabed from './Seabed'
import LightRays from './LightRays'
import Robot from './Robot'
import Kelp from './Kelp'
import Fish from './Fish'
import Jellyfish from './Jellyfish'
import Ruins from './Ruins'
import Effects from './Effects'
import Environment from './Environment'
import EnvReflections from './EnvReflections'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useStore } from '@/store/useStore'

/**
 * Quality matrix — how performance budgets are spent across devices.
 *
 * | Device / tier            | dpr cap    | Effects tier         | Particles      |
 * |--------------------------|------------|----------------------|----------------|
 * | Mobile / low             | [1, 1.5]   | bloom only (ms 0)    | count / 2, +40% size |
 * | Desktop / high           | [1, 2]     | bloom + vignette + noise + CA (ms 4) | full |
 *
 * - dpr: capped here on the Canvas (PerformanceMonitor can still step it down).
 * - Effects (Effects.tsx): quality > 0.75 unlocks the cinematic stack,
 *   otherwise bloom alone with multisampling 0 — protects mobile frame budget.
 * - Particles (Particles.tsx): halves counts and enlarges sprites on mobile.
 * - Camera (Camera.tsx): portrait phones get +8 fov and a pulled-back
 *   position; touch-drag parallax is window-level so phones feel the scene.
 * - frameloop stays "always": the scene is continuously animated (fish,
 *   particles, robot) so a demand-driven loop would animate anyway.
 */
function SceneContent() {
  const sceneState = useStore((s) => s.sceneState)
  const quality = useStore((s) => s.quality)
  const { lighting, water, environment, particles: particleCfg } = sceneState

  const fogColor = useMemo(() => new THREE.Color(lighting.fogColor), [lighting.fogColor])

  const kelpDensity = useMemo(() => environment.templeIntact * 0.8, [environment.templeIntact])

  const ruinsIntact = useMemo(() => environment.templeIntact * 0.7, [environment.templeIntact])

  return (
    <>
      <color attach="background" args={[water.topColor]} />
      <fog attach="fog" args={[fogColor, lighting.fogNear, lighting.fogFar]} />
      <Suspense fallback={null}>
        <OceanSurface topColor={water.topColor} clarity={water.clarity} />
        <Seabed debrisCount={environment.debrisCount} />
        <Caustics
          color={environment.lightRayColor}
          opacity={0.16 + environment.lightRayOpacity * 0.35}
        />
        <Ruins intact={ruinsIntact} />
        <Coral intact={environment.templeIntact} />
        <Kelp density={kelpDensity} />
        <LightRays color={environment.lightRayColor} opacity={environment.lightRayOpacity} />
        <Environment />
        {quality > 0.75 && <EnvReflections />}
        <Particles
          count={particleCfg.count}
          color={particleCfg.color}
          opacity={particleCfg.opacity}
          speed={particleCfg.speed}
        />
        <Bubbles />
        <Jellyfish />
        <Fish visible={environment.fishVisible} />
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
        <Effects />
      </Suspense>
    </>
  )
}

export default function World() {
  const { setQuality, quality, deviceTier } = useStore()

  // dpr cap: [1, 1.5] on mobile/low, [1, 2] on desktop/high.
  const dpr = useMemo<[number, number]>(
    () => (deviceTier === 'low' || quality < 0.75 ? [1, 1.5] : [1, 2]),
    [deviceTier, quality]
  )

  const canvasWrapperStyle = useMemo(
    () => ({
      position: 'fixed' as const,
      inset: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none' as const,
      zIndex: 0,
    }),
    []
  )

  return (
    <ErrorBoundary>
      <div style={canvasWrapperStyle}>
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 1, 8], fov: 60, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={(state) => {
            state.gl.setClearColor('#010B13')
          }}
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
