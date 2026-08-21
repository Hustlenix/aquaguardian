import { NextResponse } from 'next/server'
import { updateDb } from '@/lib/dataStore'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown }
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    updateDb((d) => {
      if (!d.subscribers.includes(email)) d.subscribers.push(email)
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
