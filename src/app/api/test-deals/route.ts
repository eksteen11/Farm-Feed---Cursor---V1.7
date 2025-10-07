import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 API: Testing deals table...')
    
    // Use service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Supabase environment variables' 
      })
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    
    // Try to fetch from deals table
    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('*')
      .limit(10)
    
    if (error) {
      console.error('❌ API: Deals table error:', error.message)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        dataCount: 0
      })
    }
    
    console.log('✅ API: Deals table result:', { dataCount: data?.length || 0, error: null })
    
    return NextResponse.json({ 
      success: true, 
      data: data || [],
      count: data?.length || 0
    })
    
  } catch (error) {
    console.error('❌ API: Exception in test-deals:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test deals table',
      dataCount: 0
    })
  }
}
