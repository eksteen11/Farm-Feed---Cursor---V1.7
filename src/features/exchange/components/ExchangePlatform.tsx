'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import type { OrderBook, ExchangeOrder, Listing } from '@/types'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface ExchangePlatformProps {
  listingId?: string
}

export default function ExchangePlatform({ listingId }: ExchangePlatformProps) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch order book data
    // fetchOrderBook(listingId).then(setOrderBook)
    setLoading(false)
  }, [listingId])

  if (loading) {
    return <div>Loading exchange data...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Exchange Platform</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Book */}
            <div>
              <h3 className="font-semibold mb-4">Order Book</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500 mb-2">Bids (Buyers)</div>
                {orderBook?.bids.map((bid, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-green-50 rounded">
                    <span>{bid.quantity} tons</span>
                    <span className="font-semibold">R{bid.price}/ton</span>
                  </div>
                ))}
              </div>
              <div className="my-4 border-t"></div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500 mb-2">Asks (Sellers)</div>
                {orderBook?.asks.map((ask, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-red-50 rounded">
                    <span>{ask.quantity} tons</span>
                    <span className="font-semibold">R{ask.price}/ton</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart Placeholder */}
            <div>
              <h3 className="font-semibold mb-4">Price Chart</h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-400">Chart coming soon</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

