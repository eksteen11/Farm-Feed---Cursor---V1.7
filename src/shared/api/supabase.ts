import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization singleton pattern
// This allows the client to be initialized when first accessed, not at module evaluation time
let supabaseClientInstance: SupabaseClient | null = null
let supabaseAdminClientInstance: SupabaseClient | null = null

function initializeSupabaseClient(): SupabaseClient {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:9',message:'initializeSupabaseClient called',data:{urlExists:!!process.env.NEXT_PUBLIC_SUPABASE_URL,anonExists:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (supabaseClientInstance) {
    return supabaseClientInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    const errorMessage = `
❌ Missing Supabase environment variables!

Required environment variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

To fix this:
1. Ensure .env.local file exists in the project root
2. Add your Supabase credentials:
   
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

3. Get your credentials from: https://supabase.com/dashboard → Your Project → Settings → API
4. Restart your dev server: npm run dev

See SUPABASE_SETUP_GUIDE.md for detailed instructions.
    `.trim()
    
    console.error(errorMessage)
    throw new Error('Supabase environment variables are required. See console for setup instructions.')
  }

  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:42',message:'Creating Supabase client',data:{urlLength:url.length,anonLength:anon.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  supabaseClientInstance = createClient(url, anon)
  return supabaseClientInstance
}

function initializeSupabaseAdminClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    return null // Admin client only available server-side
  }

  if (supabaseAdminClientInstance) {
    return supabaseAdminClientInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

  if (!url) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not available for admin client')
    return null
  }

  supabaseAdminClientInstance = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabaseAdminClientInstance
}

// Create a proxy object that lazily initializes the client on first property access
// This maintains backward compatibility while allowing lazy initialization
const createLazySupabaseClient = (): SupabaseClient => {
  return new Proxy({} as SupabaseClient, {
    get(target, prop) {
      const client = initializeSupabaseClient()
      const value = (client as any)[prop]
      // If it's a function, bind it to the client to maintain 'this' context
      if (typeof value === 'function') {
        return value.bind(client)
      }
      return value
    }
  }) as SupabaseClient
}

// Export the lazy client
export const supabase = createLazySupabaseClient()

// Admin client is initialized immediately (only used server-side)
export const supabaseAdmin = initializeSupabaseAdminClient()

// Export service classes for backward compatibility
export class SupabaseDatabaseService {
  constructor() {
    // Stub implementation
  }

  static async getListings() {
    try {
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
      
      if (error) {
        console.error('Error fetching listings:', error)
        return { data: [], error }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:142',message:'Supabase listings response',data:{hasError:!!error,errorMessage:error?.message,errorCode:(error as any)?.code,count:data?.length ?? 0},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{})
      // #endregion
      
      if (!data || data.length === 0) {
        return { data: [], error: null }
      }
      
      // #region agent log
      const missingSellers = data.filter((listing: any) => !listing?.users).length
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:148',message:'Listings fetched from Supabase',data:{count:data.length,missingSellers},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{})
      // #endregion
      
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
      
      // #region agent log
      const firstListing = transformedData[0]
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:208',message:'Transformed listings sample',data:{hasSeller:!!firstListing?.seller,productKeys:Object.keys(firstListing?.product || {})},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{})
      // #endregion
      
      return { data: transformedData, error: null }
      
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:226',message:'getListings threw',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H5'})}).catch(()=>{})
      // #endregion
      console.error('Error in getListings:', error)
      return { data: [], error }
    }
  }

  static async getListingById(id: string) {
    try {
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

      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:248',message:'Supabase listing by id response',data:{id,hasError:!!error,errorMessage:error?.message,errorCode:(error as any)?.code,hasData:!!data},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{})
      // #endregion
      
      if (error) {
        console.error('Error fetching listing by ID:', error)
        return { data: null, error }
      }
      
      if (!data) {
        return { data: null, error: null }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:263',message:'Listing by ID raw data',data:{id:data.id,hasUser:!!data.users},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{})
      // #endregion
      
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
      
      return { data: transformedData, error: null }
      
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:328',message:'getListingById threw',data:{id,error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H5'})}).catch(()=>{})
      // #endregion
      console.error('Error in getListingById:', error)
      return { data: null, error }
    }
  }

  static async getOffers() {
    try {
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
      
      if (error) {
        console.error('Error fetching offers:', error)
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
      console.error('Error fetching offers:', error)
      return { data: [], error }
    }
  }

  static async createOffer(offer: any) {
    try {
      console.log('🔍 createOffer called with:', offer)
      // Use snake_case to match incoming data from MakeOfferModal
      const { data, error } = await supabase
        .from('offers')
        .insert({
          listing_id: offer.listing_id,
          buyer_id: offer.buyer_id,
          seller_id: offer.seller_id,
          price: offer.price,
          quantity: offer.quantity,
          message: offer.message,
          delivery_type: offer.delivery_type,
          delivery_address: offer.delivery_address,
          terms: offer.terms || 'Standard terms apply',
          status: offer.status || 'pending',
          expires_at: offer.expires_at,
          is_negotiable: offer.is_negotiable !== false
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating offer:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        throw error
      }
      
      console.log('✅ Offer created successfully in database:', data)
      return data
    } catch (error) {
      console.error('Error in createOffer:', error)
      throw error
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
        return null
      }
      
      // Get full user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()
      
      if (profileError) {
        console.error('Profile lookup error:', profileError.message)
        return null
      }
      
      if (!profile) {
        return null
      }
      
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
      console.log('🔐 Signing up user:', email)
      console.log('📋 User data:', JSON.stringify(userData, null, 2))

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      })

      if (error) {
        console.error('❌ Supabase signup error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        return { 
          user: data?.user || null, 
          error: {
            message: error.message || 'Signup failed',
            status: error.status,
            code: error.name
          }
        }
      }

      // Check if user was created (even if email confirmation is required)
      if (data?.user) {
        console.log('✅ Supabase auth user created:', data.user.id)
        console.log('📧 Email confirmed:', !!data.user.email_confirmed_at)
        console.log('📧 Email:', data.user.email)
      } else {
        console.log('⚠️ No user returned (may need email confirmation)')
      }
      
      // Success - Supabase auth signup succeeded
      // Note: Database trigger may still fail, but auth user is created
      return { 
        user: data?.user || null, 
        error: null 
      }
    } catch (error: any) {
      console.error('❌ Signup exception:', error)
      console.error('Exception details:', JSON.stringify(error, null, 2))
      return { 
        user: null, 
        error: {
          message: error?.message || error?.toString() || 'Signup failed',
          code: error?.code || 'UNKNOWN'
        }
      }
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
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)
        
        if (error) {
          console.error('Image upload error:', error)
          throw error
        }
        
        const { data: publicUrl } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)
        
        return publicUrl.publicUrl
      })
      
      const urls = await Promise.all(uploadPromises)
      return urls
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  static async uploadVideos(files: File[], bucket: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)
        
        if (error) {
          console.error('Video upload error:', error)
          throw error
        }
        
        const { data: publicUrl } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)
        
        return publicUrl.publicUrl
      })
      
      const urls = await Promise.all(uploadPromises)
      return urls
    } catch (error) {
      console.error('Video upload failed:', error)
      throw error
    }
  }
}
