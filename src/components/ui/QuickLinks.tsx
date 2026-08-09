'use client'

import Link from 'next/link'
import {
  Bot,
  Compass,
  Cpu,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Smartphone,
  Target,
  TrendingUp,
  Trophy,
  Waves,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface QuickLink {
  label: string
  href: string
  icon: LucideIcon
}

const SECTION_LINKS: QuickLink[] = [
  { label: 'About', href: '#mission', icon: Waves },
  { label: 'Mission', href: '#mission', icon: Compass },
  { label: 'Technology', href: '#technology', icon: Cpu },
  { label: 'Impact', href: '#impact', icon: TrendingUp },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
  { label: 'Privacy', href: '/privacy', icon: Lock },
]

const ROUTE_LINKS: QuickLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Missions', href: '/missions', icon: Target },
  { label: 'Challenges', href: '/challenges', icon: Trophy },
  { label: 'Education', href: '/learn', icon: GraduationCap },
  { label: 'Assistant', href: '/assistant', icon: Bot },
  { label: 'Mobile', href: '/mobile', icon: Smartphone },
]

export default function QuickLinks() {
  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 max-w-2xl">
      {[...SECTION_LINKS, ...ROUTE_LINKS].map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.7rem] tracking-wide text-white/70 backdrop-blur-md hover:border-gold-400/40 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <Icon className="w-3.5 h-3.5 text-gold-400/80" strokeWidth={1.75} />
          {label}
        </Link>
      ))}
    </div>
  )
}
