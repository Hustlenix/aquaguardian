'use client'

import { useMemo } from 'react'
import { useStore } from '@/store/useStore'

export default function Effects() {
  const quality = useStore((s) => s.quality)

  const effects = useMemo(() => {
    const isMobile = quality <= 0.75
    return { bloom: !isMobile }
  }, [quality])

  if (!effects.bloom) return null

  return (
    <></>
  )
}
