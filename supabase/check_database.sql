/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/check_database.sql
 * Description: Quick check of current database state
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'wiki_%'
ORDER BY table_name;

-- Check wiki_events columns (looking for view_count)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wiki_events'
ORDER BY ordinal_position;

-- Check wiki_locations columns (looking for view_count)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wiki_locations'
ORDER BY ordinal_position;

-- Count records in each table
SELECT
  'wiki_guides' as table_name,
  COUNT(*) as record_count
FROM wiki_guides
UNION ALL
SELECT
  'wiki_categories' as table_name,
  COUNT(*) as record_count
FROM wiki_categories
UNION ALL
SELECT
  'wiki_events' as table_name,
  COUNT(*) as record_count
FROM wiki_events
UNION ALL
SELECT
  'wiki_locations' as table_name,
  COUNT(*) as record_count
FROM wiki_locations
UNION ALL
SELECT
  'wiki_guide_categories' as table_name,
  COUNT(*) as record_count
FROM wiki_guide_categories;

-- Check if increment_view_count function exists
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'increment_view_count';
