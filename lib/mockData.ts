import { 
  User, 
  Product, 
  Listing, 
  Offer, 
  Deal, 
  TransportRequest, 
  TransportQuote, 
  Subscription, 
  Notification, 
  BackloadListing, 
  Invoice, 
  Contract, 
  MarketData, 
  SystemMetrics,
  ChatMessage
} from '@/types'
import { generateId } from './helpers'

// Enhanced User Data with Subscriptions and FICA
export const mockUsers: User[] = [
  {
    id: generateId('user'),
    email: 'farmer@demo.com',
    name: 'Demo Farmer',
    role: 'buyer',
    capabilities: ['sell', 'buy', 'transport'], // TRUE UNIFIED: Can do everything
    company: 'Demo Mixed Farm',
    location: 'Free State',
    phone: '+27 82 123 4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date('2025-12-31'),
    ficaStatus: 'verified',
    ficaDocuments: {
      idDocument: 'verified',
      bankStatement: 'verified',
      entityRegistration: 'verified',
      taxClearance: 'verified'
    },
    ficaVerifiedAt: new Date('2024-01-15'),
    rating: 4.8,
    totalDeals: 45,
    totalTransactions: 67,
    reputationScore: 92,
    businessType: 'company',
    taxNumber: '123456789',
    vatNumber: 'VAT123456789',
    bankDetails: {
      bankName: 'Standard Bank',
      accountNumber: '1234567890',
      accountType: 'Business Current',
      branchCode: '051001'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: generateId('user'),
    email: 'seller@demo.com',
    name: 'Sarah Johnson',
    role: 'seller',
    capabilities: ['sell', 'buy', 'transport'], // TRUE UNIFIED: Can do everything
    company: 'Demo Maize Farm',
    location: 'Free State',
    phone: '+27 82 234 5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date('2025-12-31'),
    ficaStatus: 'verified',
    ficaDocuments: {
      idDocument: 'verified',
      bankStatement: 'verified',
      entityRegistration: 'verified'
    },
    ficaVerifiedAt: new Date('2024-01-10'),
    rating: 4.9,
    totalDeals: 23,
    totalTransactions: 34,
    reputationScore: 95,
    businessType: 'cooperative',
    taxNumber: '987654321',
    bankDetails: {
      bankName: 'ABSA Bank',
      accountNumber: '0987654321',
      accountType: 'Business Current',
      branchCode: '632005'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: generateId('user'),
    email: 'transporter@demo.com',
    name: 'Mike Transport',
    role: 'transporter',
    capabilities: ['transport', 'sell', 'buy'], // TRUE UNIFIED: Can do everything
    company: 'Demo Transport Services',
    location: 'Cape Town, Western Cape',
    phone: '+27 82 345 6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date('2025-12-31'),
    ficaStatus: 'verified',
    ficaDocuments: {
      idDocument: 'verified',
      bankStatement: 'verified',
      entityRegistration: 'verified'
    },
    ficaVerifiedAt: new Date('2024-01-12'),
    rating: 4.7,
    totalDeals: 67,
    totalTransactions: 89,
    reputationScore: 88,
    businessType: 'company',
    taxNumber: '456789123',
    bankDetails: {
      bankName: 'Nedbank',
      accountNumber: '4567891230',
      accountType: 'Business Current',
      branchCode: '198765'
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: generateId('user'),
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    capabilities: ['admin', 'sell', 'buy', 'transport'], // Admin can do everything
    company: 'Demo Farm Feed',
    location: 'Johannesburg, Gauteng',
    phone: '+27 82 456 7890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date('2025-12-31'),
    ficaStatus: 'verified',
    ficaDocuments: {},
    ficaVerifiedAt: new Date('2024-01-01'),
    rating: 5.0,
    totalDeals: 0,
    totalTransactions: 0,
    reputationScore: 100,
    businessType: 'company',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Enhanced Subscription Data
export const mockSubscriptions: Subscription[] = [
  {
    id: generateId('sub'),
    userId: mockUsers[0].id,
    user: mockUsers[0],
    plan: 'basic',
    price: 10,
    currency: 'ZAR',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    paymentMethod: 'paystack',
    paymentStatus: 'paid',
    features: {
      listings: -1, // unlimited
      offers: -1,
      transportRequests: -1,
      transportQuotes: -1, // unlimited
      chatAccess: true,
      analytics: false,
      prioritySupport: false,
      documentGeneration: false,
      advancedRouting: false,
      backloadMatching: false
    },
    autoRenew: true,
    nextBillingDate: new Date('2025-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: generateId('sub'),
    userId: mockUsers[1].id,
    user: mockUsers[1],
    plan: 'basic',
    price: 10,
    currency: 'ZAR',
    status: 'active',
    startDate: new Date('2024-01-05'),
    endDate: new Date('2025-12-31'),
    paymentMethod: 'paystack',
    paymentStatus: 'paid',
    features: {
      listings: -1,
      offers: -1,
      transportRequests: -1,
      transportQuotes: -1,
      chatAccess: true,
      analytics: false,
      prioritySupport: false,
      documentGeneration: false,
      advancedRouting: false,
      backloadMatching: false
    },
    autoRenew: true,
    nextBillingDate: new Date('2025-01-05'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: generateId('sub'),
    userId: mockUsers[2].id,
    user: mockUsers[2],
    plan: 'basic',
    price: 10,
    currency: 'ZAR',
    status: 'active',
    startDate: new Date('2024-01-03'),
    endDate: new Date('2025-12-31'),
    paymentMethod: 'paystack',
    paymentStatus: 'paid',
    features: {
      listings: -1,
      offers: -1,
      transportRequests: -1,
      transportQuotes: -1,
      chatAccess: true,
      analytics: false,
      prioritySupport: false,
      documentGeneration: false,
      advancedRouting: false,
      backloadMatching: false
    },
    autoRenew: true,
    nextBillingDate: new Date('2025-01-03'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
]

// Enhanced Product Data
export const mockProducts: Product[] = [
  {
    id: generateId('product'),
    name: 'Yellow Maize',
    category: 'grain',
    subcategory: 'maize',
    description: 'High-quality yellow maize suitable for animal feed and industrial use',
    specifications: {
      protein: '8-10%',
      moisture: '<14%',
      aflatoxin: '<20ppb',
      color: 'Bright yellow'
    },
    unit: 'ton',
    minQuantity: 1,
    maxQuantity: 1000
  },
  {
    id: generateId('product'),
    name: 'White Maize',
    category: 'grain',
    subcategory: 'maize',
    description: 'Premium white maize for human consumption and milling',
    specifications: {
      protein: '9-11%',
      moisture: '<13%',
      aflatoxin: '<10ppb',
      color: 'Pure white'
    },
    unit: 'ton',
    minQuantity: 1,
    maxQuantity: 500
  },
  {
    id: generateId('product'),
    name: 'Soybean Meal',
    category: 'feed',
    subcategory: 'protein',
    description: 'High-protein soybean meal for livestock feed',
    specifications: {
      protein: '44-48%',
      moisture: '<12%',
      fiber: '<7%',
      fat: '<2%'
    },
    unit: 'ton',
    minQuantity: 1,
    maxQuantity: 200
  }
]

// Enhanced Listing Data with Delivery Options
export const mockListings: Listing[] = [
  {
    id: generateId('listing'),
    sellerId: mockUsers[1].id,
    seller: mockUsers[1],
    product: mockProducts[0],
    title: 'Barley',
    description: 'High-quality yellow maize from our Free State farm. Perfect for animal feed and industrial use. Available for immediate collection or delivery.',
    price: 4944,
    currency: 'ZAR',
    quantity: 64,
    availableQuantity: 100,
    location: 'Caledon',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=top'
    ],
    isActive: true,
    expiresAt: new Date('2024-12-31'),
    deliveryOptions: {
      exFarm: true,
      delivered: true,
      ownTransport: {
        available: true,
        pricePerKm: 2.50,
        availableDates: [
          new Date('2024-01-20'),
          new Date('2024-01-21'),
          new Date('2024-01-22')
        ],
        routes: [
          'Free State → Johannesburg',
          'Free State → Cape Town',
          'Free State → Durban'
        ]
      }
    },
    qualityGrade: 'A',
    specifications: {
      protein: '9.2%',
      moisture: '13.5%',
      aflatoxin: '15ppb',
      color: 'Bright yellow',
      grade: 'Feed Grade',
      packaging: 'Bulk'
    },
    certificates: [
      'https://via.placeholder.com/400x300?text=Quality+Certificate',
      'https://via.placeholder.com/400x300?text=Lab+Report'
    ],
    labResults: ['https://via.placeholder.com/400x300?text=Lab+Results'],
    mapVisibility: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: generateId('listing'),
    sellerId: mockUsers[1].id,
    seller: mockUsers[1],
    product: mockProducts[1],
    title: 'Wheat',
    description: 'Premium white maize suitable for human consumption and milling. Strict quality control and testing.',
    price: 6500,
    currency: 'ZAR',
    quantity: 1000,
    availableQuantity: 50,
    location: 'Malmesbury',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=left',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=right'
    ],
    isActive: true,
    expiresAt: new Date('2024-12-31'),
    deliveryOptions: {
      exFarm: true,
      delivered: false,
      ownTransport: {
        available: false,
        pricePerKm: 0,
        availableDates: [],
        routes: []
      }
    },
    qualityGrade: 'A',
    specifications: {
      protein: '10.1%',
      moisture: '12.8%',
      aflatoxin: '8ppb',
      color: 'Pure white',
      grade: 'B1',
      packaging: '50kg bag'
    },
    certificates: [
      'https://via.placeholder.com/400x300?text=Quality+Certificate'
    ],
    labResults: ['https://via.placeholder.com/400x300?text=Lab+Results'],
    mapVisibility: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
]

// Mock Offers - Updated with proper relationships to demo accounts
export const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    listingId: mockListings[0].id, // Yellow Maize from seller@demo.com
    buyerId: mockUsers[0].id, // buyer@demo.com
    sellerId: mockUsers[1].id, // seller@demo.com
    price: 2800,
    quantity: 50,
    deliveryType: 'delivered',
    deliveryAddress: '123 Feedlot Road, Johannesburg, Gauteng',
    message: 'Interested in your maize. Can you deliver to our feedlot?',
    status: 'pending',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    expiresAt: new Date('2024-01-22T10:00:00Z'),
    isNegotiable: true,
    terms: 'Payment within 7 days of delivery'
  },
  {
    id: 'offer-2',
    listingId: mockListings[1].id, // White Maize from seller@demo.com
    buyerId: mockUsers[0].id, // buyer@demo.com
    sellerId: mockUsers[1].id, // seller@demo.com
    price: 3200,
    quantity: 25,
    deliveryType: 'ex-farm',
    message: 'Good price for quality feed. Will collect from farm.',
    status: 'accepted',
    createdAt: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z'),
    expiresAt: new Date('2024-01-21T14:30:00Z'),
    isNegotiable: false,
    terms: 'Cash on collection'
  },
  {
    id: 'offer-3',
    listingId: mockListings[0].id, // Yellow Maize from seller@demo.com
    buyerId: mockUsers[2].id, // transporter@demo.com (also testing as buyer)
    sellerId: mockUsers[1].id, // seller@demo.com
    price: 1800,
    quantity: 100,
    deliveryType: 'delivered',
    deliveryAddress: '456 Farm Street, Cape Town, Western Cape',
    message: 'Need seeds for spring planting. Can you deliver?',
    status: 'counter-offered',
    createdAt: new Date('2024-01-13T16:45:00Z'),
    updatedAt: new Date('2024-01-15T11:20:00Z'),
    expiresAt: new Date('2024-01-20T16:45:00Z'),
    counterOffer: {
      price: 1950,
      message: 'Price increased due to delivery costs. Still competitive.',
      createdAt: new Date('2024-01-15T11:20:00Z')
    },
    isNegotiable: true,
    terms: 'Payment before delivery'
  }
]

// Mock Chat Messages - Updated with proper relationships to demo accounts
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'chat-1',
    offerId: mockOffers[0].id, // offer-1 (pending offer)
    senderId: mockUsers[0].id, // buyer@demo.com
    receiverId: mockUsers[1].id, // seller@demo.com
    message: 'Hi, I\'m interested in your maize listing. Can you deliver to Johannesburg?',
    messageType: 'offer',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    isRead: true
  },
  {
    id: 'chat-2',
    offerId: mockOffers[0].id, // offer-1 (pending offer)
    senderId: mockUsers[1].id, // seller@demo.com
    receiverId: mockUsers[0].id, // buyer@demo.com
    message: 'Yes, I can deliver. What quantity are you looking for?',
    messageType: 'text',
    createdAt: new Date('2024-01-15T10:05:00Z'),
    isRead: true
  },
  {
    id: 'chat-3',
    offerId: mockOffers[0].id, // offer-1 (pending offer)
    senderId: mockUsers[0].id, // buyer@demo.com
    receiverId: mockUsers[1].id, // seller@demo.com
    message: 'I need 50 tons. What\'s your best price including delivery?',
    messageType: 'text',
    createdAt: new Date('2024-01-15T10:10:00Z'),
    isRead: false
  }
]

// Mock Deals - Updated with proper relationships to demo accounts
export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    offerId: mockOffers[1].id, // offer-2 (accepted offer)
    listingId: mockListings[1].id, // White Maize listing
    buyerId: mockUsers[0].id, // buyer@demo.com
    sellerId: mockUsers[1].id, // seller@demo.com
    finalPrice: 3200,
    quantity: 25,
    deliveryType: 'ex-farm',
    status: 'confirmed',
    createdAt: new Date('2024-01-16T09:15:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z'),
    deliveryDate: new Date('2024-01-20T10:00:00Z'),
    paymentStatus: 'pending',
    platformFee: 25, // R1/ton * 25 tons
    totalAmount: 3225,
    terms: 'Cash on collection, quality inspection before payment'
  }
]

// Enhanced Transport Request Data with Auto-quotes - Updated with proper relationships
export const mockTransportRequests: TransportRequest[] = [
  {
    id: generateId('transport'),
    dealId: mockDeals[0].id, // Related to the confirmed deal
    deal: mockDeals[0],
    listingId: mockListings[1].id, // White Maize listing
    listing: mockListings[1],
    requesterId: mockUsers[0].id, // buyer@demo.com
    requester: mockUsers[0],
    pickupLocation: 'Free State',
    deliveryLocation: 'Johannesburg, Gauteng',
    quantity: 25, // Match the deal quantity
    unit: 'ton',
    preferredDate: new Date('2024-01-22'),
    budget: 3000,
    status: 'open',
    productType: 'White Maize',
    specialRequirements: 'Covered transport, no rain damage',
    contactPhone: '+27 82 123 4567',
    urgent: false,
    autoQuote: {
      lowEstimate: 2800,
      mediumEstimate: 3200,
      highEstimate: 3600,
      calculation: {
        distance: 400,
        fuelCost: 1200,
        laborCost: 800,
        overhead: 1200
      }
    },
    platformFee: 300,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: generateId('transport'),
    requesterId: mockUsers[1].id, // seller@demo.com
    requester: mockUsers[1],
    pickupLocation: 'Free State',
    deliveryLocation: 'Cape Town, Western Cape',
    quantity: 25,
    unit: 'ton',
    preferredDate: new Date('2024-01-25'),
    budget: 2500,
    status: 'open',
    productType: 'White Maize',
    specialRequirements: 'Refrigerated transport if possible',
    contactPhone: '+27 82 234 5678',
    urgent: false,
    autoQuote: {
      lowEstimate: 3200,
      mediumEstimate: 3800,
      highEstimate: 4400,
      calculation: {
        distance: 1200,
        fuelCost: 3600,
        laborCost: 1200,
        overhead: 2000
      }
    },
    platformFee: 300,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
]

// Enhanced Transport Quote Data with Breakdown - Updated with proper relationships
export const mockTransportQuotes: TransportQuote[] = [
  {
    id: generateId('quote'),
    transportRequestId: mockTransportRequests[0].id, // From buyer@demo.com
    transportRequest: mockTransportRequests[0],
    transporterId: mockUsers[2].id, // transporter@demo.com
    transporter: mockUsers[2],
    price: 3200,
    estimatedDays: 2,
    message: 'Available for immediate pickup. Covered transport with GPS tracking.',
    status: 'pending',
    vehicleType: 'Covered Truck',
    insurance: 'Full Coverage',
    availableDate: new Date('2024-01-20'),
    breakdown: {
      basePrice: 2000,
      fuelSurcharge: 800,
      tollFees: 200,
      insurance: 200,
      total: 3200
    },
    platformFee: 150,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: generateId('quote'),
    transportRequestId: mockTransportRequests[0].id, // From buyer@demo.com
    transportRequest: mockTransportRequests[0],
    transporterId: generateId('user'),
    transporter: {
      ...mockUsers[2],
      id: generateId('user'),
      name: 'Fast Transport Co',
      company: 'Fast Transport Services'
    },
    price: 3500,
    estimatedDays: 1,
    message: 'Express delivery service. Available tomorrow.',
    status: 'pending',
    vehicleType: 'Express Truck',
    insurance: 'Premium Coverage',
    availableDate: new Date('2024-01-19'),
    breakdown: {
      basePrice: 2500,
      fuelSurcharge: 700,
      tollFees: 200,
      insurance: 100,
      total: 3500
    },
    platformFee: 150,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
]

// New: Backload Listings - Empty Truck Routes
export const mockBackloadListings: BackloadListing[] = [
  {
    id: generateId('backload'),
    transporterId: mockUsers[2].id,
    transporter: mockUsers[2],
    route: 'Johannesburg → Cape Town',
    pickupLocation: 'Johannesburg, Gauteng',
    deliveryLocation: 'Cape Town, Western Cape',
    availableDate: new Date('2024-01-20'),
    capacity: 20,
    unit: 'ton',
    pricePerKm: 2.80,
    totalPrice: 3360, // 1200km * 2.80
    status: 'active',
    vehicleDetails: {
      type: 'Covered Truck',
      capacity: 20,
      refrigeration: false,
      specialEquipment: ['GPS Tracking', 'Load Straps']
    },
    restrictions: ['No hazardous materials', 'Max height 2.5m'],
    distance: 1200, // Johannesburg to Cape Town in km
    estimatedDuration: 12, // hours
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: generateId('backload'),
    transporterId: mockUsers[1].id, // Sarah Johnson (seller) also does transport
    transporter: mockUsers[1],
    route: 'Free State → Johannesburg',
    pickupLocation: 'Free State',
    deliveryLocation: 'Johannesburg, Gauteng',
    availableDate: new Date('2024-01-21'),
    capacity: 15,
    unit: 'ton',
    pricePerKm: 3.20,
    totalPrice: 1280, // 400km * 3.20
    status: 'active',
    vehicleDetails: {
      type: 'Flatbed Truck',
      capacity: 15,
      refrigeration: false,
      specialEquipment: ['Load Straps', 'Tarpaulin']
    },
    restrictions: ['No liquids', 'Weather dependent'],
    distance: 400, // Free State to Johannesburg in km
    estimatedDuration: 4, // hours
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: generateId('backload'),
    transporterId: mockUsers[0].id, // Demo Farmer also does transport
    transporter: mockUsers[0],
    route: 'Johannesburg → Durban',
    pickupLocation: 'Johannesburg, Gauteng',
    deliveryLocation: 'Durban, KwaZulu-Natal',
    availableDate: new Date('2024-01-22'),
    capacity: 25,
    unit: 'ton',
    pricePerKm: 2.50,
    totalPrice: 2500, // 1000km * 2.50
    status: 'active',
    vehicleDetails: {
      type: 'Refrigerated Truck',
      capacity: 25,
      refrigeration: true,
      specialEquipment: ['Temperature Control', 'GPS Tracking', 'Load Straps']
    },
    restrictions: ['Temperature sensitive goods only', 'No hazardous materials'],
    distance: 1000, // Johannesburg to Durban in km
    estimatedDuration: 8, // hours
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

// Mock Invoices - Updated with proper relationships to demo accounts
export const mockInvoices: Invoice[] = [
  {
    id: 'invoice-1',
    dealId: mockDeals[0].id, // deal-1 (confirmed deal)
    invoiceNumber: 'INV-2024-001',
    buyerId: mockUsers[0].id, // buyer@demo.com
    sellerId: mockUsers[1].id, // seller@demo.com
    items: [
      {
        description: 'Premium White Maize',
        quantity: 25,
        unitPrice: 3200,
        total: 80000
      }
    ],
    subtotal: 80000,
    platformFee: 25,
    vat: 14000,
    total: 94025,
    status: 'sent',
    dueDate: new Date('2024-01-23T00:00:00Z'),
    createdAt: new Date('2024-01-16T09:30:00Z'),
    updatedAt: new Date('2024-01-16T09:30:00Z'),
    notes: 'Payment due within 7 days'
  }
]

// Mock Contracts - Updated with proper relationships to demo accounts
export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    dealId: mockDeals[0].id, // deal-1 (confirmed deal)
    contractNumber: 'CON-2024-001',
    buyerId: mockUsers[0].id, // buyer@demo.com
    sellerId: mockUsers[1].id, // seller@demo.com
    type: 'sale',
    terms: 'Standard agricultural product sale agreement',
    conditions: [
      'Quality inspection before payment',
      'Cash on collection',
      'No returns unless quality issues',
      'Platform fee of R1/ton applies'
    ],
    signatures: [
      {
        userId: mockUsers[1].id, // seller@demo.com
        signedAt: new Date('2024-01-16T09:45:00Z'),
        ipAddress: '192.168.1.100'
      },
      {
        userId: mockUsers[0].id, // buyer@demo.com
        signedAt: new Date('2024-01-16T10:00:00Z'),
        ipAddress: '192.168.1.101'
      }
    ],
    status: 'signed',
    createdAt: new Date('2024-01-16T09:30:00Z'),
    updatedAt: new Date('2024-01-16T10:00:00Z'),
    effectiveDate: new Date('2024-01-16T10:00:00Z')
  }
]

// Enhanced Notification Data - Updated with proper relationships to demo accounts
export const mockNotifications: Notification[] = [
  {
    id: generateId('notification'),
    userId: mockUsers[1].id, // seller@demo.com
    title: 'New Offer Received',
    message: 'You have received a new offer for your Yellow Maize listing',
    type: 'offer',
    isRead: false,
    relatedId: mockOffers[0].id,
    relatedType: 'offer',
    priority: 'medium',
    actionRequired: true,
    actionUrl: `/listings/${mockListings[0].id}`,
    expiresAt: new Date('2024-01-25'),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: generateId('notification'),
    userId: mockUsers[0].id, // buyer@demo.com
    title: 'Transport Quote Available',
    message: '2 transport quotes received for your request',
    type: 'transport',
    isRead: false,
    relatedId: mockTransportRequests[0].id,
    relatedType: 'transport',
    priority: 'high',
    actionRequired: true,
    actionUrl: `/transport/${mockTransportRequests[0].id}`,
    expiresAt: new Date('2024-01-25'),
    createdAt: new Date('2024-01-18'),
  },
  {
    id: generateId('notification'),
    userId: mockUsers[2].id, // transporter@demo.com
    title: 'New Transport Request',
    message: 'New transport request available for White Maize delivery',
    type: 'transport',
    isRead: false,
    relatedId: mockTransportRequests[0].id,
    relatedType: 'transport',
    priority: 'medium',
    actionRequired: true,
    actionUrl: `/transport/${mockTransportRequests[0].id}`,
    expiresAt: new Date('2024-01-25'),
    createdAt: new Date('2024-01-18'),
  }
]

// New: Market Data
export const mockMarketData: MarketData[] = [
  {
    id: generateId('market'),
    productType: 'Yellow Maize',
    location: 'Free State',
    date: new Date('2024-01-15'),
    averagePrice: 3250,
    totalVolume: 500,
    totalTransactions: 8,
    priceChange: 150,
    priceChangePercent: 4.8,
    marketTrend: 'rising',
    createdAt: new Date('2024-01-15')
  },
  {
    id: generateId('market'),
    productType: 'White Maize',
    location: 'Free State',
    date: new Date('2024-01-15'),
    averagePrice: 3750,
    totalVolume: 200,
    totalTransactions: 3,
    priceChange: -100,
    priceChangePercent: -2.6,
    marketTrend: 'falling',
    createdAt: new Date('2024-01-15')
  }
]

// New: System Metrics - Updated with realistic demo data
export const mockSystemMetrics: SystemMetrics[] = [
  {
    id: generateId('metric'),
    timestamp: new Date('2024-01-15'),
    activeUsers: 4, // Our 4 demo accounts
    totalTransactions: 1, // 1 confirmed deal
    platformRevenue: 25, // R1/ton * 25 tons from the confirmed deal
    systemUptime: 99.8,
    errorRate: 0.2,
    responseTime: 245,
    createdAt: new Date('2024-01-15')
  }
]

// Helper Functions
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email)
}

export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email)
  // In real app, verify password hash
  return user || null
}

export const createUser = (userData: Partial<User>): User => {
  const newUser: User = {
    id: generateId('user'),
    email: userData.email!,
    name: userData.name!,
    role: userData.role!,
    capabilities: userData.capabilities || (() => {
      // Map role to capabilities for backward compatibility
      switch (userData.role!) {
        case 'buyer': return ['buy']
        case 'seller': return ['sell']
        case 'transporter': return ['transport']
        case 'admin': return ['admin', 'sell', 'buy', 'transport']
        default: return ['buy']
      }
    })(),
    company: userData.company,
    location: userData.location!,
    phone: userData.phone,
    avatar: userData.avatar,
    isVerified: false,
    subscriptionStatus: 'pending',
    subscriptionExpiry: undefined,
    ficaStatus: 'pending',
    ficaDocuments: {},
    ficaVerifiedAt: undefined,
    rating: 0,
    totalDeals: 0,
    totalTransactions: 0,
    reputationScore: 0,
    businessType: userData.businessType || 'individual',
    taxNumber: userData.taxNumber,
    vatNumber: userData.vatNumber,
    bankDetails: userData.bankDetails,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  mockUsers.push(newUser)
  return newUser
}

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const userIndex = mockUsers.findIndex(user => user.id === id)
  if (userIndex === -1) return null
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date() }
  return mockUsers[userIndex]
}

export const deleteUser = (id: string): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === id)
  if (userIndex === -1) return false
  
  mockUsers.splice(userIndex, 1)
  return true
}

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const getListingById = (id: string): Listing | undefined => {
  return mockListings.find(listing => listing.id === id)
}

export const getOffersByListingId = (listingId: string): Offer[] => {
  return mockOffers.filter(offer => offer.listingId === listingId)
}

export const getOffersByUserId = (userId: string): Offer[] => {
  return mockOffers.filter(offer => offer.buyerId === userId)
}

export const getListingsBySellerId = (sellerId: string): Listing[] => {
  return mockListings.filter(listing => listing.sellerId === sellerId)
}

export const getDealsByUserId = (userId: string): Deal[] => {
  return mockDeals.filter(deal => deal.buyerId === userId || deal.sellerId === userId)
}

export const getNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId)
}

// Dashboard Metrics Data
export const mockDashboardMetrics = {
  totalUsers: mockUsers.length,
  totalListings: mockListings.length,
  totalDeals: mockDeals.length,
  totalRevenue: mockDeals.reduce((sum, deal) => sum + (deal.finalPrice * deal.quantity), 0),
  activeListings: mockListings.filter(l => l.isActive).length,
  pendingOffers: mockOffers.filter(o => o.status === 'pending').length,
  openTransportRequests: mockTransportRequests.filter(t => t.status === 'open').length,
  monthlyGrowth: 15.5,
  topCategories: [
    { category: 'grain', count: 3, revenue: 2500000 },
    { category: 'feed', count: 2, revenue: 1800000 },
    { category: 'seed', count: 1, revenue: 800000 }
  ],
  recentActivity: [
    { type: 'new_listing', user: mockUsers[1], product: 'Yellow Maize', time: '2 hours ago' },
    { type: 'offer_accepted', user: mockUsers[0], product: 'Yellow Maize', time: '4 hours ago' },
    { type: 'transport_quote', user: mockUsers[2], product: 'Yellow Maize', time: '6 hours ago' }
  ]
}

// Market Depth Data
export const mockMarketDepth = {
  maize: {
    buyOrders: [
      { price: 4000, quantity: 100, total: 400000 },
      { price: 4100, quantity: 150, total: 615000 },
      { price: 4200, quantity: 200, total: 840000 }
    ],
    sellOrders: [
      { price: 4200, quantity: 500, total: 2100000 },
      { price: 4300, quantity: 300, total: 1290000 },
      { price: 4400, quantity: 100, total: 440000 }
    ]
  },
  wheat: {
    buyOrders: [
      { price: 5600, quantity: 80, total: 448000 },
      { price: 5700, quantity: 120, total: 684000 },
      { price: 5800, quantity: 100, total: 580000 }
    ],
    sellOrders: [
      { price: 5800, quantity: 300, total: 1740000 },
      { price: 5900, quantity: 200, total: 1180000 },
      { price: 6000, quantity: 150, total: 900000 }
    ]
  }
}

export const getTransportRequestsByUserId = (userId: string): TransportRequest[] => {
  return mockTransportRequests.filter(request => request.requesterId === userId)
}

export const getTransportQuotesByTransporterId = (transporterId: string): TransportQuote[] => {
  return mockTransportQuotes.filter(quote => quote.transporterId === transporterId)
}

export const getListingsByCategory = (category: string): Listing[] => {
  return mockListings.filter(listing => listing.product.category === category)
}

export const getListingsByLocation = (location: string): Listing[] => {
  return mockListings.filter(listing => 
    listing.location.toLowerCase().includes(location.toLowerCase())
  )
}

