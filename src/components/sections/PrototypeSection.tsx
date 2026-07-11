'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import Button from '@/components/ui/Button'
import { Navigation, Gauge, Battery, Weight, Zap, Cpu } from 'lucide-react'

const SPECS = [
  { icon: Weight, label: 'Weight', value: '180 kg' },
  { icon: Navigation, label: 'Depth Rating', value: '4,000 m' },
  { icon: Gauge, label: 'Speed', value: '8 knots' },
  { icon: Battery, label: 'Battery Life', value: '72 hrs' },
  { icon: Zap, label: 'Payload', value: '500 kg' },
  { icon: Cpu, label: 'AI Model', value: 'AGNet-7B' },
]

export default function PrototypeSection() {
  return (
    <SectionWrapper id="prototype">
      <h2 className="heading-lg text-gold-400 text-center mb-4">
        THE PROTOTYPE
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-16">
        A marvel of marine engineering — designed to withstand the deepest
        pressures while operating completely autonomously.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Hero visual placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <GlassPanel strong className="relative overflow-hidden min-h-[360px] lg:min-h-[480px] flex items-center justify-center">
            {/* Center content */}
            <div className="relative z-10 text-center">
              <motion.div
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center"
                whileInView={{ rotate: [0, 360] }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                <Navigation size={52} className="text-cyan-400/60" strokeWidth={1} />
              </motion.div>
              <p className="text-body text-xs uppercase tracking-widest text-gold-400/70">
                AquaGuardian Series 1
              </p>
              <p className="text-elegant text-white/50 text-sm mt-2">
                Full 3D model coming soon
              </p>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Right: Spec sheet */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-md text-white mb-6"
          >
            Technical Specifications
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {SPECS.map((spec, i) => {
              const Icon = spec.icon
              return (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                  }}
                  className="glass-panel p-4 flex items-center gap-4"
                  whileHover={{ translateY: -2, transition: { duration: 0.2 } }}
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-cyan-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="block text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-text-muted">
                      {spec.label}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {spec.value}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="primary" href="#contact">
              Request a Demo
            </Button>
            <Button variant="secondary" href="#technology">
              View Technical Specs
            </Button>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
