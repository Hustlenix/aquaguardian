'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface Props {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  delay?: number
  className?: string
  formatter?: (value: number) => string
}

export default function CounterAnimation({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  delay = 0,
  className = '',
  formatter,
}: Props) {
  const count = useMotionValue(value)
  const rounded = useTransform(count, (latest) =>
    formatter ? formatter(latest) : Math.round(latest).toLocaleString()
  )
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          count.set(Math.round(value * 0.7))
          const controls = animate(count, value, {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          })
          return () => controls.stop()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [count, value, duration, delay])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
