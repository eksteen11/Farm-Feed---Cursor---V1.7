import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('🧪 Testing deal creation...')
    
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
    
    // Get an accepted offer that doesn't have a deal_id yet
    const { data: acceptedOffers, error: offersError } = await supabaseAdmin
      .from('offers')
      .select(`
        *,
        listings!offers_listing_id_fkey (
          id,
          title,
          seller_id
        )
      `)
      .eq('status', 'accepted')
      .is('deal_id', null)
      .limit(1)
    
    if (offersError) {
      console.error('❌ Error fetching accepted offers:', offersError)
      return NextResponse.json({ 
        success: false, 
        error: offersError.message 
      })
    }
    
    if (!acceptedOffers || acceptedOffers.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No accepted offers without deals found' 
      })
    }
    
    const offer = acceptedOffers[0]
    console.log('🔍 Found accepted offer:', offer.id)
    
    // Create a deal for this offer
    const platformFee = offer.quantity * 1 // R1 per ton
    const totalAmount = (offer.price * offer.quantity) + platformFee
    
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .insert({
        offer_id: offer.id,
        listing_id: offer.listing_id,
        buyer_id: offer.buyer_id,
        seller_id: offer.listings.seller_id,
        final_price: offer.price,
        quantity: offer.quantity,
        delivery_type: offer.delivery_type || 'ex-farm',
        delivery_address: offer.delivery_address,
        status: 'connected',
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        payment_status: 'pending',
        platform_fee: platformFee,
        total_amount: totalAmount,
        terms: offer.terms || 'Standard terms apply'
      })
      .select()
      .single()
    
    if (dealError) {
      console.error('❌ Error creating deal:', dealError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create deal: ${dealError.message}` 
      })
    }
    
    console.log('✅ Deal created successfully:', deal.id)
    
    // Update the offer with the deal_id
    const { error: updateError } = await supabaseAdmin
      .from('offers')
      .update({ deal_id: deal.id })
      .eq('id', offer.id)
    
    if (updateError) {
      console.error('❌ Error updating offer with deal_id:', updateError)
      // Don't fail the whole operation, just log it
    } else {
      console.log('✅ Offer updated with deal_id')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Deal created successfully!',
      data: {
        deal,
        offer: { ...offer, deal_id: deal.id }
      }
    })
    
  } catch (error) {
    console.error('❌ Exception in test-deal-creation:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test deal creation' 
    })
  }
}
