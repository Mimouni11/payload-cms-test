'use client'

import React, { useEffect, useRef, useState } from 'react'

type CounterProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}

const DURATION = 1800

// Ease-out cubic: fast at first, settles on the final figure.
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The only client component in this section — everything around it is
 * server-rendered. Counts up once when scrolled into view.
 *
 * The final value is rendered on the server too, so it is present in the HTML
 * for crawlers and for anyone who never triggers the animation.
 */
export const Counter: React.FC<CounterProps> = ({ value, decimals = 0, prefix, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let frame = 0
    let started = false

    const run = () => {
      const start = performance.now()

      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1)
        setDisplay(value * ease(t))
        if (t < 1) frame = requestAnimationFrame(tick)
      }

      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true
          setDisplay(0)
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
