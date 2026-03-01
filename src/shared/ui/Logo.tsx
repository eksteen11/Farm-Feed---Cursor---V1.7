'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface LogoProps {
  variant?: 'color' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'color', 
  size = 'md', 
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  }

  const logoSrc = variant === 'white' 
    ? '/images/logos/farm-feed-logo-white.svg'
    : '/images/logos/farm-feed-logo-color.svg'

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${className} relative transition-all duration-300 ${
        isHovered ? 'scale-110' : 'scale-100'
      } ${isClicked ? 'scale-95' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        animation: 'logo-pulse 3s ease-in-out infinite',
      }}
    >
      <Image
        src={logoSrc}
        alt="Farm Feed"
        width={200}
        height={80}
        className="h-full w-auto object-contain transition-transform duration-300"
        priority
      />
      {/* Animated grain icon overlay (subtle rotation) */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          animation: 'logo-rotate 20s linear infinite',
          opacity: 0.1,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
    </div>
  )
}

export default Logo
