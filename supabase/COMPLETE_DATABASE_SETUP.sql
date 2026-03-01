-- =====================================================
-- FARM FEED V1.7 - COMPLETE DATABASE SETUP
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- Project: Farm Feed V1.7
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE CUSTOM TYPES
-- =====================================================
DO $$ 
BEGIN
    -- User roles enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'transporter', 'admin');
    END IF;
    
    -- Subscription status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('free', 'active', 'expired', 'cancelled', 'inactive', 'pending');
    END IF;
    
    -- FICA status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fica_status') THEN
        CREATE TYPE fica_status AS ENUM ('pending', 'verified', 'rejected');
    END IF;
    
    -- Business type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type') THEN
        CREATE TYPE business_type AS ENUM ('individual', 'company', 'cooperative', 'government');
    END IF;
    
    -- Product category enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('grain', 'feed', 'seed', 'fertilizer', 'other');
    END IF;
    
    -- Offer status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'counter-offered', 'expired');
    END IF;
    
    -- Deal status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_status') THEN
        CREATE TYPE deal_status AS ENUM ('pending', 'confirmed', 'in-transit', 'delivered', 'completed', 'cancelled');
    END IF;
    
    -- Transport status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transport_status') THEN
        CREATE TYPE transport_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'open', 'quoted', 'selected', 'in-transit');
    END IF;
    
    -- Notification type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'offer', 'transport', 'payment', 'system', 'message');
    END IF;
    
    -- Notification priority enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_priority') THEN
        CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;
    
    -- Message type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
        CREATE TYPE message_type AS ENUM ('offer-discussion', 'offer-negotiation', 'general', 'text', 'image', 'document');
    END IF;
END $$;

-- =====================================================
-- 2. CREATE USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'transporter', 'admin')),
    capabilities TEXT[] DEFAULT '{}',
    company TEXT,
    location TEXT,
    phone TEXT,
    avatar TEXT,
    is_verified BOOLEAN DEFAULT false,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'premium', 'enterprise', 'inactive', 'expired', 'cancelled', 'pending')),
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    fica_status TEXT DEFAULT 'pending' CHECK (fica_status IN ('pending', 'verified', 'rejected')),
    fica_documents JSONB DEFAULT '{}',
    fica_verified_at TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_deals INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0,
    business_type TEXT DEFAULT 'individual' CHECK (business_type IN ('individual', 'company', 'cooperative', 'government')),
    tax_number TEXT,
    vat_number TEXT,
    bank_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    unit TEXT NOT NULL,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE LISTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    quantity INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL,
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    delivery_options JSONB DEFAULT '{}',
    quality_grade TEXT DEFAULT 'A',
    specifications JSONB DEFAULT '{}',
    payment_terms TEXT,
    certificates TEXT[] DEFAULT '{}',
    lab_results TEXT[] DEFAULT '{}',
    map_visibility BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE OFFERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('ex-farm', 'delivered')),
    delivery_address TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'counter-offered', 'expired')),
    is_negotiable BOOLEAN DEFAULT true,
    terms TEXT,
    counter_offer_data JSONB DEFAULT '{}',
    negotiation_history JSONB DEFAULT '[]',
    transport_request_id UUID,
    deal_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- =====================================================
-- 6. CREATE DEALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    final_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('ex-farm', 'delivered')),
    delivery_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-transit', 'delivered', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')),
    platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    transport_fee DECIMAL(10,2),
    total_amount DECIMAL(12,2) NOT NULL,
    terms TEXT,
    special_conditions TEXT,
    delivery_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CREATE MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    negotiation_id UUID,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('offer-discussion', 'offer-negotiation', 'general', 'text', 'image', 'document')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CREATE NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'offer', 'transport', 'payment', 'system', 'message')),
    is_read BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    action_required BOOLEAN DEFAULT false,
    action_url TEXT,
    related_id UUID,
    related_type TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CREATE TRANSPORT REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    pickup_location_details JSONB DEFAULT '{}',
    delivery_location_details JSONB DEFAULT '{}',
    quantity INTEGER NOT NULL,
    unit TEXT DEFAULT 'ton',
    preferred_date TIMESTAMP WITH TIME ZONE NOT NULL,
    budget DECIMAL(10,2),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'accepted', 'in_progress', 'completed', 'pending', 'cancelled')),
    product_type TEXT,
    special_requirements TEXT,
    contact_phone TEXT,
    urgent BOOLEAN DEFAULT false,
    auto_quote JSONB DEFAULT '{}',
    platform_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. CREATE TRANSPORT QUOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transport_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transport_request_id UUID NOT NULL REFERENCES transport_requests(id) ON DELETE CASCADE,
    transporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    estimated_days INTEGER NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    vehicle_type TEXT,
    insurance TEXT,
    available_date TIMESTAMP WITH TIME ZONE,
    breakdown JSONB DEFAULT '{}',
    platform_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);

CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON listings(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller_id ON offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_deal_id ON offers(deal_id);

CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller_id ON deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_transporter_id ON deals(transporter_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_offer_id ON deals(offer_id);
CREATE INDEX IF NOT EXISTS idx_deals_listing_id ON deals(listing_id);

CREATE INDEX IF NOT EXISTS idx_messages_offer_id ON messages(offer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transport_requests_deal_id ON transport_requests(deal_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_requester_id ON transport_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_status ON transport_requests(status);

CREATE INDEX IF NOT EXISTS idx_transport_quotes_request_id ON transport_quotes(transport_request_id);
CREATE INDEX IF NOT EXISTS idx_transport_quotes_transporter_id ON transport_quotes(transporter_id);
CREATE INDEX IF NOT EXISTS idx_transport_quotes_status ON transport_quotes(status);

-- =====================================================
-- 12. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_quotes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 13. CREATE RLS POLICIES
-- =====================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can read public profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Listings are publicly readable" ON listings;
DROP POLICY IF EXISTS "Users can create listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

DROP POLICY IF EXISTS "Users can read own offers" ON offers;
DROP POLICY IF EXISTS "Users can create offers" ON offers;
DROP POLICY IF EXISTS "Users can update own offers" ON offers;

DROP POLICY IF EXISTS "Users can read own deals" ON deals;
DROP POLICY IF EXISTS "Users can create deals" ON deals;
DROP POLICY IF EXISTS "Users can update own deals" ON deals;

DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

DROP POLICY IF EXISTS "Users can read own transport requests" ON transport_requests;
DROP POLICY IF EXISTS "Users can create transport requests" ON transport_requests;
DROP POLICY IF EXISTS "Users can update own transport requests" ON transport_requests;

DROP POLICY IF EXISTS "Users can read transport quotes" ON transport_quotes;
DROP POLICY IF EXISTS "Users can create transport quotes" ON transport_quotes;
DROP POLICY IF EXISTS "Users can update transport quotes" ON transport_quotes;

-- Users policies
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read public profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Products policies (public read)
CREATE POLICY "Products are publicly readable" ON products
    FOR SELECT USING (true);

-- Listings policies
CREATE POLICY "Listings are publicly readable" ON listings
    FOR SELECT USING (is_active = true OR auth.uid()::text = seller_id::text);

CREATE POLICY "Users can create listings" ON listings
    FOR INSERT WITH CHECK (auth.uid()::text = seller_id::text);

CREATE POLICY "Users can update own listings" ON listings
    FOR UPDATE USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Users can delete own listings" ON listings
    FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Offers policies
CREATE POLICY "Users can read own offers" ON offers
    FOR SELECT USING (
        auth.uid()::text = buyer_id::text OR 
        auth.uid()::text = seller_id::text
    );

CREATE POLICY "Users can create offers" ON offers
    FOR INSERT WITH CHECK (auth.uid()::text = buyer_id::text);

CREATE POLICY "Users can update own offers" ON offers
    FOR UPDATE USING (
        auth.uid()::text = buyer_id::text OR 
        auth.uid()::text = seller_id::text
    );

-- Deals policies
CREATE POLICY "Users can read own deals" ON deals
    FOR SELECT USING (
        auth.uid()::text = buyer_id::text OR 
        auth.uid()::text = seller_id::text OR
        auth.uid()::text = transporter_id::text
    );

CREATE POLICY "Users can create deals" ON deals
    FOR INSERT WITH CHECK (
        auth.uid()::text = buyer_id::text OR 
        auth.uid()::text = seller_id::text
    );

CREATE POLICY "Users can update own deals" ON deals
    FOR UPDATE USING (
        auth.uid()::text = buyer_id::text OR 
        auth.uid()::text = seller_id::text OR
        auth.uid()::text = transporter_id::text
    );

-- Messages policies
CREATE POLICY "Users can read own messages" ON messages
    FOR SELECT USING (
        auth.uid()::text = sender_id::text OR 
        auth.uid()::text = receiver_id::text
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid()::text = sender_id::text);

CREATE POLICY "Users can update own messages" ON messages
    FOR UPDATE USING (
        auth.uid()::text = sender_id::text OR 
        auth.uid()::text = receiver_id::text
    );

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Transport requests policies
CREATE POLICY "Users can read own transport requests" ON transport_requests
    FOR SELECT USING (
        auth.uid()::text = requester_id::text OR
        auth.uid()::text = transporter_id::text
    );

CREATE POLICY "Users can create transport requests" ON transport_requests
    FOR INSERT WITH CHECK (auth.uid()::text = requester_id::text);

CREATE POLICY "Users can update own transport requests" ON transport_requests
    FOR UPDATE USING (
        auth.uid()::text = requester_id::text OR
        auth.uid()::text = transporter_id::text
    );

-- Transport quotes policies
CREATE POLICY "Users can read transport quotes" ON transport_quotes
    FOR SELECT USING (
        auth.uid()::text = transporter_id::text OR
        EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = transport_quotes.transport_request_id 
            AND transport_requests.requester_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can create transport quotes" ON transport_quotes
    FOR INSERT WITH CHECK (auth.uid()::text = transporter_id::text);

CREATE POLICY "Users can update transport quotes" ON transport_quotes
    FOR UPDATE USING (
        auth.uid()::text = transporter_id::text OR
        EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = transport_quotes.transport_request_id 
            AND transport_requests.requester_id::text = auth.uid()::text
        )
    );

-- =====================================================
-- 14. CREATE TRIGGER FUNCTION FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 15. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at 
    BEFORE UPDATE ON listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
CREATE TRIGGER update_offers_updated_at 
    BEFORE UPDATE ON offers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at 
    BEFORE UPDATE ON deals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transport_requests_updated_at ON transport_requests;
CREATE TRIGGER update_transport_requests_updated_at 
    BEFORE UPDATE ON transport_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transport_quotes_updated_at ON transport_quotes;
CREATE TRIGGER update_transport_quotes_updated_at 
    BEFORE UPDATE ON transport_quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 16. CREATE FUNCTION TO HANDLE NEW USER REGISTRATION
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, is_verified, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 17. INSERT SAMPLE PRODUCTS
-- =====================================================
INSERT INTO products (name, category, subcategory, description, unit, min_quantity, max_quantity) VALUES
('Yellow Maize', 'grain', 'maize', 'High-quality yellow maize for feed and food', 'ton', 1, 1000),
('White Maize', 'grain', 'maize', 'Premium white maize', 'ton', 1, 1000),
('Sunflower Seeds', 'grain', 'sunflower', 'Oil-rich sunflower seeds', 'ton', 1, 300),
('Soybean Meal', 'feed', 'soybean', 'High protein soybean meal', 'ton', 1, 500),
('Wheat Bran', 'feed', 'wheat', 'Nutritious wheat bran', 'ton', 1, 400),
('Wheat', 'grain', 'wheat', 'Premium wheat for milling', 'ton', 1, 500),
('Soybeans', 'grain', 'soybeans', 'Protein-rich soybeans', 'ton', 1, 200),
('Barley', 'grain', 'barley', 'Feed barley', 'ton', 1, 400)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- All tables, indexes, RLS policies, and triggers have been created.
-- 
-- Tables created:
-- ✅ users
-- ✅ products
-- ✅ listings
-- ✅ offers
-- ✅ deals
-- ✅ messages
-- ✅ notifications
-- ✅ transport_requests
-- ✅ transport_quotes
--
-- Next steps:
-- 1. Verify tables in Table Editor
-- 2. Test connection from your Next.js app
-- 3. Create test users via Authentication
-- =====================================================

SELECT 'Farm Feed V1.7 database setup completed successfully!' as status;








