'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function TridentIndicator() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0.08, 0.92], ['5%', '95%'])
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.8, 0.92, 1], [0, 0.6, 0.15, 0.15, 0.6, 0])

  return (
    <div ref={sectionRef} className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute left-[18px] md:left-1/2 top-0 z-20 -translate-x-1/2"
        style={{ top: y, opacity }}
      >
        {/* Glow aura */}
        <motion.div
          className="absolute -inset-4 rounded-full blur-xl"
          style={{ opacity: glowOpacity }}
        >
          <div className="w-full h-full bg-gold-400/30 rounded-full" />
        </motion.div>

        {/* Trident SVG */}
        <svg
          width="28"
          height="48"
          viewBox="0 0 28 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
        >
          {/* Center prong */}
          <path
            d="M14 2 L14 16"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 2 L16 2 L14 6 Z"
            fill="#D4AF37"
          />

          {/* Left prong */}
          <path
            d="M8 10 L14 14"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M6 12 L10 10 L8 15 Z"
            fill="#D4AF37"
          />

          {/* Right prong */}
          <path
            d="M20 10 L14 14"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M22 12 L18 10 L20 15 Z"
            fill="#D4AF37"
          />

          {/* Cross-guard */}
          <rect x="9" y="15" width="10" height="2" rx="1" fill="#D4AF37" />

          {/* Shaft */}
          <rect x="13" y="17" width="2" height="28" rx="1" fill="#D4AF37" />

          {/* Shaft detail */}
          <rect x="13" y="20" width="2" height="10" rx="1" fill="#E8C84A" opacity="0.4" />

          {/* Base tip */}
          <path
            d="M14 43 L12 47 L16 47 Z"
            fill="#D4AF37"
          />
        </svg>
      </motion.div>
    </div>
  )
}
