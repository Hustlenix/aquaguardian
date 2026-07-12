'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import ScrollProgress from '@/components/ui/ScrollProgress'
import HeroSection from '@/components/sections/HeroSection'
import MissionSection from '@/components/sections/MissionSection'
import ProblemSection from '@/components/sections/ProblemSection'
import SolutionSection from '@/components/sections/SolutionSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import TechnologySection from '@/components/sections/TechnologySection'
import PrototypeSection from '@/components/sections/PrototypeSection'
import TimelineSection from '@/components/sections/TimelineSection'
import ImpactSection from '@/components/sections/ImpactSection'
import GallerySection from '@/components/sections/GallerySection'
import FAQSection from '@/components/sections/FAQSection'
import TeamSection from '@/components/sections/TeamSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/ui/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'

const World = dynamic(() => import('@/world/World'), { ssr: false })

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <World />
      </div>
      <div className="content-z">
        <Navigation />
        <main>
          <HeroSection />
          <MissionSection />
          <ProblemSection />
          <SolutionSection />
          <div className="section-divider-gold max-w-[200px] mx-auto" />
          <HowItWorksSection />
          <TechnologySection />
          <PrototypeSection />
          <ImpactSection />
          <div className="section-divider-gold max-w-[200px] mx-auto" />
          <TimelineSection />
          <GallerySection />
          <FAQSection />
          <TeamSection />
          <ContactSection />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
