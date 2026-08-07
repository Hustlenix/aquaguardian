/**
 * Dual-mode data layer for AquaGuardian pages.
 *
 * Server mode (npm run dev / npm run start): every helper tries the real API
 * under /api/* (backed by src/lib/dataStore.ts + database.json) with a short
 * timeout. Static mode (GitHub Pages): the API directory is removed by CI, so
 * fetches fail fast and every helper falls back to bundled seed data below,
 * with user progress persisted to localStorage so the static site still feels
 * alive.
 *
 * The fallback data mirrors the API response shapes EXACTLY — the contract is
 * shared with the server implementation.
 */

export interface Mission {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Moderate' | 'Expert'
  reward: string
  impact: number
  completed: boolean
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  participants: number
  deadline: string
}

export interface LeaderboardEntry {
  name: string
  initials: string
  points: number
}

export interface Lesson {
  title: string
  body: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

export interface LearnModule {
  id: string
  title: string
  summary: string
  completed: boolean
  lessons: Lesson[]
  quiz: QuizQuestion[]
}

export interface CollectionEntry {
  amount: number
  location: string
  timestamp: string
}

export interface StatsData {
  totalPlastic: number
  collections: CollectionEntry[]
}

/* ------------------------------------------------------------------ */
/* localStorage helpers                                                */
/* ------------------------------------------------------------------ */

const KEYS = {
  missions: 'aqua-missions', // { [missionId]: boolean } overrides
  challenges: 'aqua-challenges', // string[] joined challenge ids
  learn: 'aqua-learn', // string[] completed module ids
} as const

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveLocal(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked — non-fatal.
  }
}

/* ------------------------------------------------------------------ */
/* Fetch with timeout                                                  */
/* ------------------------------------------------------------------ */

async function apiFetch<T>(path: string, init?: RequestInit, timeoutMs = 3000): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(path, { ...init, signal: controller.signal })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

/* ------------------------------------------------------------------ */
/* Fallback seed data (bundled for static export)                      */
/* ------------------------------------------------------------------ */

const FALLBACK_MISSIONS: Mission[] = [
  {
    id: 'river-cleanup',
    title: 'River mouth cleanup scan',
    description:
      'Scan river mouths and urban coastlines where debris accumulates, log accumulation hotspots, and coordinate a local cleanup event around the top three.',
    category: 'Cleanup',
    difficulty: 'Easy',
    reward: '150 AG credits',
    impact: 500,
    completed: false,
  },
  {
    id: 'reef-health-review',
    title: 'Reef health condition review',
    description:
      'Track reef health, water clarity, and habitat change over time using repeated observations at a fixed transect — the baseline every restoration plan needs.',
    category: 'Monitoring',
    difficulty: 'Moderate',
    reward: '200 AG credits',
    impact: 120,
    completed: false,
  },
  {
    id: 'microplastic-survey',
    title: 'Microplastic sampling survey',
    description:
      'Collect surface-water samples at three coastal sites, filter for microplastics, and publish a simple local data sheet for schools and researchers.',
    category: 'Monitoring',
    difficulty: 'Moderate',
    reward: '200 AG credits',
    impact: 80,
    completed: false,
  },
  {
    id: 'schools-program',
    title: 'Ocean literacy school program',
    description:
      'Bring a 45-minute ocean literacy session to ten local classrooms, pairing the robot story with real marine debris science and one classroom action.',
    category: 'Education',
    difficulty: 'Easy',
    reward: '100 AG credits',
    impact: 40,
    completed: false,
  },
  {
    id: 'coastal-community-day',
    title: 'Coastal community clean-up day',
    description:
      'Organize a volunteer clean-up along one kilometer of coastline, weigh everything collected, and report the results through the dashboard.',
    category: 'Cleanup',
    difficulty: 'Moderate',
    reward: '250 AG credits',
    impact: 300,
    completed: false,
  },
  {
    id: 'tracker-buoys',
    title: 'Plastic tracking buoy pilot',
    description:
      'Deploy three low-cost tracking buoys at a river mouth to measure debris outflow over one tidal cycle and validate the model with real data.',
    category: 'Monitoring',
    difficulty: 'Expert',
    reward: '400 AG credits',
    impact: 200,
    completed: false,
  },
]

const FALLBACK_CHALLENGES: Challenge[] = [
  {
    id: 'plastic-audit-week',
    title: 'Plastic audit week',
    description:
      'Log every piece of single-use plastic you avoid for one week and compare your results with the community leaderboard.',
    difficulty: 'Easy',
    participants: 128,
    deadline: '2026-09-15T00:00:00Z',
  },
  {
    id: 'reef-watch-streak',
    title: 'Reef watch streak',
    description:
      'Record one reef observation each day for 14 days to help track habitat change over time.',
    difficulty: 'Easy',
    participants: 96,
    deadline: '2026-09-30T00:00:00Z',
  },
  {
    id: 'river-guardian',
    title: 'River guardian challenge',
    description:
      'Join or organize a local river cleanup campaign, weigh the collected waste, and share the results with the community.',
    difficulty: 'Medium',
    participants: 74,
    deadline: '2026-10-10T00:00:00Z',
  },
  {
    id: 'zero-waste-month',
    title: 'Zero-waste month',
    description:
      'Run a full month with no single-use plastics — document your swaps, struggles, and solutions for the community library.',
    difficulty: 'Hard',
    participants: 41,
    deadline: '2026-10-31T00:00:00Z',
  },
]

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    name: 'Maya Chen',
    initials: 'MC',
    points: 1240,
  },
  {
    name: 'Jonas Weber',
    initials: 'JW',
    points: 980,
  },
  {
    name: 'Amara Okafor',
    initials: 'AO',
    points: 745,
  },
]

const FALLBACK_LEARN_MODULES: LearnModule[] = [
  {
    id: 'coral-reefs',
    title: 'Coral Reef Ecosystems',
    summary:
      'Why coral reefs are the most biodiverse ecosystems in the ocean and what threatens them.',
    completed: false,
    lessons: [
      {
        title: 'Rainforests of the sea',
        body: 'Coral reefs cover less than 1% of the ocean floor yet support roughly 25% of all marine species. They are built by tiny animals — coral polyps — that secrete calcium carbonate skeletons and live in partnership with photosynthetic algae called zooxanthellae.',
      },
      {
        title: 'The threats',
        body: 'Rising sea temperatures cause bleaching, where stressed corals expel their algae and turn white; marine heatwaves can kill reefs in weeks. Ocean acidification slows skeleton growth, and local stressors — overfishing, sedimentation, and plastic debris — compound the damage.',
      },
    ],
    quiz: [
      {
        question:
          'What covers less than 1% of the ocean floor yet supports roughly 25% of all marine species?',
        options: ['Mangrove forests', 'Coral reefs', 'Kelp beds', 'Deep-sea vents'],
        answer: 1,
      },
      {
        question: 'What is the direct trigger of coral bleaching?',
        options: [
          'Ocean acidification alone',
          'Sustained warm temperatures that stress corals',
          'Plastic debris on the reef',
          'Predatory fish',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'plastic-pollution',
    title: 'Plastic Pollution in the Ocean',
    summary: 'Where ocean plastic comes from, where it ends up, and why it persists for centuries.',
    completed: false,
    lessons: [
      {
        title: 'The numbers',
        body: 'An estimated 8 to 12 million tonnes of plastic enter the ocean every year — roughly one garbage truck per minute (Jambeck et al., 2015). Most originates on land: uncollected waste and mismanaged landfill in coastal regions, carried to sea by rivers.',
      },
      {
        title: 'Why plastic persists',
        body: 'Plastic does not biodegrade; it photodegrades — sunlight breaks it into ever-smaller pieces called microplastics and nanoplastics. These particles are ingested by plankton, fish, seabirds, and marine mammals, entering food webs that include humans.',
      },
    ],
    quiz: [
      {
        question: 'How much plastic is estimated to enter the ocean every year?',
        options: [
          '8 to 12 million tonnes',
          '1 to 2 million tonnes',
          '50 million tonnes',
          'Less than 100,000 tonnes',
        ],
        answer: 0,
      },
      {
        question: 'Why does plastic persist in the ocean for centuries?',
        options: [
          'It biodegrades extremely slowly',
          'It photodegrades into smaller fragments instead of breaking down',
          'Marine bacteria cannot attach to it',
          'It sinks below the reach of decomposers',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'underwater-robotics',
    title: 'Underwater Robotics',
    summary: 'How autonomous vehicles navigate, sense, and work beneath the surface.',
    completed: false,
    lessons: [
      {
        title: 'ROVs and AUVs',
        body: 'Underwater robots come in two main flavors: remotely operated vehicles (ROVs), tethered to a surface ship and human-controlled, and autonomous underwater vehicles (AUVs), which follow pre-programmed missions without a cable.',
      },
      {
        title: 'Collecting without destroying',
        body: 'Collecting debris on the seabed is an exercise in precision: currents push everything, visibility is short, and fragile habitats sit next to the waste. Robots use computer vision to identify targets, then approach slowly with suction or gripper tools designed to disturb as little sediment as possible.',
      },
    ],
    quiz: [
      {
        question: 'What is the key difference between an ROV and an AUV?',
        options: [
          'ROVs are tethered and human-controlled; AUVs run autonomous missions',
          'ROVs fly above the water',
          'AUVs are always larger than ROVs',
          'There is no practical difference',
        ],
        answer: 0,
      },
      {
        question: 'Why do underwater robots rely on acoustic sensors for navigation?',
        options: [
          'Radio waves do not travel well through water',
          'Sonar is cheaper than cameras',
          'Cameras always fail underwater',
          'Sound waves travel slower in air',
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'water-quality',
    title: 'Water Quality Monitoring',
    summary:
      'The core measurements that tell us whether water is healthy — and what changes reveal.',
    completed: false,
    lessons: [
      {
        title: 'The essential measurements',
        body: 'The classic water quality suite covers temperature, pH, dissolved oxygen, salinity, and turbidity. Temperature drives every biological rate; dissolved oxygen directly limits fish and invertebrate life; turbidity measures suspended particles that can smother habitats and block light.',
      },
      {
        title: 'From sensors to decisions',
        body: 'A single reading is a snapshot; trends are the story. Continuous or repeated sampling lets scientists separate natural variation — tides, seasons, storms — from genuine decline. That is why modern monitoring combines fixed buoys, robotic surveys, and citizen-collected samples into one time series.',
      },
    ],
    quiz: [
      {
        question: 'Which of these is part of the classic water quality measurement suite?',
        options: ['Dissolved oxygen', 'Wind speed', 'Wave height', 'Sunlight hours'],
        answer: 0,
      },
      {
        question: 'What does eutrophication cause in coastal waters?',
        options: [
          'Higher oxygen levels',
          'Algal blooms that collapse oxygen levels',
          'Cleared, transparent water',
          'Faster coral growth',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'ocean-data',
    title: 'Ocean Data & Citizen Science',
    summary: 'How open data and public participation are changing the way we understand the ocean.',
    completed: false,
    lessons: [
      {
        title: 'The open ocean data revolution',
        body: 'Satellites, Argo floats, and research ships produce petabytes of ocean data, but much of it was historically locked in institutional archives. Open initiatives now publish near-real-time temperature, current, and chlorophyll data that anyone can use.',
      },
      {
        title: 'Making data tell a story',
        body: 'Raw sensor readings do not move people; trends and maps do. Visualizing collection events as time series and locating them on a map turns a spreadsheet into an argument for action.',
      },
    ],
    quiz: [
      {
        question: 'Why do monitoring programs combine buoys, robotic surveys, and citizen samples?',
        options: [
          'It is cheaper than any single method',
          'Repeated sampling separates real trends from natural variation',
          'Robots alone are unreliable',
          'Buoys are the only instruments that collect plastic',
        ],
        answer: 1,
      },
      {
        question: 'What makes citizen science useful at ocean scale?',
        options: [
          'Volunteers replace all research instruments',
          'Consistent protocols turn many observers into reliable sensors',
          'No training or tools are needed',
          'It only works for fish counts',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'marine-restoration',
    title: 'Marine Restoration',
    summary: 'What restoration really involves — and why prevention comes first.',
    completed: false,
    lessons: [
      {
        title: 'Restoration is a craft, not a miracle',
        body: 'Restoring a marine habitat means rebuilding the conditions that let life return: clean water, stable substrate, and enough protection for young organisms to survive. Coral nurseries grow fragments on underwater frames before outplanting them onto degraded reefs.',
      },
      {
        title: 'Prevention beats restoration',
        body: 'Restoration is slow, expensive, and uncertain; preventing damage is fast, cheap, and reliable. Stopping plastic from entering the ocean and protecting existing reefs is orders of magnitude more effective than cleaning up afterwards.',
      },
    ],
    quiz: [
      {
        question: 'What do coral nurseries do before outplanting fragments onto degraded reefs?',
        options: [
          'Grow fragments on underwater frames',
          'Build artificial islands',
          'Remove all fish from the area',
          'Drain the surrounding water',
        ],
        answer: 0,
      },
      {
        question: 'Why does prevention beat restoration in marine conservation?',
        options: [
          'Restoration is slow, expensive, and uncertain',
          'Prevention is more visible to the public',
          'Restoration never succeeds',
          'Prevention costs more than cleanup',
        ],
        answer: 0,
      },
    ],
  },
]

const FALLBACK_STATS: StatsData = {
  totalPlastic: 1804,
  collections: [
    { amount: 106, location: 'Gulf of Mexico', timestamp: '2026-07-05T19:08:00Z' },
    { amount: 102, location: 'Persian Gulf', timestamp: '2026-07-20T02:07:00Z' },
    { amount: 88, location: 'Great Pacific Garbage Patch', timestamp: '2026-07-19T18:34:00Z' },
    { amount: 20, location: 'Coral Triangle', timestamp: '2026-07-28T16:43:00Z' },
    { amount: 72, location: 'Persian Gulf', timestamp: '2026-07-07T13:25:00Z' },
    { amount: 46, location: 'Mediterranean Sea', timestamp: '2026-07-26T07:52:00Z' },
    { amount: 41, location: 'Caribbean Sea', timestamp: '2026-07-05T14:55:00Z' },
    { amount: 80, location: 'Coral Triangle', timestamp: '2026-07-01T16:00:00Z' },
    { amount: 59, location: 'Coral Triangle', timestamp: '2026-07-01T03:20:00Z' },
    { amount: 88, location: 'Great Pacific Garbage Patch', timestamp: '2026-07-27T00:28:00Z' },
    { amount: 61, location: 'Persian Gulf', timestamp: '2026-07-14T16:48:00Z' },
    { amount: 83, location: 'North Atlantic Gyre', timestamp: '2026-07-28T22:23:00Z' },
  ],
}

/* ------------------------------------------------------------------ */
/* Assistant — shared canned logic (mirrors the server route)          */
/* ------------------------------------------------------------------ */

import { answerPrompt as answerPromptLocal } from './assistantResponses'

/* ------------------------------------------------------------------ */
/* Public helpers                                                      */
/* ------------------------------------------------------------------ */

export async function getMissions(): Promise<Mission[]> {
  try {
    const data = await apiFetch<{ missions: Mission[] }>('/api/missions')
    const overrides = loadLocal<Record<string, boolean>>(KEYS.missions, {})
    return data.missions.map((m) => ({
      ...m,
      completed: overrides[m.id] ?? m.completed,
    }))
  } catch {
    const overrides = loadLocal<Record<string, boolean>>(KEYS.missions, {})
    return FALLBACK_MISSIONS.map((m) => ({
      ...m,
      completed: overrides[m.id] ?? m.completed,
    }))
  }
}

export async function toggleMission(id: string): Promise<Mission> {
  let updated: Mission | null = null
  try {
    const data = await apiFetch<{ mission: Mission }>('/api/missions/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    updated = data.mission
  } catch {
    // Static mode — resolve locally.
  }
  const overrides = loadLocal<Record<string, boolean>>(KEYS.missions, {})
  const current = overrides[id] ?? FALLBACK_MISSIONS.find((m) => m.id === id)?.completed ?? false
  overrides[id] = !current
  saveLocal(KEYS.missions, overrides)
  if (updated) return { ...updated, completed: overrides[id] }
  const base = FALLBACK_MISSIONS.find((m) => m.id === id)
  if (!base) throw new Error('Mission not found')
  return { ...base, completed: overrides[id] }
}

export function resetMissionProgress(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEYS.missions)
}

export async function getChallenges(): Promise<Challenge[]> {
  try {
    const data = await apiFetch<{ challenges: Challenge[] }>('/api/challenges')
    return data.challenges
  } catch {
    return FALLBACK_CHALLENGES
  }
}

export async function joinChallenge(id: string): Promise<Challenge> {
  let updated: Challenge | null = null
  try {
    const data = await apiFetch<{ challenge: Challenge }>('/api/challenges/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    updated = data.challenge
  } catch {
    // Static mode — resolve locally.
  }
  const joined = new Set(loadLocal<string[]>(KEYS.challenges, []))
  joined.add(id)
  saveLocal(KEYS.challenges, Array.from(joined))
  if (updated) return updated
  const base = FALLBACK_CHALLENGES.find((c) => c.id === id)
  if (!base) throw new Error('Challenge not found')
  return { ...base, participants: base.participants + 1 }
}

export function isChallengeJoined(id: string): boolean {
  return loadLocal<string[]>(KEYS.challenges, []).includes(id)
}

/** Demo leaderboard — identical in server and static modes (bundled seed). */
export function getLeaderboard(): LeaderboardEntry[] {
  return FALLBACK_LEADERBOARD
}

export async function getLearnModules(): Promise<LearnModule[]> {
  try {
    const data = await apiFetch<{ modules: LearnModule[] }>('/api/learn')
    const done = new Set(loadLocal<string[]>(KEYS.learn, []))
    return data.modules.map((m) => ({ ...m, completed: m.completed || done.has(m.id) }))
  } catch {
    const done = new Set(loadLocal<string[]>(KEYS.learn, []))
    return FALLBACK_LEARN_MODULES.map((m) => ({ ...m, completed: done.has(m.id) }))
  }
}

export async function completeModule(id: string): Promise<LearnModule> {
  try {
    const data = await apiFetch<{ module: LearnModule }>('/api/learn/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const done = new Set(loadLocal<string[]>(KEYS.learn, []))
    done.add(id)
    saveLocal(KEYS.learn, Array.from(done))
    return { ...data.module, completed: true }
  } catch {
    const done = new Set(loadLocal<string[]>(KEYS.learn, []))
    done.add(id)
    saveLocal(KEYS.learn, Array.from(done))
    const base = FALLBACK_LEARN_MODULES.find((m) => m.id === id)
    if (!base) throw new Error('Module not found')
    return { ...base, completed: true }
  }
}

export async function askAssistant(prompt: string): Promise<string> {
  try {
    const data = await apiFetch<{ response: string }>('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    return data.response
  } catch {
    return answerPromptLocal(prompt)
  }
}

export async function getStats(): Promise<StatsData> {
  try {
    const data = await apiFetch<StatsData>('/api/stats')
    return data
  } catch {
    return FALLBACK_STATS
  }
}
