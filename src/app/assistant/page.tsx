'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { askAssistant } from '@/lib/api'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTED_PROMPTS = [
  'What does the robot do?',
  'How does the AI work?',
  "What's the impact so far?",
]

let nextId = 1

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  const send = async (text: string) => {
    const prompt = text.trim()
    if (!prompt || busy) return
    setInput('')
    setMessages((prev) => [...prev, { id: nextId++, role: 'user', text: prompt }])
    setBusy(true)
    const response = await askAssistant(prompt)
    setMessages((prev) => [...prev, { id: nextId++, role: 'assistant', text: response }])
    setBusy(false)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.14),_transparent_35%),_#010B13] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold-400/80">AI assistant companion</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
              Give visitors a guided explanation layer for the mission and technology.
            </h1>
          </div>
          <Link href="/" className="rounded-full border border-gold-400/30 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10">
            Back to story
          </Link>
        </div>

        <section className="flex h-[560px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.length === 0 && !busy && (
              <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                <Sparkles className="h-10 w-10 text-cyan-400/70" strokeWidth={1} />
                <div>
                  <p className="text-lg font-medium text-white">Ask me anything about the mission.</p>
                  <p className="mt-2 text-sm text-text-muted">
                    I can explain the ocean crisis, the Aegis robot, the technology, or the impact we track.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => send(prompt)}
                      className="rounded-full border border-gold-400/30 bg-[#010B13]/70 px-4 py-2 text-sm text-gold-400 transition hover:border-gold-400/60 hover:bg-gold-400/10"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === 'user'
                        ? 'rounded-br-md border border-gold-400/30 bg-gold-400/10 text-white'
                        : 'rounded-bl-md border border-cyan-400/20 bg-[#041525]/80 text-text-muted'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {busy && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-cyan-400/20 bg-[#041525]/80 px-4 py-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 [animation-delay:300ms]" />
                </div>
              </motion.div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void send(input)
            }}
            className="flex items-center gap-3 border-t border-white/10 bg-[#010B13]/70 p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the ocean, the robot, or the mission…"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-muted focus:border-cyan-400/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400/15 text-gold-400 transition hover:bg-gold-400/25 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
