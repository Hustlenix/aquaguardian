'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, BookOpen } from 'lucide-react'
import { getLearnModules, completeModule, type LearnModule } from '@/lib/api'

export default function LearnPage() {
  const [modules, setModules] = useState<LearnModule[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getLearnModules().then((data) => {
      if (!active) return
      setModules(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const completedCount = modules.filter((m) => m.completed).length
  const total = modules.length

  const handleComplete = async (id: string) => {
    setCompleting(id)
    // Optimistic update.
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, completed: true } : m)))
    try {
      const updated = await completeModule(id)
      setModules((prev) => prev.map((m) => (m.id === id ? updated : m)))
    } catch {
      // Non-fatal: optimistic state already reflects completion.
    } finally {
      setCompleting(null)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.16),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">Interactive educational mode</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Teach ocean stewardship through guided, interactive learning.
            </h1>
          </div>
          <Link href="/" className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10">
            Back to story
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/70">Learning progress</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {loading ? '…' : `${completedCount} / ${total} modules completed`}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-gold-400"
              initial={false}
              animate={{ width: total > 0 ? `${(completedCount / total) * 100}%` : '0%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl space-y-4">
          {modules.map((module, index) => {
            const isOpen = openId === module.id
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : module.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        module.completed
                          ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-300'
                          : 'border-gold-400/30 text-gold-400'
                      }`}
                    >
                      {module.completed ? (
                        <Check className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-gold-400">
                        {module.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-text-muted">{module.summary}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-gold-400/70" strokeWidth={1.5} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="space-y-5 px-6 pb-6">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.title}>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400/80">
                              {lesson.title}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-text-muted">{lesson.body}</p>
                          </div>
                        ))}
                        <button
                          onClick={() => handleComplete(module.id)}
                          disabled={module.completed || completing === module.id}
                          className={`mt-2 flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition disabled:opacity-60 ${
                            module.completed
                              ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                              : 'border-gold-400/30 text-gold-400 hover:border-gold-400/60 hover:bg-gold-400/10'
                          }`}
                        >
                          <Check className="h-4 w-4" strokeWidth={1.5} />
                          {module.completed ? 'Module completed' : 'Mark complete'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
