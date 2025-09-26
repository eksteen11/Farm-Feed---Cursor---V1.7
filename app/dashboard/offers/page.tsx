'use client'

import { useSupabaseStore } from '@/store/useSupabaseStore'
import { canUserPerformAction } from '@/types'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import SellerOfferDashboard from '@/components/offers/SellerOfferDashboard'
import { useEffect, useState } from 'react'

export default function OffersPage() {
  const { currentUser, getCurrentUser } = useSupabaseStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    // Initialize user data when component mounts
    const initData = async () => {
      console.log('📋 Offers: Initializing data...')
      await getCurrentUser()
    }
    initData()
  }, [])
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your offers</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user can sell (has seller capabilities)
  const canSell = canUserPerformAction(currentUser, 'sell')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {canSell ? (
          <SellerOfferDashboard currentUser={currentUser} />
        ) : (
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers to manage</h3>
            <p className="text-gray-600 mb-4">
              You need seller permissions to manage offers. Contact support to upgrade your account.
            </p>
            <Link href="/listings">
              <Button>Browse Listings</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}