'use client'

import { useStore } from '@/store/useStore'
import { canUserPerformAction } from '@/types'
import { Truck, Package, Route, Plus, Eye, MessageSquare, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'

export default function TransportPage() {
  const { currentUser, transportRequests, transportQuotes, backloadListings } = useStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access transport</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userTransportRequests = transportRequests.filter(t => t.requesterId === currentUser.id)
  const userTransportQuotes = transportQuotes.filter(t => t.transporterId === currentUser.id)
  const userBackloadListings = backloadListings.filter(t => t.transporterId === currentUser.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'quoted': return 'bg-red-100 text-red-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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
                <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
                <p className="text-gray-600 mt-2">
                  Manage transport requests, quotes, and backload listings
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
              <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
              <p className="text-gray-600 mt-2">
                Manage transport requests, quotes, and backload listings
              </p>
            </div>
            <div className="flex space-x-3">
              {canUserPerformAction(currentUser, 'transport') && (
                <>
                  <Link href="/dashboard/transport/create-request">
                    <Button variant="secondary" className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Create Transport Request</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/transport/create-backload">
                    <Button className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>List Empty Truck</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Transport Requests */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-2 text-green-600" />
              My Transport Requests
            </h2>
            <span className="text-sm text-gray-500">
              {userTransportRequests.length} request{userTransportRequests.length !== 1 ? 's' : ''}
            </span>
          </div>

          {userTransportRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transport requests yet</h3>
                <p className="text-gray-500 mb-4">
                  Create transport requests when you need to move goods
                </p>
                <Link href="/dashboard/transport/create-request">
                  <Button>Create Transport Request</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTransportRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Transport Request</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{request.pickupLocation}</p>
                          <p className="text-xs text-gray-500">Pickup</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{request.deliveryLocation}</p>
                          <p className="text-xs text-gray-500">Delivery</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span>{request.quantity} {request.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-sm">{formatDate(request.preferredDate)}</span>
                      </div>
                      {request.budget && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-semibold">R{request.budget}</span>
                        </div>
                      )}
                      {request.autoQuote && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-green-600 font-medium">Auto-Estimate:</p>
                          <p className="text-xs text-green-600">
                            Low: R{request.autoQuote.lowEstimate} | 
                            Medium: R{request.autoQuote.mediumEstimate} | 
                            High: R{request.autoQuote.highEstimate}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>View Quotes</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Backload Listings - Empty Truck Routes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-green-600" />
              Empty Truck Routes (Backloads)
            </h2>
            <span className="text-sm text-gray-500">
              {backloadListings.length} route{backloadListings.length !== 1 ? 's' : ''} available
            </span>
          </div>

          {backloadListings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No empty truck routes available</h3>
                <p className="text-gray-500 mb-4">
                  Transporters can list their empty truck routes here
                </p>
                {canUserPerformAction(currentUser, 'transport') && (
                  <Link href="/dashboard/transport/create-backload">
                    <Button>List Your Empty Truck</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backloadListings.map((backload) => (
                <Card key={backload.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{backload.route}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        backload.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {backload.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{backload.pickupLocation}</p>
                          <p className="text-xs text-gray-500">From</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{backload.deliveryLocation}</p>
                          <p className="text-xs text-gray-500">To</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span>{backload.capacity} {backload.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold">R{backload.pricePerKm}/km</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-lg">R{backload.totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Available:</span>
                        <span className="text-sm">{formatDate(backload.availableDate)}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Vehicle:</p>
                        <p className="text-xs text-gray-600">
                          {backload.vehicleDetails.type} • {backload.vehicleDetails.capacity} tons
                          {backload.vehicleDetails.refrigeration && ' • Refrigerated'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Contact Transporter</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Transport Quotes Given */}
        {canUserPerformAction(currentUser, 'transport') && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Route className="h-6 w-6 mr-2 text-purple-600" />
                My Transport Quotes
              </h2>
              <span className="text-sm text-gray-500">
                {userTransportQuotes.length} quote{userTransportQuotes.length !== 1 ? 's' : ''}
              </span>
            </div>

            {userTransportQuotes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transport quotes yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start quoting on transport requests to grow your business
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTransportQuotes.map((quote) => (
                  <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Transport Quote</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quote.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : quote.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-lg">R{quote.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Days:</span>
                          <span>{quote.estimatedDays} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span>{quote.vehicleType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span>{quote.insurance}</span>
                        </div>
                        {quote.message && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Message:</span> {quote.message}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>View Request</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Contact Buyer</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
