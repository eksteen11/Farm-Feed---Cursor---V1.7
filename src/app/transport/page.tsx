'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  Truck, 
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
  Eye
} from 'lucide-react'
import { mockTransportRequests, mockUsers } from '@/lib/mockData'
import { TransportRequest } from '@/types'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import TransportDashboard from '@/components/transport/TransportDashboard'
import TransportAnalytics from '@/components/transport/TransportAnalytics'
import { formatDate } from '@/lib/utils'
import ClientOnly from '@/components/ui/ClientOnly'

export default function TransportPage() {
  const { currentUser, isAuthenticated } = useStore()
  const router = useRouter()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null)
  const [transportRequests, setTransportRequests] = useState(mockTransportRequests)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [requestForm, setRequestForm] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    productType: '',
    quantity: '',
    unit: 'ton',
    preferredDate: '',
    budget: '',
    specialRequirements: '',
    contactPhone: '',
    urgent: false
  })

  const [quoteForm, setQuoteForm] = useState({
    price: '',
    estimatedDays: '',
    vehicleType: '',
    insurance: 'Basic Coverage',
    message: '',
    availableDate: ''
  })

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please log in to create transport requests')
      return
    }

    if (!currentUser) {
      toast.error('User not found')
      return
    }

    // Validate required fields
    if (!requestForm.pickupLocation || !requestForm.deliveryLocation || !requestForm.quantity) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create new transport request
    const newRequest: TransportRequest = {
      id: `req_${typeof window === 'undefined' ? 'placeholder' : Date.now()}`,
      dealId: undefined, // Will be linked when deal is confirmed
      requesterId: currentUser.id,
      requester: currentUser,
      pickupLocation: requestForm.pickupLocation,
      deliveryLocation: requestForm.deliveryLocation,
      quantity: parseFloat(requestForm.quantity),
      unit: requestForm.unit,
      preferredDate: new Date(requestForm.preferredDate),
      budget: requestForm.budget ? parseFloat(requestForm.budget) : undefined,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      productType: requestForm.productType,
      specialRequirements: requestForm.specialRequirements,
      contactPhone: requestForm.contactPhone,
      urgent: requestForm.urgent,
      platformFee: 300
    }

    // Add to local state (in real app, this would go to backend)
    setTransportRequests(prev => [newRequest, ...prev])
    
    // Reset form
    setRequestForm({
      pickupLocation: '',
      deliveryLocation: '',
      productType: '',
      quantity: '',
      unit: 'ton',
      preferredDate: '',
      budget: '',
      specialRequirements: '',
      contactPhone: '',
      urgent: false
    })
    
    setShowRequestForm(false)
    toast.success('Transport request created successfully!')
  }

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please log in to submit quotes')
      return
    }

    if (!currentUser) {
      toast.error('User not found')
      return
    }

    if (currentUser.role !== 'transporter') {
      toast.error('Only transporters can submit quotes')
      return
    }

    if (!selectedRequest) {
      toast.error('No transport request selected')
      return
    }

    // Validate required fields
    if (!quoteForm.price || !quoteForm.estimatedDays || !quoteForm.vehicleType) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create new transport quote
    const newQuote = {
      id: `quote_${typeof window === 'undefined' ? 'placeholder' : Date.now()}`,
      transportRequestId: selectedRequest.id,
      transportRequest: selectedRequest,
      transporterId: currentUser.id,
      transporter: currentUser,
      price: parseFloat(quoteForm.price),
      estimatedDays: parseInt(quoteForm.estimatedDays),
      message: quoteForm.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      vehicleType: quoteForm.vehicleType,
      insurance: quoteForm.insurance,
      availableDate: quoteForm.availableDate ? new Date(quoteForm.availableDate) : undefined
    }

    // In real app, this would go to backend
    // For now, we'll update the transport request status
    setTransportRequests(prev => 
      prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'quoted' as const }
          : req
      )
    )
    
    // Reset form
    setQuoteForm({
      price: '',
      estimatedDays: '',
      vehicleType: '',
      insurance: 'Basic Coverage',
      message: '',
      availableDate: ''
    })
    
    setShowQuoteForm(false)
    setSelectedRequest(null)
    toast.success('Quote submitted successfully!')
  }

  const filteredRequests = transportRequests.filter(request => {
    const matchesSearch = 
      request.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.productType?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

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

  const openQuoteForm = (request: TransportRequest) => {
    setSelectedRequest(request)
    setShowQuoteForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transport Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with reliable transporters for your agricultural products across South Africa
          </p>
          
          {/* Role-based Navigation */}
          {isAuthenticated && currentUser && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {currentUser.role === 'transporter' ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="md"
                    onClick={() => router.push('/transport/available')}
                    leftIcon={<Truck className="w-4 h-4" />}
                  >
                    Available Requests
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="md"
                    onClick={() => router.push('/transport/my-requests')}
                    leftIcon={<Package className="w-4 h-4" />}
                  >
                    My Quotes
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="md"
                  onClick={() => router.push('/transport/my-requests')}
                  leftIcon={<Package className="w-4 h-4" />}
                >
                  My Transport Requests
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={() => setShowRequestForm(true)}
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Create Transport Request
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            leftIcon={<Truck className="w-5 h-5" />}
            onClick={() => router.push('/transport/my-requests')}
          >
            View My Requests
          </Button>
          {currentUser?.role === 'transporter' && (
            <Button 
              variant="ghost" 
              size="lg"
              leftIcon={<Truck className="w-5 h-5" />}
              onClick={() => router.push('/transport/available')}
            >
              Available Requests
            </Button>
          )}
        </div>

        {/* Transport Dashboard */}
        <ClientOnly>
          <TransportDashboard userId={currentUser?.id} userRole={currentUser?.role} />
        </ClientOnly>

        {/* Transport Analytics */}
        <ClientOnly>
          <TransportAnalytics />
        </ClientOnly>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by location, product type, or route..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
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
          {filteredRequests.map((request) => (
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
                  {request.status === 'open' && currentUser?.role === 'transporter' && (
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => router.push(`/transport/${request.id}`)}
                    >
                      Submit Quote
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transport requests found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a transport request!'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowRequestForm(true)}>
                Create First Request
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Transport Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Create Transport Request</h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                {/* Route Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location *
                    </label>
                    <Input
                      type="text"
                      value={requestForm.pickupLocation}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, pickupLocation: e.target.value }))}
                      placeholder="e.g., Free State Farm, Bloemfontein"
                      leftIcon={<MapPin className="w-5 h-5" />}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location *
                    </label>
                    <Input
                      type="text"
                      value={requestForm.deliveryLocation}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                      placeholder="e.g., Johannesburg Warehouse"
                      leftIcon={<MapPin className="w-5 h-5" />}
                      required
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type
                    </label>
                    <Input
                      type="text"
                      value={requestForm.productType}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, productType: e.target.value }))}
                      placeholder="e.g., Maize, Wheat, Feed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      value={requestForm.quantity}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={requestForm.unit}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="ton">Ton</option>
                      <option value="kg">Kilogram</option>
                      <option value="bag">Bag</option>
                      <option value="pallet">Pallet</option>
                      <option value="container">Container</option>
                    </select>
                  </div>
                </div>

                {/* Timeline & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <Input
                      type="date"
                      value={requestForm.preferredDate}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (ZAR)
                    </label>
                    <Input
                      type="number"
                      value={requestForm.budget}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="15000"
                      leftIcon={<DollarSign className="w-5 h-5" />}
                    />
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={requestForm.specialRequirements}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    placeholder="e.g., Refrigeration needed, fragile handling, specific delivery time..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 resize-none"
                    rows={3}
                  />
                </div>

                {/* Contact & Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <Input
                      type="tel"
                      value={requestForm.contactPhone}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+27 82 123 4567"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={requestForm.urgent}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, urgent: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
                      Mark as Urgent
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quote Submission Modal */}
      {showQuoteForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Submit Transport Quote</h3>
                <button
                  onClick={() => {
                    setShowQuoteForm(false)
                    setSelectedRequest(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Request Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Transport Request Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><span className="font-medium">Route:</span> {selectedRequest.pickupLocation} → {selectedRequest.deliveryLocation}</div>
                  <div><span className="font-medium">Quantity:</span> {selectedRequest.quantity} {selectedRequest.unit}</div>
                  <div><span className="font-medium">Preferred Date:</span> {formatDate(selectedRequest.preferredDate)}</div>
                  {selectedRequest.budget && <div><span className="font-medium">Budget:</span> R{selectedRequest.budget.toLocaleString()}</div>}
                </div>
              </div>
              
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                {/* Pricing & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Price (ZAR) *
                    </label>
                    <Input
                      type="number"
                      value={quoteForm.price}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="12000"
                      leftIcon={<DollarSign className="w-5 h-5" />}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Days *
                    </label>
                    <Input
                      type="number"
                      value={quoteForm.estimatedDays}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, estimatedDays: e.target.value }))}
                      placeholder="3"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Vehicle & Insurance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      value={quoteForm.vehicleType}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, vehicleType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Flatbed Truck">Flatbed Truck</option>
                      <option value="Refrigerated Truck">Refrigerated Truck</option>
                      <option value="Container Truck">Container Truck</option>
                      <option value="Tipper Truck">Tipper Truck</option>
                      <option value="Trailer">Trailer</option>
                      <option value="Pickup Truck">Pickup Truck</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Coverage
                    </label>
                    <select
                      value={quoteForm.insurance}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, insurance: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="Basic Coverage">Basic Coverage</option>
                      <option value="Full Coverage">Full Coverage</option>
                      <option value="Premium Coverage">Premium Coverage</option>
                      <option value="Specialty Coverage">Specialty Coverage</option>
                    </select>
                  </div>
                </div>

                {/* Availability & Message */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Date
                    </label>
                    <Input
                      type="date"
                      value={quoteForm.availableDate}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, availableDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message to Requester
                    </label>
                    <textarea
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell the requester about your service, experience, or any special considerations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowQuoteForm(false)
                      setSelectedRequest(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Quote
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
