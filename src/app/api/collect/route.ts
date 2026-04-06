import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface CollectionPayload {
  amount?: unknown
  timestamp?: unknown
  location?: unknown
}

interface CollectionRecord {
  amount: number
  timestamp: string
  location: string
}

interface StorageData {
  collections?: CollectionRecord[]
  totalPlastic?: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as CollectionPayload | null

    if (!body || typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount < 0) {
      return NextResponse.json({ error: 'Invalid collection payload' }, { status: 400 })
    }

    const amount = Math.floor(body.amount)
    const timestamp = typeof body.timestamp === 'string' && body.timestamp.trim()
      ? body.timestamp
      : new Date().toISOString()
    const location = typeof body.location === 'string' && body.location.trim()
      ? body.location
      : 'River Zone A'

    const dbPath = path.join(process.cwd(), 'database.json')
    const rawData = JSON.parse(fs.readFileSync(dbPath, 'utf-8')) as StorageData
    const collections = Array.isArray(rawData.collections) ? rawData.collections : []
    const totalPlastic = typeof rawData.totalPlastic === 'number' && Number.isFinite(rawData.totalPlastic)
      ? rawData.totalPlastic
      : 0

    const nextData: StorageData = {
      collections: [...collections, { amount, timestamp, location }],
      totalPlastic: totalPlastic + amount,
    }

    fs.writeFileSync(dbPath, JSON.stringify(nextData, null, 2))

    return NextResponse.json(
      { message: 'Data saved successfully!', total: nextData.totalPlastic },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to save collection data' }, { status: 500 })
  }
}
