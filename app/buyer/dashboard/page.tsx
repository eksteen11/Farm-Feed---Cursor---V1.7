'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import BuyerOffers from '@/components/offers/BuyerOffers'
import { 
  ShoppingCart, 
  MessageCircle, 
  DollarSign, 
  TrendingUp, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Truck,
  Calendar,
  Star
} from 'lucide-react'
import { mockListings } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function BuyerDashboardPage() {
  const { currentUser, isAuthenticated } = useStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const { offers, transportRequests } = useStore()
  
  // Redirect if not authenticated or not a buyer
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }
    
    if (currentUser.role !== 'buyer') {
      router.push('/')
      return
    }
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || !currentUser || currentUser.role !== 'buyer') {
    return null
  }
  
  // Get buyer-specific data
  const buyerOffers = offers.filter(offer => offer.buyerId === currentUser.id)
  const buyerTransportRequests = transportRequests.filter(request => request.requesterId === currentUser.id)
  


  const stats = {
    totalOffers: buyerOffers.length,
    pendingOffers: buyerOffers.filter(o => o.status === 'pending').length,
    acceptedOffers: buyerOffers.filter(o => o.status === 'accepted').length,
    transportRequests: buyerTransportRequests.length,
    activeTransport: buyerTransportRequests.filter(r => r.status === 'accepted').length
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-primary-600">{stats.totalOffers}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Offers</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingOffers}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted Offers</p>
                <p className="text-2xl font-bold text-green-600">{stats.acceptedOffers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transport Requests</p>
                <p className="text-2xl font-bold text-blue-600">{stats.transportRequests}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardTitle className="p-6 pb-4">Recent Activity</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {buyerOffers.slice(0, 5).map(offer => (
              <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    offer.status === 'pending' ? 'bg-orange-500' :
                    offer.status === 'accepted' ? 'bg-green-500' :
                    offer.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium">Offer on listing #{offer.listingId}</p>
                    <p className="text-sm text-gray-600">
                      R{offer.price.toLocaleString()} for {offer.quantity} tons
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(offer.createdAt)}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    offer.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {offer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOffers = () => (
    <BuyerOffers
      offers={buyerOffers}
      listings={mockListings}
      currentUser={currentUser}
    />
  )

  const renderTransport = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transport Requests</h2>
        <Button variant="primary" leftIcon={<Truck className="w-4 h-4" />}>
          New Transport Request
        </Button>
      </div>

      <div className="space-y-4">
        {buyerTransportRequests.map(request => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Truck className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Transport Request #{request.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'open' ? 'bg-orange-100 text-orange-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      request.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-semibold">{request.pickupLocation} → {request.deliveryLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{request.quantity} {request.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Preferred: {formatDate(request.preferredDate)}</span>
                    {request.budget && <span>Budget: R{request.budget.toLocaleString()}</span>}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                    View Quotes
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />}>
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buyer Dashboard
          </h1>
          <p className="text-gray-600">
            Track your offers and transport requests
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'offers', label: 'My Offers', icon: ShoppingCart },
              { id: 'transport', label: 'Transport', icon: Truck }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.label}
                {tab.id === 'offers' && stats.pendingOffers > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {stats.pendingOffers}
                  </span>
                )}
                {tab.id === 'transport' && stats.activeTransport > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {stats.activeTransport}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'offers' && renderOffers()}
            {activeTab === 'transport' && renderTransport()}
          </div>
        </div>
      </div>
    </div>
  )
}
