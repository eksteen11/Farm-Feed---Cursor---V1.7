-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'transporter');
CREATE TYPE subscription_status AS ENUM ('free', 'active', 'expired', 'cancelled');
CREATE TYPE fica_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE business_type AS ENUM ('individual', 'company', 'cooperative');
CREATE TYPE product_category AS ENUM ('grain', 'feed', 'seed', 'fertilizer', 'other');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'countered', 'expired');
CREATE TYPE deal_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'offer', 'transport', 'payment', 'system', 'message');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE message_type AS ENUM ('offer-discussion', 'offer-negotiation', 'general', 'text', 'image', 'document');
CREATE TYPE transport_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL,
    capabilities TEXT[] DEFAULT '{}',
    company TEXT,
    location TEXT,
    phone TEXT,
    avatar TEXT,
    is_verified BOOLEAN DEFAULT false,
    subscription_status subscription_status DEFAULT 'free',
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    fica_status fica_status DEFAULT 'pending',
    fica_documents JSONB DEFAULT '{}',
    fica_verified_at TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_deals INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0,
    business_type business_type DEFAULT 'individual',
    tax_number TEXT,
    vat_number TEXT,
    bank_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category product_category NOT NULL,
    subcategory TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    unit TEXT NOT NULL,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
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

-- Offers table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    delivery_type TEXT NOT NULL,
    delivery_address TEXT,
    message TEXT,
    status offer_status DEFAULT 'pending',
    is_negotiable BOOLEAN DEFAULT true,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    final_price DECIMAL(10,2) NOT NULL,
    final_quantity INTEGER NOT NULL,
    delivery_type TEXT NOT NULL,
    delivery_address TEXT,
    status deal_status DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    negotiation_id UUID,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT false,
    priority notification_priority DEFAULT 'medium',
    action_required BOOLEAN DEFAULT false,
    action_url TEXT,
    related_id UUID,
    related_type TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transport requests table
CREATE TABLE transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE,
    quantity INTEGER NOT NULL,
    weight_kg DECIMAL(10,2),
    special_requirements TEXT,
    price DECIMAL(10,2),
    status transport_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_product_id ON listings(product_id);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX idx_offers_seller_id ON offers(seller_id);
CREATE INDEX idx_offers_listing_id ON offers(listing_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_messages_offer_id ON messages(offer_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_transport_requests_requester_id ON transport_requests(requester_id);
CREATE INDEX idx_transport_requests_transporter_id ON transport_requests(transporter_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile and public profiles
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can read public profiles" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Listings are publicly readable
CREATE POLICY "Listings are publicly readable" ON listings FOR SELECT USING (true);

-- Users can create listings
CREATE POLICY "Users can create listings" ON listings FOR INSERT WITH CHECK (auth.uid()::text = seller_id::text);

-- Users can update their own listings
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid()::text = seller_id::text);

-- Users can read offers they're involved in
CREATE POLICY "Users can read own offers" ON offers FOR SELECT USING (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = seller_id::text
);

-- Users can create offers
CREATE POLICY "Users can create offers" ON offers FOR INSERT WITH CHECK (auth.uid()::text = buyer_id::text);

-- Users can update offers they're involved in
CREATE POLICY "Users can update own offers" ON offers FOR UPDATE USING (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = seller_id::text
);

-- Similar policies for other tables...
CREATE POLICY "Users can read own deals" ON deals FOR SELECT USING (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = seller_id::text
);

CREATE POLICY "Users can read own messages" ON messages FOR SELECT USING (
    auth.uid()::text = sender_id::text OR 
    auth.uid()::text = receiver_id::text
);

CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid()::text = sender_id::text);

CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transport_requests_updated_at BEFORE UPDATE ON transport_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
