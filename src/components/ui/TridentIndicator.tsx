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
  const glowIntensity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.8, 0.92, 1], [0, 1, 0.15, 0.15, 1, 0])

  return (
    <div ref={sectionRef} className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute left-[18px] md:left-1/2 top-0 z-20 -translate-x-1/2"
        style={{ top: y, opacity }}
      >
        {/* Outer ambient glow */}
        <motion.div
          className="absolute -inset-8 rounded-full blur-3xl"
          style={{ opacity: useTransform(glowIntensity, [0, 1], [0, 0.5]) }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-400/25 via-gold-400/20 to-cyan-400/25 rounded-full" />
        </motion.div>

        {/* Inner energy aura */}
        <motion.div
          className="absolute -inset-3 rounded-full blur-xl"
          style={{ opacity: useTransform(glowIntensity, [0, 1], [0, 0.6]) }}
        >
          <div className="w-full h-full bg-gradient-to-b from-cyan-400/20 via-gold-400/10 to-transparent rounded-full" />
        </motion.div>

        {/* === TRIDENT SVG — Cinematic 3D-style Pentadent === */}
        <svg
          width="56"
          height="120"
          viewBox="0 0 56 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 4px 24px rgba(0,229,255,0.2))' }}
        >
          <defs>
            {/* Brushed gold metallic gradient */}
            <linearGradient id="goldBase" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="#8A6A1A" />
              <stop offset="15%" stopColor="#C4A040" />
              <stop offset="30%" stopColor="#E8C84A" />
              <stop offset="45%" stopColor="#FFF0A0" />
              <stop offset="55%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#B8962A" />
              <stop offset="85%" stopColor="#E8C84A" />
              <stop offset="100%" stopColor="#8A6A1A" />
            </linearGradient>

            {/* Dark gold for deep crevices */}
            <linearGradient id="goldDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6A4E10" />
              <stop offset="100%" stopColor="#4A3208" />
            </linearGradient>

            {/* Cyan bioluminescent energy */}
            <linearGradient id="cyanEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00B8D4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>

            {/* Blade edge highlight */}
            <linearGradient id="edgeHighlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FFF0A0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>

            {/* Translucent blade glow */}
            <linearGradient id="bladeGlow" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
            </linearGradient>

            {/* Underwater oxidation */}
            <linearGradient id="oxidation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A6A5A" stopOpacity="0" />
              <stop offset="60%" stopColor="#1A4A3A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A2A1A" stopOpacity="0.25" />
            </linearGradient>

            <filter id="bladeShadow">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
            </filter>

            <filter id="energyGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* === SHADOW BEHIND TRIDENT === */}
          <g opacity="0.3" filter="url(#bladeShadow)">
            <path d="M28 4 L27 6 L28 30 L29 6 Z" fill="#000" />
          </g>

          {/* === FIVE PRONGS === */}

          {/* --- CENTER PRONG (tallest, diamond cross-section) --- */}
          <g filter="url(#softGlow)">
            {/* Left facet */}
            <path d="M28 3 L26.5 6 L27.5 28 L28 30 L28.5 28 L29.5 6 Z" fill="url(#goldBase)" />
            {/* Right facet (darker) */}
            <path d="M29.5 6 L28 3 L28.5 28 L29.5 6 Z" fill="url(#goldDark)" opacity="0.4" />
            {/* Edge highlight */}
            <path d="M28 3 L28 30" stroke="url(#edgeHighlight)" strokeWidth="0.5" strokeLinecap="round" />
            {/* Translucent cyan energy core */}
            <path d="M27.5 6 L28 30 L28.5 6 Z" fill="url(#cyanEnergy)" opacity="0.6" />
            {/* Cyan glow vein */}
            <path d="M27.8 6 L28 28" stroke="#00E5FF" strokeWidth="0.8" filter="url(#energyGlow)" opacity="0.8" />
            {/* Diamond tip */}
            <path d="M27.5 3 L28 1 L28.5 3 L28 6 Z" fill="url(#goldBase)" stroke="#E8C84A" strokeWidth="0.3" />
            <path d="M28 1 L28 3" stroke="#FFF0A0" strokeWidth="0.4" opacity="0.8" />
          </g>

          {/* --- LEFT CENTER PRONG --- */}
          <g filter="url(#softGlow)">
            <path d="M23 9 L22 11 L23 26 L24 28 L25 26 L26 11 Z" fill="url(#goldBase)" />
            <path d="M25 11 L23 9 L24 26 L25 11 Z" fill="url(#goldDark)" opacity="0.35" />
            <path d="M24 26 L24 9" stroke="url(#bladeGlow)" strokeWidth="0.6" />
            <path d="M24 9 L23.5 7 L24 10" fill="url(#goldBase)" />
            <path d="M24 7 L24 9" stroke="#E8C84A" strokeWidth="0.3" opacity="0.7" />
            <path d="M23.5 12 L23.8 24" stroke="#00E5FF" strokeWidth="0.5" filter="url(#energyGlow)" opacity="0.6" />
          </g>

          {/* --- RIGHT CENTER PRONG --- */}
          <g filter="url(#softGlow)">
            <path d="M33 9 L32 11 L33 26 L34 28 L35 26 L36 11 Z" fill="url(#goldBase)" />
            <path d="M35 11 L33 9 L34 26 L35 11 Z" fill="url(#goldDark)" opacity="0.35" />
            <path d="M34 26 L34 9" stroke="url(#bladeGlow)" strokeWidth="0.6" />
            <path d="M34 9 L33.5 7 L34 10" fill="url(#goldBase)" />
            <path d="M34 7 L34 9" stroke="#E8C84A" strokeWidth="0.3" opacity="0.7" />
            <path d="M33.5 12 L33.8 24" stroke="#00E5FF" strokeWidth="0.5" filter="url(#energyGlow)" opacity="0.6" />
          </g>

          {/* --- LEFT OUTER BARB (curved trap blade) --- */}
          <g filter="url(#softGlow)">
            <path d="M20 14 C17 17, 14 20, 13 23 C14 25, 16 26, 18 24 L22 16 Z" fill="url(#goldBase)" />
            <path d="M13 23 C14 25, 16 26, 18 24" fill="none" stroke="url(#edgeHighlight)" strokeWidth="0.4" opacity="0.5" />
            <path d="M15 20 L18 17" stroke="#00E5FF" strokeWidth="0.4" filter="url(#energyGlow)" opacity="0.5" />
            {/* Outer edge oxidation */}
            <path d="M13 23 C14 24.5, 15.5 25.5, 17 24.5" stroke="#1A4A3A" strokeWidth="0.3" opacity="0.4" />
          </g>

          {/* --- RIGHT OUTER BARB (curved trap blade) --- */}
          <g filter="url(#softGlow)">
            <path d="M36 14 C39 17, 42 20, 43 23 C42 25, 40 26, 38 24 L34 16 Z" fill="url(#goldBase)" />
            <path d="M43 23 C42 25, 40 26, 38 24" fill="none" stroke="url(#edgeHighlight)" strokeWidth="0.4" opacity="0.5" />
            <path d="M41 20 L38 17" stroke="#00E5FF" strokeWidth="0.4" filter="url(#energyGlow)" opacity="0.5" />
            <path d="M43 23 C42 24.5, 40.5 25.5, 39 24.5" stroke="#1A4A3A" strokeWidth="0.3" opacity="0.4" />
          </g>

          {/* === PRONG BASE COLLAR (heavy architectural block) === */}
          <rect x="21" y="28" width="14" height="5" rx="1.5" fill="url(#goldBase)" stroke="#8A6A1A" strokeWidth="0.3" />
          {/* Stylized "A" emblem */}
          <path d="M24 30 L28 36 L32 30" stroke="#E8C84A" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M28 33 L28 36" stroke="#E8C84A" strokeWidth="0.8" opacity="0.6" />
          {/* Collar rivets */}
          <circle cx="23" cy="30.5" r="0.6" fill="#D4AF37" opacity="0.4" />
          <circle cx="33" cy="30.5" r="0.6" fill="#D4AF37" opacity="0.4" />
          {/* Collar shadow groove */}
          <line x1="21" y1="30" x2="35" y2="30" stroke="#4A3208" strokeWidth="0.3" opacity="0.5" />
          <line x1="21" y1="32" x2="35" y2="32" stroke="#E8C84A" strokeWidth="0.2" opacity="0.3" />

          {/* === SHAFT (cylindrical with spiral grooves) === */}
          <rect x="26" y="33" width="4" height="66" rx="1" fill="url(#goldBase)" />
          {/* Left shadow edge for cylinder depth */}
          <rect x="26" y="33" width="1.2" height="66" fill="url(#goldDark)" opacity="0.3" />
          {/* Right highlight */}
          <rect x="28.5" y="33" width="0.8" height="66" fill="#E8C84A" opacity="0.15" />

          {/* Spiral narwhal tusk grooves */}
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((i) => {
            const y1 = 35 + i * 3
            const y2 = 36.5 + i * 3
            return (
              <g key={`groove-${i}`}>
                <line x1="24" y1={y1} x2="32" y2={y1 + 1.5} stroke="#5A3E0A" strokeWidth="0.4" opacity="0.35" />
                <line x1="24.5" y1={y1 - 0.3} x2="32" y2={y1 + 1.2} stroke="#FFF0A0" strokeWidth="0.15" opacity="0.15" />
              </g>
            )
          })}

          {/* Atlantean geometric glyph bands */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const cy = 40 + i * 9
            return (
              <g key={`glyph-band-${i}`}>
                {/* Band ring */}
                <rect x="25.5" y={cy} width="5" height="4" rx="0.5" fill="none" stroke="#B8962A" strokeWidth="0.3" opacity="0.5" />
                {/* Interlocking triangle */}
                <path d={`M26 ${cy + 2} L28 ${cy} L30 ${cy + 2} L28 ${cy + 4} Z`} stroke="#D4AF37" strokeWidth="0.3" fill="none" opacity="0.4" />
                {/* Inner dot */}
                <circle cx="28" cy={cy + 2} r="0.4" fill="#00E5FF" opacity="0.2" />
                {/* Micro-groove lines */}
                <line x1="25.5" y1={cy + 1} x2="30.5" y2={cy + 1} stroke="#E8C84A" strokeWidth="0.1" opacity="0.2" />
                <line x1="25.5" y1={cy + 3} x2="30.5" y2={cy + 3} stroke="#E8C84A" strokeWidth="0.1" opacity="0.2" />
              </g>
            )
          })}

          {/* Shaft oxidation patina (gradual buildup at bottom) */}
          <rect x="26" y="60" width="4" height="39" fill="url(#oxidation)" rx="0" />

          {/* === WEIGHTED CONICAL POMMEL === */}
          {/* Pommel base ring */}
          <rect x="24.5" y="98" width="7" height="3" rx="0.8" fill="url(#goldBase)" stroke="#8A6A1A" strokeWidth="0.3" />
          {/* Conical body */}
          <path d="M25 101 L28 113 L31 101 Z" fill="url(#goldBase)" />
          {/* Left shadow facet */}
          <path d="M25 101 L28 113 L26.5 101 Z" fill="url(#goldDark)" opacity="0.25" />
          {/* Center highlight */}
          <line x1="28" y1="101" x2="28" y2="112" stroke="#E8C84A" strokeWidth="0.3" opacity="0.3" />
          {/* Pommel impact ring */}
          <ellipse cx="28" cy="101" rx="3.5" ry="0.8" fill="none" stroke="#B8962A" strokeWidth="0.3" opacity="0.5" />
          {/* Spear cone tip */}
          <path d="M27.5 113 L28 118 L28.5 113 Z" fill="url(#goldBase)" />
          <path d="M28 117 L28 118" stroke="#E8C84A" strokeWidth="0.4" opacity="0.6" />
          {/* Pommel groove */}
          <line x1="26" y1="106" x2="30" y2="106" stroke="#5A3E0A" strokeWidth="0.3" opacity="0.3" />
          <line x1="26" y1="110" x2="30" y2="110" stroke="#5A3E0A" strokeWidth="0.3" opacity="0.3" />

          {/* === BIOLUMINESCENT PLANKTON PARTICLES === */}
          {[
            { cx: 22, cy: 8, r: 0.5 }, { cx: 34, cy: 6, r: 0.4 },
            { cx: 18, cy: 18, r: 0.3 }, { cx: 38, cy: 15, r: 0.35 },
            { cx: 16, cy: 35, r: 0.25 }, { cx: 40, cy: 42, r: 0.3 },
            { cx: 15, cy: 55, r: 0.2 }, { cx: 41, cy: 60, r: 0.25 },
            { cx: 14, cy: 75, r: 0.3 }, { cx: 42, cy: 80, r: 0.2 },
            { cx: 20, cy: 90, r: 0.25 }, { cx: 36, cy: 95, r: 0.3 },
            { cx: 30, cy: 104, r: 0.35 },
          ].map((p, i) => (
            <circle key={`plankton-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#00E5FF" opacity={0.15 + (i % 3) * 0.1} />
          ))}

          {/* Cyan glow drips from prongs */}
          {[
            { x1: 27.5, y1: 28, x2: 27, y2: 32 },
            { x1: 28.5, y1: 28, x2: 29, y2: 31 },
          ].map((d, i) => (
            <line key={`drip-${i}`} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="#00E5FF" strokeWidth="0.3" opacity="0.15" strokeLinecap="round" />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}
