import React from 'react'

interface AnimatedTextProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedText({ children, className }: AnimatedTextProps) {
  return <div className={className}>{children}</div>
}

