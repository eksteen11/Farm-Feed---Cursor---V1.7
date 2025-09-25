import { supabase } from './supabase'
import { User, Listing, Offer, Message, Notification, Product } from '../types'

// Auth Service
export class SupabaseAuthService {
  // Sign up new user
  static async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      console.log('🔐 Attempting to sign up user:', { email, name: userData.name })
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            company: userData.company,
            role: userData.role,
            roles: userData.roles,
            capabilities: userData.capabilities
          }
        }
      })

      if (authError) {
        console.error('❌ Auth error:', authError)
        throw authError
      }

      console.log('✅ Auth signup successful:', authData)

      if (authData.user) {
        console.log('👤 Creating user profile in database...')
        
        // Wait a moment for the auth session to be established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            roles: userData.roles,
            capabilities: userData.capabilities,
            company: userData.company,
            location: userData.location || '',
            phone: userData.phone,
            avatar: userData.avatar,
            is_verified: userData.isVerified || false,
            subscription_status: userData.subscriptionStatus || 'free',
            subscription_expiry: userData.subscriptionExpiry,
            fica_status: userData.ficaStatus || 'pending',
            fica_documents: userData.ficaDocuments || {},
            fica_verified_at: userData.ficaVerifiedAt,
            rating: userData.rating || 0,
            total_deals: userData.totalDeals || 0,
            total_transactions: userData.totalTransactions || 0,
            reputation_score: userData.reputationScore || 0,
            business_type: userData.businessType || 'individual',
            tax_number: userData.taxNumber,
            vat_number: userData.vatNumber,
            bank_details: userData.bankDetails || {}
          }])

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          // Don't throw the error, just log it - the user is still created in auth
          console.log('⚠️ User created in auth but profile creation failed')
        } else {
          console.log('✅ User profile created successfully')
        }
      }

      return { success: true, user: authData.user }
    } catch (error: any) {
      console.error('❌ Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting to sign in user:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Auth sign in error:', error)
        throw error
      }

      console.log('✅ Auth sign in successful:', data.user?.id)

      if (data.user) {
        // Try to get user profile from our users table
        console.log('👤 Fetching user profile...')
        
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle() // Use maybeSingle instead of single to handle no results gracefully

        if (profileError) {
          console.error('❌ Profile fetch error:', profileError)
          // If profile doesn't exist, create a basic one from auth data
          console.log('⚠️ Creating profile from auth data')
          
          const basicProfile = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            role: data.user.user_metadata?.role || 'buyer',
            roles: data.user.user_metadata?.roles || ['buyer'],
            capabilities: data.user.user_metadata?.capabilities || ['buy'],
            company: data.user.user_metadata?.company || '',
            location: '',
            phone: '',
            avatar: data.user.user_metadata?.avatar || '',
            isVerified: data.user.email_confirmed_at ? true : false,
            subscriptionStatus: 'free' as const,
            subscriptionExpiry: null,
            ficaStatus: 'pending' as const,
            ficaDocuments: {},
            ficaVerifiedAt: null,
            rating: 0,
            totalDeals: 0,
            totalTransactions: 0,
            reputationScore: 0,
            businessType: 'individual' as const,
            taxNumber: '',
            vatNumber: '',
            bankDetails: {},
            createdAt: new Date(data.user.created_at),
            updatedAt: new Date()
          }
          
          return { success: true, user: basicProfile }
        }

        if (!profile) {
          console.log('⚠️ No profile found, creating basic profile')
          
          // Create a basic profile if none exists
          const basicProfile = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            role: data.user.user_metadata?.role || 'buyer',
            roles: data.user.user_metadata?.roles || ['buyer'],
            capabilities: data.user.user_metadata?.capabilities || ['buy'],
            company: data.user.user_metadata?.company || '',
            location: '',
            phone: '',
            avatar: data.user.user_metadata?.avatar || '',
            isVerified: data.user.email_confirmed_at ? true : false,
            subscriptionStatus: 'free' as const,
            subscriptionExpiry: null,
            ficaStatus: 'pending' as const,
            ficaDocuments: {},
            ficaVerifiedAt: null,
            rating: 0,
            totalDeals: 0,
            totalTransactions: 0,
            reputationScore: 0,
            businessType: 'individual' as const,
            taxNumber: '',
            vatNumber: '',
            bankDetails: {},
            createdAt: new Date(data.user.created_at),
            updatedAt: new Date()
          }
          
          return { success: true, user: basicProfile }
        }

        console.log('✅ Profile found:', profile.name)
        return { success: true, user: profile }
      }

      return { success: false, error: 'No user data returned' }
    } catch (error: any) {
      console.error('❌ Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        return profile
      }
      
      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Resend verification email
  static async resendVerificationEmail(email: string) {
    try {
      console.log('📧 Resending verification email to:', email)
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('❌ Error resending verification email:', error)
        throw error
      }

      console.log('✅ Verification email sent successfully')
      return { success: true }
    } catch (error: any) {
      console.error('❌ Resend verification error:', error)
      return { success: false, error: error.message }
    }
  }
}

// Database Service
export class SupabaseDatabaseService {
  // Users
  static async getUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  // Listings
  static async getListings() {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        users:seller_id(name, company, location),
        products:product_id(name, category, description, unit)
      `)
    if (error) throw error
    return data
  }

  static async getListingById(id: string) {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        users:seller_id(name, company, location),
        products:product_id(name, category, description, unit)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createListing(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async updateListing(id: string, updates: Partial<Listing>) {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async deleteListing(id: string) {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }

  // Offers
  static async getOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        listings:listing_id(title, total_price),
        users:buyer_id(name, company)
      `)
    if (error) throw error
    return data
  }

  static async getOfferById(id: string) {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        listings:listing_id(title, total_price),
        users:buyer_id(name, company)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createOffer(offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('offers')
      .insert([offer])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async updateOffer(id: string, updates: Partial<Offer>) {
    const { data, error } = await supabase
      .from('offers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async deleteOffer(id: string) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }

  // Messages
  static async getMessages(offerId?: string) {
    let query = supabase
      .from('messages')
      .select(`
        *,
        users:sender_id(name, company)
      `)
      .order('created_at', { ascending: true })

    if (offerId) {
      query = query.eq('offer_id', offerId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async createMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async updateMessage(id: string, updates: Partial<Message>) {
    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  // Notifications
  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async updateNotification(id: string, updates: Partial<Notification>) {
    const { data, error } = await supabase
      .from('notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }

  // Products
  static async getProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    return data
  }

  static async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
}

// Storage Service for Images and Videos
export class SupabaseStorageService {
  // Upload image to Supabase Storage
  static async uploadImage(file: File, folder: string = 'listings'): Promise<string> {
    try {
      console.log('📤 Uploading image:', file.name)
      
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('farm-feed-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('❌ Upload error:', error)
        throw error
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('farm-feed-media')
        .getPublicUrl(filePath)
      
      console.log('✅ Image uploaded successfully:', publicUrl)
      return publicUrl
    } catch (error: any) {
      console.error('❌ Image upload error:', error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }
  
  // Upload multiple images
  static async uploadImages(files: File[], folder: string = 'listings'): Promise<string[]> {
    try {
      console.log('📤 Uploading multiple images:', files.length)
      
      const uploadPromises = files.map(file => this.uploadImage(file, folder))
      const urls = await Promise.all(uploadPromises)
      
      console.log('✅ All images uploaded successfully')
      return urls
    } catch (error: any) {
      console.error('❌ Multiple image upload error:', error)
      throw new Error(`Failed to upload images: ${error.message}`)
    }
  }
  
  // Upload video to Supabase Storage
  static async uploadVideo(file: File, folder: string = 'listings'): Promise<string> {
    try {
      console.log('📤 Uploading video:', file.name)
      
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('farm-feed-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('❌ Upload error:', error)
        throw error
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('farm-feed-media')
        .getPublicUrl(filePath)
      
      console.log('✅ Video uploaded successfully:', publicUrl)
      return publicUrl
    } catch (error: any) {
      console.error('❌ Video upload error:', error)
      throw new Error(`Failed to upload video: ${error.message}`)
    }
  }
  
  // Upload multiple videos
  static async uploadVideos(files: File[], folder: string = 'listings'): Promise<string[]> {
    try {
      console.log('📤 Uploading multiple videos:', files.length)
      
      const uploadPromises = files.map(file => this.uploadVideo(file, folder))
      const urls = await Promise.all(uploadPromises)
      
      console.log('✅ All videos uploaded successfully')
      return urls
    } catch (error: any) {
      console.error('❌ Multiple video upload error:', error)
      throw new Error(`Failed to upload videos: ${error.message}`)
    }
  }
  
  // Delete file from storage
  static async deleteFile(filePath: string): Promise<void> {
    try {
      console.log('🗑️ Deleting file:', filePath)
      
      const { error } = await supabase.storage
        .from('farm-feed-media')
        .remove([filePath])
      
      if (error) {
        console.error('❌ Delete error:', error)
        throw error
      }
      
      console.log('✅ File deleted successfully')
    } catch (error: any) {
      console.error('❌ File delete error:', error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }
  
  // Get file URL from path
  static getFileUrl(filePath: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('farm-feed-media')
      .getPublicUrl(filePath)
    return publicUrl
  }
}

// Real-time subscriptions
export class SupabaseRealtimeService {
  // Subscribe to offer messages
  static subscribeToOfferMessages(offerId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`offer-messages-${offerId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `offer_id=eq.${offerId}`
      }, (payload) => {
        callback(payload.new as Message)
      })
      .subscribe()
  }

  // Subscribe to user notifications
  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        callback(payload.new as Notification)
      })
      .subscribe()
  }

  // Subscribe to offer updates
  static subscribeToOfferUpdates(offerId: string, callback: (offer: Offer) => void) {
    return supabase
      .channel(`offer-updates-${offerId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'offers',
        filter: `id=eq.${offerId}`
      }, (payload) => {
        callback(payload.new as Offer)
      })
      .subscribe()
  }
}