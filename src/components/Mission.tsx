export default function Mission() {
  return (
    <section className="section" id="mission">
      <div className="container">
        <p className="section-label">01 — Mission</p>
        <h2>Why build a robot for this?</h2>
        <p>
          Most debris in the ocean never gets picked up. It sinks, it breaks
          into smaller pieces, and it stays there. Divers can reach shallow
          water; trawlers can reach deep water but damage the seabed while
          they are there. There is a gap between the two, and that gap is
          where AquaGuardian works.
        </p>
        <p>
          The robot patrols a defined area, uses cameras and sonar to spot
          plastic and fishing gear, picks it up, and carries it to a
          collection point on the surface. Every item is photographed and
          logged, so the work is visible and measurable — not just a
          floating platform making promises.
        </p>
        <p>
          This is a concept build. The numbers on this site are illustrative,
          but the engineering questions they point to are real: how a small
          robot stays underwater for weeks, how it tells debris from marine
          life, and how a fleet of them would coordinate without a human
          in the loop.
        </p>
      </div>
    </section>
  )
}
