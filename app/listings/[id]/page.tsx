'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ImageComponent from '@/components/ui/Image'
import ClientOnly from '@/components/ui/ClientOnly'
import MakeOfferModal from '@/components/offers/MakeOfferModal'
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
  Truck,
  Box
} from 'lucide-react'
import { mockListings } from '@/lib/mockData'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser, isAuthenticated, createOffer } = useStore()
  const [listing, setListing] = useState<any>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      const foundListing = mockListings.find(l => l.id === params.id)
      if (foundListing) {
        setListing(foundListing)
      }
    }
  }, [params.id])

  const handleOfferCreated = (offer: any) => {
    toast.success('Offer submitted successfully!')
    setShowOfferModal(false)
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
            {/* Product Images and Videos */}
            <Card>
              <CardContent className="p-0">
                {/* Main Image/Video Display */}
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
                
                {/* Image Gallery */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Product Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {listing.images.map((image: string, index: number) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <ImageComponent
                            src={image}
                            alt={`${listing.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Video Gallery */}
                {listing.videos && listing.videos.length > 0 && (
                  <div className="p-4 border-t">
                    <h3 className="text-lg font-semibold mb-3">Product Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listing.videos.map((video: string, index: number) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <video
                            src={video}
                            controls
                            className="w-full h-full object-cover"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-2xl mb-4">{listing.title}</CardTitle>
                <p className="text-gray-600 mb-6">{listing.description}</p>
                
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
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="text-sm text-gray-500">Grade</div>
                      <div className="font-medium">
                        {listing.specifications?.grade || listing.qualityGrade || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Box className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-500">Packaging</div>
                      <div className="font-medium">
                        {listing.specifications?.packaging || 'Bulk'}
                      </div>
                    </div>
                  </div>
                  
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
                        {formatDate(listing.createdAt)}
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
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-medium">{listing.specifications?.protein || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Moisture</span>
                    <span className="font-medium">{listing.specifications?.moisture || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fibre</span>
                    <span className="font-medium">{listing.specifications?.fibre || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">ME Energy</span>
                    <span className="font-medium">{listing.specifications?.meEnergy || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            {listing.paymentTerms && (
              <Card>
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-4">Payment Terms</CardTitle>
                  <p className="text-gray-600">{listing.paymentTerms}</p>
                </CardContent>
              </Card>
            )}

            {/* Delivery Options */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Delivery Options</CardTitle>
                <div className="space-y-2">
                  {listing.deliveryOptions.exFarm && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Buyer can collect</span>
                    </div>
                  )}
                  {listing.deliveryOptions.delivered && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Seller will deliver</span>
                    </div>
                  )}
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
                <p className="text-sm text-gray-600 mb-4">Only buyers can make offers</p>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowOfferModal(true)}
                >
                  Make an Offer
                </Button>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4">Seller Information</CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <ImageComponent
                      src={listing.seller.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt={listing.seller.name || "Seller"}
                      className="w-12 h-12 rounded-full"
                      fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    />
                    <div>
                      <div className="font-medium">{listing.seller.name || "Unknown Seller"}</div>
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
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => router.push('/transport/create-backload')}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Request Transport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Make Offer Modal */}
        {showOfferModal && currentUser && (
          <MakeOfferModal
            listing={listing}
            buyer={currentUser}
            isOpen={showOfferModal}
            onClose={() => setShowOfferModal(false)}
            onOfferCreated={handleOfferCreated}
          />
        )}
      </div>
    </div>
  )
}
