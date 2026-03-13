'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionWrapper from './SectionWrapper'

const faqs = [
  {
    q: 'What is AquaGuardian?',
    a: 'AquaGuardian is an AI-powered autonomous underwater vehicle designed to monitor ocean health, collect plastic waste, and restore marine ecosystems through advanced robotics and environmental science.',
  },
  {
    q: 'How does AquaGuardian detect pollution?',
    a: 'Using a multi-spectral sensor array and computer vision, AquaGuardian identifies microplastics, chemical pollutants, and biological changes in real-time with 98% accuracy.',
  },
  {
    q: 'Is the technology available for commercial use?',
    a: 'We are currently in the pilot deployment phase. Commercial licensing and partnership opportunities will be announced in Q4 2026.',
  },
  {
    q: 'How much plastic can AquaGuardian collect?',
    a: 'Each unit can process up to 500 kg of plastic waste per day. Our goal is to deploy 1,000 units globally by 2028.',
  },
  {
    q: 'How is the robot powered?',
    a: 'AquaGuardian uses a hybrid system: solar panels for surface operations and hydrogen fuel cells for deep-water missions, enabling continuous 24/7 operation.',
  },
  {
    q: 'Can I support the project?',
    a: 'Absolutely. You can contribute by spreading awareness, donating to our research fund, or partnering with us as a conservation organization.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <SectionWrapper id="faq">
      <h2 className="heading-lg text-gold-400 text-center mb-12">FAQ</h2>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-panel overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left group"
              aria-expanded={openIndex === i}
            >
              <span className="font-medium text-sm md:text-base pr-4 text-white group-hover:text-gold-400 transition-colors duration-300">
                {faq.q}
              </span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <ChevronDown
                  className="w-4 h-4 text-gold-400/70"
                  strokeWidth={1.5}
                />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
