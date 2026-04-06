'use client'

import { useCallback } from 'react'

const NAV_LINKS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Technology', href: '#technology' },
  { label: 'Impact', href: '#impact' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export default function FloatingNav() {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <nav className="flex items-center gap-1 px-3 py-2 rounded-full bg-[rgba(1,11,19,0.75)] backdrop-blur-lg border border-white/10 shadow-lg shadow-black/20">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="px-3 py-1.5 text-[10px] tracking-[0.18em] uppercase text-white/60 hover:text-gold-400 transition-colors duration-300 rounded-full hover:bg-white/5"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
