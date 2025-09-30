'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Truck, Route, MapPin, ExternalLink, Phone, Mail, Star, Clock, DollarSign, Users, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'
import { useUser } from './UserContext'

interface EnhancedGoogleMapsProps {
  height?: string
  className?: string
}

// Enhanced demo data with more realistic information
const DEMO_LOCATIONS = [
  {
    id: 1,
    name: 'Free State Maize Farm',
    position: { lat: -28.7282, lng: 26.7479 },
    type: 'listing',
    description: 'Premium Yellow Maize - 100 tons available',
    price: 'R3,200/ton',
    quantity: '100 tons',
    province: 'Free State',
    rating: 4.8,
    reviews: 23,
    contact: { phone: '+27 51 123 4567', email: 'john@freestatefarm.co.za' },
    availability: 'Available now',
    quality: 'Grade A',
    distance: 0 // Will be calculated
  },
  {
    id: 2,
    name: 'Gauteng Grain Co',
    position: { lat: -26.2041, lng: 28.0473 },
    type: 'listing',
    description: 'White Maize - 50 tons available',
    price: 'R3,150/ton',
    quantity: '50 tons',
    province: 'Gauteng',
    rating: 4.5,
    reviews: 18,
    contact: { phone: '+27 11 234 5678', email: 'info@gautenggrain.co.za' },
    availability: 'Available in 3 days',
    quality: 'Grade A',
    distance: 0
  },
  {
    id: 3,
    name: 'Western Cape Feed',
    position: { lat: -33.9249, lng: 18.4241 },
    type: 'listing',
    description: 'Soybean Meal - 25 tons available',
    price: 'R4,500/ton',
    quantity: '25 tons',
    province: 'Western Cape',
    rating: 4.9,
    reviews: 31,
    contact: { phone: '+27 21 345 6789', email: 'sales@wccapefeed.co.za' },
    availability: 'Available now',
    quality: 'Premium',
    distance: 0
  },
  {
    id: 4,
    name: 'KZN Transport Services',
    position: { lat: -29.8587, lng: 31.0218 },
    type: 'transport',
    description: 'KZN to Gauteng - 80 tons capacity',
    price: 'R2,500/ton',
    quantity: '80 tons',
    province: 'KwaZulu-Natal',
    rating: 4.6,
    reviews: 15,
    contact: { phone: '+27 31 456 7890', email: 'logistics@kzntransport.co.za' },
    availability: 'Available tomorrow',
    quality: 'Reliable',
    distance: 0
  },
  {
    id: 5,
    name: 'Mpumalanga Backload',
    position: { lat: -25.5653, lng: 30.5279 },
    type: 'backload',
    description: 'Mpumalanga to Free State - Available',
    price: 'R1,800/ton',
    quantity: '60 tons',
    province: 'Mpumalanga',
    rating: 4.3,
    reviews: 12,
    contact: { phone: '+27 13 567 8901', email: 'backload@mpumalanga.co.za' },
    availability: 'Available now',
    quality: 'Good',
    distance: 0
  },
  {
    id: 6,
    name: 'Northern Cape Seeds',
    position: { lat: -29.0467, lng: 21.8569 },
    type: 'listing',
    description: 'Sunflower Seeds - 75 tons available',
    price: 'R3,800/ton',
    quantity: '75 tons',
    province: 'Northern Cape',
    rating: 4.7,
    reviews: 27,
    contact: { phone: '+27 53 678 9012', email: 'seeds@northerncape.co.za' },
    availability: 'Available in 1 week',
    quality: 'Grade A',
    distance: 0
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

export default function EnhancedGoogleMaps({ height = '600px', className = '' }: EnhancedGoogleMapsProps) {
  const { userType, userLocation, searchRadius, setSearchRadius } = useUser()
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showListings, setShowListings] = useState(true)
  const [showTransport, setShowTransport] = useState(true)
  const [showBackload, setShowBackload] = useState(true)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [currentZoom, setCurrentZoom] = useState(6)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  // Calculate distances from user location
  const locationsWithDistance = useMemo(() => {
    if (!userLocation) return DEMO_LOCATIONS

    return DEMO_LOCATIONS.map(location => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        location.position.lat,
        location.position.lng
      )
      return { ...location, distance }
    }).filter(location => location.distance <= searchRadius)
  }, [userLocation, searchRadius])

  // Filter locations based on user type and preferences
  const filteredLocations = useMemo(() => {
    return locationsWithDistance.filter(location => {
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
  }, [locationsWithDistance, selectedType, showListings, showTransport, showBackload])

  // Calculate distance between two points
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

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

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    setCurrentZoom(mapInstance.getZoom() || 6)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Zoom control functions
  const zoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 6
      map.setZoom(Math.min(currentZoom + 1, 20))
      setCurrentZoom(map.getZoom() || 6)
    }
  }

  const zoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 6
      map.setZoom(Math.max(currentZoom - 1, 1))
      setCurrentZoom(map.getZoom() || 6)
    }
  }

  const resetView = () => {
    if (map) {
      map.setCenter(userLocation || center)
      map.setZoom(6)
      setCurrentZoom(6)
    }
  }

  const fitToMarkers = () => {
    if (map && filteredLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      filteredLocations.forEach(location => {
        bounds.extend(location.position)
      })
      map.fitBounds(bounds)
      setCurrentZoom(map.getZoom() || 6)
    }
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '=':
          case '+':
            event.preventDefault()
            zoomIn()
            break
          case '-':
            event.preventDefault()
            zoomOut()
            break
          case '0':
            event.preventDefault()
            resetView()
            break
          case 'f':
            event.preventDefault()
            fitToMarkers()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [map])

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
            <CardContent className="p-0 relative">
              {/* Custom Map Controls */}
              <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                {/* Zoom Controls */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={zoomIn}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={zoomOut}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                {/* Map Action Controls */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={resetView}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 transition-colors"
                    title="Reset View"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={fitToMarkers}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Fit to Markers"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Zoom Level Display */}
              <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
                <span className="text-sm text-gray-600">Zoom: {currentZoom}</span>
              </div>

              {/* Keyboard Shortcuts Help */}
              <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 max-w-xs">
                <div className="text-xs text-gray-600">
                  <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
                  <div>Ctrl/Cmd + + : Zoom In</div>
                  <div>Ctrl/Cmd + - : Zoom Out</div>
                  <div>Ctrl/Cmd + 0 : Reset View</div>
                  <div>Ctrl/Cmd + F : Fit to Markers</div>
                </div>
              </div>

              <div style={{ ...mapContainerStyle, height }}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={userLocation || center}
                  zoom={userLocation ? 8 : 6}
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
                    ],
                    zoomControl: false, // Disable default zoom controls
                    mapTypeControl: false, // Disable default map type control
                    streetViewControl: false, // Disable street view control
                    fullscreenControl: false, // Disable fullscreen control
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
                      <div className="p-3 max-w-xs">
                        <div className="flex items-center space-x-2 mb-2">
                          {getLocationIcon(selectedLocation.type)}
                          <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
                        <p className="text-xs text-gray-500 mb-2">{selectedLocation.province}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold">{selectedLocation.rating}</span>
                          <span className="text-xs text-gray-500">({selectedLocation.reviews} reviews)</span>
                        </div>
                        
                        {/* Price and Quantity */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-semibold text-green-600">{selectedLocation.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Quantity:</span>
                            <span className="font-semibold">{selectedLocation.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Distance:</span>
                            <span className="font-semibold">{selectedLocation.distance.toFixed(1)} km</span>
                          </div>
                        </div>
                        
                        {/* Contact Actions */}
                        <div className="space-y-2">
                          <button 
                            onClick={() => window.open(`tel:${selectedLocation.contact.phone}`)}
                            className="w-full bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700 flex items-center justify-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Now</span>
                          </button>
                          <button 
                            onClick={() => window.open(`mailto:${selectedLocation.contact.email}`)}
                            className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 flex items-center justify-center space-x-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </button>
                        </div>
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
          {/* User Type Specific Info */}
          {userType !== 'guest' && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {userType === 'buyer' && '🔍 What you can do:'}
                  {userType === 'seller' && '📢 What you can do:'}
                  {userType === 'transporter' && '🚛 What you can do:'}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {userType === 'buyer' && (
                    <>
                      <p>• Find suppliers near you</p>
                      <p>• Compare prices and quality</p>
                      <p>• Calculate total costs</p>
                      <p>• Contact suppliers directly</p>
                    </>
                  )}
                  {userType === 'seller' && (
                    <>
                      <p>• List your products</p>
                      <p>• Set competitive prices</p>
                      <p>• Find transporters</p>
                      <p>• Connect with buyers</p>
                    </>
                  )}
                  {userType === 'transporter' && (
                    <>
                      <p>• Find available loads</p>
                      <p>• Calculate transport rates</p>
                      <p>• Find backload opportunities</p>
                      <p>• Track your deliveries</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map Controls */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Map Controls</h3>
              <div className="space-y-3">
                {/* Zoom Level */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zoom Level:</span>
                  <span className="text-sm font-semibold text-blue-600">{currentZoom}</span>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={zoomIn}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In</span>
                  </button>
                  <button
                    onClick={zoomOut}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <ZoomOut className="w-4 h-4" />
                    <span>Zoom Out</span>
                  </button>
                  <button
                    onClick={resetView}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={fitToMarkers}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Fit All</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Radius */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Search Radius</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>10 km</span>
                  <span className="font-semibold">{searchRadius} km</span>
                  <span>200 km</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Map Layers</h3>
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
                    {showListings ? '👁️' : '🙈'}
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
                    {showTransport ? '👁️' : '🙈'}
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
                    {showBackload ? '👁️' : '🙈'}
                  </button>
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
                  <p className="text-xs text-gray-500">{selectedLocation.province}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{selectedLocation.rating}</span>
                    <span className="text-xs text-gray-500">({selectedLocation.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-semibold text-green-600">{selectedLocation.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold">{selectedLocation.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-semibold">{selectedLocation.distance.toFixed(1)} km</span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <button 
                    onClick={() => window.open(`tel:${selectedLocation.contact.phone}`)}
                    className="w-full bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </button>
                  <button 
                    onClick={() => window.open(`mailto:${selectedLocation.contact.email}`)}
                    className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
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
                <span className="text-sm text-gray-500 ml-2">({filteredLocations.length})</span>
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
                      <span className="text-gray-500">{location.distance.toFixed(1)} km</span>
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
