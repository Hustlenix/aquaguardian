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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'nav-blur shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="section-inner flex items-center justify-between px-4 md:px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          className="text-lg md:text-xl font-bold tracking-[0.15em] text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          AQUAGUARDIAN
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm tracking-widest uppercase text-text-muted hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="primary" href="#impact">
            Join the Mission
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden nav-blur border-t border-white/5">
          <ul className="flex flex-col items-center gap-6 py-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-sm tracking-widest uppercase text-text-muted hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
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
