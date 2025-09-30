'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Calendar, 
  MapPin, 
  User, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Eye,
  Reply
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import Badge from '@/shared/ui/Badge'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { SupabaseDatabaseService } from '@/shared/api/supabase'
import { supabase } from '@/shared/api/supabase'
import { realEmailService } from '@/features/messaging/services/realEmailService'
import { formatDate } from '@/shared/utils/utils'
import toast from 'react-hot-toast'

interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  price: number
  quantity: number
  delivery_type: string
  delivery_address?: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'counter-offered' | 'expired'
  is_negotiable: boolean
  terms?: string
  created_at: string
  updated_at: string
  expires_at: string
  listing_title?: string
  listing_price?: number
  listing_location?: string
  listing_images?: string[]
  buyer_name?: string
  buyer_company?: string
  buyer_email?: string
}

interface SellerOfferDashboardProps {
  currentUser: any
}

export default function SellerOfferDashboard({ currentUser }: SellerOfferDashboardProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseType, setResponseType] = useState<'accept' | 'reject' | 'counter'>('accept')
  const [counterPrice, setCounterPrice] = useState(0)
  const [responseMessage, setResponseMessage] = useState('')

  // Load offers on component mount
  useEffect(() => {
    loadOffers()
  }, [])

  // Filter offers when search term or status filter changes
  useEffect(() => {
    filterOffers()
  }, [offers, searchTerm, statusFilter])

  const loadOffers = async () => {
    try {
      setIsLoading(true)
      console.log('📋 Loading offers for seller:', currentUser.id)
      
      // Get offers where current user is the seller
      const { data, error } = await supabase
        .from('offers_with_details')
        .select('*')
        .eq('seller_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error loading offers:', error)
        throw error
      }

      console.log('✅ Loaded offers:', data)
      setOffers(data || [])
    } catch (error) {
      console.error('❌ Error loading offers:', error)
      toast.error('Failed to load offers')
    } finally {
      setIsLoading(false)
    }
  }

  const filterOffers = () => {
    let filtered = offers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.listing_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(offer => offer.status === statusFilter)
    }

    setFilteredOffers(filtered)
  }

  const handleOfferResponse = (offer: Offer, type: 'accept' | 'reject' | 'counter') => {
    setSelectedOffer(offer)
    setResponseType(type)
    setCounterPrice(offer.price)
    setResponseMessage('')
    setShowResponseModal(true)
  }

  const submitOfferResponse = async () => {
    if (!selectedOffer) return

    try {
      console.log('🔄 Submitting offer response:', responseType)

      let newStatus: string = responseType
      let updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Handle counter offer
      if (responseType === 'counter') {
        updateData.counter_offer_data = {
          price: counterPrice,
          message: responseMessage,
          created_at: new Date().toISOString()
        }
        newStatus = 'counter-offered'
        updateData.status = newStatus
      }

      // Update offer in database
      const { data: updatedOffer, error } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', selectedOffer.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating offer:', error)
        throw error
      }

      console.log('✅ Offer updated successfully:', updatedOffer)

      // Send email notification to buyer
      try {
        if (responseType === 'accept') {
          await realEmailService.sendOfferAcceptedEmail(
            selectedOffer.buyer_email!,
            selectedOffer.buyer_name!,
            currentUser.name,
            currentUser.company || 'Individual',
            selectedOffer.listing_title!,
            selectedOffer.price,
            selectedOffer.quantity,
            selectedOffer.delivery_type,
            `${window.location.origin}/dashboard/offers?offer=${selectedOffer.id}`
          )
        }
        // TODO: Add other email types (rejected, counter)
      } catch (error) {
        console.error('❌ Failed to send email notification:', error)
      }

      // Show success message
      toast.success(`Offer ${responseType}ed successfully!`)
      
      // Reload offers
      await loadOffers()
      
      // Close modal
      setShowResponseModal(false)
      setSelectedOffer(null)

    } catch (error) {
      console.error('❌ Error responding to offer:', error)
      toast.error('Failed to respond to offer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'counter-offered': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'counter-offered': return <Reply className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTotalValue = (price: number, quantity: number) => {
    return (price * quantity).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Offers</h1>
          <p className="text-gray-600">Manage offers on your listings</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredOffers.length} of {offers.length} offers
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(o => o.status === 'accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Reply className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Negotiating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(o => o.status === 'counter-offered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(o => o.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="counter-offered">Negotiating</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600">
                {offers.length === 0 
                  ? "You haven't received any offers yet. Create listings to start receiving offers!"
                  : "No offers match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {offer.listing_title}
                      </h3>
                      <Badge className={getStatusColor(offer.status)}>
                        {getStatusIcon(offer.status)}
                        <span className="ml-1 capitalize">{offer.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{offer.buyer_name} ({offer.buyer_company})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>R{offer.price.toLocaleString()}/ton</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="w-4 h-4 mr-2" />
                        <span>{offer.quantity} tons</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(new Date(offer.created_at))}</span>
                      </div>
                    </div>

                    {offer.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Message:</strong> {offer.message}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total Value: </span>
                        <span className="text-green-600 font-semibold">
                          R{getTotalValue(offer.price, offer.quantity)}
                        </span>
                      </div>
                      
                      {offer.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOfferResponse(offer, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOfferResponse(offer, 'counter')}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Counter
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleOfferResponse(offer, 'accept')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {responseType === 'accept' && 'Accept Offer'}
                {responseType === 'reject' && 'Reject Offer'}
                {responseType === 'counter' && 'Make Counter Offer'}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Offer Details</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Product:</strong> {selectedOffer.listing_title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Buyer:</strong> {selectedOffer.buyer_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Price:</strong> R{selectedOffer.price.toLocaleString()}/ton
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Quantity:</strong> {selectedOffer.quantity} tons
                  </p>
                </div>

                {responseType === 'counter' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counter Price (R/ton)
                    </label>
                    <Input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(parseFloat(e.target.value))}
                      min={0}
                      step={50}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add a message to the buyer..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowResponseModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitOfferResponse}
                  className="flex-1"
                >
                  {responseType === 'accept' && 'Accept Offer'}
                  {responseType === 'reject' && 'Reject Offer'}
                  {responseType === 'counter' && 'Send Counter Offer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
