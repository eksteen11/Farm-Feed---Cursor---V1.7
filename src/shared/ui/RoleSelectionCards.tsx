'use client'

import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Package, ShoppingCart, Truck } from 'lucide-react'

type UserRole = 'buyer' | 'seller' | 'transporter'

interface RoleSelectionCardsProps {
  onRoleSelected: (role: UserRole) => void
  isVisible: boolean
}

const ROLES: Array<{
  role: UserRole
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  bgImage: string
}> = [
  {
    role: 'buyer',
    label: 'Buyer',
    description: 'Find quality grain & feed from verified sellers',
    icon: ShoppingCart,
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    bgImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&q=80'
  },
  {
    role: 'seller',
    label: 'Seller',
    description: 'List products and reach verified buyers nationwide',
    icon: Package,
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    bgImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&q=80'
  },
  {
    role: 'transporter',
    label: 'Transporter',
    description: 'Find loads and optimize routes across South Africa',
    icon: Truck,
    gradient: 'from-orange-500 via-red-500 to-orange-600',
    bgImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  }
]

export default function RoleSelectionCards({ onRoleSelected, isVisible }: RoleSelectionCardsProps) {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredRole, setHoveredRole] = React.useState<UserRole | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null)

  // Calculate positions for triangle formation (desktop) or vertical stack (mobile/tablet)
  const getCardPosition = (index: number, isMobile: boolean, isTablet: boolean) => {
    if (isMobile) {
      // Vertical stack on mobile - tighter spacing
      return { x: 0, y: index * 180 - 180 }
    }
    if (isTablet) {
      // Horizontal row on tablet - adjusted spacing
      const cardWidth = 300
      const spacing = 40
      return { x: (index - 1) * (cardWidth + spacing), y: 0 }
    }
    // Triangle formation on desktop - larger radius for better spacing
    const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2 // Start at top
    const radius = 250
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    }
  }

  const [isMobile, setIsMobile] = React.useState(false)
  const [isTablet, setIsTablet] = React.useState(false)

  React.useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    checkResponsive()
    window.addEventListener('resize', checkResponsive)
    return () => window.removeEventListener('resize', checkResponsive)
  }, [])

  React.useEffect(() => {
    if (isVisible) {
      console.log('🎴 RoleSelectionCards is now visible')
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="sync">
          {ROLES.map((roleData, index) => {
            const Icon = roleData.icon
            const position = getCardPosition(index, isMobile, isTablet)
            const isHovered = hoveredRole === roleData.role

            return (
              <motion.div
                key={roleData.role}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: 100,
                  rotateY: 0
                }}
                animate={{ 
                  opacity: selectedRole === roleData.role ? 0 : selectedRole ? 0.3 : 1, 
                  scale: selectedRole === roleData.role ? 1.2 : selectedRole ? 0.7 : 1,
                  x: selectedRole === roleData.role ? 0 : position.x,
                  y: selectedRole === roleData.role ? 0 : position.y,
                  rotateY: isHovered ? 5 : 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: 100,
                  transition: { duration: 0.4 }
                }}
                transition={{ 
                  duration: selectedRole ? 0.5 : (shouldReduceMotion ? 0 : 0.6),
                  delay: selectedRole ? 0 : (shouldReduceMotion ? 0 : index * 0.1),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: isMobile ? 1.03 : 1.08,
                  rotateY: isMobile ? 0 : 8,
                  rotateX: isMobile ? 0 : -5,
                  z: isMobile ? 30 : 60,
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                whileTap={{ 
                  scale: 0.92,
                  transition: { duration: 0.1 }
                }}
                onHoverStart={() => setHoveredRole(roleData.role)}
                onHoverEnd={() => setHoveredRole(null)}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log(`🎯 Role selected: ${roleData.role}`)
                  setSelectedRole(roleData.role)
                  // Animate selection, then call callback
                  setTimeout(() => {
                    onRoleSelected(roleData.role)
                  }, 400)
                }}
                  className={`
                  absolute w-[320px] md:w-[400px] 
                  h-[400px] md:h-[500px]
                  cursor-pointer group
                  perspective-1000
                  will-change-transform
                  z-10
                `}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Card Container */}
                <motion.div
                  className={`
                    relative w-full h-full rounded-3xl overflow-hidden
                    bg-gradient-to-br ${roleData.gradient}
                    shadow-2xl
                    border-2 border-white/20
                    will-change-transform
                  `}
                  animate={{
                    boxShadow: isHovered
                      ? [
                          '0 0 0 0 rgba(255,255,255,0.4)',
                          '0 0 0 25px rgba(255,255,255,0)',
                          '0 0 0 0 rgba(255,255,255,0)',
                          '0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.3)'
                        ]
                      : '0 4px 12px rgba(0,0,0,0.2), 0 12px 24px rgba(0,0,0,0.15), 0 0 0 0 rgba(255,255,255,0)'
                  }}
                  transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: 'easeInOut'
                  }}
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <img
                      src={roleData.bgImage}
                      alt={roleData.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${roleData.gradient} opacity-80`} />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
                    {/* Icon */}
                    <motion.div
                      className="mb-6"
                      animate={{
                        scale: isHovered ? 1.25 : 1,
                        rotate: isHovered ? [0, 5, -5, 0] : 0,
                        y: isHovered ? -5 : 0
                      }}
                      transition={{ 
                        duration: 0.4,
                        rotate: { duration: 0.6, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' }
                      }}
                    >
                      <motion.div 
                        className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30"
                        animate={{
                          boxShadow: isHovered 
                            ? '0 0 30px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.2)'
                            : '0 0 0 rgba(255,255,255,0)'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-12 h-12 md:w-14 md:h-14 text-white" />
                      </motion.div>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      className="text-3xl md:text-4xl font-black mb-4 text-center"
                      animate={{
                        scale: isHovered ? 1.05 : 1
                      }}
                    >
                      {roleData.label}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="text-base md:text-lg text-white/90 text-center font-medium leading-relaxed"
                      animate={{
                        opacity: isHovered ? 1 : 0.9
                      }}
                    >
                      {roleData.description}
                    </motion.p>

                    {/* Glow Effect on Hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${roleData.gradient} opacity-0 rounded-3xl blur-3xl -z-10`}
                      animate={{
                        opacity: isHovered ? 0.8 : 0,
                        scale: isHovered ? 1.3 : 1
                      }}
                      transition={{ duration: 0.4 }}
                      style={{
                        filter: 'blur(40px)'
                      }}
                    />
                  </div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{
                      x: isHovered ? '100%' : '-100%'
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Instruction Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: selectedRole ? 0 : 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-white/90 text-xs sm:text-sm md:text-base font-medium px-4 text-center z-10"
        >
          {selectedRole ? 'Loading...' : 'Choose your path to start trading'}
        </motion.p>
      </div>
    </motion.div>
  )
}

