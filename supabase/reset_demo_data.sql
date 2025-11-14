/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/reset_demo_data.sql
 * Description: Reset demo data with realistic staggered dates and zero view counts
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

BEGIN;

-- ================================================
-- RESET VIEW COUNTS TO ZERO
-- ================================================
UPDATE wiki_guides SET view_count = 0;
UPDATE wiki_events SET view_count = 0;
UPDATE wiki_locations SET view_count = 0;

-- ================================================
-- SET STAGGERED PUBLISHED_AT DATES FOR GUIDES
-- Starting 6 months ago, 1 day intervals
-- ================================================
WITH numbered_guides AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as row_num
  FROM wiki_guides
)
UPDATE wiki_guides g
SET published_at = NOW() - INTERVAL '6 months' + (ng.row_num || ' days')::INTERVAL
FROM numbered_guides ng
WHERE g.id = ng.id;

-- ================================================
-- SET STAGGERED PUBLISHED_AT DATES FOR EVENTS
-- Starting 6 months ago, 1 day intervals
-- ================================================
WITH numbered_events AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as row_num
  FROM wiki_events
)
UPDATE wiki_events e
SET published_at = NOW() - INTERVAL '6 months' + (ne.row_num || ' days')::INTERVAL
FROM numbered_events ne
WHERE e.id = ne.id;

-- ================================================
-- VERIFICATION REPORT
-- ================================================
DO $$
DECLARE
  guides_count INTEGER;
  events_count INTEGER;
  locations_count INTEGER;
  earliest_guide_date TIMESTAMP;
  latest_guide_date TIMESTAMP;
  earliest_event_date TIMESTAMP;
  latest_event_date TIMESTAMP;
BEGIN
  SELECT COUNT(*), MIN(published_at), MAX(published_at)
  INTO guides_count, earliest_guide_date, latest_guide_date
  FROM wiki_guides;

  SELECT COUNT(*), MIN(published_at), MAX(published_at)
  INTO events_count, earliest_event_date, latest_event_date
  FROM wiki_events;

  SELECT COUNT(*) INTO locations_count FROM wiki_locations;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 DEMO DATA RESET COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Guides: % (all view_count = 0)', guides_count;
  RAISE NOTICE '  Earliest: %', earliest_guide_date;
  RAISE NOTICE '  Latest: %', latest_guide_date;
  RAISE NOTICE '';
  RAISE NOTICE 'Events: % (all view_count = 0)', events_count;
  RAISE NOTICE '  Earliest: %', earliest_event_date;
  RAISE NOTICE '  Latest: %', latest_event_date;
  RAISE NOTICE '';
  RAISE NOTICE 'Locations: % (all view_count = 0)', locations_count;
  RAISE NOTICE '========================================';
END $$;

COMMIT;
