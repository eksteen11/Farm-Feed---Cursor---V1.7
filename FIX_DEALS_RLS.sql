-- =====================================================
-- FIX DEALS RLS POLICIES
-- =====================================================
-- This script fixes the RLS policies for the deals table
-- to allow proper deal creation from the API

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all authenticated users to view their deals" ON public.deals;
DROP POLICY IF EXISTS "Allow buyers/sellers to insert their deals" ON public.deals;
DROP POLICY IF EXISTS "Allow buyers/sellers/transporters to update their deals" ON public.deals;

-- Create more permissive policies for deal creation
CREATE POLICY "Allow authenticated users to view their deals" ON public.deals
FOR SELECT USING (
  auth.uid() = buyer_id OR 
  auth.uid() = seller_id OR 
  auth.uid() = transporter_id OR
  auth.role() = 'service_role'
);

CREATE POLICY "Allow deal creation from API" ON public.deals
FOR INSERT WITH CHECK (
  auth.role() = 'service_role' OR
  auth.uid() = buyer_id OR 
  auth.uid() = seller_id
);

CREATE POLICY "Allow deal updates from API" ON public.deals
FOR UPDATE USING (
  auth.role() = 'service_role' OR
  auth.uid() = buyer_id OR 
  auth.uid() = seller_id OR 
  auth.uid() = transporter_id
);

-- Also fix the offers table RLS if needed
DROP POLICY IF EXISTS "Allow authenticated users to update their offers" ON public.offers;

CREATE POLICY "Allow offer updates from API" ON public.offers
FOR UPDATE USING (
  auth.role() = 'service_role' OR
  auth.uid() = buyer_id OR
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = offers.listing_id 
    AND listings.seller_id = auth.uid()
  )
);

-- =====================================================
-- ALTERNATIVE: TEMPORARILY DISABLE RLS FOR TESTING
-- =====================================================
-- If the above doesn't work, you can temporarily disable RLS:
-- ALTER TABLE public.deals DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.offers DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- The RLS policies have been updated to allow:
-- 1. Service role to create/update deals (for API operations)
-- 2. Buyers/sellers to create/update their own deals
-- 3. Proper authentication checks for all operations
-- =====================================================
