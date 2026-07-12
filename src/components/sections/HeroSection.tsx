'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import ScrollIndicator from '@/components/ui/ScrollIndicator'
import TextReveal from '@/components/animations/TextReveal'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Content */}
      <div className="section-inner relative z-10 flex flex-col items-center text-center px-4">
        {/* Main heading - word-by-word reveal */}
        <h1 className="heading-xl text-white mb-5">
          <TextReveal as="span" wordDelay={0.06} delay={0.3}>
            AQUAGUARDIAN
          </TextReveal>
        </h1>

        {/* Elegant subtitle with gold decorative accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mb-4"
        >
          <p className="text-elegant text-white/80 max-w-2xl">
            A new intelligence protects the depths
          </p>
          <div className="mt-3 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        </motion.div>

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
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
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
