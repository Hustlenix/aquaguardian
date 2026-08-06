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
    keywords: ['ai', 'technology', 'sensor', 'how', 'work', 'algorithm', 'compute'],
    response:
      'The technology layer imagines an autonomous loop: sonar and optical sensors map the environment, a computer-vision model classifies debris versus marine life in real time, and a mission planner decides the safest approach. Every sighting becomes a data point in the dashboard, so each collection run also improves the next one.',
  },
  {
    keywords: ['impact', 'co2', 'progress', 'result', 'evidence', 'data', 'stat'],
    response:
      'Impact is tracked the honest way: every collection event is logged with amount, location, and timestamp, and the dashboard renders the time series so progress is visible. The figures are illustrative concept targets, but they are grounded in real conservation math — every kilogram of debris removed protects habitat and reduces the burden on marine food webs.',
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
