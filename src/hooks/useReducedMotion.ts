'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

/**
 * Hook that detects prefers-reduced-motion and updates the store.
 */
export function useReducedMotion() {
  const setReducedMotion = useStore((s) => s.setReducedMotion)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [setReducedMotion])
}
