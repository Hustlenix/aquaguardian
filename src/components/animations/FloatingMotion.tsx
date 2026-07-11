'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  amplitude?: number
  duration?: number
  delay?: number
  className?: string
}

export default function FloatingMotion({
  children,
  amplitude = 6,
  duration = 3,
  delay = 0,
  className = '',
}: Props) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
