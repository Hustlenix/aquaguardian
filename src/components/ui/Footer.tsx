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
    <footer className="relative bg-gradient-to-b from-[#010B13] to-[#000508] section-padding pt-16">
      {/* Gold top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent blur-[2px]" />

      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <h3
              className="text-lg md:text-xl font-bold tracking-[0.15em] text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              AQUAGUARDIAN
            </h3>
            <p className="text-body text-sm leading-relaxed max-w-xs text-text-muted/80">
              An AI-powered autonomous guardian monitoring and restoring ocean
              ecosystems. Combining advanced robotics with environmental science
              to protect our planet&apos;s most vital resource.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400/70 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-gold-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400/70 mb-5">
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
                      className="inline-flex items-center gap-3 text-sm text-text-muted hover:text-gold-400 transition-all duration-300 group"
                    >
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-400/15 transition-all duration-300">
                        <Icon size={14} strokeWidth={1.5} className="group-hover:text-gold-400 transition-colors duration-300" />
                      </span>
                      <span>{social.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted/60 tracking-wider">
            &copy; 2026 AquaGuardian. All rights reserved.
          </p>
          <p className="text-[0.6rem] text-text-muted/40 tracking-widest uppercase">
            Protecting our oceans with intelligent autonomy
          </p>
        </div>
      </div>
    </footer>
  )
}
