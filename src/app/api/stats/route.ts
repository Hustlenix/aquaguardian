import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'database.json')
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read stats' }, { status: 500 })
  }
}
