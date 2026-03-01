'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import Link from 'next/link'
import Button from '@/shared/ui/Button'
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import RoleSelectionCards from '@/shared/ui/RoleSelectionCards'

// Animation Phases (24-second loop - much faster!)
const ANIMATION_PHASES = [
  {
    id: 'hook',
    duration: 4, // Reduced from 10s
    headline: 'Where Agriculture',
    subheadline: 'Trades Itself',
    description: null,
    journeyIcon: null,
    backgroundImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&crop=center&q=80'
  },
  {
    id: 'promise',
    duration: 4, // Reduced from 10s
    headline: 'A fully automated marketplace',
    subheadline: 'connecting sellers, buyers, and transport',
    description: 'From listing to payment — all automated',
    journeyIcon: null,
    backgroundImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center&q=80'
  },
  {
    id: 'seller',
    duration: 4, // Reduced from 10s
    headline: 'Sellers',
    subheadline: 'List products in seconds',
    description: 'Get offers from verified buyers instantly',
    journeyIcon: Package,
    journeyColor: 'from-green-500 to-emerald-600',
    backgroundImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&crop=center&q=80',
    ctaLink: '/register?role=seller',
    ctaText: 'Start Selling'
  },
  {
    id: 'buyer',
    duration: 4, // Reduced from 10s
    headline: 'Buyers',
    subheadline: 'Find quality instantly',
    description: 'Search thousands of verified products',
    journeyIcon: ShoppingCart,
    journeyColor: 'from-blue-500 to-cyan-600',
    backgroundImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center&q=80',
    ctaLink: '/register?role=buyer',
    ctaText: 'Start Buying'
  },
  {
    id: 'transporter',
    duration: 4, // Reduced from 10s
    headline: 'Transporters',
    subheadline: 'Match loads automatically',
    description: 'Find transport requests and get paid',
    journeyIcon: Truck,
    journeyColor: 'from-orange-500 to-red-600',
    backgroundImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&crop=center&q=80',
    ctaLink: '/register?role=transporter',
    ctaText: 'Start Transporting'
  },
  {
    id: 'call',
    duration: 4, // Reduced from 10s
    headline: 'Join 600+ farmers',
    subheadline: 'Trading R50M+ on Farm Feed',
    description: 'Trusted by South African agriculture',
    journeyIcon: null,
    backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center&q=80'
  }
]

interface TornadoHeroProps {
  currentUser?: any
  onStartTrading?: () => void
  onRoleSelected?: (role: 'buyer' | 'seller' | 'transporter') => void
}

export default function TornadoHero({ currentUser, onStartTrading, onRoleSelected }: TornadoHeroProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMorphing, setIsMorphing] = useState(false)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const controls = useAnimation()

  const currentPhaseData = ANIMATION_PHASES[currentPhase]
  const totalDuration = ANIMATION_PHASES.reduce((sum, phase) => sum + phase.duration, 0)
  const currentProgress = (currentPhase / ANIMATION_PHASES.length) * 100

  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
    }
    checkMobile()
    checkReducedMotion()
    window.addEventListener('resize', checkMobile)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkReducedMotion)
    return () => {
      window.removeEventListener('resize', checkMobile)
      mediaQuery.removeEventListener('change', checkReducedMotion)
    }
  }, [])

  // Animation timeline controller
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    const phase = ANIMATION_PHASES[currentPhase]
    const phaseDuration = phase.duration * 1000 // Convert to ms
    let elapsed = 0
    const interval = 16 // ~60fps

    progressRef.current = setInterval(() => {
      elapsed += interval
      const progress = Math.min(elapsed / phaseDuration, 1)
      setPhaseProgress(progress)

      if (progress >= 1) {
        setCurrentPhase((prev) => (prev + 1) % ANIMATION_PHASES.length)
        setPhaseProgress(0)
      }
    }, interval)

    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [currentPhase, isPaused, prefersReducedMotion])

  // Particle system - spiral motion toward center, accelerates during morph
  useEffect(() => {
    if (prefersReducedMotion) return // Skip particles for reduced motion
    
    const canvas = particleCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      angle: number
      radius: number
      speed: number
      baseSpeed: number
      size: number
      opacity: number
      life: number
    }> = []

    // Initialize particles - fewer on mobile for performance, reduced during morph
    // Further reduced for very small screens
    const isSmallMobile = window.innerWidth < 480
    const particleCount = isMorphing 
      ? (isSmallMobile ? 10 : isMobile ? 20 : 50) 
      : (isSmallMobile ? 20 : isMobile ? 30 : 80)
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * Math.max(canvas.width, canvas.height) * 0.8
      const baseSpeed = 0.3 + Math.random() * 0.5
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        angle: angle + Math.PI, // Point toward center
        radius: radius,
        speed: baseSpeed,
        baseSpeed: baseSpeed,
        size: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.4,
        life: 1
      })
    }

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Accelerate particles during morph
      const speedMultiplier = isMorphing ? 3 : 1

      particles.forEach((particle) => {
        // Spiral motion toward center
        const distanceToCenter = Math.sqrt(
          Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2)
        )

        if (distanceToCenter > 50) {
          // Move toward center with spiral - accelerated during morph
          const angleToCenter = Math.atan2(
            centerY - particle.y,
            centerX - particle.x
          )
          particle.angle = angleToCenter
          particle.radius -= particle.baseSpeed * 2 * speedMultiplier

          particle.x = centerX + Math.cos(particle.angle) * particle.radius
          particle.y = centerY + Math.sin(particle.angle) * particle.radius

          // Fade as it gets closer - faster during morph
          particle.life = Math.min(distanceToCenter / 200, 1)
        } else {
          // During morph, don't reset particles - let them disappear
          if (!isMorphing) {
            // Reset particle to edge
            const angle = Math.random() * Math.PI * 2
            particle.radius = Math.max(canvas.width, canvas.height) * 0.8
            particle.x = centerX + Math.cos(angle) * particle.radius
            particle.y = centerY + Math.sin(angle) * particle.radius
            particle.life = 1
          } else {
            particle.life = 0 // Fade out during morph
          }
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity * particle.life
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile, prefersReducedMotion, isMorphing])

  // Spiral motion calculation for orbital icons
  const getSpiralPosition = (
    progress: number,
    baseRadius: number,
    centerX: number,
    centerY: number
  ) => {
    // Spiral inward: radius decreases as progress increases
    // More dramatic spiral - goes from edge to center
    const radius = baseRadius * (1 - progress * 0.85) // Spiral to 15% of original (closer to center)
    const angle = progress * Math.PI * 6 // 3 full rotations for dramatic effect
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    // Scale and opacity: start small, grow as it spirals in, then fade
    const scale = progress < 0.5 
      ? 0.3 + progress * 1.4 // Grow from 0.3 to 1.0
      : 1.0 - (progress - 0.5) * 0.4 // Fade from 1.0 to 0.8
    
    const opacity = progress < 0.3
      ? progress * 2 // Fade in quickly
      : progress > 0.7
      ? 1 - (progress - 0.7) * 3.33 // Fade out at end
      : 1 // Full opacity in middle
    
    return { x, y, scale: Math.max(scale, 0.3), opacity: Math.max(opacity, 0.3) }
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStartTrading = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (currentUser) {
      // Logged in users go to dashboard
      return
    }
    
    console.log('🚀 Start Trading clicked - initiating morph animation')
    
    if (onStartTrading) {
      onStartTrading()
    }
    
    // Start morphing animation
    setIsMorphing(true)
    setIsPaused(true) // Pause the hero animation
    
    console.log('✨ Morphing started, will show role selection in 1.2s')
    
    // After morph completes, show role selection
    setTimeout(() => {
      console.log('🎯 Showing role selection cards')
      setShowRoleSelection(true)
      setIsMorphing(false)
    }, 1200) // Match morph duration
  }

  const handleRoleSelected = (role: 'buyer' | 'seller' | 'transporter') => {
    // Hide role selection with fade out
    setTimeout(() => {
      setShowRoleSelection(false)
    }, 800) // Give time for card selection animation
    
    // Call callback after a brief delay for smooth transition
    setTimeout(() => {
      if (onRoleSelected) {
        onRoleSelected(role)
      }
    }, 400)
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#3D693D] z-10 snap-start">
      {/* Role Selection Cards - Overlay */}
      {showRoleSelection && (
        <RoleSelectionCards
          onRoleSelected={handleRoleSelected}
          isVisible={showRoleSelection}
        />
      )}
      
      {/* Debug indicator - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-[200] bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>Morphing: {isMorphing ? 'YES' : 'NO'}</div>
          <div>Show Cards: {showRoleSelection ? 'YES' : 'NO'}</div>
          <div>Paused: {isPaused ? 'YES' : 'NO'}</div>
        </div>
      )}
      {/* Particle Storm Canvas - Only if motion is allowed */}
      {!prefersReducedMotion && (
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: 0.6 }}
        />
      )}

      {/* Background Cinema - Full-Bleed, No Blur */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden"
        animate={{
          filter: isMorphing || showRoleSelection ? 'brightness(0.3)' : 'brightness(1)',
          opacity: isMorphing || showRoleSelection ? 0.5 : 1
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhaseData.id}
            src={currentPhaseData.backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              willChange: 'opacity, transform'
            }}
          />
        </AnimatePresence>
        {/* Subtle overlay - minimal */}
        <motion.div 
          className="absolute inset-0 bg-[#3D693D]"
          animate={{
            opacity: isMorphing ? 0.5 : showRoleSelection ? 0.4 : 0.15
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <motion.div 
          className="flex flex-col items-center justify-center h-full py-4 sm:py-8 md:py-12"
          animate={{
            opacity: isMorphing || showRoleSelection ? 0 : 1,
            scale: isMorphing ? (isMobile ? 0.8 : 0.7) : 1,
            y: isMorphing ? (isMobile ? -20 : -30) : 0,
            rotateX: isMorphing ? (isMobile ? 0 : 15) : 0
          }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Text Sequence - Progressive Disclosure */}
          <div className="text-center mb-6 md:mb-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPhaseData.id}-headline`}
                initial={{ opacity: 0, y: 50, rotateX: -90, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, rotateX: 90, scale: 0.8 }}
                transition={{ 
                  duration: 0.6, // Faster transition
                  ease: [0.34, 1.56, 0.64, 1] // Bounce ease for impact
                }}
                className="mb-4"
                style={{
                  textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                <h1 className="text-hero text-white">
                  {currentPhaseData.headline}
                  {currentPhaseData.subheadline && (
                    <>
                      <br />
                      <span className="text-white">{currentPhaseData.subheadline}</span>
                    </>
                  )}
                </h1>
              </motion.div>
            </AnimatePresence>

            {currentPhaseData.description && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${currentPhaseData.id}-description`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ 
                    duration: 0.6, // Faster transition
                    delay: 0.2, // Earlier appearance
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="text-base md:text-lg lg:text-xl text-white/90 font-medium mt-4 md:mt-6 max-w-2xl mx-auto"
                  style={{
                    textShadow: '0 2px 20px rgba(0,0,0,0.4)'
                  }}
                >
                  {currentPhaseData.description}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          {/* Orbital Journey Icon - Spiral Animation */}
          {currentPhaseData.journeyIcon && (
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-8 flex items-center justify-center">
              {(() => {
                const baseRadius = isMobile ? 80 : 120
                const spiral = getSpiralPosition(phaseProgress, baseRadius, 0, 0)
                const Icon = currentPhaseData.journeyIcon!

                return (
                  <motion.div
                    className="absolute"
                    style={{
                      x: spiral.x,
                      y: spiral.y
                    }}
                    animate={{
                      scale: spiral.scale,
                      opacity: spiral.opacity,
                      rotate: phaseProgress * 1080 // 3 full rotations (matches spiral math)
                    }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0 : 0.1, 
                      ease: 'linear' 
                    }}
                  >
                    <motion.div
                      className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${currentPhaseData.journeyColor} flex items-center justify-center shadow-2xl`}
                      animate={{
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
                      style={{
                        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.6))'
                      }}
                    >
                      <Icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </motion.div>
                  </motion.div>
                )
              })()}
            </div>
          )}

          {/* CTA Core - Always Visible, Pulsing */}
          <motion.div
            animate={{
              scale: currentPhase === 5 ? [1, 1.1, 1] : [1, 1.05, 1], // Stronger pulse in call phase
            }}
            transition={{
              duration: currentPhase === 5 ? 1.5 : 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative z-20"
          >
            {currentUser ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="min-h-[60px] md:min-h-[64px] px-8 md:px-10 text-lg md:text-xl bg-white text-[#3D693D] hover:bg-gray-100 shadow-2xl font-bold"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStartTrading(e)
                }}
                className={`min-h-[80px] md:min-h-[96px] px-12 md:px-20 text-xl md:text-2xl lg:text-3xl shadow-2xl font-black text-white border-0 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                  currentPhaseData.journeyColor
                    ? `bg-gradient-to-r ${currentPhaseData.journeyColor}`
                    : 'bg-gradient-to-r from-[#3D693D] to-[#2A4A2A]'
                }`}
              >
                <span className="flex items-center">
                  {currentPhaseData.ctaText || 'Start Trading'}
                  <ArrowRight className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6" />
                </span>
              </button>
            )}

            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 ${
                currentPhaseData.journeyColor || 'from-[#3D693D] to-[#2A4A2A]'
              } bg-gradient-to-r blur-2xl opacity-50 -z-10 rounded-lg`}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>

          {/* Trust Indicators - Appears in call phase */}
          {currentPhase === 5 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs md:text-sm text-white/80 font-medium mt-4 md:mt-6"
            >
              Trusted by 600+ South African farmers • R50M+ traded
            </motion.p>
          )}

          {/* Progress Indicator */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2 z-30">
            {ANIMATION_PHASES.map((phase, index) => (
              <div
                key={phase.id}
                className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                  index === currentPhase
                    ? 'w-6 md:w-8 bg-white'
                    : index < currentPhase
                    ? 'w-3 md:w-4 bg-white/60'
                    : 'w-1.5 md:w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Pause/Play Control */}
          {!showRoleSelection && (
            <button
              onClick={handlePause}
              className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors z-30"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}

