'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TradeLocation {
  id: string
  province: string
  city: string
  x: number // Percentage from left
  y: number // Percentage from top
  trades: number
  type: 'sale' | 'offer' | 'transport'
}

const tradeLocations: TradeLocation[] = [
  { id: '1', province: 'Western Cape', city: 'Cape Town', x: 15, y: 75, trades: 45, type: 'sale' },
  { id: '2', province: 'Gauteng', city: 'Johannesburg', x: 65, y: 40, trades: 78, type: 'offer' },
  { id: '3', province: 'KwaZulu-Natal', city: 'Durban', x: 75, y: 60, trades: 32, type: 'sale' },
  { id: '4', province: 'Eastern Cape', city: 'Port Elizabeth', x: 45, y: 80, trades: 28, type: 'transport' },
  { id: '5', province: 'Free State', city: 'Bloemfontein', x: 50, y: 50, trades: 19, type: 'sale' },
  { id: '6', province: 'Mpumalanga', city: 'Nelspruit', x: 70, y: 35, trades: 15, type: 'offer' },
  { id: '7', province: 'Limpopo', city: 'Polokwane', x: 70, y: 20, trades: 12, type: 'sale' },
  { id: '8', province: 'North West', city: 'Rustenburg', x: 55, y: 30, trades: 8, type: 'transport' },
]

const getColorForType = (type: TradeLocation['type']) => {
  switch (type) {
    case 'sale':
      return '#10b981' // green
    case 'offer':
      return '#3b82f6' // blue
    case 'transport':
      return '#f59e0b' // orange
    default:
      return '#6b7280'
  }
}

export default function SouthAfricaMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className="relative w-full h-full">
      {/* Simplified South Africa Map Background */}
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full opacity-30"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified SA outline - you can replace with actual SVG path */}
        <path
          d="M 200 50 L 350 80 L 380 150 L 350 250 L 300 350 L 200 450 L 100 400 L 50 300 L 80 200 L 120 100 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/20"
        />
      </svg>

      {/* Trade Location Dots */}
      {tradeLocations.map((location) => {
        const color = getColorForType(location.type)
        const isHovered = hoveredLocation === location.id
        const pulseScale = 1 + (location.trades / 100) * 0.5

        return (
          <motion.div
            key={location.id}
            className="absolute"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onHoverStart={() => setHoveredLocation(location.id)}
            onHoverEnd={() => setHoveredLocation(null)}
            initial={{ scale: 0 }}
            animate={{
              scale: isHovered ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Pulsing Dot */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, pulseScale, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {/* Outer Pulse Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
              
              {/* Main Dot */}
              <div
                className="relative w-4 h-4 rounded-full shadow-lg cursor-pointer"
                style={{ backgroundColor: color }}
              />

              {/* Trade Count Badge */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl whitespace-nowrap z-10"
                >
                  <div className="text-xs font-semibold text-gray-900">{location.city}</div>
                  <div className="text-xs text-gray-600">{location.trades} trades</div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
        <div className="text-white/90 text-xs font-semibold mb-2">Live Trades</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Sales</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Offers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Transport</span>
          </div>
        </div>
      </div>
    </div>
  )
}






