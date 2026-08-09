'use client'

import { useEffect, useRef, useState } from 'react'
import { Droplets, Gamepad2, Keyboard, Trash2, Volume2, VolumeX } from 'lucide-react'
import { useHud } from '@/store/useHud'
import { useStore } from '@/store/useStore'
import {
  bindAudioGestures,
  isMuted,
  resumeAudio,
  setMobileDefault,
  suspendAudio,
  toggleMuted,
} from '@/lib/audio'
/**
 * Scene HUD — lives in the first viewport, floating above the 3D canvas
 * (top-right glass panel, bottom-center control hint). Score, ocean health
 * and the mute toggle are visible from second zero; the hint fades after the
 * first interaction or a few seconds.
 */
export default function SceneHUD() {
  const collected = useHud((s) => s.collected)
  const total = useHud((s) => s.total)
  const piloting = useHud((s) => s.piloting)
  const muted = useHud((s) => s.muted)
  const deviceTier = useStore((s) => s.deviceTier)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const [hintVisible, setHintVisible] = useState(true)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const health = total > 0 ? Math.round((collected / total) * 100) : 0

  // One-time wiring: unlock audio on first gesture, mobile starts silent,
  // suspend in background to save battery.
  useEffect(() => {
    bindAudioGestures()
    setMobileDefault(deviceTier !== 'high')
    useHud.getState().setMuted(isMuted())
    const onHide = () => suspendAudio()
    const onShow = () => resumeAudio()
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) onHide()
      else onShow()
    })
    return () => document.removeEventListener('visibilitychange', onShow)
  }, [deviceTier])

  // Fade the control hint after 8s or on first pilot input / collection.
  useEffect(() => {
    if (!hintVisible) return
    hintTimer.current = setTimeout(() => setHintVisible(false), 8000)
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current)
    }
  }, [hintVisible])

  useEffect(() => {
    if (piloting || collected > 0) setHintVisible(false)
  }, [piloting, collected])

  const onMuteClick = () => {
    useHud.getState().setMuted(toggleMuted())
  }

  return (
    <>
      {/* Score / health — top-right, floating with viewport padding */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none select-none">
        <div className="glass-panel-strong px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Collected</span>
            <span className="text-sm font-semibold text-white tabular-nums">
              {collected}
              <span className="text-white/40"> / {total}</span>
            </span>
          </div>

          <div className="h-6 w-px bg-white/10" aria-hidden="true" />

          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-gold-400" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Health</span>
            <span className="text-sm font-semibold text-white tabular-nums">{health}%</span>
          </div>

          <div className="h-6 w-px bg-white/10" aria-hidden="true" />

          <button
            type="button"
            onClick={onMuteClick}
            aria-label={muted ? 'Unmute ocean audio' : 'Mute ocean audio'}
            aria-pressed={muted}
            className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-gold-400/40 hover:bg-white/10 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            {muted ? (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {piloting && (
          <div className="mt-2 flex items-center justify-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-cyan-300">
              <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
              Piloting
            </span>
          </div>
        )}
      </div>

      {/* Control hint — bottom-center, desktop only, fades after first use */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden md:block transition-all duration-500 ${
          hintVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2'
        } ${reducedMotion ? 'transition-none' : ''}`}
        aria-hidden={!hintVisible}
      >
        <div className="glass-panel px-4 py-2.5 flex items-center gap-3 text-white/70">
          <Keyboard className="w-4 h-4 text-gold-400" aria-hidden="true" />
          <span className="text-xs tracking-wide">
            <span className="text-white">WASD / arrows</span> to pilot ·{' '}
            <span className="text-white">click debris</span> to collect
          </span>
        </div>
      </div>

      {/* Mobile mini-hint — one line, fades once something is collected */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none md:hidden transition-opacity duration-500 ${
          collected === 0 && deviceTier !== 'high' ? 'opacity-100' : 'opacity-0'
        } ${reducedMotion ? 'transition-none' : ''}`}
      >
        <span className="glass-panel px-3 py-1.5 text-[0.65rem] text-white/60">
          AquaGuardian is cleaning the depths
        </span>
      </div>
    </>
  )
}
