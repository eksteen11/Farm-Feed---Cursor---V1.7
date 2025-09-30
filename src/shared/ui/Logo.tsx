'use client'

import React from 'react'
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
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  }

  const logoSrc = variant === 'white' 
    ? '/images/logos/farm-feed-logo-white.svg'
    : '/images/logos/farm-feed-logo-color.svg'

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <Image
        src={logoSrc}
        alt="Farm Feed"
        width={200}
        height={80}
        className="h-full w-auto object-contain"
        priority
      />
    </div>
  )
}

export default Logo
