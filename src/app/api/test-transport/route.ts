import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('🧪 Testing transport system...')
    
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
    
    // Get the deal we created earlier
    const { data: deals, error: dealsError } = await supabaseAdmin
      .from('deals')
      .select('*')
      .limit(1)
    
    if (dealsError || !deals || deals.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No deals found to test transport with' 
      })
    }
    
    const deal = deals[0]
    console.log('🔍 Found deal for transport test:', deal.id)
    
    // Create a transport request
    const { data: transportRequest, error: requestError } = await supabaseAdmin
      .from('transport_requests')
      .insert({
        deal_id: deal.id,
        requester_id: deal.buyer_id, // Buyer requesting transport
        origin_address: 'Harrismith, Free State',
        destination_address: deal.delivery_address || '123 Test Street, Cape Town',
        product_details: {
          title: 'Lucerne',
          description: 'Prime quality lucerne bales',
          quantity: deal.quantity,
          delivery_type: deal.delivery_type
        },
        quantity: deal.quantity,
        pickup_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        status: 'pending'
      })
      .select()
      .single()
    
    if (requestError) {
      console.error('❌ Error creating transport request:', requestError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create transport request: ${requestError.message}` 
      })
    }
    
    console.log('✅ Transport request created:', transportRequest.id)
    
    // Create a transport quote
    const { data: transportQuote, error: quoteError } = await supabaseAdmin
      .from('transport_quotes')
      .insert({
        request_id: transportRequest.id,
        transporter_id: deal.seller_id, // Using seller as transporter for test
        price: 300, // R300 transport fee as per business model
        currency: 'ZAR',
        estimated_delivery_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
        terms: 'Transport includes loading and offloading. Payment on delivery.',
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
    
    console.log('✅ Transport quote created:', transportQuote.id)
    
    // Update deal status
    const { error: updateError } = await supabaseAdmin
      .from('deals')
      .update({ 
        status: 'transport-quoted',
        transport_fee: 300
      })
      .eq('id', deal.id)
    
    if (updateError) {
      console.error('❌ Error updating deal:', updateError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Transport system test completed successfully!',
      data: {
        deal: { ...deal, status: 'transport-quoted', transport_fee: 300 },
        transportRequest,
        transportQuote
      }
    })
    
  } catch (error) {
    console.error('❌ Exception in transport test:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test transport system' 
    })
  }
}
