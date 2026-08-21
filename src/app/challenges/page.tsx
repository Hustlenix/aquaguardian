'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, CalendarDays } from 'lucide-react'
import { getChallenges, joinChallenge, isChallengeJoined, type Challenge } from '@/lib/api'

const DIFFICULTY_STYLES: Record<Challenge['difficulty'], string> = {
  Easy: 'bg-cyan-400/15 text-cyan-300',
  Medium: 'bg-gold-400/15 text-gold-400',
  Hard: 'bg-red-400/15 text-red-300',
}

function formatDeadline(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [joined, setJoined] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getChallenges().then((data) => {
      if (!active) return
      setChallenges(data)
      setJoined(new Set(data.filter((c) => isChallengeJoined(c.id)).map((c) => c.id)))
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const handleJoin = async (id: string) => {
    setJoining(id)
    // Optimistic update.
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, participants: c.participants + 1 } : c))
    )
    setJoined((prev) => new Set(prev).add(id))
    try {
      const updated = await joinChallenge(id)
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch {
      // Non-fatal: local state already reflects the join.
    } finally {
      setJoining(null)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">Gamified sustainability challenges</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Turn stewardship into guided participation and progress.
            </h1>
          </div>
          <Link href="/" className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10">
            Back to story
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          {challenges.map((challenge, index) => {
            const isJoined = joined.has(challenge.id)
            return (
              <motion.article
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${DIFFICULTY_STYLES[challenge.difficulty]}`}
                  >
                    {challenge.difficulty}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {challenge.participants} joined
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {formatDeadline(challenge.deadline)}
                    </span>
                  </div>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{challenge.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-text-muted">{challenge.description}</p>
                <button
                  onClick={() => handleJoin(challenge.id)}
                  disabled={isJoined || joining === challenge.id}
                  className={`mt-5 rounded-full border px-5 py-2 text-sm transition disabled:opacity-60 ${
                    isJoined
                      ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                      : 'border-gold-400/30 text-gold-400 hover:border-gold-400/60 hover:bg-gold-400/10'
                  }`}
                >
                  {isJoined ? 'Joined ✓' : 'Join challenge'}
                </button>
              </motion.article>
            )
          })}
        </section>

        {loading && <p className="text-center text-sm text-text-muted">Loading challenges…</p>}
      </div>
    </main>
  )
}
