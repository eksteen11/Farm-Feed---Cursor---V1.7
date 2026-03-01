'use client'

import React, { useState, useEffect, useRef } from 'react'

interface StatsCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function StatsCounter({ end, duration = 2000, prefix = '', suffix = '', className = '' }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounter()
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasAnimated, duration])

  const animateCounter = () => {
    const startTime = Date.now()
    const startValue = 0
    const isDecimal = end % 1 !== 0

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (end - startValue) * easeOut

      if (isDecimal) {
        setCount(Number(currentValue.toFixed(1)))
      } else {
        setCount(Math.floor(currentValue))
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }

  const displayValue = typeof count === 'number' && count % 1 !== 0 
    ? count.toFixed(1) 
    : count.toLocaleString()

  return (
    <div ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </div>
  )
}

