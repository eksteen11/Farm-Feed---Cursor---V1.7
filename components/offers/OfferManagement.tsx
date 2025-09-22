'use client'

import { useState } from 'react'
import { 
  Package, 
  DollarSign, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Clock,
  AlertCircle,
  Truck,
  User
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import OfferMessaging from '@/components/messaging/OfferMessaging'
import { useStore } from '@/store/useStore'
import { Offer, Listing, User as UserType } from '@/types'
import { formatDate } from '@/lib/utils'
import { sendOfferNotification } from '@/lib/emailService'

interface OfferManagementProps {
  offers: Offer[]
  listings: Listing[]
  currentUser: UserType
}

export default function OfferManagement({ offers, listings, currentUser }: OfferManagementProps) {
  const { updateOffer, createDeal, users } = useStore()
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [isMessagingOpen, setIsMessagingOpen] = useState(false)
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'counter' | null>(null)
  const [counterOfferData, setCounterOfferData] = useState({
    price: 0,
    message: ''
  })

  const getListingById = (listingId: string) => {
    return listings.find(listing => listing.id === listingId)
  }

  const getBuyerById = (buyerId: string) => {
    return users.find(user => user.id === buyerId) || { 
      id: buyerId, 
      name: 'Buyer Name', 
      company: 'Buyer Company',
      email: 'buyer@example.com'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'counter-offered': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'counter-offered': return <RotateCcw className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleAction = (offer: Offer, type: 'accept' | 'reject' | 'counter') => {
    setSelectedOffer(offer)
    setActionType(type)
    if (type === 'counter') {
      setCounterOfferData({
        price: offer.price,
        message: ''
      })
    }
    setIsActionModalOpen(true)
  }

  const handleAcceptOffer = async () => {
    if (!selectedOffer) return

    try {
      // Update offer status
      const updatedOffer: Offer = {
        ...selectedOffer,
        status: 'accepted',
        updatedAt: new Date()
      }
      
      updateOffer(updatedOffer.id, updatedOffer)

      // Send email notification to buyer
      const buyer = getBuyerById(selectedOffer.buyerId)
      const listing = getListingById(selectedOffer.listingId)
      
      try {
        await sendOfferNotification('offer-accepted', {
          buyerEmail: buyer.email,
          buyerName: buyer.name,
          sellerName: currentUser.name,
          sellerCompany: currentUser.company || 'Individual',
          listingTitle: listing?.title || 'Product',
          offerPrice: selectedOffer.price,
          offerQuantity: selectedOffer.quantity,
          deliveryType: selectedOffer.deliveryType,
          dealLink: `${window.location.origin}/dashboard/deals?deal=${selectedOffer.id}`
        })
      } catch (error) {
        console.error('Failed to send email notification:', error)
      }

      // Create a deal
      if (listing) {
        const deal = {
          offerId: selectedOffer.id,
          listingId: selectedOffer.listingId,
          buyerId: selectedOffer.buyerId,
          sellerId: selectedOffer.sellerId,
          finalPrice: selectedOffer.price,
          quantity: selectedOffer.quantity,
          deliveryType: selectedOffer.deliveryType,
          deliveryAddress: selectedOffer.deliveryAddress,
          status: 'pending' as const,
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          paymentStatus: 'pending' as const,
          platformFee: selectedOffer.quantity, // R1 per ton
          totalAmount: (selectedOffer.price * selectedOffer.quantity) + selectedOffer.quantity,
          terms: selectedOffer.terms || 'Standard terms apply'
        }
        
        createDeal(deal)
      }

      setIsActionModalOpen(false)
      setSelectedOffer(null)
      setActionType(null)
    } catch (error) {
      console.error('Error accepting offer:', error)
    }
  }

  const handleRejectOffer = async () => {
    if (!selectedOffer) return

    try {
      const updatedOffer: Offer = {
        ...selectedOffer,
        status: 'rejected',
        updatedAt: new Date()
      }
      
      updateOffer(updatedOffer.id, updatedOffer)
      setIsActionModalOpen(false)
      setSelectedOffer(null)
      setActionType(null)
    } catch (error) {
      console.error('Error rejecting offer:', error)
    }
  }

  const handleCounterOffer = async () => {
    if (!selectedOffer || !counterOfferData.message.trim()) return

    try {
      const updatedOffer: Offer = {
        ...selectedOffer,
        status: 'counter-offered',
        counterOffer: {
          price: counterOfferData.price,
          message: counterOfferData.message,
          createdAt: new Date()
        },
        updatedAt: new Date()
      }
      
      updateOffer(updatedOffer.id, updatedOffer)
      
      // Send email notification to buyer
      const buyer = getBuyerById(selectedOffer.buyerId)
      const listing = getListingById(selectedOffer.listingId)
      
      try {
        await sendOfferNotification('offer-countered', {
          buyerEmail: buyer.email,
          buyerName: buyer.name,
          sellerName: currentUser.name,
          sellerCompany: currentUser.company || 'Individual',
          listingTitle: listing?.title || 'Product',
          originalPrice: selectedOffer.price,
          counterPrice: counterOfferData.price,
          offerQuantity: selectedOffer.quantity,
          counterMessage: counterOfferData.message,
          offerLink: `${window.location.origin}/dashboard/offers?offer=${selectedOffer.id}`
        })
      } catch (error) {
        console.error('Failed to send email notification:', error)
      }
      
      setIsActionModalOpen(false)
      setSelectedOffer(null)
      setActionType(null)
      setCounterOfferData({ price: 0, message: '' })
    } catch (error) {
      console.error('Error creating counter offer:', error)
    }
  }

  const isOfferExpired = (offer: Offer) => {
    return new Date() > offer.expiresAt
  }

  const filteredOffers = offers.filter(offer => 
    offer.sellerId === currentUser.id && 
    offer.status !== 'expired' &&
    !isOfferExpired(offer)
  )

  if (filteredOffers.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
        <p className="text-gray-500">When buyers make offers on your listings, they'll appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Incoming Offers</h2>
        <Badge variant="secondary" className="text-sm">
          {filteredOffers.length} active offers
        </Badge>
      </div>

      <div className="grid gap-6">
        {filteredOffers.map((offer) => {
          const listing = getListingById(offer.listingId)
          const buyer = getBuyerById(offer.buyerId)
          
          if (!listing) return null

          return (
            <div key={offer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{listing.title}</h3>
                    <p className="text-sm text-gray-500">
                      Offer from {buyer.company || buyer.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(offer.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(offer.status)}
                      <span className="capitalize">{offer.status.replace('-', ' ')}</span>
                    </div>
                  </Badge>
                  {isOfferExpired(offer) && (
                    <Badge variant="secondary">Expired</Badge>
                  )}
                </div>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Offer Price</p>
                    <p className="font-medium text-gray-900">
                      R{offer.price.toLocaleString()}/ton
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-900">
                      {offer.quantity} tons
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {offer.deliveryType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {offer.deliveryAddress && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="text-sm text-gray-900">{offer.deliveryAddress}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Expires</p>
                    <p className="text-sm text-gray-900">{formatDate(offer.expiresAt)}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {offer.message && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Buyer's Message</p>
                      <p className="text-sm text-gray-900">{offer.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              {offer.terms && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Payment Terms</p>
                  <p className="text-sm text-gray-900">{offer.terms}</p>
                </div>
              )}

              {/* Counter Offer Display */}
              {offer.counterOffer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <RotateCcw className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Your Counter Offer</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700">Price: R{offer.counterOffer.price.toLocaleString()}/ton</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Message: {offer.counterOffer.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {offer.status === 'pending' && (
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    variant="primary"
                    onClick={() => handleAction(offer, 'accept')}
                    className="flex-1 min-w-[120px]"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Offer
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => handleAction(offer, 'counter')}
                    className="flex-1 min-w-[120px]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Counter Offer
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedOffer(offer)
                      setIsMessagingOpen(true)
                    }}
                    className="flex-1 min-w-[120px]"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Buyer
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => handleAction(offer, 'reject')}
                    className="flex-1 min-w-[120px]"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {/* Status-specific actions */}
              {offer.status === 'counter-offered' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">
                    Waiting for buyer response to your counter offer
                  </p>
                </div>
              )}

              {offer.status === 'accepted' && (
                <div className="pt-4 border-t">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">Offer Accepted!</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Deal has been created. Proceed with fulfillment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Action Modal */}
      {isActionModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {actionType === 'accept' && 'Accept Offer'}
                {actionType === 'reject' && 'Reject Offer'}
                {actionType === 'counter' && 'Make Counter Offer'}
              </h3>

              {actionType === 'accept' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Are you sure you want to accept this offer? This will create a confirmed deal.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Total Value:</strong> R{(selectedOffer.price * selectedOffer.quantity).toLocaleString()}
                    </p>
                    <p className="text-green-800 text-sm">
                      <strong>Platform Fee:</strong> R{selectedOffer.quantity}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsActionModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAcceptOffer}
                      className="flex-1"
                    >
                      Accept & Create Deal
                    </Button>
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Are you sure you want to reject this offer? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsActionModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleRejectOffer}
                      className="flex-1"
                    >
                      Reject Offer
                    </Button>
                  </div>
                </div>
              )}

              {actionType === 'counter' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counter Offer Price (R/ton)
                    </label>
                    <input
                      type="number"
                      value={counterOfferData.price}
                      onChange={(e) => setCounterOfferData(prev => ({ 
                        ...prev, 
                        price: parseFloat(e.target.value) 
                      }))}
                      min={0}
                      step={50}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your counter offer price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message to Buyer
                    </label>
                    <textarea
                      value={counterOfferData.message}
                      onChange={(e) => setCounterOfferData(prev => ({ 
                        ...prev, 
                        message: e.target.value 
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Explain your counter offer and any conditions"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsActionModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCounterOffer}
                      className="flex-1"
                      disabled={!counterOfferData.message.trim()}
                    >
                      Send Counter Offer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offer Messaging Modal */}
      {selectedOffer && (
        <OfferMessaging
          offer={selectedOffer}
          currentUser={currentUser}
          otherUser={getBuyerById(selectedOffer.buyerId)}
          isOpen={isMessagingOpen}
          onClose={() => {
            setIsMessagingOpen(false)
            setSelectedOffer(null)
          }}
        />
      )}
    </div>
  )
}
