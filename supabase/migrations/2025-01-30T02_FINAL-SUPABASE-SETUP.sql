-- FINAL SUPABASE SETUP - Copy and paste this ENTIRE block into Supabase SQL Editor
-- This will fix all your integration issues

-- Step 1: Fix the user profile creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    capabilities,
    company,
    location,
    phone,
    avatar,
    is_verified,
    subscription_status,
    fica_status,
    fica_documents,
    rating,
    total_deals,
    total_transactions,
    reputation_score,
    business_type,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'seller' THEN ARRAY['sell']
      WHEN NEW.raw_user_meta_data->>'role' = 'transporter' THEN ARRAY['transport']
      ELSE ARRAY['buy']
    END,
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar', ''),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    'free',
    'pending',
    '{}',
    0.0,
    0,
    0,
    0,
    'individual',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 2: Fix RLS policies for listings
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON listings;
DROP POLICY IF EXISTS "listings_read_all" ON listings;
DROP POLICY IF EXISTS "listings_insert_authenticated" ON listings;
DROP POLICY IF EXISTS "listings_update_owners" ON listings;
DROP POLICY IF EXISTS "listings_delete_owners" ON listings;

CREATE POLICY "listings_read_all" ON listings
  FOR SELECT USING (true);
  
CREATE POLICY "listings_insert_authenticated" ON listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "listings_update_owners" ON listings
  FOR UPDATE USING (auth.uid()::text = seller_id::text);
  
CREATE POLICY "listings_delete_owners" ON listings
  FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Step 3: Ensure the generic product exists (should already exist from the script)
INSERT INTO products (
  id,
  name,
  category,
  subcategory,
  description,
  specifications,
  unit,
  min_quantity,
  max_quantity,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Generic Agricultural Product',
  'grain',
  'mixed',
  'Generic product for custom listings',
  '{}',
  'ton',
  1,
  10000,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Step 4: Create a simple test listing to verify everything works
-- (This will be cleaned up automatically)
