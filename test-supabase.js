#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
  console.log('🧪 Testing Supabase Connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  try {
    // Test 1: Check if we can connect
    console.log('\n1️⃣ Testing basic connection...')
    const { data, error } = await supabase.from('users').select('*').limit(1)
    
    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('✅ Connection works, but users table might not exist yet')
      } else {
        console.error('❌ Connection error:', error.message)
        return
      }
    } else {
      console.log('✅ Connection successful!')
    }
    
    // Test 2: Try to sign up a test user
    console.log('\n2️⃣ Testing user signup...')
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'testpassword123'
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })
    
    if (authError) {
      console.error('❌ Signup error:', authError.message)
    } else {
      console.log('✅ Signup successful!')
      console.log('User ID:', authData.user?.id)
      
      // Test 3: Try to insert into users table
      if (authData.user) {
        console.log('\n3️⃣ Testing user profile creation...')
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: testEmail,
            name: 'Test User',
            role: 'buyer',
            capabilities: ['buy']
          }])
        
        if (insertError) {
          console.error('❌ Profile creation error:', insertError.message)
        } else {
          console.log('✅ Profile creation successful!')
        }
      }
    }
    
    // Test 4: Check products table
    console.log('\n4️⃣ Testing products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Products error:', productsError.message)
    } else {
      console.log('✅ Products table accessible!')
      console.log('Found products:', products.length)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testSupabase()
