import { NextResponse } from 'next/server'
import { supabase } from '@/shared/api/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing users API...')
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, capabilities')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching users:', error)
      return NextResponse.json({ success: false, error: error.message })
    }
    
    console.log('✅ Users fetched:', users?.length || 0)
    
    return NextResponse.json({ 
      success: true, 
      data: users || [],
      count: users?.length || 0
    })
  } catch (error) {
    console.error('❌ Exception in users API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
