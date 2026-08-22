'use client'

import { useState } from 'react'
import Link from 'next/link'

const TEAM = [
  {
    name: 'Darmigan',
    focus: 'Robotics & Build',
    blurb:
      'Hands-on with the mechanical side — prototyping the collection mechanism and testing how the design holds up in real water conditions.',
  },
  {
    name: 'Sanjay',
    focus: 'Software & Systems',
    blurb:
      'Builds the software that drives the project — from the interactive experience on this site to the logic that would guide an autonomous cleanup run.',
  },
  {
    name: 'Inba Arasan',
    focus: 'Design & Outreach',
    blurb:
      'Shapes how AquaGuardian looks and speaks — the visual identity, the story, and sharing the mission with new people at every opportunity.',
  },
]

export default function TeamPage() {
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <div style={{ background: 'var(--deep)', minHeight: '100vh', color: 'var(--ink)' }}>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            Aqua<span>Guardian</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <Link href="/" style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
          ← Back to Home
        </Link>

        <p className="section-label" style={{ marginTop: 32 }}>
          The team
        </p>
        <h1 style={{ marginBottom: 12 }}>The team</h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '60ch', marginBottom: 36 }}>
          Three students on a mission to protect our oceans. AquaGuardian is our answer to plastic
          pollution — a robot concept that cleans waterways one dive at a time, and this site is
          where we make that vision tangible.
        </p>

        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)',
            marginBottom: 10,
          }}
        >
          {photoOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/team.jpg"
              alt="The AquaGuardian team — Darmigan, Sanjay, and Inba Arasan"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <div style={{ padding: '72px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🌊</div>
              <p style={{ fontWeight: 700, color: 'var(--ink)' }}>Darmigan · Sanjay · Inba Arasan</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: 6 }}>
                Team photo coming soon — add your group photo at <code>public/images/team.jpg</code>
              </p>
            </div>
          )}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', opacity: 0.7, textAlign: 'center', marginBottom: 48 }}>
          The AquaGuardian team at a robotics exhibition.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {TEAM.map((m) => (
            <div
              key={m.name}
              style={{
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: '22px 18px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(79,209,197,0.12)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: 'var(--teal)',
                  marginBottom: 12,
                }}
              >
                {m.name[0]}
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{m.name}</h3>
              <p style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 10 }}>
                {m.focus}
              </p>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{m.blurb}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: 28,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <h3 style={{ marginBottom: 8 }}>Want to help?</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', marginBottom: 18 }}>
            We are looking for mentors and feedback. Subscribe on the homepage and we will keep you
            posted.
          </p>
          <Link href="/#contact" className="btn">
            Join the Mission
          </Link>
        </div>
      </main>
    </div>
  )
}
