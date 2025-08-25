'use client'

import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { 
  Truck, 
  Package, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  MapPin,
  Calendar
} from 'lucide-react'
import { mockTransportRequests, mockTransportQuotes } from '@/lib/mockData'
import ClientOnly from '@/components/ui/ClientOnly'

interface TransportDashboardProps {
  userId?: string
  userRole?: string
}

export default function TransportDashboard({ userId, userRole }: TransportDashboardProps) {
  const allRequests = mockTransportRequests
  const allQuotes = mockTransportQuotes

  // Calculate statistics
  const totalRequests = allRequests.length
  const openRequests = allRequests.filter(r => r.status === 'open').length
  const quotedRequests = allRequests.filter(r => r.status === 'quoted').length
  const acceptedRequests = allRequests.filter(r => r.status === 'accepted').length
  const inProgressRequests = allRequests.filter(r => r.status === 'in_progress').length
  const completedRequests = allRequests.filter(r => r.status === 'completed').length

  // User-specific statistics
  const userRequests = userId ? allRequests.filter(r => r.requesterId === userId) : []
  const userQuotes = userId && userRole === 'transporter' ? allQuotes.filter(q => q.transporterId === userId) : []
  
  const userTotalRequests = userRequests.length
  const userOpenRequests = userRequests.filter(r => r.status === 'open').length
  const userQuotedRequests = userRequests.filter(r => r.status === 'quoted').length
  const userAcceptedRequests = userRequests.filter(r => r.status === 'accepted').length

  const userTotalQuotes = userQuotes.length
  const userPendingQuotes = userQuotes.filter(q => q.status === 'pending').length
  const userAcceptedQuotes = userQuotes.filter(q => q.status === 'accepted').length

  // Recent activity
  const recentRequests = allRequests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const recentQuotes = allQuotes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Top routes
  const routeStats = allRequests.reduce((acc, request) => {
    const route = `${request.pickupLocation} → ${request.deliveryLocation}`
    acc[route] = (acc[route] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topRoutes = Object.entries(routeStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open for Quotes</p>
                <p className="text-2xl font-bold text-blue-600">{openRequests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quotes Received</p>
                <p className="text-2xl font-bold text-yellow-600">{quotedRequests}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transport Arranged</p>
                <p className="text-2xl font-bold text-green-600">{acceptedRequests}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User-specific Statistics */}
      {userId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardTitle className="p-6 pb-3">My Transport Requests</CardTitle>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userTotalRequests}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{userQuotedRequests}</div>
                  <div className="text-sm text-gray-600">Quoted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userAcceptedRequests}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{userOpenRequests}</div>
                  <div className="text-sm text-gray-600">Open</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {userRole === 'transporter' && (
            <Card>
              <CardTitle className="p-6 pb-3">My Transport Quotes</CardTitle>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userTotalQuotes}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{userPendingQuotes}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userAcceptedQuotes}</div>
                    <div className="text-sm text-gray-600">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {userTotalQuotes > 0 ? Math.round((userAcceptedQuotes / userTotalQuotes) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Top Routes */}
      <Card>
        <CardTitle className="p-6 pb-3">Popular Transport Routes</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {topRoutes.map(([route, count], index) => (
              <div key={route} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{route}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{count} requests</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

              {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardTitle className="p-6 pb-3">Recent Transport Requests</CardTitle>
            <CardContent className="p-6 pt-0">
              <ClientOnly>
                <div className="space-y-3">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.quantity} {request.unit} • {request.productType || 'Product'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.pickupLocation} → {request.deliveryLocation}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          request.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'quoted' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ClientOnly>
            </CardContent>
          </Card>

          <Card>
            <CardTitle className="p-6 pb-3">Recent Transport Quotes</CardTitle>
            <CardContent className="p-6 pt-0">
              <ClientOnly>
                <div className="space-y-3">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            R{quote.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {quote.estimatedDays} days • {quote.transporter.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {quote.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ClientOnly>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
