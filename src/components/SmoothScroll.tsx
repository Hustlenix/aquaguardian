'use client'

import { useEffect, useRef } from 'react'
import { createLenis, syncLenisWithGsap } from '@/lib/lenis'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const lenisRef = useRef<ReturnType<typeof createLenis> | null>(null)

  useEffect(() => {
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
  }, [])

  return <>{children}</>
}
