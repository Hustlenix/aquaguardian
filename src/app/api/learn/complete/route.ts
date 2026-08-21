import { NextResponse } from 'next/server'
import { updateDb } from '@/lib/dataStore'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown }
    const id = body.id
    if (typeof id !== 'string' || id.length === 0) {
      return NextResponse.json({ error: 'Module id is required' }, { status: 400 })
    }

    const db = updateDb((d) => {
      const learnModule = d.learn.modules.find((m) => m.id === id)
      if (learnModule) learnModule.completed = true
    })

    const learnModule = db.learn.modules.find((m) => m.id === id)
    if (!learnModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    return NextResponse.json({ module: learnModule })
  } catch {
    return NextResponse.json({ error: 'Failed to complete module' }, { status: 500 })
  }
}
