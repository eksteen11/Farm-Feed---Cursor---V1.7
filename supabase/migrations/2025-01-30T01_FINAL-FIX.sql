-- FINAL FIX - Copy and paste this ENTIRE block into Supabase SQL Editor
-- This will create your user profile and fix all RLS issues

-- Step 1: Create your user profile
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
SELECT 
  au.id,
  au.email,
  'Drikus Seller',
  'seller',
  ARRAY['sell'],
  'Drikus Seller Farm',
  'Free State',
  '',
  '',
  true,
  'free',
  'pending',
  '{}',
  4.5,
  10,
  15,
  85,
  'individual',
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email LIKE '%drikus%' OR au.email LIKE '%seller%'
ON CONFLICT (id) DO NOTHING;

-- Step 2: Fix RLS policies for listings
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS with simple policy
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users" ON listings
    FOR ALL USING (auth.role() = 'authenticated');
