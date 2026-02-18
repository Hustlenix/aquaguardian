'use client'

import { useCallback } from 'react'
import { useStore } from '@/store/useStore'

/**
 * Hook that provides scene management utilities.
 */
export function useSceneManager() {
  const { activeChapter, setActiveChapter } = useStore()

  const goToChapter = useCallback(
    (chapterIndex: number) => {
      setActiveChapter(chapterIndex)
    },
    [setActiveChapter],
  )

  const nextChapter = useCallback(() => {
    goToChapter(activeChapter + 1)
  }, [activeChapter, goToChapter])

  const prevChapter = useCallback(() => {
    goToChapter(Math.max(0, activeChapter - 1))
  }, [activeChapter, goToChapter])

  return {
    activeChapter,
    goToChapter,
    nextChapter,
    prevChapter,
  }
}
