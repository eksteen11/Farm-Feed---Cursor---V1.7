'use client'

import React, { useState, useEffect } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  X, 
  MessageCircle,
  DollarSign,
  Package,
  User,
  Calendar,
  TrendingUp,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  Filter,
  Search,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/shared/utils/utils'
import toast from 'react-hot-toast'

export default function OffersPage() {
  const { currentUser, offers, listings, fetchOffers, fetchListings } = useSupabaseStore()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await Promise.all([fetchOffers(), fetchListings()])
      } catch (error) {
        console.error('Error loading offers:', error)
        toast.error('Failed to load offers')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [fetchOffers, fetchListings])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view offers</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Debug logging
  console.log('🔍 OFFERS PAGE DEBUG:')
  console.log('🔍 Current user ID:', currentUser.id)
  console.log('🔍 Total offers from store:', offers.length)
  console.log('🔍 Total listings from store:', listings.length)

  // Create unified offers data
  const unifiedOffers = []

  // Add offers made by the user (as buyer)
  const madeOffersRaw = offers.filter(offer => {
    console.log('🔍 Checking offer buyerId:', offer.buyerId, 'vs current user:', currentUser.id)
    return offer.buyerId === currentUser.id
  })
  console.log('🔍 Made offers count:', madeOffersRaw.length)
  
  madeOffersRaw.forEach(offer => {
    const listing = listings.find(l => l.id === offer.listingId)
    unifiedOffers.push({
      id: `made-${offer.id}`,
      type: 'made',
      offer,
      listing,
      otherParty: listing?.seller,
      status: offer.status,
      createdAt: offer.createdAt,
      requiresAction: offer.status === 'pending' || offer.status === 'countered'
    })
  })

  // Add offers received by the user (as seller)
  const receivedOffersRaw = offers.filter(offer => {
    const listing = listings.find(l => l.id === offer.listingId)
    const isReceived = listing?.seller?.id === currentUser.id
    if (isReceived) {
      console.log('🔍 Found received offer:', offer.id, 'from listing:', listing?.title)
    }
    return isReceived
  })
  console.log('🔍 Received offers count:', receivedOffersRaw.length)
  
  receivedOffersRaw.forEach(offer => {
    const listing = listings.find(l => l.id === offer.listingId)
    unifiedOffers.push({
      id: `received-${offer.id}`,
      type: 'received',
      offer,
      listing,
      otherParty: offer.buyer,
      status: offer.status,
      createdAt: offer.createdAt,
      requiresAction: offer.status === 'pending'
    })
  })

  // Sort by creation date (newest first)
  unifiedOffers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Apply search filter
  const filteredOffers = unifiedOffers.filter(unifiedOffer => {
    const searchLower = searchTerm.toLowerCase()
    return (
      unifiedOffer.listing?.title?.toLowerCase().includes(searchLower) ||
      unifiedOffer.otherParty?.name?.toLowerCase().includes(searchLower) ||
      unifiedOffer.status.toLowerCase().includes(searchLower) ||
      unifiedOffer.type.toLowerCase().includes(searchLower)
    )
  })

  const madeOffers = filteredOffers.filter(o => o.type === 'made')
  const receivedOffers = filteredOffers.filter(o => o.type === 'received')

  // Calculate stats
  const stats = {
    total: madeOffers.length + receivedOffers.length,
    made: madeOffers.length,
    received: receivedOffers.length,
    pending: [...madeOffers, ...receivedOffers].filter(o => o.status === 'pending').length,
    accepted: [...madeOffers, ...receivedOffers].filter(o => o.status === 'accepted').length,
    requiresAction: [...madeOffers, ...receivedOffers].filter(o => o.requiresAction).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'countered': return 'bg-blue-100 text-blue-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <X className="w-4 h-4" />
      case 'countered': return <AlertCircle className="w-4 h-4" />
      case 'withdrawn': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleOfferAction = async (action: string, offer: any) => {
    try {
      let response
      
      switch (action) {
        case 'Accept':
          response = await fetch(`/api/offers/${offer.id}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          break
          
        case 'Reject':
          response = await fetch(`/api/offers/${offer.id}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'No reason provided' })
          })
          break
          
        case 'Counter':
          toast.success('Counter offer feature coming soon!')
          return
          
        case 'Edit':
          toast.success('Edit offer feature coming soon!')
          return
          
        case 'Withdraw':
          toast.success('Withdraw offer feature coming soon!')
          return
          
        default:
          toast.error('Unknown action')
          return
      }
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(`Offer ${action.toLowerCase()}ed successfully!`)
        // Refresh the data
        await Promise.all([fetchOffers(), fetchListings()])
      } else {
        toast.error(result.error || 'Action failed')
      }
      
    } catch (error) {
      console.error('Error performing offer action:', error)
      toast.error('Action failed. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard" className="mr-4">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Offers
              </h1>
              <p className="text-gray-600">
                Manage all your offer activities - both made and received
              </p>
            </div>
            {stats.requiresAction > 0 && (
              <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {stats.requiresAction} action{stats.requiresAction !== 1 ? 's' : ''} required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.made} made, {stats.received} received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <p className="text-xs text-muted-foreground">
                Ready to proceed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R{[...madeOffers, ...receivedOffers].reduce((sum, offer) => sum + (offer.offer.price * offer.offer.quantity), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all offers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Offers Sections */}
        <div className="space-y-8">
          {/* Offers I Made Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                Offers I Made ({madeOffers.length})
              </h2>
              <span className="text-sm text-gray-500">As a buyer</span>
            </div>
            
            {madeOffers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <ShoppingCart className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <h3 className="text-md font-medium text-gray-900 mb-2">No offers made yet</h3>
                  <p className="text-gray-500 mb-4">Start browsing listings to make your first offer</p>
                  <Link href="/listings">
                    <Button size="sm">Browse Listings</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {madeOffers.map((unifiedOffer) => (
                  <Card key={unifiedOffer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(unifiedOffer.status)}`}>
                              {getStatusIcon(unifiedOffer.status)}
                              <span className="ml-1 capitalize">{unifiedOffer.status}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {formatDate(unifiedOffer.createdAt)}
                            </div>
                            {unifiedOffer.requiresAction && (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <Bell className="w-3 h-3 mr-1" />
                                Action Required
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Offer Details */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {unifiedOffer.listing?.title || 'Unknown Listing'}
                              </h3>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-medium">R{unifiedOffer.offer.price.toLocaleString()}</span>
                                  <span className="text-gray-500 ml-1">per ton</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Package className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-medium">{unifiedOffer.offer.quantity.toLocaleString()}</span>
                                  <span className="text-gray-500 ml-1">tons</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-bold text-green-600">
                                    Total: R{(unifiedOffer.offer.price * unifiedOffer.offer.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Other Party Information */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Listing Owner
                              </h4>
                              <div className="flex items-center space-x-3 mb-3">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {unifiedOffer.otherParty?.name || 'Unknown User'}
                                </span>
                              </div>
                              {unifiedOffer.offer.terms && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  <strong>Terms:</strong> {unifiedOffer.offer.terms}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-6">
                          {unifiedOffer.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleOfferAction('Edit', unifiedOffer)}
                              >
                                <Reply className="w-4 h-4 mr-1" />
                                Edit Offer
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleOfferAction('Withdraw', unifiedOffer)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Withdraw
                              </Button>
                            </>
                          )}
                          <Link href={`/listings/${unifiedOffer.offer.listingId}`}>
                            <Button size="sm" variant="secondary">
                              <Eye className="w-4 h-4 mr-1" />
                              View Listing
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Offers I Received Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                Offers I Received ({receivedOffers.length})
              </h2>
              <span className="text-sm text-gray-500">As a seller</span>
            </div>
            
            {receivedOffers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <h3 className="text-md font-medium text-gray-900 mb-2">No offers received yet</h3>
                  <p className="text-gray-500 mb-4">Create listings to start receiving offers from buyers</p>
                  <Link href="/seller/create-listing">
                    <Button size="sm">Create Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedOffers.map((unifiedOffer) => (
                  <Card key={unifiedOffer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(unifiedOffer.status)}`}>
                              {getStatusIcon(unifiedOffer.status)}
                              <span className="ml-1 capitalize">{unifiedOffer.status}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {formatDate(unifiedOffer.createdAt)}
                            </div>
                            {unifiedOffer.requiresAction && (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <Bell className="w-3 h-3 mr-1" />
                                Action Required
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Offer Details */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {unifiedOffer.listing?.title || 'Unknown Listing'}
                              </h3>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-medium">R{unifiedOffer.offer.price.toLocaleString()}</span>
                                  <span className="text-gray-500 ml-1">per ton</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Package className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-medium">{unifiedOffer.offer.quantity.toLocaleString()}</span>
                                  <span className="text-gray-500 ml-1">tons</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="font-bold text-green-600">
                                    Total: R{(unifiedOffer.offer.price * unifiedOffer.offer.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Other Party Information */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Buyer
                              </h4>
                              <div className="flex items-center space-x-3 mb-3">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {unifiedOffer.otherParty?.name || 'Unknown User'}
                                </span>
                              </div>
                              {unifiedOffer.offer.terms && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  <strong>Terms:</strong> {unifiedOffer.offer.terms}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-6">
                          {unifiedOffer.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleOfferAction('Accept', unifiedOffer)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleOfferAction('Reject', unifiedOffer)}
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleOfferAction('Counter', unifiedOffer)}
                              >
                                <Reply className="w-4 h-4 mr-1" />
                                Counter Offer
                              </Button>
                            </>
                          )}
                          <Link href={`/listings/${unifiedOffer.offer.listingId}`}>
                            <Button size="sm" variant="secondary">
                              <Eye className="w-4 h-4 mr-1" />
                              View Listing
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}