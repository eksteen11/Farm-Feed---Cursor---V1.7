'use client'

import { useState } from 'react'
import { X, Package, Truck, MapPin, MessageSquare, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import Textarea from '@/shared/ui/Textarea'
import Select from '@/shared/ui/Select'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { SupabaseDatabaseService } from '@/shared/api/supabase'
import { Offer, Listing, User } from '@/types'
import { realEmailService } from '@/features/messaging/services/realEmailService'
import { formatDate } from '@/shared/utils/utils
import toast from 'react-hot-toast'

interface MakeOfferModalProps {
  listing: Listing
  buyer: User
  isOpen: boolean
  onClose: () => void
  onOfferCreated: (offer: Offer) => void
}

export default function MakeOfferModal({ 
  listing, 
  buyer, 
  isOpen, 
  onClose, 
  onOfferCreated 
}: MakeOfferModalProps) {
  const { currentUser } = useSupabaseStore()
  
  const [formData, setFormData] = useState({
    price: listing.price,
    quantity: Math.min(10, listing.availableQuantity),
    deliveryType: 'delivered' as 'ex-farm' | 'delivered',
    deliveryAddress: '',
    message: '',
    terms: 'Payment within 7 days of delivery',
    isNegotiable: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Early return after all hooks
  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    
    if (formData.quantity > listing.availableQuantity) {
      newErrors.quantity = `Quantity cannot exceed available quantity (${listing.availableQuantity})`
    }
    
    if (formData.deliveryType === 'delivered' && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required for delivered orders'
    }
    
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!currentUser) {
      toast.error('You must be logged in to make an offer')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log('🚀 Creating offer with Supabase...')
      console.log('📋 Current user:', currentUser)
      console.log('📋 Listing data:', listing)
      console.log('📋 Form data:', formData)
      
      // Create offer data for Supabase
      const offerData = {
        listing_id: listing.id,
        buyer_id: currentUser.id,
        seller_id: listing.sellerId,
        price: formData.price,
        quantity: formData.quantity,
        delivery_type: formData.deliveryType,
        delivery_address: formData.deliveryType === 'delivered' ? formData.deliveryAddress : null,
        message: formData.message,
        status: 'pending',
        is_negotiable: formData.isNegotiable,
        terms: formData.terms,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }
      
      console.log('📤 Offer data to submit:', offerData)
      
      // Create the offer in Supabase
      const newOffer = await SupabaseDatabaseService.createOffer(offerData)
      console.log('✅ Offer created successfully:', newOffer)
      
      // Send email notification to seller
      try {
        await realEmailService.sendOfferReceivedEmail(
          listing.seller.email,
          listing.seller.name,
          currentUser.name,
          currentUser.company || 'Individual',
          listing.title,
          formData.price,
          formData.quantity,
          formData.deliveryType,
          formData.message,
          formatDate(new Date(offerData.expires_at)),
          `${window.location.origin}/dashboard/offers?offer=${newOffer.id}`
        )
        console.log('✅ Email notification sent')
      } catch (error) {
        console.error('❌ Failed to send email notification:', error)
        // Don't fail the offer creation if email fails
      }
      
      // Show success message
      toast.success('Offer submitted successfully!')
      
      // Call the callback
      onOfferCreated(newOffer as Offer)
      
      // Close the modal
      onClose()
      
      // Reset form
      setFormData({
        price: listing.price,
        quantity: Math.min(10, listing.availableQuantity),
        deliveryType: 'delivered',
        deliveryAddress: '',
        message: '',
        terms: 'Payment within 7 days of delivery',
        isNegotiable: true
      })
      
    } catch (error) {
      console.error('❌ Error creating offer:', error)
      
      // Show more specific error message
      let errorMessage = 'Failed to create offer. Please try again.'
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        if (error.message.includes('offers') || error.message.includes('relation "offers" does not exist')) {
          errorMessage = 'Database setup required: Please run the enhanced-offer-system.sql script in Supabase.'
        } else if (error.message.includes('listing_id')) {
          errorMessage = 'Invalid listing. Please refresh the page and try again.'
        } else if (error.message.includes('buyer_id') || error.message.includes('seller_id')) {
          errorMessage = 'User authentication error. Please log out and log back in.'
        } else if (error.message.includes('placeholder')) {
          errorMessage = 'Database not configured: Please set up Supabase environment variables.'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      toast.error(errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const calculateTotal = () => {
    const subtotal = formData.price * formData.quantity
    const platformFee = formData.quantity // R1 per ton
    return subtotal + platformFee
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Make an Offer</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Listing Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{listing.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Current Price:</span>
                <span className="ml-2 text-green-600 font-semibold">
                  R{listing.price.toLocaleString()}/ton
                </span>
              </div>
              <div>
                <span className="font-medium">Available:</span>
                <span className="ml-2">{listing.availableQuantity} tons</span>
              </div>
              <div>
                <span className="font-medium">Location:</span>
                <span className="ml-2">{listing.location}</span>
              </div>
              <div>
                <span className="font-medium">Seller:</span>
                <span className="ml-2">{listing.seller.company || listing.seller.name}</span>
              </div>
            </div>
          </div>

          {/* Offer Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Price and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Your Price (R/ton)
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  min={0}
                  step={50}
                  className={errors.price ? 'border-red-500' : ''}
                  placeholder="Enter your price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Quantity (tons)
                </label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                  min={1}
                  max={listing.availableQuantity}
                  className={errors.quantity ? 'border-red-500' : ''}
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.quantity}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Truck className="w-4 h-4 inline mr-2" />
                Delivery Type
              </label>
              <Select
                value={formData.deliveryType}
                onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                options={[
                  { value: 'ex-farm', label: 'Ex-Farm (Self Collection)' },
                  { value: 'delivered', label: 'Delivered to Address' }
                ]}
              />
            </div>

            {/* Delivery Address */}
            {formData.deliveryType === 'delivered' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Delivery Address
                </label>
                <Textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  rows={3}
                  className={errors.deliveryAddress ? 'border-red-500' : ''}
                  placeholder="Enter your complete delivery address"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Message to Seller
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className={errors.message ? 'border-red-500' : ''}
                placeholder="Introduce yourself and explain your offer. Be specific about your requirements and timeline."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Payment Terms
              </label>
              <Input
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                placeholder="e.g., Payment within 7 days of delivery"
              />
            </div>

            {/* Negotiable Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isNegotiable"
                checked={formData.isNegotiable}
                onChange={(e) => handleInputChange('isNegotiable', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="isNegotiable" className="text-sm text-gray-700">
                This offer is negotiable
              </label>
            </div>

            {/* Total Calculation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Offer Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price per ton:</span>
                  <span>R{formData.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{formData.quantity} tons</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R{(formData.price * formData.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee (R1/ton):</span>
                  <span>R{formData.quantity}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">R{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
                {(errors.submit.includes('Database setup required') || errors.submit.includes('Database not configured')) && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Setup Required:</strong> See the <code className="bg-blue-100 px-1 rounded">OFFER_SYSTEM_SETUP.md</code> file for detailed setup instructions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Offer...' : 'Submit Offer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
