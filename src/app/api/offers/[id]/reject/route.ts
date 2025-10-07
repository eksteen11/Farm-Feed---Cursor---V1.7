import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/api/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = params.id
    const body = await request.json()
    const { reason } = body
    
    console.log('🔍 Rejecting offer:', offerId)
    
    // Get the offer details first
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        listings!offers_listing_id_fkey (
          id,
          title,
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
    
    // Update offer status to rejected
    const { error: updateError } = await supabase
      .from('offers')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)
    
    if (updateError) {
      console.error('❌ Error updating offer:', updateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to reject offer' 
      })
    }
    
    // TODO: Create notifications when notifications table is available
    console.log('📧 Notifications would be created here:', {
      buyer_id: offer.buyer_id,
      seller_id: offer.listings.seller_id,
      offer_id: offerId,
      reason: reason || 'No reason provided'
    })
    
    console.log('✅ Offer rejected successfully')
    
    return NextResponse.json({ 
      success: true, 
      data: {
        offer: { ...offer, status: 'rejected' }
      }
    })
    
  } catch (error) {
    console.error('❌ Exception in reject offer:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
