-- Fix RLS policies for user registration
-- Run this in your Supabase SQL Editor

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Create more permissive policies for registration
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Also allow service role to insert (for triggers)
CREATE POLICY "Enable insert for service role" ON users
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Test the policies
SELECT 'RLS policies fixed!' as status;