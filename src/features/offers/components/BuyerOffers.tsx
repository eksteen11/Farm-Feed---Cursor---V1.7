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
  Eye
} from 'lucide-react'
import Button from '@/shared/ui/Button'
import Badge from '@/shared/ui/Badge'
import OfferMessaging from '@/features/messaging/components/OfferMessaging'
import { useStore } from '@/store/useStore'
import { Offer, Listing, User as UserType } from '@/types'
import { formatDate } from '@/shared/utils'
import { mockUsers } from '@/share@/shared/utils/mockData'

interface BuyerOffersProps {
  offers: Offer[]
  listings: Listing[]
  currentUser: UserType
}

export default function BuyerOffers({ offers, listings, currentUser }: BuyerOffersProps) {
  const { updateOffer } = useStore()
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isCounterOfferModalOpen, setIsCounterOfferModalOpen] = useState(false)
  const [isMessagingOpen, setIsMessagingOpen] = useState(false)
  const [counterOfferData, setCounterOfferData] = useState({
    price: 0,
    message: ''
  })

  const getListingById = (listingId: string) => {
    return listings.find(listing => listing.id === listingId)
  }

  const getSellerById = (sellerId: string): UserType => {
    const foundUser = mockUsers.find(user => user.id === sellerId)
    if (foundUser) {
      return foundUser
    }
    
    // Return a minimal User object with required fields
    return {
      id: sellerId,
      email: 'seller@example.com',
      name: 'Seller Name',
      role: 'seller',
      capabilities: ['sell'],
      company: 'Seller Company',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
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

  const handleViewListing = (listingId: string) => {
    // Navigate to listing detail page
    window.location.href = `/listings/${listingId}`
  }

  const handleCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setCounterOfferData({
      price: offer.counterOffer?.price || offer.price,
      message: ''
    })
    setIsCounterOfferModalOpen(true)
  }

  const handleAcceptCounterOffer = async () => {
    if (!selectedOffer || !counterOfferData.message.trim()) return

    try {
      const updatedOffer: Offer = {
        ...selectedOffer,
        status: 'accepted',
        price: selectedOffer.counterOffer!.price, // Accept the counter offer price
        message: `${selectedOffer.message}\n\n[COUNTER OFFER ACCEPTED] ${counterOfferData.message}`,
        updatedAt: new Date()
      }
      
      updateOffer(updatedOffer.id, updatedOffer)
      setIsCounterOfferModalOpen(false)
      setSelectedOffer(null)
      setCounterOfferData({ price: 0, message: '' })
    } catch (error) {
      console.error('Error accepting counter offer:', error)
    }
  }

  const handleRejectCounterOffer = async () => {
    if (!selectedOffer) return

    try {
      const updatedOffer: Offer = {
        ...selectedOffer,
        status: 'rejected',
        message: `${selectedOffer.message}\n\n[COUNTER OFFER REJECTED]`,
        updatedAt: new Date()
      }
      
      updateOffer(updatedOffer.id, updatedOffer)
      setIsCounterOfferModalOpen(false)
      setSelectedOffer(null)
    } catch (error) {
      console.error('Error rejecting counter offer:', error)
    }
  }

  const isOfferExpired = (offer: Offer) => {
    return new Date() > offer.expiresAt
  }

  const filteredOffers = offers.filter(offer => 
    offer.buyerId === currentUser.id && 
    offer.status !== 'expired' &&
    !isOfferExpired(offer)
  )

  if (filteredOffers.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
        <p className="text-gray-500">Start browsing listings and make your first offer!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Offers</h2>
        <Badge variant="secondary" className="text-sm">
          {filteredOffers.length} active offers
        </Badge>
      </div>

      <div className="grid gap-6">
        {filteredOffers.map((offer) => {
          const listing = getListingById(offer.listingId)
          const seller = getSellerById(offer.sellerId)
          
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
                      Listed by {seller.company || seller.name}
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
                    <p className="text-sm text-gray-500">Your Offer Price</p>
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
                      <p className="text-sm text-gray-500 mb-1">Your Message</p>
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <RotateCcw className="w-4 h-4 text-red-600" />
                    <p className="text-sm font-medium text-red-900">Counter Offer from Seller</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-red-700">
                        <strong>New Price:</strong> R{offer.counterOffer.price.toLocaleString()}/ton
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-red-700">
                        <strong>Original Price:</strong> R{offer.price.toLocaleString()}/ton
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-red-800">{offer.counterOffer.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => handleViewListing(offer.listingId)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Listing
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedOffer(offer)
                    setIsMessagingOpen(true)
                  }}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Seller
                </Button>
                
                {offer.status === 'counter-offered' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleCounterOffer(offer)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Counter
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={handleRejectCounterOffer}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Counter
                    </Button>
                  </>
                )}
              </div>

              {/* Status-specific messages */}
              {offer.status === 'pending' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Waiting for seller response. Your offer expires on {formatDate(offer.expiresAt)}.
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
                      Congratulations! The seller has accepted your offer. A deal has been created.
                    </p>
                  </div>
                </div>
              )}

              {offer.status === 'rejected' && (
                <div className="pt-4 border-t">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800 font-medium">Offer Rejected</p>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      The seller has rejected your offer. You can make a new offer or browse other listings.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Counter Offer Response Modal */}
      {isCounterOfferModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Respond to Counter Offer</h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 mb-2">
                    <strong>Seller's Counter Offer:</strong> R{selectedOffer.counterOffer?.price.toLocaleString()}/ton
                  </p>
                  <p className="text-sm text-red-700">{selectedOffer.counterOffer?.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response Message (Optional)
                  </label>
                  <textarea
                    value={counterOfferData.message}
                    onChange={(e) => setCounterOfferData(prev => ({ 
                      ...prev, 
                      message: e.target.value 
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add a message to the seller (optional)"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setIsCounterOfferModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAcceptCounterOffer}
                    className="flex-1"
                  >
                    Accept Counter Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Messaging Modal */}
      {selectedOffer && (
        <OfferMessaging
          offer={selectedOffer}
          currentUser={currentUser}
          otherUser={getSellerById(selectedOffer.sellerId)}
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
