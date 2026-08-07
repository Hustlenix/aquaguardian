'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

interface LightingProps {
  ambientIntensity?: number
  ambientColor?: string
  directionalIntensity?: number
  directionalColor?: string
  directionalPosition?: [number, number, number]
  pointIntensity?: number
  pointColor?: string
}

/**
 * Cinematic underwater light rig:
 * - warm key light (orbiting slowly, two-harmonic pulse),
 * - cool sky fill (hemisphere + ambient),
 * - cyan under-bounce rising from the seabed,
 * - camera-following rim light for constant silhouette definition,
 * - a robot spotlight that brightens when the robot section is active.
 * Section warmth tints the key, rim and bounce so the grade follows the story.
 */
export default function Lighting({
  ambientIntensity = 0.4,
  ambientColor = '#B8D4E3',
  directionalIntensity = 1,
  directionalColor = '#B8D4E3',
  directionalPosition = [5, 10, -5],
  pointIntensity = 0.5,
  pointColor = '#D4AF37',
}: LightingProps) {
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const robotSpotRef = useRef<THREE.PointLight>(null)
  const rimRef = useRef<THREE.PointLight>(null)
  const pointRef = useRef<THREE.PointLight>(null)
  const bounceRef = useRef<THREE.PointLight>(null)
  const { camera } = useThree()
  const robotActivated = useStore((s) => s.sceneState.robot.activated)
  const activeSection = useStore((s) => s.activeSection)

  const dColor = useMemo(() => new THREE.Color(directionalColor), [directionalColor])
  const aColor = useMemo(() => new THREE.Color(ambientColor), [ambientColor])
  const pColor = useMemo(() => new THREE.Color(pointColor), [pointColor])
  const skyColor = useMemo(() => new THREE.Color(ambientColor), [ambientColor])
  const groundColor = useMemo(() => new THREE.Color('#010B13'), [])
  const gold = useMemo(() => new THREE.Color('#FFD9A0'), [])
  const cool = useMemo(() => new THREE.Color('#3A7A9A'), [])
  const warmRim = useMemo(() => new THREE.Color('#8AD0E8'), [])
  const coolRim = useMemo(() => new THREE.Color('#2A5A72'), [])
  const scratch = useMemo(() => new THREE.Color(), [])
  const rimOffset = useMemo(() => new THREE.Vector3(-2.2, 1.6, 2.6), [])
  const robotSpotTarget = useRef(0.35)

  // Warmer gold near the surface (hero/footer), cooler in the depths (problem).
  const warmth = useMemo(() => {
    if (activeSection === 'hero' || activeSection === 'footer') return 0.15
    if (activeSection === 'problem') return -0.08
    return 0.04
  }, [activeSection])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (dirRef.current) {
      // Slow key orbit — the sun shifts subtly through the scroll.
      dirRef.current.position.x = directionalPosition[0] + Math.sin(t * 0.05) * 2.5
      dirRef.current.position.z = directionalPosition[2] + Math.cos(t * 0.04) * 2.5

      // Gentle animated intensity pulse on two harmonics (2-4% variation).
      dirRef.current.intensity =
        directionalIntensity * (1 + Math.sin(t * 0.6) * 0.02 + Math.sin(t * 1.7) * 0.015)

      // Warm/cool tint driven by the current section, with a very slow drift
      // so the grade never feels locked in.
      scratch
        .copy(dColor)
        .lerp(warmth >= 0 ? gold : cool, Math.abs(warmth) + Math.sin(t * 0.2) * 0.02)
      dirRef.current.color.copy(scratch)
    }

    // Main scene fill light breathes gently with the swell.
    if (pointRef.current) {
      pointRef.current.intensity = pointIntensity * (1 + Math.sin(t * 0.7) * 0.05)
    }

    // Cyan under-bounce — light reflecting up off the seabed; pulses with the
    // ocean swell so the whole floor subtly breathes.
    if (bounceRef.current) {
      bounceRef.current.intensity = 0.35 * (1 + Math.sin(t * 0.5) * 0.12)
      scratch.copy(cool).lerp(gold, Math.max(0, warmth) * 0.4)
      bounceRef.current.color.copy(scratch)
    }

    // Cyan spotlight above the seabed center; brightens smoothly when the
    // robot section is active (solution/technology).
    if (robotSpotRef.current) {
      const target = robotActivated ? 2.4 : 0.35
      robotSpotTarget.current += (target - robotSpotTarget.current) * (1 - Math.exp(-3 * delta))
      robotSpotRef.current.intensity = robotSpotTarget.current
    }

    // Rim light that follows the camera for constant silhouette definition;
    // a soft pulse keeps the edge light alive, tinted by the section warmth.
    if (rimRef.current) {
      rimRef.current.position.copy(camera.position).add(rimOffset)
      rimRef.current.intensity = 0.45 * (1 + Math.sin(t * 0.8) * 0.12)
      scratch.copy(warmRim).lerp(coolRim, Math.max(0, -warmth) * 1.5)
      rimRef.current.color.copy(scratch)
    }
  })

  return (
    <>
      <hemisphereLight
        intensity={ambientIntensity * 0.7}
        color={skyColor}
        groundColor={groundColor}
      />
      <ambientLight intensity={ambientIntensity * 0.3} color={aColor} />
      <directionalLight
        ref={dirRef}
        position={directionalPosition}
        intensity={directionalIntensity}
        color={dColor}
        castShadow={false}
      />
      <pointLight
        ref={pointRef}
        position={[0, 5, 0]}
        intensity={pointIntensity}
        color={pColor}
        distance={20}
        decay={1.5}
      />
      {/* Under-bounce from the seabed — the floor catches and returns cyan light */}
      <pointLight
        ref={bounceRef}
        position={[1.5, -2.4, -2]}
        intensity={0.35}
        color="#3A7A9A"
        distance={16}
        decay={1.2}
      />

      <pointLight
        ref={robotSpotRef}
        position={[0, -3.2, -5]}
        intensity={0.35}
        color="#00E5FF"
        distance={14}
        decay={1.5}
      />
      <pointLight
        ref={rimRef}
        position={[-2, 2, 10]}
        intensity={0.45}
        color="#6AB8D8"
        distance={18}
        decay={1.2}
      />
    </>
  )
}
