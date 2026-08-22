import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Mission from '@/components/Mission'
import Technology from '@/components/Technology'
import Impact from '@/components/Impact'
import Team from '@/components/Team'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Mission />
        <Technology />
        <Impact />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
