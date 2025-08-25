'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Calendar, 
  DollarSign,
  Clock,
  User,
  Star,
  Search,
  Filter,
  Eye,
  Truck,
  MessageSquare
} from 'lucide-react'
import { mockTransportRequests, mockTransportQuotes } from '@/lib/mockData'
import { TransportRequest, TransportQuote } from '@/types'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

export default function AvailableTransportRequestsPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useStore()
  const [availableRequests, setAvailableRequests] = useState<TransportRequest[]>([])
  const [myQuotes, setMyQuotes] = useState<TransportQuote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterProduct, setFilterProduct] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }

    if (currentUser.role !== 'transporter') {
      toast.error('Only transporters can access this page')
      router.push('/transport')
      return
    }

    // Get available transport requests (open status)
    const openRequests = mockTransportRequests.filter(r => r.status === 'open')
    setAvailableRequests(openRequests)

    // Get my quotes
    const transporterQuotes = mockTransportQuotes.filter(q => q.transporterId === currentUser.id)
    setMyQuotes(transporterQuotes)

    setLoading(false)
  }, [currentUser, isAuthenticated, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open for Quotes'
      case 'quoted': return 'Quotes Received'
      case 'accepted': return 'Transport Arranged'
      case 'in_progress': return 'In Transit'
      case 'completed': return 'Delivered'
      default: return status
    }
  }

  const hasQuotedOnRequest = (requestId: string) => {
    return myQuotes.some(q => q.transportRequestId === requestId)
  }

  const getMyQuoteForRequest = (requestId: string) => {
    return myQuotes.find(q => q.transportRequestId === requestId)
  }

  const filteredRequests = availableRequests.filter(request => {
    const matchesSearch = 
      request.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.productType?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = filterLocation === 'all' || 
      request.pickupLocation.toLowerCase().includes(filterLocation.toLowerCase()) ||
      request.deliveryLocation.toLowerCase().includes(filterLocation.toLowerCase())
    
    const matchesProduct = filterProduct === 'all' || 
      request.productType?.toLowerCase().includes(filterProduct.toLowerCase())
    
    return matchesSearch && matchesLocation && matchesProduct
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available transport requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push('/transport')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Transport
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Available Transport Requests</h1>
          <p className="text-gray-600 mt-2">Find transport opportunities that match your routes and capabilities</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, product type, or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
              />
            </div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="all">All Locations</option>
              <option value="Free State">Free State</option>
              <option value="Gauteng">Gauteng</option>
              <option value="Western Cape">Western Cape</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Mpumalanga">Mpumalanga</option>
            </select>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="all">All Products</option>
              <option value="Maize">Maize</option>
              <option value="Wheat">Wheat</option>
              <option value="Soybean">Soybean</option>
              <option value="Feed">Feed</option>
              <option value="Fertilizer">Fertilizer</option>
            </select>
          </div>
        </div>

        {/* Transport Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request) => {
            const hasQuoted = hasQuotedOnRequest(request.id)
            const myQuote = getMyQuoteForRequest(request.id)
            
            return (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </div>
                      {request.urgent && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Route</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-gray-500">From:</span> {request.pickupLocation}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">To:</span> {request.deliveryLocation}
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">Product</span>
                    </div>
                    <div className="text-sm">
                      {request.quantity} {request.unit}
                      {request.productType && (
                        <span className="text-gray-500 ml-2">• {request.productType}</span>
                      )}
                    </div>
                  </div>

                  {/* Timeline & Budget */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(request.preferredDate)}</span>
                    </div>
                    {request.budget && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>R{request.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Requester */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={request.requester.avatar}
                        alt={request.requester.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium">{request.requester.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>4.8</span>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  {request.specialRequirements && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-xs text-yellow-800 font-medium mb-1">Special Requirements:</div>
                      <div className="text-xs text-yellow-700">{request.specialRequirements}</div>
                    </div>
                  )}

                  {/* Quote Status */}
                  {hasQuoted && myQuote && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-800 font-medium mb-1">Your Quote:</div>
                      <div className="text-xs text-blue-700">
                        R{myQuote.price.toLocaleString()} • {myQuote.estimatedDays} days • {myQuote.status}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1" 
                      size="sm"
                      onClick={() => router.push(`/transport/${request.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {!hasQuoted ? (
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => router.push(`/transport/${request.id}`)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Submit Quote
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        className="flex-1" 
                        size="sm"
                        onClick={() => router.push(`/transport/${request.id}`)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Update Quote
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transport requests found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterLocation !== 'all' || filterProduct !== 'all'
                ? 'Try adjusting your search or filters'
                : 'There are no open transport requests at the moment'
              }
            </p>
            <Button onClick={() => router.push('/transport')}>
              Back to Transport
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
