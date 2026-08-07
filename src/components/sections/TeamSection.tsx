'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'

const PROJECT_NOTE = {
  title: 'A concept experience',
  body: 'AquaGuardian is a personal portfolio project — a fictional-but-grounded vision of autonomous ocean restoration. No hardware exists, no company is behind it, and no team is named here. The site exists to make ocean-conservation concepts tangible through an interactive 3D story, and to demonstrate frontend engineering across Next.js, Three.js, and motion design.',
  secondary:
    'The robot, its specs, and its "mission results" are illustrative narrative elements — real-world ocean statistics shown across the site are cited to published sources (OECD, UNEP, FAO, and peer-reviewed studies).',
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function TeamSection() {
  return (
    <SectionWrapper id="team">
      <h2 className="heading-lg text-gold-400 text-center mb-4">ABOUT THIS PROJECT</h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        A concept built to make ocean-restoration ideas visible — and to show what modern frontend
        engineering can do.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 gap-6"
      >
        <motion.div variants={itemVariants}>
          <GlassPanel className="text-center h-full flex flex-col items-center p-8">
            <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-white/10 flex items-center justify-center mb-5">
              <span
                className="text-xl font-bold text-white/80"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                🌊
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{PROJECT_NOTE.title}</h3>
            <p className="text-body text-xs leading-relaxed max-w-2xl text-text-muted">
              {PROJECT_NOTE.body}
            </p>
            <p className="text-body text-xs leading-relaxed max-w-2xl mt-3 text-text-muted/70">
              {PROJECT_NOTE.secondary}
            </p>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
