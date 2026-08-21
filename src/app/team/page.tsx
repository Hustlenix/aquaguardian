'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/sections/SectionWrapper'

const TEAM = [
  {
    name: 'Darmigan',
    focus: 'Robotics & Build',
    blurb:
      'Hands-on with the mechanical side of AquaGuardian — prototyping the collection mechanism and testing how the design holds up in real water conditions.',
  },
  {
    name: 'Sanjay',
    focus: 'Software & Systems',
    blurb:
      'Builds the software that drives the project — from the interactive 3D experience on this site to the logic that would guide an autonomous cleanup run.',
  },
  {
    name: 'Inba Arasan',
    focus: 'Design & Outreach',
    blurb:
      'Shapes how AquaGuardian looks and speaks — the visual identity, the story, and sharing the mission with new people at every opportunity.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function TeamPage() {
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <div className="min-h-screen bg-[#010B13] text-[#E8F0F0]">
      <div className="section-inner px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="heading-lg text-gold-400 mb-4">The Team</h1>
          <p className="text-elegant text-white/70 max-w-2xl mb-10">
            Three students on a mission to protect our oceans. AquaGuardian is our answer to
            plastic pollution — a robot concept that cleans waterways one dive at a time, and
            this site is where we make that vision tangible.
          </p>

          {/* Group photo */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-12">
            <div className="glass-panel-strong rounded-2xl overflow-hidden">
              {photoOk ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/images/team.jpg"
                  alt="The AquaGuardian team — Darmigan, Sanjay, and Inba Arasan"
                  className="w-full h-auto object-cover"
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-20 px-6 text-center bg-gradient-to-b from-cyan-400/5 to-transparent">
                  <span className="text-4xl" aria-hidden>
                    🌊
                  </span>
                  <p className="text-sm text-white/80 font-medium">Darmigan · Sanjay · Inba Arasan</p>
                  <p className="text-xs text-text-muted max-w-xs">
                    Team photo coming soon — check back shortly.
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted mt-3 text-center">
              The AquaGuardian team at a robotics exhibition.
            </p>
          </motion.div>

          <SectionWrapper id="members">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {TEAM.map((member) => (
                <motion.div key={member.name} variants={itemVariants}>
                  <div className="glass-panel h-full p-6 rounded-2xl flex flex-col">
                    <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-white/10 flex items-center justify-center mb-4">
                      <span
                        className="text-lg font-bold text-gold-400"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-white mb-1">{member.name}</h2>
                    <p className="text-xs tracking-[0.14em] uppercase text-cyan-400 mb-3">
                      {member.focus}
                    </p>
                    <p className="text-body text-xs leading-relaxed text-text-muted">
                      {member.blurb}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </SectionWrapper>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel-strong rounded-2xl p-8 mt-12 text-center"
          >
            <h2 className="heading-md text-white mb-3">Want to help?</h2>
            <p className="text-sm text-text-muted mb-6 max-w-xl mx-auto">
              We&apos;re looking for mentors, feedback, and anyone who cares about cleaner
              water. Subscribe on the homepage and we&apos;ll keep you posted.
            </p>
            <Link href="/#contact" className="btn-primary inline-flex items-center gap-2">
              Join the Mission
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
