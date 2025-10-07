'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import { 
  X,
  Truck,
  FileText,
  MessageCircle,
  DollarSign,
  Package,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Send
} from 'lucide-react'
import { formatDate } from '@/shared/utils/utils'
import toast from 'react-hot-toast'

interface DealManagementProps {
  deal: any
  isOpen: boolean
  onClose: () => void
  currentUser: any
}

export default function DealManagement({ deal, isOpen, onClose, currentUser }: DealManagementProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!isOpen) return null

  const handleDealAction = async (action: string) => {
    try {
      switch (action) {
        case 'get-transport':
          toast.success('Transport quotes requested! (Feature coming soon)')
          break
        case 'generate-contract':
          toast.success('Contract generated! (Feature coming soon)')
          break
        case 'send-message':
          toast.success('Message sent! (Feature coming soon)')
          break
        case 'mark-completed':
          toast.success('Deal marked as completed! (Feature coming soon)')
          break
        default:
          toast.error('Unknown action')
      }
    } catch (error) {
      console.error('Error performing deal action:', error)
      toast.error('Action failed. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-blue-100 text-blue-800'
      case 'transport-quoted': return 'bg-purple-100 text-purple-800'
      case 'transport-selected': return 'bg-indigo-100 text-indigo-800'
      case 'facilitated': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'transport-quoted': return <Truck className="w-4 h-4" />
      case 'transport-selected': return <Truck className="w-4 h-4" />
      case 'facilitated': return <FileText className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Deal Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Deal Status</span>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
              {getStatusIcon(deal.status)}
              <span className="ml-1 capitalize">{deal.status}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Deal Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Deal ID:</span>
                  <span className="font-mono">{deal.id?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>{formatDate(deal.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Date:</span>
                  <span>{deal.deliveryDate ? formatDate(deal.deliveryDate) : 'TBD'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Financial Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Product Value:</span>
                  <span>R{(deal.finalPrice * deal.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Fee:</span>
                  <span>R{deal.platformFee?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transport Fee:</span>
                  <span>R{deal.transportFee?.toLocaleString() || 'TBD'}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-600">R{deal.totalAmount?.toLocaleString() || 'TBD'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{deal.listing?.title || 'Unknown Product'}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per ton:</span>
                  <span>R{deal.finalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span>{deal.quantity?.toLocaleString()} tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Type:</span>
                  <span className="capitalize">{deal.deliveryType || 'TBD'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <span>{deal.deliveryAddress || 'Delivery address to be confirmed'}</span>
                </div>
                {deal.terms && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Terms:</strong> {deal.terms}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deal.status === 'connected' && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Get Transport Quotes</h4>
                    <p className="text-sm text-blue-700">Request transport quotes from available transporters</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleDealAction('get-transport')}
                >
                  Get Quotes
                </Button>
              </div>
            )}
            
            {deal.status === 'transport-quoted' && (
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-purple-900">Select Transport Option</h4>
                    <p className="text-sm text-purple-700">Choose the best transport quote for your deal</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleDealAction('select-transport')}
                >
                  Select Transport
                </Button>
              </div>
            )}
            
            {deal.status === 'transport-selected' && (
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-indigo-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Generate Contract</h4>
                    <p className="text-sm text-indigo-700">Create the facilitated agreement for offline processing</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleDealAction('generate-contract')}
                >
                  Generate Contract
                </Button>
              </div>
            )}
            
            {deal.status === 'facilitated' && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Deal in Progress</h4>
                    <p className="text-sm text-yellow-700">Parties are processing the deal offline</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleDealAction('mark-completed')}
                >
                  Mark Completed
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTransport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transport Coordination</CardTitle>
          <CardDescription>
            Manage transport requests and quotes for this deal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Transport System</h3>
            <p className="text-gray-500 mb-6">
              Transport coordination system coming soon
            </p>
            <Button onClick={() => handleDealAction('get-transport')}>
              Request Transport Quotes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deal Documents</CardTitle>
          <CardDescription>
            Generate and manage deal-related documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="font-medium">Farm Feed Facilitated Agreement</h4>
                  <p className="text-sm text-gray-500">Contract between buyer and seller</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDealAction('generate-contract')}
              >
                <Download className="w-4 h-4 mr-1" />
                Generate
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="font-medium">Invoice Template</h4>
                  <p className="text-sm text-gray-500">Payment invoice for the buyer</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDealAction('generate-invoice')}
              >
                <Download className="w-4 h-4 mr-1" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deal Messages</CardTitle>
          <CardDescription>
            Communicate with the other party about this deal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messaging System</h3>
            <p className="text-gray-500 mb-6">
              In-app messaging system coming soon
            </p>
            <Button onClick={() => handleDealAction('send-message')}>
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Deal Management</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex border-b">
          {[
            { key: 'overview', label: 'Overview', icon: Eye },
            { key: 'transport', label: 'Transport', icon: Truck },
            { key: 'documents', label: 'Documents', icon: FileText },
            { key: 'messages', label: 'Messages', icon: MessageCircle }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'transport' && renderTransport()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'messages' && renderMessages()}
        </div>
      </div>
    </div>
  )
}
