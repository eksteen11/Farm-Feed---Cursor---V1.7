'use client'

import React, { useState, useRef, useEffect } from 'react'

interface VideoHeroProps {
  videoSrc?: string
  posterSrc?: string
  fallbackImage?: string
  className?: string
  children?: React.ReactNode
}

export default function VideoHero({ 
  videoSrc,
  posterSrc,
  fallbackImage = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&crop=center&q=80',
  className = '',
  children
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play video if available (with muted for autoplay policies)
    if (videoRef.current && videoSrc && !hasError) {
      videoRef.current.play().catch(() => {
        setHasError(true)
      })
    }
  }, [videoSrc, hasError])

  // If no video or error, show image fallback
  if (!videoSrc || hasError) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <img
          src={fallbackImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {children}
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onError={() => setHasError(true)}
      />
      {children}
    </div>
  )
}







