'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { FicaService, FicaVerification } from '@/features/fica/services/ficaService'
import FicaDocumentUpload from '@/features/fica/components/FicaDocumentUpload'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText 
} from 'lucide-react'
import { formatDate } from '@/shared/utils/utils'

const FicaPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useStore()
  const router = useRouter()
  const [verification, setVerification] = useState<FicaVerification | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadFicaVerification()
  }, [isAuthenticated, currentUser])

  const loadFicaVerification = async () => {
    if (!currentUser) return
    
    try {
      setIsLoading(true)
      const ficaVerification = await FicaService.getFicaVerification(currentUser.id)
      setVerification(ficaVerification)
    } catch (error) {
      console.error('Failed to load FICA verification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentsComplete = async () => {
    await loadFicaVerification()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Your FICA verification is complete! You now have access to all premium features.'
      case 'rejected':
        return 'Some documents were rejected. Please review and resubmit the required documents.'
      case 'pending':
        return 'Your documents are under review. This usually takes 24-48 hours.'
      default:
        return 'Please upload the required documents to complete your FICA verification.'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access FICA verification.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                FICA Verification
              </h1>
              <p className="text-gray-600 mt-1">
                Complete your identity verification to unlock premium features
              </p>
            </div>
            
            {verification && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Verification Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verification.status)}`}>
                  {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {verification ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center mb-6">
              {getStatusIcon(verification.status)}
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Verification {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                </h2>
                <p className="text-gray-600 mt-1">
                  {getStatusMessage(verification.status)}
                </p>
              </div>
            </div>

            {verification.status === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Verification Complete
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      You now have access to all premium features including unlimited listings, 
                      advanced analytics, and priority support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verification.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Verification Rejected
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {verification.rejectionReason || 'Some documents were rejected. Please review and resubmit.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verification.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Under Review
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your documents are currently being reviewed by our compliance team. 
                      This process typically takes 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Document Status
            </h3>
            
            <div className="space-y-4">
              {verification.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {doc.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    
                    {doc.verifiedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(doc.verifiedAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {verification.complianceScore > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Compliance Score</span>
                  <span className="text-lg font-bold text-gray-900">{verification.complianceScore}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${verification.complianceScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Risk Level: {verification.riskLevel.charAt(0).toUpperCase() + verification.riskLevel.slice(1)}
                </p>
              </div>
            )}
          </div>

          {/* Re-upload if rejected */}
          {verification.status === 'rejected' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Re-upload Documents
              </h3>
              <p className="text-gray-600 mb-4">
                Please review the rejection reasons and re-upload the required documents.
              </p>
              <FicaDocumentUpload onComplete={handleDocumentsComplete} />
            </div>
          )}
        </div>
      ) : (
        /* Initial Upload */
        <FicaDocumentUpload onComplete={handleDocumentsComplete} />
      )}

      {/* Information Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-4">
            Why FICA Verification is Required
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-green-800">
            <div>
              <h4 className="font-medium mb-2">Compliance & Security</h4>
              <ul className="space-y-1">
                <li>• Meets South African financial regulations</li>
                <li>• Prevents fraud and money laundering</li>
                <li>• Protects all users on the platform</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Enhanced Access</h4>
              <ul className="space-y-1">
                <li>• Higher transaction limits</li>
                <li>• Priority support access</li>
                <li>• Advanced platform features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FicaPage
