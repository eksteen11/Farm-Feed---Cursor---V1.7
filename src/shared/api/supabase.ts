import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

// Server-side client with service role key (for admin operations)
// Only create this on the server side
export const supabaseAdmin = typeof window === 'undefined' ? createClient(
  url,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

// Export service classes for backward compatibility
export class SupabaseDatabaseService {
  constructor() {
    // Stub implementation
  }

  static async getListings() {
    try {
      console.log('🔍 SupabaseDatabaseService: Fetching listings...')
      
      // First try a simple query to see if we can get any data
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('🔍 SupabaseDatabaseService: Raw listings data:', data)
      console.log('🔍 SupabaseDatabaseService: Fetched listings count:', data?.length || 0)
      
      if (error) {
        console.error('❌ SupabaseDatabaseService: Error fetching listings:', error)
        return { data: [], error }
      }
      
      // If we get data, try to fetch related data
      if (data && data.length > 0) {
        console.log('🔍 SupabaseDatabaseService: Found listings, now fetching related data...')
        
        // Get unique seller IDs
        const sellerIds = [...new Set(data.map(listing => listing.seller_id))]
        const productIds = [...new Set(data.map(listing => listing.product_id))]
        
        console.log('🔍 SupabaseDatabaseService: Seller IDs:', sellerIds)
        console.log('🔍 SupabaseDatabaseService: Product IDs:', productIds)
        
        // Fetch users and products
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .in('id', sellerIds)
        
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
        
        console.log('🔍 SupabaseDatabaseService: Fetched users:', users?.length || 0)
        console.log('🔍 SupabaseDatabaseService: Fetched products:', products?.length || 0)
        
        // Combine the data
        const enrichedData = data.map(listing => ({
          ...listing,
          seller: users?.find(user => user.id === listing.seller_id),
          product: products?.find(product => product.id === listing.product_id)
        }))
        
        console.log('🔍 SupabaseDatabaseService: Enriched listings:', enrichedData.length)
        return { data: enrichedData, error: null }
      }
      
      return { data: data || [], error }
    } catch (error) {
      console.error('❌ SupabaseDatabaseService: Exception fetching listings:', error)
      return { data: [], error }
    }
  }

  static async getListingById(id: string) {
    // Stub implementation
    return { data: null, error: null }
  }

  static async getOffers() {
    try {
      console.log('🔍 SupabaseDatabaseService: Fetching offers...')
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          users!offers_buyer_id_fkey (
            id,
            name,
            email,
            company,
            location,
            phone,
            is_verified,
            subscription_status,
            fica_status,
            rating,
            total_deals,
            total_transactions,
            reputation_score,
            business_type,
            created_at,
            updated_at
          ),
          listings!offers_listing_id_fkey (
            id,
            title,
            description,
            price,
            quantity,
            location
          )
        `)
        .order('created_at', { ascending: false })
      
      console.log('🔍 SupabaseDatabaseService: Fetched offers:', data?.length || 0)
      if (error) {
        console.error('❌ SupabaseDatabaseService: Error fetching offers:', error)
      }
      
      return { data: data || [], error }
    } catch (error) {
      console.error('❌ SupabaseDatabaseService: Exception fetching offers:', error)
      return { data: [], error }
    }
  }

  static async createOffer(offer: any) {
    // Stub implementation
    return { data: null, error: null }
  }

  static async updateOffer(id: string, updates: any) {
    // Stub implementation
    return { data: null, error: null }
  }

  static async deleteOffer(id: string) {
    // Stub implementation
    return { data: null, error: null }
  }
}

export class SupabaseAuthService {
  constructor() {
    // Stub implementation
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return user
    } catch (error) {
      return null
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { user: data.user, error }
    } catch (error) {
      return { user: null, error }
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async signUp(email: string, password: string, userData?: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      return { user: data.user, error }
    } catch (error) {
      return { user: null, error }
    }
  }

  static async resendVerificationEmail(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }
}

export class SupabaseStorageService {
  constructor() {
    // Stub implementation
  }
}
