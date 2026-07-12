'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import { Ship, Waves, Fish, Satellite, Binoculars, Globe } from 'lucide-react'

const GALLERY_ITEMS = [
  {
    icon: Ship,
    label: 'Deployment Vessel',
    description: 'Launch operations from the research ship',
    gradient: 'from-blue-900/40 via-cyan-900/20 to-ocean-900/60',
  },
  {
    icon: Waves,
    label: 'Coastal Waters',
    description: 'Patrolling near-shore ecosystems',
    gradient: 'from-teal-900/40 via-cyan-900/30 to-blue-900/60',
  },
  {
    icon: Fish,
    label: 'Marine Biodiversity',
    description: 'AI-driven species identification',
    gradient: 'from-emerald-900/40 via-teal-900/20 to-cyan-900/60',
  },
  {
    icon: Satellite,
    label: 'Satellite Link',
    description: 'Global real-time data relay network',
    gradient: 'from-indigo-900/40 via-blue-900/20 to-ocean-900/60',
  },
  {
    icon: Binoculars,
    label: 'Deep Survey',
    description: 'Deep-sea reconnaissance missions',
    gradient: 'from-purple-900/40 via-indigo-900/20 to-blue-900/60',
  },
  {
    icon: Globe,
    label: 'Global Reach',
    description: 'Deploying across critical regions',
    gradient: 'from-gold-900/30 via-amber-900/20 to-ocean-900/60',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function GallerySection() {
  return (
    <SectionWrapper id="gallery">
      <h2 className="heading-lg text-cyan-400 text-center mb-4">
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
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group relative glass-panel overflow-hidden cursor-pointer min-h-[220px] flex flex-col items-center justify-center text-center p-8"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60`} />
              {/* Subtle ambient pulse */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.15)_0%,transparent_70%)] animate-pulse" />
              </div>

              {/* Icon */}
              <motion.div
                className="relative z-10 w-14 h-14 rounded-full bg-cyan-400/10 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.15, transition: { duration: 0.3 } }}
              >
                <Icon
                  size={26}
                  className="text-cyan-400/70 group-hover:text-cyan-400 transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Label */}
              <h3 className="relative z-10 text-sm font-semibold text-white tracking-wide mb-1">
                {item.label}
              </h3>
              <p className="relative z-10 text-xs text-text-muted">
                {item.description}
              </p>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-[16px] border border-transparent group-hover:border-gold-400/30 transition-all duration-500 pointer-events-none" />
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
