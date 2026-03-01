'use client'

import React from 'react'

interface GrainIllustrationProps {
  className?: string
  color?: string
}

export default function GrainIllustration({ className = '', color = '#3D693D' }: GrainIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Grain kernels */}
      <ellipse cx="50" cy="80" rx="12" ry="18" fill={color} opacity="0.9" />
      <ellipse cx="75" cy="70" rx="10" ry="16" fill={color} opacity="0.85" />
      <ellipse cx="100" cy="85" rx="11" ry="17" fill={color} opacity="0.9" />
      <ellipse cx="125" cy="75" rx="9" ry="15" fill={color} opacity="0.85" />
      <ellipse cx="150" cy="90" rx="12" ry="18" fill={color} opacity="0.9" />
      
      {/* Grain stalks */}
      <path
        d="M 50 80 Q 45 60 50 40"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 100 85 Q 95 65 100 45"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 150 90 Q 145 70 150 50"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Leaves */}
      <path
        d="M 50 60 Q 40 55 35 50 Q 40 45 50 50"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M 100 65 Q 90 60 85 55 Q 90 50 100 55"
        fill={color}
        opacity="0.7"
      />
    </svg>
  )
}







