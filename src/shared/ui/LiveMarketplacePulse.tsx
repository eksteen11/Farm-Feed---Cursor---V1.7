'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { TrendingUp, MapPin, Package, ShoppingCart, Truck, Clock } from 'lucide-react'

interface LiveActivity {
  id: string
  type: 'listing' | 'offer' | 'deal' | 'transport'
  message: string
  location: string
  timestamp: Date
  icon: React.ElementType
  color: string
  borderColor: string
}

const MOCK_ACTIVITIES: Omit<LiveActivity, 'timestamp' | 'borderColor'>[] = [
  { id: '1', type: 'deal', message: 'John from Western Cape sold 50 tons of maize', location: 'Cape Town', icon: Package, color: 'from-green-500 to-emerald-600' },
  { id: '2', type: 'offer', message: 'Sarah from Gauteng made an offer on wheat', location: 'Johannesburg', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
  { id: '3', type: 'transport', message: 'Mike from KZN matched a transport request', location: 'Durban', icon: Truck, color: 'from-orange-500 to-red-600' },
  { id: '4', type: 'listing', message: 'Anna from Free State listed new corn harvest', location: 'Bloemfontein', icon: Package, color: 'from-green-500 to-emerald-600' },
  { id: '5', type: 'deal', message: 'Peter from Mpumalanga completed a deal', location: 'Nelspruit', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
  { id: '6', type: 'transport', message: 'Lisa from Eastern Cape booked transport', location: 'Port Elizabeth', icon: Truck, color: 'from-orange-500 to-red-600' },
]

const BORDER_COLORS: Record<string, string> = {
  'from-green-500 to-emerald-600': 'border-l-green-500',
  'from-blue-500 to-cyan-600': 'border-l-blue-500',
  'from-orange-500 to-red-600': 'border-l-orange-500',
  'from-purple-500 to-pink-600': 'border-l-purple-500',
}

function useAnimatedStat(target: number, duration = 400, enabled: boolean): number {
  const [display, setDisplay] = useState(target)
  const prevRef = useRef(target)

  useEffect(() => {
    if (!enabled) {
      setDisplay(target)
      return
    }
    const start = prevRef.current
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - t) * (1 - t)
      setDisplay(Math.round(start + (target - start) * eased))
      if (t < 1) requestAnimationFrame(tick)
      else prevRef.current = target
    }
    requestAnimationFrame(tick)
  }, [target, duration, enabled])

  return display
}

export default function LiveMarketplacePulse() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [activities, setActivities] = useState<LiveActivity[]>([])
  const [liveStats, setLiveStats] = useState({
    traded24h: 2450000,
    activeUsers: 127,
    dealsToday: 23
  })
  const [lastActivityAt, setLastActivityAt] = useState<Date | null>(null)

  const animatedTraded = useAnimatedStat(liveStats.traded24h, 500, !reduceMotion)
  const animatedUsers = useAnimatedStat(liveStats.activeUsers, 400, !reduceMotion)
  const animatedDeals = useAnimatedStat(liveStats.dealsToday, 400, !reduceMotion)

  useEffect(() => {
    const withBorder = (a: (typeof MOCK_ACTIVITIES)[number]) => ({
      ...a,
      borderColor: BORDER_COLORS[a.color] || 'border-l-green-500'
    })
    const first = MOCK_ACTIVITIES[0]
    if (!first) return
    const initialActivity: LiveActivity = {
      ...withBorder(first),
      timestamp: new Date()
    }
    setActivities([initialActivity])
    setLastActivityAt(initialActivity.timestamp)

    const activityInterval = setInterval(() => {
      const randomActivity = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)]
      if (!randomActivity) return
      const uniqueId = `${randomActivity.id}-${Date.now()}-${Math.random()}`
      const newActivity: LiveActivity = {
        ...withBorder(randomActivity),
        id: uniqueId,
        timestamp: new Date()
      }
      setLastActivityAt(newActivity.timestamp)
      setActivities(prev => [newActivity, ...prev.filter(a => a.id !== newActivity.id)].slice(0, 5))
    }, 3500 + Math.random() * 1500)

    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        traded24h: prev.traded24h + Math.floor(Math.random() * 5000),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        dealsToday: prev.dealsToday + (Math.random() > 0.7 ? 1 : 0)
      }))
    }, 5000)

    return () => {
      clearInterval(activityInterval)
      clearInterval(statsInterval)
    }
  }, [])

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `R${(amount / 1000000).toFixed(1)}M`
    return `R${(amount / 1000).toFixed(0)}K`
  }

  const statsConfig = [
    { label: 'Traded Last 24h', value: formatAmount(animatedTraded), raw: animatedTraded, icon: TrendingUp, color: 'text-[#3D693D]', cardClass: 'bg-gradient-to-br from-white to-[#3D693D]/5 border-[#3D693D]/20 shadow-lg shadow-[#3D693D]/5', hero: true },
    { label: 'Active Users', value: animatedUsers.toString(), raw: animatedUsers, icon: Clock, color: 'text-blue-600', cardClass: 'bg-gradient-to-br from-white to-blue-50/80 border-blue-100', hero: false },
    { label: 'Deals Today', value: animatedDeals.toString(), raw: animatedDeals, icon: Package, color: 'text-orange-600', cardClass: 'bg-gradient-to-br from-white to-orange-50/80 border-orange-100', hero: false },
  ]

  const justNow = lastActivityAt && (Date.now() - lastActivityAt.getTime() < 8000)

  return (
    <div ref={sectionRef} className="w-full py-16 bg-gradient-to-br from-[#3D693D]/5 via-white to-gray-50/50 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #3D693D 1px, transparent 0)', backgroundSize: '24px 24px' }} aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Live Stats Counter */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="live-pill inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-700 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              Live Now
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsConfig.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : (reduceMotion ? {} : { opacity: 0, y: 16, scale: 0.98 })}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduceMotion ? undefined : { y: -2, transition: { duration: 0.2 } }}
                  className={`rounded-2xl p-6 border ${stat.cardClass} ${stat.hero ? 'ring-1 ring-[#3D693D]/10' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-black ${stat.color} min-h-[2.25rem] flex items-center`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={stat.value}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                      >
                        {stat.value}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Live Activity Stream */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : (reduceMotion ? {} : { opacity: 0, y: 20 })}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#3D693D] via-[#355F35] to-[#2A4A2A] px-6 py-4 relative">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} aria-hidden />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <h3 className="text-xl font-black text-white">Live Marketplace Activity</h3>
              </div>
              <span className="text-sm font-medium text-white/90">
                {justNow ? 'Just now' : 'Real-time updates'}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {activities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <motion.div
                      key={activity.id}
                      initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.98 }}
                      transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.03 }}
                      className={`flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-l-4 ${activity.borderColor} hover:bg-gray-100/90 transition-colors duration-200 group`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-semibold leading-relaxed">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
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
            {/* Bottom fade mask */}
            <div className="live-activity-fade-mask pointer-events-none" aria-hidden />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
