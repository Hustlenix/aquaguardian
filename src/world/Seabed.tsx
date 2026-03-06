'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SeabedProps {
  debrisCount?: number
}

function Rock({ x, z, scale }: { x: number; z: number; scale: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02 + x) * 0.01
    }
  })
  return (
    <mesh ref={ref} position={[x, -4 + scale * 0.2, z]} rotation={[Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.3]}>
      <icosahedronGeometry args={[scale * 0.4, 0]} />
      <meshStandardMaterial color="#3A4A4A" roughness={0.9} metalness={0.1} flatShading />
    </mesh>
  )
}

function Debris({ count }: { count: number }) {
  const items = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      rot: [number, number, number]
      scale: number
      color: string
      shape: 'box' | 'bottle' | 'bag'
    }[] = []
    const shapes: ('box' | 'bottle' | 'bag')[] = ['box', 'bottle', 'bag']
    const cleanColors = ['#5A4A3A', '#6A5A4A', '#4A5A5A']
    const pollutedColors = ['#7A5A3A', '#8A4A3A', '#6A4A4A', '#5A5A3A', '#8A6A3A']

    for (let i = 0; i < count; i++) {
      const isPolluted = i > count * 0.3
      const colorSet = isPolluted ? pollutedColors : cleanColors
      arr.push({
        pos: [(Math.random() - 0.5) * 24, -3.5 + Math.random() * 0.5, (Math.random() - 0.5) * 18],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.05 + Math.random() * 0.15,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      })
    }
    return arr
  }, [count])

  return (
    <group>
      {items.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={d.rot} scale={d.scale}>
          {d.shape === 'box' && <boxGeometry args={[0.2, 0.05, 0.15]} />}
          {d.shape === 'bottle' && <cylinderGeometry args={[0.03, 0.05, 0.2, 5]} />}
          {d.shape === 'bag' && <boxGeometry args={[0.15, 0.08, 0.12]} />}
          <meshStandardMaterial color={d.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export default function Seabed({ debrisCount = 0 }: SeabedProps) {
  const geo = useMemo(() => {
    const w = 50
    const d = 40
    const segments = 40
    const positions = new Float32Array((segments + 1) * (segments + 1) * 3)
    const colors = new Float32Array((segments + 1) * (segments + 1) * 3)
    let idx = 0
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * w
        const z = (j / segments - 0.5) * d
        const yNoise = Math.sin(i * 0.3) * Math.cos(j * 0.4) * 0.4 +
          Math.sin(i * 0.7 + j * 0.5) * 0.2 +
          (Math.random() - 0.5) * 0.3
        positions[idx] = x
        positions[idx + 1] = -4 + yNoise
        positions[idx + 2] = z
        const brightness = 0.3 + yNoise * 0.1 + 0.1
        colors[idx] = 0.15 * brightness
        colors[idx + 1] = 0.2 * brightness
        colors[idx + 2] = 0.25 * brightness
        idx += 3
      }
    }
    const indices: number[] = []
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j
        const b = i * (segments + 1) + j + 1
        const c = (i + 1) * (segments + 1) + j
        const d2 = (i + 1) * (segments + 1) + j + 1
        indices.push(a, b, c)
        indices.push(b, d2, c)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.setIndex(indices)
    g.computeVertexNormals()
    return g
  }, [])

  const rocks = useMemo(() => {
    const arr: { x: number; z: number; scale: number }[] = []
    for (let i = 0; i < 6; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 30,
        z: -5 - Math.random() * 16,
        scale: 0.5 + Math.random() * 1.2,
      })
    }
    return arr
  }, [])

  return (
    <group>
      <mesh geometry={geo} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      {rocks.map((r, i) => (
        <Rock key={i} x={r.x} z={r.z} scale={r.scale} />
      ))}
      <Debris count={debrisCount} />
    </group>
  )
}
