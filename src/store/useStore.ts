'use client'

import { create } from 'zustand'
import type { SceneState } from '@/types'

export const SECTION_IDS = ['hero', 'mission', 'problem', 'solution', 'technology', 'timeline', 'impact', 'faq', 'footer'] as const
export type SectionId = (typeof SECTION_IDS)[number]

interface Store {
  activeChapter: number
  scrollProgress: number
  deviceTier: 'low' | 'medium' | 'high'
  reducedMotion: boolean
  quality: number
  activeSection: SectionId
  sceneState: SceneState

  setActiveChapter: (n: number) => void
  setScrollProgress: (n: number) => void
  setDeviceTier: (tier: 'low' | 'medium' | 'high') => void
  setReducedMotion: (b: boolean) => void
  setQuality: (n: number) => void
  setActiveSection: (s: SectionId) => void
  setSceneState: (s: SceneState) => void
}

export const useStore = create<Store>((set) => ({
  activeChapter: 0,
  scrollProgress: 0,
  deviceTier: 'high',
  reducedMotion: false,
  quality: 1,
  activeSection: 'hero',
  sceneState: {
    id: 'hero',
    label: 'Arrival',
    lighting: {
      ambientIntensity: 0.4,
      ambientColor: '#B8D4E3',
      directionalIntensity: 1,
      directionalColor: '#B8D4E3',
      directionalPosition: [5, 10, -5],
      pointIntensity: 0.5,
      pointColor: '#D4AF37',
      fogColor: '#041525',
      fogNear: 6,
      fogFar: 20,
    },
    robot: {
      visible: true,
      activated: false,
      scale: 0.3,
      position: [6, -1, -8],
      scanBeam: false,
    },
    particles: {
      count: 200,
      color: '#88CCFF',
      opacity: 0.4,
      speed: 0.3,
    },
    water: {
      topColor: '#1A6B8A',
      clarity: 0.8,
    },
    environment: {
      debrisCount: 0,
      templeIntact: 0.9,
      lightRayColor: '#88CCFF',
      lightRayOpacity: 0.12,
      fishVisible: false,
    },
  },

  setActiveChapter: (n) => set({ activeChapter: n }),
  setScrollProgress: (n) => set({ scrollProgress: n }),
  setDeviceTier: (tier) => set({ deviceTier: tier }),
  setReducedMotion: (b) => set({ reducedMotion: b }),
  setQuality: (n) => set({ quality: n }),
  setActiveSection: (s) => set({ activeSection: s }),
  setSceneState: (s) => set({ sceneState: s }),
}))
