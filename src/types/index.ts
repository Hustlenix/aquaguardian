import type { Vector3, Color } from 'three'

export interface Chapter {
  id: number
  title: string
  emotion: string
  scrollStart: number
  scrollEnd: number
}

export interface CameraTarget {
  position: Vector3 | [number, number, number]
  lookAt: Vector3 | [number, number, number]
  fov?: number
  duration?: number
}

export interface LightingState {
  ambientColor: Color | string
  ambientIntensity: number
  directionalColor: Color | string
  directionalIntensity: number
  directionalPosition: [number, number, number]
  fogColor: Color | string
  fogNear: number
  fogFar: number
}

export interface ParticleConfig {
  count: number
  size: number
  color: Color | string
  spread: [number, number, number]
  speed: number
  opacity: number
}

export interface SceneMetadata {
  name: string
  description: string
  version: string
  author: string
}
