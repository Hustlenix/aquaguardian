'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'

const MEMBERS = ['Darmigan', 'Sanjay', 'Inba Arasan']

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
      <h2 className="heading-lg text-gold-400 text-center mb-4">THE TEAM</h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        Three students building AquaGuardian to make ocean restoration visible — a robot concept
        backed by a working interactive story.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {MEMBERS.map((name) => (
          <motion.div key={name} variants={itemVariants}>
            <GlassPanel className="text-center h-full flex flex-col items-center p-8">
              <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-white/10 flex items-center justify-center mb-5">
                <span
                  className="text-xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {name.charAt(0)}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{name}</h3>
              <p className="text-body text-xs text-text-muted">AquaGuardian team</p>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Link href="/team" className="btn-primary inline-flex items-center gap-2">
          Meet the team
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </motion.div>
    </SectionWrapper>
  )
}
