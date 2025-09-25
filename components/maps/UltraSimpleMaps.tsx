'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Truck, Route, MapPin, ExternalLink } from 'lucide-react'

interface UltraSimpleMapsProps {
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

export default function UltraSimpleMaps({ height = '600px', className = '' }: UltraSimpleMapsProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<string>('all')

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

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div 
                className="w-full rounded-lg bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 relative overflow-hidden" 
                style={{ height }}
              >
                {/* South Africa Map Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🗺️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">South Africa Agricultural Map</h3>
                    <p className="text-gray-600 mb-4">Interactive location map with clickable markers</p>
                    
                    {/* Location Dots */}
                    <div className="relative w-80 h-60 mx-auto">
                      {DEMO_LOCATIONS.map((location, index) => {
                        let dotColor = 'bg-green-500'
                        if (location.type === 'transport') dotColor = 'bg-red-500'
                        if (location.type === 'backload') dotColor = 'bg-blue-500'
                        
                        return (
                          <div 
                            key={location.id}
                            className={`absolute w-4 h-4 ${dotColor} rounded-full animate-pulse cursor-pointer hover:scale-125 transition-transform shadow-lg`}
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
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
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
                    View Details
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








