'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'

const STATS = [
  {
    number: '8M',
    unit: 'tons',
    label: 'of plastic enter oceans yearly',
    color: 'text-gold-400',
  },
  {
    number: '90%',
    unit: '',
    label: 'of fish stocks depleted',
    color: 'text-gold-400',
  },
  {
    number: '30%',
    unit: '',
    label: 'of coral reefs destroyed',
    color: 'text-gold-400',
  },
  {
    number: '1M',
    unit: 'species',
    label: 'face extinction from ocean degradation',
    color: 'text-gold-400',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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

export default function ProblemSection() {
  return (
    <SectionWrapper id="problem">
        <h2 className="heading-lg text-center text-gold-400 mb-4">
          THE CRISIS
        </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        Our oceans are in peril. Decades of neglect have pushed marine
        ecosystems to the brink. The time for action is now.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <GlassPanel className="text-center">
              <div className="mb-2">
                <span
                  className={`text-numeric ${stat.color} text-4xl md:text-5xl font-bold`}
                >
                  {stat.number}
                </span>
                {stat.unit && (
                  <span className="text-numeric text-gold-400/70 text-lg ml-1">
                    {stat.unit}
                  </span>
                )}
              </div>
              <p className="text-body text-xs uppercase tracking-widest">
                {stat.label}
              </p>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
