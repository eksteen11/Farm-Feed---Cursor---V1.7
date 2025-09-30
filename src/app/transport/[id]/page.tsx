'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign,
  Eye,
  MessageCircle,
  ArrowLeft,
  Star,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { mockTransportRequests, mockTransportQuotes } from '@/shared/util@/shared/utils/mockData'
import { TransportRequest, TransportQuote } from '@/types'
import toast from 'react-hot-toast'
import TransportTracking from '@/features/transport/components/TransportTracking'
import { formatDate } from '@/shared/utils/utils'

export default function TransportRequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useStore()
  const [request, setRequest] = useState<TransportRequest | null>(null)
  const [quotes, setQuotes] = useState<TransportQuote[]>([])
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const [quoteForm, setQuoteForm] = useState({
    price: '',
    estimatedDays: '',
    vehicleType: '',
    insurance: 'Basic Coverage',
    message: '',
    availableDate: ''
  })

  useEffect(() => {
    const foundRequest = mockTransportRequests.find(r => r.id === params.id)
    if (foundRequest) {
      setRequest(foundRequest)
      const requestQuotes = mockTransportQuotes.filter(q => q.transportRequestId === params.id)
      setQuotes(requestQuotes)
    }
    setLoading(false)
  }, [params.id])

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !currentUser || currentUser.role !== 'transporter') {
      toast.error('Only transporters can submit quotes')
      return
    }

    if (!quoteForm.price || !quoteForm.estimatedDays || !quoteForm.vehicleType) {
      toast.error('Please fill in all required fields')
      return
    }

    const newQuote: TransportQuote = {
      id: `quote_${Date.now()}`,
      transportRequestId: request!.id,
      transportRequest: request!,
      transporterId: currentUser.id,
      transporter: currentUser,
      price: parseFloat(quoteForm.price),
      estimatedDays: parseInt(quoteForm.estimatedDays),
      message: quoteForm.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      vehicleType: quoteForm.vehicleType,
      insurance: quoteForm.insurance,
      availableDate: quoteForm.availableDate ? new Date(quoteForm.availableDate) : undefined,
      breakdown: {
        basePrice: parseFloat(quoteForm.price) * 0.7,
        fuelSurcharge: parseFloat(quoteForm.price) * 0.2,
        tollFees: parseFloat(quoteForm.price) * 0.05,
        insurance: parseFloat(quoteForm.price) * 0.05,
        total: parseFloat(quoteForm.price)
      },
      platformFee: 150
    }

    setQuotes(prev => [newQuote, ...prev])
    setQuoteForm({
      price: '', estimatedDays: '', vehicleType: '', insurance: 'Basic Coverage', message: '', availableDate: ''
    })
    setShowQuoteForm(false)
    toast.success('Quote submitted successfully!')
  }

  const acceptQuote = (quoteId: string) => {
    setQuotes(prev => 
      prev.map(q => 
        q.id === quoteId 
          ? { ...q, status: 'accepted' as const }
          : { ...q, status: 'rejected' as const }
      )
    )
    setRequest(prev => prev ? { ...prev, status: 'accepted' as const } : null)
    toast.success('Quote accepted! Transport is now arranged.')
  }

  const rejectQuote = (quoteId: string) => {
    setQuotes(prev => 
      prev.map(q => 
        q.id === quoteId 
          ? { ...q, status: 'rejected' as const }
          : q
      )
    )
    toast.success('Quote rejected.')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'quoted': return 'bg-red-100 text-red-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open for Quotes'
      case 'quoted': return 'Quotes Received'
      case 'accepted': return 'Transport Arranged'
      case 'in_progress': return 'In Transit'
      case 'completed': return 'Delivered'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transport request...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transport Request Not Found</h1>
          <p className="text-gray-600 mb-6">The transport request you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/transport')}>Back to Transport</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/transport')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Transport
          </Button>
        </div>

        {/* Request Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Transport Request #{request.id}</h1>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </div>
                {request.urgent && (
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Urgent</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Created</div>
              <div className="text-sm font-medium">{formatDate(request.createdAt)}</div>
            </div>
          </div>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Pickup Location</span>
              </div>
              <div className="text-lg font-medium">{request.pickupLocation}</div>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Delivery Location</span>
              </div>
              <div className="text-lg font-medium">{request.deliveryLocation}</div>
            </div>
          </div>

          {/* Product & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Package className="w-4 h-4" />
                <span className="font-medium">Product Details</span>
              </div>
              <div className="text-lg font-medium">{request.quantity} {request.unit}</div>
              {request.productType && <div className="text-sm text-gray-600">{request.productType}</div>}
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Preferred Date</span>
              </div>
              <div className="text-lg font-medium">{formatDate(request.preferredDate)}</div>
            </div>
            {request.budget && (
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Budget</span>
                </div>
                <div className="text-lg font-medium text-green-600">R{request.budget.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Requester Information */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={request.requester.avatar} alt={request.requester.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900">{request.requester.name}</div>
                  {request.requester.company && <div className="text-sm text-gray-600">{request.requester.company}</div>}
                  <div className="text-sm text-gray-500">{request.requester.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.8</span>
                </div>
                {request.contactPhone && (
                  <Button variant="ghost" size="sm" leftIcon={<Phone className="w-4 h-4" />}>Contact</Button>
                )}
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          {request.specialRequirements && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Special Requirements</span>
              </div>
              <p className="text-gray-700">{request.specialRequirements}</p>
            </div>
          )}
        </div>

        {/* Transport Tracking for accepted/in-progress requests */}
        {(request.status === 'accepted' || request.status === 'in_progress' || request.status === 'completed') && (
          <div className="mb-6">
            <TransportTracking 
              request={request}
              acceptedQuote={quotes.find(q => q.status === 'accepted')}
              onUpdateStatus={(newStatus) => {
                // Update the request status
                setRequest(prev => prev ? { ...prev, status: newStatus as any } : null)
                toast.success(`Transport status updated to ${newStatus}`)
              }}
            />
          </div>
        )}

        {/* Quotes Section */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Transport Quotes ({quotes.length})</h2>
            {request.status === 'open' && currentUser?.role === 'transporter' && (
              <Button onClick={() => setShowQuoteForm(true)} leftIcon={<MessageSquare className="w-4 h-4" />}>
                Submit Quote
              </Button>
            )}
          </div>

          {quotes.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No quotes submitted yet</p>
              {request.status === 'open' && currentUser?.role === 'transporter' && (
                <Button onClick={() => setShowQuoteForm(true)}>Be the First to Quote</Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <Card key={quote.id} className="border-l-4 border-l-primary-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img src={quote.transporter.avatar} alt={quote.transporter.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-medium text-gray-900">{quote.transporter.name}</div>
                          {quote.transporter.company && <div className="text-sm text-gray-600">{quote.transporter.company}</div>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {quote.status === 'accepted' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                         quote.status === 'rejected' ? <XCircle className="w-5 h-5 text-red-600" /> :
                         <Clock className="w-5 h-5 text-yellow-600" />}
                        <span className={`text-sm font-medium ${
                          quote.status === 'accepted' ? 'text-green-600' :
                          quote.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {quote.status === 'accepted' ? 'Accepted' : quote.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Price</div>
                        <div className="text-lg font-bold text-green-600">R{quote.price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Estimated Days</div>
                        <div className="text-lg font-medium">{quote.estimatedDays} days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Vehicle Type</div>
                        <div className="text-sm font-medium">{quote.vehicleType}</div>
                      </div>
                    </div>

                    {quote.message && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">Message</div>
                        <p className="text-gray-700">{quote.message}</p>
                      </div>
                    )}

                    {/* Actions for request owner */}
                    {currentUser?.id === request.requesterId && quote.status === 'pending' && (
                      <div className="flex space-x-2 pt-4 border-t border-gray-200">
                        <Button onClick={() => acceptQuote(quote.id)} className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />}>
                          Accept Quote
                        </Button>
                        <Button variant="secondary" onClick={() => rejectQuote(quote.id)} className="flex-1" leftIcon={<XCircle className="w-4 h-4" />}>
                          Reject Quote
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quote Submission Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Submit Transport Quote</h3>
                <button onClick={() => setShowQuoteForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Price (ZAR) *</label>
                    <input type="number" value={quoteForm.price} onChange={(e) => setQuoteForm(prev => ({ ...prev, price: e.target.value }))} placeholder="12000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Days *</label>
                    <input type="number" value={quoteForm.estimatedDays} onChange={(e) => setQuoteForm(prev => ({ ...prev, estimatedDays: e.target.value }))} placeholder="3" min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
                    <select value={quoteForm.vehicleType} onChange={(e) => setQuoteForm(prev => ({ ...prev, vehicleType: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" required>
                      <option value="">Select Vehicle Type</option>
                      <option value="Flatbed Truck">Flatbed Truck</option>
                      <option value="Refrigerated Truck">Refrigerated Truck</option>
                      <option value="Container Truck">Container Truck</option>
                      <option value="Tipper Truck">Tipper Truck</option>
                      <option value="Trailer">Trailer</option>
                      <option value="Pickup Truck">Pickup Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Coverage</label>
                    <select value={quoteForm.insurance} onChange={(e) => setQuoteForm(prev => ({ ...prev, insurance: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10">
                      <option value="Basic Coverage">Basic Coverage</option>
                      <option value="Full Coverage">Full Coverage</option>
                      <option value="Premium Coverage">Premium Coverage</option>
                      <option value="Specialty Coverage">Specialty Coverage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message to Requester</label>
                  <textarea value={quoteForm.message} onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Tell the requester about your service, experience, or any special considerations..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 resize-none" rows={3} />
                </div>

                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <Button type="button" variant="secondary" onClick={() => setShowQuoteForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Submit Quote</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
