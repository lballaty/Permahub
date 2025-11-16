/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_009_add_username_to_users.sql
 * Description: Add username field to users table for unique user identification
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Add username column to public.users table to allow users to have
 *          unique, human-readable identifiers separate from their email addresses
 * Safety: ALTER TABLE operations with backfill for existing users
 */

-- Add username column to public.users table (nullable initially for backfill)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS username TEXT;

-- Backfill existing users with username derived from email prefix
-- This ensures existing users have a username before we make it NOT NULL
UPDATE public.users
SET username = LOWER(REGEXP_REPLACE(SPLIT_PART(email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g'))
WHERE username IS NULL;

-- Make username unique and not null after backfill
ALTER TABLE public.users
ALTER COLUMN username SET NOT NULL;

-- Add unique constraint on username
ALTER TABLE public.users
ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Add constraint to validate username format (3-20 chars, alphanumeric, dash, underscore)
ALTER TABLE public.users
ADD CONSTRAINT users_username_format CHECK (
  username ~ '^[a-z0-9_-]{3,20}$'
);

-- Create index on username for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Update RLS policies to allow username visibility
-- Users can view usernames of other users (for @ mentions, etc.)
CREATE POLICY "Anyone can view usernames"
  ON public.users
  FOR SELECT
  USING (true);

-- Only users can update their own username
CREATE POLICY "Users can update own username"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add helpful comment
COMMENT ON COLUMN public.users.username IS 'Unique username for user identification (3-20 chars, lowercase alphanumeric, dash, underscore)';

-- Verification: Show sample usernames
SELECT
  id,
  email,
  username,
  full_name
FROM public.users
LIMIT 5;

-- Summary
SELECT
  'Username column added successfully' as status,
  COUNT(*) as total_users,
  COUNT(username) as users_with_username
FROM public.users;

-- ✅ Migration Complete
-- Username column added, existing users backfilled, constraints and indexes created
