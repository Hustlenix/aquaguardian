'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { impactFacts, missionBlueprints, type ImpactFact } from '@/data/impactData'
import { ExternalLink, Info } from 'lucide-react'

const TABS = [
  { id: 'ocean-data-tab-evidence', label: 'Ocean Facts', panelId: 'ocean-data-panel-evidence' },
  {
    id: 'ocean-data-tab-blueprints',
    label: 'Mission Blueprints',
    panelId: 'ocean-data-panel-blueprints',
  },
] as const

const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' as const } },
}

function FactCard({ fact, index }: { fact: ImpactFact; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full"
    >
      <GlassPanel className="hover-lift h-full">
        <p className="text-2xl md:text-3xl font-semibold text-numeric text-gold-400 mb-2">
          {fact.value}
        </p>
        <h3 className="heading-md text-white mb-2">{fact.title}</h3>
        <p className="text-body text-sm leading-relaxed">{fact.detail}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-cyan-400/70">
          Source: {fact.source}
        </p>
      </GlassPanel>
    </motion.div>
  )
}

export default function OceanDataSection() {
  const [activeTab, setActiveTab] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (activeTab + 1) % TABS.length
    if (e.key === 'ArrowLeft') next = (activeTab - 1 + TABS.length) % TABS.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = TABS.length - 1
    if (next !== null) {
      e.preventDefault()
      setActiveTab(next)
      tabRefs.current[next]?.focus()
    }
  }

  const sources = [...new Set(impactFacts.map((fact) => fact.source))]

  return (
    <SectionWrapper id="ocean-data">
      <div className="text-center mb-12">
        <h2 className="heading-lg text-gold-400">REAL OCEAN DATA</h2>
        <p className="text-elegant text-white/70 max-w-2xl mx-auto mt-4">
          Cited figures on the state of the ocean — the evidence that inspires the concept story
          and the mission ideas it imagines.
        </p>
      </div>

      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Ocean data views"
        onKeyDown={handleTabKeyDown}
        className="flex justify-center gap-2 mb-10"
      >
        {TABS.map((tab, i) => {
          const isActive = activeTab === i
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={tab.id}
              aria-selected={isActive}
              aria-controls={tab.panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(i)}
              className={`rounded-full border px-5 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                isActive
                  ? 'border-gold-400/60 bg-gold-400/10 text-gold-400 shadow-[0_0_18px_rgba(212,175,55,0.15)]'
                  : 'border-white/10 bg-white/5 text-text-muted hover:text-white hover:border-gold-400/30'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="evidence"
            role="tabpanel"
            id="ocean-data-panel-evidence"
            aria-labelledby="ocean-data-tab-evidence"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {impactFacts.map((fact, i) => (
                <FactCard key={fact.title} fact={fact} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            key="blueprints"
            role="tabpanel"
            id="ocean-data-panel-blueprints"
            aria-labelledby="ocean-data-tab-blueprints"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {missionBlueprints.map((bp, i) => (
                <motion.div
                  key={bp.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-full"
                >
                  <GlassPanel className="hover-lift h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="heading-md text-white">{bp.name}</h3>
                      <span className="shrink-0 rounded-full bg-cyan-400/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-cyan-400">
                        {bp.status}
                      </span>
                    </div>
                    <p className="text-body text-sm leading-relaxed">{bp.focus}</p>
                    <p className="mt-auto pt-4 text-xs uppercase tracking-[0.25em] text-gold-400/70">
                      {bp.evidence}
                    </p>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sources + honesty footer */}
      <div className="mt-12">
        <GlassPanel className="max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-cyan-400 mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80 mb-2">Sources</p>
              <p className="text-body text-xs leading-relaxed text-text-muted">
                {sources.join(' · ')}
              </p>
              <p className="text-body text-xs leading-relaxed mt-3 text-text-muted/70">
                The dashboard pipeline numbers are simulated demo data (generated with a fixed
                seed) — these figures are cited research, not outputs from any real device.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <p className="text-xs text-text-muted/60 tracking-wider">
              Explore the labeled demo dashboard for the simulation pipeline.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
            >
              See the dashboard
              <ExternalLink size={13} strokeWidth={1.5} />
            </Link>
          </div>
        </GlassPanel>
      </div>
    </SectionWrapper>
  )
}
