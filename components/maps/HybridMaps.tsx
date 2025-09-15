'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Truck, Route, MapPin, ExternalLink, RefreshCw } from 'lucide-react'

interface HybridMapsProps {
  height?: string
  className?: string
}

// Demo data for South African agricultural locations
const DEMO_LOCATIONS = [
  {
    id: 1,
    name: 'Free State Farm',
    position: { lat: -28.7282, lng: 26.7479 },
    type: 'listing',
    description: 'Premium Yellow Maize - 100 tons available',
    price: 'R3,200/ton',
    quantity: '100 tons',
    province: 'Free State'
  },
  {
    id: 2,
    name: 'Gauteng Farm',
    position: { lat: -26.2041, lng: 28.0473 },
    type: 'listing',
    description: 'White Maize - 50 tons available',
    price: 'R3,150/ton',
    quantity: '50 tons',
    province: 'Gauteng'
  },
  {
    id: 3,
    name: 'Western Cape Farm',
    position: { lat: -33.9249, lng: 18.4241 },
    type: 'listing',
    description: 'Soybean Meal - 25 tons available',
    price: 'R4,500/ton',
    quantity: '25 tons',
    province: 'Western Cape'
  },
  {
    id: 4,
    name: 'Transport Route',
    position: { lat: -29.8587, lng: 31.0218 },
    type: 'transport',
    description: 'KZN to Gauteng - 80 tons capacity',
    price: 'R2,500/ton',
    quantity: '80 tons',
    province: 'KwaZulu-Natal'
  },
  {
    id: 5,
    name: 'Backload Opportunity',
    position: { lat: -25.5653, lng: 30.5279 },
    type: 'backload',
    description: 'Mpumalanga to Free State - Available',
    price: 'R1,800/ton',
    quantity: '60 tons',
    province: 'Mpumalanga'
  },
  {
    id: 6,
    name: 'Northern Cape Farm',
    position: { lat: -29.0467, lng: 21.8569 },
    type: 'listing',
    description: 'Sunflower Seeds - 75 tons available',
    price: 'R3,800/ton',
    quantity: '75 tons',
    province: 'Northern Cape'
  }
]

export default function HybridMaps({ height = '600px', className = '' }: HybridMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [mapType, setMapType] = useState<'google' | 'simple' | 'loading'>('loading')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Only run on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clear all markers
    markersRef.current.forEach(marker => {
      try {
        marker.setMap(null)
      } catch (e) {
        // Ignore cleanup errors
      }
    })
    markersRef.current = []
    
    // Clear map instance
    if (mapInstanceRef.current) {
      try {
        // Clear all event listeners
        google.maps.event.clearInstanceListeners(mapInstanceRef.current)
      } catch (e) {
        // Ignore cleanup errors
      }
      mapInstanceRef.current = null
    }
  }, [])

  // Initialize Google Maps
  const initializeGoogleMaps = useCallback(async () => {
    if (!isMounted || typeof window === 'undefined' || !mapRef.current) return

    try {
      setIsLoading(true)
      setError(null)
      
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey === 'demo-key') {
        throw new Error('Invalid API key')
      }

      // Cleanup any existing map
      cleanup()

      // Load Google Maps
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly'
      })

      const { Map } = await loader.importLibrary('maps')
      
      if (!mapRef.current) return

      // Create map
      const map = new Map(mapRef.current, {
        center: { lat: -30.5595, lng: 22.9375 }, // South Africa center
        zoom: 6,
        mapTypeId: 'roadmap'
      })

      mapInstanceRef.current = map

      // Add markers
      DEMO_LOCATIONS.forEach((location) => {
        if (!map) return

        let iconColor = '#3D693D' // Default green for listings
        
        if (location.type === 'transport') {
          iconColor = '#DB4A39' // Red for transport
        } else if (location.type === 'backload') {
          iconColor = '#2563EB' // Blue for backload
        }

        const marker = new google.maps.Marker({
          position: location.position,
          map: map,
          title: location.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: iconColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        marker.addListener('click', () => {
          setSelectedLocation(location)
        })

        markersRef.current.push(marker)
      })

      setMapType('google')
      setIsLoading(false)
    } catch (err: any) {
      console.error('Google Maps Error:', err)
      setMapType('simple')
      setError(`Google Maps unavailable: ${err.message}`)
      setIsLoading(false)
    }
  }, [isMounted, cleanup])

  // Initialize map on mount
  useEffect(() => {
    if (isMounted) {
      initializeGoogleMaps()
    }
  }, [isMounted, initializeGoogleMaps])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'listing':
        return <Package className="w-5 h-5 text-green-600" />
      case 'transport':
        return <Truck className="w-5 h-5 text-red-600" />
      case 'backload':
        return <Route className="w-5 h-5 text-blue-600" />
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />
    }
  }

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'listing':
        return 'bg-green-50 border-green-200 hover:bg-green-100'
      case 'transport':
        return 'bg-red-50 border-red-200 hover:bg-red-100'
      case 'backload':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100'
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }
  }

  const filteredLocations = selectedType === 'all' 
    ? DEMO_LOCATIONS 
    : DEMO_LOCATIONS.filter(loc => loc.type === selectedType)

  const retryGoogleMaps = () => {
    setMapType('loading')
    setError(null)
    initializeGoogleMaps()
  }

  // Don't render until mounted on client
  if (!isMounted) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={mapRef} 
                className="w-full rounded-lg relative" 
                style={{ height }}
              >
                {mapType === 'loading' && (
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}

                {mapType === 'simple' && (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 relative overflow-hidden rounded-lg">
                    {/* South Africa Map Background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-8xl mb-4">🗺️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">South Africa Agricultural Map</h3>
                        <p className="text-gray-600 mb-4">Interactive map with location markers</p>
                        
                        {/* Location Dots */}
                        <div className="relative w-80 h-60 mx-auto">
                          {DEMO_LOCATIONS.map((location, index) => {
                            let dotColor = 'bg-green-500'
                            if (location.type === 'transport') dotColor = 'bg-red-500'
                            if (location.type === 'backload') dotColor = 'bg-blue-500'
                            
                            return (
                              <div 
                                key={location.id}
                                className={`absolute w-3 h-3 ${dotColor} rounded-full animate-pulse cursor-pointer`}
                                style={{
                                  top: `${20 + (index * 8)}px`,
                                  left: `${20 + (index * 12)}px`
                                }}
                                onClick={() => setSelectedLocation(location)}
                                title={location.name}
                              />
                            )
                          })}
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-500">
                          Click on the colored dots to view location details
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {mapType === 'google' && isLoading && (
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Map Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Map Status</h3>
                {mapType === 'simple' && (
                  <button
                    onClick={retryGoogleMaps}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Google Maps</span>
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    mapType === 'google' ? 'bg-green-500' : 
                    mapType === 'simple' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-700">
                    {mapType === 'google' ? 'Google Maps Active' : 
                     mapType === 'simple' ? 'Simple Map (Fallback)' : 'Loading...'}
                  </span>
                </div>
                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filter */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Filter by Type</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedType === 'all' 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Locations ({DEMO_LOCATIONS.length})
                </button>
                <button
                  onClick={() => setSelectedType('listing')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedType === 'listing' 
                      ? 'bg-green-200 text-green-900' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Product Listings ({DEMO_LOCATIONS.filter(l => l.type === 'listing').length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedType('transport')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedType === 'transport' 
                      ? 'bg-red-200 text-red-900' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Transport Routes ({DEMO_LOCATIONS.filter(l => l.type === 'transport').length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedType('backload')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedType === 'backload' 
                      ? 'bg-blue-200 text-blue-900' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Backload Opportunities ({DEMO_LOCATIONS.filter(l => l.type === 'backload').length})</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Location Details */}
          {selectedLocation && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getLocationIcon(selectedLocation.type)}
                  <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                  <p className="text-xs text-gray-500">{selectedLocation.province}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-semibold text-green-600">{selectedLocation.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold">{selectedLocation.quantity}</span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="w-full bg-primary-600 text-white text-sm py-2 px-3 rounded hover:bg-primary-700"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps?q=${selectedLocation.position.lat},${selectedLocation.position.lng}`, '_blank')}
                    className="w-full bg-gray-100 text-gray-700 text-sm py-2 px-3 rounded hover:bg-gray-200 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Locations */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {selectedType === 'all' ? 'All Locations' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s`}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div 
                    key={location.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getLocationTypeColor(location.type)}`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {getLocationIcon(location.type)}
                      <span className="font-medium text-sm">{location.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{location.description}</p>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-green-600 font-semibold">{location.price}</span>
                      <span className="text-gray-500">{location.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


image.png
