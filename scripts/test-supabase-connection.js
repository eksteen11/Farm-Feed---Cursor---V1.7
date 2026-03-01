/**
 * Test Supabase Connection Script
 * Run this to verify your Supabase connection is working
 * Usage: node scripts/test-supabase-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Check environment variables
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);
if (supabaseServiceKey) {
  console.log(`   Service Key: ${supabaseServiceKey.substring(0, 20)}...`);
} else {
  console.log('   ⚠️  Service Key: Not set (optional for admin operations)');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  try {
    console.log('\n📊 Testing database connection...');
    
    // Test 1: Check if we can query users table
    console.log('\n1️⃣  Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(5);
    
    if (usersError) {
      console.error('   ❌ Error:', usersError.message);
      console.error('   💡 Make sure the users table exists and RLS policies are set correctly');
    } else {
      console.log(`   ✅ Users table accessible (${users?.length || 0} users found)`);
    }
    
    // Test 2: Check if we can query listings table
    console.log('\n2️⃣  Testing listings table...');
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, title, price')
      .limit(5);
    
    if (listingsError) {
      console.error('   ❌ Error:', listingsError.message);
      console.error('   💡 Make sure the listings table exists');
    } else {
      console.log(`   ✅ Listings table accessible (${listings?.length || 0} listings found)`);
    }
    
    // Test 3: Check if we can query offers table
    console.log('\n3️⃣  Testing offers table...');
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('id, price, status')
      .limit(5);
    
    if (offersError) {
      console.error('   ❌ Error:', offersError.message);
      console.error('   💡 Make sure the offers table exists');
    } else {
      console.log(`   ✅ Offers table accessible (${offers?.length || 0} offers found)`);
    }
    
    // Test 4: Check if we can query deals table
    console.log('\n4️⃣  Testing deals table...');
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('id, status')
      .limit(5);
    
    if (dealsError) {
      console.error('   ❌ Error:', dealsError.message);
      console.error('   💡 Make sure the deals table exists');
    } else {
      console.log(`   ✅ Deals table accessible (${deals?.length || 0} deals found)`);
    }
    
    // Test 5: Check if we can query products table
    console.log('\n5️⃣  Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category')
      .limit(5);
    
    if (productsError) {
      console.error('   ❌ Error:', productsError.message);
      console.error('   💡 Make sure the products table exists');
    } else {
      console.log(`   ✅ Products table accessible (${products?.length || 0} products found)`);
    }
    
    // Test 6: Check if we can query transport_requests table
    console.log('\n6️⃣  Testing transport_requests table...');
    const { data: transportRequests, error: transportError } = await supabase
      .from('transport_requests')
      .select('id, status')
      .limit(5);
    
    if (transportError) {
      console.error('   ❌ Error:', transportError.message);
      console.error('   💡 Make sure the transport_requests table exists');
    } else {
      console.log(`   ✅ Transport requests table accessible (${transportRequests?.length || 0} requests found)`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 Connection Test Summary');
    console.log('='.repeat(50));
    
    const tests = [
      { name: 'Users', error: usersError },
      { name: 'Listings', error: listingsError },
      { name: 'Offers', error: offersError },
      { name: 'Deals', error: dealsError },
      { name: 'Products', error: productsError },
      { name: 'Transport Requests', error: transportError }
    ];
    
    const passed = tests.filter(t => !t.error).length;
    const failed = tests.filter(t => t.error).length;
    
    console.log(`✅ Passed: ${passed}/${tests.length}`);
    console.log(`❌ Failed: ${failed}/${tests.length}`);
    
    if (failed > 0) {
      console.log('\n💡 Next steps:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Run the COMPLETE_DATABASE_SETUP.sql script');
      console.log('   4. Verify tables exist in Table Editor');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed! Your Supabase connection is working correctly.');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your .env.local file has correct Supabase credentials');
    console.error('   2. Verify your Supabase project is active');
    console.error('   3. Make sure you\'ve run the database setup script');
    process.exit(1);
  }
}

testConnection();








