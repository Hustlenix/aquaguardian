'use client'

import Button from '@/components/ui/Button'
import ScrollIndicator from '@/components/ui/ScrollIndicator'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/60 via-transparent to-ocean-900/80 pointer-events-none" />

      {/* Content */}
      <div className="section-inner relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow label */}
        <span className="inline-block text-[0.6rem] md:text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-gold-400 mb-6">
          Ocean Guardian Initiative
        </span>

        {/* Main heading */}
        <h1 className="heading-xl text-gradient-gold mb-6">
          AQUAGUARDIAN
        </h1>

        {/* Elegant subtitle */}
        <p className="text-elegant text-white/80 max-w-2xl mb-4">
          A new intelligence protects the depths
        </p>

        {/* Description */}
        <p className="text-body max-w-xl mb-10">
          An AI-powered autonomous guardian monitoring and restoring ocean
          ecosystems. Combining advanced robotics with environmental science.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button variant="primary" href="#mission">
            Explore the Depths
          </Button>
          <Button variant="secondary" href="#technology">
            See Technology
          </Button>
        </div>
      </div>

      {/* Scroll indicator at bottom */}
      <ScrollIndicator />
    </section>
  )
}
