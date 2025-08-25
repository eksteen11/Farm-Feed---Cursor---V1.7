'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { SubscriptionService } from '@/lib/subscriptionService'
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

const SubscriptionPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadUserSubscription()
  }, [isAuthenticated, currentUser])

  const loadUserSubscription = async () => {
    if (!currentUser) return
    
    try {
      const userSubscription = await SubscriptionService.getSubscriptionByUserId(currentUser.id)
      setSubscription(userSubscription)
    } catch (error) {
      console.error('Failed to load subscription:', error)
    }
  }

  const handleSubscribe = async (plan: string) => {
    if (!currentUser) return
    
    setIsLoading(true)
    try {
      // Create subscription
      const newSubscription = await SubscriptionService.createSubscription(
        currentUser.id, 
        plan as any
      )
      
      // Process payment (mock)
      const paymentSuccess = await SubscriptionService.processPayment(
        newSubscription.id, 
        'paystack'
      )
      
      if (paymentSuccess) {
        // Update subscription status
        await SubscriptionService.updateSubscriptionStatus(newSubscription.id, 'active')
        
        // Reload subscription data
        await loadUserSubscription()
        
        // Show success message
        alert('Subscription activated successfully!')
      } else {
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to create subscription. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view subscription plans.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Subscription Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your Farm Feed subscription and access
              </p>
            </div>
            
            {subscription && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : subscription.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <SubscriptionPlans 
        onSubscribe={handleSubscribe}
        showCurrentPlan={true}
      />

      {subscription && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Subscription Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {subscription.plan}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-lg font-medium text-gray-900">
                  R{subscription.price}/{subscription.currency}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {formatDate(subscription.endDate)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Auto-Renew</p>
                <p className="text-lg font-medium text-gray-900">
                  {subscription.autoRenew ? 'Yes' : 'No'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Next Billing</p>
                <p className="text-lg font-medium text-gray-900">
                  {formatDate(subscription.nextBillingDate)}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-3">Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(subscription.features).map(([feature, value]) => (
                  <div key={feature} className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-3 ${
                      value === true || value === -1 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-700">
                      {feature === 'listings' && value === -1 && 'Unlimited listings'}
                      {feature === 'listings' && value !== -1 && `${value} listings per month`}
                      {feature === 'offers' && value === -1 && 'Unlimited offers'}
                      {feature === 'offers' && value !== -1 && `${value} offers per month`}
                      {feature === 'transportRequests' && value === -1 && 'Unlimited transport requests'}
                      {feature === 'transportRequests' && value !== -1 && `${value} transport requests per month`}
                      {feature === 'chatAccess' && value && 'Chat access'}
                      {feature === 'analytics' && value && 'Advanced analytics'}
                      {feature === 'analytics' && !value && 'Basic analytics'}
                      {feature === 'prioritySupport' && value && 'Priority support'}
                      {feature === 'prioritySupport' && !value && 'Standard support'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionPage
