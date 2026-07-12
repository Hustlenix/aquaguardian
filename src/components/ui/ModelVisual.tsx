'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

function AnimatedGeometry() {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    meshRef.current.rotation.y += 0.005
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.15
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial
        color="#00E5FF"
        wireframe
        transparent
        opacity={0.6}
        emissive="#00E5FF"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

export default function ModelVisual({
  variant = 'robot',
}: {
  variant?: 'robot' | 'prototype'
}) {
  return (
    <div className="w-full h-full min-h-[320px] lg:min-h-[400px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#D4AF37" />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#00E5FF" />
        <AnimatedGeometry />
      </Canvas>
      {variant === 'prototype' && (
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <p className="text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-gold-400/70">
            AquaGuardian Series 1
          </p>
        </div>
      )}
    </div>
  )
}
