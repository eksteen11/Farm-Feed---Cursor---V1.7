'use client'

import React from 'react'
import { TrendingUp, Package, ShoppingCart, Truck, Clock } from 'lucide-react'
import { Card, CardContent } from './Card'

interface ActivityItem {
  type: 'listing' | 'offer' | 'deal' | 'transport'
  user: string
  action: string
  time: string
  amount?: string
}

interface LiveActivityFeedProps {
  activities?: ActivityItem[]
  className?: string
}

const mockActivities: ActivityItem[] = [
  { type: 'deal', user: 'John van der Merwe', action: 'completed a deal', time: '2 minutes ago', amount: 'R45,000' },
  { type: 'listing', user: 'Sarah Mthembu', action: 'created a new listing', time: '5 minutes ago' },
  { type: 'offer', user: 'Mike Botha', action: 'made an offer', time: '8 minutes ago', amount: 'R12,500' },
  { type: 'transport', user: 'Botha Transport', action: 'accepted a transport job', time: '12 minutes ago' },
  { type: 'deal', user: 'Vredenburg Farms', action: 'completed a deal', time: '15 minutes ago', amount: 'R28,000' },
]

const iconMap = {
  listing: Package,
  offer: ShoppingCart,
  deal: TrendingUp,
  transport: Truck,
}

const colorMap = {
  listing: 'text-[#3D693D] bg-[#3D693D]/10',
  offer: 'text-[#5A8A5A] bg-[#5A8A5A]/10',
  deal: 'text-[#DB4A39] bg-[#DB4A39]/10',
  transport: 'text-[#2A4A2A] bg-[#2A4A2A]/10',
}

export default function LiveActivityFeed({ 
  activities = mockActivities,
  className = '' 
}: LiveActivityFeedProps) {
  return (
    <section className={`relative py-16 bg-white ${className}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D693D]/10 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#3D693D] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#3D693D]">Live Activity</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real-Time Trading Activity
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what&apos;s happening on Farm Feed right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.slice(0, 6).map((activity, index) => {
            const Icon = iconMap[activity.type]
            const colors = colorMap[activity.type]
            
            return (
              <Card 
                key={index} 
                variant="elevated" 
                className="p-4 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-semibold mb-1">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.action}
                      {activity.amount && (
                        <span className="font-semibold text-[#3D693D] ml-1">
                          {activity.amount}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Updates every minute • <span className="font-semibold text-[#3D693D]">500+</span> active users
          </p>
        </div>
      </div>
    </section>
  )
}


