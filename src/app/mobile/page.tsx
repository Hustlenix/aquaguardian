'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const mobileUseCases = [
  {
    title: 'Field checklist',
    detail: 'Helps teams capture observations and log activities while on site.',
  },
  {
    title: 'Offline-ready briefs',
    detail: 'Supports quick access to mission context, safety notes, and educational prompts.',
  },
  {
    title: 'Shareable reports',
    detail: 'Lets users send concise updates and evidence summaries back to the central platform.',
  },
]

export default function MobilePage() {
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

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">
              Practical workflows
            </p>
            <p className="mt-4 text-lg leading-8 text-text-muted">
              This layer is designed for teams in the field who need a fast, focused interface for
              mission context, checklists, and reporting without the full desktop experience.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {mobileUseCases.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#010B13]/70 p-5"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-gold-400/70">
                  Use case {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{item.detail}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
