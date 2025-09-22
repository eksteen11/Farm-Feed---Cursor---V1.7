-- Add roles column to users table
-- Run this in your Supabase SQL Editor

-- Add the roles column as a TEXT array
ALTER TABLE users ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}';

-- Update existing users to have roles based on their current role
UPDATE users 
SET roles = ARRAY[role] 
WHERE roles IS NULL OR array_length(roles, 1) IS NULL;

-- Create an index on the roles column for better performance
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Verify the changes
SELECT id, email, name, role, roles FROM users LIMIT 5;
