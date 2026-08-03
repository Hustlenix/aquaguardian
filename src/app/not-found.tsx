import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Lost in the abyss</p>
        <h1 className="text-6xl font-semibold tracking-[0.08em] text-gold-400 sm:text-7xl">404</h1>
        <h2 className="text-2xl font-semibold tracking-[0.08em] text-white sm:text-3xl">
          Page not found
        </h2>
        <p className="max-w-md text-sm leading-7 text-text-muted">
          This depth of the ocean is uncharted — the page you&apos;re looking for doesn&apos;t exist
          or has drifted away. Head back to the surface to continue the mission.
        </p>
        <Link
          href="/"
          className="rounded-full border border-gold-400/30 px-6 py-3 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
