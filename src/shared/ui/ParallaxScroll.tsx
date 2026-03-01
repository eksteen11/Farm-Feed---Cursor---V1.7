'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxScrollProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxScroll({ children, speed = 0.5, className = '' }: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

export function MouseTilt({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20

      setMousePosition({ x, y })
    }

    const element = ref.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
      return () => element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </motion.div>
  )
}

export function FloatingElement({ 
  children, 
  duration = 3,
  delay = 0,
  className = '' 
}: { 
  children: React.ReactNode
  duration?: number
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

