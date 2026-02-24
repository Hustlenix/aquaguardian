'use client'

import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <span className="text-[0.65rem] tracking-[0.15em] font-medium">
        SCROLL
      </span>
      <ChevronDown size={18} strokeWidth={1.5} />
    </div>
  )
}
