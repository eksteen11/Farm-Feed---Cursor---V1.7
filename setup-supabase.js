#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file contains:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Starting Supabase database setup...')
  
  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Try direct execution for some statements
          const { error: directError } = await supabase
            .from('_migrations')
            .select('*')
            .limit(0)
          
          if (directError && !directError.message.includes('relation "_migrations" does not exist')) {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message)
            console.error('Statement:', statement.substring(0, 100) + '...')
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      }
    }
    
    console.log('✅ Database setup completed successfully!')
    
    // Test the setup by checking if tables exist
    console.log('🔍 Verifying table creation...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError.message)
    } else {
      console.log('📊 Created tables:')
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Alternative approach: Execute SQL directly
async function setupDatabaseDirect() {
  console.log('🚀 Starting Supabase database setup (direct method)...')
  
  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📝 Executing SQL schema...')
    
    // Execute the entire schema at once
    const { error } = await supabase.rpc('exec', { sql: schema })
    
    if (error) {
      console.error('❌ Error executing schema:', error.message)
      
      // Try to create tables individually
      console.log('🔄 Trying to create tables individually...')
      await createTablesIndividually()
    } else {
      console.log('✅ Database schema executed successfully!')
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('🔄 Trying alternative approach...')
    await createTablesIndividually()
  }
}

async function createTablesIndividually() {
  console.log('📋 Creating tables individually...')
  
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    )`,
    
    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      unit TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    
    // Listings table
    `CREATE TABLE IF NOT EXISTS listings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    )`,
    
    // Offers table
    `CREATE TABLE IF NOT EXISTS offers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    )`,
    
    // Messages table
    `CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
      sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
      receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      message_type TEXT DEFAULT 'text',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    
    // Notifications table
    `CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      is_read BOOLEAN DEFAULT false,
      action_required BOOLEAN DEFAULT false,
      action_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`
  ]
  
  for (let i = 0; i < tables.length; i++) {
    const tableSQL = tables[i]
    console.log(`⏳ Creating table ${i + 1}/${tables.length}...`)
    
    const { error } = await supabase.rpc('exec', { sql: tableSQL })
    
    if (error) {
      console.error(`❌ Error creating table ${i + 1}:`, error.message)
    } else {
      console.log(`✅ Table ${i + 1} created successfully`)
    }
  }
  
  console.log('✅ Individual table creation completed!')
}

// Run the setup
setupDatabaseDirect().then(() => {
  console.log('🎉 Supabase database setup completed!')
  process.exit(0)
}).catch(error => {
  console.error('💥 Setup failed:', error)
  process.exit(1)
})
