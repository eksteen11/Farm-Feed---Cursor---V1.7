import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log('🚛 Creating transport request...')
    
    const body = await request.json()
    const { dealId, requesterId, originAddress, destinationAddress, pickupDate, deliveryDate } = body
    
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
    
    // Get deal details
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .select(`
        *,
        offers!deals_offer_id_fkey (
          quantity,
          delivery_type
        ),
        listings!deals_listing_id_fkey (
          title,
          description
        )
      `)
      .eq('id', dealId)
      .single()
    
    if (dealError || !deal) {
      return NextResponse.json({ 
        success: false, 
        error: 'Deal not found' 
      })
    }
    
    // Create transport request
    const { data: transportRequest, error: requestError } = await supabaseAdmin
      .from('transport_requests')
      .insert({
        deal_id: dealId,
        requester_id: requesterId,
        origin_address: originAddress,
        destination_address: destinationAddress,
        product_details: {
          title: deal.listings.title,
          description: deal.listings.description,
          quantity: deal.quantity,
          delivery_type: deal.delivery_type
        },
        quantity: deal.quantity,
        pickup_date: pickupDate,
        delivery_date: deliveryDate,
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
    
    // Update deal status to transport-quoted
    const { error: updateError } = await supabaseAdmin
      .from('deals')
      .update({ status: 'transport-quoted' })
      .eq('id', dealId)
    
    if (updateError) {
      console.error('❌ Error updating deal status:', updateError)
      // Don't fail the whole operation
    }
    
    console.log('✅ Transport request created successfully:', transportRequest.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Transport request created successfully!',
      data: {
        transportRequest,
        deal: { ...deal, status: 'transport-quoted' }
      }
    })
    
  } catch (error) {
    console.error('❌ Exception in transport request:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create transport request' 
    })
  }
}
