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

async function testAuth() {
  console.log('🔐 Testing Supabase Authentication...')
  
  try {
    // Test with a real email format
    const testEmail = 'testuser123@gmail.com'
    const testPassword = 'TestPassword123!'
    
    console.log(`\n📧 Testing signup with email: ${testEmail}`)
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })
    
    if (authError) {
      console.error('❌ Signup error:', authError.message)
      console.error('Error details:', authError)
    } else {
      console.log('✅ Signup successful!')
      console.log('User ID:', authData.user?.id)
      console.log('Email confirmed:', authData.user?.email_confirmed_at ? 'Yes' : 'No')
      
      if (authData.user) {
        // Test inserting into users table
        console.log('\n👤 Testing user profile creation...')
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: testEmail,
            name: 'Test User',
            role: 'buyer',
            capabilities: ['buy'],
            company: 'Test Company',
            location: 'Test Location'
          }])
        
        if (insertError) {
          console.error('❌ Profile creation error:', insertError.message)
          console.error('Error details:', insertError)
        } else {
          console.log('✅ Profile creation successful!')
          
          // Test reading the user back
          console.log('\n📖 Testing user profile retrieval...')
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()
          
          if (userError) {
            console.error('❌ User retrieval error:', userError.message)
          } else {
            console.log('✅ User retrieval successful!')
            console.log('User data:', JSON.stringify(userData, null, 2))
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Full error:', error)
  }
}

testAuth()
