'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { BREAKPOINTS } from '@/lib/constants'

type DeviceTier = 'low' | 'medium' | 'high'

/**
 * Hook that detects device capabilities and sets the tier in the store.
 */
export function useDeviceTier() {
  const setDeviceTier = useStore((s) => s.setDeviceTier)
  const setQuality = useStore((s) => s.setQuality)

  useEffect(() => {
    function detectTier(): DeviceTier {
      const width = window.innerWidth
      const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory

      if (width < BREAKPOINTS.mobile || (memory && memory < 4)) {
        return 'low'
      }
      if (width < BREAKPOINTS.tablet || (memory && memory < 8)) {
        return 'medium'
      }
      return 'high'
    }

    const tier = detectTier()
    setDeviceTier(tier)

    switch (tier) {
      case 'low':
        setQuality(0.5)
        break
      case 'medium':
        setQuality(0.75)
        break
      case 'high':
        setQuality(1)
        break
    }
  }, [setDeviceTier, setQuality])
}
