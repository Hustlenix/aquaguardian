'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { impactFacts, missionBlueprints } from '@/data/impactData'

interface StatsResponse {
  collections?: Array<{ amount: number; location: string; timestamp: string }>
  totalPlastic?: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setStats(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const totalCollected = useMemo(() => {
    const entries = stats.collections ?? []
    return entries.reduce((sum, entry) => sum + (entry.amount ?? 0), 0)
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
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Tracked entries</p>
            <p className="mt-3 text-3xl font-semibold">{loading ? '…' : (stats.collections?.length ?? 0)}</p>
            <p className="mt-2 text-sm text-text-muted">Submitted through the app’s collection API.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Estimated impact</p>
            <p className="mt-3 text-3xl font-semibold">{loading ? '…' : `${totalCollected} pieces`}</p>
            <p className="mt-2 text-sm text-text-muted">A practical local tally from the app’s data feed.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Reference basis</p>
            <p className="mt-3 text-3xl font-semibold">Real data</p>
            <p className="mt-2 text-sm text-text-muted">Metrics are anchored to published conservation and ocean assessments.</p>
          </div>
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
