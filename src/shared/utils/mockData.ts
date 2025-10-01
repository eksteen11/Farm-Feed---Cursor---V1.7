// Mock data stub - replace with Supabase queries
export const mockData = {
  listings: [],
  offers: [],
  users: [],
  notifications: [],
  transportRequests: [],
  transportQuotes: [],
  deals: [],
  messages: [],
  products: [],
  subscriptions: [],
  ficaVerifications: []
};

// Export individual mock data arrays for backward compatibility
export const mockUsers = [
  {
    id: '1',
    email: 'farmer@example.com',
    name: 'John Farmer',
    role: 'seller' as const,
    capabilities: ['sell'] as const,
    company: 'Green Valley Farm',
    location: 'Free State, South Africa',
    phone: '+27 82 123 4567',
    isVerified: true,
    subscriptionStatus: 'active' as const,
    ficaStatus: 'verified' as const,
    ficaDocuments: {},
    rating: 4.8,
    totalDeals: 45,
    totalTransactions: 67,
    reputationScore: 95,
    businessType: 'individual' as const,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  }
];

export const mockListings = [
  {
    id: '1',
    sellerId: '1',
    seller: mockUsers[0],
    product: {
      id: '1',
      name: 'Premium Maize',
      category: 'grain' as const,
      subcategory: 'maize',
      description: 'High-quality maize grain',
      specifications: { moisture: '12%', protein: '8.5%' },
      unit: 'ton' as const,
      minQuantity: 10,
      maxQuantity: 100,
    },
    title: 'Premium Maize - Grade A',
    description: 'High-quality maize grain from Free State. Perfect for feed production.',
    price: 4500,
    currency: 'ZAR' as const,
    quantity: 50,
    availableQuantity: 50,
    location: 'Free State, South Africa',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    isActive: true,
    deliveryOptions: {
      exFarm: true,
      delivered: true,
    },
    qualityGrade: 'A' as const,
    specifications: { moisture: '12%', protein: '8.5%' },
    certificates: ['SGS Quality Certificate'],
    mapVisibility: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    sellerId: '1',
    seller: mockUsers[0],
    product: {
      id: '2',
      name: 'Wheat Grain',
      category: 'grain' as const,
      subcategory: 'wheat',
      description: 'Premium wheat grain',
      specifications: { moisture: '11%', protein: '12%' },
      unit: 'ton' as const,
      minQuantity: 5,
      maxQuantity: 50,
    },
    title: 'Premium Wheat - Grade A',
    description: 'High-quality wheat grain suitable for milling and baking.',
    price: 5200,
    currency: 'ZAR' as const,
    quantity: 25,
    availableQuantity: 25,
    location: 'Western Cape, South Africa',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    isActive: true,
    deliveryOptions: {
      exFarm: true,
      delivered: false,
    },
    qualityGrade: 'A' as const,
    specifications: { moisture: '11%', protein: '12%' },
    certificates: ['Quality Certificate'],
    mapVisibility: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  }
];
export const mockOffers = [];
export const mockDeals = [];
export const mockNotifications = [];
export const mockTransportRequests = [];
export const mockTransportQuotes = [];
export const mockBackloadListings = [];
export const mockDashboardMetrics = [];
export const mockMarketDepth = [];
export const mockChatMessages = [];
export const mockInvoices = [];
export const mockSubscriptions = [];

// Export mock functions for backward compatibility
export const authenticateUser = () => null;
export const createUser = () => null;
export const updateUser = () => null;
export const deleteUser = () => null;
export const getUserById = () => null;
export const getUserByEmail = () => null;
export const getListingById = () => null;
export const getOffersByListingId = () => [];
export const getOffersByUserId = () => [];
export const getListingsBySellerId = () => [];
export const getDealsByUserId = () => [];
export const getNotificationsByUserId = () => [];
export const getTransportRequestsByUserId = () => [];
export const getTransportQuotesByTransporterId = () => [];
export const getListingsByCategory = () => [];
export const getListingsByLocation = () => [];
