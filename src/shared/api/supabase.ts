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
      
      // Query with user join to get real seller data
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          users!listings_seller_id_fkey (
            id,
            name,
            email,
            role,
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
          )
        `)
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
        // Real seller data from database
        seller: listing.users ? {
          id: listing.users.id,
          name: listing.users.name,
          email: listing.users.email,
          isVerified: listing.users.is_verified || true,
          location: listing.users.location || listing.location,
          company: listing.users.company || 'Farm',
          phone: listing.users.phone || '+27123456789',
          rating: listing.users.rating || 4.5,
          totalDeals: listing.users.total_deals || 0,
          totalTransactions: listing.users.total_transactions || 0,
          reputationScore: listing.users.reputation_score || 85,
          businessType: listing.users.business_type || 'farm',
          subscriptionStatus: listing.users.subscription_status || 'basic',
          ficaStatus: listing.users.fica_status || 'pending'
        } : {
          id: listing.seller_id,
          name: 'Unknown Seller',
          email: 'unknown@farm.com',
          isVerified: false,
          location: listing.location,
          company: 'Farm',
          phone: '+27123456789',
          rating: 0,
          totalDeals: 0,
          totalTransactions: 0,
          reputationScore: 0,
          businessType: 'farm',
          subscriptionStatus: 'basic',
          ficaStatus: 'pending'
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
        .select(`
          *,
          users!listings_seller_id_fkey (
            id,
            name,
            email,
            role,
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
          )
        `)
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
        // Real seller data from database
        seller: data.users ? {
          id: data.users.id,
          name: data.users.name,
          email: data.users.email,
          isVerified: data.users.is_verified || true,
          location: data.users.location || data.location,
          company: data.users.company || 'Farm',
          phone: data.users.phone || '+27123456789',
          rating: data.users.rating || 4.5,
          totalDeals: data.users.total_deals || 0,
          totalTransactions: data.users.total_transactions || 0,
          reputationScore: data.users.reputation_score || 85,
          businessType: data.users.business_type || 'farm',
          subscriptionStatus: data.users.subscription_status || 'basic',
          ficaStatus: data.users.fica_status || 'pending'
        } : {
          id: data.seller_id,
          name: 'Unknown Seller',
          email: 'unknown@farm.com',
          isVerified: false,
          location: data.location,
          company: 'Farm',
          phone: '+27123456789',
          rating: 0,
          totalDeals: 0,
          totalTransactions: 0,
          reputationScore: 0,
          businessType: 'farm',
          subscriptionStatus: 'basic',
          ficaStatus: 'pending'
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
      
      // Transform the data to match frontend expectations
      const transformedData = (data || []).map(offer => ({
        ...offer,
        buyerId: offer.buyer_id, // Map buyer_id to buyerId
        listingId: offer.listing_id, // Map listing_id to listingId
        buyer: offer.users,
        listing: offer.listings,
        createdAt: new Date(offer.created_at),
        updatedAt: new Date(offer.updated_at),
        expiresAt: offer.expires_at ? new Date(offer.expires_at) : null
      }))
      
      return { data: transformedData, error }
    } catch (error) {
      console.error('❌ SupabaseDatabaseService: Exception fetching offers:', error)
      return { data: [], error }
    }
  }

  static async createOffer(offer: any) {
    try {
      console.log('🔍 SupabaseDatabaseService: Creating offer...', offer)
      
      // First, get the listing to find the seller_id
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('seller_id')
        .eq('id', offer.listingId)
        .single()
      
      if (listingError || !listing) {
        console.error('❌ SupabaseDatabaseService: Error fetching listing:', listingError)
        return { data: null, error: listingError }
      }
      
      // Now create the offer with seller_id included (for database triggers)
      const { data, error } = await supabase
        .from('offers')
        .insert({
          listing_id: offer.listingId,
          buyer_id: offer.buyerId,
          seller_id: listing.seller_id, // Include seller_id for triggers
          price: offer.price,
          quantity: offer.quantity,
          message: offer.message,
          delivery_type: offer.deliveryType,
          delivery_address: offer.deliveryAddress,
          terms: offer.terms || 'Standard terms apply',
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          is_negotiable: true
        })
        .select()
        .single()
      
      console.log('🔍 SupabaseDatabaseService: Created offer:', data?.id || 'No ID')
      if (error) {
        console.error('❌ SupabaseDatabaseService: Error creating offer:', error)
      }
      
      return { data, error }
    } catch (error) {
      console.error('❌ SupabaseDatabaseService: Exception creating offer:', error)
      return { data: null, error }
    }
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
      
      if (error || !user) {
        console.log('❌ No authenticated user found')
        return null
      }
      
      console.log('🔍 Getting user profile for:', user.email)
      
      // Get full user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()
      
      if (profileError) {
        console.log('❌ Profile lookup error:', profileError.message)
        return null
      }
      
      if (!profile) {
        console.log('❌ No profile found for user:', user.email)
        return null
      }
      
      console.log('✅ Found user profile:', profile.name)
      
      // Transform to match frontend User interface
      const transformedUser = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        roles: [profile.role],
        capabilities: profile.capabilities && profile.capabilities.length > 0 ? profile.capabilities : (profile.role === 'seller' ? ['sell', 'buy'] : profile.role === 'buyer' ? ['buy'] : profile.role === 'transporter' ? ['transport'] : ['buy']),
        company: profile.company || '',
        location: profile.location || '',
        phone: profile.phone || '',
        avatar: profile.avatar || '',
        isVerified: profile.is_verified || false,
        subscriptionStatus: profile.subscription_status || 'free',
        ficaStatus: profile.fica_status || 'pending',
        ficaDocuments: profile.fica_documents || {},
        rating: profile.rating || 0,
        totalDeals: profile.total_deals || 0,
        totalTransactions: profile.total_transactions || 0,
        reputationScore: profile.reputation_score || 0,
        businessType: profile.business_type || 'individual',
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at)
      }
      
      return transformedUser
    } catch (error) {
      console.error('❌ getCurrentUser error:', error)
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
