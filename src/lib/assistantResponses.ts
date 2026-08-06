/**
 * Shared canned-assistant logic. Imported by both the server route
 * (src/app/api/assistant/route.ts) and the client helper (src/lib/api.ts)
 * so the chat behaves identically in server mode and on the static export.
 */

const RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['robot', 'aegis', 'drone', 'machine', 'collect', 'cleanup'],
    response:
      'Aegis is the AquaGuardian concept robot — an autonomous underwater vehicle imagined with multi-spectral sensors, computer vision, and a precision collection arm. It scans the water column for plastic debris, identifies targets in murky conditions, and removes them with gentle suction or gripper tools so fragile habitats stay intact.',
  },
  {
    keywords: ['ocean', 'reef', 'plastic', 'pollution', 'sea', 'marine', 'water', 'debris'],
    response:
      'The ocean faces a compounding crisis: an estimated 8–12 million tonnes of plastic enter it every year, while rising temperatures bleach coral reefs that shelter 25% of marine life. AquaGuardian frames this crisis as an engineering and stewardship story — sensors to see it, robots to act on it, and citizens to keep it from happening.',
  },
  {
    keywords: ['mission', 'goal', 'purpose', 'vision', 'objective'],
    response:
      'The mission is threefold: detect plastic and chemical pollution at river mouths and coastlines, collect debris without damaging the ecosystems it sits in, and turn every collection into open data that communities and researchers can act on. Prevention remains the priority — the robot cleans up, but the real win is stopping waste from reaching the ocean.',
  },
  {
    keywords: ['ai', 'technology', 'sensor', 'how', 'work', 'algorithm', 'compute', 'vision'],
    response:
      'The technology layer imagines an autonomous loop: sonar and optical sensors map the environment, a computer-vision model classifies debris versus marine life in real time, and a mission planner decides the safest approach. Every sighting becomes a data point in the dashboard, so each collection run also improves the next one.',
  },
  {
    keywords: ['impact', 'co2', 'progress', 'result', 'evidence', 'data', 'stat'],
    response:
      'Impact is tracked the honest way: every collection event is logged with amount, location, and timestamp, and the dashboard renders the time series so progress is visible. The figures are illustrative concept targets, but they are grounded in real conservation math — every kilogram of debris removed protects habitat and reduces the burden on marine food webs.',
  },
  {
    keywords: ['patrol', 'cycle', 'route', 'loop', 'autonomous', 'navigate', 'battery', 'charge', 'energy', 'solar', 'power'],
    response:
      'Aegis runs on a continuous patrol cycle: it scans a programmed route, identifies debris targets, collects them one at a time, and returns them to a surface dock before resuming. The concept pairs solar-recharged batteries with low-drag hull design so the robot can stay on station for days — the patrol loop is deliberately simple, because reliability matters more than speed underwater.',
  },
  {
    keywords: ['kelp', 'coral', 'fish', 'biodiversity', 'species', 'mangrove', 'seagrass', 'wildlife'],
    response:
      'The habitats the mission protects — kelp forests, mangroves, seagrass beds, and coral reefs — are the ocean\'s most productive ecosystems. Kelp forests absorb carbon and shelter juvenile fish; mangroves buffer coastlines and filter runoff; reefs support a quarter of marine species. That is why the robot is designed for precision: it removes debris without dragging nets through living habitat.',
  },
  {
    keywords: ['dashboard', 'telemetry', 'charts', 'time series', 'pipeline', 'metrics'],
    response:
      'The dashboard turns collection events into visible progress: a time series of logged pickups, per-zone totals, and the simulated pipeline metrics behind the scenes. It follows the same discipline as real ocean monitoring — repeated sampling, published timestamps, and honest labeling of what is simulated versus measured.',
  },
  {
    keywords: ['missions', 'challenges', 'quiz', 'learn', 'education', 'leaderboard', 'community', 'volunteer', 'citizen', 'join', 'school'],
    response:
      'Beyond the robot, AquaGuardian is a participation layer: field missions you can tick off, community challenges with a leaderboard, and interactive learning modules with a knowledge check at the end of each one. The idea is that stewardship scales through people — every classroom session, cleanup day, and reef observation feeds the same open-data mission.',
  },
  {
    keywords: ['subscribe', 'newsletter', 'email', 'update', 'contact'],
    response:
      'The newsletter is a low-frequency update on the project — pilot programs, new data releases, and calls for participation. No analytics, no tracking, no third-party sharing; subscribing only saves your email address. Unsubscribe at any time.',
  },
  {
    keywords: ['cost', 'expensive', 'price', 'afford', 'economic', 'funding', 'budget', 'invest'],
    response:
      'Cost is the honest bottleneck of ocean cleanup. Robotics platforms, support vessels, and maintenance dominate budgets, which is exactly why AquaGuardian pairs collection with prevention and citizen science — community monitoring and source reduction cost a fraction of mechanical cleanup while preventing the problem at its origin.',
  },
  {
    keywords: ['mobile', 'app', 'phone', 'field', 'offline', 'sync'],
    response:
      'The mobile companion is designed for field teams: live telemetry, mission checklists, and offline-first behavior so progress syncs to the dashboard even without a connection. Same data, same mission — just pocket-sized for people actually on the coast.',
  },
]

const DEFAULT_RESPONSE =
  'Great question. I can tell you about the ocean crisis, what the Aegis robot does, the AquaGuardian mission, how the technology works, or the impact we track. Try one of those — or ask me something specific about reefs, plastic pollution, or the data on the dashboard.'

export function answerPrompt(prompt: string): string {
  const text = prompt.toLowerCase()
  for (const entry of RESPONSES) {
    if (entry.keywords.some((k) => text.includes(k))) return entry.response
  }
  return DEFAULT_RESPONSE
}
