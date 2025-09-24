require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase URL or Anon Key is missing in .env.local');
  console.log('Please update your .env.local file with your new Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNewSupabase() {
  console.log('🚀 Testing New Supabase Setup for Farm Feed');
  console.log('\n📋 Project Details:');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseAnonKey.substring(0, 20)}...`); // Mask key for display
  const projectIdMatch = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/);
  const projectId = projectIdMatch ? projectIdMatch[1] : 'N/A';
  console.log(`Project ID: ${projectId}`);

  console.log('\n🔧 Testing database connection...');
  try {
    // Test basic connectivity
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n💡 Solution: Run the setup-new-supabase.sql script in your Supabase SQL Editor');
      }
      return;
    }

    console.log('✅ Database connection successful!');

    // Test if tables exist
    console.log('\n🔍 Checking database tables...');
    const tables = ['users', 'products', 'listings', 'offers', 'messages', 'notifications'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': OK`);
        }
      } catch (e) {
        console.log(`❌ Table '${table}': Error - ${e.message}`);
      }
    }

    console.log('\n🎉 Your new Supabase project is ready!');
    console.log('\n📝 Next steps:');
    console.log('1. Try registering at http://localhost:3000/register');
    console.log('2. Check your Supabase dashboard for the new user');
    console.log('3. Test all pages in your app');

  } catch (e) {
    console.error('❌ Connection failed:', e.message);
    console.log('\n💡 Make sure your Supabase project is active and credentials are correct.');
  }
}

testNewSupabase();
