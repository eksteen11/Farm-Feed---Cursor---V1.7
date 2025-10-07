-- =====================================================
-- FARM FEED DEALS DATABASE SETUP
-- =====================================================
-- This script creates the necessary tables for the deal workflow
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE DEALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.deals (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id uuid REFERENCES public.offers(id) ON DELETE CASCADE,
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    seller_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    transporter_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    final_price numeric NOT NULL,
    quantity numeric NOT NULL,
    delivery_type text CHECK (delivery_type IN ('ex-farm', 'delivered')) NOT NULL,
    delivery_address text,
    status text DEFAULT 'connected' CHECK (status IN ('connected', 'transport-quoted', 'transport-selected', 'facilitated', 'completed', 'cancelled')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    delivery_date timestamp with time zone,
    payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')),
    platform_fee numeric NOT NULL,
    transport_fee numeric,
    total_amount numeric NOT NULL,
    terms text,
    special_conditions text
);

-- =====================================================
-- 2. CREATE NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    type text NOT NULL, -- e.g., 'offer_received', 'offer_accepted', 'deal_update'
    message text NOT NULL,
    related_id uuid, -- e.g., offer_id, deal_id
    is_read boolean DEFAULT FALSE,
    created_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- 3. CREATE TRANSPORT REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transport_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    requester_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    origin_address text NOT NULL,
    destination_address text NOT NULL,
    product_details jsonb NOT NULL,
    quantity numeric NOT NULL,
    pickup_date timestamp with time zone NOT NULL,
    delivery_date timestamp with time zone NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'selected', 'in-transit', 'completed', 'cancelled')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- 4. CREATE TRANSPORT QUOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transport_quotes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid REFERENCES public.transport_requests(id) ON DELETE CASCADE,
    transporter_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    price numeric NOT NULL,
    currency text DEFAULT 'ZAR',
    estimated_delivery_date timestamp with time zone NOT NULL,
    terms text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_quotes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES FOR DEALS
-- =====================================================
CREATE POLICY "Allow all authenticated users to view their deals" ON public.deals
FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR auth.uid() = transporter_id);

CREATE POLICY "Allow buyers/sellers to insert their deals" ON public.deals
FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Allow buyers/sellers/transporters to update their deals" ON public.deals
FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR auth.uid() = transporter_id);

-- =====================================================
-- 7. CREATE RLS POLICIES FOR NOTIFICATIONS
-- =====================================================
CREATE POLICY "Allow authenticated users to view their notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their notifications" ON public.notifications
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 8. CREATE RLS POLICIES FOR TRANSPORT REQUESTS
-- =====================================================
CREATE POLICY "Allow all authenticated users to view their transport requests" ON public.transport_requests
FOR SELECT USING (auth.uid() = requester_id);

CREATE POLICY "Allow authenticated users to insert their transport requests" ON public.transport_requests
FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Allow authenticated users to update their transport requests" ON public.transport_requests
FOR UPDATE USING (auth.uid() = requester_id);

-- =====================================================
-- 9. CREATE RLS POLICIES FOR TRANSPORT QUOTES
-- =====================================================
CREATE POLICY "Allow all authenticated users to view transport quotes" ON public.transport_quotes
FOR SELECT USING (auth.uid() = transporter_id OR EXISTS (SELECT 1 FROM public.transport_requests WHERE public.transport_requests.id = request_id AND public.transport_requests.requester_id = auth.uid()));

CREATE POLICY "Allow transporters to insert their quotes" ON public.transport_quotes
FOR INSERT WITH CHECK (auth.uid() = transporter_id);

CREATE POLICY "Allow transporters/requesters to update their quotes" ON public.transport_quotes
FOR UPDATE USING (auth.uid() = transporter_id OR EXISTS (SELECT 1 FROM public.transport_requests WHERE public.transport_requests.id = request_id AND public.transport_requests.requester_id = auth.uid()));

-- =====================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON public.deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller_id ON public.deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_transport_requests_deal_id ON public.transport_requests(deal_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_requester_id ON public.transport_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_status ON public.transport_requests(status);

CREATE INDEX IF NOT EXISTS idx_transport_quotes_request_id ON public.transport_quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_transport_quotes_transporter_id ON public.transport_quotes(transporter_id);
CREATE INDEX IF NOT EXISTS idx_transport_quotes_status ON public.transport_quotes(status);

-- =====================================================
-- 11. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transport_requests_updated_at BEFORE UPDATE ON public.transport_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transport_quotes_updated_at BEFORE UPDATE ON public.transport_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. ADD DEAL_ID COLUMN TO OFFERS TABLE (if not exists)
-- =====================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'offers' AND column_name = 'deal_id') THEN
        ALTER TABLE public.offers ADD COLUMN deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_offers_deal_id ON public.offers(deal_id);
    END IF;
END $$;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- The following tables have been created:
-- 1. deals - Main deal tracking
-- 2. notifications - User notifications
-- 3. transport_requests - Transport requests for deals
-- 4. transport_quotes - Transport quotes from transporters
--
-- All tables have:
-- - Proper foreign key relationships
-- - Row Level Security (RLS) policies
-- - Performance indexes
-- - Updated_at triggers
--
-- Next steps:
-- 1. Test the deal creation API
-- 2. Implement transport request system
-- 3. Create contract generation
-- =====================================================