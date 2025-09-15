'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { mockListings } from '@/lib/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ImageComponent from '@/components/ui/Image'
import toast from 'react-hot-toast'
import { 
  Search, 
  Filter, 
  MapPin, 
  Package, 
  DollarSign,
  Calendar,
  User,
  Eye,
  ArrowLeft,
  Star,
  Box,
  Truck
} from 'lucide-react'
import { FilterOptions } from '@/types'
import { formatDate } from '@/lib/utils'

export default function ListingsPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterOptions>({})
  const [listings, setListings] = useState(mockListings)
  const [isLoading, setIsLoading] = useState(false)

  // Debug logging
  console.log('Listings page - listings:', listings)
  console.log('Listings page - isLoading:', isLoading)
  console.log('Listings page - listings length:', listings?.length)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    // Apply filters to local listings
    let filteredListings = [...mockListings]
    
    if (localFilters.category) {
      filteredListings = filteredListings.filter(listing => 
        listing.product.category === localFilters.category
      )
    }
    
    if (localFilters.minPrice) {
      filteredListings = filteredListings.filter(listing => 
        listing.price >= localFilters.minPrice!
      )
    }
    
    if (localFilters.maxPrice) {
      filteredListings = filteredListings.filter(listing => 
        listing.price <= localFilters.maxPrice!
      )
    }
    
    if (localFilters.location) {
      filteredListings = filteredListings.filter(listing => 
        listing.location.toLowerCase().includes(localFilters.location!.toLowerCase())
      )
    }
    
    setListings(filteredListings)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    setSearchTerm('')
    setListings(mockListings)
  }

  const filteredListings = listings.filter(listing => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        listing.title.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.location.toLowerCase().includes(searchLower) ||
        listing.product.name.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const categories = ['grain', 'feed', 'seed', 'fertilizer', 'other']
  const locations = ['Free State', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Mpumalanga', 'Limpopo', 'North West', 'Eastern Cape', 'Northern Cape']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Listings
            </h1>
            <p className="text-gray-600">
              Discover agricultural products from verified sellers across South Africa
            </p>
          </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              leftIcon={<Filter className="w-4 h-4" />}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={localFilters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price (ZAR)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (ZAR)
                  </label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={localFilters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    value={localFilters.sortBy || ''}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="">Relevance</option>
                    <option value="price">Price</option>
                    <option value="date">Date</option>
                    <option value="quantity">Quantity</option>
                  </select>
                  <select
                    value={localFilters.sortOrder || 'asc'}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <Button variant="ghost" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                  <Button onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} of {listings.length} listings
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {/* Product Image */}
                  <div className="aspect-video bg-gray-200 relative">
                    <ImageComponent
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                    />
                    <div className="absolute top-3 right-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {listing.product.category}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Product Title */}
                    <div className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {listing.title}
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {listing.location}
                    </div>
                    
                    {/* Product Details */}
                    <div className="space-y-3 mb-4">
                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary-600">
                          R{listing.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {listing.quantity} {listing.product.unit}
                        </div>
                      </div>
                      
                      {/* Grade and Packaging */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="font-medium">
                            Grade: {listing.specifications?.grade || listing.qualityGrade || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Box className="w-4 h-4 mr-1 text-blue-500" />
                          <span className="font-medium">
                            {listing.specifications?.packaging || 'Bulk'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Verified Seller */}
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <span className="flex items-center">
                          {listing.seller.name || "Unknown Seller"}
                          {listing.seller.isVerified && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Verified
                            </span>
                          )}
                        </span>
                      </div>
                      
                      {/* Delivery Options */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Truck className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-xs">
                          {listing.deliveryOptions?.exFarm && listing.deliveryOptions?.delivered 
                            ? 'Collection & Delivery Available'
                            : listing.deliveryOptions?.exFarm 
                            ? 'Collection Only'
                            : listing.deliveryOptions?.delivered
                            ? 'Delivery Only'
                            : 'Contact Seller'
                          }
                        </span>
                      </div>
                      
                      {/* Listed Date */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Listed {formatDate(listing.createdAt)}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link href={`/listings/${listing.id}`} className="flex-1">
                        <Button variant="secondary" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        className="flex-1 bg-primary-600 hover:bg-primary-700"
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error('Please log in to make an offer')
                            router.push('/login')
                          } else {
                            router.push(`/listings/${listing.id}`)
                          }
                        }}
                      >
                        Make Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        )}
        </div>
      </div>
  )
}
