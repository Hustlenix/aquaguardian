import type { Metadata, Viewport } from 'next'
import { Cinzel, Cormorant_Garamond, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import JsonLd from './JsonLd'
import { SITE_URL } from '@/lib/constants'

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
    'A concept experience: a cinematic 3D story imagining an AI-powered autonomous guardian for ocean monitoring and restoration. Fictional narrative; real, cited ocean data.',
  keywords: [
    'ocean cleanup',
    'autonomous underwater vehicle',
    'AI marine conservation',
    'ocean restoration',
    'aquatic robot',
    'underwater storytelling',
    '3d web experience',
  ],
  authors: [{ name: 'AquaGuardian' }],
  creator: 'AquaGuardian',
  publisher: 'AquaGuardian',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AquaGuardian | AI-Powered Ocean Restoration',
    description:
      'An immersive underwater storytelling experience where AI robotics and conservation meet cinematic web design.',
    url: SITE_URL,
    siteName: 'AquaGuardian',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
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
      'A concept experience imagining an AI-powered autonomous guardian for ocean monitoring and restoration.',
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/aquaguardian/favicon.ico', sizes: 'any' },
      { url: '/aquaguardian/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/aquaguardian/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/aquaguardian/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/aquaguardian/favicon.ico',
    apple: '/aquaguardian/apple-touch-icon.png',
  },
  manifest: '/aquaguardian/site.webmanifest',
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#010B13',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorantGaramond.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <JsonLd />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
