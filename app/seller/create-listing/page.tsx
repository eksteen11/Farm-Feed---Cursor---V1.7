'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  Package, 
  MapPin, 
  DollarSign, 
  Calendar,
  Upload,
  X,
  Plus,
  Save,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { mockProducts } from '@/lib/mockData'
import toast from 'react-hot-toast'

export default function CreateListingPage() {
  const { currentUser, isAuthenticated, createListing } = useStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productId: '',
    price: '',
    quantity: '',
    availableQuantity: '',
    location: '',
    deliveryOptions: {
      exFarm: true,
      delivered: false,
      ownTransport: {
        available: false,
        pricePerKm: '',
        availableDates: [] as Date[],
        routes: [] as string[]
      }
    },
    images: [] as string[],
    specialConditions: '',
    expiresAt: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }
    
    if (currentUser.role !== 'seller') {
      router.push('/')
      return
    }
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || !currentUser || currentUser.role !== 'seller') {
    return null
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleDeliveryOptionChange = (option: 'exFarm' | 'delivered') => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        [option]: !prev.deliveryOptions[option]
      }
    }))
  }

  const handleOwnTransportChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        ownTransport: {
          ...prev.deliveryOptions.ownTransport,
          [field]: value
        }
      }
    }))
  }

  const addRoute = () => {
    const newRoute = prompt('Enter route (e.g., Free State → Johannesburg):')
    if (newRoute && newRoute.trim()) {
      setFormData(prev => ({
        ...prev,
        deliveryOptions: {
          ...prev.deliveryOptions,
          ownTransport: {
            ...prev.deliveryOptions.ownTransport,
            routes: [...prev.deliveryOptions.ownTransport.routes, newRoute.trim()]
          }
        }
      }))
    }
  }

  const removeRoute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        ownTransport: {
          ...prev.deliveryOptions.ownTransport,
          routes: prev.deliveryOptions.ownTransport.routes.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const addAvailableDate = () => {
    const newDate = prompt('Enter available date (YYYY-MM-DD):')
    if (newDate && newDate.trim()) {
      const date = new Date(newDate)
      if (!isNaN(date.getTime())) {
        setFormData(prev => ({
          ...prev,
          deliveryOptions: {
            ...prev.deliveryOptions,
            ownTransport: {
              ...prev.deliveryOptions.ownTransport,
              availableDates: [...prev.deliveryOptions.ownTransport.availableDates, date]
            }
          }
        }))
      }
    }
  }

  const removeAvailableDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        ownTransport: {
          ...prev.deliveryOptions.ownTransport,
          availableDates: prev.deliveryOptions.ownTransport.availableDates.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.productId) newErrors.productId = 'Product is required'
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.expiresAt) newErrors.expiresAt = 'Expiry date is required'

    // Validate own transport if enabled
    if (formData.deliveryOptions.ownTransport.available) {
      if (!formData.deliveryOptions.ownTransport.pricePerKm || Number(formData.deliveryOptions.ownTransport.pricePerKm) <= 0) {
        newErrors['deliveryOptions.ownTransport.pricePerKm'] = 'Valid price per km is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)

    try {
      // Create the listing object
      const listingData = {
        title: formData.title,
        description: formData.description,
        product: mockProducts.find(p => p.id === formData.productId)!,
        price: Number(formData.price),
        currency: 'ZAR' as const,
        quantity: Number(formData.quantity),
        availableQuantity: Number(formData.availableQuantity || formData.quantity),
        location: formData.location,
        images: formData.images,
        isActive: true,
        expiresAt: new Date(formData.expiresAt),
        deliveryOptions: {
          ...formData.deliveryOptions,
          ownTransport: {
            ...formData.deliveryOptions.ownTransport,
            pricePerKm: Number(formData.deliveryOptions.ownTransport.pricePerKm) || 0
          }
        },
        qualityGrade: 'A' as const,
        specifications: {},
        certificates: [],
        specialConditions: formData.specialConditions,
        mapVisibility: true
      }

      // Call the store action to create listing
      await createListing(listingData)
      
      toast.success('Listing created successfully!')
      router.push('/seller/dashboard')
      
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const locations = ['Free State', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Mpumalanga', 'Limpopo', 'North West', 'Eastern Cape', 'Northern Cape']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="secondary" 
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          </div>
          <p className="text-gray-600">
            Add your agricultural products to the marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardTitle className="p-6 pb-4">Basic Information</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Title *
                </label>
                <Input
                  placeholder="e.g., Premium Yellow Maize - Free State"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  placeholder="Describe your product, quality, specifications, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    value={formData.productId}
                    onChange={(e) => handleInputChange('productId', e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {mockProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Quantity */}
          <Card>
            <CardTitle className="p-6 pb-4">Pricing & Quantity</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per ton (ZAR) *
                  </label>
                  <Input
                    type="number"
                    placeholder="3200"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    error={errors.price}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Quantity (tons) *
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    error={errors.quantity}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity (tons)
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.availableQuantity}
                    onChange={(e) => handleInputChange('availableQuantity', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave empty to use total quantity</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  error={errors.expiresAt}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardTitle className="p-6 pb-4">Delivery Options</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deliveryOptions.exFarm}
                    onChange={() => handleDeliveryOptionChange('exFarm')}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Ex-Farm Collection</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deliveryOptions.delivered}
                    onChange={() => handleDeliveryOptionChange('delivered')}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Delivered to Buyer</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deliveryOptions.ownTransport.available}
                    onChange={() => handleOwnTransportChange('available', !formData.deliveryOptions.ownTransport.available)}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Provide Own Transport</span>
                </label>
              </div>

              {formData.deliveryOptions.ownTransport.available && (
                <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per km (ZAR)
                    </label>
                    <Input
                      type="number"
                      placeholder="2.50"
                      value={formData.deliveryOptions.ownTransport.pricePerKm}
                      onChange={(e) => handleOwnTransportChange('pricePerKm', e.target.value)}
                      error={errors['deliveryOptions.ownTransport.pricePerKm']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Routes
                    </label>
                    <div className="space-y-2">
                      {formData.deliveryOptions.ownTransport.routes.map((route, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{route}</span>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            leftIcon={<X className="w-4 h-4" />}
                            onClick={() => removeRoute(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={addRoute}
                      >
                        Add Route
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Dates
                    </label>
                    <div className="space-y-2">
                      {formData.deliveryOptions.ownTransport.availableDates.map((date, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                            {date.toLocaleDateString()}
                          </span>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            leftIcon={<X className="w-4 h-4" />}
                            onClick={() => removeAvailableDate(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={addAvailableDate}
                      >
                        Add Date
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardTitle className="p-6 pb-4">Additional Information</CardTitle>
            <CardContent className="p-6 pt-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Conditions
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  placeholder="Any special terms, quality guarantees, or conditions..."
                  value={formData.specialConditions}
                  onChange={(e) => handleInputChange('specialConditions', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
