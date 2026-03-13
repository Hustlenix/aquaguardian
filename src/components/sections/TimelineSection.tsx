'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import TridentIndicator from '@/components/ui/TridentIndicator'

const MILESTONES = [
  {
    period: 'Q1 2026',
    title: 'Concept & Research',
    description:
      'Foundational research and feasibility studies. Assembling the core team of marine biologists, AI researchers, and robotics engineers.',
  },
  {
    period: 'Q2 2026',
    title: 'Prototype Development',
    description:
      'Building the first functional prototype with AI navigation and basic sensor integration. Initial tank testing begins.',
  },
  {
    period: 'Q3 2026',
    title: 'Field Testing',
    description:
      'Deploying the prototype in controlled coastal environments. Iterating on AI models with real-world ocean data.',
  },
  {
    period: 'Q4 2026',
    title: 'Pilot Deployment',
    description:
      'Full-scale pilot deployment in partnership with marine conservation organizations. Monitoring and restoration missions commence.',
  },
  {
    period: '2027',
    title: 'Global Expansion',
    description:
      'Scaling the fleet across critical ocean regions worldwide. Establishing data partnerships and open research initiatives.',
  },
]

export default function TimelineSection() {
  return (
    <SectionWrapper id="timeline" className="relative">
      <h2 className="heading-lg text-center text-white mb-16">
        TIMELINE
      </h2>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line - solid color */}
        <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-gold-400/20 -translate-x-1/2" />

        {/* Scroll-tracking trident indicator */}
        <TridentIndicator />

        {/* Milestones */}
        <div className="space-y-16">
          {MILESTONES.map((milestone, index) => {
            const isLeft = index % 2 === 0

            return (
              <motion.div
                key={milestone.period}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex items-start gap-6 md:gap-0"
              >
                {/* Dot (always centered) */}
                <div className="absolute left-[10px] md:left-1/2 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-gold-400 bg-ocean-900 -translate-x-1/2 z-10 shadow-[0_0_12px_rgba(212,175,55,0.3)]" />

                {/* Card */}
                <div
                  className={`relative pl-10 md:pl-0 md:w-1/2 ${
                    isLeft ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <div className="glass-panel p-5 md:p-6">
                    <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-1">
                      {milestone.period}
                    </span>
                    <h3 className="heading-md text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-body text-xs leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                {isLeft && <div className="hidden md:block md:w-1/2" />}
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
