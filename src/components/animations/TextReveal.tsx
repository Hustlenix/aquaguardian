'use client'

import { motion } from 'framer-motion'

interface Props {
  children: string
  delay?: number
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  wordDelay?: number
}

export default function TextReveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'h1',
  wordDelay = 0.04,
}: Props) {
  const words = children.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: wordDelay,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 20, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={{ display: 'inline' }}
    >
      <Tag style={{ display: 'inline' }}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={child}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {i < words.length - 1 ? `${word}\u00A0` : word}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  )
}
