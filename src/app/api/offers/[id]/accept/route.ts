import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/api/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = params.id
    console.log('🔍 Accepting offer:', offerId)
    
    // Get the offer details first
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        listings!offers_listing_id_fkey (
          id,
          title,
          price,
          quantity,
          seller_id
        ),
        users!offers_buyer_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', offerId)
      .single()
    
    if (offerError || !offer) {
      console.error('❌ Error fetching offer:', offerError)
      return NextResponse.json({ 
        success: false, 
        error: 'Offer not found' 
      })
    }
    
    if (offer.status !== 'pending') {
      return NextResponse.json({ 
        success: false, 
        error: 'Offer is not pending' 
      })
    }
    
    // Update offer status to accepted
    const { error: updateError } = await supabase
      .from('offers')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)
    
    if (updateError) {
      console.error('❌ Error updating offer:', updateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to accept offer' 
      })
    }
    
    // Create a deal
    const platformFee = offer.quantity * 1 // R1 per ton
    const totalAmount = (offer.price * offer.quantity) + platformFee
    
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        offer_id: offerId,
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
      // Don't fail the offer acceptance if deal creation fails
      console.log('📋 Deal creation failed, but offer accepted:', {
        offer_id: offerId,
        listing_id: offer.listing_id,
        buyer_id: offer.buyer_id,
        seller_id: offer.listings.seller_id,
        final_price: offer.price,
        quantity: offer.quantity,
        platform_fee: platformFee,
        total_amount: totalAmount
      })
    } else {
      console.log('✅ Deal created successfully:', deal.id)
      
      // Update offer with deal_id
      await supabase
        .from('offers')
        .update({ deal_id: deal.id })
        .eq('id', offerId)
    }
    
    // TODO: Create notifications when notifications table is available
    console.log('📧 Notifications would be created here:', {
      buyer_id: offer.buyer_id,
      seller_id: offer.listings.seller_id,
      offer_id: offerId,
      deal_id: deal?.id || 'pending-deal-creation'
    })
    
    console.log('✅ Offer accepted successfully')
    
    return NextResponse.json({ 
      success: true, 
      data: {
        offer: { ...offer, status: 'accepted', deal_id: deal?.id },
        deal: deal || null
      }
    })
    
  } catch (error) {
    console.error('❌ Exception in accept offer:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
