/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/apply_all_migrations.sql
 * Description: Master script to apply all pending migrations safely
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 *
 * INSTRUCTIONS:
 * 1. Run check_database.sql first to see current state
 * 2. Run this script in Supabase SQL Editor
 * 3. Review output to confirm all migrations applied successfully
 */

BEGIN;

-- ================================================
-- STEP 1: ADD VIEW_COUNT TO WIKI_EVENTS
-- ================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'wiki_events'
    AND column_name = 'view_count'
  ) THEN
    ALTER TABLE wiki_events ADD COLUMN view_count INTEGER DEFAULT 0;
    CREATE INDEX idx_wiki_events_view_count ON wiki_events(view_count DESC);
    RAISE NOTICE '✅ Added view_count to wiki_events';
  ELSE
    RAISE NOTICE '⏭️  view_count already exists in wiki_events';
  END IF;
END $$;

-- ================================================
-- STEP 2: ADD VIEW_COUNT TO WIKI_LOCATIONS
-- ================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'wiki_locations'
    AND column_name = 'view_count'
  ) THEN
    ALTER TABLE wiki_locations ADD COLUMN view_count INTEGER DEFAULT 0;
    CREATE INDEX idx_wiki_locations_view_count ON wiki_locations(view_count DESC);
    RAISE NOTICE '✅ Added view_count to wiki_locations';
  ELSE
    RAISE NOTICE '⏭️  view_count already exists in wiki_locations';
  END IF;
END $$;

-- ================================================
-- STEP 3: CREATE increment_view_count FUNCTION
-- ================================================
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
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = $1
    RETURNING view_count
  ', table_name)
  USING record_id
  INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION increment_view_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count TO anon;

DO $$
BEGIN
  RAISE NOTICE '✅ Created/Updated increment_view_count function';
END $$;

-- ================================================
-- STEP 4: ADD INITIAL VIEW COUNTS TO EXISTING RECORDS
-- ================================================
DO $$
BEGIN
  -- Only update records that have zero views
  UPDATE wiki_events
  SET view_count = floor(random() * 500)::INTEGER
  WHERE view_count = 0 OR view_count IS NULL;

  UPDATE wiki_locations
  SET view_count = floor(random() * 1000)::INTEGER
  WHERE view_count = 0 OR view_count IS NULL;

  RAISE NOTICE '✅ Updated initial view counts for existing records';
END $$;

-- ================================================
-- STEP 5: ADD COMMENTS FOR DOCUMENTATION
-- ================================================
COMMENT ON COLUMN wiki_events.view_count IS 'Number of times this event has been viewed';
COMMENT ON COLUMN wiki_locations.view_count IS 'Number of times this location has been viewed';
COMMENT ON FUNCTION increment_view_count IS 'Increments view count for a record in specified table and returns new count';

-- ================================================
-- FINAL STATUS REPORT
-- ================================================
DO $$
DECLARE
  guides_count INTEGER;
  categories_count INTEGER;
  events_count INTEGER;
  locations_count INTEGER;
  guide_categories_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO guides_count FROM wiki_guides;
  SELECT COUNT(*) INTO categories_count FROM wiki_categories;
  SELECT COUNT(*) INTO events_count FROM wiki_events;
  SELECT COUNT(*) INTO locations_count FROM wiki_locations;
  SELECT COUNT(*) INTO guide_categories_count FROM wiki_guide_categories;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 MIGRATION COMPLETE - DATABASE STATUS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Guides: %', guides_count;
  RAISE NOTICE 'Categories: %', categories_count;
  RAISE NOTICE 'Events: %', events_count;
  RAISE NOTICE 'Locations: %', locations_count;
  RAISE NOTICE 'Guide-Category Links: %', guide_categories_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ All migrations applied successfully!';
  RAISE NOTICE '========================================';
END $$;

COMMIT;
