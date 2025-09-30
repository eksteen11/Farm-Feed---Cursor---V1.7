'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import OfferManagement from '@/components/offers/OfferManagement'
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
import { mockChatMessages, mockInvoices, mockListings } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function SellerDashboardPage() {
  const { currentUser, isAuthenticated, offers, deals, notifications, transportRequests } = useStore()
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
  const sellerOffers = offers.filter(offer => offer.sellerId === currentUser.id)
  const sellerDeals = deals.filter(deal => deal.sellerId === currentUser.id)
  const sellerInvoices = mockInvoices.filter(invoice => invoice.sellerId === currentUser.id)
  
  // Helper functions
  const getListingById = (listingId: string) => {
    return mockListings.find(listing => listing.id === listingId)
  }

  const getBuyerById = (buyerId: string) => {
    // Mock user lookup - in real app this would come from API
    const mockUsers = [
      { id: 'user-1', name: 'Demo Farmer', company: 'Demo Mixed Farm', email: 'farmer@demo.com' },
      { id: 'user-2', name: 'Sarah Johnson', company: 'Demo Maize Farm', email: 'seller@demo.com' },
      { id: 'user-3', name: 'Mike Transport', company: 'Demo Transport Services', email: 'transporter@demo.com' }
    ]
    return mockUsers.find((user: any) => user.id === buyerId) || {
      id: buyerId,
      name: 'Unknown Buyer',
      company: 'Unknown Company',
      email: 'unknown@example.com'
    }
  }
  
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
                <p className="text-2xl font-bold text-red-600">{stats.pendingOffers}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
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
                <p className="text-2xl font-bold text-green-600">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Offers - Priority Section */}
      {sellerOffers.filter(o => o.status === 'pending').length > 0 && (
        <Card className="border-red-200">
          <CardTitle className="p-6 pb-4 text-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-red-600" />
                <span>Pending Offers Requiring Attention</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setActiveTab('offers')}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                View All
              </Button>
            </div>
          </CardTitle>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {sellerOffers.filter(o => o.status === 'pending').slice(0, 3).map(offer => {
                const listing = getListingById(offer.listingId)
                const buyer = getBuyerById(offer.buyerId)
                return (
                  <div key={offer.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <div>
                        <p className="font-medium text-red-900">
                          {buyer.name} wants {listing?.title || 'your product'}
                        </p>
                        <p className="text-sm text-red-700">
                          R{offer.price.toLocaleString()}/ton for {offer.quantity} tons
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Expires: {formatDate(offer.expiresAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => {
                          setActiveTab('offers')
                          // Could add logic to scroll to specific offer
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardTitle className="p-6 pb-4">Recent Activity</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {sellerOffers.slice(0, 5).map(offer => {
              const listing = getListingById(offer.listingId)
              const buyer = getBuyerById(offer.buyerId)
              return (
                <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      offer.status === 'pending' ? 'bg-red-500' :
                      offer.status === 'accepted' ? 'bg-green-500' :
                      offer.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">
                        {offer.status === 'pending' ? 'New offer' : 
                         offer.status === 'accepted' ? 'Accepted offer' :
                         offer.status === 'rejected' ? 'Rejected offer' : 'Offer update'} from {buyer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {listing?.title || 'Listing'} - R{offer.price.toLocaleString()} for {offer.quantity} tons
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(offer.createdAt)}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      offer.status === 'pending' ? 'bg-red-100 text-red-800' :
                      offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOffers = () => (
    <OfferManagement
      offers={sellerOffers}
      listings={mockListings}
      currentUser={currentUser}
    />
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
                  message.isRead ? 'bg-gray-400' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">User #{message.senderId}</span>
                    <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.messageType === 'offer' ? 'bg-red-100 text-red-800' :
                      message.messageType === 'counter-offer' ? 'bg-red-100 text-red-800' :
                      message.messageType === 'acceptance' ? 'bg-green-100 text-green-800' :
                      message.messageType === 'rejection' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.messageType}
                    </span>
                    {!message.isRead && (
                      <span className="text-xs text-red-600 font-medium">New</span>
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
                      deal.status === 'in-transit' ? 'bg-green-100 text-green-800' :
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
                  <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                    View Details
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
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {stats.pendingOffers}
                  </span>
                )}
                {tab.id === 'messages' && stats.unreadMessages > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Priority Actions - Prominent Offer Management */}
        {stats.pendingOffers > 0 && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardTitle className="p-6 pb-4 text-red-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-red-600" />
                  <span>Action Required: {stats.pendingOffers} Pending Offer{stats.pendingOffers > 1 ? 's' : ''}</span>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('offers')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Review Offers Now
                </Button>
              </div>
            </CardTitle>
          </Card>
        )}

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
              {stats.pendingOffers > 0 && (
                <Button 
                  variant="secondary" 
                  leftIcon={<Clock className="w-4 h-4" />}
                  onClick={() => setActiveTab('offers')}
                  className="w-full border-red-200 text-red-700 hover:bg-red-50"
                >
                  Manage Pending Offers ({stats.pendingOffers})
                </Button>
              )}
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
