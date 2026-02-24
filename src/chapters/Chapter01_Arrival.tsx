'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

export default function Chapter01_Arrival() {
  const activeChapter = useStore((s) => s.activeChapter)
  const isActive = activeChapter === 0
  const ref = useRef<THREE.Group>(null)

  const debris = useMemo(() => {
    const items: { pos: [number, number, number], rot: [number, number, number], scale: number }[] = []
    for (let i = 0; i < 15; i++) {
      items.push({
        pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 8 - 2, (Math.random() - 0.5) * 15],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.1 + Math.random() * 0.3,
      })
    }
    return items
  }, [])

  useFrame((state) => {
    if (ref.current && isActive) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.05
    }
  })

  if (!isActive) return null

  return (
    <group ref={ref}>
      {debris.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={d.rot} scale={d.scale}>
          <boxGeometry args={[0.2, 0.05, 0.15]} />
          <meshStandardMaterial color="#5A6A5A" roughness={0.9} opacity={0.6} transparent />
        </mesh>
      ))}
    </group>
  )
}
