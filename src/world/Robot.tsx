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

/** Wrap an angle to (-PI, PI]. */
function wrapAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a))
}

interface BlinkClock {
  current: number
}

function Eye({ xOff, glow, blink }: { xOff: number; glow: boolean; blink: BlinkClock }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const discRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Blink: a 0.12s dip scheduled every 4-7s, both eyes share the clock.
    const blinking = t > blink.current - 0.12 && t < blink.current
    if (t >= blink.current) blink.current = t + 4 + Math.random() * 3

    const base = glow ? 2.2 : 0.55
    const pulse = glow ? 1 + Math.sin(t * 2.3) * 0.35 : 1 + Math.sin(t * 1.1) * 0.15
    if (matRef.current) {
      matRef.current.emissiveIntensity = blinking ? 0.05 : base * pulse
    }
    if (discRef.current) {
      discRef.current.opacity = blinking ? 0.02 : (glow ? 0.28 : 0.1) * pulse
    }
  })

  return (
    <group position={[xOff, 0.1, 0.34]}>
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#0A0F12" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Glow disc — billboarded soft halo for the bloom to pick up */}
      <mesh position={[0, 0, 0.07]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.09, 16]} />
        <meshBasicMaterial
          ref={discRef}
          color={glow ? '#00E5FF' : '#1A4455'}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial
          ref={matRef}
          color="#0A1A22"
          emissive={glow ? '#00E5FF' : '#1A4455'}
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.2}
        />
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
        <meshStandardMaterial color="#4A6A7A" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[sign * 0.7, -1.3, 0]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#3A5A6A" roughness={0.35} metalness={0.55} />
      </mesh>
    </group>
  )
}

export default function Robot({ visible, activated, scale, position, scanBeam }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scanRef = useRef<THREE.Mesh>(null)
  const scanRef2 = useRef<THREE.Mesh>(null)
  const sweepRef = useRef<THREE.Mesh>(null)
  const antennaRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const coreLightRef = useRef<THREE.PointLight>(null)
  const cyanLightRef = useRef<THREE.PointLight>(null)
  const goldLightRef = useRef<THREE.PointLight>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)
  const beamRef = useRef<THREE.Mesh>(null)
  const beamMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const pingRef = useRef<THREE.Mesh>(null)
  const pingMatRef = useRef<THREE.MeshBasicMaterial>(null)

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

  // Idle behaviour clocks — all refs, no state churn.
  const nextPing = useRef(3)
  const pingLife = useRef(-1)
  const blink = useRef(4 + Math.random() * 3)
  const yawCurrent = useRef(0)
  const settle = useRef(0)

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
    const idleX = Math.sin(t * 0.12) * 0.35
    const idleZ = Math.cos(t * 0.09) * 0.12

    const cycleOff = cycle.current.offset
    const inCycle = cycle.current.phase !== 'idle'

    const posX = basePos.current.x + (inCycle ? cycleOff.x : idleX)
    const posY = basePos.current.y + Math.sin(t * 0.4) * 0.15 + (inCycle ? cycleOff.y : 0)
    const posZ = basePos.current.z + (inCycle ? cycleOff.z : idleZ)

    // Hover micro-sway above a debris item.
    if (cycle.current.phase === 'hover') {
      groupRef.current.position.set(
        posX + Math.sin(t * 1.3) * 0.05,
        posY + Math.sin(t * 2.1) * 0.03,
        posZ + Math.cos(t * 1.1) * 0.05
      )
    } else {
      groupRef.current.position.set(posX, posY, posZ)
    }

    // --- Heading: bank into the travel direction (angle-aware damp) -------
    const moving = inCycle && cycleOff.lengthSq() > 0.002
    let deltaYaw = 0
    if (moving) {
      const targetYaw = Math.atan2(cycleOff.x, cycleOff.z)
      deltaYaw = wrapAngle(targetYaw - yawCurrent.current)
      const k = 1 - Math.exp(-3.2 * delta)
      yawCurrent.current += deltaYaw * k
      // Gentle roll into the turn.
      groupRef.current.rotation.z = -THREE.MathUtils.clamp(deltaYaw * 1.4, -0.18, 0.18)
    } else {
      // Idle drift + settle back to level after a run.
      settle.current += (0 - settle.current) * (1 - Math.exp(-2 * delta))
      yawCurrent.current = Math.sin(t * 0.1) * 0.15
      groupRef.current.rotation.z = settle.current
    }
    groupRef.current.rotation.y = yawCurrent.current

    // --- Head: subtle scanning yaw when activated --------------------------
    if (headRef.current) {
      const amp = activated ? 0.14 : 0.05
      headRef.current.rotation.y = Math.sin(t * 0.35) * amp + (moving ? deltaYaw * 0.25 : 0)
    }

    // --- Antenna sway -------------------------------------------------------
    if (antennaRef.current) {
      const amp = activated ? 1 : 0.55
      antennaRef.current.rotation.z =
        (Math.sin(t * 0.9) * 0.12 + Math.sin(t * 2.1) * 0.03) * amp
      antennaRef.current.rotation.x = Math.sin(t * 1.3 + 1) * 0.08 * amp
    }

    // --- Chest-core pulse + light -------------------------------------------
    if (coreRef.current) {
      const pulse = activated ? 0.5 + 0.5 * Math.sin(t * 2.5) : 0.2 + 0.1 * Math.sin(t * 1.2)
      coreRef.current.scale.setScalar(1 + pulse * 0.16)
      if (coreMatRef.current) {
        coreMatRef.current.emissiveIntensity = activated ? 1.2 + pulse * 1.6 : 0.25 + pulse * 0.2
      }
      if (coreLightRef.current) {
        coreLightRef.current.intensity = activated ? 0.35 + pulse * 0.4 : 0.08
      }
    }

    // --- Scan rings: counter-rotating pair + vertical sweep ------------------
    if (scanRef.current && scanRef2.current && sweepRef.current && activated && scanBeam) {
      scanRef.current.rotation.z += delta * 0.8
      scanRef2.current.rotation.z -= delta * 0.55
      sweepRef.current.rotation.y = Math.sin(t * 1.4) * 0.6
    }

    // --- Ping ring from the antenna tip --------------------------------------
    if (pingRef.current && pingMatRef.current) {
      if (activated && pingLife.current < 0 && now >= nextPing.current) {
        pingLife.current = 0
        nextPing.current = now + 4.5 + Math.random() * 2.5
      }
      if (pingLife.current >= 0) {
        pingLife.current += delta
        const life = pingLife.current / 0.9 // 0.9s ring expansion
        if (life >= 1) {
          pingLife.current = -1
          pingRef.current.visible = false
        } else {
          pingRef.current.visible = true
          const s = 0.1 + life * 0.9
          pingRef.current.scale.setScalar(s)
          pingMatRef.current.opacity = 0.3 * (1 - life)
        }
      }
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

    // --- Lights: smooth damped intensities -----------------------------------
    const damp = 1 - Math.exp(-3 * delta)
    if (cyanLightRef.current) {
      cyanLightRef.current.intensity += ((activated ? 1.1 : 0.3) - cyanLightRef.current.intensity) * damp
    }
    if (goldLightRef.current) {
      goldLightRef.current.intensity += ((activated ? 0.9 : 0.2) - goldLightRef.current.intensity) * damp
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity += ((activated ? 0.6 : 0.22) - rimLightRef.current.intensity) * damp
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
          settle.current = 0.12 // brief settle bounce after landing
        }
        break
      }
    }
  }

  if (!visible) return null

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <pointLight ref={cyanLightRef} position={[0, 0, 0]} intensity={0.3} color="#00E5FF" distance={5} />
      <pointLight ref={goldLightRef} position={[0, 0.5, 0]} intensity={0.2} color="#D4AF37" distance={4} />
      {/* Rim light — separates the robot from the dark seabed */}
      <pointLight
        ref={rimLightRef}
        position={[0, 0.3, -0.8]}
        intensity={0.22}
        color="#6AB8D8"
        distance={4.5}
        decay={1.5}
      />

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 1.2, 8]} />
        <meshStandardMaterial
          color="#3A5A6A"
          roughness={0.35}
          metalness={0.55}
          emissive="#081218"
          emissiveIntensity={0.3}
          flatShading
        />
      </mesh>

      {/* Chest core — emissive heart + inner light */}
      <mesh ref={coreRef} position={[0, 0.1, 0.5]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#0A1A22"
          emissive={activated ? '#00E5FF' : '#1A3A4A'}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <pointLight
        ref={coreLightRef}
        position={[0, 0.1, 0.55]}
        intensity={0.08}
        color="#00E5FF"
        distance={3}
      />

      {/* Head (group so it can scan) */}
      <group ref={headRef} position={[0, 0.8, 0]}>
        <mesh>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color="#4A7A8A"
            roughness={0.25}
            metalness={0.65}
            emissive="#081218"
            emissiveIntensity={0.3}
            flatShading
          />
        </mesh>
        <Eye xOff={-0.3} glow={activated} blink={blink} />
        <Eye xOff={0.3} glow={activated} blink={blink} />
      </group>

      {/* Antenna (group so it can sway) */}
      <group ref={antennaRef}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
          <meshBasicMaterial color={activated ? '#D4AF37' : '#3A3A3A'} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#0A1A22"
            emissive={activated ? '#00E5FF' : '#224455'}
            emissiveIntensity={activated ? 2 : 0.5}
            roughness={0.2}
          />
        </mesh>
        {/* Ping ring — dormant mesh animated by the frame loop */}
        <mesh ref={pingRef} position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.55, 0.7, 24]} />
          <meshBasicMaterial
            ref={pingMatRef}
            color="#00E5FF"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Arm side="left" />
      <Arm side="right" />

      {/* Base */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 8]} />
        <meshStandardMaterial
          color="#2A4A5A"
          roughness={0.5}
          metalness={0.4}
          emissive="#060E14"
          emissiveIntensity={0.25}
          flatShading
        />
      </mesh>

      {/* Pickup beam — cyan cone under the robot, visible during collection */}
      <mesh ref={beamRef} position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]} visible={false}>
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

      {/* Scan beam rings — counter-rotating pair + vertical sweep bar */}
      {scanBeam && (
        <group position={[0, 0.8, 0.5]}>
          <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 1.2, 32]} />
            <meshBasicMaterial
              color="#00E5FF"
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={scanRef2} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.48, 24]} />
            <meshBasicMaterial
              color="#D4AF37"
              transparent
              opacity={0.16}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh ref={sweepRef} position={[0, 0, 0]}>
            <planeGeometry args={[1.5, 0.02]} />
            <meshBasicMaterial
              color="#00E5FF"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}
