import { NextResponse } from 'next/server'
import { readDb } from '@/lib/dataStore'

export async function GET() {
  try {
    const data = readDb()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read stats' }, { status: 500 })
  }
}
