-- Setup Supabase Storage Bucket for Farm Feed Media
-- Copy and paste this into your Supabase SQL Editor

-- Create the storage bucket for farm feed media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'farm-feed-media',
  'farm-feed-media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/quicktime']
);

-- Create RLS policies for the storage bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'farm-feed-media');

-- Allow public access to view files
CREATE POLICY "Allow public access to view media" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'farm-feed-media');

-- Allow users to update their own files
CREATE POLICY "Allow users to update own media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'farm-feed-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own media" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'farm-feed-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO public;
