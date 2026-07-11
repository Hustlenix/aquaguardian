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
  const glowIntensity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.8, 0.92, 1], [0, 0.8, 0.2, 0.2, 0.8, 0])

  return (
    <div ref={sectionRef} className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute left-[18px] md:left-1/2 top-0 z-20 -translate-x-1/2"
        style={{ top: y, opacity }}
      >
        {/* Outer glow aura */}
        <motion.div
          className="absolute -inset-6 rounded-full blur-2xl"
          style={{ opacity: glowIntensity }}
        >
          <div className="w-full h-full bg-gradient-to-r from-cyan-400/20 via-gold-400/30 to-cyan-400/20 rounded-full" />
        </motion.div>

        {/* Inner cyan glow */}
        <motion.div
          className="absolute -inset-3 rounded-full blur-lg"
          style={{ opacity: glowIntensity }}
        >
          <div className="w-full h-full bg-cyan-400/15 rounded-full" />
        </motion.div>

        {/* Trident SVG - Pentadent Design */}
        <svg
          width="36"
          height="72"
          viewBox="0 0 36 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8C84A" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#B8962A" />
              <stop offset="100%" stopColor="#8A6A1A" />
            </linearGradient>
            <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>
            <filter id="innerGlow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* === CENTRAL THREE PRONGS (diamond cross-section blades) === */}

          {/* Center prong - tallest */}
          <g filter="url(#innerGlow)">
            <path
              d="M18 2 L17 4 L18 22 L19 4 Z"
              fill="url(#goldGrad)"
              stroke="#D4AF37"
              strokeWidth="0.3"
            />
            {/* Cyan energy vein */}
            <path
              d="M17.5 4 L17.8 20"
              stroke="url(#cyanGlow)"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Blade edge highlight */}
            <path
              d="M18 2 L18 22"
              stroke="#E8C84A"
              strokeWidth="0.3"
              opacity="0.5"
            />
          </g>

          {/* Left center prong */}
          <g filter="url(#innerGlow)">
            <path
              d="M15 6 L14.5 8 L15.5 20 L16.5 8 Z"
              fill="url(#goldGrad)"
              stroke="#D4AF37"
              strokeWidth="0.3"
            />
            <path
              d="M15.2 8 L15.4 18"
              stroke="url(#cyanGlow)"
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>

          {/* Right center prong */}
          <g filter="url(#innerGlow)">
            <path
              d="M21 6 L20.5 8 L21.5 20 L22.5 8 Z"
              fill="url(#goldGrad)"
              stroke="#D4AF37"
              strokeWidth="0.3"
            />
            <path
              d="M21.2 8 L21.4 18"
              stroke="url(#cyanGlow)"
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>

          {/* === OUTER CURVED BARBS (trap blades) === */}

          {/* Left outer barb */}
          <path
            d="M12 10 C10 12, 8 14, 8.5 16 C9 18, 10 18, 12 16 L14 12 Z"
            fill="url(#goldGrad)"
            stroke="#D4AF37"
            strokeWidth="0.3"
          />
          <path
            d="M9.5 14 C10.5 13, 11.5 12, 13 11.5"
            stroke="url(#cyanGlow)"
            strokeWidth="0.4"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Right outer barb */}
          <path
            d="M24 10 C26 12, 28 14, 27.5 16 C27 18, 26 18, 24 16 L22 12 Z"
            fill="url(#goldGrad)"
            stroke="#D4AF37"
            strokeWidth="0.3"
          />
          <path
            d="M26.5 14 C25.5 13, 24.5 12, 23 11.5"
            stroke="url(#cyanGlow)"
            strokeWidth="0.4"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* === BASE COLLAR (stylized "A" emblem) === */}
          <rect x="13" y="20.5" width="10" height="3" rx="1" fill="url(#goldGrad)" stroke="#D4AF37" strokeWidth="0.3" />
          {/* A-shaped detail on collar */}
          <path
            d="M16 21 L18 23.5 L20 21"
            stroke="#E8C84A"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />

          {/* === SHAFT with spiral grooves and glyphs === */}
          <rect x="16.5" y="23.5" width="3" height="36" rx="1" fill="url(#goldGrad)" />

          {/* Narwhal tusk spiral grooves */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <line
              key={`groove-${i}`}
              x1="15.5"
              y1={25 + i * 2.8}
              x2="20.5"
              y2={27 + i * 2.8}
              stroke="#8A6A1A"
              strokeWidth="0.3"
              opacity="0.4"
            />
          ))}

          {/* Atlantean geometric glyphs on mid-section */}
          {[0, 1, 2, 3, 4].map((i) => {
            const cy = 29 + i * 6
            return (
              <g key={`glyph-${i}`}>
                <rect
                  x="17.2"
                  y={cy}
                  width="1.6"
                  height="1.6"
                  rx="0.3"
                  stroke="#E8C84A"
                  strokeWidth="0.3"
                  fill="none"
                  opacity="0.5"
                />
                <circle
                  cx="18"
                  cy={cy + 0.8}
                  r="0.3"
                  fill="#D4AF37"
                  opacity="0.3"
                />
                <line
                  x1="17.2"
                  y1={cy + 0.8}
                  x2="18.8"
                  y2={cy + 0.8}
                  stroke="#E8C84A"
                  strokeWidth="0.15"
                  opacity="0.3"
                />
              </g>
            )
          })}

          {/* === WEIGHTED CONICAL POMMEL === */}
          <path
            d="M16.5 59.5 L18 66 L19.5 59.5 Z"
            fill="url(#goldGrad)"
            stroke="#D4AF37"
            strokeWidth="0.3"
          />
          {/* Pommel tip */}
          <path
            d="M18 66 L17.5 68 L18.5 68 Z"
            fill="#B8962A"
            stroke="#D4AF37"
            strokeWidth="0.2"
          />

          {/* Shaft bottom detail ring */}
          <rect x="16" y="58.5" width="4" height="1.2" rx="0.4" fill="#B8962A" stroke="#D4AF37" strokeWidth="0.2" opacity="0.7" />

          {/* === BIOLUMINESCENT AMBIENT GLOW DOTS === */}
          {[
            { cx: 14, cy: 12, r: 0.4 },
            { cx: 22, cy: 10, r: 0.3 },
            { cx: 10, cy: 15, r: 0.3 },
            { cx: 26, cy: 14, r: 0.35 },
            { cx: 15, cy: 28, r: 0.25 },
            { cx: 21, cy: 35, r: 0.2 },
            { cx: 13, cy: 42, r: 0.3 },
          ].map((dot, i) => (
            <circle
              key={`dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="#00E5FF"
              opacity={0.3 + Math.sin(i * 1.5) * 0.15}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}
