'use client'

import { useState } from 'react'
import Link from 'next/link'

const SUB_KEY = 'aqua-subscribers'

function saveLocal(email: string) {
  try {
    const raw = localStorage.getItem(SUB_KEY)
    const list: string[] = raw ? JSON.parse(raw) : []
    if (!list.includes(email)) {
      list.push(email)
      localStorage.setItem(SUB_KEY, JSON.stringify(list))
    }
    return true
  } catch {
    return false
  }
}

async function postApi(email: string): Promise<boolean> {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 3000)
    const r = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: c.signal,
    })
    clearTimeout(t)
    return r.ok
  } catch {
    return false
  }
}

export default function Contact() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!v || state === 'saving') return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setMsg('Please enter a valid email.')
      return
    }
    setState('saving')
    setMsg('')
    const ok = await postApi(v)
    if (!ok) saveLocal(v)
    setState('done')
    setMsg(ok ? 'You are on the list — check your inbox for updates.' : 'You are on the list — saved on this device.')
    setEmail('')
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <p className="section-label">04 — Join the mission</p>
        <h2>JOIN THE MISSION</h2>
        <p>
          Be part of the movement to protect our oceans. Subscribe for updates on our progress,
          pilot programs, and ways to get involved.
        </p>

        {state === 'done' ? (
          <div style={{ marginTop: 24 }} className="note">
            <strong style={{ color: 'var(--ink)' }}>Thanks for joining!</strong> {msg}
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ marginTop: 28, maxWidth: 420 }}>
            <label htmlFor="join-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Email address
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                id="join-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  flex: '1 1 220px',
                  padding: '11px 16px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--ink)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--teal)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
              />
              <button type="submit" className="btn" disabled={state === 'saving'} style={{ whiteSpace: 'nowrap' }}>
                {state === 'saving' ? 'Joining…' : 'Join the Mission'}
              </button>
            </div>
            {msg && state === 'idle' && <p style={{ marginTop: 10, fontSize: '0.85rem', color: '#ff9a9a' }}>{msg}</p>}
          </form>
        )}

        <p style={{ marginTop: 18, fontSize: '0.85rem', color: 'var(--ink-soft)', opacity: 0.8 }}>
          We respect your privacy. <Link href="/privacy">Privacy Policy</Link>
        </p>

        <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Or reach us directly:</p>
          <ul className="contact-links">
            <li><a href="mailto:hello@aquaguardian.example">hello@aquaguardian.example</a></li>
            <li><a href="https://github.com/Hustlenix/aquaguardian" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
