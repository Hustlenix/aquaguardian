'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, CalendarDays, Trophy, Star } from 'lucide-react'
import {
  getChallenges,
  joinChallenge,
  isChallengeJoined,
  getLeaderboard,
  type Challenge,
  type LeaderboardEntry,
} from '@/lib/api'

const DIFFICULTY_STYLES: Record<Challenge['difficulty'], string> = {
  Easy: 'bg-cyan-400/15 text-cyan-300',
  Medium: 'bg-gold-400/15 text-gold-400',
  Hard: 'bg-red-400/15 text-red-300',
}

type ChallengeStatus = 'open' | 'closing' | 'closed'

function challengeStatus(deadline: string): ChallengeStatus {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff < 0) return 'closed'
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'closing'
  return 'open'
}

const STATUS_STYLES: Record<ChallengeStatus, string> = {
  open: 'bg-cyan-400/15 text-cyan-300',
  closing: 'bg-amber-400/15 text-amber-300',
  closed: 'bg-white/10 text-text-muted',
}

const STATUS_LABELS: Record<ChallengeStatus, string> = {
  open: 'Open',
  closing: 'Closing soon',
  closed: 'Closed',
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
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [leaderboard] = useState<LeaderboardEntry[]>(getLeaderboard)

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

  // First click arms the confirm state; second click commits the join.
  const handleJoinClick = (id: string) => {
    if (joined.has(id)) return
    if (confirmingId !== id) {
      setConfirmingId(id)
      return
    }
    setConfirmingId(null)
    void handleJoin(id)
  }

  const featured = challenges[0]
  const rest = challenges.slice(1)

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

        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-r from-gold-400/70 via-gold-400/25 to-cyan-400/60 p-[1.5px] shadow-[0_20px_80px_rgba(212,175,55,0.12)]"
          >
            <div className="flex flex-col gap-6 rounded-[calc(1.5rem-1.5px)] bg-[#041525]/95 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-400">
                    <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Featured challenge
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${DIFFICULTY_STYLES[featured.difficulty]}`}
                  >
                    {featured.difficulty}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${STATUS_STYLES[challengeStatus(featured.deadline)]}`}
                  >
                    {STATUS_LABELS[challengeStatus(featured.deadline)]}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[0.04em] text-white">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-text-muted">{featured.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {featured.participants} joined
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Deadline {formatDeadline(featured.deadline)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleJoinClick(featured.id)}
                disabled={joined.has(featured.id) || joining === featured.id}
                className={`shrink-0 rounded-full border px-6 py-3 text-sm transition disabled:opacity-60 ${
                  joined.has(featured.id)
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                    : confirmingId === featured.id
                      ? 'border-amber-400/60 bg-amber-400/15 text-amber-300 hover:bg-amber-400/25'
                      : 'border-gold-400/30 text-gold-400 hover:border-gold-400/60 hover:bg-gold-400/10'
                }`}
              >
                {joined.has(featured.id)
                  ? 'Joined ✓'
                  : confirmingId === featured.id
                    ? 'Confirm join?'
                    : 'Join challenge'}
              </button>
            </div>
          </motion.article>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          {rest.map((challenge, index) => {
            const isJoined = joined.has(challenge.id)
            const status = challengeStatus(challenge.deadline)
            return (
              <motion.article
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-gold-400/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${DIFFICULTY_STYLES[challenge.difficulty]}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${STATUS_STYLES[status]}`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
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
                  onClick={() => handleJoinClick(challenge.id)}
                  disabled={isJoined || joining === challenge.id}
                  className={`mt-5 rounded-full border px-5 py-2 text-sm transition disabled:opacity-60 ${
                    isJoined
                      ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                      : confirmingId === challenge.id
                        ? 'border-amber-400/60 bg-amber-400/15 text-amber-300 hover:bg-amber-400/25'
                        : 'border-gold-400/30 text-gold-400 hover:border-gold-400/60 hover:bg-gold-400/10'
                  }`}
                >
                  {isJoined
                    ? 'Joined ✓'
                    : confirmingId === challenge.id
                      ? 'Confirm join?'
                      : 'Join challenge'}
                </button>
              </motion.article>
            )
          })}
        </section>

        {loading && <p className="text-center text-sm text-text-muted">Loading challenges…</p>}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">Community leaderboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Most active guardians</h2>
            </div>
            <span className="rounded-full bg-gold-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-gold-400">
              Demo data
            </span>
          </div>
          <ul className="mt-6 space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.li
                key={entry.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#010B13]/70 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-sm font-semibold text-gold-400">
                  {entry.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{entry.name}</p>
                  <p className="text-xs text-text-muted">Guardian #{index + 1}</p>
                </div>
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-cyan-400/70" strokeWidth={1.5} />
                  <span className="font-numeric text-lg font-semibold text-cyan-300">
                    {entry.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-muted">pts</span>
                </span>
              </motion.li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-text-muted">
            Illustrative demo entries for the concept — not real user data.
          </p>
        </section>
      </div>
    </main>
  )
}
