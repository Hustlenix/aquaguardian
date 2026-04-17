'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

interface FishProps {
  visible?: boolean
}

const FISH_COLORS = ['#D4AF37', '#88CCFF', '#6AD0A0', '#E8A060', '#A080D0']

function FishSchool({ count = 20 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      phase: number
      speed: number
      radius: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 12, -2 + Math.random() * 6, -8 - Math.random() * 10],
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        radius: 1 + Math.random() * 2,
      })
    }
    return arr
  }, [count])

  const colors = useMemo(() => {
    const arr: THREE.Color[] = []
    for (let i = 0; i < count; i++) {
      arr.push(new THREE.Color(FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)]))
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      const turnX = Math.sin(t * d.speed + d.phase)
      const turnZ = Math.cos(t * d.speed + d.phase)

      dummy.position.set(
        d.pos[0] + turnX * d.radius,
        d.pos[1] + Math.sin(t * d.speed * 0.7 + d.phase * 1.2) * d.radius * 0.3,
        d.pos[2] + turnZ * d.radius,
      )

      dummy.rotation.y = Math.atan2(turnZ * d.radius, -turnX * d.radius)
      dummy.rotation.z = Math.sin(t * d.speed * 0.5 + d.phase) * 0.18
      dummy.rotation.x = Math.sin(t * d.speed * 0.8 + d.phase * 1.1) * 0.08

      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
      ref.current.setColorAt(i, colors[i])
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.08, 0.2, 3]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.4} metalness={0.3} />
    </instancedMesh>
  )
}

export default function Fish({ visible = false }: FishProps) {
  const quality = useStore((s) => s.quality)
  if (!visible) return null
  const high = quality > 0.75
  return (
    <group>
      <FishSchool count={high ? 25 : 14} />
      <FishSchool count={high ? 15 : 8} />
    </group>
  )
}
