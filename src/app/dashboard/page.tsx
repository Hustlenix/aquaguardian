'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { impactFacts, missionBlueprints } from '@/data/impactData'
import oceanAnalysis from '@/data/ocean_analysis.json'
import { getStats, type CollectionEntry } from '@/lib/api'

interface PipelineMetrics {
  totalItemsCollected: number
  totalWeightKg: number
  estimatedCo2SavedKg: number
  totalCollectionEvents: number
  topCollectionZone: string
  generatedAt: string
}

interface StatsState {
  collections: CollectionEntry[]
  totalPlastic: number
  pipeline?: PipelineMetrics
}

/**
 * Collection sparkline data source: the `collections` time series from the
 * stats payload (database.json served by /api/stats in server mode, bundled
 * fallback on static Pages). ocean_analysis.json holds aggregate metrics only
 * (no per-event series), so the last 12 collection events are the most
 * granular trend available in both modes.
 */
function CollectionChart({ entries }: { entries: CollectionEntry[] }) {
  const bars = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    return sorted.slice(-12)
  }, [entries])

  if (bars.length === 0) {
    return <p className="mt-6 text-sm text-text-muted">No collection events available yet.</p>
  }

  const W = 720
  const H = 180
  const PAD = 24
  const maxAmount = Math.max(...bars.map((b) => b.amount), 1)
  const barW = (W - PAD * 2) / bars.length
  const shortLocation = (loc: string) =>
    loc.replace('Great Pacific Garbage Patch', 'GPGP').replace('North Atlantic Gyre', 'NA Gyre').split(' ')[0]

  return (
    <svg
      viewBox={`0 0 ${W} ${H + PAD}`}
      className="mt-6 w-full"
      role="img"
      aria-label="Bar chart of the last 12 collection events"
    >
      {/* Baseline */}
      <line x1={PAD} y1={H} x2={W - PAD} y2={H} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {bars.map((bar, i) => {
        const h = (bar.amount / maxAmount) * (H - PAD)
        const x = PAD + i * barW + barW * 0.18
        const y = H - h
        const isMax = bar.amount === maxAmount
        return (
          <g key={`${bar.timestamp}-${i}`}>
            <rect
              x={x}
              y={y}
              width={barW * 0.64}
              height={h}
              rx={3}
              fill={isMax ? 'rgba(212,175,55,0.85)' : 'rgba(0,229,255,0.55)'}
            >
              <title>{`${bar.location}: ${bar.amount} pieces (${bar.timestamp})`}</title>
            </rect>
            <text
              x={x + barW * 0.32}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(232,240,240,0.75)"
            >
              {bar.amount}
            </text>
            <text
              x={x + barW * 0.32}
              y={H + 16}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(138,154,160,0.8)"
            >
              {shortLocation(bar.location)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Horizontal per-zone bars, built from the bundled ocean_analysis.json
 * location breakdown (identical in server and static modes). Pure SVG.
 */
function LocationBreakdown() {
  const zones = useMemo(() => {
    const entries = Object.entries(oceanAnalysis.locationBreakdown).sort(
      (a, b) => b[1] - a[1]
    )
    const total = entries.reduce((sum, [, amount]) => sum + amount, 0)
    return { entries, total }
  }, [])

  const W = 720
  const ROW_H = 40
  const LABEL_W = 170
  const MAX_BAR_W = W - LABEL_W - 60

  return (
    <svg viewBox={`0 0 ${W} ${zones.entries.length * ROW_H}`} className="mt-6 w-full" role="img" aria-label="Bar chart of collected debris by ocean zone">
      {zones.entries.map(([location, amount], i) => {
        const barW = (amount / zones.entries[0][1]) * MAX_BAR_W
        const y = i * ROW_H + 8
        const isTop = i === 0
        const share = ((amount / zones.total) * 100).toFixed(1)
        return (
          <g key={location}>
            <text x={0} y={y + 14} fontSize="11" fill="rgba(232,240,240,0.8)">
              {location}
            </text>
            <rect x={LABEL_W} y={y} width={barW} height={16} rx={4} fill={isTop ? 'rgba(212,175,55,0.85)' : 'rgba(0,229,255,0.45)'}>
              <title>{`${location}: ${amount} pieces (${share}%)`}</title>
            </rect>
            <text x={LABEL_W + barW + 8} y={y + 13} fontSize="11" fill="rgba(232,240,240,0.75)">
              {amount}
            </text>
            <text x={W - 4} y={y + 13} textAnchor="end" fontSize="10" fill="rgba(138,154,160,0.8)">
              {share}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsState>({
    collections: [],
    totalPlastic: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getStats()
      .then((data) => {
        if (!active) return
        setStats({
          collections: data.collections ?? [],
          totalPlastic: data.totalPlastic ?? 0,
          // Static mode: keep the pipeline caption from the build-time dataset.
          pipeline:
            (data as { pipeline?: PipelineMetrics }).pipeline ?? {
              ...oceanAnalysis.metrics,
              generatedAt: oceanAnalysis.generatedAt,
            },
        })
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setStats({
          collections: [],
          totalPlastic: oceanAnalysis.metrics.totalItemsCollected,
          pipeline: {
            ...oceanAnalysis.metrics,
            generatedAt: oceanAnalysis.generatedAt,
          },
        })
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const totalCollected = useMemo(() => {
    if (stats.pipeline) return stats.pipeline.totalItemsCollected
    return stats.collections.reduce((sum, entry) => sum + (entry.amount ?? 0), 0)
  }, [stats])

  const trackedEntries = useMemo(() => {
    if (stats.pipeline) return stats.pipeline.totalCollectionEvents
    return stats.collections?.length ?? 0
  }, [stats])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">Ocean Impact Dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Live conservation context, grounded in real-world evidence.
            </h1>
          </div>
          <Link href="/" className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10">
            Back to story
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Tracked entries (simulated)</p>
            <p className="mt-3 text-3xl font-semibold">{loading ? '…' : trackedEntries}</p>
            <p className="mt-2 text-sm text-text-muted">Demo pipeline output — not real collection records.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Items collected (simulated)</p>
            <p className="mt-3 text-3xl font-semibold">{loading ? '…' : `${totalCollected} pieces`}</p>
            <p className="mt-2 text-sm text-text-muted">A generated demo dataset — not actual measurements.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Ocean context</p>
            <p className="mt-3 text-3xl font-semibold">Real data</p>
            <p className="mt-2 text-sm text-text-muted">The facts below are anchored to published conservation and ocean assessments.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#041525]/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">Collections — last 12 events</h2>
              <p className="mt-2 text-sm text-text-muted">
                Each bar is one logged collection: amount of debris and zone. Gold marks the largest event.
              </p>
            </div>
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-400">
              {stats.pipeline?.generatedAt ? `as of ${stats.pipeline.generatedAt.slice(0, 10)}` : 'live'}
            </span>
          </div>
          <CollectionChart entries={stats.collections} />
        </section>

        {stats.pipeline && (
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/60">
            Offline telemetry: native C → Python pipeline · generated {stats.pipeline.generatedAt} · top zone{' '}
            {stats.pipeline.topCollectionZone} · est. {stats.pipeline.totalWeightKg} kg ·{' '}
            {stats.pipeline.estimatedCo2SavedKg} kg CO₂ offset
          </p>
        )}

        <section className="rounded-3xl border border-white/10 bg-[#041525]/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">Debris by collection zone</h2>
              <p className="mt-2 text-sm text-text-muted">
                Simulated distribution of the {oceanAnalysis.metrics.totalItemsCollected} logged
                pieces across monitoring zones — the {oceanAnalysis.metrics.topCollectionZone} is
                the current hotspot.
              </p>
            </div>
          </div>
          <LocationBreakdown />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-[#041525]/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-semibold text-white">Evidence-backed ocean context</h2>
            <div className="mt-6 space-y-4">
              {impactFacts.map((fact) => (
                <motion.div
                  key={fact.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-medium text-white">{fact.title}</p>
                    <span className="rounded-full bg-gold-400/10 px-3 py-1 text-sm text-gold-400">{fact.value}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{fact.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400/70">Source: {fact.source}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Mission blueprints</h2>
            <div className="mt-6 space-y-4">
              {missionBlueprints.map((item) => (
                <div key={item.name} className="rounded-2xl border border-white/10 bg-[#010B13]/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-medium text-white">{item.name}</p>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-400">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{item.focus}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold-400/70">{item.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
