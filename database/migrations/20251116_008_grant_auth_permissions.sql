/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_008_grant_auth_permissions.sql
 * Description: Grant necessary permissions to supabase_auth_admin for OTP/Magic Link functionality
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Fix permission denied errors when Supabase Auth tries to create users
 *          or send magic links by granting access to notification_preferences table
 * Safety: Only GRANT operations - no destructive actions
 */

-- Grant permissions on notification_preferences table to auth admin
-- This is required for magic link and OTP authentication to work
GRANT ALL ON public.notification_preferences TO supabase_auth_admin;

-- Grant permissions on all sequences in public schema
-- This ensures auto-incrementing IDs work properly when auth creates records
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;

-- Grant permissions on users table (auth may need to verify user existence)
GRANT SELECT, INSERT, UPDATE ON public.users TO supabase_auth_admin;

-- Create RLS policy to allow supabase_auth_admin to bypass RLS on notification_preferences
-- This is required because auth admin needs to create default notification preferences for new users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notification_preferences'
    AND policyname = 'Auth admin can manage notification preferences'
  ) THEN
    CREATE POLICY "Auth admin can manage notification preferences"
      ON public.notification_preferences
      FOR ALL
      TO supabase_auth_admin
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Verification: Check granted permissions
DO $$
BEGIN
  RAISE NOTICE '✅ Permissions granted to supabase_auth_admin';
  RAISE NOTICE '   - notification_preferences: ALL';
  RAISE NOTICE '   - users: SELECT, INSERT, UPDATE';
  RAISE NOTICE '   - All sequences: USAGE, SELECT';
END $$;

-- Summary
SELECT
  'Auth permissions configured successfully' as status,
  COUNT(*) FILTER (WHERE grantee = 'supabase_auth_admin') as granted_privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public';

-- ✅ Migration Complete
-- Supabase Auth can now send magic links and create users without permission errors
