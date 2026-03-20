'use client'

import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <span className="text-[0.6rem] tracking-[0.2em] font-medium text-gold-400/60">
        SCROLL
      </span>
      <ChevronDown size={16} strokeWidth={1.5} className="text-gold-400/40" />
    </div>
  )
}
