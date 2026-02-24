'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter11_CTA() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 10
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)

  const particleCount = 80

  const particles = useMemo(() => {
    const data: {
      angle: number
      tilt: number
      speed: number
      size: number
      color: string
      phase: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      data.push({
        angle: Math.random() * Math.PI * 2,
        tilt: Math.random() * Math.PI - Math.PI / 2,
        speed: 0.3 + Math.random() * 0.5,
        size: 0.02 + Math.random() * 0.04,
        color: Math.random() > 0.5 ? '#D4AF37' : '#00E5FF',
        phase: Math.random() * Math.PI * 2,
      })
    }
    return data
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !isActive) return

    const t = state.clock.elapsedTime

    groupRef.current.rotation.y = t * 0.05

    if (sphereRef.current) {
      const pulse = 1 + Math.sin(t * 0.8) * 0.04
      sphereRef.current.scale.setScalar(pulse)
    }
  })

  if (!isActive) return null

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Core sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.45, 0.6, 48]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 1.8, 0.3, 0]}>
        <ringGeometry args={[0.6, 0.75, 48]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Rising particles */}
      {particles.map((p, i) => (
        <RisingParticle key={i} data={p} index={i} />
      ))}

      {/* Lights */}
      <pointLight color="#00E5FF" intensity={2} distance={6} decay={1.5} />
      <pointLight color="#D4AF37" intensity={1} distance={5} decay={1.5} />
    </group>
  )
}

function RisingParticle({
  data,
  index,
}: {
  data: {
    angle: number
    tilt: number
    speed: number
    size: number
    color: string
    phase: number
  }
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const offset = useMemo(() => 0.3 + Math.random() * 0.2, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime

    const dist = offset + (t * data.speed * 0.4) % 2.5
    const wobble = Math.sin(t * data.speed + data.phase) * 0.1

    ref.current.position.x = Math.cos(data.angle) * dist + wobble
    ref.current.position.z = Math.sin(data.angle) * dist * Math.cos(data.tilt) + wobble
    ref.current.position.y = Math.sin(data.tilt) * dist * 0.5 + 0.2 + Math.sin(t * data.speed + data.phase) * 0.1

    const fade = Math.max(0, 1 - dist / 3)
    ref.current.scale.setScalar(data.size * (0.5 + fade * 0.5))

    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = fade * 0.7
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshBasicMaterial
        color={data.color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
