export type UserRole = 'buyer' | 'seller' | 'transporter' | 'admin'

// New: User Capabilities for unified system
export type UserCapability = 'sell' | 'buy' | 'transport' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole // Keep for backward compatibility
  capabilities: UserCapability[] // New: unified capabilities
  company?: string
  location: string
  // Enhanced Location Information
  locationDetails?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
    farmName?: string
    postalCode?: string
  }
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
  plan: 'free' | 'basic' | 'premium' | 'enterprise' // Added 'free' plan
  price: number
  currency: 'ZAR'
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  startDate: Date
  endDate: Date
  paymentMethod: 'paystack' | 'bank_transfer'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  // Enhanced Subscription Features for unified system
  features: {
    listings: number // -1 for unlimited
    offers: number // -1 for unlimited
    transportRequests: number // -1 for unlimited
    transportQuotes: number // -1 for unlimited
    chatAccess: boolean
    analytics: boolean
    prioritySupport: boolean
    documentGeneration: boolean
    advancedRouting: boolean
    backloadMatching: boolean
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
  // Enhanced Location Information
  locationDetails?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
    farmName?: string
    postalCode?: string
  }
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
  // Map-specific fields
  mapVisibility: boolean
  transportRoutes?: TransportRoute[]
  createdAt: Date
  updatedAt: Date
}

// New: Enhanced Offer System
export interface Offer {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  price: number
  quantity: number
  deliveryType: 'ex-farm' | 'delivered'
  deliveryAddress?: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'counter-offered' | 'expired'
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  counterOffer?: {
    price: number
    message?: string
    createdAt: Date
  }
  transportRequestId?: string
  isNegotiable: boolean
  terms?: string
}

export interface ChatMessage {
  id: string
  offerId: string
  senderId: string
  receiverId: string
  message: string
  messageType: 'text' | 'offer' | 'counter-offer' | 'acceptance' | 'rejection'
  createdAt: Date
  isRead: boolean
  attachments?: string[]
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
  listingId: string
  buyerId: string
  sellerId: string
  transporterId?: string
  finalPrice: number
  quantity: number
  deliveryType: 'ex-farm' | 'delivered'
  deliveryAddress?: string
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  deliveryDate?: Date
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue'
  platformFee: number // R1/ton
  transportFee?: number
  totalAmount: number
  terms: string
  specialConditions?: string
}

// New: Transport Route Interface
export interface TransportRoute {
  id: string
  pickupLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
  }
  deliveryLocation: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
  }
  distance: number // in kilometers
  estimatedCost: number
  estimatedDuration: number // in hours
  status: 'available' | 'booked' | 'completed' | 'cancelled'
  routeType: 'direct' | 'multi-stop' | 'backload'
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
  // Enhanced Location Information
  pickupLocationDetails?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
  }
  deliveryLocationDetails?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
  }
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
  // Enhanced Location Information
  pickupLocationDetails?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
  }
  deliveryLocationDetails?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    province: string
    district?: string
  }
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
  // Route Information
  distance: number // in kilometers
  estimatedDuration: number // in hours
  createdAt: Date
  updatedAt: Date
}

// New: Invoice System
export interface Invoice {
  id: string
  dealId: string
  invoiceNumber: string
  buyerId: string
  sellerId: string
  transporterId?: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  platformFee: number
  transportFee?: number
  vat: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  paymentMethod?: string
  notes?: string
}

// New: Contract System
export interface Contract {
  id: string
  dealId: string
  contractNumber: string
  buyerId: string
  sellerId: string
  transporterId?: string
  type: 'sale' | 'transport' | 'combined'
  terms: string
  conditions: string[]
  signatures: {
    userId: string
    signedAt: Date
    ipAddress?: string
  }[]
  status: 'draft' | 'pending' | 'signed' | 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  effectiveDate: Date
  expiryDate?: Date
  attachments?: string[]
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

// New: Unified Dashboard Data Types
export interface DashboardStats {
  totalListings: number
  totalOffers: number
  totalDeals: number
  totalTransportRequests: number
  totalTransportQuotes: number
  totalRevenue: number
  totalExpenses: number
  activeContracts: number
  pendingInvoices: number
}

export interface DashboardSection {
  id: string
  title: string
  description: string
  icon: string
  route: string
  capabilities: UserCapability[]
  isVisible: (user: User) => boolean
  badge?: {
    count: number
    type: 'info' | 'success' | 'warning' | 'error'
  }
}

// New: Unified User Capability Helper
export const getUserCapabilities = (user: User): UserCapability[] => {
  if (!user) return []
  
  // If user has explicit capabilities, use them
  if (user.capabilities && user.capabilities.length > 0) {
    return user.capabilities
  }
  
  // Fallback to role-based capabilities for backward compatibility
  switch (user.role) {
    case 'buyer':
      return ['buy']
    case 'seller':
      return ['sell']
    case 'transporter':
      return ['transport']
    case 'admin':
      return ['admin', 'sell', 'buy', 'transport']
    default:
      return []
  }
}

export const canUserPerformAction = (user: User, action: UserCapability): boolean => {
  const capabilities = getUserCapabilities(user)
  return capabilities.includes(action)
}
