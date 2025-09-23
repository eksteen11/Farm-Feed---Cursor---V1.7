import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  User, 
  Listing, 
  Offer, 
  Message, 
  Notification, 
  Product,
  FilterOptions,
  Deal,
  TransportRequest,
  TransportQuote,
  Subscription,
  BackloadListing,
  Invoice,
  Contract,
  MarketData,
  SystemMetrics
} from '@/types'
import { SupabaseAuthService, SupabaseDatabaseService } from '@/lib/supabaseService'
import { supabase } from '@/lib/supabase'

interface SupabaseAppState {
  // Auth state
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Data state
  listings: Listing[]
  offers: Offer[]
  deals: Deal[]
  messages: Message[]
  notifications: Notification[]
  transportRequests: TransportRequest[]
  transportQuotes: TransportQuote[]
  backloadListings: BackloadListing[]
  subscriptions: Subscription[]
  invoices: Invoice[]
  contracts: Contract[]
  marketData: MarketData[]
  systemMetrics: SystemMetrics
  products: Product[]
  users: User[]

  // Filters
  filters: FilterOptions

  // Authentication actions
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Partial<User>, password: string) => Promise<boolean>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<User | null>

  // User management
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  deleteAccount: () => Promise<boolean>

  // Listings
  fetchListings: (filters?: FilterOptions) => Promise<void>
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId'>) => Promise<boolean>
  updateListing: (id: string, updates: Partial<Listing>) => Promise<boolean>
  deleteListing: (id: string) => Promise<boolean>
  getListingById: (id: string) => Promise<Listing | null>

  // Offers
  fetchOffers: () => Promise<void>
  createOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<boolean>
  deleteOffer: (id: string) => Promise<boolean>
  getOfferById: (id: string) => Promise<Offer | null>

  // Messages
  fetchMessages: (offerId?: string) => Promise<void>
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>) => Promise<boolean>
  updateMessage: (id: string, updates: Partial<Message>) => Promise<boolean>
  deleteMessage: (id: string) => Promise<boolean>

  // Notifications
  fetchNotifications: (userId: string) => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<boolean>
  markNotificationAsRead: (id: string) => Promise<boolean>
  markAllNotificationsAsRead: (userId: string) => Promise<boolean>
  deleteNotification: (id: string) => Promise<boolean>

  // Filters
  updateFilters: (filters: Partial<FilterOptions>) => void
  clearFilters: () => void

  // Products
  fetchProducts: () => Promise<void>
  getProductById: (id: string) => Promise<Product | null>

  // Utility
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeData: () => Promise<void>
}

export const useSupabaseStore = create<SupabaseAppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      listings: [],
      offers: [],
      deals: [],
      messages: [],
      notifications: [],
      transportRequests: [],
      transportQuotes: [],
      backloadListings: [],
      subscriptions: [],
      invoices: [],
      contracts: [],
      marketData: [],
      systemMetrics: {
        id: 'system-metrics-1',
        timestamp: new Date(),
        activeUsers: 0,
        totalTransactions: 0,
        platformRevenue: 0,
        systemUptime: 100,
        errorRate: 0,
        responseTime: 0,
        createdAt: new Date()
      },
      products: [],
      users: [],

      filters: {
        category: '',
        location: '',
        priceRange: { min: 0, max: 1000000 },
        quantityRange: { min: 0, max: 10000 },
        dateRange: { start: null, end: null },
        sortBy: 'date',
        sortOrder: 'desc'
      },

      // Authentication actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const result = await SupabaseAuthService.signIn(email, password)
          
          if (result.success && result.user) {
            set({ 
              currentUser: result.user, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return true
          } else {
            set({ 
              error: result.error || 'Login failed', 
              isLoading: false 
            })
            return false
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Login failed', 
            isLoading: false 
          })
          return false
        }
      },

      register: async (userData: Partial<User>, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          console.log('📝 Store: Attempting registration with:', { email: userData.email, name: userData.name })
          
          const result = await SupabaseAuthService.signUp(userData.email!, password, userData)
          
          console.log('📝 Store: Registration result:', result)
          
          if (result.success && result.user) {
            // Try to get the full user profile from the database
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', result.user.id)
              .single()
            
            if (profileError) {
              console.error('❌ Store: Error fetching user profile:', profileError)
              console.log('⚠️ Store: Using auth user data instead')
              
              // If we can't get the profile, use the auth user data
              const authUser = {
                id: result.user.id,
                email: result.user.email,
                name: result.user.user_metadata?.name || 'User',
                role: result.user.user_metadata?.role || 'buyer',
                roles: result.user.user_metadata?.roles || ['buyer'],
                capabilities: result.user.user_metadata?.capabilities || ['buy'],
                company: result.user.user_metadata?.company || '',
                location: '',
                phone: '',
                avatar: result.user.user_metadata?.avatar || '',
                isVerified: false,
                subscriptionStatus: 'free' as const,
                ficaStatus: 'pending' as const,
                ficaDocuments: {},
                rating: 0,
                totalDeals: 0,
                totalTransactions: 0,
                reputationScore: 0,
                businessType: 'individual' as const,
                createdAt: new Date(),
                updatedAt: new Date()
              }
              
              set({ 
                currentUser: authUser, 
                isAuthenticated: true, 
                isLoading: false 
              })
              console.log('✅ Store: Registration successful with auth user data')
              return true
            }
            
            set({ 
              currentUser: profile, 
              isAuthenticated: true, 
              isLoading: false 
            })
            console.log('✅ Store: Registration successful, user logged in')
            return true
          } else {
            console.error('❌ Store: Registration failed:', result.error)
            set({ 
              error: result.error || 'Registration failed', 
              isLoading: false 
            })
            return false
          }
        } catch (error: any) {
          console.error('❌ Store: Registration error:', error)
          set({ 
            error: error.message || 'Registration failed', 
            isLoading: false 
          })
          return false
        }
      },

      logout: async () => {
        try {
          await SupabaseAuthService.signOut()
          set({ 
            currentUser: null, 
            isAuthenticated: false,
            listings: [],
            offers: [],
            messages: [],
            notifications: []
          })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      getCurrentUser: async () => {
        try {
          const user = await SupabaseAuthService.getCurrentUser()
          if (user) {
            set({ currentUser: user, isAuthenticated: true })
          }
          return user
        } catch (error: any) {
          set({ error: error.message })
          return null
        }
      },

      // User management
      updateProfile: async (updates: Partial<User>) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        try {
          const updatedUser = await SupabaseDatabaseService.updateUser(currentUser.id, updates)
          if (updatedUser) {
            set({ currentUser: updatedUser })
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      deleteAccount: async () => {
        // Implementation would depend on Supabase Auth delete user functionality
        return false
      },

      // Listings
      fetchListings: async (filters?: FilterOptions) => {
        try {
          const listings = await SupabaseDatabaseService.getListings()
          set({ listings })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      createListing: async (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId'>) => {
        try {
          const { currentUser } = get()
          if (!currentUser) return false

          const newListing = await SupabaseDatabaseService.createListing({
            ...listing,
            sellerId: currentUser.id
          })
          
          if (newListing) {
            set(state => ({ listings: [...state.listings, newListing] }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      updateListing: async (id: string, updates: Partial<Listing>) => {
        try {
          const updatedListing = await SupabaseDatabaseService.updateListing(id, updates)
          
          if (updatedListing) {
            set(state => ({
              listings: state.listings.map(listing => 
                listing.id === id ? updatedListing : listing
              )
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      deleteListing: async (id: string) => {
        try {
          const success = await SupabaseDatabaseService.deleteListing(id)
          
          if (success) {
            set(state => ({
              listings: state.listings.filter(listing => listing.id !== id)
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      getListingById: async (id: string) => {
        try {
          return await SupabaseDatabaseService.getListingById(id)
        } catch (error: any) {
          set({ error: error.message })
          return null
        }
      },

      // Offers
      fetchOffers: async () => {
        try {
          const offers = await SupabaseDatabaseService.getOffers()
          set({ offers })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      createOffer: async (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          const newOffer = await SupabaseDatabaseService.createOffer(offer)
          
          if (newOffer) {
            set(state => ({ offers: [...state.offers, newOffer] }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      updateOffer: async (id: string, updates: Partial<Offer>) => {
        try {
          const updatedOffer = await SupabaseDatabaseService.updateOffer(id, updates)
          
          if (updatedOffer) {
            set(state => ({
              offers: state.offers.map(offer => 
                offer.id === id ? updatedOffer : offer
              )
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      deleteOffer: async (id: string) => {
        try {
          const success = await SupabaseDatabaseService.deleteOffer(id)
          
          if (success) {
            set(state => ({
              offers: state.offers.filter(offer => offer.id !== id)
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      getOfferById: async (id: string) => {
        try {
          return await SupabaseDatabaseService.getOfferById(id)
        } catch (error: any) {
          set({ error: error.message })
          return null
        }
      },

      // Messages
      fetchMessages: async (offerId?: string) => {
        try {
          const messages = await SupabaseDatabaseService.getMessages(offerId)
          set({ messages })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      addMessage: async (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>) => {
        try {
          const newMessage = await SupabaseDatabaseService.createMessage({
            ...message,
            isRead: false
          })
          
          if (newMessage) {
            set(state => ({ messages: [...state.messages, newMessage] }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      updateMessage: async (id: string, updates: Partial<Message>) => {
        try {
          const updatedMessage = await SupabaseDatabaseService.updateMessage(id, updates)
          
          if (updatedMessage) {
            set(state => ({
              messages: state.messages.map(message => 
                message.id === id ? updatedMessage : message
              )
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      deleteMessage: async (id: string) => {
        try {
          set(state => ({
            messages: state.messages.filter(message => message.id !== id)
          }))
          return true
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      // Notifications
      fetchNotifications: async (userId: string) => {
        try {
          const notifications = await SupabaseDatabaseService.getNotifications(userId)
          set({ notifications })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      addNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
        try {
          const newNotification = await SupabaseDatabaseService.createNotification(notification)
          
          if (newNotification) {
            set(state => ({ notifications: [newNotification, ...state.notifications] }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      markNotificationAsRead: async (id: string) => {
        try {
          const updatedNotification = await SupabaseDatabaseService.updateNotification(id, { isRead: true })
          
          if (updatedNotification) {
            set(state => ({
              notifications: state.notifications.map(notification => 
                notification.id === id ? updatedNotification : notification
              )
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      markAllNotificationsAsRead: async (userId: string) => {
        try {
          set(state => ({
            notifications: state.notifications.map(notification => 
              notification.userId === userId ? { ...notification, isRead: true } : notification
            )
          }))
          return true
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      deleteNotification: async (id: string) => {
        try {
          const success = await SupabaseDatabaseService.deleteNotification(id)
          
          if (success) {
            set(state => ({
              notifications: state.notifications.filter(notification => notification.id !== id)
            }))
            return true
          }
          return false
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      // Filters
      updateFilters: (filters: Partial<FilterOptions>) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }))
      },

      clearFilters: () => {
        set({
          filters: {
            category: '',
            location: '',
            priceRange: { min: 0, max: 1000000 },
            quantityRange: { min: 0, max: 10000 },
            dateRange: { start: null, end: null },
            sortBy: 'created_at',
            sortOrder: 'desc'
          }
        })
      },

      // Products
      fetchProducts: async () => {
        try {
          const products = await SupabaseDatabaseService.getProducts()
          set({ products })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      getProductById: async (id: string) => {
        try {
          return await SupabaseDatabaseService.getProductById(id)
        } catch (error: any) {
          set({ error: error.message })
          return null
        }
      },

      // Utility
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      initializeData: async () => {
        const { getCurrentUser } = get()
        const user = await getCurrentUser()
        
        if (user) {
          // Fetch user-specific data
          await get().fetchOffers()
          await get().fetchMessages()
          await get().fetchNotifications(user.id)
        }
        
        // Fetch global data
        await get().fetchListings()
        await get().fetchProducts()
      }
    }),
    {
      name: 'farmfeed-supabase-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        filters: state.filters
      })
    }
  )
)
