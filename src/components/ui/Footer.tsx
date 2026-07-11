'use client'

import { Twitter, Github, Linkedin, Instagram } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'About', href: '#mission' },
  { label: 'Mission', href: '#mission' },
  { label: 'Technology', href: '#technology' },
  { label: 'Impact', href: '#impact' },
  { label: 'FAQ', href: '#faq' },
]

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: 'https://twitter.com', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
]

export default function Footer() {
  return (
    <footer className="bg-[#010B13] border-t border-white/5 section-padding">
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand column */}
          <div>
            <h3
              className="text-xl font-bold tracking-[0.15em] text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              AQUAGUARDIAN
            </h3>
            <p className="text-body text-sm leading-relaxed max-w-xs">
              An AI-powered autonomous guardian monitoring and restoring ocean
              ecosystems. Combining advanced robotics with environmental science
              to protect our planet&apos;s most vital resource.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-white mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-sm text-text-muted hover:text-white transition-colors duration-300"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {social.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mt-12 mb-6" />
        <p className="text-xs text-text-muted text-center tracking-wider">
          &copy; 2026 AquaGuardian. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
