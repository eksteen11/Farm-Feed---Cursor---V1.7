import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log('🔄 Updating deal status...')
    
    const body = await request.json()
    const { dealId, status, transportFee } = body
    
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
    
    // Update deal status
    const updateData: any = { status }
    if (transportFee !== undefined) {
      updateData.transport_fee = transportFee
    }
    
    const { data: updatedDeal, error: updateError } = await supabaseAdmin
      .from('deals')
      .update(updateData)
      .eq('id', dealId)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ Error updating deal:', updateError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to update deal: ${updateError.message}` 
      })
    }
    
    console.log('✅ Deal updated successfully:', updatedDeal.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Deal status updated successfully!',
      data: updatedDeal
    })
    
  } catch (error) {
    console.error('❌ Exception in update deal status:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update deal status' 
    })
  }
}
