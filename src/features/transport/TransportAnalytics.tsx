'use client'

import React from 'react'
import { Card, CardContent, CardTitle } from '@/shared/ui/Card'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Clock,
  BarChart3
} from 'lucide-react'
import { mockTransportRequests, mockTransportQuotes } from '@/shared/util@/shared/utils/mockData'
import ClientOnly from '@/shared/ui/ClientOnly'

export default function TransportAnalytics() {
  const allRequests = mockTransportRequests
  const allQuotes = mockTransportQuotes

  // Calculate average quote price
  const averageQuotePrice = allQuotes.length > 0 
    ? allQuotes.reduce((sum, quote) => sum + quote.price, 0) / allQuotes.length 
    : 0

  // Calculate average delivery time
  const averageDeliveryTime = allQuotes.length > 0
    ? allQuotes.reduce((sum, quote) => sum + quote.estimatedDays, 0) / allQuotes.length
    : 0

  // Top pickup locations
  const pickupStats = allRequests.reduce((acc, request) => {
    acc[request.pickupLocation] = (acc[request.pickupLocation] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topPickupLocations = Object.entries(pickupStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Top delivery locations
  const deliveryStats = allRequests.reduce((acc, request) => {
    acc[request.deliveryLocation] = (acc[request.deliveryLocation] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topDeliveryLocations = Object.entries(deliveryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Price trends (mock data)
  const priceTrends = [
    { month: 'Jan', price: 8500 },
    { month: 'Feb', price: 9200 },
    { month: 'Mar', price: 8800 },
    { month: 'Apr', price: 9500 },
    { month: 'May', price: 10200 },
    { month: 'Jun', price: 9800 }
  ]

  const currentPrice = priceTrends[priceTrends.length - 1].price
  const previousPrice = priceTrends[priceTrends.length - 2].price
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Quote Price</p>
                <p className="text-2xl font-bold text-gray-900">R{Math.round(averageQuotePrice).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(priceChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Delivery Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageDeliveryTime)} days</p>
                <p className="text-sm text-gray-500 mt-1">From quote to delivery</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quote Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allQuotes.length > 0 ? Math.round((allQuotes.filter(q => q.status === 'accepted').length / allQuotes.length) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Quotes accepted</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="p-6 pb-3">Top Pickup Locations</CardTitle>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {topPickupLocations.map(([location, count], index) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{location}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{count} requests</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle className="p-6 pb-3">Top Delivery Locations</CardTitle>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {topDeliveryLocations.map(([location, count], index) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{location}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{count} requests</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Trends */}
      <Card>
        <CardTitle className="p-6 pb-3">Transport Price Trends</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">Average Quote Price Trend</p>
                <p className="text-sm text-gray-500">Last 6 months</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">R{currentPrice.toLocaleString()}</p>
                <div className="flex items-center justify-end mt-1">
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}% from last month
                  </span>
                </div>
              </div>
            </div>
            
            {/* Simple bar chart */}
            <ClientOnly>
              <div className="flex items-end justify-between h-32 pt-4">
                {priceTrends.map((trend, index) => {
                  const maxPrice = Math.max(...priceTrends.map(t => t.price))
                  const height = (trend.price / maxPrice) * 100
                  
                  return (
                    <div key={trend.month} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-8 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-gray-500">{trend.month}</span>
                      <span className="text-xs font-medium text-gray-700">R{Math.round(trend.price / 1000)}k</span>
                    </div>
                  )
                })}
              </div>
            </ClientOnly>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
