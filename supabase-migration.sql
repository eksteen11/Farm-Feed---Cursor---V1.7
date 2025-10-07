-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  final_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  delivery_type TEXT CHECK (delivery_type IN ('ex-farm', 'delivered')) DEFAULT 'ex-farm',
  delivery_address TEXT,
  status TEXT CHECK (status IN ('connected', 'negotiating', 'transport-quoted', 'transport-selected', 'facilitated', 'completed', 'cancelled')) DEFAULT 'connected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_date TIMESTAMP WITH TIME ZONE,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')) DEFAULT 'pending',
  platform_fee DECIMAL(10,2) DEFAULT 0,
  transport_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  terms TEXT,
  special_conditions TEXT
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add rejection_reason column to offers table if it doesn't exist
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create indexes for deals
CREATE INDEX IF NOT EXISTS idx_deals_offer_id ON deals(offer_id);
CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller_id ON deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS for deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deals
CREATE POLICY "Users can view their own deals" ON deals
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can update their own deals" ON deals
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);
