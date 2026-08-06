'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Turbulence at depth</p>
        <h1 className="text-6xl font-semibold tracking-[0.08em] text-gold-400 sm:text-7xl">500</h1>
        <h2 className="text-2xl font-semibold tracking-[0.08em] text-white sm:text-3xl">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm leading-7 text-text-muted">
          A strong current knocked the systems offline. The mission data is safe — try again, or
          return to the surface.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full border border-gold-400/30 px-6 py-3 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-text-muted transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
