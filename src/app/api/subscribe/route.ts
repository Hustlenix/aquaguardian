import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { email?: unknown } | null
    const email = typeof body?.email === 'string' ? body.email.trim() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

<<<<<<< HEAD
    console.log('[Subscribe] New signup:', email)

    return NextResponse.json({ success: true, message: 'Successfully subscribed' }, { status: 200 })
=======
    return NextResponse.json(
      { success: true, message: 'Successfully subscribed' },
      { status: 200 }
    )
>>>>>>> 2c79eb6 (Polish README and document AI-assisted build)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
