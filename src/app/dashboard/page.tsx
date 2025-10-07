'use client'

import { useSupabaseStore } from '@/store/useSupabaseStore'
import { getUserCapabilities, canUserPerformAction } from '@/types'
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  FileText, 
  MessageSquare, 
  Settings,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import { useEffect, useState } from 'react'
import ClientOnly from '@/shared/ui/ClientOnly'

// Dashboard sections configuration
const DASHBOARD_SECTIONS = [
  {
    id: 'overview',
    title: 'Overview & Analytics',
    description: 'Your business performance and key metrics',
    icon: TrendingUp,
    route: '/dashboard/overview',
    capabilities: ['sell', 'buy', 'transport'],
    isVisible: () => true
  },
  {
    id: 'listings',
    title: 'My Listings',
    description: 'Manage your product and transport listings',
    icon: Package,
    route: '/dashboard/listings',
    capabilities: ['sell', 'transport'],
    isVisible: (user: any) => canUserPerformAction(user, 'sell') || canUserPerformAction(user, 'transport')
  },
  {
    id: 'offers',
    title: 'Offers & Negotiations',
    description: 'Track your offers and received offers',
    icon: ShoppingCart,
    route: '/dashboard/offers',
    capabilities: ['sell', 'buy'],
    isVisible: (user: any) => canUserPerformAction(user, 'sell') || canUserPerformAction(user, 'buy')
  },
  {
    id: 'transport',
    title: 'Transport Management',
    description: 'Manage transport requests and quotes',
    icon: Truck,
    route: '/dashboard/transport',
    capabilities: ['transport', 'buy', 'sell'],
    isVisible: (user: any) => canUserPerformAction(user, 'transport') || canUserPerformAction(user, 'buy') || canUserPerformAction(user, 'sell')
  },
  {
    id: 'deals',
    title: 'Active Deals',
    description: 'Monitor your ongoing transactions',
    icon: CheckCircle,
    route: '/dashboard/deals',
    capabilities: ['sell', 'buy', 'transport'],
    isVisible: () => true
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Contracts, invoices, and agreements',
    icon: FileText,
    route: '/dashboard/documents',
    capabilities: ['sell', 'buy', 'transport'],
    isVisible: () => true
  },
  {
    id: 'messages',
    title: 'Messages & Chat',
    description: 'Communicate with other users',
    icon: MessageSquare,
    route: '/dashboard/messages',
    capabilities: ['sell', 'buy', 'transport'],
    isVisible: () => true
  },
  {
    id: 'settings',
    title: 'Settings & Profile',
    description: 'Manage your account and preferences',
    icon: Settings,
    route: '/dashboard/settings',
    capabilities: ['sell', 'buy', 'transport'],
    isVisible: () => true
  }
]

export default function UnifiedDashboard() {
  const { currentUser, listings, offers, deals, transportRequests, transportQuotes, getCurrentUser, initializeData, fetchListings, fetchOffers } = useSupabaseStore()
  const [isClient, setIsClient] = useState(false)
  
  // Debug logging
  console.log('Dashboard - currentUser:', currentUser)
  console.log('Dashboard - currentUser.name:', currentUser?.name)
  console.log('Dashboard - currentUser.email:', currentUser?.email)
  
  useEffect(() => {
    setIsClient(true)
    // Initialize user data when component mounts
    const initUser = async () => {
      console.log('🏠 Dashboard: Initializing user data...')
      
      // Force refresh current user data
      const user = await getCurrentUser()
      console.log('🏠 Dashboard: Current user:', user ? user.name : 'No user')
      console.log('🏠 Dashboard: User capabilities:', user?.capabilities)
      
      if (user) {
        await initializeData()
        await fetchListings() // Fetch all listings
        await fetchOffers() // Fetch all offers
        
        // Force refresh the store state
        const { offers: refreshedOffers } = useSupabaseStore.getState()
        console.log('🏠 Dashboard: Fetched listings:', listings.length)
        console.log('🏠 Dashboard: Fetched offers:', offers.length)
        console.log('🏠 Dashboard: Refreshed offers:', refreshedOffers.length)
      } else {
        console.log('❌ Dashboard: No user found, redirecting to login')
        window.location.href = '/login'
      }
    }
    initUser()
  }, [])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userCapabilities = getUserCapabilities(currentUser)
  
  // Debug logging
  console.log('Dashboard - currentUser.id:', currentUser?.id)
  console.log('Dashboard - listings:', listings?.length || 0)
  console.log('Dashboard - offers:', offers?.length || 0)
  console.log('Dashboard - deals:', deals?.length || 0)
  
  // Fix: Use the correct property names from Supabase data
  const userListings = (listings || []).filter(l => l.seller?.id === currentUser?.id)
  
  // For buyers: show offers they made
  const myOffers = (offers || []).filter(o => o.buyerId === currentUser?.id)
  // For sellers: show offers they received (need to cross-reference with listings)
  const receivedOffers = (offers || []).filter(o => {
    const listing = listings?.find(l => l.id === o.listingId)
    return listing?.seller?.id === currentUser?.id
  })
  
  const userDeals = (deals || []).filter(d => d.buyerId === currentUser?.id || d.sellerId === currentUser?.id)
  
  // Force debug the data
  console.log('🔍 DEBUG - Current user ID:', currentUser?.id)
  console.log('🔍 DEBUG - Total offers:', offers?.length || 0)
  console.log('🔍 DEBUG - My offers:', myOffers.length)
  console.log('🔍 DEBUG - Received offers:', receivedOffers.length)
  console.log('🔍 DEBUG - First offer:', offers?.[0])
  
  console.log('Dashboard - userListings:', userListings.length)
  console.log('Dashboard - myOffers:', myOffers.length)
  console.log('Dashboard - receivedOffers:', receivedOffers.length)
  console.log('Dashboard - userDeals:', userDeals.length)

  const formatDate = (date: Date) => {
    if (!isClient) return 'Loading...'
    return date.toLocaleDateString()
  }

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name || currentUser?.email?.split('@')[0] || 'there'}!</h1>
                <p className="text-gray-600 mt-2">
                  Manage your Farm Feed activities from one unified dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Calculate dashboard stats
  const userTransportRequests = transportRequests.filter(t => t.requesterId === currentUser.id)
  const userTransportQuotes = transportQuotes.filter(t => t.transporterId === currentUser.id)

  const dashboardStats = {
    totalListings: userListings.length,
    totalOffers: myOffers.length + receivedOffers.length,
    totalDeals: userDeals.length,
    totalTransportRequests: userTransportRequests.length,
    totalTransportQuotes: userTransportQuotes.length,
    activeListings: userListings.filter(l => l.isActive).length,
    pendingOffers: myOffers.filter(o => o.status === 'pending').length + receivedOffers.filter(o => o.status === 'pending').length,
    completedDeals: userDeals.filter(d => d.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientOnly>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {currentUser?.name || currentUser?.email?.split('@')[0] || 'there'}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your Farm Feed activities from one place
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subscription</p>
                  <p className="font-semibold text-green-600 capitalize">
                    {currentUser.subscriptionStatus}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Capabilities</p>
                  <p className="font-semibold text-green-600">
                    {userCapabilities.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.totalListings} total listings
              </p>
            </CardContent>
          </Card>

          <Link href="/dashboard/offers">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.pendingOffers}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.totalOffers} total offers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.completedDeals}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.totalDeals} total deals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transport</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalTransportRequests}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.totalTransportQuotes} quotes given
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {canUserPerformAction(currentUser, 'sell') && (
              <Link href="/seller/create-listing">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create New Listing</span>
                </Button>
              </Link>
            )}
            {canUserPerformAction(currentUser, 'transport') && (
              <Link href="/dashboard/transport/create">
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Create Transport Listing</span>
                </Button>
              </Link>
            )}
            <Link href="/dashboard/offers">
              <Button variant="secondary" className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>View All Offers</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DASHBOARD_SECTIONS.map((section) => {
              if (!section.isVisible(currentUser)) return null
              
              const Icon = section.icon
              return (
                <Link key={section.id} href={section.route}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {userListings.slice(0, 3).map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">New listing: {listing.title}</p>
                      <p className="text-sm text-gray-500">Created {formatDate(listing.createdAt)}</p>
                    </div>
                    <span className="text-sm text-gray-500">R{listing.price}/ton</span>
                  </div>
                ))}
                {myOffers.slice(0, 2).map((offer) => (
                  <div key={offer.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">Offer made: R{offer.price}/ton</p>
                      <p className="text-sm text-gray-500">Status: {offer.status}</p>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(offer.createdAt)}</span>
                  </div>
                ))}
                {userDeals.slice(0, 2).map((deal) => (
                  <div key={deal.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="font-medium">Deal completed: {deal.quantity} tons</p>
                      <p className="text-sm text-gray-500">Total: R{deal.finalPrice * deal.quantity}</p>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(deal.createdAt)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </ClientOnly>
    </div>
  )
}
