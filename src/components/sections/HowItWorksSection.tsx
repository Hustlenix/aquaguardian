'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { Satellite, Search, Trees } from 'lucide-react'

const STEPS = [
  {
    step: 1,
    icon: Satellite,
    title: 'Deploy & Monitor',
    description:
      'A fleet of autonomous AquaGuardian units is deployed across target ocean regions. Using real-time satellite coordination, each unit begins continuous water quality monitoring and surface patrol.',
  },
  {
    step: 2,
    icon: Search,
    title: 'Analyze & Detect',
    description:
      'On-board AI processes multi-spectral sensor data to identify pollution sources, track marine life, and detect environmental anomalies with 98% accuracy — all without human intervention.',
  },
  {
    step: 3,
    icon: Trees,
    title: 'Clean & Restore',
    description:
      'Upon detecting threats, AquaGuardian autonomously deploys containment and filtration systems. Collected data is relayed to scientists, enabling informed conservation strategies at scale.',
  },
]

export default function HowItWorksSection() {
  return (
    <SectionWrapper id="how-it-works">
      <h2 className="heading-lg text-cyan-400 text-center mb-4">
        HOW IT WORKS
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-16">
        From deployment to restoration — a three-phase system that operates
        continuously to protect our oceans.
      </p>

      {/* Steps with connecting line */}
      <div className="relative max-w-5xl mx-auto">
        {/* Vertical connecting line - gradient */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent hidden md:block" />

        <div className="space-y-12 md:space-y-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative md:flex md:items-start md:gap-8 md:even:flex-row-reverse"
              >
                {/* Step number badge (desktop) */}
                <div className="hidden md:flex md:w-1/2 md:justify-end md:items-start md:pt-4 md:even:justify-start">
                  <div className="flex items-center gap-4">
                    {index % 2 === 0 && (
                      <div className="text-right">
                        <span className="block text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-1">
                          Step {step.step}
                        </span>
                        <h3 className="heading-md text-white">{step.title}</h3>
                      </div>
                    )}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/15 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg shadow-cyan-400/5">
                      <Icon size={28} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                    {index % 2 !== 0 && (
                      <div>
                        <span className="block text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-1">
                          Step {step.step}
                        </span>
                        <h3 className="heading-md text-white">{step.title}</h3>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className="md:w-1/2 md:pt-4">
                  {/* Mobile: icon + title row */}
                  <div className="flex items-center gap-4 mb-4 md:hidden">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/15 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-400/5">
                      <Icon size={22} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="block text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-0.5">
                        Step {step.step}
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <GlassPanel className="hover-lift">
                    <p className="text-body text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </GlassPanel>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
