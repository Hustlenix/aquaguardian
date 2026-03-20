'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Button from './Button'

const NAV_LINKS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Problem', href: '#problem' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
  { label: 'Prototype', href: '#prototype' },
  { label: 'Impact', href: '#impact' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Determine active section based on scroll position
      const sectionIds = NAV_LINKS.map((l) => l.href.slice(1))
      const scrollPos = window.scrollY + 150

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'nav-blur shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="section-inner flex items-center justify-between px-4 md:px-6 py-3 md:py-3">
        {/* Logo */}
        <a
          href="#"
          className="text-base md:text-lg font-bold tracking-[0.15em] text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          AQUAGUARDIAN
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  className={`text-xs tracking-[0.18em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-gold-400'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                )}
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="primary" href="#impact">
            Join the Mission
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 relative"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          {/* Active dot on mobile hamburger */}
          {activeSection && !mobileOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[rgba(1,11,19,0.97)] border-t border-white/5">
          <ul className="flex flex-col items-center gap-5 py-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    onClick={handleNavClick}
                    className={`text-xs tracking-[0.18em] uppercase transition-colors duration-300 ${
                      isActive
                        ? 'text-gold-400'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                  )}
                </li>
              )
            })}
            <li className="pt-3">
              <Button variant="primary" href="#impact" onClick={handleNavClick}>
                Join the Mission
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
