'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  DollarSign,
  Package,
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import Badge from '@/shared/ui/Badge'
import { Offer, Listing, User } from '@/types'
import { formatDate } from '@/shared/utils/utils

interface OfferSummaryProps {
  offers: Offer[]
  listings: Listing[]
  currentUser: User
  userType: 'buyer' | 'seller'
}

export default function OfferSummary({ offers, listings, currentUser, userType }: OfferSummaryProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Filter offers based on time range
  const getFilteredOffers = () => {
    const now = new Date()
    const daysAgo = new Date(now.getTime() - (parseInt(timeRange) * 24 * 60 * 60 * 1000))
    
    return offers.filter(offer => {
      const offerDate = new Date(offer.createdAt)
      return offerDate >= daysAgo
    })
  }

  const filteredOffers = getFilteredOffers()

  // Calculate statistics
  const stats = {
    total: filteredOffers.length,
    pending: filteredOffers.filter(o => o.status === 'pending').length,
    accepted: filteredOffers.filter(o => o.status === 'accepted').length,
    rejected: filteredOffers.filter(o => o.status === 'rejected').length,
    counterOffered: filteredOffers.filter(o => o.status === 'counter-offered').length,
    totalValue: filteredOffers.reduce((sum, o) => sum + (o.price * o.quantity), 0),
    averagePrice: filteredOffers.length > 0 
      ? filteredOffers.reduce((sum, o) => sum + o.price, 0) / filteredOffers.length 
      : 0
  }

  // Get recent offers for activity feed
  const recentOffers = filteredOffers
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const getListingById = (listingId: string) => {
    return listings.find(listing => listing.id === listingId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'counter-offered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'counter-offered': return <RotateCcw className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userType === 'buyer' ? 'My Offers' : 'Incoming Offers'}
          </h2>
          <p className="text-gray-600">
            Track and manage your {userType === 'buyer' ? 'outgoing' : 'incoming'} offers
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          {userType === 'buyer' && (
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Browse Listings
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  R{stats.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Average Price</p>
              <p className="text-xl font-bold text-gray-900">
                R{stats.averagePrice.toLocaleString()}/ton
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Counter Offers</p>
              <p className="text-xl font-bold text-gray-900">{stats.counterOffered}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentOffers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No offers in the selected time range</p>
              </div>
            ) : (
              recentOffers.map((offer) => {
                const listing = getListingById(offer.listingId)
                
                return (
                  <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {listing?.title || `Listing #${offer.listingId}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userType === 'buyer' ? 'Your offer' : 'Buyer offer'}: R{offer.price.toLocaleString()}/ton
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(offer.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(offer.status)}
                          <span className="capitalize">{offer.status.replace('-', ' ')}</span>
                        </div>
                      </Badge>
                      
                      <div className="text-right text-sm text-gray-500">
                        <p>{formatDate(offer.updatedAt)}</p>
                        <p>{offer.quantity} tons</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="text-lg mb-4">Quick Actions</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userType === 'buyer' ? (
              <>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Plus className="w-4 h-4" />}>
                  Browse New Listings
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<TrendingUp className="w-4 h-4" />}>
                  View Market Trends
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Package className="w-4 h-4" />}>
                  Create New Listing
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<TrendingUp className="w-4 h-4" />}>
                  View Analytics
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
