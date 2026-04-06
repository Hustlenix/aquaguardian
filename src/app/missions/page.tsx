'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const missionTracks = [
  {
    title: 'River cleanup scan',
    stage: 'Active',
    detail: 'Focuses on river mouths and urban coastlines where debris accumulates and local action can be highly visible.',
  },
  {
    title: 'Habitat condition review',
    stage: 'Planned',
    detail: 'Tracks reef health, water quality, and habitat change over time using repeated observations.',
  },
  {
    title: 'Volunteer engagement loop',
    stage: 'Pilot',
    detail: 'Connects local actions with measurable impact stories that can be shared with schools and communities.',
  },
]

export default function MissionsPage() {
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

        <section className="grid gap-6 lg:grid-cols-3">
          {missionTracks.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">{item.stage}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">{item.detail}</p>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  )
}
