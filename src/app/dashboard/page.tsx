import Link from 'next/link'
import stats from '@/data/stats.json'

const rows = [
  { key: 'debrisKg', label: 'Debris collected', unit: 'kg' },
  { key: 'missions', label: 'Missions completed', unit: '' },
  { key: 'hours', label: 'Time underwater', unit: 'hours' },
  { key: 'speciesSeen', label: 'Species logged', unit: '' },
] as const

const max = Math.max(...rows.map((r) => stats[r.key]))

export default function DashboardPage() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link className="brand" href="/">Aqua<span>Guardian</span></Link>
          <Link href="/">Back to site</Link>
        </div>
      </nav>
      <main>
        <div className="dash-head">
          <div className="container">
            <p className="section-label">Field report</p>
            <h1>AquaGuardian dashboard</h1>
            <p>
              Latest figures from the robot&apos;s log. Illustrative concept
              data, updated as the project develops.
            </p>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <div className="numbers">
              {rows.map((r) => (
                <div className="number" key={r.key}>
                  <div className="num">{stats[r.key].toLocaleString()}</div>
                  <div className="cap">{r.label}</div>
                </div>
              ))}
            </div>
            {rows.map((r) => (
              <div className="bar-row" key={r.key}>
                <div className="label">
                  <span>{r.label}</span>
                  <span>{stats[r.key].toLocaleString()} {r.unit}</span>
                </div>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.round((stats[r.key] / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="note">
              All numbers are placeholder figures for the concept build. The
              reporting pipeline — this page, its data file, and the build
              that publishes it — is real.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
