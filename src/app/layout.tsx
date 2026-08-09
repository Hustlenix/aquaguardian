import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AquaGuardian — autonomous ocean cleanup',
  description:
    'Concept project: an autonomous robot that finds and removes debris from the ocean, with live mission data.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
