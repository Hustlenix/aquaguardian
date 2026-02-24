'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import MissionSection from '@/components/sections/MissionSection'
import ProblemSection from '@/components/sections/ProblemSection'
import SolutionSection from '@/components/sections/SolutionSection'
import TechnologySection from '@/components/sections/TechnologySection'
import TimelineSection from '@/components/sections/TimelineSection'
import ImpactSection from '@/components/sections/ImpactSection'
import FAQSection from '@/components/sections/FAQSection'
import Footer from '@/components/ui/Footer'

const World = dynamic(() => import('@/world/World'), { ssr: false })

export default function Home() {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <World />
      </div>
      <div className="content-z">
        <Navigation />
        <main>
          <HeroSection />
          <div className="section-divider" />
          <MissionSection />
          <div className="section-divider" />
          <ProblemSection />
          <div className="section-divider" />
          <SolutionSection />
          <div className="section-divider" />
          <TechnologySection />
          <div className="section-divider" />
          <TimelineSection />
          <div className="section-divider" />
          <ImpactSection />
          <div className="section-divider" />
          <FAQSection />
          <div className="section-divider" />
        </main>
        <Footer />
      </div>
    </>
  )
}
