export interface Chapter {
  id: number
  title: string
  emotion: string
  scrollStart: number
  scrollEnd: number
}

export interface CameraTarget {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov?: number
}

export interface SceneState {
  id: string
  label: string
  lighting: {
    ambientIntensity: number
    ambientColor: string
    directionalIntensity: number
    directionalColor: string
    directionalPosition: [number, number, number]
    pointIntensity: number
    pointColor: string
    fogColor: string
    fogNear: number
    fogFar: number
  }
  robot: {
    visible: boolean
    activated: boolean
    scale: number
    position: [number, number, number]
    scanBeam: boolean
  }
  particles: {
    count: number
    color: string
    opacity: number
    speed: number
  }
  water: {
    topColor: string
    clarity: number
  }
  environment: {
    debrisCount: number
    templeIntact: number
    lightRayColor: string
    lightRayOpacity: number
    fishVisible: boolean
  }
}

export interface LightingState {
  ambientColor: string
  ambientIntensity: number
  directionalColor: string
  directionalIntensity: number
  directionalPosition: [number, number, number]
  fogColor: string
  fogNear: number
  fogFar: number
}

export interface ParticleConfig {
  count: number
  size: number
  color: string
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
