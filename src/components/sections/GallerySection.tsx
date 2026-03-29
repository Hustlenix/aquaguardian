'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'

const GALLERY_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    label: 'Deployment Vessel',
    description: 'Launch operations from the research ship',
  },
  {
    src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
    label: 'Coastal Waters',
    description: 'Patrolling near-shore ecosystems',
  },
  {
    src: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&q=80',
    label: 'Marine Biodiversity',
    description: 'AI-driven species identification',
  },
  {
    src: 'https://images.unsplash.com/photo-1614064645969-0c0f3b7467f0?w=600&q=80',
    label: 'Satellite Link',
    description: 'Global real-time data relay network',
  },
  {
    src: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80',
    label: 'Deep Survey',
    description: 'Deep-sea reconnaissance missions',
  },
  {
    src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
    label: 'Global Reach',
    description: 'Deploying across critical regions',
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
      <h2 className="heading-lg text-gold-400 text-center mb-4">
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
        {GALLERY_ITEMS.map((item) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
            className="group relative glass-panel overflow-hidden cursor-pointer min-h-[240px] flex flex-col items-end justify-end text-left p-0"
          >
            <img
              src={item.src}
              alt={item.label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010B13]/90 via-[#010B13]/30 to-transparent" />
            <div className="relative z-10 p-5 w-full">
              <h3 className="text-sm font-semibold text-white tracking-wide mb-0.5">
                {item.label}
              </h3>
              <p className="text-xs text-white/60">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
