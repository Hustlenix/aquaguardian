'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const modules = [
  {
    title: 'Why ocean health matters',
    description:
      'Explain why marine ecosystems support climate, food systems, and coastal resilience.',
    detail: 'Use cases: school outreach, public workshops, and environmental education tours.',
  },
  {
    title: 'How marine debris affects biodiversity',
    description: 'Show how pollution, ghost gear, and plastic harm habitats and food webs.',
    detail: 'Great for museum exhibits and classroom demos.',
  },
  {
    title: 'How autonomous monitoring works',
    description: 'Introduce the role of sensors, AI, and robotics in environmental stewardship.',
    detail: 'Ideal for research communication and stakeholder briefings.',
  },
]

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.16),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">
              Interactive educational mode
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Teach ocean stewardship through guided, interactive learning.
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
          >
            Back to story
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          {modules.map((module, index) => (
            <motion.article
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">
                Module {index + 1}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{module.title}</h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">{module.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-gold-400/70">
                {module.detail}
              </p>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  )
}
