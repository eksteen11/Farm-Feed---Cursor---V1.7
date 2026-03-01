'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Button from '@/shared/ui/Button'
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  FileText,
  Receipt,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Gauge,
  Search,
  Hand,
  DollarSign,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react'

// Journey Step Interface
interface JourneyStep {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  image: string
  miniUI?: string // Description of mini UI preview
}

// Journey Interface
interface Journey {
  id: 'seller' | 'buyer' | 'transporter'
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  steps: JourneyStep[]
  cta: string
  ctaLink: string
}

// Journey Data Structure
const journeys: Journey[] = [
  {
    id: 'seller',
    title: 'Seller',
    icon: Package,
    color: 'from-green-500 to-emerald-600',
    steps: [
      {
        title: 'Create Listing',
        description: 'List your products in seconds',
        icon: FileText,
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Product form with images'
      },
      {
        title: 'Receive Offers',
        description: 'Get offers from verified buyers',
        icon: Hand,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Offer notifications'
      },
      {
        title: 'Accept & Sell',
        description: 'Complete deals with one click',
        icon: CheckCircle,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Deal completion'
      }
    ],
    cta: 'Start Selling',
    ctaLink: '/register?role=seller'
  },
  {
    id: 'buyer',
    title: 'Buyer',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-600',
    steps: [
      {
        title: 'Browse Listings',
        description: 'Search thousands of products',
        icon: Search,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Product grid view'
      },
      {
        title: 'Make Offer',
        description: 'Negotiate transparently',
        icon: Hand,
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Offer form'
      },
      {
        title: 'Complete Purchase',
        description: 'Secure payment & delivery',
        icon: DollarSign,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Payment confirmation'
      }
    ],
    cta: 'Start Buying',
    ctaLink: '/register?role=buyer'
  },
  {
    id: 'transporter',
    title: 'Transporter',
    icon: Truck,
    color: 'from-orange-500 to-red-600',
    steps: [
      {
        title: 'Find Loads',
        description: 'Discover transport requests',
        icon: MapPin,
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Route map view'
      },
      {
        title: 'Submit Quote',
        description: 'Quote on real jobs instantly',
        icon: FileText,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Quote calculator'
      },
      {
        title: 'Complete Delivery',
        description: 'Track & get paid automatically',
        icon: CheckCircle,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center&q=80',
        miniUI: 'Delivery tracking'
      }
    ],
    cta: 'Start Transporting',
    ctaLink: '/register?role=transporter'
  }
]

interface LivingMarketplaceHeroProps {
  currentUser?: any
}

export default function LivingMarketplaceHero({ currentUser }: LivingMarketplaceHeroProps) {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:147',message:'LivingMarketplaceHero component mounted',data:{hasCurrentUser:!!currentUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, [currentUser]);
  // #endregion

  // State Management
  const [activeJourney, setActiveJourney] = useState<'seller' | 'buyer' | 'transporter' | 'all'>('all')
  const [currentStep, setCurrentStep] = useState(0) // 0-2 for steps, 3 for CTA
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1) // 1x, 1.5x, 2x
  const [backgroundIntensity, setBackgroundIntensity] = useState(0.8) // Stronger base visibility
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  // Refs
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const particleRefs = useRef<{ [key: string]: number }>({})

  // Detect mobile
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:162',message:'Mobile detection useEffect',data:{windowDefined:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const checkMobile = () => {
      try {
        setIsMobile(window.innerWidth < 768)
      } catch (err: any) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:168',message:'checkMobile error',data:{errorMessage:err?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      }
    }
    if (typeof window !== 'undefined') {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Auto-play logic - synchronized across all journeys
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:175',message:'Auto-play useEffect',data:{isAutoPlaying,isInitialLoad,currentStep,playbackSpeed},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    if (!isAutoPlaying || isInitialLoad) return

    const stepDuration = 4000 / playbackSpeed // 4 seconds per step, adjusted by speed
    const ctaDuration = 2000 / playbackSpeed // 2 seconds for CTA

    const advanceStep = () => {
      try {
        setCurrentStep((prev) => {
          // #region agent log
          fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:185',message:'advanceStep called',data:{prev},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          if (prev < 2) {
            // Move to next step
            setBackgroundIntensity(0.8) // Light up on active step
            return prev + 1
          } else if (prev === 2) {
            // Show CTAs
            setBackgroundIntensity(0.6)
            return 3
        } else {
          // Loop back to step 1
          setBackgroundIntensity(0.6) // Increased base intensity
          return 0
        }
        })
      } catch (err: any) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:200',message:'advanceStep error',data:{errorMessage:err?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
      }
    }

    const duration = currentStep === 3 ? ctaDuration : stepDuration
    stepTimerRef.current = setTimeout(advanceStep, duration)

    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current)
      }
    }
  }, [isAutoPlaying, currentStep, playbackSpeed, isInitialLoad])

  // Background intensity animation
  useEffect(() => {
    if (currentStep < 3) {
      // Gradually increase intensity when step is active
      const timer = setTimeout(() => {
        setBackgroundIntensity(0.9) // Increased active intensity
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setBackgroundIntensity(0.7) // Slightly lower for CTA
    }
  }, [currentStep])

  const handlePlayPause = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const handleSpeedChange = () => {
    setPlaybackSpeed((prev) => {
      if (prev === 1) return 1.5
      if (prev === 1.5) return 2
      return 1
    })
  }

  const handleJourneyFilter = (journey: 'seller' | 'buyer' | 'transporter' | 'all') => {
    setActiveJourney(journey)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setBackgroundIntensity(0.6) // Increased base intensity
  }

  // Get active background images based on current step and active journey
  const getActiveBackgrounds = () => {
    if (activeJourney === 'all') {
      // Show first journey's background when showing all (to avoid AnimatePresence multiple children issue)
      return [journeys[0].steps[currentStep]?.image || journeys[0].steps[0].image]
    } else {
      const journey = journeys.find(j => j.id === activeJourney)
      return journey ? [journey.steps[currentStep]?.image || journey.steps[0].image] : []
    }
  }

  const activeBackgrounds = getActiveBackgrounds()

  // #region agent log
  useEffect(() => {
    if (!activeBackgrounds[0]) return
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        location:'LivingMarketplaceHero.tsx:280',
        message:'Background render values',
        data:{
          src: activeBackgrounds[0],
          backgroundIntensity,
          currentStep,
          overlayOpacity: currentStep === 3 ? 0.3 : 0.35 - (backgroundIntensity - 0.6) * 0.1
        },
        timestamp:Date.now(),
        sessionId:'debug-session',
        runId:'run2',
        hypothesisId:'BG1'
      })
    }).catch(()=>{})
  }, [activeBackgrounds, backgroundIntensity, currentStep])
  // #endregion

  // Explosion animation variants for CTAs
  const explosionVariants = {
    hidden: {
      scale: 0,
      rotate: -15,
      opacity: 0
    },
    visible: {
      scale: [0, 1.5, 1],
      rotate: [0, 5, 0],
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Bounce ease
        times: [0, 0.6, 1]
      }
    }
  }

  // Step animation variants
  const stepVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      filter: 'blur(10px)',
      transition: {
        duration: 0.4,
        ease: 'easeIn'
      }
    }
  }

  // Particle explosion for CTA - Enhanced with multiple particle types
  const ParticleExplosion = ({ x, y }: { x: number; y: number }) => {
    const particles = Array.from({ length: 16 }, (_, i) => ({
      angle: (i * 360) / 16,
      distance: 40 + Math.random() * 30,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.2
    }))

    return (
      <g>
        {particles.map((particle, i) => {
          const rad = (particle.angle * Math.PI) / 180
          const px = x + Math.cos(rad) * particle.distance
          const py = y + Math.sin(rad) * particle.distance
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={particle.size}
              fill="white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                cx: px,
                cy: py,
                opacity: [0, 1, 0.8, 0],
                scale: [0, 1.2, 0.8, 0]
              }}
              transition={{
                duration: 1,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))'
              }}
            />
          )
        })}
        {/* Additional sparkle particles */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 360) / 8
          const rad = (angle * Math.PI) / 180
          const px = x + Math.cos(rad) * 60
          const py = y + Math.sin(rad) * 60
          return (
            <motion.circle
              key={`sparkle-${i}`}
              cx={x}
              cy={y}
              r={1.5}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{
                cx: px,
                cy: py,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 1.2,
                delay: 0.3 + i * 0.1,
                ease: 'easeOut'
              }}
            />
          )
        })}
      </g>
    )
  }

  // Journey Panel Component
  const JourneyPanel = ({ journey }: { journey: Journey }) => {
    // #region agent log
    useEffect(() => {
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:379',message:'JourneyPanel rendered',data:{journeyId:journey.id,currentStep,activeJourney},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }, [journey.id, currentStep, activeJourney]);
    // #endregion

    const isActive = activeJourney === 'all' || activeJourney === journey.id
    const step = journey.steps[currentStep]
    const showCTA = currentStep === 3

    // #region agent log
    if (!step && !showCTA) {
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:388',message:'Missing step data',data:{journeyId:journey.id,currentStep,stepsLength:journey.steps.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion

    if (!isActive) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: journeys.indexOf(journey) * 0.1 }}
        className="relative h-full flex flex-col"
      >
        {/* Journey Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${journey.color} shadow-lg`}>
            <journey.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">{journey.title}</h3>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((stepIndex) => (
            <div
              key={stepIndex}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                stepIndex <= currentStep
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Active Step Display */}
        {!showCTA && step && (
          <AnimatePresence mode="wait" key={`step-${currentStep}`}>
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col items-center justify-center space-y-6"
            >
              {/* Animated Node */}
              <motion.div
                className={`w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl`}
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255,255,255,0.4)',
                    '0 0 0 20px rgba(255,255,255,0)',
                    '0 0 0 0 rgba(255,255,255,0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <step.icon className="w-12 h-12 text-[#3D693D]" />
              </motion.div>

              {/* Step Title */}
              <motion.h4
                className="text-2xl font-bold text-white text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {step.title}
              </motion.h4>

              {/* Step Description */}
              <motion.p
                className="text-white/80 text-center max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {step.description}
              </motion.p>

              {/* Mini UI Preview */}
              {step.miniUI && (
                <motion.div
                  className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-xs text-white/60 text-center">{step.miniUI}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA Button - Explodes In */}
        {showCTA && (
          <motion.div
            variants={explosionVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex items-center justify-center relative"
          >
            {/* Particle Explosion SVG */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ overflow: 'visible' }}
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
            >
              <ParticleExplosion x={200} y={200} />
            </svg>
            
            <Link href={journey.ctaLink}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Button
                  size="lg"
                  className={`min-h-[64px] px-8 text-lg shadow-2xl font-bold bg-gradient-to-r ${journey.color} text-white border-0 hover:opacity-90`}
                >
                  <motion.span
                    className="flex items-center"
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    {journey.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.span>
                </Button>
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${journey.color} blur-xl opacity-50 -z-10 rounded-lg`}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#3D693D]">
      {/* Background Layer - Dynamic Lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
          {activeBackgrounds[0] && (
            <motion.img
              key={`${activeBackgrounds[0]}-${currentStep}`}
              src={activeBackgrounds[0]}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: 1.0, // FULL opacity - images must be clearly visible
                scale: 1.05, // Minimal scale
                filter: 'blur(8px) brightness(0.85) saturate(1.1)' // Minimal blur, visible images
              }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{
                willChange: 'opacity, transform, filter'
              }}
              onLoad={() => {
                // #region agent log
                fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:318',message:'Background image loaded',data:{src:activeBackgrounds[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'BG2'})}).catch(()=>{})
                // #endregion
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                // #region agent log
                fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LivingMarketplaceHero.tsx:326',message:'Background image error',data:{src:activeBackgrounds[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'BG3'})}).catch(()=>{})
                // #endregion
              }}
            />
          )}
        </AnimatePresence>
        {/* Forest Green Overlay - Very light tint only (10% opacity) */}
        <div className="absolute inset-0 bg-[#3D693D] opacity-10" />
      </div>

      {/* Control Panel - Top Right */}
      <div className="relative z-20 flex justify-end p-6">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="p-2 text-white hover:bg-white/20 rounded transition-colors"
            aria-label={isAutoPlaying ? 'Pause' : 'Play'}
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Speed Control */}
          <button
            onClick={handleSpeedChange}
            className="px-3 py-2 text-white text-sm font-medium hover:bg-white/20 rounded transition-colors flex items-center gap-2"
          >
            <Gauge className="w-4 h-4" />
            {playbackSpeed}x
          </button>

          {/* Journey Filter */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-3">
            <button
              onClick={() => handleJourneyFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeJourney === 'all'
                  ? 'bg-white text-[#3D693D]'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              All
            </button>
            {journeys.map((journey) => (
              <button
                key={journey.id}
                onClick={() => handleJourneyFilter(journey.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors capitalize ${
                  activeJourney === journey.id
                    ? 'bg-white text-[#3D693D]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {journey.id}
              </button>
            ))}
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-3 py-2 text-white text-sm hover:bg-white/20 rounded transition-colors border-l border-white/20 pl-3"
            aria-label="Reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Headline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Where Agriculture
            <br />
            <span className="text-white">Trades Itself.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 font-medium max-w-3xl mx-auto">
            A fully automated marketplace connecting sellers, buyers, and transport — from listing to payment.
          </p>
        </motion.div>

        {/* Journey Panels - 3 Column Grid (Desktop) / Horizontal Scroll (Mobile) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[500px]">
          {journeys.map((journey) => (
            <div
              key={journey.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl"
            >
              <JourneyPanel journey={journey} />
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll with Snap */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
            {journeys.map((journey) => (
              <div
                key={journey.id}
                className="flex-shrink-0 w-[85vw] snap-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl min-h-[500px]"
              >
                <JourneyPanel journey={journey} />
              </div>
            ))}
          </div>
          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-2 mt-4">
            {journeys.map((journey, idx) => (
              <div
                key={journey.id}
                className="w-2 h-2 rounded-full bg-white/30 transition-all"
                style={{
                  backgroundColor: idx === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm md:text-base text-green-100 font-medium">
            Trusted by 600+ South African farmers • R50M+ traded
          </p>
        </motion.div>
      </div>
    </section>
  )
}
