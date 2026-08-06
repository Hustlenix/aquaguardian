'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Battery, Wifi, Signal } from 'lucide-react'
import { getMissions, getStats, type Mission } from '@/lib/api'

const FEATURES = [
  {
    title: 'Live ocean telemetry',
    detail: 'Collection events stream into the app the moment a robot logs them — amount, location, and timestamp for every pickup.',
  },
  {
    title: 'Mission tracking',
    detail: 'Field teams tick off conservation missions on the go, with progress that syncs back to the central dashboard.',
  },
  {
    title: 'AI ocean assistant',
    detail: 'The same companion that explains the story on the web fits in your pocket — instant answers to reef, plastic, and robotics questions.',
  },
]

export default function MobilePage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [totalPlastic, setTotalPlastic] = useState(1804)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getMissions(), getStats()]).then(([missionData, stats]) => {
      if (!active) return
      setMissions(missionData.slice(0, 3))
      setTotalPlastic(stats.totalPlastic ?? 1804)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">Mobile companion experience</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Support field teams with a lightweight, practical companion experience.
            </h1>
          </div>
          <Link href="/" className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10">
            Back to story
          </Link>
        </div>

        <section className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-20">
          {/* Phone frame mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-[300px] shrink-0 rounded-[2.6rem] border border-white/15 bg-[#041525] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Side buttons */}
            <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-full bg-white/20" />
            <div className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-full bg-white/20" />
            <div className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-full bg-white/20" />

            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.12),_transparent_45%),_#010B13]">
              {/* Notch / dynamic island */}
              <div className="absolute left-1/2 top-2.5 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pb-1 pt-3.5 text-[10px] text-white/80">
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  <Signal className="h-3 w-3" strokeWidth={1.5} />
                  <Wifi className="h-3 w-3" strokeWidth={1.5} />
                  <Battery className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </div>

              {/* Mini app UI */}
              <div className="space-y-4 px-5 pb-8 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80">AquaGuardian</p>
                  <p className="mt-1 text-lg font-semibold text-white">Field companion</p>
                </div>

                <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">Collected to date</p>
                  <p className="mt-1 font-numeric text-3xl font-semibold text-white">
                    {loading ? '…' : totalPlastic.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-muted">pieces of debris</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">Active missions</p>
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          mission.completed
                            ? 'border-cyan-400/50 bg-cyan-400/20 text-cyan-300'
                            : 'border-white/20 text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs text-white">{mission.title}</p>
                        <p className="text-[10px] text-text-muted">{mission.category}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400/70">Home screen</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-text-muted">
                    Everything syncs to the dashboard — even offline.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature bullets */}
          <div className="max-w-md space-y-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-white">
                  <span className="mr-3 text-gold-400/80">{String(index + 1).padStart(2, '0')}</span>
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-text-muted">{feature.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
