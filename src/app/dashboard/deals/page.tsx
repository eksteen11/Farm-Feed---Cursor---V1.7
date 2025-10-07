'use client'

import React, { useState, useEffect } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import { 
  Clock, 
  CheckCircle, 
  X, 
  Truck,
  DollarSign,
  Package,
  User,
  Calendar,
  TrendingUp,
  ArrowLeft,
  FileText,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Eye,
  Download,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/shared/utils/utils'
import toast from 'react-hot-toast'
import DealManagement from '@/features/deals/components/DealManagement'

export default function DealsPage() {
  const { currentUser, offers, fetchOffers } = useSupabaseStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [isDealModalOpen, setIsDealModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await fetchOffers()
      } catch (error) {
        console.error('Error loading deals:', error)
        toast.error('Failed to load deals')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [fetchOffers])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view deals</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get accepted offers (these become deals)
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted')
  
  // Separate deals by user role
  const dealsAsBuyer = acceptedOffers.filter(offer => offer.buyerId === currentUser.id)
  const dealsAsSeller = acceptedOffers.filter(offer => {
    // This would need to cross-reference with listings, but for now we'll use a simple approach
    return offer.status === 'accepted' // Show all accepted offers for demo
  })

  const allDeals = [...dealsAsBuyer, ...dealsAsSeller]
  
  // Calculate stats
  const stats = {
    total: allDeals.length,
    active: allDeals.length, // All accepted offers are active deals
    completed: 0, // No completed deals yet
    totalValue: allDeals.reduce((sum, deal) => sum + (deal.price * deal.quantity), 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'connected': return 'bg-blue-100 text-blue-800'
      case 'transport-quoted': return 'bg-purple-100 text-purple-800'
      case 'transport-selected': return 'bg-indigo-100 text-indigo-800'
      case 'facilitated': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'transport-quoted': return <Truck className="w-4 h-4" />
      case 'transport-selected': return <Truck className="w-4 h-4" />
      case 'facilitated': return <FileText className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleDealAction = (action: string, deal: any) => {
    if (action === 'Manage Deal') {
      setSelectedDeal(deal)
      setIsDealModalOpen(true)
    } else {
      toast.success(`${action} action performed! (Feature coming soon)`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard" className="mr-4">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Active Deals
              </h1>
              <p className="text-gray-600">
                Manage your accepted offers and track deal progress
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Active deals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Being processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R{stats.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all deals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Deals List */}
        <div className="space-y-6">
          {allDeals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active deals yet</h3>
                <p className="text-gray-500 mb-6">
                  Deals will appear here once you accept offers or have your offers accepted
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/dashboard/offers">
                    <Button>View Offers</Button>
                  </Link>
                  <Link href="/listings">
                    <Button variant="secondary">Browse Listings</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            allDeals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                          {getStatusIcon(deal.status)}
                          <span className="ml-1 capitalize">{deal.status}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(deal.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Deal ID: {deal.id.slice(0, 8)}...
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Deal Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {(deal as any).listing?.title || 'Unknown Product'}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-medium">R{deal.price.toLocaleString()}</span>
                              <span className="text-gray-500 ml-1">per ton</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Package className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-medium">{deal.quantity.toLocaleString()}</span>
                              <span className="text-gray-500 ml-1">tons</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-bold text-green-600">
                                Total: R{(deal.price * deal.quantity).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-600">
                                {deal.deliveryAddress || 'Delivery address TBD'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Other Party Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            {deal.buyerId === currentUser.id ? 'Seller' : 'Buyer'}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {(deal as any).buyer?.name || (deal as any).listing?.seller?.name || 'Unknown User'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {(deal as any).buyer?.email || 'Email not available'}
                              </span>
                            </div>
                            {deal.terms && (
                              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <strong>Terms:</strong> {deal.terms}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleDealAction('Manage Deal', deal)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Manage Deal
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleDealAction('Get Transport Quotes', deal)}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Get Transport
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleDealAction('Generate Contract', deal)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Contract
                      </Button>
                      <Link href={`/listings/${deal.listingId}`}>
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          View Listing
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Deal Management Modal */}
        {selectedDeal && (
          <DealManagement
            deal={selectedDeal}
            isOpen={isDealModalOpen}
            onClose={() => {
              setIsDealModalOpen(false)
              setSelectedDeal(null)
            }}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  )
}
