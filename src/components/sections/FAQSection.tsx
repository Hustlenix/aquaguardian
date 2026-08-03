'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionWrapper from './SectionWrapper'
import { useEffect } from 'react'

const faqs = [
  {
    q: 'Is AquaGuardian a real product?',
    a: 'No. AquaGuardian is a concept experience — a fictional-but-grounded vision of autonomous ocean restoration, built as a personal portfolio project. No hardware exists, nothing is deployed, and no company is behind it. The robot, its specs, and its "mission results" are illustrative narrative elements.',
  },
  {
    q: 'Where do the statistics on the site come from?',
    a: 'Every figure shown as a fact is real and cited to a published source — UNEP and the Pew Charitable Trusts, the FAO, and peer-reviewed studies such as Jambeck et al. (2015) and Eriksen et al. (2023). The dashboard pipeline numbers are simulated demo data (generated with a fixed seed), clearly labeled as such, and are not real collection records.',
  },
  {
    q: 'How would the concept detect pollution?',
    a: 'The concept story imagines a multi-spectral sensor array and computer vision identifying microplastics, chemical pollutants, and biological changes. These are aspirational engineering ideas, not tested specifications — no accuracy claims are made.',
  },
  {
    q: 'Is the technology available for commercial use?',
    a: 'No. There is no technology to license — this is a design concept. You can explore the story, the design system, and the code, which is open source under the MIT License.',
  },
  {
    q: 'How much plastic could a robot like this collect?',
    a: 'No real collection capability exists. The prototype figures shown are illustrative concept targets. For real context: an estimated 8–12 million tonnes of plastic enter the ocean each year (Jambeck et al., Science 2015), which is why real cleanup efforts are urgently needed.',
  },
  {
    q: 'How is the robot powered in the concept?',
    a: 'The concept story imagines a hybrid system with solar panels for surface operations and battery storage for deep-water missions. These are narrative design choices, not tested engineering ratings.',
  },
  {
    q: 'Can I support the project?',
    a: 'The best support is getting involved with real ocean conservation. Consider donating to or volunteering with organizations like The Ocean Cleanup, the Surfrider Foundation, or your local marine-protection group. You can also reach out at hello@aquaguardian.dev.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

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
                <ChevronDown className="w-4 h-4 text-gold-400/70" strokeWidth={1.5} />
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
                  <div className="px-5 pb-5 text-sm text-text-muted leading-relaxed">{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
