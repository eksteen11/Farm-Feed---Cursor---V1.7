'use client'

import React, { useState, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { FicaService, FicaDocument } from '@/lib/ficaService'
import { 
  Upload, 
  CheckCircle, 
  XCircle,
  AlertTriangle 
} from 'lucide-react'

interface FicaDocumentUploadProps {
  onComplete?: () => void
}

const REQUIRED_DOCUMENTS = [
  { key: 'idDocument', label: 'ID Document', description: 'Valid South African ID or passport' },
  { key: 'bankStatement', label: 'Bank Statement', description: 'Recent bank statement (last 3 months)' },
  { key: 'entityRegistration', label: 'Business Registration', description: 'Company registration or business license' },
  { key: 'taxClearance', label: 'Tax Clearance', description: 'SARS tax clearance certificate (optional)' }
] as const

const FicaDocumentUpload: React.FC<FicaDocumentUploadProps> = ({ onComplete }) => {
  const { currentUser } = useStore()
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, FicaDocument>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to upload FICA documents.</p>
      </div>
    )
  }

  const handleFileSelect = async (documentType: string, file: File) => {
    if (!currentUser) return

    setUploading(documentType)
    setErrors(prev => ({ ...prev, [documentType]: '' }))

    try {
      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB')
      }

      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Only PDF, JPEG, and PNG files are allowed')
      }

      // Mock file upload - in real app, this would upload to cloud storage
      const fileUrl = URL.createObjectURL(file)
      
      const document = await FicaService.uploadDocument(
        currentUser.id,
        documentType as FicaDocument['type'],
        file.name,
        fileUrl
      )

      setUploadedDocs(prev => ({
        ...prev,
        [documentType]: document
      }))

      // Check if all required documents are uploaded
      const allUploaded = REQUIRED_DOCUMENTS.every(doc => 
        uploadedDocs[doc.key] || documentType === doc.key
      )

      if (allUploaded && onComplete) {
        onComplete()
      }

    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [documentType]: error instanceof Error ? error.message : 'Upload failed' 
      }))
    } finally {
      setUploading(null)
    }
  }

  const handleFileInputChange = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(documentType, file)
    }
  }

  const removeDocument = (documentType: string) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev }
      delete newDocs[documentType]
      return newDocs
    })
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[documentType]
      return newErrors
    })
  }

  const getDocumentStatus = (documentType: string) => {
    const doc = uploadedDocs[documentType]
    if (!doc) return 'pending'
    return doc.status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return null
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          FICA Document Verification
        </h2>
        <p className="text-gray-600">
          Please upload the required documents to verify your identity and business. 
          This is required for compliance and to unlock premium features.
        </p>
      </div>

      <div className="space-y-6">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const documentType = doc.key
          const status = getDocumentStatus(documentType)
          const uploadedDoc = uploadedDocs[documentType]
          const error = errors[documentType]

          return (
            <div
              key={documentType}
              className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
                uploadedDoc ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 mr-3">
                      {doc.label}
                    </h3>
                    {getStatusIcon(status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {doc.description}
                  </p>

                  {uploadedDoc && (
                                      <div className="flex items-center space-x-3 mb-4">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{uploadedDoc.fileName}</span>
                    <button
                      onClick={() => removeDocument(documentType)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  )}

                  {error && (
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                  )}

                  {!uploadedDoc && (
                    <div className="space-y-3">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[documentType] = el
                        }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileInputChange(documentType, e)}
                        className="hidden"
                      />
                      
                      <button
                        onClick={() => fileInputRefs.current[documentType]?.click()}
                        disabled={uploading === documentType}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading === documentType ? 'Uploading...' : 'Choose File'}
                      </button>
                      
                      <p className="text-xs text-gray-500">
                        Maximum file size: 10MB. Supported formats: PDF, JPEG, PNG
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Document Verification Process
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Documents are reviewed by our compliance team within 24-48 hours</p>
              <p>• You'll receive email notifications about verification status</p>
              <p>• Verified users gain access to premium features and higher transaction limits</p>
              <p>• All documents are encrypted and stored securely</p>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(uploadedDocs).length === REQUIRED_DOCUMENTS.length && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="h-5 w-5 mr-2" />
            All documents uploaded successfully!
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Your documents are now under review. We'll notify you once verification is complete.
          </p>
        </div>
      )}
    </div>
  )
}

export default FicaDocumentUpload
