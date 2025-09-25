'use client'

import React, { useState, useEffect } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { supabase } from '@/lib/supabase'
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
import toast from 'react-hot-toast'

export default function CreateListingPage() {
  const { currentUser, isAuthenticated } = useSupabaseStore()
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
    deliveryOption: 'both', // 'buyer', 'seller', 'both'
    images: [] as string[],
    videos: [] as string[],
    paymentTerms: '',
    expiresAt: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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



  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.productName.trim()) newErrors.productName = 'Product name is required'
    if (!formData.areaLocation.trim()) newErrors.areaLocation = 'Area/Location is required'
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required'
    if (!formData.grade.trim()) newErrors.grade = 'Grade is required'
    if (!formData.pricePerMeasureUnit || Number(formData.pricePerMeasureUnit) <= 0) newErrors.pricePerMeasureUnit = 'Valid price is required'
    if (!formData.expiresAt) newErrors.expiresAt = 'Expiry date is required'
    
    // Validate delivery option - must be selected
    if (!formData.deliveryOption) {
      newErrors.deliveryOption = 'Delivery option is required'
    }

    // Debug: Log the errors to help identify the issue
    console.log('Validation errors:', newErrors)
    console.log('Form data:', formData)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 Starting form submission...')
    console.log('👤 Current user:', currentUser)
    console.log('🔐 Is authenticated:', isAuthenticated)
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (!currentUser) {
      console.error('❌ No current user found!')
      toast.error('You must be logged in to create a listing')
      return
    }
    
    console.log('✅ User is authenticated:', currentUser.name, currentUser.email)

    setIsLoading(true)

    try {
      console.log('🚀 Creating listing with Supabase...')
      
      // Use the generic product for all listings
      const productId = '00000000-0000-0000-0000-000000000001'; // Generic product ID
      
      // Create the listing data directly for Supabase (matching database schema)
      const listingData = {
        title: formData.productName,
        description: `${formData.grade} - ${formData.extraNotes}`,
        seller_id: currentUser.id,
        product_id: productId,
        price: Number(formData.pricePerMeasureUnit),
        currency: 'ZAR',
        quantity: Number(formData.quantity),
        available_quantity: Number(formData.quantity),
        location: formData.areaLocation,
        images: formData.images,
        videos: formData.videos,
        is_active: true,
        expires_at: new Date(formData.expiresAt).toISOString(),
        delivery_options: {
          ex_farm: formData.deliveryOption === 'buyer' || formData.deliveryOption === 'both',
          delivered: formData.deliveryOption === 'seller' || formData.deliveryOption === 'both'
        },
        quality_grade: 'A',
        specifications: {
          protein: formData.protein ? `${formData.protein}%` : '',
          moisture: formData.moisture ? `${formData.moisture}%` : '',
          fibre: formData.fibre ? `${formData.fibre}%` : '',
          me_energy: formData.meEnergy ? `${formData.meEnergy} MJ/kg` : '',
          packaging: formData.packaging,
          grade: formData.grade
        },
        certificates: [],
        payment_terms: formData.paymentTerms,
        map_visibility: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('📝 Listing data:', listingData)

      // Call Supabase directly to create the listing
      const { data: newListing, error: createError } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single()

      if (createError) {
        throw createError
      }
      
      console.log('✅ Listing created successfully:', newListing)
      toast.success('Listing created successfully!')
      router.push('/listings')
      
    } catch (error) {
      console.error('❌ Error creating listing:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      console.error('❌ Current user:', currentUser)
      console.error('❌ Is authenticated:', isAuthenticated)
      
      // Show more specific error message
      if (error.message) {
        toast.error(`Failed to create listing: ${error.message}`)
      } else {
        toast.error('Failed to create listing. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const locations = ['Free State', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Mpumalanga', 'Limpopo', 'North West', 'Eastern Cape', 'Northern Cape']

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please log in to create a listing.</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
            <CardTitle className="p-6 pb-4">Pricing *</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per unit (ZAR) *
                </label>
                <Input
                  type="number"
                  placeholder="3200"
                  value={formData.pricePerMeasureUnit}
                  onChange={(e) => handleInputChange('pricePerMeasureUnit', e.target.value)}
                  error={errors.pricePerMeasureUnit}
                />
                {errors.pricePerMeasureUnit && (
                  <p className="mt-1 text-sm text-red-600">{errors.pricePerMeasureUnit}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardTitle className="p-6 pb-4">Payment Terms</CardTitle>
            <CardContent className="p-6 pt-0">
              <p className="text-sm text-gray-600 mb-4">
                Define your payment conditions and preferred transaction methods
              </p>
              <div>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                  placeholder="e.g., 30% deposit on order, 70% on delivery. Bank transfer preferred..."
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>


          {/* Delivery Options */}
          <Card>
            <CardTitle className="p-6 pb-4">Delivery Options *</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="buyer"
                    checked={formData.deliveryOption === 'buyer'}
                    onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Buyer can collect</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="seller"
                    checked={formData.deliveryOption === 'seller'}
                    onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Seller will deliver</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="both"
                    checked={formData.deliveryOption === 'both'}
                    onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Seller can deliver, but buyer can also collect</span>
                </label>
              </div>
              {errors.deliveryOption && (
                <p className="text-sm text-red-600">{errors.deliveryOption}</p>
              )}
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardTitle className="p-6 pb-4">Media Upload</CardTitle>
            <CardContent className="p-6 pt-0 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const imageUrls = files.map(file => URL.createObjectURL(file))
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...imageUrls]
                      }))
                    }}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Videos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const videoUrls = files.map(file => URL.createObjectURL(file))
                      setFormData(prev => ({
                        ...prev,
                        videos: [...prev.videos, ...videoUrls]
                      }))
                    }}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload videos</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to 50MB each</p>
                    </div>
                  </label>
                </div>
                {formData.videos.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="relative">
                        <video
                          src={video}
                          className="w-full h-32 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              videos: prev.videos.filter((_, i) => i !== index)
                            }))
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          {/* Expiry Date */}
          <Card>
            <CardTitle className="p-6 pb-4">Listing Expiry *</CardTitle>
            <CardContent className="p-6 pt-0 space-y-4">
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
                <p className="mt-1 text-sm text-gray-500">
                  When should this listing expire? (Minimum 30 days from today)
                </p>
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
