'use client'

import React from 'react'

interface TruckIllustrationProps {
  className?: string
  primaryColor?: string
  secondaryColor?: string
}

export default function TruckIllustration({ 
  className = '', 
  primaryColor = '#3D693D',
  secondaryColor = '#DB4A39'
}: TruckIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Truck body */}
      <rect x="20" y="50" width="80" height="40" rx="4" fill={primaryColor} />
      <rect x="100" y="60" width="60" height="30" rx="4" fill={primaryColor} opacity="0.8" />
      
      {/* Truck cabin */}
      <rect x="20" y="30" width="40" height="30" rx="4" fill={primaryColor} opacity="0.9" />
      <rect x="25" y="35" width="30" height="20" rx="2" fill={secondaryColor} opacity="0.3" />
      
      {/* Wheels */}
      <circle cx="40" cy="95" r="12" fill="#1F2937" />
      <circle cx="40" cy="95" r="8" fill="#374151" />
      <circle cx="100" cy="95" r="12" fill="#1F2937" />
      <circle cx="100" cy="95" r="8" fill="#374151" />
      
      {/* Grain container */}
      <rect x="25" y="20" width="70" height="15" rx="2" fill={secondaryColor} opacity="0.4" />
      <path d="M 25 20 L 30 10 L 95 10 L 95 20 Z" fill={secondaryColor} opacity="0.3" />
    </svg>
  )
}







