'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import ScrollIndicator from '@/components/ui/ScrollIndicator'
import TextReveal from '@/components/animations/TextReveal'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.16),transparent_40%),linear-gradient(180deg,rgba(4,21,37,0.2),transparent_35%,rgba(1,11,19,0.55))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#010B13] via-[#010B13]/80 to-transparent" />

      <div className="section-inner relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-6 rounded-full border border-gold-400/20 bg-white/5 px-4 py-2 text-[0.7rem] uppercase tracking-[0.3em] text-gold-400/80 backdrop-blur-md"
        >
          AI • Robotics • Ocean Stewardship
        </motion.div>

        <h1 className="heading-xl text-white mb-5 drop-shadow-[0_0_28px_rgba(0,229,255,0.12)]">
          <TextReveal as="span" wordDelay={0.06} delay={0.3}>
            AQUAGUARDIAN
          </TextReveal>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mb-4"
        >
          <p className="text-elegant text-white/80 max-w-2xl">
            A new intelligence protects the depths
          </p>
          <div className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-body max-w-xl mb-10"
        >
<<<<<<< HEAD
          An AI-powered autonomous guardian monitoring and restoring ocean ecosystems. Combining
          advanced robotics with environmental science.
=======
          An AI-powered autonomous guardian monitoring and restoring ocean ecosystems with cinematic precision, regenerative technology, and compassionate design.
>>>>>>> 2c79eb6 (Polish README and document AI-assisted build)
        </motion.p>

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
