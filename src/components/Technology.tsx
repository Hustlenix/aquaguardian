export default function Technology() {
  return (
    <section className="section" id="technology">
      <div className="container">
        <p className="section-label">02 — Technology</p>
        <h2>Three systems, one job</h2>
        <p>
          The robot keeps the stack deliberately small. Every part earns its
          place or it gets cut.
        </p>
        <div className="pillars">
          <div className="pillar" data-num="A">
            <h3>Seeing</h3>
            <p>
              A camera for the close work and sonar for the murk. The onboard
              classifier only has to answer one question — debris or not —
              and it is trained on the kinds of trash that actually end up in
              the water: nets, crates, packaging.
            </p>
          </div>
          <div className="pillar" data-num="B">
            <h3>Moving</h3>
            <p>
              Six thrusters and a control loop that holds position against the
              current. Power comes from a lithium pack topped up by a surface
              dock, so the robot never drags a tether or a charging cable
              through the reef.
            </p>
          </div>
          <div className="pillar" data-num="C">
            <h3>Reporting</h3>
            <p>
              Every pickup is a data point: what it was, where it was found,
              how deep. The dashboard on this site is the reporting side —
              the same record a real deployment would publish.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
