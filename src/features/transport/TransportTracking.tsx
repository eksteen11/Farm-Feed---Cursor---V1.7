'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Truck, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  MessageSquare
} from 'lucide-react'
import { TransportRequest, TransportQuote } from '@/types'
import ClientOnly from '@/components/ui/ClientOnly'

interface TransportTrackingProps {
  request: TransportRequest
  acceptedQuote?: TransportQuote
  onUpdateStatus: (status: string) => void
}

export default function TransportTracking({ request, acceptedQuote, onUpdateStatus }: TransportTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState(request.status)
  const [estimatedArrival, setEstimatedArrival] = useState<string>('')
  const [driverNotes, setDriverNotes] = useState('')

  const statusSteps = [
    { key: 'accepted', label: 'Transport Arranged', icon: CheckCircle, color: 'text-green-600' },
    { key: 'in_progress', label: 'In Transit', icon: Truck, color: 'text-green-600' },
    { key: 'completed', label: 'Delivered', icon: CheckCircle, color: 'text-green-600' }
  ]

  const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus)

  const handleStatusUpdate = (newStatus: 'accepted' | 'in_progress' | 'completed') => {
    setCurrentStatus(newStatus)
    onUpdateStatus(newStatus)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress': return <Truck className="w-5 h-5 text-green-600" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardTitle className="p-6 pb-3">Transport Status</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon(currentStatus)}
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {statusSteps.find(step => step.key === currentStatus)?.label || 'Unknown Status'}
                </div>
                <div className="text-sm text-gray-500">
                  <ClientOnly>
                    Last updated: {new Date().toLocaleString()}
                  </ClientOnly>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
              {currentStatus.replace('_', ' ')}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-gray-200 border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${
                        isCurrent ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport Details */}
      <Card>
        <CardTitle className="p-6 pb-3">Transport Details</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Route Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Pickup</div>
                    <div className="text-sm text-gray-600">{request.pickupLocation}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Delivery</div>
                    <div className="text-sm text-gray-600">{request.deliveryLocation}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Cargo Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Quantity</div>
                    <div className="text-sm text-gray-600">{request.quantity} {request.unit}</div>
                  </div>
                </div>
                {request.productType && (
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Product</div>
                      <div className="text-sm text-gray-600">{request.productType}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transporter Information */}
      {acceptedQuote && (
        <Card>
          <CardTitle className="p-6 pb-3">Transporter Information</CardTitle>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={acceptedQuote.transporter.avatar}
                  alt={acceptedQuote.transporter.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{acceptedQuote.transporter.name}</div>
                  {acceptedQuote.transporter.company && (
                    <div className="text-sm text-gray-600">{acceptedQuote.transporter.company}</div>
                  )}
                  <div className="text-sm text-gray-500">{acceptedQuote.transporter.location}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" leftIcon={<Phone className="w-4 h-4" />}>
                  Contact
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Message
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">R{acceptedQuote.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Agreed Price</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{acceptedQuote.estimatedDays}</div>
                <div className="text-sm text-gray-600">Estimated Days</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{acceptedQuote.vehicleType || 'Truck'}</div>
                <div className="text-sm text-gray-600">Vehicle Type</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Updates */}
      <Card>
        <CardTitle className="p-6 pb-3">Update Transport Status</CardTitle>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Arrival
              </label>
              <ClientOnly>
                <input
                  type="datetime-local"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                />
              </ClientOnly>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Notes
              </label>
              <textarea
                value={driverNotes}
                onChange={(e) => setDriverNotes(e.target.value)}
                placeholder="Any updates or notes about the transport..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              {currentStatus === 'accepted' && (
                <Button 
                  onClick={() => handleStatusUpdate('in_progress')}
                  leftIcon={<Truck className="w-4 h-4" />}
                >
                  Start Transport
                </Button>
              )}
              
              {currentStatus === 'in_progress' && (
                <Button 
                  onClick={() => handleStatusUpdate('completed')}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
