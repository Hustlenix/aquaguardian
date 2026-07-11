'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import ScrollIndicator from '@/components/ui/ScrollIndicator'
import TextReveal from '@/components/animations/TextReveal'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Content */}
      <div className="section-inner relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block text-[0.6rem] md:text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-gold-400 mb-6"
        >
          Ocean Guardian Initiative
        </motion.span>

        {/* Main heading - word-by-word reveal */}
        <h1 className="heading-xl text-white mb-6">
          <TextReveal as="span" wordDelay={0.06} delay={0.3}>
            AQUAGUARDIAN
          </TextReveal>
        </h1>

        {/* Elegant subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-elegant text-white/80 max-w-2xl mb-4"
        >
          A new intelligence protects the depths
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-body max-w-xl mb-10"
        >
          An AI-powered autonomous guardian monitoring and restoring ocean
          ecosystems. Combining advanced robotics with environmental science.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button variant="primary" href="#mission">
            Explore the Depths
          </Button>
          <Button variant="secondary" href="#technology">
            See Technology
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  )
}
