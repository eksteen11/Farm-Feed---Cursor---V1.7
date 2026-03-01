'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Optimize scroll performance
    let ticking = false
    const optimizeScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll optimizations
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', optimizeScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', optimizeScroll)
    }
  }, [])

  return null
}






