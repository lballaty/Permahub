/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_012_contact_visibility_preferences.sql
 * Description: Add granular contact information visibility controls for user privacy
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

-- =====================================================
-- CONTACT VISIBILITY PREFERENCES MIGRATION
-- =====================================================
-- This migration implements granular privacy controls for user contact information
--
-- Changes:
-- 1. Add contact_phone field to users table
-- 2. Add contact_preferences JSONB column for granular privacy settings
-- 3. Set all existing users to private by default (is_public_profile = false)
-- 4. Create helper function to check contact field visibility
-- 5. Update RLS policies to respect contact preferences
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Add new columns to users table
-- =====================================================

-- Add phone number field
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Add contact preferences JSONB column with secure defaults
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS contact_preferences JSONB DEFAULT '{
  "email_visible": false,
  "phone_visible": false,
  "website_visible": true,
  "social_media_visible": true,
  "location_precision": "city",
  "show_contact_button": true
}'::jsonb;

COMMENT ON COLUMN public.users.contact_phone IS 'User contact phone number (optional)';
COMMENT ON COLUMN public.users.contact_preferences IS 'Granular privacy settings for contact information visibility';

-- =====================================================
-- STEP 2: Set all existing users to private by default
-- =====================================================

-- Update all existing users to have private profiles
-- Users must explicitly opt-in to make their profile public
UPDATE public.users
SET is_public_profile = false
WHERE is_public_profile IS NULL OR is_public_profile = true;

-- Ensure all existing users have contact preferences set
UPDATE public.users
SET contact_preferences = '{
  "email_visible": false,
  "phone_visible": false,
  "website_visible": true,
  "social_media_visible": true,
  "location_precision": "city",
  "show_contact_button": true
}'::jsonb
WHERE contact_preferences IS NULL;

-- =====================================================
-- STEP 3: Create helper function to check visibility
-- =====================================================

-- Function to determine if a specific contact field should be visible to a requesting user
CREATE OR REPLACE FUNCTION public.is_contact_field_visible(
  user_row public.users,
  field_name TEXT,
  requesting_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  field_visible BOOLEAN;
BEGIN
  -- Users can always see their own contact information
  IF user_row.id = requesting_user_id THEN
    RETURN true;
  END IF;

  -- If the profile is completely private, no contact info is visible
  IF user_row.is_public_profile = false THEN
    RETURN false;
  END IF;

  -- Check the granular contact preferences for this specific field
  -- Default to false if the preference is not set
  field_visible := COALESCE(
    (user_row.contact_preferences->field_name)::boolean,
    false
  );

  RETURN field_visible;
END;
$$;

COMMENT ON FUNCTION public.is_contact_field_visible IS 'Checks if a specific contact field should be visible to the requesting user based on privacy preferences';

-- =====================================================
-- STEP 4: Create function to get sanitized user data
-- =====================================================

-- Function to return user data with contact fields filtered by privacy preferences
CREATE OR REPLACE FUNCTION public.get_user_profile_with_privacy(
  target_user_id UUID,
  requesting_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  username TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  country TEXT,
  website TEXT,
  social_media JSONB,
  contact_phone TEXT,
  skills TEXT[],
  interests TEXT[],
  looking_for TEXT[],
  is_public_profile BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_record public.users%ROWTYPE;
  show_email BOOLEAN;
  show_phone BOOLEAN;
  show_website BOOLEAN;
  show_social BOOLEAN;
  location_precision TEXT;
BEGIN
  -- Fetch the user record
  SELECT * INTO user_record FROM public.users WHERE public.users.id = target_user_id;

  -- If user not found, return empty
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Determine visibility of each field
  show_email := public.is_contact_field_visible(user_record, 'email_visible', requesting_user_id);
  show_phone := public.is_contact_field_visible(user_record, 'phone_visible', requesting_user_id);
  show_website := public.is_contact_field_visible(user_record, 'website_visible', requesting_user_id);
  show_social := public.is_contact_field_visible(user_record, 'social_media_visible', requesting_user_id);
  location_precision := COALESCE(user_record.contact_preferences->>'location_precision', 'city');

  -- Return sanitized user data
  RETURN QUERY SELECT
    user_record.id,
    CASE WHEN show_email THEN user_record.email ELSE NULL END,
    user_record.username,
    user_record.full_name,
    user_record.bio,
    user_record.avatar_url,
    -- Handle location precision
    CASE
      WHEN user_record.id = requesting_user_id THEN user_record.location
      WHEN location_precision = 'exact' THEN user_record.location
      WHEN location_precision = 'city' THEN user_record.location
      WHEN location_precision = 'country' THEN user_record.country
      ELSE NULL
    END,
    -- Coordinates only visible at exact precision or to self
    CASE
      WHEN user_record.id = requesting_user_id THEN user_record.latitude
      WHEN location_precision = 'exact' THEN user_record.latitude
      ELSE NULL
    END,
    CASE
      WHEN user_record.id = requesting_user_id THEN user_record.longitude
      WHEN location_precision = 'exact' THEN user_record.longitude
      ELSE NULL
    END,
    user_record.country,
    CASE WHEN show_website THEN user_record.website ELSE NULL END,
    CASE WHEN show_social THEN user_record.social_media ELSE NULL END,
    CASE WHEN show_phone THEN user_record.contact_phone ELSE NULL END,
    user_record.skills,
    user_record.interests,
    user_record.looking_for,
    user_record.is_public_profile,
    user_record.created_at,
    user_record.updated_at;
END;
$$;

COMMENT ON FUNCTION public.get_user_profile_with_privacy IS 'Returns user profile data with contact fields filtered according to privacy preferences';

-- =====================================================
-- STEP 5: Update RLS policies for enhanced privacy
-- =====================================================

-- Drop existing SELECT policies that might conflict
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

-- Create new comprehensive SELECT policy
CREATE POLICY "Users can view profiles respecting privacy settings"
ON public.users
FOR SELECT
USING (
  -- Users can always see their own profile
  auth.uid() = id
  OR
  -- Others can only see public profiles
  (is_public_profile = true)
);

-- Note: The RLS policy allows viewing public profiles, but the application layer
-- should use get_user_profile_with_privacy() to filter contact fields appropriately

-- =====================================================
-- STEP 6: Create indexes for performance
-- =====================================================

-- Index on is_public_profile for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_is_public_profile
ON public.users(is_public_profile)
WHERE is_public_profile = true;

-- Index on contact_preferences for querying privacy settings
CREATE INDEX IF NOT EXISTS idx_users_contact_preferences
ON public.users USING gin(contact_preferences);

-- =====================================================
-- STEP 7: Add helpful triggers
-- =====================================================

-- Trigger to ensure new users get default contact preferences
CREATE OR REPLACE FUNCTION public.set_default_contact_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set default contact preferences if not provided
  IF NEW.contact_preferences IS NULL THEN
    NEW.contact_preferences := '{
      "email_visible": false,
      "phone_visible": false,
      "website_visible": true,
      "social_media_visible": true,
      "location_precision": "city",
      "show_contact_button": true
    }'::jsonb;
  END IF;

  -- Default to private profile
  IF NEW.is_public_profile IS NULL THEN
    NEW.is_public_profile := false;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_default_contact_preferences ON public.users;
CREATE TRIGGER trg_set_default_contact_preferences
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_contact_preferences();

COMMENT ON FUNCTION public.set_default_contact_preferences IS 'Ensures new users get secure default privacy settings';

-- =====================================================
-- VERIFICATION QUERIES (commented out - run manually)
-- =====================================================

-- Verify all users are now private
-- SELECT count(*) as total_users,
--        count(*) FILTER (WHERE is_public_profile = false) as private_users,
--        count(*) FILTER (WHERE is_public_profile = true) as public_users
-- FROM public.users;

-- Verify contact_preferences are set
-- SELECT count(*) as total_users,
--        count(*) FILTER (WHERE contact_preferences IS NOT NULL) as users_with_preferences
-- FROM public.users;

-- Test the visibility function
-- SELECT public.is_contact_field_visible(
--   (SELECT ROW(users.*) FROM users WHERE id = 'some-user-id'),
--   'email_visible',
--   auth.uid()
-- );

COMMIT;

-- =====================================================
-- ROLLBACK SCRIPT (if needed)
-- =====================================================

-- To rollback this migration:
-- BEGIN;
-- DROP TRIGGER IF EXISTS trg_set_default_contact_preferences ON public.users;
-- DROP FUNCTION IF EXISTS public.set_default_contact_preferences();
-- DROP FUNCTION IF EXISTS public.get_user_profile_with_privacy(UUID, UUID);
-- DROP FUNCTION IF EXISTS public.is_contact_field_visible(public.users, TEXT, UUID);
-- DROP INDEX IF EXISTS idx_users_contact_preferences;
-- DROP INDEX IF EXISTS idx_users_is_public_profile;
-- DROP POLICY IF EXISTS "Users can view profiles respecting privacy settings" ON public.users;
-- ALTER TABLE public.users DROP COLUMN IF EXISTS contact_preferences;
-- ALTER TABLE public.users DROP COLUMN IF EXISTS contact_phone;
-- COMMIT;
