'use client'

import { useState } from 'react'
import { 
  Package, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  FileText,
  CreditCard,
  MessageSquare,
  X,
  Upload,
  Eye
} from 'lucide-react'
import { Deal, User as UserType, Listing } from '@/types'
import Button from '@/shared/ui/Button'
import Badge from '@/shared/ui/Badge'
import Card from '@/shared/ui/Card'
import { formatDate } from '@/shared/utils/utils'
import { mockUsers, mockListings } from '@/shared/utils/mockData'

interface DealManagementProps {
  deal: Deal
  currentUser: UserType
  onUpdateDeal: (dealId: string, updates: Partial<Deal>) => void
  onClose: () => void
}

export default function DealManagement({ deal, currentUser, onUpdateDeal, onClose }: DealManagementProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'transport' | 'documents' | 'messages'>('overview')
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const getUserById = (userId: string): UserType => {
    return mockUsers.find(user => user.id === userId) || {
      id: userId,
      email: 'user@example.com',
      name: 'Unknown User',
      role: 'buyer',
      capabilities: ['buy'],
      company: 'Unknown Company',
      location: 'Unknown',
      isVerified: false,
      subscriptionStatus: 'inactive',
      ficaStatus: 'pending',
      ficaDocuments: {},
      rating: 0,
      totalDeals: 0,
      totalTransactions: 0,
      reputationScore: 0,
      businessType: 'individual',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const getListingById = (listingId: string): Listing | null => {
    return mockListings.find(listing => listing.id === listingId) || null
  }

  const listing = getListingById(deal.listingId)
  const otherUser = deal.buyerId === currentUser.id 
    ? getUserById(deal.sellerId) 
    : getUserById(deal.buyerId)
  
  const isBuyer = deal.buyerId === currentUser.id
  const isSeller = deal.sellerId === currentUser.id

  const handleConnectParties = async () => {
    setIsProcessing(true)
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onUpdateDeal(deal.id, {
        status: 'connected',
        updatedAt: new Date()
      })
      
      // Show success message
      alert('Parties connected successfully! You can now negotiate directly.')
    } catch (error) {
      console.error('Connection failed:', error)
      alert('Failed to connect parties. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGetTransportQuotes = async () => {
    setIsProcessing(true)
    try {
      // Simulate transport quote generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onUpdateDeal(deal.id, {
        status: 'transport-quoted',
        updatedAt: new Date()
      })
      
      alert('Transport quotes generated! Review and select your preferred option.')
    } catch (error) {
      console.error('Transport quote generation failed:', error)
      alert('Failed to generate transport quotes. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateContract = async () => {
    setIsProcessing(true)
    try {
      // Simulate contract generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onUpdateDeal(deal.id, {
        status: 'facilitated',
        updatedAt: new Date()
      })
      
      alert('Contract generated successfully! Download and proceed with offline fulfillment.')
    } catch (error) {
      console.error('Contract generation failed:', error)
      alert('Failed to generate contract. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Deal Status */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <Badge className={`mt-1 ${
              deal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              deal.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
              deal.status === 'in-transit' ? 'bg-purple-100 text-purple-800' :
              deal.status === 'delivered' ? 'bg-green-100 text-green-800' :
              deal.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {deal.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <Badge className={`mt-1 ${
              deal.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              deal.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
              deal.paymentStatus === 'partial' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {deal.paymentStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Deal Details */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium text-gray-900">{listing?.title || 'Product'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price per Ton</p>
              <p className="font-medium text-gray-900">R{deal.finalPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">{deal.quantity} tons</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="font-medium text-gray-900">R{deal.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Delivery Type</p>
              <p className="font-medium text-gray-900 capitalize">
                {deal.deliveryType.replace('-', ' ')}
              </p>
            </div>
            {deal.deliveryDate && (
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="font-medium text-gray-900">{formatDate(deal.deliveryDate)}</p>
              </div>
            )}
            {deal.deliveryAddress && (
              <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="font-medium text-gray-900">{deal.deliveryAddress}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Platform Fee</p>
              <p className="font-medium text-gray-900">R{deal.platformFee}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Parties */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Parties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isBuyer ? 'You (Buyer)' : otherUser.company || otherUser.name}
              </p>
              <p className="text-sm text-gray-500">
                {isBuyer ? currentUser.email : otherUser.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isSeller ? 'You (Seller)' : otherUser.company || otherUser.name}
              </p>
              <p className="text-sm text-gray-500">
                {isSeller ? currentUser.email : otherUser.email}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Terms */}
      {deal.terms && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
          <p className="text-gray-700">{deal.terms}</p>
        </Card>
      )}
    </div>
  )

  const renderPayment = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Financials</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Product Value</p>
              <p className="text-lg font-medium text-gray-900">
                R{(deal.finalPrice * deal.quantity).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Platform Fee (R1/ton)</p>
              <p className="text-lg font-medium text-gray-900">R{deal.platformFee}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transport Fee</p>
              <p className="text-lg font-medium text-gray-900">
                R{deal.transportFee || 0}
              </p>
            </div>
            <div className="border-t pt-2">
              <p className="text-sm text-gray-500">Total Deal Value</p>
              <p className="text-xl font-bold text-gray-900">R{deal.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-blue-800 font-medium">Direct Payment Required</p>
              <p className="text-blue-700 text-sm">
                All payments are handled directly between buyer and seller. 
                Farm Feed facilitates the connection and earns fees for successful matches.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Payment Instructions</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p>• Buyer pays seller directly (bank transfer, cash, etc.)</p>
              <p>• Platform fee (R{deal.platformFee}) already collected</p>
              <p>• Transport fee (R{deal.transportFee || 0}) paid directly to transporter</p>
              <p>• All fulfillment handled offline between parties</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderTransport = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transport Facilitation</h3>
        
        {deal.status === 'connected' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-blue-800">
                  Get transport quotes from our network of transporters. 
                  Platform fee: R300 per successful connection.
                </p>
              </div>
            </div>
            
            <Button
              variant="primary"
              onClick={handleGetTransportQuotes}
              disabled={isProcessing}
              className="w-full"
            >
              <Truck className="w-4 h-4 mr-2" />
              {isProcessing ? 'Getting Quotes...' : 'Get Transport Quotes'}
            </Button>
          </div>
        )}

        {deal.status === 'transport-quoted' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800">
                  Transport quotes available! Review and select your preferred option.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Transporter A</h4>
                <p className="text-sm text-gray-600">Price: R2,500</p>
                <p className="text-sm text-gray-600">Delivery: 2 days</p>
                <p className="text-sm text-gray-600">Vehicle: Covered truck</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Select This Option
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Transporter B</h4>
                <p className="text-sm text-gray-600">Price: R2,800</p>
                <p className="text-sm text-gray-600">Delivery: 1 day</p>
                <p className="text-sm text-gray-600">Vehicle: Open truck</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Select This Option
                </Button>
              </div>
            </div>
          </div>
        )}

        {deal.status === 'transport-selected' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-purple-600 mr-2" />
                <p className="text-purple-800">
                  Transport connection made! Contact transporter directly to arrange pickup and delivery.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Selected Transporter</h4>
              <p className="text-sm text-gray-600">Company: ABC Transport</p>
              <p className="text-sm text-gray-600">Contact: 012 345 6789</p>
              <p className="text-sm text-gray-600">Email: contact@abctransport.co.za</p>
              <p className="text-sm text-gray-600">Price: R2,500</p>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-yellow-800 font-medium">Direct Transport Arrangement</p>
              <p className="text-yellow-700 text-sm">
                Once transporter is selected, all transport arrangements are handled directly 
                between parties. Farm Feed facilitates the connection only.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Documents</h3>
        
        {deal.status === 'facilitated' ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800">
                  Contract generated! Download and proceed with offline fulfillment.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Farm Feed Facilitated Agreement</p>
                  <p className="text-sm text-gray-500">Generated on {formatDate(deal.createdAt)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="primary" size="sm">
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800">
                  Complete the deal facilitation process to generate your contract.
                </p>
              </div>
            </div>
            
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Contract Yet</h4>
              <p className="text-gray-500 mb-4">
                Complete transport selection to generate your facilitated agreement.
              </p>
              <Button
                variant="primary"
                onClick={handleGenerateContract}
                disabled={isProcessing}
              >
                <FileText className="w-4 h-4 mr-2" />
                {isProcessing ? 'Generating Contract...' : 'Generate Contract'}
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Contract Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="space-y-2">
              <p><strong>FARM FEED FACILITATED AGREEMENT</strong></p>
              <p>Product: {listing?.title || 'Product'}</p>
              <p>Quantity: {deal.quantity} tons</p>
              <p>Price: R{deal.finalPrice}/ton</p>
              <p>Total Value: R{(deal.finalPrice * deal.quantity).toLocaleString()}</p>
              <p>Buyer: {isBuyer ? currentUser.company || currentUser.name : otherUser.company || otherUser.name}</p>
              <p>Seller: {isSeller ? currentUser.company || currentUser.name : otherUser.company || otherUser.name}</p>
              <p>Platform Fee: R{deal.platformFee} (paid to Farm Feed)</p>
              <p>Transport Fee: R{deal.transportFee || 0} (paid directly to transporter)</p>
              <br />
              <p><strong>Terms:</strong></p>
              <p>• Payment: Direct between buyer and seller</p>
              <p>• Transport: Direct between parties and transporter</p>
              <p>• Delivery: As agreed between all parties</p>
              <p>• This agreement was facilitated by Farm Feed platform</p>
              <p>• All fulfillment is handled directly between parties</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Messages</h3>
        <p className="text-gray-500">Message system will be integrated here for deal-specific communication.</p>
      </Card>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Deal Management</h2>
            <p className="text-sm text-gray-500">
              {listing?.title} - {isBuyer ? 'Buying from' : 'Selling to'} {otherUser.company || otherUser.name}
            </p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { key: 'overview', label: 'Overview', icon: Package },
            { key: 'payment', label: 'Payment', icon: CreditCard },
            { key: 'transport', label: 'Transport', icon: Truck },
            { key: 'documents', label: 'Documents', icon: FileText },
            { key: 'messages', label: 'Messages', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payment' && renderPayment()}
          {activeTab === 'transport' && renderTransport()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'messages' && renderMessages()}
        </div>
      </div>
    </div>
  )
}
