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
export const mockUsers = [];
export const mockListings = [];
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
