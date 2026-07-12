'use client'

import { useEffect, useRef } from 'react'
import { createLenis, syncLenisWithGsap } from '@/lib/lenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useStore } from '@/store/useStore'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const lenisRef = useRef<ReturnType<typeof createLenis> | null>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = createLenis()
    lenisRef.current = lenis

    syncLenisWithGsap(lenis)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  return <>{children}</>
}
