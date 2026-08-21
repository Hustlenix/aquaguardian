'use client'

import GlassPanel from './GlassPanel'

const STATS = [
  { value: '8M', label: 'Tons of Plastic Enter Oceans Yearly', color: 'text-cyan-400' },
  { value: '90%', label: 'Of Marine Species Affected', color: 'text-gold-400' },
  { value: '30%', label: 'Of Oceans Are Protected', color: 'text-cyan-400' },
  { value: '99.7%', label: 'Detection Accuracy', color: 'text-gold-400' },
]

interface DashboardProps {
  className?: string
}

export default function Dashboard({ className = '' }: DashboardProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 ${className}`}>
      {STATS.map((stat) => (
        <GlassPanel key={stat.label} className="text-center p-4 md:p-5">
          <p className={`text-2xl md:text-3xl font-bold font-['Space_Grotesk'] ${stat.color} mb-1`}>
            {stat.value}
          </p>
          <p className="text-xs md:text-sm text-white/60">{stat.label}</p>
        </GlassPanel>
      ))}
    </div>
  )
}
