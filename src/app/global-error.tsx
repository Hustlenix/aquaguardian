'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-[#010B13]">
        <main className="flex min-h-screen items-center justify-center px-6 py-16 text-white">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Deep system failure</p>
            <h1 className="text-6xl font-semibold tracking-[0.08em] text-gold-400 sm:text-7xl">
              {error.digest ?? '500'}
            </h1>
            <h2 className="text-2xl font-semibold tracking-[0.08em] text-white sm:text-3xl">
              The whole vessel is offline
            </h2>
            <p className="max-w-md text-sm leading-7 text-[#8A9AA0]">
              A critical error occurred while rendering this page. The mission continues — reload
              the app to resurface.
            </p>
            <button
              onClick={reset}
              className="rounded-full border border-gold-400/30 px-6 py-3 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
