import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('🧪 Testing contract generation...')
    
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
    
    // Get the deal we've been working with
    const { data: deals, error: dealsError } = await supabaseAdmin
      .from('deals')
      .select('*')
      .limit(1)
    
    if (dealsError || !deals || deals.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No deals found to test contract generation with' 
      })
    }
    
    const deal = deals[0]
    console.log('🔍 Found deal for contract test:', deal.id)
    
    // Generate contract
    const contractResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/contracts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dealId: deal.id })
    })
    
    const contractResult = await contractResponse.json()
    
    if (!contractResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: `Contract generation failed: ${contractResult.error}` 
      })
    }
    
    console.log('✅ Contract generated successfully!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contract generation test completed successfully!',
      data: contractResult.data
    })
    
  } catch (error) {
    console.error('❌ Exception in contract test:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test contract generation' 
    })
  }
}
