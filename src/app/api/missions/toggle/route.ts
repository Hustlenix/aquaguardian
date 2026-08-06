import { NextResponse } from 'next/server'
import { updateDb } from '@/lib/dataStore'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown }
    const id = body.id
    if (typeof id !== 'string' || id.length === 0) {
      return NextResponse.json({ error: 'Mission id is required' }, { status: 400 })
    }

    const db = updateDb((d) => {
      const mission = d.missions.find((m) => m.id === id)
      if (mission) mission.completed = !mission.completed
    })

    const mission = db.missions.find((m) => m.id === id)
    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
    }

    return NextResponse.json({ mission })
  } catch {
    return NextResponse.json({ error: 'Failed to toggle mission' }, { status: 500 })
  }
}
