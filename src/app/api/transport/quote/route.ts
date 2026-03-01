import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log('💰 Creating transport quote...')
    
    const body = await request.json()
    const { requestId, transporterId, price, estimatedDeliveryDate, terms } = body
    
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
    
    // Create transport quote
    const { data: transportQuote, error: quoteError } = await supabaseAdmin
      .from('transport_quotes')
      .insert({
        request_id: requestId,
        transporter_id: transporterId,
        price: price,
        currency: 'ZAR',
        estimated_delivery_date: estimatedDeliveryDate,
        terms: terms || 'Standard transport terms apply',
        status: 'pending'
      })
      .select()
      .single()
    
    if (quoteError) {
      console.error('❌ Error creating transport quote:', quoteError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create transport quote: ${quoteError.message}` 
      })
    }
    
    console.log('✅ Transport quote created successfully:', transportQuote.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Transport quote created successfully!',
      data: transportQuote
    })
    
  } catch (error) {
    console.error('❌ Exception in transport quote:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create transport quote' 
    })
  }
}
