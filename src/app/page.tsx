import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Mission from '@/components/Mission'
import Technology from '@/components/Technology'
import Impact from '@/components/Impact'
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
        <Contact />
      </main>
      <Footer />
    </>
  )
}
