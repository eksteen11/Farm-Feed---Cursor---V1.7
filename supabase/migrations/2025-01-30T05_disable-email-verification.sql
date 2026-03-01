-- Temporarily disable email verification for development
-- Run this in your Supabase SQL Editor

-- Option 1: Disable email confirmation requirement (for development only)
-- This allows users to sign in immediately without email verification

-- Go to your Supabase dashboard:
-- 1. Navigate to Authentication > Settings
-- 2. Under "User Signups", turn OFF "Enable email confirmations"
-- 3. Save the settings

-- Option 2: If you want to keep email verification but fix the email delivery:
-- 1. Go to Authentication > Settings > SMTP Settings
-- 2. Configure your email provider (Gmail, SendGrid, etc.)
-- 3. Or use Supabase's built-in email service (may have rate limits)

-- Option 3: For testing, you can manually verify users:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'your-email@example.com';

-- Option 4: Check email logs:
-- Go to Authentication > Logs to see if emails are being sent and if there are any errors

-- Recommended for development:
-- Turn OFF email confirmations temporarily so you can test the app functionality
-- Then turn it back ON when you're ready for production
