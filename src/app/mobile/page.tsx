'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Battery, Wifi, Signal, Anchor, BarChart3, Settings, X } from 'lucide-react'
import { getMissions, getStats, type Mission } from '@/lib/api'
import oceanAnalysis from '@/data/ocean_analysis.json'

const FEATURES = [
  {
    title: 'Live ocean telemetry',
    detail:
      'Collection events stream into the app the moment a robot logs them — amount, location, and timestamp for every pickup.',
  },
  {
    title: 'Mission tracking',
    detail:
      'Field teams tick off conservation missions on the go, with progress that syncs back to the central dashboard.',
  },
  {
    title: 'AI ocean assistant',
    detail:
      'The same companion that explains the story on the web fits in your pocket — instant answers to reef, plastic, and robotics questions.',
  },
]

type TabId = 'mission' | 'impact' | 'settings'

const TABS: { id: TabId; label: string; icon: typeof Anchor }[] = [
  { id: 'mission', label: 'Mission', icon: Anchor },
  { id: 'impact', label: 'Impact', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const SETTINGS_ROWS = [
  { label: 'Telemetry sync', note: 'Push events to dashboard', defaultOn: true },
  { label: 'Offline mode', note: 'Queue changes without signal', defaultOn: true },
  { label: 'Notifications', note: 'Alert on new debris hotspots', defaultOn: false },
]

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label="Toggle setting"
      onClick={() => setOn((v) => !v)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        on ? 'bg-cyan-400/70' : 'bg-white/15'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
          on ? 'left-[18px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

export default function MobilePage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [totalPlastic, setTotalPlastic] = useState(1804)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('mission')

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

  const metrics = oceanAnalysis.metrics

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">
              Mobile companion experience
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Support field teams with a lightweight, practical companion experience.
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
          >
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

            <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[2.2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.12),_transparent_45%),_#010B13]">
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

              {/* App header */}
              <div className="px-5 pb-3 pt-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80">
                  AquaGuardian
                </p>
                <p className="mt-1 text-lg font-semibold text-white">Field companion</p>
              </div>

              {/* Tab content */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                <AnimatePresence mode="wait" initial={false}>
                  {activeTab === 'mission' && (
                    <motion.div
                      key="mission"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
                          Collected to date
                        </p>
                        <p className="mt-1 font-numeric text-3xl font-semibold text-white">
                          {loading ? '…' : totalPlastic.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-[10px] text-text-muted">pieces of debris</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">
                          Active missions
                        </p>
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
                    </motion.div>
                  )}

                  {activeTab === 'impact' && (
                    <motion.div
                      key="impact"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            label: 'Items collected',
                            value: metrics.totalItemsCollected.toLocaleString(),
                          },
                          { label: 'Weight', value: `${metrics.totalWeightKg} kg` },
                          { label: 'CO₂ offset', value: `${metrics.estimatedCo2SavedKg} kg` },
                          {
                            label: 'Collection events',
                            value: String(metrics.totalCollectionEvents),
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                          >
                            <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">
                              {stat.label}
                            </p>
                            <p className="mt-1 font-numeric text-sm font-semibold text-white">
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400/70">
                          Top hotspot
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-white">
                          {metrics.topCollectionZone}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-4 text-text-muted">
                          Highest simulated debris density this cycle.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        {SETTINGS_ROWS.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-xs text-white">{row.label}</p>
                              <p className="text-[10px] text-text-muted">{row.note}</p>
                            </div>
                            <Toggle defaultOn={row.defaultOn} />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-text-muted">
                          <X className="h-3 w-3" strokeWidth={2} /> Logged in as Field Team 07
                        </p>
                        <p className="mt-0.5 text-[10px] leading-4 text-text-muted">
                          Everything syncs to the dashboard — even offline.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab bar */}
              <div className="flex items-stretch border-t border-white/10 bg-[#010B13]/90">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-label={`${tab.label} tab`}
                      className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                        active ? 'text-cyan-300' : 'text-text-muted hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="mobile-tab-indicator"
                          className="absolute top-0 h-0.5 w-8 rounded-full bg-cyan-400"
                        />
                      )}
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      <span className="text-[9px] uppercase tracking-[0.15em]">{tab.label}</span>
                    </button>
                  )
                })}
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
                  <span className="mr-3 text-gold-400/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
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
