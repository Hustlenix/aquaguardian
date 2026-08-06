import fs from 'fs'
import path from 'path'

/**
 * Shared persistence layer for the AquaGuardian API routes.
 *
 * Storage decision: the project-root `database.json` is the single source of
 * truth for server mode (npm run dev / npm run start). It is committed to the
 * repo so the seed data ships with the project, and it is also what the
 * existing `/api/stats` route already reads — so we extend it rather than
 * introduce a second file.
 *
 * Writes are atomic (temp file + rename) and reads are served from an
 * in-memory cache so repeated reads never hit the disk more than needed.
 *
 * NOTE: On GitHub Pages the whole `src/app/api` directory is moved aside by
 * CI before the static export, so these routes (and this module) never run
 * on the static site — pages there use `src/lib/api.ts` bundled fallbacks +
 * localStorage instead.
 */

export interface CollectionEntry {
  amount: number
  location: string
  timestamp: string
}

export interface Mission {
  id: string
  title: string
  description: string
  category: string
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

export interface Lesson {
  title: string
  body: string
}

export interface LearnModule {
  id: string
  title: string
  summary: string
  completed: boolean
  lessons: Lesson[]
}

export interface DbShape {
  totalPlastic: number
  collections: CollectionEntry[]
  missions: Mission[]
  challenges: Challenge[]
  learn: { modules: LearnModule[] }
  subscribers: string[]
}

function emptyDb(): DbShape {
  return {
    totalPlastic: 0,
    collections: [],
    missions: [],
    challenges: [],
    learn: { modules: [] },
    subscribers: [],
  }
}

const dbPath = () => path.join(process.cwd(), 'database.json')

let cache: DbShape | null = null

export function readDb(): DbShape {
  if (cache) return cache
  try {
    const raw = fs.readFileSync(dbPath(), 'utf-8')
    cache = { ...emptyDb(), ...(JSON.parse(raw) as Partial<DbShape>) }
  } catch {
    // Missing or corrupt file: fall back to an empty shape instead of crashing.
    cache = emptyDb()
  }
  return cache
}

export function writeDb(db: DbShape): DbShape {
  const target = dbPath()
  const tmp = `${target}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf-8')
  fs.renameSync(tmp, target)
  cache = db
  return db
}

/** Read, mutate, persist — the standard mutation path for routes. */
export function updateDb(mutator: (db: DbShape) => void): DbShape {
  const db = readDb()
  mutator(db)
  return writeDb(db)
}
