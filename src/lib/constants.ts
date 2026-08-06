export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hustlenix.github.io/aquaguardian'

export const CHAPTER_COUNT = 11

export const SCROLL_DURATION = 1.2

export const SCENE_TRANSITION_DURATION = 1.5

export const CAMERA_DEFAULTS = {
  position: [0, 2, 15] as const,
  fov: 60,
  near: 0.1,
  far: 1000,
} as const

export const OCEAN_COLORS = {
  surface: '#0A3A5C',
  mid: '#0A2A3E',
  deep: '#020B15',
  abyss: '#010B13',
  sun: '#FFE9C8',
  haze: '#041525',
} as const

export const RENDER_QUALITY = {
  low: 0.5,
  medium: 0.75,
  high: 1,
} as const

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const
