'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'

/**
 * Route transition wrapper — soft atmospheric fade for page navigations.
 * Skips animation entirely for users who prefer reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reducedMotion = useStore((s) => s.reducedMotion)

  if (reducedMotion) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
