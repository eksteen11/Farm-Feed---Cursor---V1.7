import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log('📄 Generating contract...')
    
    const body = await request.json()
    const { dealId } = body
    
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
    
    // Get deal information
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single()
    
    if (dealError || !deal) {
      return NextResponse.json({ 
        success: false, 
        error: 'Deal not found' 
      })
    }
    
    // Get related data separately
    const { data: offer } = await supabaseAdmin
      .from('offers')
      .select('*')
      .eq('id', deal.offer_id)
      .single()
    
    const { data: listing } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('id', deal.listing_id)
      .single()
    
    const { data: buyer } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', deal.buyer_id)
      .single()
    
    const { data: seller } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', deal.seller_id)
      .single()
    
    // Generate contract content
    const contractData = {
      dealId: deal.id,
      contractNumber: `FF-${deal.id.slice(0, 8).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      parties: {
        buyer: {
          name: buyer?.name || 'Unknown Buyer',
          email: buyer?.email || 'Unknown Email',
          company: buyer?.company || 'Unknown Company',
          phone: buyer?.phone || 'Unknown Phone'
        },
        seller: {
          name: seller?.name || 'Unknown Seller',
          email: seller?.email || 'Unknown Email',
          company: seller?.company || 'Unknown Company',
          phone: seller?.phone || 'Unknown Phone'
        }
      },
      product: {
        title: listing?.title || 'Unknown Product',
        description: listing?.description || 'No description available',
        quantity: deal.quantity,
        unitPrice: deal.final_price,
        totalValue: deal.final_price * deal.quantity
      },
      delivery: {
        type: deal.delivery_type,
        address: deal.delivery_address,
        date: deal.delivery_date
      },
      financial: {
        productValue: deal.final_price * deal.quantity,
        platformFee: deal.platform_fee,
        transportFee: deal.transport_fee || 0,
        totalAmount: deal.total_amount
      },
      terms: deal.terms,
      status: 'facilitated'
    }
    
    // Update deal status to facilitated
    const { error: updateError } = await supabaseAdmin
      .from('deals')
      .update({ status: 'facilitated' })
      .eq('id', dealId)
    
    if (updateError) {
      console.error('❌ Error updating deal status:', updateError)
    }
    
    console.log('✅ Contract generated successfully for deal:', dealId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contract generated successfully!',
      data: {
        contract: contractData,
        deal: { ...deal, status: 'facilitated' }
      }
    })
    
  } catch (error) {
    console.error('❌ Exception in contract generation:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate contract' 
    })
  }
}
