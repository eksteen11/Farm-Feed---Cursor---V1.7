import React from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: string
  delay?: number
  className?: string
}

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  return <div className={className}>{children}</div>
}

