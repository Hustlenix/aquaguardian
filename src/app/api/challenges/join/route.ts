import { NextResponse } from 'next/server'
import { updateDb } from '@/lib/dataStore'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown }
    const id = body.id
    if (typeof id !== 'string' || id.length === 0) {
      return NextResponse.json({ error: 'Challenge id is required' }, { status: 400 })
    }

    const db = updateDb((d) => {
      const challenge = d.challenges.find((c) => c.id === id)
      if (challenge) challenge.participants += 1
    })

    const challenge = db.challenges.find((c) => c.id === id)
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    return NextResponse.json({ challenge })
  } catch {
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
