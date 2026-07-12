'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import CounterAnimation from '@/components/animations/CounterAnimation'

interface StatMapping {
  value: number
  label: string
  sub: string
  suffix: string
  prefix: string
}

const stats: StatMapping[] = [
  { value: 125, label: 'Plastic Collected per Unit', sub: 'target tons per year', suffix: 'K', prefix: 'Goal: ' },
  { value: 5000, label: 'Oceans Monitored', sub: 'target active stations', suffix: '+', prefix: 'Goal: ' },
  { value: 850, label: 'Species Protected', sub: 'target marine habitats', suffix: '+', prefix: 'Goal: ' },
  { value: 98, label: 'Detection Accuracy', sub: 'target AI-driven analysis', suffix: '%', prefix: 'Goal: ' },
]

export default function ImpactSection() {
  return (
    <SectionWrapper id="impact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-16"
      >
        <h2 className="heading-lg text-gold-400">OUR GOALS</h2>
        <p className="text-elegant text-text-muted mt-4 max-w-2xl mx-auto">
          Ambitious targets for ocean restoration by 2028
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-panel p-6 text-center"
            whileHover={{ translateY: -4, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl md:text-5xl font-bold text-numeric text-gold-400 mb-2">
              <CounterAnimation
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                duration={2}
                delay={i * 0.12 + 0.3}
              />
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
