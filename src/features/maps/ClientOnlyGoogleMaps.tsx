'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Card, CardContent } from '@/shared/ui/Card'
import { Package, Truck, Route, MapPin } from 'lucide-react'

interface ClientOnlyGoogleMapsProps {
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
    quantity: '100 tons'
  },
  {
    id: 2,
    name: 'Gauteng Farm',
    position: { lat: -26.2041, lng: 28.0473 },
    type: 'listing',
    description: 'White Maize - 50 tons available',
    price: 'R3,150/ton',
    quantity: '50 tons'
  },
  {
    id: 3,
    name: 'Western Cape Farm',
    position: { lat: -33.9249, lng: 18.4241 },
    type: 'listing',
    description: 'Soybean Meal - 25 tons available',
    price: 'R4,500/ton',
    quantity: '25 tons'
  },
  {
    id: 4,
    name: 'Transport Route',
    position: { lat: -29.8587, lng: 31.0218 },
    type: 'transport',
    description: 'KZN to Gauteng - 80 tons capacity',
    price: 'R2,500/ton',
    quantity: '80 tons'
  },
  {
    id: 5,
    name: 'Backload Opportunity',
    position: { lat: -25.5653, lng: 30.5279 },
    type: 'backload',
    description: 'Mpumalanga to Free State - Available',
    price: 'R1,800/ton',
    quantity: '60 tons'
  },
  {
    id: 6,
    name: 'Northern Cape Farm',
    position: { lat: -29.0467, lng: 21.8569 },
    type: 'listing',
    description: 'Sunflower Seeds - 75 tons available',
    price: 'R3,800/ton',
    quantity: '75 tons'
  }
]

export default function ClientOnlyGoogleMaps({ height = '600px', className = '' }: ClientOnlyGoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    let map: google.maps.Map | null = null
    let markers: google.maps.Marker[] = []
    let isCleanedUp = false

    const initializeMap = async () => {
      try {
        setIsLoading(true)
        
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        
        if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey === 'demo-key') {
          setError('Please set a valid Google Maps API key in your .env.local file')
          setIsLoading(false)
          return
        }

        if (!mapRef.current || isCleanedUp) return

        // Load Google Maps
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly'
        })

        const { Map } = await loader.importLibrary('maps')
        
        if (!mapRef.current || isCleanedUp) return

        // Create map
        map = new Map(mapRef.current, {
          center: { lat: -30.5595, lng: 22.9375 }, // South Africa center
          zoom: 6,
          mapTypeId: 'roadmap'
        })

        // Add markers
        DEMO_LOCATIONS.forEach((location) => {
          if (!map || isCleanedUp) return

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
            if (!isCleanedUp) {
              setSelectedLocation(location)
            }
          })

          markers.push(marker)
        })

        if (!isCleanedUp) {
          setIsLoading(false)
          setError(null)
        }
      } catch (err: any) {
        console.error('Google Maps Error:', err)
        if (!isCleanedUp) {
          setError(`Failed to load Google Maps: ${err.message}`)
          setIsLoading(false)
        }
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      isCleanedUp = true
      markers.forEach(marker => {
        try {
          marker.setMap(null)
        } catch (e) {
          // Ignore cleanup errors
        }
      })
      markers = []
      map = null
    }
  }, [isMounted])

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
        return 'bg-green-50 border-green-200'
      case 'transport':
        return 'bg-red-50 border-red-200'
      case 'backload':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
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

  if (error) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Google Maps Error</h3>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please check your Google Maps API key and ensure the required APIs are enabled.
            </p>
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
                key="google-map-container"
                ref={mapRef} 
                className="w-full rounded-lg" 
                style={{ height }}
              >
                {isLoading && (
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
          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Product Listings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Transport Routes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Backload Opportunities</span>
                </div>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-semibold text-green-600">{selectedLocation.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold">{selectedLocation.quantity}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="mt-3 w-full bg-primary-600 text-white text-sm py-2 px-3 rounded hover:bg-primary-700"
                >
                  View Details
                </button>
              </CardContent>
            </Card>
          )}

          {/* All Locations */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">All Locations</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {DEMO_LOCATIONS.map((location) => (
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

