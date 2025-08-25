import { 
  User, 
  Listing, 
  Product, 
  Offer, 
  Deal, 
  TransportRequest, 
  TransportQuote, 
  Subscription, 
  Notification,
  FilterOptions,
  PaginationMeta,
  ApiResponse
} from '@/types'
import { 
  mockUsers, 
  mockListings, 
  mockProducts, 
  mockOffers, 
  mockDeals, 
  mockTransportRequests,
  mockTransportQuotes,
  mockSubscriptions,
  mockNotifications,
  mockDashboardMetrics,
  mockMarketDepth,
  getUserById,
  getUserByEmail,
  getListingById,
  getOffersByListingId,
  getOffersByUserId,
  getListingsBySellerId,
  getDealsByUserId,
  getNotificationsByUserId,
  getTransportRequestsByUserId,
  getTransportQuotesByTransporterId,
  getListingsByCategory,
  getListingsByLocation,
  createUser,
  updateUser,
  deleteUser
} from './mockData'

export interface DatabaseFilters extends FilterOptions {
  page?: number
  limit?: number
}

export interface DatabaseResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
  success: boolean
}

class DatabaseService {
  // User operations
  async getUsers(filters?: DatabaseFilters): Promise<DatabaseResponse<User[]>> {
    try {
      let users = [...mockUsers]
      
      // Apply filters
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        users = users.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || users.length,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / (filters?.limit || mockUsers.length))
      }
      
      return {
        data: users,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch users'
      }
    }
  }

  async getUserById(id: string): Promise<DatabaseResponse<User | null>> {
    try {
      const user = getUserById(id)
      return {
        data: user || null,
        success: !!user,
        message: user ? 'User found' : 'User not found'
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        message: 'Failed to fetch user'
      }
    }
  }

  async getUserByEmail(email: string): Promise<DatabaseResponse<User | null>> {
    try {
      const user = getUserByEmail(email)
      return {
        data: user || null,
        success: !!user,
        message: user ? 'User found' : 'User not found'
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        message: 'Failed to fetch user'
      }
    }
  }

  async createUser(userData: Partial<User>): Promise<DatabaseResponse<User>> {
    try {
      const newUser = createUser(userData)
      return {
        data: newUser,
        success: true,
        message: 'User created successfully'
      }
    } catch (error) {
      return {
        data: {} as User,
        success: false,
        message: 'Failed to create user'
      }
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<DatabaseResponse<User | null>> {
    try {
      const updatedUser = updateUser(id, updates)
      return {
        data: updatedUser,
        success: !!updatedUser,
        message: updatedUser ? 'User updated successfully' : 'User not found'
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        message: 'Failed to update user'
      }
    }
  }

  async deleteUser(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const success = deleteUser(id)
      return {
        data: success,
        success,
        message: success ? 'User deleted successfully' : 'User not found'
      }
    } catch (error) {
      return {
        data: false,
        success: false,
        message: 'Failed to delete user'
      }
    }
  }

  // Listing operations
  async getListings(filters?: DatabaseFilters): Promise<DatabaseResponse<Listing[]>> {
    try {
      let listings = [...mockListings]
      
      // Apply filters
      if (filters?.category) {
        listings = getListingsByCategory(filters.category)
      }
      
      if (filters?.location) {
        listings = getListingsByLocation(filters.location)
      }
      
      if (filters?.minPrice) {
        listings = listings.filter(l => l.price >= filters.minPrice!)
      }
      
      if (filters?.maxPrice) {
        listings = listings.filter(l => l.price <= filters.maxPrice!)
      }
      
      if (filters?.minQuantity) {
        listings = listings.filter(l => l.availableQuantity >= filters.minQuantity!)
      }
      
      if (filters?.maxQuantity) {
        listings = listings.filter(l => l.availableQuantity <= filters.maxQuantity!)
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        listings.sort((a, b) => {
          let aValue: any, bValue: any
          
          switch (filters.sortBy) {
            case 'price':
              aValue = a.price
              bValue = b.price
              break
            case 'date':
              aValue = a.createdAt
              bValue = b.createdAt
              break
            case 'quantity':
              aValue = a.availableQuantity
              bValue = b.availableQuantity
              break
            default:
              return 0
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }
      
      // Apply pagination
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        listings = listings.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || listings.length,
        total: mockListings.length,
        totalPages: Math.ceil(mockListings.length / (filters?.limit || mockListings.length))
      }
      
      return {
        data: listings,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch listings'
      }
    }
  }

  async getListingById(id: string): Promise<DatabaseResponse<Listing | null>> {
    try {
      const listing = getListingById(id)
      return {
        data: listing || null,
        success: !!listing,
        message: listing ? 'Listing found' : 'Listing not found'
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        message: 'Failed to fetch listing'
      }
    }
  }

  async getListingsBySeller(sellerId: string): Promise<DatabaseResponse<Listing[]>> {
    try {
      const listings = getListingsBySellerId(sellerId)
      return {
        data: listings,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch seller listings'
      }
    }
  }

  // Offer operations
  async getOffers(filters?: DatabaseFilters): Promise<DatabaseResponse<Offer[]>> {
    try {
      let offers = [...mockOffers]
      
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        offers = offers.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || offers.length,
        total: mockOffers.length,
        totalPages: Math.ceil(mockOffers.length / (filters?.limit || offers.length))
      }
      
      return {
        data: offers,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch offers'
      }
    }
  }

  async getOffersByListing(listingId: string): Promise<DatabaseResponse<Offer[]>> {
    try {
      const offers = getOffersByListingId(listingId)
      return {
        data: offers,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch listing offers'
      }
    }
  }

  async getOffersByUser(userId: string): Promise<DatabaseResponse<Offer[]>> {
    try {
      const offers = getOffersByUserId(userId)
      return {
        data: offers,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch user offers'
      }
    }
  }

  // Deal operations
  async getDeals(filters?: DatabaseFilters): Promise<DatabaseResponse<Deal[]>> {
    try {
      let deals = [...mockDeals]
      
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        deals = deals.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || deals.length,
        total: mockDeals.length,
        totalPages: Math.ceil(mockDeals.length / (filters?.limit || deals.length))
      }
      
      return {
        data: deals,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch deals'
      }
    }
  }

  async getDealsByUser(userId: string): Promise<DatabaseResponse<Deal[]>> {
    try {
      const deals = getDealsByUserId(userId)
      return {
        data: deals,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch user deals'
      }
    }
  }

  // Transport operations
  async getTransportRequests(filters?: DatabaseFilters): Promise<DatabaseResponse<TransportRequest[]>> {
    try {
      let requests = [...mockTransportRequests]
      
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        requests = requests.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || requests.length,
        total: mockTransportRequests.length,
        totalPages: Math.ceil(mockTransportRequests.length / (filters?.limit || requests.length))
      }
      
      return {
        data: requests,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch transport requests'
      }
    }
  }

  async getTransportRequestsByUser(userId: string): Promise<DatabaseResponse<TransportRequest[]>> {
    try {
      const requests = getTransportRequestsByUserId(userId)
      return {
        data: requests,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch user transport requests'
      }
    }
  }

  async getTransportQuotes(filters?: DatabaseFilters): Promise<DatabaseResponse<TransportQuote[]>> {
    try {
      let quotes = [...mockTransportQuotes]
      
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        quotes = quotes.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || quotes.length,
        total: mockTransportQuotes.length,
        totalPages: Math.ceil(mockTransportQuotes.length / (filters?.limit || quotes.length))
      }
      
      return {
        data: quotes,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch transport quotes'
      }
    }
  }

  async getTransportQuotesByTransporter(transporterId: string): Promise<DatabaseResponse<TransportQuote[]>> {
    try {
      const quotes = getTransportQuotesByTransporterId(transporterId)
      return {
        data: quotes,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch transporter quotes'
      }
    }
  }

  // Notification operations
  async getNotifications(userId: string): Promise<DatabaseResponse<Notification[]>> {
    try {
      const notifications = getNotificationsByUserId(userId)
      return {
        data: notifications,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch notifications'
      }
    }
  }

  // Dashboard operations
  async getDashboardMetrics(): Promise<DatabaseResponse<typeof mockDashboardMetrics>> {
    try {
      return {
        data: mockDashboardMetrics,
        success: true
      }
    } catch (error) {
      return {
        data: {} as typeof mockDashboardMetrics,
        success: false,
        message: 'Failed to fetch dashboard metrics'
      }
    }
  }

  async getMarketDepth(): Promise<DatabaseResponse<typeof mockMarketDepth>> {
    try {
      return {
        data: mockMarketDepth,
        success: true
      }
    } catch (error) {
      return {
        data: {} as typeof mockMarketDepth,
        success: false,
        message: 'Failed to fetch market depth'
      }
    }
  }

  // Product operations
  async getProducts(): Promise<DatabaseResponse<Product[]>> {
    try {
      return {
        data: mockProducts,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch products'
      }
    }
  }

  async getProductsByCategory(category: string): Promise<DatabaseResponse<Product[]>> {
    try {
      const products = mockProducts.filter(p => p.category === category)
      return {
        data: products,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch products by category'
      }
    }
  }

  // Subscription operations
  async getSubscriptions(): Promise<DatabaseResponse<Subscription[]>> {
    try {
      return {
        data: mockSubscriptions,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch subscriptions'
      }
    }
  }

  // Search operations
  async searchListings(query: string, filters?: DatabaseFilters): Promise<DatabaseResponse<Listing[]>> {
    try {
      let listings = mockListings.filter(listing => 
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        listing.location.toLowerCase().includes(query.toLowerCase()) ||
        listing.product.name.toLowerCase().includes(query.toLowerCase())
      )
      
      // Apply additional filters
      if (filters?.category) {
        listings = listings.filter(l => l.product.category === filters.category)
      }
      
      if (filters?.minPrice) {
        listings = listings.filter(l => l.price >= filters.minPrice!)
      }
      
      if (filters?.maxPrice) {
        listings = listings.filter(l => l.price <= filters.maxPrice!)
      }
      
      // Apply pagination
      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit
        listings = listings.slice(start, end)
      }
      
      const meta: PaginationMeta = {
        page: filters?.page || 1,
        limit: filters?.limit || listings.length,
        total: listings.length,
        totalPages: Math.ceil(listings.length / (filters?.limit || listings.length))
      }
      
      return {
        data: listings,
        meta,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Search failed'
      }
    }
  }

  // Analytics operations
  async getAnalytics(userId?: string): Promise<DatabaseResponse<any>> {
    try {
      const analytics: any = {
        totalUsers: mockUsers.length,
        totalListings: mockListings.length,
        totalDeals: mockDeals.length,
        totalRevenue: mockDeals.reduce((sum, deal) => sum + (deal.finalPrice * deal.finalQuantity), 0),
        activeListings: mockListings.filter(l => l.isActive).length,
        pendingOffers: mockOffers.filter(o => o.status === 'pending').length,
        openTransportRequests: mockTransportRequests.filter(t => t.status === 'open').length,
        monthlyGrowth: 15.5,
        topCategories: [
          { category: 'grain', count: 3, revenue: 2500000 },
          { category: 'feed', count: 2, revenue: 1800000 },
          { category: 'seed', count: 1, revenue: 800000 }
        ]
      }
      
      if (userId) {
        const userListings = getListingsBySellerId(userId)
        const userOffers = getOffersByUserId(userId)
        const userDeals = getDealsByUserId(userId)
        
        analytics['userListings'] = userListings.length
        analytics['userOffers'] = userOffers.length
        analytics['userDeals'] = userDeals.length
        analytics['userRevenue'] = userDeals.reduce((sum, deal) => sum + (deal.finalPrice * deal.finalQuantity), 0)
      }
      
      return {
        data: analytics,
        success: true
      }
    } catch (error) {
      return {
        data: {},
        success: false,
        message: 'Failed to fetch analytics'
      }
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()

// Export the class for testing purposes
export default DatabaseService
