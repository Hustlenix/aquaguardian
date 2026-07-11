'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
    // In production: send to API endpoint
  }

  return (
    <SectionWrapper id="contact">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-2xl mx-auto text-center glass-panel-strong p-8 md:p-12 rounded-2xl"
      >
        <h2 className="heading-lg text-gold-400 mb-4">
          JOIN THE MISSION
        </h2>

        <p className="text-elegant text-white/70 max-w-xl mx-auto mb-8">
          Be part of the movement to protect our oceans. Subscribe for updates
          on our progress, pilot programs, and ways to get involved.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-cyan-400/10 flex items-center justify-center">
              <CheckCircle size={28} className="text-cyan-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-white">
              Thank you for joining the mission!
            </p>
            <p className="text-xs text-text-muted">
              We&apos;ll keep you updated on our progress.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <label htmlFor="contact-email" className="sr-only">
                Email address
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
              >
                <Send size={16} strokeWidth={1.5} />
                Subscribe
              </button>
            </motion.div>
          </motion.form>
        )}
      </motion.div>
    </SectionWrapper>
  )
}
