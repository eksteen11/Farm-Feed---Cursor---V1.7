import { NextResponse } from 'next/server'
import { SupabaseDatabaseService } from '@/shared/api/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing offers API...')
    
    const { data: offers, error } = await SupabaseDatabaseService.getOffers()
    
    if (error) {
      console.error('❌ Error fetching offers:', error)
      return NextResponse.json({ success: false, error: error.message })
    }
    
    console.log('✅ Offers fetched:', offers?.length || 0)
    console.log('🔍 First offer:', offers?.[0])
    
    return NextResponse.json({ 
      success: true, 
      data: offers || [],
      count: offers?.length || 0
    })
  } catch (error) {
    console.error('❌ Exception in offers API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
