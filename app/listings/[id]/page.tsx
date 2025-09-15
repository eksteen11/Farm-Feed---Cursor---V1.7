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
  Box,
  Weight,
  Droplet,
  Leaf,
  Zap,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Phone,
  Mail
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Creative Staggered Layout */}
          <div className="xl:col-span-3 space-y-6">
            {/* Hero Section with Images and Key Info */}
            <Card className="overflow-hidden rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left: Main Image */}
                <div className="aspect-video lg:aspect-square bg-gray-200 relative rounded-l-2xl lg:rounded-l-2xl lg:rounded-r-none">
                  <ImageComponent
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover rounded-l-2xl lg:rounded-l-2xl lg:rounded-r-none"
                    fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                  />
                  <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {listing.product.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                </div>
                
                {/* Right: Key Product Info */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-r-2xl lg:rounded-r-2xl lg:rounded-l-none">
                  <div className="space-y-6">
                    {/* Title and Description */}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-3">{listing.title}</h1>
                      <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                    </div>
                    
                    {/* Price - Prominent Display */}
                    <div className="bg-primary-50 rounded-2xl p-6 border-2 border-primary-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-primary-600 font-medium mb-1">Price per {listing.product.unit}</div>
                          <div className="text-4xl font-bold text-primary-600">
                            R{listing.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Available</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {listing.availableQuantity} {listing.product.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Location</div>
                            <div className="font-semibold text-gray-900">{listing.location}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Grade</div>
                            <div className="font-semibold text-gray-900">
                              {listing.specifications?.grade || listing.qualityGrade || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Box className="w-5 h-5 text-purple-500" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Packaging</div>
                            <div className="font-semibold text-gray-900">
                              {listing.specifications?.packaging || 'Bulk'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-green-500" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Listed</div>
                            <div className="font-semibold text-gray-900">
                              {formatDate(listing.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Product Specifications - Creative Layout */}
            <Card className="rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Award className="w-6 h-6 text-primary-600" />
                  <CardTitle className="text-2xl">Quality Specifications</CardTitle>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                    <Weight className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-sm text-blue-600 font-medium mb-1">Protein</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {listing.specifications?.protein || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                    <Droplet className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <div className="text-sm text-green-600 font-medium mb-1">Moisture</div>
                    <div className="text-2xl font-bold text-green-900">
                      {listing.specifications?.moisture || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                    <Leaf className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-sm text-orange-600 font-medium mb-1">Fibre</div>
                    <div className="text-2xl font-bold text-orange-900">
                      {listing.specifications?.fibre || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                    <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-sm text-purple-600 font-medium mb-1">ME Energy</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {listing.specifications?.meEnergy || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Gallery - Enhanced Layout */}
            {(listing.images && listing.images.length > 1) || (listing.videos && listing.videos.length > 0) ? (
              <Card className="rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="w-6 h-6 text-primary-600" />
                    <CardTitle className="text-2xl">Media Gallery</CardTitle>
                  </div>
                  
                  {/* Image Gallery */}
                  {listing.images && listing.images.length > 1 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {listing.images.slice(1).map((image: string, index: number) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-xl overflow-hidden group cursor-pointer">
                            <ImageComponent
                              src={image}
                              alt={`${listing.title} - Image ${index + 2}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Video Gallery */}
                  {listing.videos && listing.videos.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {listing.videos.map((video: string, index: number) => (
                          <div key={index} className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
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
            ) : null}

            {/* Payment Terms & Delivery - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Terms */}
              {listing.paymentTerms && (
                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <CardTitle className="text-xl">Payment Terms</CardTitle>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{listing.paymentTerms}</p>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Options */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <CardTitle className="text-xl">Delivery Options</CardTitle>
                  </div>
                  <div className="space-y-3">
                    {listing.deliveryOptions.exFarm && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Buyer can collect</span>
                      </div>
                    )}
                    {listing.deliveryOptions.delivered && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Seller will deliver</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Seller Profile Card */}
            <Card className="overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white rounded-t-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <ImageComponent
                    src={listing.seller.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt={listing.seller.name || "Seller"}
                    className="w-16 h-16 rounded-full border-4 border-white"
                    fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{listing.seller.name || "Unknown Seller"}</h3>
                    {listing.seller.company && (
                      <p className="text-primary-100">{listing.seller.company}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{listing.seller.rating || 4.9}</div>
                    <div className="text-sm text-primary-100">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{listing.seller.totalDeals || 23}</div>
                    <div className="text-sm text-primary-100">Deals</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Verified Seller</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.seller.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>Reputation Score: {listing.seller.reputationScore || 95}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>Member since {new Date(listing.seller.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Make an Offer
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setShowOfferModal(true)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => router.push('/transport/create-backload')}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Transport
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Listing Stats
                </CardTitle>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Views</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Offers</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Favorites</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Days Left</span>
                    <span className="font-semibold text-orange-600">
                      {Math.ceil((new Date(listing.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary-600" />
                  Contact Info
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{listing.seller.phone || '+27 82 234 5678'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{listing.seller.email || 'seller@demo.com'}</span>
                  </div>
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
