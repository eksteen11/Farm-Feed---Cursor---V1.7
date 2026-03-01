'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Button from '@/shared/ui/Button'

interface BehaviorData {
  timeOnPage: number
  scrollDepth: number
  roleHover: 'buyer' | 'seller' | 'transporter' | null
  sectionsViewed: string[]
}

interface SmartCTA {
  message: string
  subtitle: string
  visible: boolean
}

export default function PersonalizedOnboarding() {
  const [behaviorData, setBehaviorData] = useState<BehaviorData>({
    timeOnPage: 0,
    scrollDepth: 0,
    roleHover: null,
    sectionsViewed: []
  })
  const [smartCTA, setSmartCTA] = useState<SmartCTA>({
    message: 'Start Trading Today',
    subtitle: 'Join 500+ verified farmers',
    visible: false
  })
  const [locationBasedMessage, setLocationBasedMessage] = useState<string | null>(null)

  useEffect(() => {
    // Track time on page
    const timeInterval = setInterval(() => {
      setBehaviorData(prev => ({ ...prev, timeOnPage: prev.timeOnPage + 1 }))
    }, 1000)

    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setBehaviorData(prev => ({ ...prev, scrollDepth: scrolled }))

      // Show smart CTA after 50% scroll and 2 minutes
      if (scrolled > 50 && behaviorData.timeOnPage > 120 && !smartCTA.visible) {
        setSmartCTA(prev => ({
          ...prev,
          visible: true,
          message: "You've been exploring - ready to start?",
          subtitle: 'Join 500+ farmers already trading'
        }))
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Track section views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          setBehaviorData(prev => ({
            ...prev,
            sectionsViewed: [...new Set([...prev.sectionsViewed, sectionId])]
          }))
        }
      })
    }, { threshold: 0.5 })

    const sections = document.querySelectorAll('section, [id]')
    sections.forEach(section => observer.observe(section))

    // Get user location (if available)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock location-based messaging (in real app, reverse geocode to get province)
          const provinces = ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Free State', 'Mpumalanga']
          const randomProvince = provinces[Math.floor(Math.random() * provinces.length)]
          setLocationBasedMessage(`Based in ${randomProvince}? Join ${Math.floor(Math.random() * 50) + 20} local farmers already trading.`)
        },
        () => {
          // Geolocation denied or unavailable
        }
      )
    }

    return () => {
      clearInterval(timeInterval)
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [behaviorData.timeOnPage, smartCTA.visible])

  // Detect role interest based on hover patterns
  useEffect(() => {
    const buyerCard = document.querySelector('[data-role="buyer"]')
    const sellerCard = document.querySelector('[data-role="seller"]')
    const transporterCard = document.querySelector('[data-role="transporter"]')

    const handleMouseEnter = (role: 'buyer' | 'seller' | 'transporter') => {
      setBehaviorData(prev => ({ ...prev, roleHover: role }))
    }

    buyerCard?.addEventListener('mouseenter', () => handleMouseEnter('buyer'))
    sellerCard?.addEventListener('mouseenter', () => handleMouseEnter('seller'))
    transporterCard?.addEventListener('mouseenter', () => handleMouseEnter('transporter'))

    return () => {
      buyerCard?.removeEventListener('mouseenter', () => handleMouseEnter('buyer'))
      sellerCard?.removeEventListener('mouseenter', () => handleMouseEnter('seller'))
      transporterCard?.removeEventListener('mouseenter', () => handleMouseEnter('transporter'))
    }
  }, [])

  const getPersonalizedMessage = () => {
    if (behaviorData.roleHover) {
      const roleMessages = {
        buyer: {
          message: 'Interested in buying?',
          subtitle: 'Find verified suppliers with quality products in 24 hours'
        },
        seller: {
          message: 'Ready to sell?',
          subtitle: 'List your products and get offers from verified buyers instantly'
        },
        transporter: {
          message: 'Transport opportunities?',
          subtitle: 'Match loads automatically and reduce empty trips by 40%'
        }
      }
      return roleMessages[behaviorData.roleHover]
    }

    if (behaviorData.timeOnPage > 180 && behaviorData.scrollDepth > 70) {
      return {
        message: "You've explored everything - ready to join?",
        subtitle: 'Start trading in 5 minutes, no credit card required'
      }
    }

    if (locationBasedMessage) {
      return {
        message: 'Farmers near you are already trading',
        subtitle: locationBasedMessage
      }
    }

    return smartCTA
  }

  const personalized = getPersonalizedMessage()

  return (
    <AnimatePresence>
      {smartCTA.visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#3D693D] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-black text-gray-900 mb-2">
                  {personalized.message}
                </h4>
                <p className="text-sm text-gray-600">
                  {personalized.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSmartCTA(prev => ({ ...prev, visible: false }))}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  window.location.href = '/register'
                }}
              >
                Start Trading Now
              </Button>
              <button
                onClick={() => setSmartCTA(prev => ({ ...prev, visible: false }))}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Later
              </button>
            </div>

            {/* Progress Indicators */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(behaviorData.timeOnPage / 60)}m on page</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{Math.round(behaviorData.scrollDepth)}% scrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{behaviorData.sectionsViewed.length} sections viewed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}






