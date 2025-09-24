-- Fix Supabase for Real User Registration
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if the users table exists and has the right structure
-- If not, create it properly

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
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
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'premium', 'inactive')),
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    fica_status TEXT DEFAULT 'pending' CHECK (fica_status IN ('pending', 'verified', 'rejected')),
    fica_documents JSONB DEFAULT '{}',
    fica_verified_at TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_deals INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0,
    business_type TEXT CHECK (business_type IN ('individual', 'company', 'cooperative', 'government')),
    tax_number TEXT,
    vat_number TEXT,
    bank_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for real user registration
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Create new policies that work with Supabase Auth
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 4. Create a function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name, role, is_verified, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to automatically create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Clear any existing demo data
DELETE FROM users WHERE email IN ('farmer@demo.com', 'seller@demo.com', 'transporter@demo.com');

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);

-- 8. Check if everything is working
SELECT 'Database setup complete!' as status;
SELECT 'Users table structure:' as info;
\d users;
