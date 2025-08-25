'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Package, 
  MessageCircle, 
  DollarSign, 
  TrendingUp, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  Star,
  Settings
} from 'lucide-react'
import { mockOffers, mockChatMessages, mockDeals, mockInvoices } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function SellerDashboardPage() {
  const { currentUser, isAuthenticated } = useStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }
    
    if (currentUser.role !== 'seller') {
      router.push('/')
      return
    }
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || !currentUser || currentUser.role !== 'seller') {
    return null
  }

  // Get seller-specific data
  const sellerOffers = mockOffers.filter(offer => offer.sellerId === currentUser.id)
  const sellerDeals = mockDeals.filter(deal => deal.sellerId === currentUser.id)
  const sellerInvoices = mockInvoices.filter(invoice => invoice.sellerId === currentUser.id)
  
  // Get chat messages for seller
  const sellerChats = mockChatMessages.filter(msg => 
    msg.receiverId === currentUser.id || msg.senderId === currentUser.id
  )

  const stats = {
    totalListings: 3, // Mock data
    activeListings: 2,
    pendingOffers: sellerOffers.filter(o => o.status === 'pending').length,
    totalDeals: sellerDeals.length,
    totalRevenue: sellerDeals.reduce((sum, deal) => sum + deal.totalAmount, 0),
    unreadMessages: sellerChats.filter(msg => !msg.isRead && msg.receiverId === currentUser.id).length
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-primary-600">{stats.activeListings}</p>
              </div>
              <Package className="w-8 h-8 text-primary-500" />
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
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalDeals}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-blue-600">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardTitle className="p-6 pb-4">Recent Activity</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {sellerOffers.slice(0, 5).map(offer => (
              <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    offer.status === 'pending' ? 'bg-orange-500' :
                    offer.status === 'accepted' ? 'bg-green-500' :
                    offer.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium">New offer on listing #{offer.listingId}</p>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Incoming Offers</h2>
        <Button variant="primary" leftIcon={<Eye className="w-4 h-4" />}>
          View All Listings
        </Button>
      </div>

      <div className="space-y-4">
        {sellerOffers.map(offer => (
          <Card key={offer.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Buyer #{offer.buyerId}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      offer.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold">R{offer.price.toLocaleString()}/ton</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{offer.quantity} tons</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery</p>
                      <p className="font-semibold capitalize">{offer.deliveryType}</p>
                    </div>
                  </div>

                  {offer.message && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{offer.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Received {formatDate(offer.createdAt)}</span>
                    <span>Expires {formatDate(offer.expiresAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {offer.status === 'pending' && (
                    <>
                      <Button variant="primary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}>
                        Accept
                      </Button>
                      <Button variant="secondary" size="sm" leftIcon={<XCircle className="w-4 h-4" />}>
                        Reject
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />}>
                        Counter
                      </Button>
                    </>
                  )}
                  {offer.status === 'counter-offered' && offer.counterOffer && (
                    <div className="text-sm">
                      <p className="font-medium text-green-600">Counter: R{offer.counterOffer.price.toLocaleString()}</p>
                      <p className="text-gray-600">{offer.counterOffer.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Messages & Negotiations</h2>
      
      <div className="space-y-4">
        {sellerChats.slice(0, 10).map(message => (
          <Card key={message.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  message.isRead ? 'bg-gray-400' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">User #{message.senderId}</span>
                    <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.messageType === 'offer' ? 'bg-blue-100 text-blue-800' :
                      message.messageType === 'counter-offer' ? 'bg-orange-100 text-orange-800' :
                      message.messageType === 'acceptance' ? 'bg-green-100 text-green-800' :
                      message.messageType === 'rejection' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.messageType}
                    </span>
                    {!message.isRead && (
                      <span className="text-xs text-blue-600 font-medium">New</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderDeals = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Active Deals</h2>
      
      <div className="space-y-4">
        {sellerDeals.map(deal => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Deal #{deal.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deal.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      deal.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                      deal.status === 'delivered' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Final Price</p>
                      <p className="font-semibold">R{deal.finalPrice.toLocaleString()}/ton</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{deal.quantity} tons</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">R{deal.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Platform Fee: R{deal.platformFee}</span>
                    <span>Payment: {deal.paymentStatus}</span>
                    {deal.deliveryDate && (
                      <span>Delivery: {formatDate(deal.deliveryDate)}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />}>
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
            Seller Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your listings, offers, and deals
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'offers', label: 'Offers', icon: Package },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'deals', label: 'Deals', icon: CheckCircle }
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
                {tab.id === 'messages' && stats.unreadMessages > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardTitle className="p-6 pb-4">Quick Actions</CardTitle>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              <Button 
                variant="primary" 
                leftIcon={<Package className="w-4 h-4" />}
                onClick={() => router.push('/seller/create-listing')}
                className="w-full"
              >
                Create New Listing
              </Button>
              <Button variant="secondary" leftIcon={<User className="w-4 h-4" />} className="w-full">
                Update Profile
              </Button>
              <Button variant="secondary" leftIcon={<Settings className="w-4 h-4" />} className="w-full">
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'offers' && renderOffers()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'deals' && renderDeals()}
          </div>
        </div>
      </div>
    </div>
  )
}
