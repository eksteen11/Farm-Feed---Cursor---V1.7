export type UserRole = 'buyer' | 'seller' | 'transporter' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  company?: string
  location: string
  phone?: string
  avatar?: string
  isVerified: boolean
  subscriptionStatus: 'active' | 'inactive' | 'expired' | 'pending'
  subscriptionExpiry?: Date
  // FICA Verification Fields
  ficaStatus: 'pending' | 'verified' | 'rejected'
  ficaDocuments: {
    idDocument?: string
    bankStatement?: string
    entityRegistration?: string
    taxClearance?: string
  }
  ficaVerifiedAt?: Date
  // Enhanced Profile Fields
  rating: number
  totalDeals: number
  totalTransactions: number
  reputationScore: number
  // Business Details
  businessType: 'individual' | 'company' | 'cooperative'
  taxNumber?: string
  vatNumber?: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    accountType: string
    branchCode: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  category: 'grain' | 'feed' | 'seed' | 'fertilizer' | 'other'
  subcategory?: string
  description: string
  specifications: Record<string, any>
  unit: 'kg' | 'ton' | 'bag' | 'liter'
  minQuantity: number
  maxQuantity?: number
}

// Enhanced Subscription Interface
export interface Subscription {
  id: string
  userId: string
  user: User
  plan: 'basic' | 'premium' | 'enterprise'
  price: number
  currency: 'ZAR'
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  startDate: Date
  endDate: Date
  paymentMethod: 'paystack' | 'bank_transfer'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  // Enhanced Subscription Features
  features: {
    listings: number // -1 for unlimited
    offers: number
    transportRequests: number
    chatAccess: boolean
    analytics: boolean
    prioritySupport: boolean
  }
  autoRenew: boolean
  nextBillingDate?: Date
  createdAt: Date
  updatedAt: Date
}

// New: Enhanced Listing with Delivery Options
export interface Listing {
  id: string
  sellerId: string
  seller: User
  product: Product
  title: string
  description: string
  price: number
  currency: 'ZAR' | 'USD'
  quantity: number
  availableQuantity: number
  location: string
  images: string[]
  isActive: boolean
  expiresAt?: Date
  // Enhanced Fields
  deliveryOptions: {
    exFarm: boolean
    delivered: boolean
    ownTransport?: {
      available: boolean
      pricePerKm: number
      availableDates: Date[]
      routes: string[]
    }
  }
  qualityGrade: 'A' | 'B' | 'C' | 'D'
  specifications: Record<string, any>
  certificates: string[]
  labResults?: string[]
  createdAt: Date
  updatedAt: Date
}

// New: Enhanced Offer System
export interface Offer {
  id: string
  listingId: string
  listing: Listing
  buyerId: string
  buyer: User
  price: number
  quantity: number
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'countered'
  expiresAt: Date
  // Enhanced Fields
  deliveryAddress?: string
  deliveryDate?: Date
  transportRequired: boolean
  counterOffer?: {
    price: number
    quantity: number
    message: string
    expiresAt: Date
  }
  negotiationHistory: {
    action: 'offer' | 'counter' | 'accept' | 'reject'
    price: number
    quantity: number
    message: string
    timestamp: Date
    userId: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Negotiation {
  id: string
  offerId: string
  offer: Offer
  messages: Message[]
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  negotiationId: string
  senderId: string
  sender: User
  content: string
  type: 'text' | 'image' | 'document'
  createdAt: Date
}

// New: Enhanced Deal with Financial Tracking
export interface Deal {
  id: string
  offerId: string
  offer: Offer
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  finalPrice: number
  finalQuantity: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  deliveryStatus: 'pending' | 'arranged' | 'in_transit' | 'delivered'
  deliveryDate?: Date
  // Enhanced Financial Fields
  platformFee: number // R1/ton
  totalAmount: number
  paymentMethod: 'bank_transfer' | 'cash' | 'other'
  paymentReference?: string
  invoiceGenerated: boolean
  contractSigned: boolean
  // Transport Integration
  transportRequestId?: string
  transportCost?: number
  transportProvider?: User
  createdAt: Date
  updatedAt: Date
}

// New: Enhanced Transport Request
export interface TransportRequest {
  id: string
  dealId?: string
  deal?: Deal
  listingId?: string
  listing?: Listing
  requesterId: string
  requester: User
  pickupLocation: string
  deliveryLocation: string
  quantity: number
  unit: string
  preferredDate: Date
  budget?: number
  status: 'open' | 'quoted' | 'accepted' | 'in_progress' | 'completed'
  // Enhanced Fields
  productType?: string
  specialRequirements?: string
  contactPhone?: string
  urgent?: boolean
  // Auto-generated Transport Quote
  autoQuote?: {
    lowEstimate: number
    mediumEstimate: number
    highEstimate: number
    calculation: {
      distance: number
      fuelCost: number
      laborCost: number
      overhead: number
    }
  }
  // Platform Fee
  platformFee: number // R300 split between parties
  createdAt: Date
  updatedAt: Date
}

// New: Enhanced Transport Quote
export interface TransportQuote {
  id: string
  transportRequestId: string
  transportRequest: TransportRequest
  transporterId: string
  transporter: User
  price: number
  estimatedDays: number
  message?: string
  status: 'pending' | 'accepted' | 'rejected'
  // Enhanced Fields
  vehicleType: string
  insurance: string
  availableDate?: Date
  // Quote Details
  breakdown: {
    basePrice: number
    fuelSurcharge: number
    tollFees: number
    insurance: number
    total: number
  }
  // Platform Fee
  platformFee: number // R150 (half of R300)
  createdAt: Date
  updatedAt: Date
}

// New: Backload Listing for Transporters
export interface BackloadListing {
  id: string
  transporterId: string
  transporter: User
  route: string
  pickupLocation: string
  deliveryLocation: string
  availableDate: Date
  capacity: number
  unit: string
  pricePerKm: number
  totalPrice: number
  status: 'active' | 'booked' | 'expired'
  // Enhanced Fields
  vehicleDetails: {
    type: string
    capacity: number
    refrigeration: boolean
    specialEquipment: string[]
  }
  restrictions: string[]
  createdAt: Date
  updatedAt: Date
}

// New: Invoice System
export interface Invoice {
  id: string
  dealId: string
  deal: Deal
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  amount: number
  platformFee: number
  totalAmount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  paidAt?: Date
  paymentReference?: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  createdAt: Date
  updatedAt: Date
}

// New: Contract System
export interface Contract {
  id: string
  dealId: string
  deal: Deal
  type: 'sales_agreement' | 'transport_contract'
  status: 'draft' | 'pending' | 'signed' | 'active' | 'completed'
  parties: {
    userId: string
    user: User
    role: 'buyer' | 'seller' | 'transporter'
    signedAt?: Date
    signature?: string
  }[]
  terms: string
  effectiveDate: Date
  expiryDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Enhanced Notification System
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'offer' | 'transport' | 'payment' | 'system'
  isRead: boolean
  relatedId?: string
  relatedType?: 'offer' | 'deal' | 'transport' | 'payment' | 'listing' | 'subscription'
  // Enhanced Fields
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionRequired: boolean
  actionUrl?: string
  expiresAt?: Date
  createdAt: Date
}

// New: Market Analytics
export interface MarketData {
  id: string
  productType: string
  location: string
  date: Date
  averagePrice: number
  totalVolume: number
  totalTransactions: number
  priceChange: number
  priceChangePercent: number
  marketTrend: 'rising' | 'falling' | 'stable'
  createdAt: Date
}

// New: System Health & Monitoring
export interface SystemMetrics {
  id: string
  timestamp: Date
  activeUsers: number
  totalTransactions: number
  platformRevenue: number
  systemUptime: number
  errorRate: number
  responseTime: number
  createdAt: Date
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  minQuantity?: number
  maxQuantity?: number
  sortBy?: 'price' | 'date' | 'quantity' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
  success: boolean
}
