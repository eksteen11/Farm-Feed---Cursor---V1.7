import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/api/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .limit(5)
    
    console.log('🔍 API: Supabase query result:', { 
      dataCount: data?.length || 0, 
      error: error?.message || null 
    })
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: data,
      count: data?.length || 0
    })
    
  } catch (error) {
    console.error('❌ API: Error testing Supabase:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error 
    }, { status: 500 })
  }
}
