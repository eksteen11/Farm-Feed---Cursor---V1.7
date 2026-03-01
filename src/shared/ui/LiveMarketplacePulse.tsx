'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, MapPin, Package, ShoppingCart, Truck, Clock } from 'lucide-react'

interface LiveActivity {
  id: string
  type: 'listing' | 'offer' | 'deal' | 'transport'
  message: string
  location: string
  timestamp: Date
  icon: React.ElementType
  color: string
}

const MOCK_ACTIVITIES: Omit<LiveActivity, 'timestamp'>[] = [
  { id: '1', type: 'deal', message: 'John from Western Cape sold 50 tons of maize', location: 'Cape Town', icon: Package, color: 'from-green-500 to-emerald-600' },
  { id: '2', type: 'offer', message: 'Sarah from Gauteng made an offer on wheat', location: 'Johannesburg', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
  { id: '3', type: 'transport', message: 'Mike from KZN matched a transport request', location: 'Durban', icon: Truck, color: 'from-orange-500 to-red-600' },
  { id: '4', type: 'listing', message: 'Anna from Free State listed new corn harvest', location: 'Bloemfontein', icon: Package, color: 'from-green-500 to-emerald-600' },
  { id: '5', type: 'deal', message: 'Peter from Mpumalanga completed a deal', location: 'Nelspruit', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
  { id: '6', type: 'transport', message: 'Lisa from Eastern Cape booked transport', location: 'Port Elizabeth', icon: Truck, color: 'from-orange-500 to-red-600' },
]

export default function LiveMarketplacePulse() {
  const [activities, setActivities] = useState<LiveActivity[]>([])
  const [liveStats, setLiveStats] = useState({
    traded24h: 2450000,
    activeUsers: 127,
    dealsToday: 23
  })

  useEffect(() => {
    // Initialize with first activity
    const initialActivity: LiveActivity = {
      ...MOCK_ACTIVITIES[0],
      timestamp: new Date()
    }
    setActivities([initialActivity])

    // Add new activity every 3-5 seconds
    const activityInterval = setInterval(() => {
      const randomActivity = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)]
      // Generate unique ID to avoid duplicate key warnings
      const uniqueId = `${randomActivity.id}-${Date.now()}-${Math.random()}`
      const newActivity: LiveActivity = {
        ...randomActivity,
        id: uniqueId,
        timestamp: new Date()
      }
      
      setActivities(prev => {
        const updated = [newActivity, ...prev.filter(a => a.id !== newActivity.id)].slice(0, 5) // Keep only last 5, avoid duplicates
        return updated
      })
    }, 3500 + Math.random() * 1500)

    // Update live stats every 5 seconds
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        traded24h: prev.traded24h + Math.floor(Math.random() * 5000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        dealsToday: prev.dealsToday + (Math.random() > 0.7 ? 1 : 0)
      }))
    }, 5000)

    return () => {
      clearInterval(activityInterval)
      clearInterval(statsInterval)
    }
  }, [])

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `R${(amount / 1000000).toFixed(1)}M`
    }
    return `R${(amount / 1000).toFixed(0)}K`
  }

  return (
    <div className="w-full py-16 bg-gradient-to-br from-[#3D693D]/5 via-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Stats Counter */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Live Now</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Traded Last 24h', value: formatAmount(liveStats.traded24h), icon: TrendingUp, color: 'text-[#3D693D]' },
              { label: 'Active Users', value: liveStats.activeUsers.toString(), icon: Clock, color: 'text-blue-600' },
              { label: 'Deals Today', value: liveStats.dealsToday.toString(), icon: Package, color: 'text-orange-600' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div
                    key={stat.value}
                    className={`text-3xl font-black ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#3D693D] to-[#2A4A2A] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h3 className="text-xl font-black text-white">Live Marketplace Activity</h3>
              </div>
              <span className="text-sm text-white/80 font-medium">Real-time updates</span>
            </div>
          </div>
          
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {activities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={activity.id}
                    initial={false}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold leading-relaxed">
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                          {activity.timestamp.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
