'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const assistantTips = [
  {
    title: 'Explain the mission',
    detail:
      'Summarize why coastal monitoring and habitat protection matter in straightforward language.',
  },
  {
    title: 'Explain the robotics',
    detail: 'Describe how sensors, autonomy, and data collection work together in the field.',
  },
  {
    title: 'Explain the evidence',
    detail: 'Connect the experience to real ocean conservation facts and local impact stories.',
  },
]

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">
              AI assistant companion
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Give visitors a guided explanation layer for the mission and technology.
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
          >
            Back to story
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">Companion mode</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              “Ask what the scene means, what the robot is doing, or why it matters.”
            </h2>
            <p className="mt-4 text-lg leading-8 text-text-muted">
              This experience can connect the story to evidence, explain the mission, and give users
              a simple layer of support as they explore the 3D narrative.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {assistantTips.map((tip, index) => (
              <motion.article
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#010B13]/70 p-5"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-gold-400/70">
                  Prompt {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{tip.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{tip.detail}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
