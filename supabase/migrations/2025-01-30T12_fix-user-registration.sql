-- Quick fix for user registration
-- Run this in your Supabase SQL Editor

-- Option 1: Temporarily disable RLS for users table (for development only)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a more permissive policy for user creation
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Create a new policy that allows user creation during signup
CREATE POLICY "Allow user profile creation" ON users
    FOR INSERT WITH CHECK (true);

-- Also ensure users can read their own profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Test the fix by trying to create a user
-- You can test this after running the above commands
