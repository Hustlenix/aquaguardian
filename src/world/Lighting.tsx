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

<<<<<<< HEAD
function CausticPattern({ intensity = 0.3 }: { intensity?: number }) {
  const ref = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const r = 8 + Math.random() * 24
      const alpha = 0.02 + Math.random() * 0.06
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`
      ctx.fill()
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(8, 4)
    return tex
  }, [])

  useFrame((state) => {
    if (ref.current) {
      texture.offset.x += Math.sin(state.clock.elapsedTime * 0.08) * 0.002
      texture.offset.y += Math.cos(state.clock.elapsedTime * 0.06) * 0.002
    }
  })

  if (intensity < 0.05) return null

  return (
    <mesh ref={ref} position={[0, 8, -3]} rotation={[-Math.PI / 2, 0, 0]} scale={[25, 25, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={intensity * 0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

=======
>>>>>>> 2c79eb6 (Polish README and document AI-assisted build)
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
      dirRef.current.position.x = directionalPosition[0] + Math.sin(t * 0.05) * 1.5
      dirRef.current.position.z = directionalPosition[2] + Math.cos(t * 0.04) * 1.5

      // Gentle animated intensity pulse (1-3% variation).
      dirRef.current.intensity = directionalIntensity * (1 + Math.sin(t * 0.6) * 0.02)

      // Warm/cool tint driven by the current section.
      scratch.copy(dColor).lerp(warmth >= 0 ? gold : cool, Math.abs(warmth))
      dirRef.current.color.copy(scratch)
    }

    // Cyan spotlight above the seabed center; brightens smoothly when the
    // robot section is active (solution/technology).
    if (robotSpotRef.current) {
      const target = robotActivated ? 2.4 : 0.35
      robotSpotTarget.current += (target - robotSpotTarget.current) * (1 - Math.exp(-3 * delta))
      robotSpotRef.current.intensity = robotSpotTarget.current
    }

    // Rim light that follows the camera for constant silhouette definition.
    if (rimRef.current) {
      rimRef.current.position.copy(camera.position).add(rimOffset)
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
        position={[0, 5, 0]}
        intensity={pointIntensity}
        color={pColor}
        distance={20}
        decay={1.5}
      />
      <pointLight position={[-3, 0, 2]} intensity={0.3} color="#00E5FF" distance={12} decay={1} />

<<<<<<< HEAD
      {/* Rim backlight for silhouette definition */}
      <pointLight
        position={[-8, -2, -12]}
        intensity={0.5}
        color="#4A8AAA"
        distance={15}
        decay={1}
      />
=======
      {/* Robot spotlight — brightens when the robot section is active */}
      <pointLight
        ref={robotSpotRef}
        position={[0, -3.2, -5]}
        intensity={0.35}
        color="#00E5FF"
        distance={14}
        decay={1.5}
      />

      {/* Rim backlights for silhouette definition */}
      <pointLight position={[-8, -2, -12]} intensity={0.5} color="#4A8AAA" distance={15} decay={1} />
>>>>>>> 2c79eb6 (Polish README and document AI-assisted build)
      <pointLight position={[8, -1, -10]} intensity={0.3} color="#6AA0B0" distance={12} decay={1} />

      {/* Camera-following rim light */}
      <pointLight ref={rimRef} position={[-2, 2, 10]} intensity={0.45} color="#6AB8D8" distance={18} decay={1.2} />
    </>
  )
}
