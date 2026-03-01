'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Clock, Gift, X } from 'lucide-react'
import Button from '@/shared/ui/Button'

export default function ScarcityUrgency() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })
  const [liveViewers, setLiveViewers] = useState(12)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [premiumSpots, setPremiumSpots] = useState(23)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    // Live viewers (fluctuates)
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true)
      }
    }

    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(timer)
      clearInterval(viewerInterval)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  return (
    <>
      {/* Scarcity Banner */}
      <div className="w-full bg-gradient-to-r from-[#DB4A39] to-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">Limited Time:</span>
              <span className="font-black text-xl">
                {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
              </span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{liveViewers} farmers viewing this page</span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">Only {premiumSpots} Premium spots left this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowExitIntent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative"
            >
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#DB4A39]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-[#DB4A39]" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">
                  Wait! Don&apos;t Miss Out
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Get <span className="font-black text-[#DB4A39]">R500 off</span> your first transaction when you sign up today
                </p>
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full min-h-[60px] text-lg"
                    onClick={() => {
                      window.location.href = '/register?promo=exit500'
                      setShowExitIntent(false)
                    }}
                  >
                    Claim Your R500 Discount
                  </Button>
                  <button
                    onClick={() => setShowExitIntent(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    No thanks, I&apos;ll continue browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
