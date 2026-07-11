'use client'

import Lenis from 'lenis'
import gsap from 'gsap'

let lenisInstance: Lenis | null = null

export function createLenis(): Lenis {
  if (typeof window === 'undefined') {
    throw new Error('Lenis can only be created on the client side')
  }

  if (lenisInstance) {
    return lenisInstance
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function syncLenisWithGsap(lenis: Lenis): void {
  lenis.on('scroll', () => {
    gsap.updateRoot(0)
  })
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}
