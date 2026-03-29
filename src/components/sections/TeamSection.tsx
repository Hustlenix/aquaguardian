'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'

const TEAM_MEMBERS = [
  {
    name: 'Dr. Anya Sharma',
    role: 'Chief Executive Officer',
    bio: 'Marine biologist and AI researcher with 15+ years in ocean conservation. Former lead at NOAA\'s autonomous systems division.',
    initials: 'AS',
    color: 'bg-cyan-400/10',
  },
  {
    name: 'James Calloway',
    role: 'Chief Technology Officer',
    bio: 'Robotics engineer who led underwater drone development at NASA\'s Jet Propulsion Laboratory. Expert in autonomous navigation systems.',
    initials: 'JC',
    color: 'bg-gold-400/10',
  },
  {
    name: 'Dr. Mei-Lin Chen',
    role: 'Head of Environmental Science',
    bio: 'PhD in Marine Ecology from Stanford. Pioneered AI-driven coral reef assessment methodology used across the Indo-Pacific.',
    initials: 'MC',
    color: 'bg-cyan-400/10',
  },
  {
    name: 'Alex Rivera',
    role: 'VP of Engineering',
    bio: 'Full-stack robotics architect with expertise in embedded systems, sensor fusion, and edge AI deployment at scale.',
    initials: 'AR',
    color: 'bg-gold-400/10',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function TeamSection() {
  return (
    <SectionWrapper id="team">
      <h2 className="heading-lg text-gold-400 text-center mb-4">
        OUR TEAM
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        A diverse group of scientists, engineers, and dreamers united by a
        single mission — to restore the health of our oceans.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {TEAM_MEMBERS.map((member) => (
          <motion.div
            key={member.name}
            variants={itemVariants}
            whileHover={{
              rotate: 0,
              transition: { duration: 0.3 },
            }}
          >
            <GlassPanel className="text-center h-full flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-full ${member.color} border border-white/10 flex items-center justify-center mb-5`}
              >
                <span className="text-xl font-bold text-white/80" style={{ fontFamily: 'var(--font-display)' }}>
                  {member.initials}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-3">
                {member.role}
              </p>
              <p className="text-body text-xs leading-relaxed mb-5 flex-grow">
                {member.bio}
              </p>


            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
