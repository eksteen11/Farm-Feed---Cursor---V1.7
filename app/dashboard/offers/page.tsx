'use client'

import { useStore } from '@/store/useStore'
import { canUserPerformAction } from '@/types'
import { ShoppingCart, Package, TrendingUp, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'

export default function OffersPage() {
  const { currentUser, offers, listings } = useStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your offers</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userOffers = offers.filter(o => o.buyerId === currentUser.id)
  const receivedOffers = offers.filter(o => {
    const listing = listings.find(l => l.id === o.listingId)
    return listing?.sellerId === currentUser.id
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'countered': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'countered': return <MessageSquare className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    if (!isClient) return 'Loading...'
    return date.toLocaleDateString()
  }

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Offers & Negotiations</h1>
                <p className="text-gray-600 mt-2">
                  Track your offers and manage received offers
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Offers & Negotiations</h1>
              <p className="text-gray-600 mt-2">
                Track your offers and manage received offers
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/listings">
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Browse Listings</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offers Made */}
        {canUserPerformAction(currentUser, 'buy') && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" />
                Offers Made
              </h2>
              <span className="text-sm text-gray-500">
                {userOffers.length} offer{userOffers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {userOffers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers made yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start buying by making offers on available listings
                  </p>
                  <Link href="/listings">
                    <Button>Browse Listings</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userOffers.map((offer) => {
                  const listing = listings.find(l => l.id === offer.listingId)
                  return (
                    <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{listing?.title || 'Unknown Listing'}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(offer.status)}`}>
                            {getStatusIcon(offer.status)}
                            <span>{offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}</span>
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Your Offer:</span>
                            <span className="font-semibold text-lg">R{offer.price}/ton</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Quantity:</span>
                            <span>{offer.quantity} tons</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Value:</span>
                            <span className="font-semibold">R{offer.price * offer.quantity}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Platform Fee:</span>
                            <span>R1/ton</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Made:</span>
                            <span className="text-sm">{formatDate(offer.createdAt)}</span>
                          </div>
                          {offer.message && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Message:</span> {offer.message}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Link href={`/listings/${offer.listingId}`}>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                              <Package className="h-4 w-4" />
                              <span>View Listing</span>
                            </Button>
                          </Link>
                          {offer.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                              <span>Withdraw</span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Offers Received */}
        {canUserPerformAction(currentUser, 'sell') && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                Offers Received
              </h2>
              <span className="text-sm text-gray-500">
                {receivedOffers.length} offer{receivedOffers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {receivedOffers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers received yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create listings to start receiving offers from buyers
                  </p>
                  <Link href="/seller/create-listing">
                    <Button>Create Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receivedOffers.map((offer) => {
                  const listing = listings.find(l => l.id === offer.listingId)
                  return (
                    <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{listing?.title || 'Unknown Listing'}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(offer.status)}`}>
                            {getStatusIcon(offer.status)}
                            <span>{offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}</span>
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Buyer Offer:</span>
                            <span className="font-semibold text-lg">R{offer.price}/ton</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Your Price:</span>
                            <span className="text-gray-500">R{listing?.price}/ton</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Quantity:</span>
                            <span>{offer.quantity} tons</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Value:</span>
                            <span className="font-semibold">R{offer.price * offer.quantity}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Received:</span>
                            <span className="text-sm">{formatDate(offer.createdAt)}</span>
                          </div>
                          {offer.message && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Buyer Message:</span> {offer.message}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Link href={`/listings/${offer.listingId}`}>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                              <Package className="h-4 w-4" />
                              <span>View Listing</span>
                            </Button>
                          </Link>
                          {offer.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* No Capabilities Message */}
        {!canUserPerformAction(currentUser, 'buy') && !canUserPerformAction(currentUser, 'sell') && (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offer capabilities</h3>
              <p className="text-gray-500 mb-4">
                You don't have permission to make or receive offers. Contact support to upgrade your account.
              </p>
              <Link href="/subscription">
                <Button>Upgrade Account</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
