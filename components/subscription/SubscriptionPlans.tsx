'use client'

import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptionService'
import { Check, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SubscriptionPlansProps {
  onSubscribe?: (plan: keyof typeof SUBSCRIPTION_PLANS) => void
  showCurrentPlan?: boolean
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  onSubscribe, 
  showCurrentPlan = true 
}) => {
  const { currentUser } = useStore()
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof SUBSCRIPTION_PLANS | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async (plan: keyof typeof SUBSCRIPTION_PLANS) => {
    if (!currentUser) return
    
    setIsProcessing(true)
    try {
      if (onSubscribe) {
        await onSubscribe(plan)
      }
      setSelectedPlan(plan)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getCurrentPlan = () => {
    if (!currentUser) return null
    // This would come from the user's subscription data
    return currentUser.subscriptionStatus === 'active' ? 'basic' : null
  }

  const currentPlan = getCurrentPlan()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Unlock the full potential of Farm Feed with our subscription plans
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
        {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, plan]) => {
          const isCurrentPlan = currentPlan === planKey
          const isSelected = selectedPlan === planKey
          
          return (
            <div
              key={planKey}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-200 ${
                isCurrentPlan
                  ? 'border-green-500 bg-green-50'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    R{plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>

                <ul className="space-y-4 mb-8 text-left">
                  {Object.entries(plan.features).map(([feature, value]) => (
                    <li key={feature} className="flex items-start">
                                        {value === true || value === -1 ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                      <span className="text-gray-700">
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
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planKey as keyof typeof SUBSCRIPTION_PLANS)}
                  disabled={isCurrentPlan || isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    isCurrentPlan
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isProcessing
                    ? 'Processing...'
                    : 'Subscribe Now'}
                </button>

                {isCurrentPlan && (
                  <p className="mt-3 text-sm text-green-600">
                    ✓ Active until {formatDate(currentUser?.subscriptionExpiry)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          All plans include access to our marketplace, transport coordination, and basic support.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          * Prices are in South African Rand (ZAR). Billing occurs monthly.
        </p>
      </div>
    </div>
  )
}

export default SubscriptionPlans
