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
    productName: '',
    areaLocation: '',
    quantity: '',
    measureUnit: 'ton', // ton, kg, litre, ml, cubic metres
    packaging: 'Bulk', // Bulk, 25kg bag, 50kg bag, 250kg bags, 300kg bags, 500kg bags, 1000kg bags
    grade: '',
    extraNotes: '',
    protein: '',
    moisture: '',
    fibre: '',
    meEnergy: '',
    pricePerMeasureUnit: '',
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
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || !currentUser) {
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

    if (!formData.productName.trim()) newErrors.productName = 'Product name is required'
    if (!formData.areaLocation.trim()) newErrors.areaLocation = 'Area/Location is required'
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required'
    if (!formData.grade.trim()) newErrors.grade = 'Grade is required'
    if (!formData.pricePerMeasureUnit || Number(formData.pricePerMeasureUnit) <= 0) newErrors.pricePerMeasureUnit = 'Valid price is required'
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
        title: formData.productName,
        description: `${formData.grade} - ${formData.extraNotes}`,
        product: {
          id: 'custom-product',
          name: formData.productName,
          category: 'grain' as const,
          description: formData.extraNotes,
          specifications: {
            protein: formData.protein ? `${formData.protein}%` : '',
            moisture: formData.moisture ? `${formData.moisture}%` : '',
            fibre: formData.fibre ? `${formData.fibre}%` : '',
            meEnergy: formData.meEnergy ? `${formData.meEnergy} MJ/kg` : '',
            packaging: formData.packaging,
            grade: formData.grade
          },
          unit: formData.measureUnit as 'kg' | 'ton' | 'bag' | 'liter',
          minQuantity: 1,
          maxQuantity: 10000
        },
        price: Number(formData.pricePerMeasureUnit),
        currency: 'ZAR' as const,
        quantity: Number(formData.quantity),
        availableQuantity: Number(formData.quantity),
        location: formData.areaLocation,
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
        specifications: {
          protein: formData.protein ? `${formData.protein}%` : '',
          moisture: formData.moisture ? `${formData.moisture}%` : '',
          fibre: formData.fibre ? `${formData.fibre}%` : '',
          meEnergy: formData.meEnergy ? `${formData.meEnergy} MJ/kg` : '',
          packaging: formData.packaging,
          grade: formData.grade
        },
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
          {/* Product Information */}
          <Card>
            <CardTitle className="p-6 pb-4">Product Information</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  placeholder="e.g., Premium Yellow Maize"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  error={errors.productName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Location *
                </label>
                <Input
                  placeholder="e.g., Free State, Bloemfontein"
                  value={formData.areaLocation}
                  onChange={(e) => handleInputChange('areaLocation', e.target.value)}
                  error={errors.areaLocation}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
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
                    Measure Unit *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    value={formData.measureUnit}
                    onChange={(e) => handleInputChange('measureUnit', e.target.value)}
                  >
                    <option value="ton">Ton</option>
                    <option value="kg">Kg</option>
                    <option value="litre">Litre</option>
                    <option value="ml">ml</option>
                    <option value="cubic metres">Cubic Metres</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Packaging *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    value={formData.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                  >
                    <option value="Bulk">Bulk</option>
                    <option value="25kg bag">25kg bag</option>
                    <option value="50kg bag">50kg bag</option>
                    <option value="250kg bags">250kg bags</option>
                    <option value="300kg bags">300kg bags</option>
                    <option value="500kg bags">500kg bags</option>
                    <option value="1000kg bags">1000kg bags</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade *
                  </label>
                  <Input
                    placeholder="e.g., Grade A, Premium Quality"
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    error={errors.grade}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  placeholder="Any additional information about the product..."
                  value={formData.extraNotes}
                  onChange={(e) => handleInputChange('extraNotes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quality Specifications */}
          <Card>
            <CardTitle className="p-6 pb-4">Quality Specifications</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="9.2"
                    value={formData.protein}
                    onChange={(e) => handleInputChange('protein', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moisture (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="13.5"
                    value={formData.moisture}
                    onChange={(e) => handleInputChange('moisture', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fibre (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="2.8"
                    value={formData.fibre}
                    onChange={(e) => handleInputChange('fibre', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ME Energy (MJ/kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="12.5"
                    value={formData.meEnergy}
                    onChange={(e) => handleInputChange('meEnergy', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardTitle className="p-6 pb-4">Pricing</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per {formData.measureUnit} (ZAR) *
                </label>
                <Input
                  type="number"
                  placeholder="3200"
                  value={formData.pricePerMeasureUnit}
                  onChange={(e) => handleInputChange('pricePerMeasureUnit', e.target.value)}
                  error={errors.pricePerMeasureUnit}
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
