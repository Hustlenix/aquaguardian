'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const experiences = [
  {
    title: 'Live dashboard',
    description:
      'See ocean-impact metrics, mission context, and evidence-backed conservation insights.',
    href: '/dashboard',
    accent: 'text-cyan-400',
  },
  {
    title: 'Mission tracking',
    description:
      'Follow active conservation tracks, planned habitat reviews, and community engagement loops.',
    href: '/missions',
    accent: 'text-gold-400',
  },
  {
    title: 'Sustainability challenges',
    description:
      'Turn stewardship into guided participation with clear goals, rewards, and progress.',
    href: '/challenges',
    accent: 'text-cyan-400',
  },
  {
    title: 'Learn mode',
    description:
      'Teach ocean stewardship through guided educational modules with a clearer narrative.',
    href: '/learn',
    accent: 'text-gold-400',
  },
  {
    title: 'AI companion',
    description:
      'Let visitors ask what the mission means, how the robot works, and why the evidence matters.',
    href: '/assistant',
    accent: 'text-cyan-400',
  },
  {
    title: 'Mobile companion',
    description:
      'Support field teams with practical checklists, mission briefs, and shareable reports.',
    href: '/mobile',
    accent: 'text-gold-400',
  },
]

export default function ExperienceModesSection() {
  return (
    <section id="experience" className="section-padding relative">
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">Experience modes</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[0.08em] text-white sm:text-4xl">
            A fuller ocean story, not just a landing page.
          </h2>
          <p className="mt-4 text-lg leading-8 text-text-muted">
            The site includes an impact dashboard, mission tracking, challenge loops, educational
            modules, an AI companion, and a mobile field experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="glass-panel flex h-full flex-col justify-between rounded-3xl border border-white/10 p-6"
            >
              <div>
                <p className={`text-sm uppercase tracking-[0.3em] ${item.accent}`}>{item.title}</p>
                <p className="mt-4 text-base leading-7 text-text-muted">{item.description}</p>
              </div>
              <Link
                href={item.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-400 transition hover:text-gold-300"
              >
                Open experience
                <span aria-hidden="true">→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
