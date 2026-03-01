'use client'

import React from 'react'

interface FarmIllustrationProps {
  className?: string
}

export default function FarmIllustration({ className = '' }: FarmIllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3D693D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A8A5A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2A4A2A" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      
      {/* Sky */}
      <rect width="300" height="120" fill="url(#skyGradient)" />
      
      {/* Ground */}
      <rect y="120" width="300" height="80" fill="url(#groundGradient)" />
      
      {/* Mountains in background */}
      <path d="M 0 120 L 80 60 L 160 100 L 240 40 L 300 80 L 300 120 Z" fill="#5A8A5A" opacity="0.2" />
      
      {/* Grain fields */}
      <rect x="20" y="140" width="80" height="40" rx="4" fill="#3D693D" opacity="0.6" />
      <rect x="120" y="150" width="80" height="30" rx="4" fill="#5A8A5A" opacity="0.5" />
      <rect x="220" y="145" width="60" height="35" rx="4" fill="#3D693D" opacity="0.6" />
      
      {/* Grain stalks */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line
          key={i}
          x1={30 + i * 5}
          y1={180}
          x2={30 + i * 5}
          y2={150 - (i % 3) * 5}
          stroke="#2A4A2A"
          strokeWidth="2"
          opacity="0.7"
        />
      ))}
      
      {/* Sun */}
      <circle cx="250" cy="30" r="20" fill="#FCD34D" opacity="0.8" />
    </svg>
  )
}







