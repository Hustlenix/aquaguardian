import { NextResponse } from 'next/server'
import { answerPrompt } from '@/lib/assistantResponses'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt?: unknown }
    const prompt = body.prompt
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }
    return NextResponse.json({ response: answerPrompt(prompt) })
  } catch {
    return NextResponse.json({ error: 'Failed to answer prompt' }, { status: 500 })
  }
}
