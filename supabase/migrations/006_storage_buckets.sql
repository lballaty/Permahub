-- ================================================
-- Supabase Storage Buckets Setup
-- ================================================
-- Create storage buckets for wiki content images

-- Note: Supabase storage buckets are created via the Supabase client or dashboard
-- This SQL file documents the required bucket configuration

-- Required buckets:
-- 1. wiki-images: For guide, event, and location images
-- 2. user-avatars: For user profile pictures
-- 3. wiki-attachments: For document attachments

-- Since bucket creation requires Supabase storage API, we'll create a metadata table
-- to track our storage configuration and uploaded files

-- ================================================
-- Wiki Media/Images Table
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File information
  filename TEXT NOT NULL,
  original_filename TEXT,
  file_path TEXT NOT NULL, -- Path in Supabase storage
  file_size INTEGER, -- Size in bytes
  mime_type TEXT,
  bucket_name TEXT DEFAULT 'wiki-images',

  -- Associations
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Content associations (polymorphic)
  content_type TEXT CHECK (content_type IN ('guide', 'event', 'location', 'user', 'collection')),
  content_id UUID,

  -- Image metadata
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'pending')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_wiki_media_content ON wiki_media(content_type, content_id);
CREATE INDEX idx_wiki_media_uploaded_by ON wiki_media(uploaded_by);
CREATE INDEX idx_wiki_media_status ON wiki_media(status);

-- ================================================
-- Functions for Storage Management
-- ================================================

-- Function to get storage URL for an image
CREATE OR REPLACE FUNCTION get_storage_url(p_file_path TEXT, p_bucket TEXT DEFAULT 'wiki-images')
RETURNS TEXT AS $$
DECLARE
  v_supabase_url TEXT;
BEGIN
  -- Get Supabase URL from environment or use default
  v_supabase_url := COALESCE(
    current_setting('app.supabase_url', true),
    'http://localhost:54321'
  );

  -- Return public URL for the file
  RETURN v_supabase_url || '/storage/v1/object/public/' || p_bucket || '/' || p_file_path;
END;
$$ LANGUAGE plpgsql;

-- Function to register uploaded media
CREATE OR REPLACE FUNCTION register_media_upload(
  p_filename TEXT,
  p_file_path TEXT,
  p_file_size INTEGER,
  p_mime_type TEXT,
  p_content_type TEXT DEFAULT NULL,
  p_content_id UUID DEFAULT NULL,
  p_alt_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_media_id UUID;
BEGIN
  INSERT INTO wiki_media (
    filename,
    original_filename,
    file_path,
    file_size,
    mime_type,
    content_type,
    content_id,
    alt_text,
    uploaded_by
  ) VALUES (
    p_filename,
    p_filename,
    p_file_path,
    p_file_size,
    p_mime_type,
    p_content_type,
    p_content_id,
    p_alt_text,
    auth.uid()
  )
  RETURNING id INTO v_media_id;

  RETURN v_media_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Update triggers
-- ================================================

CREATE OR REPLACE FUNCTION update_wiki_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wiki_media_updated_at
  BEFORE UPDATE ON wiki_media
  FOR EACH ROW
  EXECUTE FUNCTION update_wiki_media_updated_at();

-- ================================================
-- Row Level Security
-- ================================================

ALTER TABLE wiki_media ENABLE ROW LEVEL SECURITY;

-- Everyone can view active media
CREATE POLICY "Public can view active media" ON wiki_media
  FOR SELECT
  USING (status = 'active');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON wiki_media
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own uploads
CREATE POLICY "Users can update own uploads" ON wiki_media
  FOR UPDATE
  USING (uploaded_by = auth.uid());

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads" ON wiki_media
  FOR DELETE
  USING (uploaded_by = auth.uid());

-- ================================================
-- Storage Bucket Configuration (Documentation)
-- ================================================

COMMENT ON TABLE wiki_media IS 'Tracks all media files uploaded to Supabase Storage.

Required Storage Buckets (create via Supabase Dashboard):

1. wiki-images (public bucket)
   - Used for: Guide images, event banners, location photos
   - Max file size: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

2. user-avatars (public bucket)
   - Used for: User profile pictures
   - Max file size: 2MB
   - Allowed MIME types: image/jpeg, image/png

3. wiki-attachments (public bucket)
   - Used for: PDFs, documents, spreadsheets
   - Max file size: 10MB
   - Allowed MIME types: application/pdf, application/msword, etc.

File naming convention:
- Guides: guides/{guide_id}/{timestamp}_{filename}
- Events: events/{event_id}/{timestamp}_{filename}
- Locations: locations/{location_id}/{timestamp}_{filename}
- Users: users/{user_id}/avatar_{timestamp}.{ext}
';