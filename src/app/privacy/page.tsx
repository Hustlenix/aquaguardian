import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--deep)', minHeight: '100vh', color: 'var(--ink)' }}>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            Aqua<span>Guardian</span>
          </Link>
          <Link href="/">Back to site</Link>
        </div>
      </nav>
      <main className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 720 }}>
        <h1 style={{ marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: 32 }}>Last updated: August 21, 2026</p>
        <div style={{ display: 'grid', gap: 28, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 8 }}>1. Information we collect</h2>
            <p>When you subscribe, we store your email address. In static builds this stays on your device (localStorage); when the API is available it is saved server-side in our database file.</p>
          </section>
          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 8 }}>2. How we use it</h2>
            <p>We use your email only to send updates about AquaGuardian — progress, pilot programs, and ways to get involved. No sale, no sharing.</p>
          </section>
          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 8 }}>3. Your choices</h2>
            <p>You can clear your subscription by clearing site data in your browser, or email hello@aquaguardian.example to be removed.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
