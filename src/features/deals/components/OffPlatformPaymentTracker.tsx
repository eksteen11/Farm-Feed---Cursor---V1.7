/**
 * Off-Platform Payment Tracker Component
 * Implements Section 9 of Canonical Plan V1.2
 * 
 * Tracks off-platform payments with proof of payment upload
 * Farm Feed does NOT process payments - users handle directly
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Upload, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react'
import type { Deal, User } from '@/types'
import { DealStateMachine } from '../services/dealStateMachine'

interface OffPlatformPaymentTrackerProps {
  deal: Deal
  currentUser: User
  onPaymentUploaded: (file: File) => Promise<void>
  onPaymentConfirmed: () => Promise<void>
  onPaymentDisputed: (reason: string) => Promise<void>
}

export function OffPlatformPaymentTracker({
  deal,
  currentUser,
  onPaymentUploaded,
  onPaymentConfirmed,
  onPaymentDisputed
}: OffPlatformPaymentTrackerProps) {
  const [uploading, setUploading] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [showDisputeForm, setShowDisputeForm] = useState(false)

  const isBuyer = currentUser.id === deal.buyerId
  const isSeller = currentUser.id === deal.sellerId

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await onPaymentUploaded(file)
    } catch (error) {
      console.error('Error uploading proof of payment:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleConfirmPayment = async () => {
    if (!confirm('Confirm that you have received payment from the buyer?')) return
    await onPaymentConfirmed()
  }

  const handleDisputePayment = async () => {
    if (!disputeReason.trim()) {
      alert('Please provide a reason for disputing the payment')
      return
    }
    await onPaymentDisputed(disputeReason)
    setShowDisputeForm(false)
    setDisputeReason('')
  }

  return (
    <Card className="space-card">
      <div className="space-y-6">
        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Off-Platform Payment Notice</p>
              <p>
                Farm Feed does not process payments. All payments are made directly between users off-platform. 
                Farm Feed tracks payment status based on user-uploaded proof of payment. Farm Feed does not 
                verify, guarantee, or hold funds in escrow. Users are solely responsible for all payment disputes, 
                risks, and transaction fulfillment.
              </p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div>
          <h3 className="text-title font-semibold mb-4">Payment Status</h3>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg font-medium ${
              deal.paymentStatus === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
              deal.paymentStatus === 'payment_uploaded' ? 'bg-blue-100 text-blue-800' :
              deal.paymentStatus === 'payment_confirmed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {DealStateMachine.getStatusLabel(deal.status)}
            </div>
            {deal.proofOfPayment && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Proof uploaded {new Date(deal.proofOfPayment.uploadedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buyer Actions: Upload Proof of Payment */}
        {isBuyer && deal.paymentStatus === 'pending_payment' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Upload Proof of Payment</h4>
            <p className="text-sm text-gray-600 mb-4">
              After paying the seller off-platform, upload proof of payment (screenshot, receipt, etc.)
            </p>
            <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Choose File'}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Seller Actions: Confirm or Dispute Payment */}
        {isSeller && deal.paymentStatus === 'payment_uploaded' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3">
                Buyer has uploaded proof of payment. Please review and confirm receipt or dispute if there&apos;s an issue.
              </p>
              {deal.proofOfPayment && (
                <a
                  href={deal.proofOfPayment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Proof of Payment
                </a>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleConfirmPayment}
                className="btn-primary flex-1"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Payment Received
              </Button>
              <Button
                onClick={() => setShowDisputeForm(true)}
                variant="secondary"
                className="flex-1"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Dispute Payment
              </Button>
            </div>

            {showDisputeForm && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Dispute
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Explain why you're disputing this payment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleDisputePayment}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Submit Dispute
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDisputeForm(false)
                      setDisputeReason('')
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Confirmed State */}
        {deal.paymentStatus === 'payment_confirmed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Payment Confirmed</p>
                <p className="text-sm text-green-700">
                  Seller has confirmed payment receipt. Deal can proceed to fulfillment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Disputed State */}
        {deal.paymentStatus === 'payment_disputed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Payment Disputed</p>
                <p className="text-sm text-red-700">
                  There is a payment dispute. Please resolve directly with the other party.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Payment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Product Total:</span>
              <span className="font-medium">R{deal.finalPrice.toLocaleString()}</span>
            </div>
            {deal.transportFee && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Fee:</span>
                <span className="font-medium">R{deal.transportFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-medium">R{deal.platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-semibold text-lg">
              <span>Total Amount:</span>
              <span className="text-primary-600">R{deal.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

