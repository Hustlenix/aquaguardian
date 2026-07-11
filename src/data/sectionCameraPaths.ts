import type { CameraTarget } from '@/types'
import type { SectionId } from '@/store/useStore'

export const sectionCameraPaths: Record<SectionId, CameraTarget> = {
  hero: {
    position: [0, 1, 8],
    lookAt: [0, -0.5, -3],
    fov: 60,
  },
  mission: {
    position: [0.5, -0.5, 6],
    lookAt: [0.2, -1, -5],
    fov: 62,
  },
  problem: {
    position: [-1, -2, 5],
    lookAt: [-0.5, -2.5, -6],
    fov: 65,
  },
  solution: {
    position: [1, 0, 4],
    lookAt: [0.5, -1, -5],
    fov: 58,
  },
  technology: {
    position: [2, 0.5, 3],
    lookAt: [1, -0.5, -5],
    fov: 55,
  },
  timeline: {
    position: [0, -0.5, 5],
    lookAt: [0, -1.5, -6],
    fov: 60,
  },
  impact: {
    position: [0.5, 1, 6],
    lookAt: [0, 0, -4],
    fov: 58,
  },
  faq: {
    position: [0, 0.5, 7],
    lookAt: [0, -0.5, -4],
    fov: 60,
  },
  footer: {
    position: [0, 3, 9],
    lookAt: [0, 0, -2],
    fov: 62,
  },
}
