'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Calendar, 
  DollarSign,
  Clock,
  Truck,
  Plus,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface BackloadListing {
  id: string
  transporterId: string
  fromLocation: string
  toLocation: string
  availableDate: string
  capacity: number
  pricePerTon: number
  vehicleType: string
  specialRequirements: string
  contactInfo: string
  status: 'active' | 'inactive'
  createdAt: Date
}

export default function CreateBackloadListingPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    availableDate: '',
    capacity: '',
    pricePerTon: '',
    vehicleType: '',
    specialRequirements: '',
    contactInfo: ''
  })

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.fromLocation.trim()) {
      errors.fromLocation = 'From location is required'
    }
    
    if (!formData.toLocation.trim()) {
      errors.toLocation = 'To location is required'
    }
    
    if (!formData.availableDate) {
      errors.availableDate = 'Available date is required'
    }
    
    if (!formData.capacity || parseFloat(formData.capacity) <= 0) {
      errors.capacity = 'Valid capacity is required'
    }
    
    if (!formData.pricePerTon || parseFloat(formData.pricePerTon) <= 0) {
      errors.pricePerTon = 'Valid price per ton is required'
    }
    
    if (!formData.vehicleType) {
      errors.vehicleType = 'Vehicle type is required'
    }
    
    if (!formData.contactInfo.trim()) {
      errors.contactInfo = 'Contact information is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create backload listing object
      const backloadListing: BackloadListing = {
        id: `backload_${Date.now()}`,
        transporterId: currentUser?.id || '',
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        availableDate: formData.availableDate,
        capacity: parseFloat(formData.capacity),
        pricePerTon: parseFloat(formData.pricePerTon),
        vehicleType: formData.vehicleType,
        specialRequirements: formData.specialRequirements,
        contactInfo: formData.contactInfo,
        status: 'active',
        createdAt: new Date()
      }

      // In a real app, this would be saved to the database
      console.log('Backload listing created:', backloadListing)
      
      toast.success('Backload listing created successfully!')
      router.push('/transport')
    } catch (error) {
      toast.error('Failed to create backload listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Backload Listing</h1>
          </div>
          <p className="text-gray-600">
            List your available truck space for backload opportunities
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Route Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Location *
                    </label>
                    <Input
                      name="fromLocation"
                      value={formData.fromLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., Johannesburg, Gauteng"
                      className={formErrors.fromLocation ? 'border-red-500' : ''}
                    />
                    {formErrors.fromLocation && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.fromLocation}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Location *
                    </label>
                    <Input
                      name="toLocation"
                      value={formData.toLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., Cape Town, Western Cape"
                      className={formErrors.toLocation ? 'border-red-500' : ''}
                    />
                    {formErrors.toLocation && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.toLocation}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability & Capacity */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Availability & Capacity
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Date *
                    </label>
                    <Input
                      name="availableDate"
                      type="date"
                      value={formData.availableDate}
                      onChange={handleInputChange}
                      className={formErrors.availableDate ? 'border-red-500' : ''}
                    />
                    {formErrors.availableDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.availableDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity (Tons) *
                    </label>
                    <Input
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      className={formErrors.capacity ? 'border-red-500' : ''}
                    />
                    {formErrors.capacity && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.capacity}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Ton (R) *
                    </label>
                    <Input
                      name="pricePerTon"
                      type="number"
                      value={formData.pricePerTon}
                      onChange={handleInputChange}
                      placeholder="e.g., 150"
                      className={formErrors.pricePerTon ? 'border-red-500' : ''}
                    />
                    {formErrors.pricePerTon && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.pricePerTon}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  Vehicle Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.vehicleType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select vehicle type</option>
                      <option value="flatbed">Flatbed Truck</option>
                      <option value="refrigerated">Refrigerated Truck</option>
                      <option value="grain-tanker">Grain Tanker</option>
                      <option value="container">Container Truck</option>
                      <option value="tipper">Tipper Truck</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.vehicleType && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.vehicleType}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information *
                    </label>
                    <Input
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder="Phone number or email"
                      className={formErrors.contactInfo ? 'border-red-500' : ''}
                    />
                    {formErrors.contactInfo && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.contactInfo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Additional Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements (Optional)
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Any special requirements, loading/unloading conditions, etc."
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Backload Listing
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
