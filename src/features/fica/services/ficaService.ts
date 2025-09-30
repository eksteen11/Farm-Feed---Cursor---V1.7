import { User } from '@/types'
import { mockUsers } from '@/shared/util@/shared/utils/mockData'
import { generateId } from '@/shared/utils/helpers'

export interface FicaDocument {
  id: string
  userId: string
  type: 'idDocument' | 'bankStatement' | 'entityRegistration' | 'taxClearance'
  fileName: string
  fileUrl: string
  status: 'pending' | 'verified' | 'rejected'
  uploadedAt: Date
  verifiedAt?: Date
  verifiedBy?: string
  rejectionReason?: string
  notes?: string
}

export interface FicaVerification {
  id: string
  userId: string
  user: User
  status: 'pending' | 'verified' | 'rejected'
  documents: FicaDocument[]
  submittedAt: Date
  verifiedAt?: Date
  verifiedBy?: string
  rejectionReason?: string
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high'
  notes?: string
}

// Mock FICA documents data
export const mockFicaDocuments: FicaDocument[] = [
  {
    id: generateId('doc'),
    userId: mockUsers[0].id,
    type: 'idDocument',
    fileName: 'ID_Document_John_Buyer.pdf',
    fileUrl: '/documents/id_document_1.pdf',
    status: 'verified',
    uploadedAt: new Date('2024-01-01'),
    verifiedAt: new Date('2024-01-15'),
    verifiedBy: 'admin@farmfeed.co.za'
  },
  {
    id: generateId('doc'),
    userId: mockUsers[0].id,
    type: 'bankStatement',
    fileName: 'Bank_Statement_Standard_Bank.pdf',
    fileUrl: '/documents/bank_statement_1.pdf',
    status: 'verified',
    uploadedAt: new Date('2024-01-01'),
    verifiedAt: new Date('2024-01-15'),
    verifiedBy: 'admin@farmfeed.co.za'
  },
  {
    id: generateId('doc'),
    userId: mockUsers[0].id,
    type: 'entityRegistration',
    fileName: 'Company_Registration_Demo_Feedlot.pdf',
    fileUrl: '/documents/entity_registration_1.pdf',
    status: 'verified',
    uploadedAt: new Date('2024-01-01'),
    verifiedAt: new Date('2024-01-15'),
    verifiedBy: 'admin@farmfeed.co.za'
  }
]

export class FicaService {
  // Get FICA verification for user
  static async getFicaVerification(userId: string): Promise<FicaVerification | null> {
    const user = mockUsers.find(u => u.id === userId)
    if (!user) return null

    const userDocuments = mockFicaDocuments.filter(doc => doc.userId === userId)
    
    if (userDocuments.length === 0) return null

    const complianceScore = this.calculateComplianceScore(userDocuments)
    const riskLevel = this.calculateRiskLevel(complianceScore)

    return {
      id: generateId('fica'),
      userId,
      user,
      status: user.ficaStatus,
      documents: userDocuments,
      submittedAt: userDocuments[0].uploadedAt,
      verifiedAt: user.ficaVerifiedAt,
      verifiedBy: userDocuments[0].verifiedBy,
      complianceScore,
      riskLevel,
      notes: user.ficaStatus === 'rejected' ? 'Documents require additional verification' : undefined
    }
  }

  // Upload FICA document
  static async uploadDocument(
    userId: string, 
    type: FicaDocument['type'], 
    fileName: string, 
    fileUrl: string
  ): Promise<FicaDocument> {
    const document: FicaDocument = {
      id: generateId('doc'),
      userId,
      type,
      fileName,
      fileUrl,
      status: 'pending',
      uploadedAt: new Date()
    }

    mockFicaDocuments.push(document)
    return document
  }

  // Verify FICA document (admin action)
  static async verifyDocument(
    documentId: string, 
    status: 'verified' | 'rejected', 
    verifiedBy: string,
    rejectionReason?: string,
    notes?: string
  ): Promise<FicaDocument> {
    const document = mockFicaDocuments.find(doc => doc.id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }

    document.status = status
    document.verifiedAt = new Date()
    document.verifiedBy = verifiedBy
    document.rejectionReason = rejectionReason
    document.notes = notes

    // Update user FICA status if all documents are verified
    if (status === 'verified') {
      await this.updateUserFicaStatus(document.userId)
    }

    return document
  }

  // Update user FICA status
  static async updateUserFicaStatus(userId: string): Promise<void> {
    const user = mockUsers.find(u => u.id === userId)
    if (!user) return

    const userDocuments = mockFicaDocuments.filter(doc => doc.userId === userId)
    const allVerified = userDocuments.every(doc => doc.status === 'verified')
    const anyRejected = userDocuments.some(doc => doc.status === 'rejected')

    if (allVerified) {
      user.ficaStatus = 'verified'
      user.ficaVerifiedAt = new Date()
    } else if (anyRejected) {
      user.ficaStatus = 'rejected'
    } else {
      user.ficaStatus = 'pending'
    }

    user.updatedAt = new Date()
  }

  // Calculate compliance score
  private static calculateComplianceScore(documents: FicaDocument[]): number {
    const totalDocuments = documents.length
    const verifiedDocuments = documents.filter(doc => doc.status === 'verified').length
    
    if (totalDocuments === 0) return 0
    
    return Math.round((verifiedDocuments / totalDocuments) * 100)
  }

  // Calculate risk level
  private static calculateRiskLevel(complianceScore: number): 'low' | 'medium' | 'high' {
    if (complianceScore >= 80) return 'low'
    if (complianceScore >= 60) return 'medium'
    return 'high'
  }

  // Get FICA compliance report
  static async getComplianceReport(): Promise<{
    totalUsers: number
    verifiedUsers: number
    pendingUsers: number
    rejectedUsers: number
    averageComplianceScore: number
    riskDistribution: Record<string, number>
  }> {
    const totalUsers = mockUsers.length
    const verifiedUsers = mockUsers.filter(u => u.ficaStatus === 'verified').length
    const pendingUsers = mockUsers.filter(u => u.ficaStatus === 'pending').length
    const rejectedUsers = mockUsers.filter(u => u.ficaStatus === 'rejected').length

    const complianceScores = await Promise.all(
      mockUsers.map(async user => {
        const verification = await this.getFicaVerification(user.id)
        return verification?.complianceScore || 0
      })
    )

    const averageComplianceScore = Math.round(
      complianceScores.reduce((sum, score) => sum + score, 0) / complianceScores.length
    )

    const riskDistribution = {
      low: 0,
      medium: 0,
      high: 0
    }

    for (const user of mockUsers) {
      const verification = await this.getFicaVerification(user.id)
      if (verification) {
        riskDistribution[verification.riskLevel]++
      }
    }

    return {
      totalUsers,
      verifiedUsers,
      pendingUsers,
      rejectedUsers,
      averageComplianceScore,
      riskDistribution
    }
  }

  // Check if user can access premium features
  static async canAccessPremiumFeatures(userId: string): Promise<boolean> {
    const user = mockUsers.find(u => u.id === userId)
    if (!user) return false

    return user.ficaStatus === 'verified'
  }

  // Get pending verifications for admin
  static async getPendingVerifications(): Promise<FicaVerification[]> {
    const pendingUsers = mockUsers.filter(u => u.ficaStatus === 'pending')
    
    const verifications = await Promise.all(
      pendingUsers.map(user => this.getFicaVerification(user.id))
    )

    return verifications.filter((v): v is FicaVerification => v !== null)
  }

  // Bulk verify user documents
  static async bulkVerifyUser(
    userId: string, 
    verifiedBy: string,
    notes?: string
  ): Promise<void> {
    const userDocuments = mockFicaDocuments.filter(doc => doc.userId === userId)
    
    for (const document of userDocuments) {
      if (document.status === 'pending') {
        await this.verifyDocument(document.id, 'verified', verifiedBy, undefined, notes)
      }
    }
  }
}
