'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, BookOpen, Trophy } from 'lucide-react'
import { getLearnModules, completeModule, type LearnModule } from '@/lib/api'

interface QuizState {
  answers: (number | null)[]
  submitted: boolean
  passed: boolean
}

function emptyQuizState(module: LearnModule): QuizState {
  return { answers: module.quiz.map(() => null), submitted: false, passed: false }
}

export default function LearnPage() {
  const [modules, setModules] = useState<LearnModule[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<Record<string, QuizState>>({})

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

  const getQuiz = (module: LearnModule): QuizState =>
    quizState[module.id] ?? emptyQuizState(module)

  const selectOption = (module: LearnModule, questionIndex: number, optionIndex: number) => {
    const state = getQuiz(module)
    if (state.submitted || module.completed) return
    setQuizState((prev) => ({
      ...prev,
      [module.id]: {
        ...state,
        answers: state.answers.map((a, i) => (i === questionIndex ? optionIndex : a)),
      },
    }))
  }

  const submitQuiz = (module: LearnModule) => {
    const state = getQuiz(module)
    const passed = state.answers.every((a, i) => a === module.quiz[i].answer)
    setQuizState((prev) => ({
      ...prev,
      [module.id]: { ...state, submitted: true, passed },
    }))
  }

  const retakeQuiz = (module: LearnModule) => {
    setQuizState((prev) => ({ ...prev, [module.id]: emptyQuizState(module) }))
  }

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
            const quiz = getQuiz(module)
            const allAnswered = quiz.answers.every((a) => a !== null)
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

                        {module.quiz.length > 0 && (
                          <div className="rounded-2xl border border-gold-400/20 bg-[#010B13]/60 p-5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400/90">
                                Knowledge check
                              </h3>
                              {module.completed && (
                                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
                                  Passed
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-xs leading-5 text-text-muted">
                              Answer both questions correctly to unlock completion of this module.
                            </p>

                            <div className="mt-4 space-y-4">
                              {module.quiz.map((question, qIndex) => (
                                <div key={qIndex}>
                                  <p className="text-sm font-medium leading-6 text-white">
                                    {qIndex + 1}. {question.question}
                                  </p>
                                  <div className="mt-2 grid gap-2">
                                    {question.options.map((option, oIndex) => {
                                      const selected = quiz.answers[qIndex] === oIndex
                                      const isCorrect = oIndex === question.answer
                                      const showFeedback = module.completed || quiz.submitted
                                      let className =
                                        'border border-white/10 bg-white/5 text-text-muted hover:border-gold-400/40 hover:text-white'
                                      if (selected && !showFeedback) {
                                        className =
                                          'border-gold-400/60 bg-gold-400/10 text-gold-300'
                                      }
                                      if (showFeedback && isCorrect) {
                                        className =
                                          'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                                      } else if (showFeedback && selected) {
                                        className =
                                          'border-red-400/50 bg-red-400/10 text-red-300'
                                      } else if (showFeedback) {
                                        className =
                                          'border-white/5 bg-white/[0.02] text-text-muted opacity-50'
                                      }
                                      return (
                                        <button
                                          key={oIndex}
                                          onClick={() => selectOption(module, qIndex, oIndex)}
                                          disabled={module.completed || quiz.submitted}
                                          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${className}`}
                                        >
                                          <span>{option}</span>
                                          {showFeedback && isCorrect && (
                                            <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                                          )}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {!module.completed && !quiz.submitted && (
                              <button
                                onClick={() => submitQuiz(module)}
                                disabled={!allAnswered}
                                className="mt-4 rounded-full border border-gold-400/40 bg-gold-400/10 px-5 py-2 text-sm text-gold-300 transition hover:bg-gold-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {allAnswered ? 'Submit answers' : 'Answer both questions to submit'}
                              </button>
                            )}

                            {!module.completed && quiz.submitted && (
                              <div className="mt-4 space-y-3">
                                {quiz.passed ? (
                                  <div className="flex items-center gap-3 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3">
                                    <Trophy className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
                                    <p className="text-sm text-cyan-100">
                                      Quiz passed — completion unlocked. Complete the module to
                                      record your progress.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="rounded-xl border border-red-400/25 bg-red-400/5 px-4 py-3 text-sm text-red-200">
                                    Not quite — review the lessons and try again. Correct answers
                                    are highlighted in green.
                                  </div>
                                )}
                                <div className="flex flex-wrap items-center gap-3">
                                  {!quiz.passed && (
                                    <button
                                      onClick={() => retakeQuiz(module)}
                                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-muted transition hover:border-white/30 hover:text-white"
                                    >
                                      Retake quiz
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleComplete(module.id)}
                                    disabled={!quiz.passed || completing === module.id}
                                    className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition disabled:opacity-60 ${
                                      quiz.passed
                                        ? 'border-gold-400/30 text-gold-400 hover:border-gold-400/60 hover:bg-gold-400/10'
                                        : 'border-white/10 text-text-muted'
                                    }`}
                                  >
                                    <Check className="h-4 w-4" strokeWidth={1.5} />
                                    {quiz.passed ? 'Complete module' : 'Pass the quiz to complete'}
                                  </button>
                                </div>
                              </div>
                            )}

                            {module.completed && (
                              <p className="mt-4 flex items-center gap-2 text-sm text-cyan-300">
                                <Check className="h-4 w-4" strokeWidth={2} />
                                Module completed
                              </p>
                            )}
                          </div>
                        )}
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
