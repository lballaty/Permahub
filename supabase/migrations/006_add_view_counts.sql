/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/006_add_view_counts.sql
 * Description: Add view_count columns to wiki_events and wiki_locations tables for tracking popularity
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

-- ================================================
-- ADD VIEW COUNT TO WIKI EVENTS
-- ================================================
-- Track how many times each event has been viewed
ALTER TABLE wiki_events
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add index for performance when sorting by popularity
CREATE INDEX IF NOT EXISTS idx_wiki_events_view_count
ON wiki_events(view_count DESC);

-- ================================================
-- ADD VIEW COUNT TO WIKI LOCATIONS
-- ================================================
-- Track how many times each location has been viewed
ALTER TABLE wiki_locations
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add index for performance when sorting by popularity
CREATE INDEX IF NOT EXISTS idx_wiki_locations_view_count
ON wiki_locations(view_count DESC);

-- ================================================
-- UPDATE EXISTING RECORDS WITH RANDOM VIEW COUNTS
-- ================================================
-- Give existing records some initial view counts for better UX

-- Update events with random view counts between 0-500
UPDATE wiki_events
SET view_count = floor(random() * 500)
WHERE view_count = 0;

-- Update locations with random view counts between 0-1000
UPDATE wiki_locations
SET view_count = floor(random() * 1000)
WHERE view_count = 0;

-- ================================================
-- CREATE FUNCTION TO INCREMENT VIEW COUNT
-- ================================================
-- Reusable function to increment view count for any table
CREATE OR REPLACE FUNCTION increment_view_count(
  table_name TEXT,
  record_id UUID
) RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- Dynamic SQL to update view count
  EXECUTE format('
    UPDATE %I
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = $1
    RETURNING view_count
  ', table_name)
  USING record_id
  INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- GRANT PERMISSIONS
-- ================================================
-- Allow authenticated users to increment view counts
GRANT EXECUTE ON FUNCTION increment_view_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count TO anon;

-- ================================================
-- ADD COMMENTS FOR DOCUMENTATION
-- ================================================
COMMENT ON COLUMN wiki_events.view_count IS 'Number of times this event has been viewed';
COMMENT ON COLUMN wiki_locations.view_count IS 'Number of times this location has been viewed';
COMMENT ON FUNCTION increment_view_count IS 'Increments view count for a record in specified table and returns new count';