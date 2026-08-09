'use client'

import { create } from 'zustand'

/**
 * Lightweight HUD/telemetry store for the interactive scene.
 *
 * The 3D scene itself runs on refs inside useFrame (zero re-renders), so the
 * DOM HUD can't read it directly. This store is the single bridge between the
 * frame loop and React UI:
 *
 *  - `collected` / `total` drive "Trash Collected: X / N" and "Ocean Health".
 *    The robot calls `collect()` the moment it hides a debris mesh; Seabed
 *    calls `respawn()` when an item comes back.
 *  - `sceneReady` flips when the WebGL canvas has created the scene — the
 *    preloader fades out after that.
 *  - `piloting` reflects WASD/arrow pilot mode so the HUD can show a badge.
 *  - `muted` mirrors the Web Audio mute state for the volume icon.
 */
interface HudState {
  collected: number
  total: number
  sceneReady: boolean
  piloting: boolean
  muted: boolean

  collect: () => void
  respawn: () => void
  setTotal: (n: number) => void
  setSceneReady: (b: boolean) => void
  setPiloting: (b: boolean) => void
  setMuted: (b: boolean) => void
}

export const useHud = create<HudState>((set) => ({
  collected: 0,
  total: 0,
  sceneReady: false,
  piloting: false,
  muted: false,

  collect: () => set((s) => ({ collected: Math.min(s.collected + 1, s.total || Infinity) })),
  respawn: () => set((s) => ({ collected: Math.max(s.collected - 1, 0) })),
  setTotal: (n) => set((s) => ({ total: n, collected: Math.min(s.collected, n) })),
  setSceneReady: (b) => set({ sceneReady: b }),
  setPiloting: (b) => set({ piloting: b }),
  setMuted: (b) => set({ muted: b }),
}))

/** 0..1 progress of the cleanup — used by the fog/clarity feedback. */
export function selectCleanupRatio(s: HudState): number {
  return s.total > 0 ? s.collected / s.total : 0
}
