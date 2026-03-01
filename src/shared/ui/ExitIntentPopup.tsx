'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, ArrowRight } from 'lucide-react'
import Button from './Button'

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if already shown in session
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('exitIntentShown')
      if (shown) {
        setHasShown(true)
        return
      }
    }

    // Detect exit intent (mouse leaving viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('exitIntentShown', 'true')
        }
      }
    }

    // Also detect on beforeunload
    const handleBeforeUnload = () => {
      if (!hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasShown])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#3D693D] to-[#2A4A2A] rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Gift className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-3xl font-black text-gray-900 mb-3">
                  Wait! Don&apos;t Miss Out
                </h3>
                <p className="text-gray-600 mb-6">
                  Get <span className="font-black text-[#3D693D]">R500 off</span> your first transaction when you sign up today
                </p>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full min-h-[64px] bg-[#3D693D] text-white hover:bg-[#2A4A2A] font-black"
                    onClick={() => {
                      window.location.href = '/register?promo=exit500'
                      setIsVisible(false)
                    }}
                  >
                    Claim R500 Discount
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    No thanks, I&apos;ll pass
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}






