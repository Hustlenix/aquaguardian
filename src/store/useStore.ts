'use client'

import { create } from 'zustand'

interface Store {
  activeChapter: number
  scrollProgress: number
  deviceTier: 'low' | 'medium' | 'high'
  reducedMotion: boolean
  quality: number
  setActiveChapter: (n: number) => void
  setScrollProgress: (n: number) => void
  setDeviceTier: (tier: 'low' | 'medium' | 'high') => void
  setReducedMotion: (b: boolean) => void
  setQuality: (n: number) => void
}

export const useStore = create<Store>((set) => ({
  activeChapter: 0,
  scrollProgress: 0,
  deviceTier: 'high',
  reducedMotion: false,
  quality: 1,

  setActiveChapter: (n: number) => set({ activeChapter: n }),
  setScrollProgress: (n: number) => set({ scrollProgress: n }),
  setDeviceTier: (tier: 'low' | 'medium' | 'high') => set({ deviceTier: tier }),
  setReducedMotion: (b: boolean) => set({ reducedMotion: b }),
  setQuality: (n: number) => set({ quality: n }),
}))
