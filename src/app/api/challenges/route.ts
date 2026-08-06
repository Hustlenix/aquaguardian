import { NextResponse } from 'next/server'
import { readDb } from '@/lib/dataStore'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ challenges: db.challenges })
  } catch {
    return NextResponse.json({ error: 'Failed to read challenges' }, { status: 500 })
  }
}
