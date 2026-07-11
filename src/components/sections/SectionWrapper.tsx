'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
}

export default function SectionWrapper({
  children,
  className = '',
  delay = 0,
  id,
}: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`section-padding ${className}`}
    >
      <div className="section-inner">{children}</div>
    </motion.section>
  )
}
