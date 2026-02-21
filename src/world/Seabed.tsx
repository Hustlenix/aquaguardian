'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function Seabed() {
  const geo = useMemo(() => {
    const w = 40
    const d = 30
    const segments = 50
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
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.9}
        metalness={0.1}
        flatShading
      />
    </mesh>
  )
}
