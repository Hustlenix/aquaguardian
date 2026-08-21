'use client'

import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <ChevronDown size={20} strokeWidth={1.5} className="text-gold-400/40" />
    </div>
  )
}
