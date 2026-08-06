'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { debrisPositions, debrisRegistry } from './Seabed'

interface RobotProps {
  visible: boolean
  activated: boolean
  scale: number
  position: [number, number, number]
  scanBeam: boolean
}

/** Height of the robot's center above a debris item while hovering. */
const HOVER_LIFT = 0.65
/** How long the robot hovers over an item before collecting it (seconds). */
const HOVER_DURATION = 2
/** Debris respawn delay (seconds) — enforced by Seabed via hiddenUntil. */
const DEBRIS_RESPAWN = 12
/** Pause between collection runs (seconds). */
const CYCLE_COOLDOWN = 8

type CyclePhase = 'idle' | 'seek' | 'hover' | 'return'

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
      ref.current.rotation.z =
        (side === 'left' ? -0.3 : 0.3) + Math.sin(state.clock.elapsedTime * 0.5 + sign) * 0.05
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
  const antennaRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const beamRef = useRef<THREE.Mesh>(null)
  const beamMatRef = useRef<THREE.MeshBasicMaterial>(null)

  // Anchor the idle hover to the scene-state base position so animation and
  // section changes never fight each other.
  const basePos = useRef(new THREE.Vector3(position[0], position[1], position[2]))

  useEffect(() => {
    basePos.current.set(position[0], position[1], position[2])
  }, [position])

  // Collection mini-cycle state — all in refs, zero re-renders per frame.
  const cycle = useRef({
    phase: 'idle' as CyclePhase,
    offset: new THREE.Vector3(0, 0, 0),
    offsetTarget: new THREE.Vector3(0, 0, 0),
    targetIndex: -1,
    hoverEndsAt: 0,
    cooldownUntil: 0,
    beamActive: false,
  })

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const now = t

    // When the robot leaves the scene, reset the cycle so it restarts fresh.
    if (!visible) {
      cycle.current.phase = 'idle'
      cycle.current.beamActive = false
      cycle.current.targetIndex = -1
      cycle.current.offsetTarget.set(0, 0, 0)
      cycle.current.cooldownUntil = now + CYCLE_COOLDOWN
    } else {
      runCollectionCycle(state, delta)
    }

    // --- Positioning -------------------------------------------------------
    // Idle patrol: slow lateral drift around the anchor + gentle bob.
    const idleX = Math.sin(t * 0.12) * 0.35
    const idleZ = Math.cos(t * 0.09) * 0.12

    const cycleOff = cycle.current.offset
    const inCycle = cycle.current.phase !== 'idle'

    groupRef.current.position.set(
      basePos.current.x + (inCycle ? cycleOff.x : idleX),
      basePos.current.y + Math.sin(t * 0.4) * 0.15 + (inCycle ? cycleOff.y : 0),
      basePos.current.z + (inCycle ? cycleOff.z : idleZ)
    )
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15

    // --- Antenna sway (slightly livelier than before) ----------------------
    if (antennaRef.current) {
      const amp = activated ? 1 : 0.55
      antennaRef.current.rotation.z = (Math.sin(t * 0.9) * 0.12 + Math.sin(t * 2.1) * 0.03) * amp
      antennaRef.current.rotation.x = Math.sin(t * 1.3 + 1) * 0.08 * amp
    }

    // --- Chest-core pulse ---------------------------------------------------
    if (coreRef.current) {
      const pulse = activated ? 0.5 + 0.5 * Math.sin(t * 2.5) : 0.2 + 0.1 * Math.sin(t * 1.2)
      coreRef.current.scale.setScalar(1 + pulse * 0.16)
      if (coreMatRef.current) {
        const c = coreMatRef.current.color as THREE.Color
        if (activated) {
          c.set('#00E5FF').lerp(new THREE.Color('#E8FDFF'), pulse * 0.8)
        } else {
          c.set('#1A3A4A')
        }
      }
    }

    if (scanRef.current && activated) {
      scanRef.current.scale.x = 1 + Math.sin(t * 2) * 0.3
      scanRef.current.scale.y = 1 + Math.cos(t * 1.5) * 0.2
      // Slow swirl so the ring reads as energy, not a static decal.
      scanRef.current.rotation.z += delta * 0.8
    }

    // --- Pickup beam pulse ---------------------------------------------------
    if (beamRef.current && beamMatRef.current) {
      beamRef.current.visible = cycle.current.beamActive
      if (cycle.current.beamActive) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 7)
        beamRef.current.scale.setScalar(1 + pulse * 0.25)
        beamMatRef.current.opacity = 0.22 + pulse * 0.18
      }
    }
  })

  /**
   * Collection state machine: idle → seek (drift to nearest visible debris)
   * → hover (~2s with cyan pickup beam) → collect (hide debris, schedule
   * respawn in Seabed) → return to base → cooldown. Pure eased lerp, no
   * pathfinding, occasional rather than frantic.
   */
  function runCollectionCycle(state: { clock: THREE.Clock }, delta: number) {
    const s = cycle.current
    const now = state.clock.elapsedTime
    const damp = 1 - Math.exp(-2.2 * delta)

    // Ease the robot's offset toward its goal.
    s.offset.lerp(s.offsetTarget, damp)

    switch (s.phase) {
      case 'idle': {
        if (now < s.cooldownUntil || debrisRegistry.length === 0) break
        // Pick the nearest visible debris item.
        let best = -1
        let bestDist = Infinity
        for (let i = 0; i < debrisRegistry.length; i++) {
          const handle = debrisRegistry[i]
          const d = debrisPositions[i]
          if (!handle || !d || !handle.mesh || !handle.mesh.visible) continue
          const dist = Math.hypot(d.x - basePos.current.x, d.z - basePos.current.z)
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        }
        if (best >= 0) {
          const d = debrisPositions[best]
          s.targetIndex = best
          s.offsetTarget.set(
            d.x - basePos.current.x,
            d.y + HOVER_LIFT - basePos.current.y,
            d.z - basePos.current.z
          )
          s.phase = 'seek'
        }
        break
      }
      case 'seek': {
        // Arrived when the eased offset is close to its target.
        if (s.offset.distanceTo(s.offsetTarget) < 0.35) {
          s.phase = 'hover'
          s.hoverEndsAt = now + HOVER_DURATION
        }
        break
      }
      case 'hover': {
        s.beamActive = true
        if (now >= s.hoverEndsAt) {
          s.beamActive = false
          // Collect: hide the item; Seabed respawns it after DEBRIS_RESPAWN.
          const handle = debrisRegistry[s.targetIndex]
          if (handle && handle.mesh) {
            handle.mesh.visible = false
            handle.hiddenUntil = now + DEBRIS_RESPAWN
          }
          s.targetIndex = -1
          s.offsetTarget.set(0, 0, 0)
          s.phase = 'return'
        }
        break
      }
      case 'return': {
        if (s.offset.length() < 0.15) {
          s.phase = 'idle'
          s.cooldownUntil = now + CYCLE_COOLDOWN
        }
        break
      }
    }
  }

  if (!visible) return null

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <pointLight
        position={[0, 0, 0]}
        intensity={activated ? 1 : 0.3}
        color="#00E5FF"
        distance={5}
      />
      <pointLight
        position={[0, 0.5, 0]}
        intensity={activated ? 0.8 : 0.2}
        color="#D4AF37"
        distance={4}
      />

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 1.2, 8]} />
        <meshStandardMaterial color="#3A5A6A" roughness={0.5} metalness={0.5} flatShading />
      </mesh>

      {/* Chest core */}
      <mesh ref={coreRef} position={[0, 0.1, 0.5]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial ref={coreMatRef} color={activated ? '#00E5FF' : '#1A3A4A'} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#4A7A8A" roughness={0.3} metalness={0.6} flatShading />
      </mesh>

      <Eye xOff={-0.3} glow={activated} />
      <Eye xOff={0.3} glow={activated} />

      {/* Antenna (group so it can sway) */}
      <group ref={antennaRef}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
          <meshBasicMaterial color={activated ? '#D4AF37' : '#3A3A3A'} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={activated ? '#00E5FF' : '#224455'} />
        </mesh>
      </group>

      <Arm side="left" />
      <Arm side="right" />

      {/* Base */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 8]} />
        <meshStandardMaterial color="#2A4A5A" roughness={0.7} metalness={0.3} flatShading />
      </mesh>

      {/* Pickup beam — cyan cone under the robot, visible during collection */}
      <mesh
        ref={beamRef}
        position={[0, -0.75, 0]}
        rotation={[Math.PI, 0, 0]}
        visible={false}
      >
        <coneGeometry args={[0.42, 1.4, 16, 1, true]} />
        <meshBasicMaterial
          ref={beamMatRef}
          color="#00E5FF"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Scan beam ring */}
      {scanBeam && (
        <mesh ref={scanRef} position={[0, 0.8, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 1.2, 32]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}
