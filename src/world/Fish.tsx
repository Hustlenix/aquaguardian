'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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
        pos: [
          (Math.random() - 0.5) * 12,
          -2 + Math.random() * 6,
          -8 - Math.random() * 10,
        ],
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        radius: 1 + Math.random() * 2,
      })
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      dummy.position.set(
        d.pos[0] + Math.sin(t * d.speed + d.phase) * d.radius,
        d.pos[1] + Math.sin(t * d.speed * 0.7 + d.phase * 1.2) * d.radius * 0.3,
        d.pos[2] + Math.cos(t * d.speed + d.phase) * d.radius,
      )
      dummy.rotation.y = Math.atan2(
        Math.cos(t * d.speed + d.phase) * d.radius,
        -Math.sin(t * d.speed + d.phase) * d.radius,
      )
      dummy.rotation.z = Math.sin(t * d.speed * 0.5 + d.phase) * 0.1
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  const color = useMemo(
    () => FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
    []
  )

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.08, 0.2, 3]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </instancedMesh>
  )
}

export default function Fish({ visible = false }: FishProps) {
  if (!visible) return null
  return (
    <group>
      <FishSchool count={25} />
      <FishSchool count={15} />
    </group>
  )
}
