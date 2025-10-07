'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { supabase, SupabaseDatabaseService } from '@/shared/api/supabase'
import { mockListings } from '@/shared/utils/mockData'
import { Card, CardContent, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import ImageComponent from '@/shared/ui/Image'
import ClientOnly from '@/shared/ui/ClientOnly'
import MakeOfferModal from '@/features/offers/components/MakeOfferModal'
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
  Mail,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/shared/utils/utils'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser, isAuthenticated } = useSupabaseStore()
  const [listing, setListing] = useState<any>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleOfferCreated = () => {
    setShowOfferModal(false)
    toast.success('Offer created successfully!')
  }

  useEffect(() => {
    const fetchListing = async () => {
      if (params.id) {
        try {
          setIsLoading(true)
          console.log('🔍 Fetching listing from Supabase:', params.id)
          
          // Fetch from Supabase
          const { data, error } = await SupabaseDatabaseService.getListingById(params.id)
          
          if (error) {
            console.error('❌ Supabase error:', error)
            toast.error('Failed to load listing details')
            return
          }
          
          if (data) {
            console.log('✅ Found listing in Supabase:', data)
            setListing(data)
          } else {
            console.log('❌ Listing not found in Supabase')
            toast.error('Listing not found')
          }
        } catch (error) {
          console.error('❌ Error fetching listing:', error)
          toast.error('Failed to load listing details')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchListing()
  }, [params.id])

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/listings')}>
            Back to Listings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile-First Hero Section */}
      <div className="relative">
        {/* Premium Floating Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => router.push('/listings')}
            className="floating-ghost-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </button>
        </div>

        {/* Premium Cinematic Hero Section */}
        <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
          <ImageComponent
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
            fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1400&h=900&fit=crop"
          />
          
          {/* Premium Gradient Overlay */}
          <div className="hero-overlay" />
          
          
          {/* Floating Price Card - Premium */}
          <div className="floating-price-card hidden lg:block">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1 font-medium">Price per {listing.product?.unit || 'ton'}</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                R{listing.price.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mb-4">
                {listing.availableQuantity || 100} {listing.product?.unit || 'tons'} available
              </div>
              <button 
                className="w-full gradient-success text-white font-bold py-3 px-6 rounded-2xl shadow-glow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => setShowOfferModal(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                Make Offer
              </button>
            </div>
          </div>
          
          {/* Premium Hero Content */}
          <div className="hero-content absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-5xl">
                {/* Premium Product Title */}
                <div className="mb-8">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
                    {listing.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
                    Premium quality from {listing.seller?.name || 'Verified Seller'}
                  </p>
                </div>
                
                {/* Premium Product Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-4xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-white font-medium">Premium quality grain</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-white font-medium">Industrial use approved</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-white font-medium">Suitable for animal feed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-white font-medium">Immediate availability</span>
                  </div>
                </div>
                
                {/* Simplified Status Pills */}
                <div className="flex flex-wrap gap-3">
                  {/* Grade with Premium Badge */}
                  <div className="premium-badge">
                    <Award className="w-4 h-4" />
                    <span>Grade {listing.specifications?.grade || listing.qualityGrade || 'A'}</span>
                  </div>
                  
                  {/* Premium Verification */}
                  <div className="premium-badge">
                    <Shield className="w-4 h-4" />
                    <span>Verified Premium</span>
                  </div>
                  
                  {/* Location Badge */}
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg border border-red-400">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    <span className="font-bold">{listing.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-content">
            {/* Premium Trust Building Section */}
            <div className="premium-card-elevated p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <ImageComponent
                      src={listing.seller.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt={listing.seller.name || "Seller"}
                      className="w-20 h-20 rounded-full object-cover shadow-premium border-4 border-white"
                      fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{listing.seller.name || "Unknown Seller"}</h3>
                    <p className="text-lg text-slate-600 font-medium">{listing.seller.company}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-yellow-700 ml-1">{listing.seller.rating || 4.9}</span>
                      </div>
                      <div className="premium-badge text-xs px-3 py-1">
                        <Shield className="w-3 h-3" />
                        <span>Premium Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Premium Trust Metrics */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{listing.seller.totalDeals || 23}</div>
                  <div className="text-sm text-slate-600">Successful Deals</div>
                </div>
              </div>
              
              {/* Simplified Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-r from-emerald-50 to-slate-50 rounded-2xl border border-emerald-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{listing.seller.reputationScore || 95}</div>
                  <div className="text-sm text-slate-600 font-medium">Reputation Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">100%</div>
                  <div className="text-sm text-slate-600 font-medium">Success Rate</div>
                </div>
              </div>
              
              <p className="text-body text-secondary mt-6 leading-relaxed">
                Trusted seller with {listing.seller.totalDeals || 23} successful deals and {listing.seller.reputationScore || 95}/100 reputation score. 
                Premium quality guaranteed with full verification and insurance coverage.
              </p>
            </div>

            {/* Interactive Transport Intelligence Section */}
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-headline text-accent">Smart Transport Planning</h2>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold">2.3km from your location</span>
                  </div>
                </div>
              </div>
              
              {/* Interactive Farm Location Hub */}
              <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-3xl p-8 mb-6 border-2 border-emerald-200 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Farm Location Info */}
                  <div>
                    <div className="relative w-20 h-20 mx-auto lg:mx-0 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl mx-auto lg:mx-0">
                        <MapPin className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{listing.location}</h3>
                    <p className="text-slate-600 mb-4">Premium farm with full logistics infrastructure</p>
                    
                    {/* Farm Accessibility Score */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Accessibility Score</span>
                        <span className="text-2xl font-bold text-emerald-600">95/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full" style={{width: '95%'}}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Excellent road access • Loading facilities • 24/7 availability</p>
                    </div>
                  </div>
                  
                  {/* Real-time Transport Intelligence */}
                  <div className="space-y-4">
                    {/* Distance & Time Calculator */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-slate-900">Route Intelligence</h4>
                        <div className="flex items-center space-x-2 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-semibold">Live Data</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">2.3km</div>
                          <div className="text-xs text-slate-600">Distance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">8 min</div>
                          <div className="text-xs text-slate-600">Drive Time</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Optimal conditions • No traffic delays</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Transport Options */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Truck className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-bold text-blue-800">Delivery</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">R450/ton</div>
                        <div className="text-xs text-blue-600">Same day available</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-bold text-green-800">Collection</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">Free</div>
                        <div className="text-xs text-green-600">Save R450/ton</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Smart Transport Action Hub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="premium-card-elevated p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Professional Delivery</h3>
                      <p className="text-sm text-slate-600">Full-service transport solution</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Cost per ton</span>
                      <span className="font-bold text-blue-600">R450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Delivery time</span>
                      <span className="font-bold text-blue-600">Same day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Service area</span>
                      <span className="font-bold text-blue-600">50km radius</span>
                    </div>
                  </div>
                  <button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={() => {/* Open transport planner */}}
                  >
                    <Truck className="w-5 h-5 mr-2 inline" />
                    Plan Delivery Route
                  </button>
                </div>
                
                <div className="premium-card-elevated p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Farm Collection</h3>
                      <p className="text-sm text-slate-600">Direct pickup from source</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Collection fee</span>
                      <span className="font-bold text-emerald-600">Free</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Availability</span>
                      <span className="font-bold text-emerald-600">24/7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Savings</span>
                      <span className="font-bold text-emerald-600">R450/ton</span>
                    </div>
                  </div>
                  <button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={() => {/* Open collection planner */}}
                  >
                    <MapPin className="w-5 h-5 mr-2 inline" />
                    Plan Collection Route
                  </button>
                </div>
              </div>
            </div>

            {/* Quality Specifications - Scannable */}
            <div className="card p-8">
              <h2 className="text-headline text-accent mb-6">Quality Specifications</h2>
              
              {/* Scannable List Format */}
              <div className="space-elements">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Weight className="w-5 h-5 text-primary" />
                    <span className="text-body text-accent">Protein Content</span>
                  </div>
                  <span className="text-title text-primary">{listing.specifications?.protein || '10.1%'}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Droplet className="w-5 h-5 text-primary" />
                    <span className="text-body text-accent">Moisture Level</span>
                  </div>
                  <span className="text-title text-primary">{listing.specifications?.moisture || '12.8%'}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-primary" />
                    <span className="text-body text-accent">Fiber Content</span>
                  </div>
                  <span className="text-title text-primary">{listing.specifications?.fibre || '1.9%'}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-body text-accent">Energy Value</span>
                  </div>
                  <span className="text-title text-primary">{listing.specifications?.meEnergy || '13.2 MJ/kg'}</span>
                </div>
              </div>
            </div>

            {/* Media Gallery - Progressive Disclosure */}
            {(listing.images && listing.images.length > 1) || (listing.videos && listing.videos.length > 0) ? (
              <div className="card p-8">
                <h2 className="text-headline text-accent mb-6">Product Gallery</h2>
                
                {/* Image Gallery - Mobile Optimized */}
                {listing.images && listing.images.length > 1 && (
                  <div className="mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      {listing.images.slice(1).map((image: string, index: number) => (
                        <div key={index} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
                          <ImageComponent
                            src={image}
                            alt={`${listing.title} - Image ${index + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                    <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden">
                      <video
                        src={listing.videos[0]}
                        controls
                        className="w-full h-full object-cover"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Payment & Delivery - Scannable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Terms */}
              {listing.paymentTerms && (
                <div className="card p-6">
                  <h3 className="text-title text-accent mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    Payment Terms
                  </h3>
                  <p className="text-body text-secondary mb-4">{listing.paymentTerms}</p>
                  
                  {/* Key Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-caption text-secondary">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-caption text-secondary">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>5% early payment discount</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Options */}
              <div className="card p-6">
                <h3 className="text-title text-accent mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary" />
                  Delivery Options
                </h3>
                
                <div className="space-y-3">
                  {listing.deliveryOptions.exFarm && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-body text-accent">Farm collection available</span>
                    </div>
                  )}
                  {listing.deliveryOptions.delivered && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-body text-accent">Delivery service available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Sidebar - Conversion Optimized */}
          <div className="lg:col-span-1">
            {/* Sticky Container */}
            <div className="sticky top-8 space-content">
              {/* Premium Primary CTA */}
              <div className="premium-card-elevated p-8">
                <div className="text-center mb-6">
                  <div className="text-sm text-slate-600 mb-2 font-medium">Price per {listing.product?.unit || 'ton'}</div>
                  <div className="text-5xl font-bold text-slate-900 mb-2">
                    R{listing.price.toLocaleString()}
                  </div>
                  <div className="text-base text-slate-600 mb-6">
                    {listing.availableQuantity || 100} {listing.product?.unit || 'tons'} available
                  </div>
                  
                  {/* Premium Primary CTA */}
                  <button 
                    className="w-full gradient-success text-white font-bold py-4 px-6 rounded-2xl shadow-glow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mb-6"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2 inline" />
                    Make Offer
                  </button>
                  
                  {/* Premium Trust Indicators */}
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="premium-badge text-xs px-3 py-1">
                      <Shield className="w-3 h-3 mr-1" />
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-yellow-700">{listing.seller?.rating || 4.9}</span>
                    </div>
                  </div>
                </div>
                
                {/* Clear Next Steps */}
                <div className="space-y-3">
                  <button className="w-full bg-white text-slate-700 font-semibold py-3 px-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300">
                    <MessageCircle className="w-4 h-4 mr-2 inline" />
                    Ask Questions First
                  </button>
                  <button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={() => {/* Open smart transport planner */}}
                  >
                    <Truck className="w-4 h-4 mr-2 inline" />
                    Smart Transport Planner
                  </button>
                </div>
                
              </div>

              {/* Premium Social Proof */}
              <div className="premium-card p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Market Activity</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">1,247</div>
                    <div className="text-sm text-slate-600 font-medium">Views</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">8</div>
                    <div className="text-sm text-slate-600 font-medium">Active Offers</div>
                  </div>
                </div>
                
                {/* Premium Urgency Indicator */}
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-red-700">High demand - Act fast!</span>
                  </div>
                </div>
              </div>
            </div>
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
