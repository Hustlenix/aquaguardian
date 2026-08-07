/**
 * AquaGuardian procedural audio — Web Audio API only. No audio files, no
 * dependencies, no AudioWorklet. Everything is synthesized at runtime:
 *
 *  - Ambient water loop: two looping noise layers (a low-passed body and a
 *    quiet band-passed hiss) with a slow LFO swell so the sea breathes.
 *  - Pickup blip: short sine sweep for each collected debris item.
 *  - Thruster hum: band-passed noise whose gain follows piloting.
 *
 * All audio is user-gesture gated (the AudioContext is created and resumed
 * on the first pointer/key interaction) and never autoplays. On mobile the
 * module starts muted until the visitor explicitly unmutes via the HUD.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let thrusterGain: GainNode | null = null
let muted = false
let gesturesBound = false

/** 2 s of loopable brown-ish noise (decaying random walk, not white). */
function makeNoiseBuffer(ac: AudioContext): AudioBuffer {
  const rate = ac.sampleRate
  const buffer = ac.createBuffer(1, rate * 2, rate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

function startAmbient(ac: AudioContext, out: GainNode): void {
  // Body of the water — low-passed noise, slow breathing LFO.
  const body = ac.createBufferSource()
  body.buffer = makeNoiseBuffer(ac)
  body.loop = true
  const lowpass = ac.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 380
  const ambient = ac.createGain()
  ambient.gain.value = 0.05
  body.connect(lowpass).connect(ambient).connect(out)
  body.start()

  const lfo = ac.createOscillator()
  lfo.frequency.value = 0.07
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.02
  lfo.connect(lfoGain).connect(ambient.gain)
  lfo.start()

  // Hiss layer — quiet band-passed shimmer so the loop isn't a monotone.
  const hiss = ac.createBufferSource()
  hiss.buffer = makeNoiseBuffer(ac)
  hiss.loop = true
  const bandpass = ac.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 900
  bandpass.Q.value = 0.8
  const hissGain = ac.createGain()
  hissGain.gain.value = 0.012
  hiss.connect(bandpass).connect(hissGain).connect(ambient)
  hiss.start()
}

function startThruster(ac: AudioContext, out: GainNode): void {
  const src = ac.createBufferSource()
  src.buffer = makeNoiseBuffer(ac)
  src.loop = true
  const bandpass = ac.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 140
  bandpass.Q.value = 1
  const gain = ac.createGain()
  gain.gain.value = 0
  src.connect(bandpass).connect(gain).connect(out)
  src.start()
  thrusterGain = gain
}

function createContext(): void {
  if (ctx || typeof window === 'undefined') return
  try {
    const ac = new AudioContext()
    const m = ac.createGain()
    m.gain.value = muted ? 0 : 1
    m.connect(ac.destination)
    startAmbient(ac, m)
    startThruster(ac, m)
    ctx = ac
    master = m
  } catch {
    ctx = null
    master = null
  }
}

/** Create/resume the context — safe to call on every user gesture. */
export function ensureAudio(): void {
  if (typeof window === 'undefined') return
  if (!ctx) createContext()
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume().catch(() => undefined)
  }
}

/** One-time window listeners so the first interaction unlocks audio. */
export function bindAudioGestures(): void {
  if (gesturesBound || typeof window === 'undefined') return
  gesturesBound = true
  const unlock = (): void => ensureAudio()
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
}

export function setMuted(next: boolean): void {
  muted = next
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 1, ctx.currentTime, 0.05)
  }
}

/** Toggle mute; returns the new muted state (for HUD icons). */
export function toggleMuted(): boolean {
  setMuted(!muted)
  return muted
}

export function isMuted(): boolean {
  return muted
}

/** Call before the first gesture on touch devices: start silent. */
export function setMobileDefault(mobile: boolean): void {
  if (mobile && !muted) setMuted(true)
}

/** Short pickup blip — sine sweep with a fast attack and soft decay. */
export function playPickup(): void {
  const ac = ctx
  if (!ac || !master || muted) return
  try {
    const t = ac.currentTime
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(620, t)
    osc.frequency.exponentialRampToValueAtTime(980, t + 0.15)
    const env = ac.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    const soften = ac.createBiquadFilter()
    soften.type = 'lowpass'
    soften.frequency.value = 2400
    osc.connect(soften).connect(env).connect(master)
    osc.start(t)
    osc.stop(t + 0.4)
  } catch {
    /* audio is best-effort — never throw into the scene loop */
  }
}

/** Ramps the thruster hum in/out as the visitor pilots the robot. */
export function setPiloting(on: boolean): void {
  const ac = ctx
  if (!ac || !thrusterGain) return
  const t = ac.currentTime
  thrusterGain.gain.cancelScheduledValues(t)
  thrusterGain.gain.setTargetAtTime(on ? 0.07 : 0, t, on ? 0.15 : 0.25)
}

/** Call on document hidden (visibilitychange) to save mobile battery. */
export function suspendAudio(): void {
  if (ctx && ctx.state === 'running') {
    void ctx.suspend().catch(() => undefined)
  }
}

/** Call on document visible again (only when unmuted). */
export function resumeAudio(): void {
  if (ctx && ctx.state === 'suspended' && !muted) {
    void ctx.resume().catch(() => undefined)
  }
}
