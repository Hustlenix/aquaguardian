'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { getLenis } from '@/lib/lenis'

/**
 * Hook that syncs Lenis scroll progress with the Zustand store.
 */
export function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress)

  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return

    const handler = () => {
      const progress = lenis.progress
      setScrollProgress(progress)
    }

    lenis.on('scroll', handler)
    return () => {
      lenis.off('scroll', handler)
    }
  }, [setScrollProgress])
}
