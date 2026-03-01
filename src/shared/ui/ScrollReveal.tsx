'use client'

import React, { ReactNode } from 'react'
import { useScrollReveal } from '@/shared/hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function ScrollReveal({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ triggerOnce: true })

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8'
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-600 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0' 
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}







