import Link from 'next/link'

const TEAM = [
  {
    name: 'Darmigan',
    focus: 'Robotics & Build',
    text: 'Hands-on with the mechanical side — prototyping the collection mechanism and testing how it holds up in real water.',
  },
  {
    name: 'Sanjay',
    focus: 'Software & Systems',
    text: 'Builds the software behind the project — from this site to the logic that would guide an autonomous cleanup run.',
  },
  {
    name: 'Inba Arasan',
    focus: 'Design & Outreach',
    text: 'Shapes how AquaGuardian looks and speaks — the visual identity, the story, and sharing the mission at every opportunity.',
  },
]

export default function Team() {
  return (
    <section className="section" id="team">
      <div className="container">
        <p className="section-label">05 — The team</p>
        <h2>The team behind AquaGuardian</h2>
        <p>
          Three students building a vision for cleaner oceans — one concept, one prototype, and one
          dive at a time. <Link href="/team">Meet the team →</Link>
        </p>
        <div className="pillars" style={{ marginTop: 32 }}>
          {TEAM.map((m) => (
            <div key={m.name} className="pillar">
              <h3 data-num={m.focus}>{m.name}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
