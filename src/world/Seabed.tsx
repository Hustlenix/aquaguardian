'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface SeabedProps {
  debrisCount?: number
}

function Debris({ count }: { count: number }) {
  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 20, -3.5 + Math.random() * 0.5, (Math.random() - 0.5) * 15],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.05 + Math.random() * 0.15,
      })
    }
    return arr
  }, [count])

  return (
    <group>
      {items.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={d.rot} scale={d.scale}>
          <boxGeometry args={[0.2, 0.05, 0.15]} />
          <meshStandardMaterial color="#5A4A3A" roughness={0.9} />
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

  return (
    <group>
      <mesh geometry={geo} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      <Debris count={debrisCount} />
    </group>
  )
}
