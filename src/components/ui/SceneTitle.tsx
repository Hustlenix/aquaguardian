'use client'

import { motion } from 'framer-motion'

interface SceneTitleProps {
  title: string
  subtitle?: string
}

export default function SceneTitle({ title, subtitle }: SceneTitleProps) {
  return (
    <div className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="heading-lg text-gold-400"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-elegant text-white/60 max-w-2xl mx-auto mt-3"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
