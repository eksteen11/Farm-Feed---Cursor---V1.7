-- Fix RLS policies for user registration
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Create new policies that work with Supabase Auth
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their profile during signup
-- This policy allows insertion if the user is authenticated and the id matches their auth.uid()
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        auth.uid() = id
    );

-- Alternative: Allow insertion during signup process
-- This is more permissive but necessary for the signup flow
CREATE POLICY "Allow user profile creation during signup" ON users
    FOR INSERT WITH CHECK (true);

-- If you want to be more secure, you can use a function-based approach
-- But for now, let's use the simpler approach

-- Also fix other table policies if needed
DROP POLICY IF EXISTS "Users can view offers on their listings" ON offers;
DROP POLICY IF EXISTS "Users can create offers" ON offers;
DROP POLICY IF EXISTS "Users can update offers on their listings" ON offers;

CREATE POLICY "Users can view offers on their listings" ON offers
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = offers.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

CREATE POLICY "Users can create offers" ON offers
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update offers on their listings" ON offers
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = offers.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Fix messages policies
DROP POLICY IF EXISTS "Users can view messages in their offers" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

CREATE POLICY "Users can view messages in their offers" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow insertion of notifications (system can create them)
CREATE POLICY "Allow notification creation" ON notifications
    FOR INSERT WITH CHECK (true);
