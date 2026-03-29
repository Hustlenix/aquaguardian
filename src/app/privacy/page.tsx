'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#010B13] text-[#E8F0F0]">
      <div className="section-inner px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="heading-lg text-gold-400 mb-8">Privacy Policy</h1>
          <p className="text-xs text-text-muted mb-8">Last updated: July 12, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="heading-md text-white mb-3">1. Information We Collect</h2>
              <p className="text-text-muted">
                When you subscribe to our newsletter, we collect your email address. We may also
                collect anonymized usage data through standard web analytics to improve our site.
              </p>
            </section>

            <section>
              <h2 className="heading-md text-white mb-3">2. How We Use Your Information</h2>
              <p className="text-text-muted">
                We use your email address solely to send you updates about AquaGuardian&apos;s
                progress, pilot programs, and ocean conservation initiatives. We do not sell,
                rent, or share your personal information with third parties.
              </p>
            </section>

            <section>
              <h2 className="heading-md text-white mb-3">3. Data Protection</h2>
              <p className="text-text-muted">
                We implement reasonable security measures to protect your information. However,
                no method of electronic storage is 100% secure. You can unsubscribe from our
                communications at any time by replying to any email we send.
              </p>
            </section>

            <section>
              <h2 className="heading-md text-white mb-3">4. Your Rights</h2>
              <p className="text-text-muted">
                Depending on your jurisdiction, you may have the right to access, correct, or
                delete your personal data. To exercise these rights, please contact us.
              </p>
            </section>

            <section>
              <h2 className="heading-md text-white mb-3">5. Contact</h2>
              <p className="text-text-muted">
                For privacy-related inquiries, please reach out through our contact form or
                email us at privacy@aquaguardian.io.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
