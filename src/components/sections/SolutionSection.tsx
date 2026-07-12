'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import ModelVisual from '@/components/ui/ModelVisual'
import { Cpu, Radar, Navigation, Battery, Wifi, Shield } from 'lucide-react'

const FEATURES = [
  { icon: Cpu, label: 'On-board AI Processing' },
  { icon: Radar, label: 'Multi-spectral Sensors' },
  { icon: Navigation, label: 'Autonomous Navigation' },
  { icon: Battery, label: 'Long-endurance Power' },
  { icon: Wifi, label: 'Real-time Data Relay' },
  { icon: Shield, label: 'Rugged Deep-sea Build' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function SolutionSection() {
  return (
    <SectionWrapper id="solution">
      <h2 className="heading-lg text-gold-400 text-center mb-4">
        MEET AQUAGUARDIAN
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-elegant text-white/70 mb-8">
            AquaGuardian is a fully autonomous underwater vehicle designed to
            patrol, monitor, and restore marine environments. Powered by
            cutting-edge artificial intelligence and rugged deep-sea
            engineering, it operates where humans cannot go.
          </p>

          {/* Key features list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.label}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-sm text-text-muted"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <Icon size={16} className="text-cyan-400" strokeWidth={1.5} />
                  </span>
                  {feature.label}
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Right: Robot visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <GlassPanel className="flex items-center justify-center min-h-[320px] lg:min-h-[400px] p-0 overflow-hidden">
            <ModelVisual variant="robot" />
          </GlassPanel>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
