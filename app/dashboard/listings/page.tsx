'use client'

import { useStore } from '@/store/useStore'
import { canUserPerformAction } from '@/types'
import { Package, Truck, Plus, Eye, Edit, Trash2, MapPin, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'

export default function ListingsPage() {
  const { currentUser, listings, transportRequests } = useStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your listings</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userListings = listings.filter(l => l.sellerId === currentUser.id)
  const userTransportRequests = transportRequests.filter(t => t.requesterId === currentUser.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
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
                <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                <p className="text-gray-600 mt-2">
                  Manage your product and transport listings
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
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="text-gray-600 mt-2">
                Manage your product and transport listings
              </p>
            </div>
            <div className="flex space-x-3">
              {canUserPerformAction(currentUser, 'sell') && (
                <Link href="/seller/create-listing">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Product Listing</span>
                  </Button>
                </Link>
              )}
              {canUserPerformAction(currentUser, 'transport') && (
                <Link href="/dashboard/transport/create">
                  <Button variant="secondary" className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Create Transport Listing</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Listings */}
        {canUserPerformAction(currentUser, 'sell') && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Package className="h-6 w-6 mr-2 text-blue-600" />
                Product Listings
              </h2>
              <span className="text-sm text-gray-500">
                {userListings.length} listing{userListings.length !== 1 ? 's' : ''}
              </span>
            </div>

            {userListings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No product listings yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start selling by creating your first product listing
                  </p>
                  <Link href="/seller/create-listing">
                    <Button>Create Your First Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          listing.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold">R{listing.price}/ton</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span>{listing.availableQuantity} tons</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span>{listing.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="text-sm">{formatDate(listing.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Link href={`/listings/${listing.id}`}>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transport Listings */}
        {canUserPerformAction(currentUser, 'transport') && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Truck className="h-6 w-6 mr-2 text-green-600" />
                Transport Listings
              </h2>
              <span className="text-sm text-gray-500">
                {userTransportRequests.length} listing{userTransportRequests.length !== 1 ? 's' : ''}
              </span>
            </div>

            {userTransportRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transport listings yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start offering transport services by creating your first transport listing
                  </p>
                  <Link href="/dashboard/transport/create">
                    <Button>Create Transport Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTransportRequests.map((transport) => (
                  <Card key={transport.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Transport Request</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transport.status === 'open' 
                            ? 'bg-blue-100 text-blue-800' 
                            : transport.status === 'quoted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {transport.status.replace('_', ' ')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">From:</span>
                          <span>{transport.pickupLocation}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">To:</span>
                          <span>{transport.deliveryLocation}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span>{transport.quantity} {transport.unit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-sm">{formatDate(transport.preferredDate)}</span>
                        </div>
                        {transport.budget && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-semibold">R{transport.budget}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Capabilities Message */}
        {!canUserPerformAction(currentUser, 'sell') && !canUserPerformAction(currentUser, 'transport') && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listing capabilities</h3>
              <p className="text-gray-500 mb-4">
                You don't have permission to create listings. Contact support to upgrade your account.
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
