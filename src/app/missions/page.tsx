'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, RotateCcw } from 'lucide-react'
import {
  getMissions,
  toggleMission,
  resetMissionProgress,
  type Mission,
} from '@/lib/api'

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getMissions().then((data) => {
      if (!active) return
      setMissions(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const completedCount = missions.filter((m) => m.completed).length
  const total = missions.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0

  const handleToggle = async (id: string) => {
    setToggling(id)
    // Optimistic update — flip immediately, reconcile with the API result.
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    )
    try {
      const updated = await toggleMission(id)
      setMissions((prev) => prev.map((m) => (m.id === id ? updated : m)))
    } catch {
      // Non-fatal: optimistic state already reflects the toggle locally.
    } finally {
      setToggling(null)
    }
  }

  const handleReset = () => {
    resetMissionProgress()
    setMissions((prev) => prev.map((m) => ({ ...m, completed: false })))
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">Mission tracking</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Track conservation missions with clear stages and evidence.
            </h1>
          </div>
          <Link href="/" className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10">
            Back to story
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">Mission progress</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {loading ? '…' : `${completedCount} / ${total} complete`}
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={loading || completedCount === 0}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-text-muted transition hover:border-gold-400/40 hover:text-gold-400 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Reset progress
            </button>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-gold-400"
              initial={false}
              animate={{ width: loading ? '0%' : `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {missions.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`flex flex-col rounded-3xl border p-6 backdrop-blur-xl transition-colors ${
                item.completed
                  ? 'border-cyan-400/30 bg-cyan-400/5'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">{item.category}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.completed
                      ? 'bg-cyan-400/15 text-cyan-300'
                      : 'bg-gold-400/10 text-gold-400'
                  }`}
                >
                  {item.completed ? 'Completed' : `+${item.impact} kg impact`}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-text-muted">{item.description}</p>
              <button
                onClick={() => handleToggle(item.id)}
                disabled={toggling === item.id}
                className={`mt-5 flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition disabled:opacity-60 ${
                  item.completed
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20'
                    : 'border-gold-400/30 text-gold-400 hover:border-gold-400/60 hover:bg-gold-400/10'
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={1.5} />
                {item.completed ? 'Completed — tap to undo' : 'Mark complete'}
              </button>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  )
}
