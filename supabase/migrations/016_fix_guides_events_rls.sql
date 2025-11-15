/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/011_fix_guides_events_rls.sql
 * Description: Add missing RLS SELECT policies for wiki_guides, wiki_events, and wiki_locations tables
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-15
 *
 * Issue: RLS was enabled on wiki_guides, wiki_events, and wiki_locations but no policies existed,
 * causing API to return empty arrays while Studio showed data (service role access).
 *
 * Solution: Add SELECT policies allowing published content to be viewed by everyone.
 */

-- Add SELECT policy for wiki_guides
-- Allows anyone to view published guides
CREATE POLICY "Published guides are viewable by everyone"
  ON wiki_guides
  FOR SELECT
  USING (status = 'published');

-- Add SELECT policy for wiki_events
-- Allows anyone to view published events
CREATE POLICY "Published events are viewable by everyone"
  ON wiki_events
  FOR SELECT
  USING (status = 'published');

-- Add SELECT policy for wiki_locations
-- Allows anyone to view published locations
CREATE POLICY "Published locations are viewable by everyone"
  ON wiki_locations
  FOR SELECT
  USING (status = 'published');

-- Verify policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('wiki_guides', 'wiki_events', 'wiki_locations')
ORDER BY tablename, policyname;
