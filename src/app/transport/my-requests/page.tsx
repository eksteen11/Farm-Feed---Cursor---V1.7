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
  Plus,
  Search,
  Filter,
  Eye,
  Truck
} from 'lucide-react'
import { mockTransportRequests, mockTransportQuotes } from '@/lib/mockData'
import { TransportRequest, TransportQuote } from '@/types'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

export default function MyTransportRequestsPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useStore()
  const [myRequests, setMyRequests] = useState<TransportRequest[]>([])
  const [quotes, setQuotes] = useState<TransportQuote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }

    // Get user's transport requests
    const userRequests = mockTransportRequests.filter(r => r.requesterId === currentUser.id)
    setMyRequests(userRequests)

    // Get quotes for user's requests
    const userRequestIds = userRequests.map(r => r.id)
    const userQuotes = mockTransportQuotes.filter(q => userRequestIds.includes(q.transportRequestId))
    setQuotes(userQuotes)

    setLoading(false)
  }, [currentUser, isAuthenticated, router])

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

  const getQuotesForRequest = (requestId: string) => {
    return quotes.filter(q => q.transportRequestId === requestId)
  }

  const acceptQuote = (quoteId: string, requestId: string) => {
    // Update quote status
    setQuotes(prev => 
      prev.map(q => 
        q.id === quoteId 
          ? { ...q, status: 'accepted' as const }
          : q.transportRequestId === requestId 
            ? { ...q, status: 'rejected' as const }
            : q
      )
    )
    
    // Update request status
    setMyRequests(prev => 
      prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'accepted' as const }
          : r
      )
    )
    
    toast.success('Quote accepted! Transport is now arranged.')
  }

  const filteredRequests = myRequests.filter(request => {
    const matchesSearch = 
      request.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.productType?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your transport requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => router.push('/transport')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Transport
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">My Transport Requests</h1>
            <p className="text-gray-600 mt-2">Manage and track your transport requests</p>
          </div>
          <Button onClick={() => router.push('/transport')} leftIcon={<Plus className="w-4 h-4" />}>
            New Request
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="all">All Status</option>
                <option value="open">Open for Quotes</option>
                <option value="quoted">Quotes Received</option>
                <option value="accepted">Transport Arranged</option>
                <option value="in_progress">In Transit</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transport Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request) => {
            const requestQuotes = getQuotesForRequest(request.id)
            const pendingQuotes = requestQuotes.filter(q => q.status === 'pending')
            const acceptedQuote = requestQuotes.find(q => q.status === 'accepted')
            
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

                  {/* Quotes Summary */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Quotes:</span>
                      <span className="font-medium">{requestQuotes.length}</span>
                    </div>
                    {pendingQuotes.length > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        {pendingQuotes.length} pending review
                      </div>
                    )}
                    {acceptedQuote && (
                      <div className="text-xs text-green-600 mt-1">
                        Quote accepted: R{acceptedQuote.price.toLocaleString()}
                      </div>
                    )}
                  </div>

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
                    {request.status === 'open' && pendingQuotes.length > 0 && (
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => router.push(`/transport/${request.id}`)}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Review Quotes
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
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t created any transport requests yet'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => router.push('/transport')}>
                Create Your First Request
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
