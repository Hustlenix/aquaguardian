'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import { chapters } from '@/data/chapters'
import { cameraPaths } from '@/data/cameraPaths'
import * as THREE from 'three'

export default function StoryController() {
  const { camera } = useThree()
  const { activeChapter, scrollProgress, setActiveChapter } = useStore()
  const targetPos = useRef(new THREE.Vector3(0, 1, 8))
  const currentPos = useRef(new THREE.Vector3(0, 1, 8))

  const chapterCount = chapters.length

  const getChapterAtProgress = useCallback((progress: number) => {
    const index = Math.min(Math.floor(progress * chapterCount), chapterCount - 1)
    return index
  }, [chapterCount])

  useEffect(() => {
    const chapter = getChapterAtProgress(scrollProgress)
    if (chapter !== activeChapter) {
      setActiveChapter(chapter)
    }
  }, [scrollProgress, activeChapter, setActiveChapter, getChapterAtProgress])

  useEffect(() => {
    if (cameraPaths[activeChapter]) {
      const path = cameraPaths[activeChapter]
      targetPos.current.set(path.position[0], path.position[1], path.position[2])
    }
  }, [activeChapter])

  useFrame((state, delta) => {
    currentPos.current.lerp(targetPos.current, delta * 1.5)
    camera.position.lerp(currentPos.current, delta * 2)
    camera.lookAt(0, 0, 0)
  })

  return null
}
