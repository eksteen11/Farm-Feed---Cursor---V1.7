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
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          users!listings_seller_id_fkey (
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
          products!listings_product_id_fkey (
            id,
            name,
            category,
            subcategory,
            description,
            specifications,
            unit,
            min_quantity,
            max_quantity
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      console.log('🔍 SupabaseDatabaseService: Fetched listings:', data?.length || 0)
      if (error) {
        console.error('❌ SupabaseDatabaseService: Error fetching listings:', error)
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
