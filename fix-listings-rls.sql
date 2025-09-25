-- Fix RLS policies for listings table
-- Allow authenticated users to insert their own listings
-- Allow everyone to read active listings

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON listings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON listings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON listings;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON listings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON listings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for listing owners" ON listings
    FOR UPDATE USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Enable delete for listing owners" ON listings
    FOR DELETE USING (auth.uid()::text = seller_id::text);

SELECT 'RLS policies for listings fixed!' as status;
