'use client'

import React from 'react'

interface PatternBackgroundProps {
  className?: string
  color?: string
  opacity?: number
}

export default function PatternBackground({ 
  className = '', 
  color = '#3D693D',
  opacity = 0.03
}: PatternBackgroundProps) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grainPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill={color} opacity={opacity} />
          <circle cx="30" cy="20" r="1.5" fill={color} opacity={opacity} />
          <circle cx="20" cy="30" r="1.8" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grainPattern)" />
    </svg>
  )
}







