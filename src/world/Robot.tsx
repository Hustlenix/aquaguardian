'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RobotProps {
  visible: boolean
  activated: boolean
  scale: number
  position: [number, number, number]
  scanBeam: boolean
}

function Eye({ xOff, glow }: { xOff: number; glow: boolean }) {
  return (
    <group position={[xOff, 0.3, 0.9]}>
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={glow ? '#00E5FF' : '#224455'} />
      </mesh>
    </group>
  )
}

function Arm({ side }: { side: 'left' | 'right' }) {
  const ref = useRef<THREE.Group>(null)
  const sign = side === 'left' ? 1 : -1

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = (side === 'left' ? -0.3 : 0.3) + Math.sin(state.clock.elapsedTime * 0.5 + sign) * 0.05
    }
  })

  return (
    <group ref={ref}>
      <mesh position={[sign * 0.5, -0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.2, 6]} />
        <meshStandardMaterial color="#4A6A7A" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[sign * 0.7, -1.3, 0]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#3A5A6A" roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  )
}

export default function Robot({ visible, activated, scale, position, scanBeam }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scanRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15

    if (scanRef.current && activated) {
      scanRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
      scanRef.current.scale.y = 1 + Math.cos(state.clock.elapsedTime * 1.5) * 0.2
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <pointLight position={[0, 0, 0]} intensity={activated ? 1 : 0.3} color="#00E5FF" distance={5} />
      <pointLight position={[0, 0.5, 0]} intensity={activated ? 0.8 : 0.2} color="#D4AF37" distance={4} />

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 1.2, 8]} />
        <meshStandardMaterial color="#3A5A6A" roughness={0.5} metalness={0.5} flatShading />
      </mesh>

      {/* Chest core */}
      <mesh position={[0, 0.1, 0.5]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color={activated ? '#00E5FF' : '#1A3A4A'} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#4A7A8A" roughness={0.3} metalness={0.6} flatShading />
      </mesh>

      <Eye xOff={-0.3} glow={activated} />
      <Eye xOff={0.3} glow={activated} />

      {/* Antenna */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
        <meshBasicMaterial color={activated ? '#D4AF37' : '#3A3A3A'} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={activated ? '#00E5FF' : '#224455'} />
      </mesh>

      <Arm side="left" />
      <Arm side="right" />

      {/* Base */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 8]} />
        <meshStandardMaterial color="#2A4A5A" roughness={0.7} metalness={0.3} flatShading />
      </mesh>

      {/* Scan beam ring */}
      {scanBeam && (
        <mesh ref={scanRef} position={[0, 0.8, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 1.2, 32]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
