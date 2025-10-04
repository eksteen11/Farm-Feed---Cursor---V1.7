'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  FileText,
  CreditCard,
  MessageSquare
} from 'lucide-react'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { Deal, User as UserType, Listing } from '@/types'
import Button from '@/shared/ui/Button'
import Badge from '@/shared/ui/Badge'
import Card from '@/shared/ui/Card'
import { formatDate } from '@/shared/utils/utils'
import { mockUsers, mockListings } from '@/shared/utils/mockData'
import DealManagement from '@/features/deals/components/DealManagement'

export default function DealsPage() {
  const { currentUser, deals, isAuthenticated } = useSupabaseStore()
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'connected' | 'negotiating' | 'transport-quoted' | 'transport-selected' | 'facilitated' | 'completed'>('all')

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login'
    }
  }, [isAuthenticated])

  if (!currentUser) {
    return <div>Loading...</div>
  }

  const getUserById = (userId: string): UserType => {
    return mockUsers.find(user => user.id === userId) || {
      id: userId,
      email: 'user@example.com',
      name: 'Unknown User',
      role: 'buyer',
      capabilities: ['buy'],
      company: 'Unknown Company',
      location: 'Unknown',
      isVerified: false,
      subscriptionStatus: 'inactive',
      ficaStatus: 'pending',
      ficaDocuments: {},
      rating: 0,
      totalDeals: 0,
      totalTransactions: 0,
      reputationScore: 0,
      businessType: 'individual',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const getListingById = (listingId: string): Listing | null => {
    return mockListings.find(listing => listing.id === listingId) || null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'connected': return 'bg-blue-100 text-blue-800'
      case 'negotiating': return 'bg-orange-100 text-orange-800'
      case 'transport-quoted': return 'bg-purple-100 text-purple-800'
      case 'transport-selected': return 'bg-indigo-100 text-indigo-800'
      case 'facilitated': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'negotiating': return <MessageSquare className="w-4 h-4" />
      case 'transport-quoted': return <Truck className="w-4 h-4" />
      case 'transport-selected': return <Truck className="w-4 h-4" />
      case 'facilitated': return <FileText className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const userDeals = (deals || []).filter(deal => 
    deal.buyerId === currentUser.id || deal.sellerId === currentUser.id
  )

  const filteredDeals = activeTab === 'all' 
    ? userDeals 
    : userDeals.filter(deal => deal.status === activeTab)

  const dealStats = {
    total: userDeals.length,
    pending: userDeals.filter(d => d.status === 'pending').length,
    connected: userDeals.filter(d => d.status === 'connected').length,
    negotiating: userDeals.filter(d => d.status === 'negotiating').length,
    transportQuoted: userDeals.filter(d => d.status === 'transport-quoted').length,
    transportSelected: userDeals.filter(d => d.status === 'transport-selected').length,
    facilitated: userDeals.filter(d => d.status === 'facilitated').length,
    completed: userDeals.filter(d => d.status === 'completed').length,
    totalValue: userDeals.reduce((sum, deal) => sum + deal.totalAmount, 0)
  }

  const handleDealAction = (deal: Deal, action: string) => {
    setSelectedDeal(deal)
    // Handle different actions based on user role and deal status
    console.log(`Action: ${action} on deal: ${deal.id}`)
  }

  const handleUpdateDeal = (dealId: string, updates: Partial<Deal>) => {
    // Update deal in store
    console.log(`Updating deal ${dealId}:`, updates)
    // This would typically update the store/backend
  }

  const renderDealCard = (deal: Deal) => {
    const listing = getListingById(deal.listingId)
    const otherUser = deal.buyerId === currentUser.id 
      ? getUserById(deal.sellerId) 
      : getUserById(deal.buyerId)
    
    const isBuyer = deal.buyerId === currentUser.id
    const isSeller = deal.sellerId === currentUser.id

    return (
      <Card key={deal.id} className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {listing?.title || 'Product Deal'}
              </h3>
              <p className="text-sm text-gray-500">
                {isBuyer ? 'Buying from' : 'Selling to'} {otherUser.company || otherUser.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(deal.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(deal.status)}
                <span className="capitalize">{deal.status.replace('-', ' ')}</span>
              </div>
            </Badge>
            <Badge className={getPaymentStatusColor(deal.paymentStatus)}>
              <CreditCard className="w-3 h-3 mr-1" />
              {deal.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Deal Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium text-gray-900">
                R{deal.finalPrice.toLocaleString()}/ton
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">
                {deal.quantity} tons
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="font-medium text-gray-900">
                R{deal.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start space-x-2">
            <Truck className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Delivery</p>
              <p className="text-sm text-gray-900 capitalize">
                {deal.deliveryType.replace('-', ' ')}
              </p>
            </div>
          </div>
          
          {deal.deliveryDate && (
            <div className="flex items-start space-x-2">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="text-sm text-gray-900">{formatDate(deal.deliveryDate)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        {deal.deliveryAddress && (
          <div className="flex items-start space-x-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="text-sm text-gray-900">{deal.deliveryAddress}</p>
            </div>
          </div>
        )}

        {/* Terms */}
        {deal.terms && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Terms & Conditions</p>
            <p className="text-sm text-gray-900">{deal.terms}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button
            variant="primary"
            onClick={() => setSelectedDeal(deal)}
            className="flex-1 min-w-[120px]"
          >
            <Package className="w-4 h-4 mr-2" />
            Manage Deal
          </Button>

          {deal.status === 'pending' && (
            <Button
              variant="primary"
              onClick={() => setSelectedDeal(deal)}
              className="flex-1 min-w-[120px]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Connect Parties
            </Button>
          )}

          {deal.status === 'connected' && (
            <Button
              variant="primary"
              onClick={() => setSelectedDeal(deal)}
              className="flex-1 min-w-[120px]"
            >
              <Truck className="w-4 h-4 mr-2" />
              Get Transport Quotes
            </Button>
          )}

          {deal.status === 'transport-quoted' && (
            <Button
              variant="secondary"
              onClick={() => setSelectedDeal(deal)}
              className="flex-1 min-w-[120px]"
            >
              <Truck className="w-4 h-4 mr-2" />
              Select Transport
            </Button>
          )}

          {deal.status === 'transport-selected' && (
            <Button
              variant="primary"
              onClick={() => setSelectedDeal(deal)}
              className="flex-1 min-w-[120px]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Contract
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Deals</h1>
          <p className="text-gray-600 mt-2">Manage your active and completed deals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{dealStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{dealStats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{dealStats.inTransit}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">R{dealStats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'all', label: 'All Deals', count: dealStats.total },
            { key: 'pending', label: 'Pending', count: dealStats.pending },
            { key: 'connected', label: 'Connected', count: dealStats.connected },
            { key: 'negotiating', label: 'Negotiating', count: dealStats.negotiating },
            { key: 'transport-quoted', label: 'Transport Quoted', count: dealStats.transportQuoted },
            { key: 'transport-selected', label: 'Transport Selected', count: dealStats.transportSelected },
            { key: 'facilitated', label: 'Facilitated', count: dealStats.facilitated },
            { key: 'completed', label: 'Completed', count: dealStats.completed }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Deals List */}
        {filteredDeals.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Deals Found</h3>
            <p className="text-gray-500">
              {activeTab === 'all' 
                ? "You don't have any deals yet. Start by making or receiving offers on listings."
                : `You don't have any ${activeTab.replace('-', ' ')} deals.`
              }
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredDeals.map(renderDealCard)}
          </div>
        )}

        {/* Deal Management Modal */}
        {selectedDeal && (
          <DealManagement
            deal={selectedDeal}
            currentUser={currentUser}
            onUpdateDeal={handleUpdateDeal}
            onClose={() => setSelectedDeal(null)}
          />
        )}
      </div>
    </div>
  )
}
