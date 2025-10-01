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

  async getListings() {
    // Stub implementation
    return { data: [], error: null }
  }

  async getListingById(id: string) {
    // Stub implementation
    return { data: null, error: null }
  }

  async getOffers() {
    // Stub implementation
    return { data: [], error: null }
  }

  async createOffer(offer: any) {
    // Stub implementation
    return { data: null, error: null }
  }

  async updateOffer(id: string, updates: any) {
    // Stub implementation
    return { data: null, error: null }
  }

  async deleteOffer(id: string) {
    // Stub implementation
    return { data: null, error: null }
  }
}

export class SupabaseAuthService {
  constructor() {
    // Stub implementation
  }

  async getCurrentUser() {
    // Stub implementation - return null for now
    return null
  }

  async signIn(email: string, password: string) {
    // Stub implementation
    return { user: null, error: null }
  }

  async signOut() {
    // Stub implementation
    return { error: null }
  }

  async signUp(email: string, password: string) {
    // Stub implementation
    return { user: null, error: null }
  }
}

export class SupabaseStorageService {
  constructor() {
    // Stub implementation
  }
}
