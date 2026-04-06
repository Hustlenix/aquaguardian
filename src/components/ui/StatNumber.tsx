'use client'

import CounterAnimation from '@/components/animations/CounterAnimation'

interface StatNumberProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

export default function StatNumber({ value, label, prefix = '', suffix = '' }: StatNumberProps) {
  return (
    <div className="text-center">
      <p
        className="text-3xl md:text-4xl font-bold text-gold-400 font-['Space_Grotesk']"
      >
        <CounterAnimation
          value={value}
          prefix={prefix}
          suffix={suffix}
          duration={2}
          formatter={(v) => Math.round(v).toLocaleString()}
        />
      </p>
      <p className="text-sm text-white/60 mt-1">{label}</p>
    </div>
  )
}
