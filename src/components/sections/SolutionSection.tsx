'use client'

import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { Cpu, Radar, Navigation, Battery, Wifi, Shield } from 'lucide-react'

const FEATURES = [
  { icon: Cpu, label: 'On-board AI Processing' },
  { icon: Radar, label: 'Multi-spectral Sensors' },
  { icon: Navigation, label: 'Autonomous Navigation' },
  { icon: Battery, label: 'Long-endurance Power' },
  { icon: Wifi, label: 'Real-time Data Relay' },
  { icon: Shield, label: 'Rugged Deep-sea Build' },
]

export default function SolutionSection() {
  return (
    <SectionWrapper id="solution">
      <h2 className="heading-lg text-gradient-gold text-center mb-4">
        MEET AQUAGUARDIAN
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text content */}
        <div>
          <p className="text-elegant text-white/70 mb-8">
            AquaGuardian is a fully autonomous underwater vehicle designed to
            patrol, monitor, and restore marine environments. Powered by
            cutting-edge artificial intelligence and rugged deep-sea
            engineering, it operates where humans cannot go.
          </p>

          {/* Key features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 text-sm text-text-muted"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <Icon size={16} className="text-cyan-400" strokeWidth={1.5} />
                  </span>
                  {feature.label}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Robot visualization placeholder */}
        <GlassPanel className="flex items-center justify-center min-h-[320px] lg:min-h-[400px]">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-cyan-400/20 flex items-center justify-center">
              <Navigation size={40} className="text-gold-400/60" strokeWidth={1} />
            </div>
            <p className="text-body text-xs uppercase tracking-widest">
              3D Model Coming Soon
            </p>
          </div>
        </GlassPanel>
      </div>
    </SectionWrapper>
  )
}
