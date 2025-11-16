/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_011_fix_anonymous_read_access.sql
 * Description: Fix RLS policies to allow anonymous users to read published guides, events, and locations
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Issue: Anonymous users cannot view individual guide/event/location pages because RLS policies
 *        require authentication. The current policies use auth.uid() which returns NULL for
 *        anonymous users, causing the permission check to fail.
 *
 * Solution: Separate the SELECT policies into two parts:
 *          1. Allow ALL users (including anonymous) to view published content
 *          2. Allow authors to view their own unpublished content (requires auth)
 */

-- Drop OLD problematic policies that mix anonymous and auth checks
DROP POLICY IF EXISTS "Published guides viewable by everyone" ON wiki_guides;
DROP POLICY IF EXISTS "Events viewable by everyone" ON wiki_events;
DROP POLICY IF EXISTS "Locations viewable by everyone" ON wiki_locations;

-- Drop any existing anonymous-only policies (we'll recreate them with correct names)
DROP POLICY IF EXISTS "Published guides are viewable by everyone" ON wiki_guides;
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON wiki_events;
DROP POLICY IF EXISTS "Published locations are viewable by everyone" ON wiki_locations;

-- GUIDES: Allow anonymous users to view published guides
CREATE POLICY "Anyone can view published guides"
  ON wiki_guides FOR SELECT
  USING (status = 'published');

-- GUIDES: Allow authors to view their own guides (including drafts)
CREATE POLICY "Authors can view their own guides"
  ON wiki_guides FOR SELECT
  USING (auth.uid() = author_id);

-- EVENTS: Allow anonymous users to view published/completed events
CREATE POLICY "Anyone can view published events"
  ON wiki_events FOR SELECT
  USING (status IN ('published', 'completed'));

-- EVENTS: Allow authors to view their own events (including drafts)
CREATE POLICY "Authors can view their own events"
  ON wiki_events FOR SELECT
  USING (auth.uid() = author_id);

-- LOCATIONS: Allow anonymous users to view published locations
CREATE POLICY "Anyone can view published locations"
  ON wiki_locations FOR SELECT
  USING (status = 'published');

-- LOCATIONS: Allow authors to view their own locations (including drafts)
CREATE POLICY "Authors can view their own locations"
  ON wiki_locations FOR SELECT
  USING (auth.uid() = author_id);
