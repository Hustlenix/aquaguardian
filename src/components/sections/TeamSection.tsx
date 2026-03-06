'use client'

import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { Linkedin, Twitter } from 'lucide-react'

const TEAM_MEMBERS = [
  {
    name: 'Dr. Anya Sharma',
    role: 'Chief Executive Officer',
    bio: 'Marine biologist and AI researcher with 15+ years in ocean conservation. Former lead at NOAA\'s autonomous systems division.',
    initials: 'AS',
    color: 'from-cyan-400/20 to-cyan-400/5',
  },
  {
    name: 'James Calloway',
    role: 'Chief Technology Officer',
    bio: 'Robotics engineer who led underwater drone development at NASA\'s Jet Propulsion Laboratory. Expert in autonomous navigation systems.',
    initials: 'JC',
    color: 'from-gold-400/20 to-gold-400/5',
  },
  {
    name: 'Dr. Mei-Lin Chen',
    role: 'Head of Environmental Science',
    bio: 'PhD in Marine Ecology from Stanford. Pioneered AI-driven coral reef assessment methodology used across the Indo-Pacific.',
    initials: 'MC',
    color: 'from-cyan-400/20 to-cyan-400/5',
  },
  {
    name: 'Alex Rivera',
    role: 'VP of Engineering',
    bio: 'Full-stack robotics architect with expertise in embedded systems, sensor fusion, and edge AI deployment at scale.',
    initials: 'AR',
    color: 'from-gold-400/20 to-gold-400/5',
  },
]

export default function TeamSection() {
  return (
    <SectionWrapper id="team">
      <h2 className="heading-lg text-gradient-gold text-center mb-4">
        OUR TEAM
      </h2>

      <p className="text-elegant text-center text-white/70 max-w-3xl mx-auto mb-12">
        A diverse group of scientists, engineers, and dreamers united by a
        single mission — to restore the health of our oceans.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM_MEMBERS.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassPanel className="text-center h-full flex flex-col items-center">
              {/* Avatar placeholder */}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} border border-white/10 flex items-center justify-center mb-5`}
              >
                <span className="text-xl font-bold text-white/80" style={{ fontFamily: 'var(--font-display)' }}>
                  {member.initials}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-base font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-3">
                {member.role}
              </p>
              <p className="text-body text-xs leading-relaxed mb-5 flex-grow">
                {member.bio}
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <Linkedin size={14} className="text-text-muted" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label={`${member.name} on Twitter`}
                >
                  <Twitter size={14} className="text-text-muted" strokeWidth={1.5} />
                </a>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
