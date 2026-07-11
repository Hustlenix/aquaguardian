'use client'

import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { Droplets, Shield, RefreshCw } from 'lucide-react'

const MISSION_CARDS = [
  {
    icon: Droplets,
    title: 'Clean',
    description:
      'Remove plastic waste and pollutants from ocean waters using advanced filtration and autonomous collection systems.',
  },
  {
    icon: Shield,
    title: 'Protect',
    description:
      'Safeguard marine biodiversity by monitoring ecosystems and detecting environmental threats in real time.',
  },
  {
    icon: RefreshCw,
    title: 'Restore',
    description:
      'Rebuild damaged coral reefs and coastal habitats through precision deployment and AI-guided restoration efforts.',
  },
]

export default function MissionSection() {
  return (
    <SectionWrapper id="mission">
      {/* Heading */}
      <h2 className="heading-lg text-gradient-cyan text-center mb-4">
        OUR MISSION
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        To deploy intelligent autonomous systems that heal the ocean &mdash;
        cleaning its waters, protecting its life, and restoring its ecosystems
        at a scale never before possible.
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MISSION_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <GlassPanel key={card.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-400/10 text-gold-400 mb-5">
                <Icon size={24} strokeWidth={1.5} />
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
