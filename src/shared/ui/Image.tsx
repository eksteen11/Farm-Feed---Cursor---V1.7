'use client'

import React, { useState } from 'react'

interface ImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fallbackSrc?: string
  priority?: boolean
  quality?: number
  sizes?: string
}

const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  fallbackSrc = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
  priority = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // If we get a cross-origin blob URL, replace it immediately with fallback to prevent console errors
    if (typeof window !== 'undefined' && src.startsWith('blob:') && !src.startsWith(`blob:${window.location.origin}`)) {
      return fallbackSrc
    }
    return src
  })
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  // Optimize external URLs with query parameters for better performance
  const optimizedSrc = imgSrc.includes('unsplash.com') 
    ? imgSrc.includes('w=') 
      ? imgSrc 
      : `${imgSrc}${imgSrc.includes('?') ? '&' : '?'}w=${width || 800}&h=${height || 600}&fit=crop&q=${quality}&auto=format`
    : imgSrc

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-70' : 'opacity-100'} transition-opacity duration-300`}
      width={width}
      height={height}
      onError={handleError}
      onLoad={() => setIsLoading(false)}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{ 
        objectFit: 'cover',
      }}
    />
  )
}

export default ImageComponent
