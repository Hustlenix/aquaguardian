'use client'

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

export default function ProblemSection() {
  return (
    <SectionWrapper id="problem">
      <h2 className="heading-lg text-center text-white mb-4">
        THE CRISIS
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        Our oceans are in peril. Decades of neglect have pushed marine
        ecosystems to the brink. The time for action is now.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <GlassPanel key={stat.label} className="text-center">
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
        ))}
      </div>
    </SectionWrapper>
  )
}
