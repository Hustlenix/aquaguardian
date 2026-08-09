import stats from '@/data/stats.json'

export default function Impact() {
  const figures = [
    { value: stats.debrisKg, label: 'kg of debris collected' },
    { value: stats.missions, label: 'missions completed' },
    { value: stats.hours, label: 'hours underwater' },
    { value: stats.speciesSeen, label: 'species sighted and logged' },
  ]

  return (
    <section className="section" id="impact">
      <div className="container">
        <p className="section-label">03 — Impact</p>
        <h2>What the log says</h2>
        <p>
          The robot keeps a public record of its own work. Concept numbers,
          real structure: every figure below is the kind of value a deployed
          unit would report after a season.
        </p>
        <div className="numbers">
          {figures.map((f) => (
            <div className="number" key={f.label}>
              <div className="num">{f.value.toLocaleString()}</div>
              <div className="cap">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
