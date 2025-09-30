'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Card, CardContent } from '@/shared/ui/Card'
import { Package, Truck, Route, MapPin, ExternalLink, Layers, Eye, EyeOff } from 'lucide-react'

interface GoogleMapsWrapperProps {
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

const mapContainerStyle = {
  width: '100%',
  height: '600px'
}

const center = {
  lat: -30.5595,
  lng: 22.9375
}

export default function GoogleMapsWrapper({ height = '600px', className = '' }: GoogleMapsWrapperProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  
  // Layer visibility states
  const [showListings, setShowListings] = useState(true)
  const [showTransport, setShowTransport] = useState(true)
  const [showBackload, setShowBackload] = useState(true)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

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

  const getMarkerIcon = (type: string) => {
    const baseIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    }

    switch (type) {
      case 'listing':
        return { ...baseIcon, fillColor: '#3D693D' }
      case 'transport':
        return { ...baseIcon, fillColor: '#DB4A39' }
      case 'backload':
        return { ...baseIcon, fillColor: '#2563EB' }
      default:
        return { ...baseIcon, fillColor: '#6B7280' }
    }
  }

  // Filter locations based on selected type and layer visibility
  const filteredLocations = useMemo(() => {
    return DEMO_LOCATIONS.filter(location => {
      // Filter by selected type
      if (selectedType !== 'all' && location.type !== selectedType) {
        return false
      }
      
      // Filter by layer visibility
      if (location.type === 'listing' && !showListings) return false
      if (location.type === 'transport' && !showTransport) return false
      if (location.type === 'backload' && !showBackload) return false
      
      return true
    })
  }, [selectedType, showListings, showTransport, showBackload])

  const onLoad = useCallback((map: google.maps.Map) => {
    // Optional: Add any map configuration here
  }, [])

  const onUnmount = useCallback(() => {
    // Optional: Cleanup when component unmounts
  }, [])

  if (!isLoaded) {
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
              <div style={{ ...mapContainerStyle, height }}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={6}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    mapTypeId: 'roadmap',
                    styles: [
                      {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                      }
                    ]
                  }}
                >
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={location.position}
                      icon={getMarkerIcon(location.type)}
                      onClick={() => setSelectedLocation(location)}
                    />
                  ))}
                  
                  {selectedLocation && (
                    <InfoWindow
                      position={selectedLocation.position}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <div className="p-2">
                        <div className="flex items-center space-x-2 mb-2">
                          {getLocationIcon(selectedLocation.type)}
                          <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
                        <p className="text-xs text-gray-500 mb-2">{selectedLocation.province}</p>
                        <div className="space-y-1">
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
                          onClick={() => window.open(`https://www.google.com/maps?q=${selectedLocation.position.lat},${selectedLocation.position.lng}`, '_blank')}
                          className="mt-2 w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open in Google Maps</span>
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Layer Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Layers className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Map Layers</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Product Listings</span>
                  </div>
                  <button
                    onClick={() => setShowListings(!showListings)}
                    className={`p-1 rounded ${showListings ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {showListings ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Transport Routes</span>
                  </div>
                  <button
                    onClick={() => setShowTransport(!showTransport)}
                    className={`p-1 rounded ${showTransport ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {showTransport ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Backload Opportunities</span>
                  </div>
                  <button
                    onClick={() => setShowBackload(!showBackload)}
                    className={`p-1 rounded ${showBackload ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {showBackload ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
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
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedType === 'all' 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Locations ({DEMO_LOCATIONS.length})
                </button>
                <button
                  onClick={() => setSelectedType('listing')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
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
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
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
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
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
                    className="w-full bg-primary-600 text-white text-sm py-2 px-3 rounded hover:bg-primary-700 transition-colors"
                  >
                    Close Details
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps?q=${selectedLocation.position.lat},${selectedLocation.position.lng}`, '_blank')}
                    className="w-full bg-gray-100 text-gray-700 text-sm py-2 px-3 rounded hover:bg-gray-200 flex items-center justify-center space-x-2 transition-colors"
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
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${getLocationTypeColor(location.type)}`}
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








