import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-elegant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-numeric',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AquaGuardian',
  description: 'A guardian awakens to protect the ocean.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorantGaramond.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
