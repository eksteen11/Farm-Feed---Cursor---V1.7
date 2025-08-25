'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ImageComponent from '@/components/ui/Image'
import { 
  MapPin, 
  User, 
  Calendar, 
  Package, 
  DollarSign,
  MessageCircle,
  ArrowLeft,
  Star,
  Shield,
  Truck
} from 'lucide-react'
import { mockListings } from '@/lib/mockData'
import toast from 'react-hot-toast'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser, isAuthenticated, createOffer } = useStore()
  const [listing, setListing] = useState<any>(null)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerData, setOfferData] = useState({
    price: '',
    quantity: '',
    message: ''
  })

  useEffect(() => {
    if (params.id) {
      const foundListing = mockListings.find(l => l.id === params.id)
      if (foundListing) {
        setListing(foundListing)
        setOfferData(prev => ({ ...prev, price: foundListing.price.toString() }))
      }
    }
  }, [params.id])

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please log in to make an offer')
      router.push('/login')
      return
    }

    if (!currentUser) {
      toast.error('User not found')
      return
    }

    if (currentUser.role !== 'buyer') {
      toast.error('Only buyers can make offers')
      return
    }

    const offer = {
      listingId: listing.id,
      listing: listing,
      buyerId: currentUser.id,
      buyer: currentUser,
      price: parseFloat(offerData.price),
      quantity: parseFloat(offerData.quantity),
      message: offerData.message,
      status: 'pending' as const,
      expiresAt: new Date((typeof window === 'undefined' ? 0 : Date.now()) + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      deliveryAddress: undefined,
      deliveryDate: undefined,
      transportRequired: true,
      counterOffer: undefined,
      negotiationHistory: [{
        action: 'offer' as const,
        price: parseFloat(offerData.price),
        quantity: parseFloat(offerData.quantity),
        message: offerData.message,
        timestamp: new Date(),
        userId: currentUser.id
      }]
    }

    try {
      createOffer(offer)
      toast.success('Offer submitted successfully!')
      setShowOfferForm(false)
      setOfferData({ price: '', quantity: '', message: '' })
    } catch (error) {
      toast.error('Failed to submit offer. Please try again.')
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Listing Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The listing you're looking for doesn't exist
          </p>
          <Button onClick={() => router.push('/listings')}>
            Back to Listings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/listings')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Listings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card>
              <div className="aspect-video bg-gray-200 relative">
                <ImageComponent
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                  fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                />
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {listing.product.category}
                </div>
              </div>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-2xl mb-4">{listing.title}</CardTitle>
                <p className="text-gray-600 mb-6">{listing.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="text-sm text-gray-500">Product</div>
                        <div className="font-medium">{listing.product.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{listing.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="text-sm text-gray-500">Seller</div>
                        <div className="font-medium">{listing.seller.name}</div>
                        {listing.seller.company && (
                          <div className="text-sm text-gray-600">{listing.seller.company}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="text-sm text-gray-500">Price</div>
                        <div className="text-2xl font-bold text-primary-600">
                          R{listing.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="text-sm text-gray-500">Available Quantity</div>
                        <div className="font-medium">
                          {listing.availableQuantity} {listing.product.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="text-sm text-gray-500">Listed</div>
                        <div className="font-medium">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Specifications */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Product Specifications</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(listing.product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Make an Offer</CardTitle>
                
                {!isAuthenticated ? (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      Sign in to make an offer on this listing
                    </p>
                    <Button 
                      onClick={() => router.push('/login')}
                      className="w-full"
                    >
                      Sign In to Make Offer
                    </Button>
                  </div>
                ) : currentUser?.role !== 'buyer' ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">
                      Only buyers can make offers
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Verified seller</span>
                    </div>
                    
                    <Button 
                      onClick={() => setShowOfferForm(true)}
                      className="w-full"
                      leftIcon={<MessageCircle className="w-4 h-4" />}
                    >
                      Make Offer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Seller Information</CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={listing.seller.avatar}
                      alt={listing.seller.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{listing.seller.name}</div>
                      {listing.seller.company && (
                        <div className="text-sm text-gray-600">{listing.seller.company}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.seller.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Verified Seller</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Quick Actions</CardTitle>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button variant="ghost" className="w-full">
                    <Truck className="w-4 h-4 mr-2" />
                    Arrange Transport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offer Form Modal */}
        {showOfferForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Make an Offer</h3>
                  <button
                    onClick={() => setShowOfferForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Price (ZAR per {listing.product.unit})
                    </label>
                    <Input
                      type="number"
                      value={offerData.price}
                      onChange={(e) => setOfferData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter your price"
                      leftIcon={<DollarSign className="w-5 h-5" />}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity ({listing.product.unit})
                    </label>
                    <Input
                      type="number"
                      value={offerData.quantity}
                      onChange={(e) => setOfferData(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Enter quantity"
                      leftIcon={<Package className="w-5 h-5" />}
                      max={listing.availableQuantity}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {listing.availableQuantity} {listing.product.unit}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={offerData.message}
                      onChange={(e) => setOfferData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Add a message to your offer..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowOfferForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Submit Offer
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
