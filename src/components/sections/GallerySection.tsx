'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import { Ship, Waves, Fish, Satellite, Binoculars, Globe } from 'lucide-react'

const GALLERY_ITEMS = [
  {
    icon: Ship,
    label: 'Deployment Vessel',
    description: 'Launch operations from the research ship',
  },
  {
    icon: Waves,
    label: 'Coastal Waters',
    description: 'Patrolling near-shore ecosystems',
  },
  {
    icon: Fish,
    label: 'Marine Biodiversity',
    description: 'AI-driven species identification',
  },
  {
    icon: Satellite,
    label: 'Satellite Link',
    description: 'Global real-time data relay network',
  },
  {
    icon: Binoculars,
    label: 'Deep Survey',
    description: 'Deep-sea reconnaissance missions',
  },
  {
    icon: Globe,
    label: 'Global Reach',
    description: 'Deploying across critical regions',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function GallerySection() {
  return (
    <SectionWrapper id="gallery">
      <h2 className="heading-lg text-gradient-cyan text-center mb-4">
        GALLERY
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        A glimpse into the world of AquaGuardian — from deployment to deep-sea
        exploration.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {GALLERY_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="group relative glass-panel overflow-hidden cursor-pointer min-h-[220px] flex flex-col items-center justify-center text-center p-8"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-gold-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner decorations */}
              <div className="absolute top-3 left-3 w-6 h-px bg-gradient-to-r from-gold-400/20 to-transparent" />
              <div className="absolute top-3 left-3 h-6 w-px bg-gradient-to-b from-gold-400/20 to-transparent" />
              <div className="absolute bottom-3 right-3 w-6 h-px bg-gradient-to-l from-gold-400/20 to-transparent" />
              <div className="absolute bottom-3 right-3 h-6 w-px bg-gradient-to-t from-gold-400/20 to-transparent" />

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/10 to-gold-400/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Icon
                  size={26}
                  className="text-cyan-400/70 group-hover:text-cyan-400 transition-colors duration-500"
                  strokeWidth={1.5}
                />
              </div>

              {/* Label */}
              <h3 className="relative z-10 text-sm font-semibold text-white tracking-wide mb-1">
                {item.label}
              </h3>
              <p className="relative z-10 text-xs text-text-muted">
                {item.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
