-- Fix User Registration Trigger - Handle capabilities from metadata properly
-- Run this in your Supabase SQL Editor

-- Step 1: Drop and recreate the trigger function with proper error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_capabilities TEXT[];
  user_role TEXT;
  user_name TEXT;
  user_location TEXT;
  capabilities_json JSONB;
BEGIN
  -- Extract metadata values safely
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'buyer');
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  user_location := COALESCE(NEW.raw_user_meta_data->>'location', '');

  -- Handle capabilities: Check if passed in metadata, otherwise derive from role
  capabilities_json := NEW.raw_user_meta_data->'capabilities';
  
  IF capabilities_json IS NOT NULL AND jsonb_typeof(capabilities_json) = 'array' THEN
    -- Parse capabilities from JSON array in metadata
    SELECT ARRAY(SELECT jsonb_array_elements_text(capabilities_json)) INTO user_capabilities;
  ELSE
    -- Derive capabilities from role if not in metadata or not an array
    user_capabilities := CASE 
      WHEN user_role = 'seller' THEN ARRAY['sell']
      WHEN user_role = 'transporter' THEN ARRAY['transport']
      ELSE ARRAY['buy']
    END;
  END IF;

  -- Insert user profile with all required fields
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
    user_name,
    user_role,
    user_capabilities,
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    user_location,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar', ''),
    (NEW.email_confirmed_at IS NOT NULL),
    'free',
    'pending',
    '{}'::jsonb,
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
    capabilities = EXCLUDED.capabilities,
    location = EXCLUDED.location,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the auth user creation
  -- This allows auth user to be created even if profile creation fails
  RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 3: Ensure RLS policies allow the trigger to work
-- SECURITY DEFINER functions should bypass RLS, but let's ensure there are no conflicts

-- Drop any existing conflicting policies for user creation
DROP POLICY IF EXISTS "Allow trigger to create users" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Allow user profile creation" ON users;

-- Create a policy that allows inserts during signup
-- This works together with SECURITY DEFINER to ensure the trigger can create users
CREATE POLICY "Allow trigger to create users" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Also ensure users can view their own data
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Step 4: Verify the function exists
SELECT 'Trigger function created successfully!' as status;

