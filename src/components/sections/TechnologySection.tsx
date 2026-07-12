'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { Brain, Activity, Compass } from 'lucide-react'

const TECH_CARDS = [
  {
    icon: Brain,
    title: 'AI Core',
    description:
      'A neural network trained on millions of ocean data points enables real-time decision making, species identification, and adaptive mission planning in complex underwater environments.',
  },
  {
    icon: Activity,
    title: 'Sensor Array',
    description:
      'Multi-spectral sensors including sonar, LiDAR, chemical analyzers, and high-resolution cameras provide comprehensive environmental monitoring day and night.',
  },
  {
    icon: Compass,
    title: 'Autonomous Navigation',
    description:
      'Advanced SLAM algorithms and inertial navigation allow precise positioning and obstacle avoidance in deep-sea conditions where GPS is unavailable.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function TechnologySection() {
  return (
    <SectionWrapper id="technology">
      <h2 className="heading-lg text-cyan-400 text-center mb-12">
        TECHNOLOGY
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {TECH_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              className="hover-lift"
            >
              <GlassPanel strong className="text-center h-full">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/15 to-cyan-400/5 text-cyan-400 mb-5 border border-cyan-400/10"
                  whileInView={{ rotate: [0, 360] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </motion.div>
                <h3 className="heading-md text-white mb-3">{card.title}</h3>
                <p className="text-body text-sm leading-relaxed">
                  {card.description}
                </p>
              </GlassPanel>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
