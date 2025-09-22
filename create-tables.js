#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test connection by trying to query a non-existent table
    const { error } = await supabase.from('users').select('*').limit(1)
    
    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('✅ Connection successful! Users table does not exist yet.')
        return true
      } else {
        console.error('❌ Connection failed:', error.message)
        return false
      }
    } else {
      console.log('✅ Connection successful! Users table already exists.')
      return true
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

async function createTables() {
  console.log('📋 Creating tables...')
  
  // Since we can't execute raw SQL, we'll provide instructions
  console.log(`
📝 MANUAL SETUP REQUIRED:

Since Supabase doesn't allow direct SQL execution via the client,
please follow these steps:

1. Go to your Supabase dashboard: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}

2. Navigate to the SQL Editor

3. Copy and paste the following SQL commands:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'transporter')),
    capabilities TEXT[] DEFAULT '{}',
    company TEXT,
    location TEXT,
    phone TEXT,
    avatar TEXT,
    is_verified BOOLEAN DEFAULT false,
    subscription_status TEXT DEFAULT 'free',
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    fica_status TEXT DEFAULT 'pending',
    fica_documents JSONB DEFAULT '{}',
    fica_verified_at TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_deals INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0,
    business_type TEXT DEFAULT 'individual',
    tax_number TEXT,
    vat_number TEXT,
    bank_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    location TEXT NOT NULL,
    delivery_options JSONB DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    message TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    is_read BOOLEAN DEFAULT false,
    action_required BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, category, description, unit) VALUES
('Yellow Maize', 'grain', 'High quality yellow maize for feed and food', 'tons'),
('White Maize', 'grain', 'Premium white maize', 'tons'),
('Sunflower Seeds', 'grain', 'Oil sunflower seeds', 'tons'),
('Soybean Meal', 'feed', 'High protein soybean meal', 'tons'),
('Wheat Bran', 'feed', 'Nutritious wheat bran', 'tons');

4. Run the SQL commands

5. Then run this script again to verify the setup
`)
}

async function verifyTables() {
  console.log('🔍 Verifying table creation...')
  
  const tables = ['users', 'products', 'listings', 'offers', 'messages', 'notifications']
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`✅ Table ${table}: Created successfully`)
      }
    } catch (error) {
      console.log(`❌ Table ${table}: ${error.message}`)
    }
  }
}

async function main() {
  console.log('🚀 Supabase Database Setup')
  console.log('========================')
  
  const connected = await testConnection()
  
  if (connected) {
    await createTables()
    console.log('\n⏳ Please create the tables manually as shown above, then run:')
    console.log('node create-tables.js verify')
  }
  
  // Check if we should verify
  if (process.argv[2] === 'verify') {
    await verifyTables()
  }
}

main().catch(console.error)
