import { NextResponse } from 'next/server'
import { readDb } from '@/lib/dataStore'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ missions: db.missions })
  } catch {
    return NextResponse.json({ error: 'Failed to read missions' }, { status: 500 })
  }
}
