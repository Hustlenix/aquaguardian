'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  isLoading: boolean
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#010B13]"
        >
          {/* Animated spinner ring */}
          <div className="relative w-16 h-16 mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-transparent border-t-gold-400"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            />
          </div>

          <p
            className="text-lg tracking-[0.25em] text-gold-400"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AQUAGUARDIAN
          </p>
          <p className="text-xs text-white/40 tracking-[0.15em] mt-2">Diving into the deep...</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
