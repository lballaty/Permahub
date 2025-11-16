/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_010_add_terms_acceptance_tracking.sql
 * Description: Add terms and privacy policy acceptance tracking to users table
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Implement legal compliance by tracking when users accept Terms of Service
 *          and Privacy Policy. Users must accept current terms to login or edit content.
 *
 * Business Requirements:
 * - Users must explicitly accept Terms of Service before using the platform
 * - Users must explicitly accept Privacy Policy before using the platform
 * - Track which version of terms/privacy user accepted
 * - Track timestamp of acceptance for audit purposes
 * - Prevent login and content editing without acceptance
 *
 * Safety: ALTER TABLE operations with nullable columns for existing users
 */

-- ============================================================================
-- STEP 1: Add Terms Acceptance Columns
-- ============================================================================

-- Add column to track when user accepted Terms of Service
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

-- Add column to track which version of ToS user accepted
-- Format: "2025-01-01" (matches effective date in legal docs)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS terms_version TEXT;

-- Add column to track when user accepted Privacy Policy
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

-- Add column to track which version of Privacy Policy user accepted
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS privacy_version TEXT;

-- ============================================================================
-- STEP 2: Add Comments for Documentation
-- ============================================================================

COMMENT ON COLUMN public.users.terms_accepted_at IS 'Timestamp when user accepted Terms of Service (NULL if not accepted)';
COMMENT ON COLUMN public.users.terms_version IS 'Version of ToS accepted (e.g., "2025-01-01"). Must match current version for full access.';
COMMENT ON COLUMN public.users.privacy_accepted_at IS 'Timestamp when user accepted Privacy Policy (NULL if not accepted)';
COMMENT ON COLUMN public.users.privacy_version IS 'Version of Privacy Policy accepted (e.g., "2025-01-01"). Must match current version for full access.';

-- ============================================================================
-- STEP 3: Create Helper Function to Check Terms Acceptance
-- ============================================================================

-- Function to check if user has accepted current terms and privacy policy
CREATE OR REPLACE FUNCTION public.user_has_accepted_terms(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_terms_version TEXT := '2025-01-01';  -- Current ToS version
  current_privacy_version TEXT := '2025-01-01';  -- Current Privacy version
  user_terms_version TEXT;
  user_privacy_version TEXT;
BEGIN
  -- Get user's accepted versions
  SELECT terms_version, privacy_version
  INTO user_terms_version, user_privacy_version
  FROM public.users
  WHERE id = user_id;

  -- User must have accepted current versions of both
  RETURN (
    user_terms_version = current_terms_version AND
    user_privacy_version = current_privacy_version
  );
END;
$$;

COMMENT ON FUNCTION public.user_has_accepted_terms IS 'Returns true if user has accepted current versions of Terms of Service and Privacy Policy';

-- ============================================================================
-- STEP 4: Create Function to Record Terms Acceptance
-- ============================================================================

CREATE OR REPLACE FUNCTION public.accept_terms(
  user_id UUID,
  terms_version_param TEXT DEFAULT '2025-01-01',
  privacy_version_param TEXT DEFAULT '2025-01-01'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user's acceptance timestamp and version
  UPDATE public.users
  SET
    terms_accepted_at = NOW(),
    terms_version = terms_version_param,
    privacy_accepted_at = NOW(),
    privacy_version = privacy_version_param,
    updated_at = NOW()
  WHERE id = user_id;

  -- Log the acceptance for audit purposes
  RAISE NOTICE 'User % accepted Terms v% and Privacy v% at %',
    user_id,
    terms_version_param,
    privacy_version_param,
    NOW();
END;
$$;

COMMENT ON FUNCTION public.accept_terms IS 'Records user acceptance of Terms of Service and Privacy Policy with version tracking';

-- ============================================================================
-- STEP 5: Update RLS Policies for Content Creation (Enforcement)
-- ============================================================================

-- Drop existing insert policies on content tables if they exist
DROP POLICY IF EXISTS "Users can create guides" ON public.guides;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can create locations" ON public.locations;

-- Create NEW policies that REQUIRE terms acceptance
-- Policy for guides table
CREATE POLICY "Users who accepted terms can create guides"
  ON public.guides
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    public.user_has_accepted_terms(auth.uid())
  );

-- Policy for events table
CREATE POLICY "Users who accepted terms can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    public.user_has_accepted_terms(auth.uid())
  );

-- Policy for locations table
CREATE POLICY "Users who accepted terms can create locations"
  ON public.locations
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    public.user_has_accepted_terms(auth.uid())
  );

-- ============================================================================
-- STEP 6: Update RLS Policies for Content Editing (Enforcement)
-- ============================================================================

-- Drop existing update policies if they exist
DROP POLICY IF EXISTS "Users can update own guides" ON public.guides;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can update own locations" ON public.locations;

-- Create NEW update policies that REQUIRE terms acceptance
CREATE POLICY "Users who accepted terms can update own guides"
  ON public.guides
  FOR UPDATE
  USING (auth.uid() = created_by AND public.user_has_accepted_terms(auth.uid()))
  WITH CHECK (auth.uid() = created_by AND public.user_has_accepted_terms(auth.uid()));

CREATE POLICY "Users who accepted terms can update own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = created_by AND public.user_has_accepted_terms(auth.uid()))
  WITH CHECK (auth.uid() = created_by AND public.user_has_accepted_terms(auth.uid()));

CREATE POLICY "Users who accepted terms can update own locations"
  ON public.locations
  FOR UPDATE
  USING (auth.uid() = created_by AND public.user_has_accepted_terms(auth.uid()))
  WITH CHECK (auth.uid() = created_by AND public.user_has_accepted_terms(auth.uid()));

-- ============================================================================
-- STEP 7: Grant Execute Permissions on Functions
-- ============================================================================

-- Allow authenticated users to check and accept terms
GRANT EXECUTE ON FUNCTION public.user_has_accepted_terms(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_terms(UUID, TEXT, TEXT) TO authenticated;

-- ============================================================================
-- STEP 8: Create Index for Performance
-- ============================================================================

-- Index for quick lookups of users who haven't accepted terms
CREATE INDEX IF NOT EXISTS idx_users_terms_acceptance
ON public.users(terms_accepted_at, terms_version, privacy_accepted_at, privacy_version)
WHERE terms_accepted_at IS NULL OR privacy_accepted_at IS NULL;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show current schema
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name IN ('terms_accepted_at', 'terms_version', 'privacy_accepted_at', 'privacy_version')
ORDER BY column_name;

-- Check how many users have/haven't accepted terms
SELECT
  COUNT(*) FILTER (WHERE terms_accepted_at IS NOT NULL AND privacy_accepted_at IS NOT NULL) as users_accepted,
  COUNT(*) FILTER (WHERE terms_accepted_at IS NULL OR privacy_accepted_at IS NULL) as users_not_accepted,
  COUNT(*) as total_users
FROM public.users;

-- Show sample of users (first 3)
SELECT
  id,
  email,
  username,
  terms_accepted_at,
  terms_version,
  privacy_accepted_at,
  privacy_version
FROM public.users
LIMIT 3;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
  'Terms acceptance tracking added successfully' as status,
  '✅ Columns: terms_accepted_at, terms_version, privacy_accepted_at, privacy_version' as columns,
  '✅ Functions: user_has_accepted_terms(), accept_terms()' as functions,
  '✅ RLS Policies: Updated to enforce terms acceptance for content creation/editing' as enforcement,
  '✅ Indexes: Created for performance' as indexes,
  'Current version: 2025-01-01' as current_version;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- ✅ Terms acceptance tracking columns added
-- ✅ Helper functions created for checking and recording acceptance
-- ✅ RLS policies updated to enforce terms acceptance
-- ✅ Indexes created for performance
-- ✅ Permissions granted
--
-- NEXT STEPS:
-- 1. Update frontend signup flow to require terms acceptance checkbox
-- 2. Update frontend login flow to check if user has accepted current terms
-- 3. Show terms acceptance modal if user hasn't accepted or version is outdated
-- 4. Block content creation/editing UI for users without acceptance
-- 5. Test enforcement in frontend and backend
-- ============================================================================
