-- Enhanced Offer System Database Schema
-- Run this in your Supabase SQL Editor to upgrade the offer system

-- First, let's add the missing columns to the offers table (without foreign key constraints for now)
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
ADD COLUMN IF NOT EXISTS counter_offer_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS negotiation_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS transport_request_id UUID,
ADD COLUMN IF NOT EXISTS deal_id UUID;

-- Update the status column to use the enum (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        ALTER TABLE offers 
        ALTER COLUMN status TYPE offer_status USING status::offer_status;
    END IF;
END $$;

-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  related_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create offers view for easier querying
CREATE OR REPLACE VIEW offers_with_details AS
SELECT 
  o.*,
  l.title as listing_title,
  l.price as listing_price,
  l.location as listing_location,
  l.images as listing_images,
  seller.name as seller_name,
  seller.company as seller_company,
  seller.email as seller_email,
  buyer.name as buyer_name,
  buyer.company as buyer_company,
  buyer.email as buyer_email
FROM offers o
LEFT JOIN listings l ON o.listing_id = l.id
LEFT JOIN users seller ON o.seller_id = seller.id
LEFT JOIN users buyer ON o.buyer_id = buyer.id;

-- Create RLS policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- System can insert notifications for any user
CREATE POLICY "System can insert notifications" ON notifications
FOR INSERT WITH CHECK (true);

-- Create function to send notifications
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_related_id UUID DEFAULT NULL,
  p_related_type VARCHAR(50) DEFAULT NULL,
  p_priority VARCHAR(20) DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, type, title, message, related_id, related_type, priority
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_related_id, p_related_type, p_priority
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle offer status changes
CREATE OR REPLACE FUNCTION handle_offer_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification when offer status changes
  IF OLD.status != NEW.status THEN
    -- Notify buyer
    PERFORM create_notification(
      NEW.buyer_id,
      'offer_status_change',
      'Offer Status Updated',
      'Your offer status has been updated to ' || NEW.status,
      NEW.id,
      'offer',
      'high'
    );
    
    -- Notify seller
    PERFORM create_notification(
      NEW.seller_id,
      'offer_status_change',
      'Offer Status Updated',
      'Offer status has been updated to ' || NEW.status,
      NEW.id,
      'offer',
      'high'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for offer status changes
DROP TRIGGER IF EXISTS offer_status_change_trigger ON offers;
CREATE TRIGGER offer_status_change_trigger
  AFTER UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION handle_offer_status_change();

-- Create function to handle new offers
CREATE OR REPLACE FUNCTION handle_new_offer()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify seller about new offer
  PERFORM create_notification(
    NEW.seller_id,
    'new_offer',
    'New Offer Received',
    'You have received a new offer on your listing',
    NEW.id,
    'offer',
    'high'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new offers
DROP TRIGGER IF EXISTS new_offer_trigger ON offers;
CREATE TRIGGER new_offer_trigger
  AFTER INSERT ON offers
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_offer();

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
GRANT SELECT ON offers_with_details TO authenticated;
