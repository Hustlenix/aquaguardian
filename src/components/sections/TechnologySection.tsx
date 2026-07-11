'use client'

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

export default function TechnologySection() {
  return (
    <SectionWrapper id="technology">
      <h2 className="heading-lg text-gradient-cyan text-center mb-12">
        TECHNOLOGY
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TECH_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <GlassPanel key={card.title} strong className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/10 to-cyan-400/5 text-cyan-400 mb-6">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="heading-md text-white mb-3">{card.title}</h3>
              <p className="text-body text-sm leading-relaxed">
                {card.description}
              </p>
            </GlassPanel>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
