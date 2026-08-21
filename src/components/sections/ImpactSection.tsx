'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import CounterAnimation from '@/components/animations/CounterAnimation'

const MotionLink = motion.create(Link)

interface StatMapping {
  value: number
  label: string
  sub: string
  suffix: string
  prefix: string
}

const stats: StatMapping[] = [
  {
    value: 11,
    label: 'Tonnes of Plastic Entering Oceans Yearly',
    sub: 'OECD Global Plastics Outlook, 2022',
    suffix: 'M',
    prefix: '',
  },
  {
    value: 171,
    label: 'Pieces of Plastic Afloat in the Oceans',
    sub: 'Eriksen et al., PLOS ONE, 2023',
    suffix: 'T',
    prefix: '',
  },
  {
    value: 38,
    label: 'of Assessed Fish Stocks Overfished',
    sub: 'FAO SOFIA, 2024',
    suffix: '%',
    prefix: '',
  },
  {
    value: 8,
    label: 'of the Ocean Currently Protected',
    sub: 'UNEP-WCMC / Protected Planet',
    suffix: '%',
    prefix: '',
  },
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
        <h2 className="heading-lg text-gold-400">THE SCALE OF THE CHALLENGE</h2>
        <p className="text-elegant text-text-muted mt-4 max-w-2xl mx-auto">
          Real ocean-plastic and marine-health figures, cited to published sources
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <MotionLink
            key={stat.label}
            href={i === 0 ? '/dashboard' : i === 1 ? '/missions' : i === 2 ? '/learn' : '/assistant'}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-panel p-6 text-center block"
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
          </MotionLink>
        ))}
      </div>
    </SectionWrapper>
  )
}
