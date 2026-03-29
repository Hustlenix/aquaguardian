import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import JsonLd from './JsonLd'

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
  title: 'AquaGuardian | AI-Powered Ocean Restoration',
  description:
    "An AI-powered autonomous guardian monitoring and restoring ocean ecosystems. Combining advanced robotics with environmental science to protect our planet's most vital resource.",
  keywords: ['ocean cleanup', 'autonomous underwater vehicle', 'AI marine conservation', 'ocean restoration', 'aquatic robot'],
  authors: [{ name: 'AquaGuardian' }],
  creator: 'AquaGuardian',
  publisher: 'AquaGuardian',
  openGraph: {
    title: 'AquaGuardian | AI-Powered Ocean Restoration',
    description:
      'An AI-powered autonomous guardian monitoring and restoring ocean ecosystems. Combining advanced robotics with environmental science.',
    url: 'https://hustlenix.github.io/aquaguardian',
    siteName: 'AquaGuardian',
    images: [
      {
        url: 'https://hustlenix.github.io/aquaguardian/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AquaGuardian — AI-Powered Ocean Restoration',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaGuardian | AI-Powered Ocean Restoration',
    description:
      'An AI-powered autonomous guardian monitoring and restoring ocean ecosystems.',
    images: ['https://hustlenix.github.io/aquaguardian/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/aquaguardian/favicon.svg',
    shortcut: '/aquaguardian/favicon.svg',
  },
  manifest: '/aquaguardian/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorantGaramond.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <JsonLd />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
