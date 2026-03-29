'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionWrapper from './SectionWrapper'

const MILESTONES = [
  {
    period: 'Q1 2026',
    title: 'Concept & Research',
    description:
      'Foundational research and feasibility studies. Assembling the core team of marine biologists, AI researchers, and robotics engineers.',
  },
  {
    period: 'Q2 2026',
    title: 'Prototype Development',
    description:
      'Building the first functional prototype with AI navigation and basic sensor integration. Initial tank testing begins.',
  },
  {
    period: 'Q3 2026',
    title: 'Field Testing',
    description:
      'Deploying the prototype in controlled coastal environments. Iterating on AI models with real-world ocean data.',
  },
  {
    period: 'Q4 2026',
    title: 'Pilot Deployment',
    description:
      'Full-scale pilot deployment in partnership with marine conservation organizations. Monitoring and restoration missions commence.',
  },
  {
    period: '2027',
    title: 'Global Expansion',
    description:
      'Scaling the fleet across critical ocean regions worldwide. Establishing data partnerships and open research initiatives.',
  },
]

const MILESTONE_COUNT = MILESTONES.length

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const tridentY = useTransform(scrollYProgress, [0.05, 0.95], ['2%', '98%'])
  const lineFill = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])
  const tridentOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])

  return (
    <SectionWrapper id="timeline" className="relative">
      <div ref={sectionRef}>
        <motion.h2
          className="heading-lg text-center text-gold-400 mb-16"
          style={{ opacity: headingOpacity }}
        >
          TIMELINE
        </motion.h2>

        <div className="relative max-w-3xl mx-auto">
          {/* === VERTICAL LINE (base) === */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-gold-400/20 -translate-x-1/2" />

          {/* === VERTICAL LINE (fill overlay) === */}
          {/* Desktop: centered, Mobile: left-aligned at 18px */}
          <motion.div
            className="absolute top-0 bottom-0 w-px -translate-x-1/2 z-10"
            style={{
              left: 'clamp(18px, 50%, 50%)',
              background: 'linear-gradient(180deg, #D4AF37, #00E5FF)',
              height: lineFill,
              boxShadow: '0 0 8px rgba(212,175,55,0.3), 0 0 16px rgba(0,229,255,0.15)',
            }}
          />

          {/* === TRIDENT INDICATOR === */}
          <motion.div
            className="absolute left-[18px] md:left-1/2 top-0 z-20 -translate-x-1/2"
            style={{ top: tridentY, opacity: tridentOpacity }}
          >
            {/* Glow aura */}
            <motion.div
              className="absolute -inset-5 rounded-full blur-xl"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.08, 0.15, 0.85, 0.92, 1], [0, 0.6, 0.15, 0.15, 0.6, 0]),
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-cyan-400/20 via-gold-400/30 to-cyan-400/20 rounded-full" />
            </motion.div>

            {/* Pentadent Trident SVG */}
            <svg width="36" height="72" viewBox="0 0 36 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">
              <defs>
                <linearGradient id="tGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E8C84A" />
                  <stop offset="40%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#B8962A" />
                  <stop offset="100%" stopColor="#8A6A1A" />
                </linearGradient>
                <linearGradient id="tCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </linearGradient>
                <filter id="tGlow">
                  <feGaussianBlur stdDeviation="0.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Center prong */}
              <g filter="url(#tGlow)">
                <path d="M18 2 L17 4 L18 22 L19 4 Z" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
                <path d="M17.5 4 L17.8 20" stroke="url(#tCyan)" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />
              </g>
              {/* Left center prong */}
              <g filter="url(#tGlow)">
                <path d="M15 6 L14.5 8 L15.5 20 L16.5 8 Z" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
                <path d="M15.2 8 L15.4 18" stroke="url(#tCyan)" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
              </g>
              {/* Right center prong */}
              <g filter="url(#tGlow)">
                <path d="M21 6 L20.5 8 L21.5 20 L22.5 8 Z" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
                <path d="M21.2 8 L21.4 18" stroke="url(#tCyan)" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
              </g>
              {/* Left outer barb */}
              <path d="M12 10 C10 12, 8 14, 8.5 16 C9 18, 10 18, 12 16 L14 12 Z" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
              <path d="M9.5 14 C10.5 13, 11.5 12, 13 11.5" stroke="url(#tCyan)" strokeWidth="0.4" strokeLinecap="round" opacity="0.5" />
              {/* Right outer barb */}
              <path d="M24 10 C26 12, 28 14, 27.5 16 C27 18, 26 18, 24 16 L22 12 Z" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
              <path d="M26.5 14 C25.5 13, 24.5 12, 23 11.5" stroke="url(#tCyan)" strokeWidth="0.4" strokeLinecap="round" opacity="0.5" />
              {/* Collar */}
              <rect x="13" y="20.5" width="10" height="3" rx="1" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
              <path d="M16 21 L18 23.5 L20 21" stroke="#E8C84A" strokeWidth="0.5" fill="none" opacity="0.6" />
              {/* Shaft */}
              <rect x="16.5" y="23.5" width="3" height="36" rx="1" fill="url(#tGold)" />
              {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
                <line key={`g${i}`} x1="15.5" y1={25 + i * 2.8} x2="20.5" y2={27 + i * 2.8} stroke="#8A6A1A" strokeWidth="0.3" opacity="0.4" />
              ))}
              {[0,1,2,3,4].map((i) => {
                const cy = 29 + i * 6
                return (
                  <g key={`gl${i}`}>
                    <rect x="17.2" y={cy} width="1.6" height="1.6" rx="0.3" stroke="#E8C84A" strokeWidth="0.3" fill="none" opacity="0.5" />
                    <circle cx="18" cy={cy + 0.8} r="0.3" fill="#D4AF37" opacity="0.3" />
                  </g>
                )
              })}
              {/* Pommel */}
              <path d="M16.5 59.5 L18 66 L19.5 59.5 Z" fill="url(#tGold)" stroke="#D4AF37" strokeWidth="0.3" />
              <path d="M18 66 L17.5 68 L18.5 68 Z" fill="#B8962A" stroke="#D4AF37" strokeWidth="0.2" />
              {/* Bioluminescent dots */}
              {[{cx:14,cy:12},{cx:22,cy:10},{cx:10,cy:15},{cx:26,cy:14},{cx:15,cy:28},{cx:21,cy:35},{cx:13,cy:42}].map((d,i) => (
                <circle key={`bd${i}`} cx={d.cx} cy={d.cy} r={0.3} fill="#00E5FF" opacity={0.25} />
              ))}
            </svg>
          </motion.div>

          {/* === PULSE RING at active milestone === */}
          <ActiveMilestoneRing scrollYProgress={scrollYProgress} />

          {/* === MILESTONES === */}
          <div className="space-y-16">
            {MILESTONES.map((milestone, index) => {
              const isLeft = index % 2 === 0
              const rangeStart = (index / MILESTONE_COUNT) * 0.9 + 0.05
              const rangeEnd = ((index + 1) / MILESTONE_COUNT) * 0.9 + 0.05

              return (
                <MilestoneCard
                  key={milestone.period}
                  milestone={milestone}
                  index={index}
                  isLeft={isLeft}
                  scrollYProgress={scrollYProgress}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  count={MILESTONE_COUNT}
                />
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

function ActiveMilestoneRing({ scrollYProgress }: { scrollYProgress: import('framer-motion').MotionValue<number> }) {
  const revealAt = useTransform(scrollYProgress, [0.1, 0.9], [0, 1])

  return (
    <motion.div
      className="absolute left-[18px] md:left-1/2 top-0 z-15 -translate-x-1/2"
      style={{
        top: useTransform(scrollYProgress, [0.05, 0.95], ['10%', '90%']),
        opacity: useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 0.8, 0.8, 0]),
      }}
    >
      <motion.div
        className="w-6 h-6 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.25) 0%, transparent 70%)',
          scale: useTransform(revealAt, [0, 1], [1, 1.8]),
          opacity: useTransform(revealAt, [0, 0.5, 1], [0.3, 0.6, 0]),
        }}
      />
    </motion.div>
  )
}

function MilestoneCard({
  milestone, index, isLeft, scrollYProgress, rangeStart,
}: {
  milestone: typeof MILESTONES[number]
  index: number
  isLeft: boolean
  scrollYProgress: import('framer-motion').MotionValue<number>
  rangeStart: number
  rangeEnd: number
  count: number
}) {
  const activeVal = useTransform(scrollYProgress, [rangeStart - 0.02, rangeStart + 0.08], [0, 1])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex items-start gap-6 md:gap-0"
    >
      {/* Dot */}
      <motion.div
        className="absolute left-[10px] md:left-1/2 top-1.5 w-[18px] h-[18px] rounded-full -translate-x-1/2 z-10 border-2 border-gold-400"
        style={{
          backgroundColor: useTransform(activeVal, [0, 1], ['#010B13', '#D4AF37']),
          scale: useTransform(activeVal, [0, 1], [1, 1.3]),
          boxShadow: useTransform(activeVal, [0, 0.5, 1], [
            '0 0 0px rgba(212,175,55,0)',
            '0 0 8px rgba(212,175,55,0.3)',
            '0 0 16px rgba(212,175,55,0.6), 0 0 32px rgba(0,229,255,0.3)',
          ]),
        }}
      />

      {/* Card */}
      <div className={`relative pl-10 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}>
        <motion.div
          className="p-5 md:p-6 rounded-2xl backdrop-blur-xl"
          style={{
            border: useTransform(activeVal, [0, 0.5, 1], [
              '1px solid rgba(255,255,255,0.08)',
              '1px solid rgba(212,175,55,0.15)',
              '1px solid rgba(212,175,55,0.3)',
            ]),
          }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 mb-1">
            {milestone.period}
          </span>
          <h3 className="heading-md text-white mb-2">{milestone.title}</h3>
          <p className="text-body text-xs leading-relaxed">{milestone.description}</p>
        </motion.div>
      </div>

      {isLeft && <div className="hidden md:block md:w-1/2" />}
    </motion.div>
  )
}
