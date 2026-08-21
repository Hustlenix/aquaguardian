import { NextResponse } from 'next/server'
import { readDb } from '@/lib/dataStore'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ modules: db.learn.modules })
  } catch {
    return NextResponse.json({ error: 'Failed to read learn modules' }, { status: 500 })
  }
}
