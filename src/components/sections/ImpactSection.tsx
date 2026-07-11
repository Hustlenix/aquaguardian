'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'

const stats = [
  { value: '125K', label: 'Tons of Plastic Collected', sub: 'and counting' },
  { value: '5,000', label: 'Oceans Monitored', sub: 'active stations' },
  { value: '850+', label: 'Species Protected', sub: 'marine habitats' },
  { value: '98%', label: 'Detection Accuracy', sub: 'AI-driven analysis' },
]

export default function ImpactSection() {
  return (
    <SectionWrapper id="impact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="heading-lg text-gradient-gold">OUR IMPACT</h2>
        <p className="text-elegant text-text-muted mt-4 max-w-2xl mx-auto">
          Real results through advanced technology and dedicated action.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="glass-panel p-6 text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-numeric text-gradient-gold mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-medium tracking-wide text-text uppercase mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-text-muted">
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
