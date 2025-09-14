import { create } from 'zustand'
import { User, Listing, Offer, Deal, Notification, FilterOptions, TransportRequest, TransportQuote, BackloadListing } from '@/types'
import { 
  mockUsers, 
  mockListings, 
  mockOffers, 
  mockDeals, 
  mockNotifications, 
  mockTransportRequests,
  mockTransportQuotes,
  mockBackloadListings,
  mockDashboardMetrics,
  mockMarketDepth,
  authenticateUser,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getListingById,
  getOffersByListingId,
  getOffersByUserId,
  getListingsBySellerId,
  getDealsByUserId,
  getNotificationsByUserId,
  getTransportRequestsByUserId,
  getTransportQuotesByTransporterId,
  getListingsByCategory,
  getListingsByLocation
} from '@/lib/mockData'

interface AppState {
  // User state
  currentUser: User | null
  isAuthenticated: boolean
  
  // Data state
  listings: Listing[]
  offers: Offer[]
  deals: Deal[]
  notifications: Notification[]
  transportRequests: TransportRequest[]
  transportQuotes: TransportQuote[]
  backloadListings: BackloadListing[]
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Filter state
  filters: FilterOptions
  
  // Dashboard data
  dashboardMetrics: typeof mockDashboardMetrics | null
  marketDepth: typeof mockMarketDepth | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<User>) => Promise<boolean>
  
  // User management
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  deleteAccount: () => Promise<boolean>
  
  // Listings
  fetchListings: (filters?: FilterOptions) => void
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId'>) => void
  updateListing: (id: string, updates: Partial<Listing>) => void
  deleteListing: (id: string) => void
  
  // Offers
  fetchOffers: (userId?: string) => void
  createOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateOffer: (id: string, updates: Partial<Offer>) => void
  acceptOffer: (id: string) => void
  rejectOffer: (id: string) => void
  
  // Deals
  fetchDeals: (userId?: string) => void
  createDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  
  // Transport
  fetchTransportRequests: (userId?: string) => void
  createTransportRequest: (request: Omit<TransportRequest, 'id' | 'createdAt' | 'updatedAt' | 'requester' | 'requesterId'>) => void
  updateTransportRequest: (id: string, updates: Partial<TransportRequest>) => void
  
  fetchTransportQuotes: (transporterId?: string) => void
  createTransportQuote: (quote: Omit<TransportQuote, 'id' | 'createdAt' | 'updatedAt' | 'transporter' | 'transporterId'>) => void
  updateTransportQuote: (id: string, updates: Partial<TransportQuote>) => void
  
  // Notifications
  fetchNotifications: (userId: string) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: (userId: string) => void
  
  // Filters
  updateFilters: (filters: Partial<FilterOptions>) => void
  clearFilters: () => void
  
  // Dashboard
  fetchDashboardMetrics: () => void
  fetchMarketDepth: () => void
  
  // Subscription Management
  createSubscription: (plan: 'basic' | 'premium' | 'enterprise') => Promise<boolean>
  updateSubscription: (subscriptionId: string, updates: any) => Promise<boolean>
  cancelSubscription: (subscriptionId: string) => Promise<boolean>
  getSubscriptionStatus: () => Promise<any>
  
  // FICA Management
  uploadFicaDocument: (documentType: 'idDocument' | 'bankStatement' | 'entityRegistration' | 'taxClearance', file: File) => Promise<boolean>
  getFicaStatus: () => Promise<any>
  
  // Utility
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeData: () => void
}

// Helper function to generate stable IDs
const generateId = (prefix: string) => {
  if (typeof window === 'undefined') {
    // Server-side: use a placeholder that will be replaced on client
    return `${prefix}-placeholder`
  }
  return `${prefix}-${Date.now()}`
}

export const useStore = create<AppState>((set, get) => {
  // Initialize store from localStorage if available
  let initialState = {
    currentUser: null,
    isAuthenticated: false,
    listings: [], // Start with empty array to avoid hydration issues
    offers: [], // Start with empty array to avoid hydration issues
    deals: [], // Start with empty array to avoid hydration issues
    notifications: [], // Start with empty array to avoid hydration issues
    transportRequests: [], // Start with empty array to avoid hydration issues
    transportQuotes: [], // Start with empty array to avoid hydration issues
    backloadListings: [], // Start with empty array to avoid hydration issues
    isLoading: false,
    error: null,
    filters: {},
    dashboardMetrics: null, // Start with null to avoid hydration issues
    marketDepth: null, // Start with null to avoid hydration issues
  }

  // Restore authentication state from localStorage
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('farmfeed_user')
    const savedAuth = localStorage.getItem('farmfeed_auth')
    
    if (savedUser && savedAuth === 'true') {
      try {
        const user = JSON.parse(savedUser)
        
        // Convert date strings back to Date objects
        if (user.subscriptionExpiry) {
          user.subscriptionExpiry = new Date(user.subscriptionExpiry)
        }
        if (user.ficaVerifiedAt) {
          user.ficaVerifiedAt = new Date(user.ficaVerifiedAt)
        }
        if (user.createdAt) {
          user.createdAt = new Date(user.createdAt)
        }
        if (user.updatedAt) {
          user.updatedAt = new Date(user.updatedAt)
        }
        
        initialState.currentUser = user
        initialState.isAuthenticated = true
      } catch (error) {
        console.error('Failed to restore user session:', error)
        localStorage.removeItem('farmfeed_user')
        localStorage.removeItem('farmfeed_auth')
      }
    }
  }

  return {
    ...initialState,
    
    // Initialize data on client side
    initializeData: () => {
      console.log('initializeData called, window available:', typeof window !== 'undefined')
      if (typeof window !== 'undefined') {
        console.log('Setting mock data...')
        set({
          listings: mockListings,
          offers: mockOffers,
          deals: mockDeals,
          notifications: mockNotifications,
          transportRequests: mockTransportRequests,
          transportQuotes: mockTransportQuotes,
          backloadListings: mockBackloadListings,
          dashboardMetrics: mockDashboardMetrics,
          marketDepth: mockMarketDepth,
        })
        console.log('Mock data set successfully')
      }
    },
    
    // Authentication actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const user = authenticateUser(email, password)
      
      if (user) {
        set({ 
          currentUser: user, 
          isAuthenticated: true, 
          isLoading: false 
        })
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          // Convert dates to ISO strings for localStorage
          const userForStorage = {
            ...user,
            subscriptionExpiry: user.subscriptionExpiry?.toISOString(),
            ficaVerifiedAt: user.ficaVerifiedAt?.toISOString(),
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString()
          }
          localStorage.setItem('farmfeed_user', JSON.stringify(userForStorage))
          localStorage.setItem('farmfeed_auth', 'true')
        }
        
        // Keep all data in store, let dashboards filter it
        // This ensures both buyers and sellers can see relevant offers
        
        return true
      } else {
        set({ 
          error: 'Invalid email or password', 
          isLoading: false 
        })
        return false
      }
    } catch (error) {
      set({ 
        error: 'Login failed. Please try again.', 
        isLoading: false 
      })
      return false
    }
  },
  
  logout: () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farmfeed_user')
      localStorage.removeItem('farmfeed_auth')
    }
    
    set({
      currentUser: null,
      isAuthenticated: false,
      listings: [],
      offers: [],
      deals: [],
      notifications: [],
      transportRequests: [],
      transportQuotes: [],
      filters: {},
      dashboardMetrics: null,
      marketDepth: null,
    })
  },
  
  register: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null })
    
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        set({ 
          error: 'User with this email already exists', 
          isLoading: false 
        })
        return false
      }
      
      const newUser = createUser(userData)
      
      set({ 
        currentUser: newUser, 
        isAuthenticated: true, 
        isLoading: false 
      })
      
      return true
    } catch (error) {
      set({ 
        error: 'Registration failed. Please try again.', 
        isLoading: false 
      })
      return false
    }
  },
  
  // User management
  updateProfile: async (updates: Partial<User>) => {
    const { currentUser } = get()
    if (!currentUser) return false
    
    try {
      const updatedUser = updateUser(currentUser.id, updates)
      if (updatedUser) {
        set({ currentUser: updatedUser })
        return true
      }
      return false
    } catch (error) {
      set({ error: 'Failed to update profile' })
      return false
    }
  },
  
  deleteAccount: async () => {
    const { currentUser } = get()
    if (!currentUser) return false
    
    try {
      const success = deleteUser(currentUser.id)
      if (success) {
        get().logout()
        return true
      }
      return false
    } catch (error) {
      set({ error: 'Failed to delete account' })
      return false
    }
  },
  
  // Listings actions
  fetchListings: (filters = {}) => {
    console.log('fetchListings called with filters:', filters)
    console.log('mockListings length:', mockListings.length)
    set({ isLoading: true, error: null })
    
    try {
      let filteredListings = [...mockListings]
      console.log('filteredListings length:', filteredListings.length)
      
      // Apply filters
      if (filters.category) {
        filteredListings = getListingsByCategory(filters.category)
      }
      
      if (filters.minPrice) {
        filteredListings = filteredListings.filter(
          listing => listing.price >= filters.minPrice!
        )
      }
      
      if (filters.maxPrice) {
        filteredListings = filteredListings.filter(
          listing => listing.price <= filters.maxPrice!
        )
      }
      
      if (filters.location) {
        filteredListings = getListingsByLocation(filters.location)
      }
      
      if (filters.minQuantity) {
        filteredListings = filteredListings.filter(
          listing => listing.availableQuantity >= filters.minQuantity!
        )
      }
      
      if (filters.maxQuantity) {
        filteredListings = filteredListings.filter(
          listing => listing.availableQuantity <= filters.maxQuantity!
        )
      }
      
      // Apply sorting
      if (filters.sortBy) {
        filteredListings.sort((a, b) => {
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
      
      console.log('Setting listings in store:', filteredListings.length)
      set({ listings: filteredListings, isLoading: false })
      console.log('Listings set successfully')
    } catch (error) {
      console.error('Error in fetchListings:', error)
      set({ 
        error: 'Failed to fetch listings', 
        isLoading: false 
      })
    }
  },
  
  createListing: async (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId'>) => {
    const newListing: Listing = {
      ...listingData,
      id: generateId('listing'),
      sellerId: get().currentUser!.id,
      seller: get().currentUser!,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockListings.push(newListing)
    set({ listings: [...get().listings, newListing] })
    return newListing
  },
  
  updateListing: (id, updates) => {
    const listingIndex = mockListings.findIndex(l => l.id === id)
    if (listingIndex !== -1) {
      mockListings[listingIndex] = {
        ...mockListings[listingIndex],
        ...updates,
        updatedAt: new Date(),
      }
      
      set({ 
        listings: mockListings.map(l => 
          l.id === id ? mockListings[listingIndex] : l
        )
      })
    }
  },
  
  deleteListing: (id) => {
    const listingIndex = mockListings.findIndex(l => l.id === id)
    if (listingIndex !== -1) {
      mockListings.splice(listingIndex, 1)
      set({ 
        listings: get().listings.filter(l => l.id !== id)
      })
    }
  },
  
  // Offers actions
  fetchOffers: (userId) => {
    if (!userId) return
    
    try {
      // Get offers where user is either buyer or seller
      const userOffers = mockOffers.filter(offer => 
        offer.buyerId === userId || offer.sellerId === userId
      )
      set({ offers: userOffers })
    } catch (error) {
      set({ error: 'Failed to fetch offers' })
    }
  },
  
  createOffer: (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { currentUser } = get()
    if (!currentUser) return
    
    const newOffer: Offer = {
      ...offerData,
      id: generateId('offer'),
      buyerId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    set({ offers: [...get().offers, newOffer] })
  },
  
  updateOffer: (id, updates) => {
    const currentOffers = get().offers
    const offerIndex = currentOffers.findIndex(o => o.id === id)
    if (offerIndex !== -1) {
      const updatedOffer = {
        ...currentOffers[offerIndex],
        ...updates,
        updatedAt: new Date(),
      }
      
      const newOffers = currentOffers.map(o => 
        o.id === id ? updatedOffer : o
      )
      set({ offers: newOffers })
    }
  },
  
  acceptOffer: (id: string) => {
    get().updateOffer(id, { status: 'accepted' })
  },
  
  rejectOffer: (id: string) => {
    get().updateOffer(id, { status: 'rejected' })
  },
  
  // Deals actions
  fetchDeals: (userId) => {
    if (!userId) return
    
    try {
      // Get deals where user is either buyer or seller
      const userDeals = mockDeals.filter(deal => 
        deal.buyerId === userId || deal.sellerId === userId
      )
      set({ deals: userDeals })
    } catch (error) {
      set({ error: 'Failed to fetch deals' })
    }
  },
  
  createDeal: (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: generateId('deal'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    set({ deals: [...get().deals, newDeal] })
  },
  
  updateDeal: (id, updates) => {
    const currentDeals = get().deals
    const dealIndex = currentDeals.findIndex(d => d.id === id)
    if (dealIndex !== -1) {
      const updatedDeal = {
        ...currentDeals[dealIndex],
        ...updates,
        updatedAt: new Date(),
      }
      
      const newDeals = currentDeals.map(d => 
        d.id === id ? updatedDeal : d
      )
      set({ deals: newDeals })
    }
  },
  
  // Transport actions
  fetchTransportRequests: (userId) => {
    if (!userId) return
    
    try {
      // Get transport requests where user is the requester
      const userRequests = mockTransportRequests.filter(request => 
        request.requesterId === userId
      )
      set({ transportRequests: userRequests })
    } catch (error) {
      set({ error: 'Failed to fetch transport requests' })
    }
  },
  
  createTransportRequest: (requestData) => {
    const { currentUser } = get()
    if (!currentUser) return
    
    const newRequest: TransportRequest = {
      ...requestData,
      id: generateId('transport'),
      requesterId: currentUser.id,
      requester: currentUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    set({ transportRequests: [...get().transportRequests, newRequest] })
  },
  
  updateTransportRequest: (id, updates) => {
    const currentRequests = get().transportRequests
    const requestIndex = currentRequests.findIndex(r => r.id === id)
    if (requestIndex !== -1) {
      const updatedRequest = {
        ...currentRequests[requestIndex],
        ...updates,
        updatedAt: new Date(),
      }
      
      const newRequests = currentRequests.map(r => 
        r.id === id ? updatedRequest : r
      )
      set({ transportRequests: newRequests })
    }
  },
  
  fetchTransportQuotes: (transporterId) => {
    if (!transporterId) return
    
    try {
      // Get transport quotes where user is the transporter
      const transporterQuotes = mockTransportQuotes.filter(quote => 
        quote.transporterId === transporterId
      )
      set({ transportQuotes: transporterQuotes })
    } catch (error) {
      set({ error: 'Failed to fetch transport quotes' })
    }
  },
  
  createTransportQuote: (quoteData) => {
    const { currentUser } = get()
    if (!currentUser) return
    
    const request = mockTransportRequests.find(r => r.id === quoteData.transportRequestId)
    if (!request) return
    
    const newQuote: TransportQuote = {
      ...quoteData,
      id: generateId('quote'),
      transporterId: currentUser.id,
      transporter: currentUser,
      transportRequest: request,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    set({ transportQuotes: [...get().transportQuotes, newQuote] })
  },
  
  updateTransportQuote: (id, updates) => {
    const currentQuotes = get().transportQuotes
    const quoteIndex = currentQuotes.findIndex(q => q.id === id)
    if (quoteIndex !== -1) {
      const updatedQuote = {
        ...currentQuotes[quoteIndex],
        ...updates,
        updatedAt: new Date(),
      }
      
      const newQuotes = currentQuotes.map(q => 
        q.id === id ? updatedQuote : q
      )
      set({ transportQuotes: newQuotes })
    }
  },
  
  // Notifications actions
  fetchNotifications: (userId) => {
    try {
      const userNotifications = getNotificationsByUserId(userId)
      set({ notifications: userNotifications })
    } catch (error) {
      set({ error: 'Failed to fetch notifications' })
    }
  },
  
  markNotificationAsRead: (id) => {
    const currentNotifications = get().notifications
    const notificationIndex = currentNotifications.findIndex(n => n.id === id)
    if (notificationIndex !== -1) {
      const updatedNotification = {
        ...currentNotifications[notificationIndex],
        isRead: true
      }
      
      const newNotifications = currentNotifications.map(n => 
        n.id === id ? updatedNotification : n
      )
      set({ notifications: newNotifications })
    }
  },
  
  markAllNotificationsAsRead: (userId) => {
    const currentNotifications = get().notifications
    const updatedNotifications = currentNotifications.map(notification => 
      notification.userId === userId 
        ? { ...notification, isRead: true }
        : notification
    )
    
    set({ notifications: updatedNotifications })
  },
  
  // Filter actions
  updateFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } })
    get().fetchListings({ ...get().filters, ...newFilters })
  },
  
  clearFilters: () => {
    set({ filters: {} })
    get().fetchListings()
  },
  
  // Dashboard actions
  fetchDashboardMetrics: () => {
    set({ dashboardMetrics: mockDashboardMetrics })
  },
  
  fetchMarketDepth: () => {
    set({ marketDepth: mockMarketDepth })
  },
  
  // Subscription actions
  createSubscription: async (plan) => {
    const { currentUser } = get()
    if (!currentUser) return false
    
    try {
      set({ isLoading: true, error: null })
      
      // Import subscription service
      const { SubscriptionService } = await import('@/lib/subscriptionService')
      const subscription = await SubscriptionService.createSubscription(currentUser.id, plan)
      
      if (subscription) {
        // Update user subscription status
        const updatedUser = { ...currentUser, subscriptionStatus: 'active' as const }
        set({ currentUser: updatedUser })
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('farmfeed_user', JSON.stringify(updatedUser))
        }
        
        set({ isLoading: false })
        return true
      }
      
      set({ isLoading: false, error: 'Failed to create subscription' })
      return false
    } catch (error) {
      set({ isLoading: false, error: 'Subscription creation failed' })
      return false
    }
  },
  
  updateSubscription: async (subscriptionId, updates) => {
    try {
      set({ isLoading: true, error: null })
      
      const { SubscriptionService } = await import('@/lib/subscriptionService')
      const updated = await SubscriptionService.updateSubscriptionStatus(subscriptionId, updates.status)
      
      set({ isLoading: false })
      return !!updated
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update subscription' })
      return false
    }
  },
  
  cancelSubscription: async (subscriptionId) => {
    try {
      set({ isLoading: true, error: null })
      
      const { SubscriptionService } = await import('@/lib/subscriptionService')
      const cancelled = await SubscriptionService.cancelSubscription(subscriptionId)
      
              if (cancelled) {
          // Update user subscription status
          const { currentUser } = get()
          if (currentUser) {
            const updatedUser = { ...currentUser, subscriptionStatus: 'inactive' as const }
            set({ currentUser: updatedUser })
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('farmfeed_user', JSON.stringify(updatedUser))
            }
          }
        }
      
      set({ isLoading: false })
      return !!cancelled
    } catch (error) {
      set({ isLoading: false, error: 'Failed to cancel subscription' })
      return false
    }
  },
  
  getSubscriptionStatus: async () => {
    const { currentUser } = get()
    if (!currentUser) return null
    
    try {
      const { SubscriptionService } = await import('@/lib/subscriptionService')
      return await SubscriptionService.getSubscriptionByUserId(currentUser.id)
    } catch (error) {
      set({ error: 'Failed to fetch subscription status' })
      return null
    }
  },
  
  // FICA actions
  uploadFicaDocument: async (documentType, file) => {
    const { currentUser } = get()
    if (!currentUser) return false
    
    try {
      set({ isLoading: true, error: null })
      
      const { FicaService } = await import('@/lib/ficaService')
      const document = await FicaService.uploadDocument(
        currentUser.id,
        documentType,
        file.name,
        URL.createObjectURL(file)
      )
      
      set({ isLoading: false })
      return !!document
    } catch (error) {
      set({ isLoading: false, error: 'Failed to upload document' })
      return false
    }
  },
  
  getFicaStatus: async () => {
    const { currentUser } = get()
    if (!currentUser) return null
    
    try {
      const { FicaService } = await import('@/lib/ficaService')
      return await FicaService.getFicaVerification(currentUser.id)
    } catch (error) {
      set({ error: 'Failed to fetch FICA status' })
      return null
    }
  },
  
  // Utility actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  }
})

