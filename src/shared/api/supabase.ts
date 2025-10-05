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
      console.log('🔍 SupabaseDatabaseService: Supabase client:', supabase)
      
      // Simple query first
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      console.log('🔍 SupabaseDatabaseService: Query result:', { data: data?.length || 0, error })
      
      if (error) {
        console.error('❌ SupabaseDatabaseService: Error:', error)
        return { data: [], error }
      }
      
      if (!data || data.length === 0) {
        console.log('⚠️ SupabaseDatabaseService: No listings found')
        return { data: [], error: null }
      }
      
      console.log('✅ SupabaseDatabaseService: Found', data.length, 'listings')
      
      // Transform data to match frontend expectations
      const transformedData = data.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        quantity: listing.quantity,
        location: listing.location,
        images: listing.images || [],
        videos: listing.videos || [],
        isActive: listing.is_active,
        qualityGrade: listing.quality_grade,
        specifications: listing.specifications || {},
        deliveryOptions: listing.delivery_options || {},
        paymentTerms: listing.payment_terms,
        certificates: listing.certificates || [],
        labResults: listing.lab_results || [],
        createdAt: new Date(listing.created_at),
        updatedAt: new Date(listing.updated_at),
        expiresAt: listing.expires_at ? new Date(listing.expires_at) : null,
        // Mock seller and product data for now
        seller: {
          id: listing.seller_id,
          name: 'Demo Seller',
          email: 'seller@demo.com',
          isVerified: true,
          location: listing.location,
          company: 'Demo Farm',
          phone: '+27123456789',
          rating: 4.5,
          totalDeals: 10,
          totalTransactions: 50,
          reputationScore: 85,
          businessType: 'farm',
          subscriptionStatus: 'premium',
          ficaStatus: 'verified'
        },
        product: {
          id: listing.product_id,
          name: listing.title,
          category: 'grain',
          subcategory: 'feed',
          description: listing.description,
          specifications: listing.specifications || {},
          unit: 'ton',
          minQuantity: 1,
          maxQuantity: listing.quantity
        }
      }))
      
      console.log('✅ SupabaseDatabaseService: Transformed', transformedData.length, 'listings')
      return { data: transformedData, error: null }
      
    } catch (error) {
      console.error('❌ SupabaseDatabaseService: Exception:', error)
      return { data: [], error }
    }
  }

  static async getListingById(id: string) {
    try {
      console.log('🔍 SupabaseDatabaseService: Fetching listing by ID:', id)
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()
      
      console.log('🔍 SupabaseDatabaseService: Query result:', { data: !!data, error })
      
      if (error) {
        console.error('❌ SupabaseDatabaseService: Error:', error)
        return { data: null, error }
      }
      
      if (!data) {
        console.log('⚠️ SupabaseDatabaseService: Listing not found')
        return { data: null, error: null }
      }
      
      // Transform data to match frontend expectations
      const transformedData = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        location: data.location,
        images: data.images || [],
        videos: data.videos || [],
        isActive: data.is_active,
        qualityGrade: data.quality_grade,
        specifications: data.specifications || {},
        deliveryOptions: data.delivery_options || {},
        paymentTerms: data.payment_terms,
        certificates: data.certificates || [],
        labResults: data.lab_results || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        expiresAt: data.expires_at ? new Date(data.expires_at) : null,
        // Mock seller and product data for now
        seller: {
          id: data.seller_id,
          name: 'Demo Seller',
          email: 'seller@demo.com',
          isVerified: true,
          location: data.location,
          company: 'Demo Farm',
          phone: '+27123456789',
          rating: 4.5,
          totalDeals: 10,
          totalTransactions: 50,
          reputationScore: 85,
          businessType: 'farm',
          subscriptionStatus: 'premium',
          ficaStatus: 'verified'
        },
        product: {
          id: data.product_id,
          name: data.title,
          category: 'grain',
          subcategory: 'feed',
          description: data.description,
          specifications: data.specifications || {},
          unit: 'ton',
          minQuantity: 1,
          maxQuantity: data.quantity
        }
      }
      
      console.log('✅ SupabaseDatabaseService: Transformed listing')
      return { data: transformedData, error: null }
      
    } catch (error) {
      console.error('❌ SupabaseDatabaseService: Exception:', error)
      return { data: null, error }
    }
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

  static async uploadImages(files: File[], bucket: string): Promise<string[]> {
    try {
      console.log('📤 SupabaseStorageService: Uploading images...', files.length)
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)
        
        if (error) {
          console.error('❌ Upload error:', error)
          throw error
        }
        
        const { data: publicUrl } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)
        
        return publicUrl.publicUrl
      })
      
      const urls = await Promise.all(uploadPromises)
      console.log('✅ SupabaseStorageService: Images uploaded:', urls.length)
      return urls
    } catch (error) {
      console.error('❌ SupabaseStorageService: Upload failed:', error)
      throw error
    }
  }

  static async uploadVideos(files: File[], bucket: string): Promise<string[]> {
    try {
      console.log('📤 SupabaseStorageService: Uploading videos...', files.length)
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)
        
        if (error) {
          console.error('❌ Upload error:', error)
          throw error
        }
        
        const { data: publicUrl } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)
        
        return publicUrl.publicUrl
      })
      
      const urls = await Promise.all(uploadPromises)
      console.log('✅ SupabaseStorageService: Videos uploaded:', urls.length)
      return urls
    } catch (error) {
      console.error('❌ SupabaseStorageService: Upload failed:', error)
      throw error
    }
  }
}
