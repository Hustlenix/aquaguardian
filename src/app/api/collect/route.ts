import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, timestamp, location } = body

    const dbPath = path.join(process.cwd(), 'database.json')
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

    const newEntry = {
      amount,
      timestamp: timestamp || new Date().toISOString(),
      location: location || 'River Zone A',
    }
    data.collections.push(newEntry)
    data.totalPlastic += amount

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

    console.log(`Robot reported: ${amount} pieces collected!`)
    return NextResponse.json(
      { message: 'Data saved successfully!', total: data.totalPlastic },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to save collection data' }, { status: 500 })
  }
}
