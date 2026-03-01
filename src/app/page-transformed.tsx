'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/shared/ui/Button'
import TornadoHero from '@/shared/ui/TornadoHero'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { ArrowRight, Users, Search, CheckCircle } from 'lucide-react'
import Image from 'next/image'

type UserType = 'buyer' | 'seller' | 'transporter'

export default function HomePage() {
  const { currentUser, getCurrentUser } = useSupabaseStore()
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null)
  const [isTransformed, setIsTransformed] = useState(false)

  useEffect(() => {
    getCurrentUser().catch(console.error)
  }, [])

  const handleStartTrading = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRoleSelected = (role: UserType) => {
    setSelectedRole(role)
    setIsTransformed(true)
  }

  const activeRole = selectedRole || 'buyer'

  const roleConfig = {
    buyer: {
      problem: "Finding reliable suppliers takes weeks. Quality varies, prices aren't transparent.",
      solution: "Find verified farmers in 24 hours. Transparent pricing, automated contracts.",
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&q=80',
      gradient: 'from-blue-500/20 via-cyan-500/20 to-blue-600/20'
    },
    seller: {
      problem: "Finding buyers takes 2-4 weeks. Unqualified leads, pricing struggles, transport costs.",
      solution: "Reach 200+ verified buyers in 48 hours. Automated contracts, real-time payments.",
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&q=80',
      gradient: 'from-green-500/20 via-emerald-500/20 to-green-600/20'
    },
    transporter: {
      problem: "Empty return trips cost R2000-5000. Route planning wastes hours, missed opportunities.",
      solution: "Reduce empty trips by 40%. Route optimization, backload matching, reliable payments.",
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80',
      gradient: 'from-orange-500/20 via-red-500/20 to-orange-600/20'
    }
  }

  const config = roleConfig[activeRole]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Viewport */}
      <TornadoHero 
        currentUser={currentUser}
        onStartTrading={handleStartTrading}
        onRoleSelected={handleRoleSelected}
      />

      {/* Problem/Solution Section - Full Viewport with Full-Bleed Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full-Bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={config.image}
            alt="Agricultural background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            key={`problem-solution-${activeRole}`}
            initial={isTransformed ? { opacity: 0, y: 50 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-16"
          >
            {/* Problem */}
            <div className="bg-red-500/10 backdrop-blur-md border-2 border-red-500/30 rounded-3xl p-12 md:p-16">
              <h2 className="text-section text-white mb-6">The Problem</h2>
              <p className="text-subheadline text-white/90 max-w-4xl mx-auto">
                {config.problem}
              </p>
            </div>

            {/* Solution */}
            <div className="bg-[#3D693D]/20 backdrop-blur-md border-2 border-[#3D693D]/40 rounded-3xl p-12 md:p-16">
              <h2 className="text-section text-white mb-6">Our Solution</h2>
              <p className="text-subheadline text-white/90 max-w-4xl mx-auto mb-8">
                {config.solution}
              </p>
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="min-h-[80px] px-16 text-xl md:text-2xl bg-white text-[#3D693D] hover:bg-gray-100 shadow-2xl font-black"
                >
                  Start Trading Now
                  <ArrowRight className="ml-4 w-8 h-8" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Full Viewport */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={isTransformed ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-20"
          >
            <h2 className="text-section text-gray-900 mb-8">
              Get Started in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { step: 1, icon: Users, title: 'Sign Up', desc: 'Create your account in 5 minutes' },
              { step: 2, icon: Search, title: 'Browse & Connect', desc: 'Find quality products or buyers' },
              { step: 3, icon: CheckCircle, title: 'Trade & Grow', desc: 'Complete deals, build reputation' }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  initial={isTransformed ? { opacity: 0, y: 30 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-[#3D693D] rounded-full flex items-center justify-center mx-auto mb-8 text-white text-5xl font-black shadow-2xl">
                    <span>{item.step}</span>
                  </div>
                  <div className="w-20 h-20 mx-auto mb-6 bg-[#3D693D]/10 rounded-2xl flex items-center justify-center">
                    <Icon className="w-10 h-10 text-[#3D693D]" />
                  </div>
                  <h3 className="text-subheadline text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-xl text-gray-600">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - Full Viewport */}
      <section className="relative h-screen flex items-center justify-center bg-[#3D693D]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={isTransformed ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-hero text-white mb-8">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-subheadline text-white/90 mb-12">
              Join 500+ verified farmers trading R50M+ on Farm Feed
            </p>
            <Link href="/register">
              <Button 
                size="lg" 
                className="min-h-[80px] px-20 text-xl md:text-2xl bg-white text-[#3D693D] hover:bg-gray-100 shadow-2xl font-black"
              >
                Start Trading Today - Free
                <ArrowRight className="ml-4 w-8 h-8" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}






