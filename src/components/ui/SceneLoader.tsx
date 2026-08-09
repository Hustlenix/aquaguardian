'use client'

import { useEffect, useState } from 'react'
import { Waves } from 'lucide-react'
import { useHud } from '@/store/useHud'
import { useStore } from '@/store/useStore'

/**
 * Scene preloader — covers the first paint while the WebGL scene and the
 * robot model load. Hides once the canvas signals ready AND a minimum display
 * time (700ms) has passed so it never flashes; fades out over 400ms.
 */
export default function SceneLoader() {
  const sceneReady = useHud((s) => s.sceneReady)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [minElapsed, setMinElapsed] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (sceneReady && minElapsed) {
      const t = setTimeout(() => setGone(true), 450)
      return () => clearTimeout(t)
    }
  }, [sceneReady, minElapsed])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-5 bg-[#010B13] transition-opacity duration-400 ${
        sceneReady && minElapsed ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={sceneReady && minElapsed}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full border border-cyan-400/30 ${
            reducedMotion ? '' : 'animate-ping'
          }`}
          aria-hidden="true"
        />
        <div className="w-14 h-14 rounded-full border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center">
          <Waves className="w-6 h-6 text-cyan-300" aria-hidden="true" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold-400/90">
          AquaGuardian
        </p>
        <p className="mt-2 text-xs tracking-wide text-white/50">Initializing the ocean…</p>
      </div>
    </div>
  )
}
