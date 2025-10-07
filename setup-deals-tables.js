const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDealsDatabase() {
  try {
    console.log('🔧 Setting up deals database tables...')
    
    // Create deals table
    const { error: dealsError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.deals (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            offer_id uuid REFERENCES public.offers(id) ON DELETE CASCADE,
            listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
            buyer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
            seller_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
            transporter_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
            final_price numeric NOT NULL,
            quantity numeric NOT NULL,
            delivery_type text CHECK (delivery_type IN ('ex-farm', 'delivered')) NOT NULL,
            delivery_address text,
            status text DEFAULT 'connected' CHECK (status IN ('connected', 'transport-quoted', 'transport-selected', 'facilitated', 'completed', 'cancelled')),
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now(),
            delivery_date timestamp with time zone,
            payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')),
            platform_fee numeric NOT NULL,
            transport_fee numeric,
            total_amount numeric NOT NULL,
            terms text,
            special_conditions text
        );
      `
    })
    
    if (dealsError) {
      console.error('❌ Error creating deals table:', dealsError)
      return
    }
    
    console.log('✅ Deals table created successfully!')
    
    // Test the table
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error testing deals table:', error)
    } else {
      console.log('✅ Deals table is working!')
    }
    
  } catch (error) {
    console.error('❌ Exception in setup:', error)
  }
}

setupDealsDatabase()
