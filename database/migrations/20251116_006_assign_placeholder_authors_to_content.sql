/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_006_assign_placeholder_authors_to_content.sql
 * Description: Assign random placeholder authors to existing wiki content (Step 3 of 3)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Randomly assign placeholder authors to guides, events, and locations where author_id is NULL
 * Safety: Only UPDATE operations - no destructive actions
 * Run Order: Run this THIRD (after 20251116_004 and 20251116_005)
 * Prerequisites:
 *   - 20251116_004_create_placeholder_auth_users.sql must be run first
 *   - 20251116_005_create_placeholder_public_profiles.sql must be run second
 */

-- ============================================================================
-- Assign Random Authors to Wiki Guides
-- ============================================================================

DO $$
DECLARE
  author_ids uuid[] := ARRAY[
    '11111111-1111-1111-1111-111111111111'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    '66666666-6666-6666-6666-666666666666'::uuid,
    '77777777-7777-7777-7777-777777777777'::uuid,
    '88888888-8888-8888-8888-888888888888'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
    'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid
  ];
  guide_record RECORD;
  random_author uuid;
BEGIN
  -- Assign random author to each guide where author_id is NULL
  FOR guide_record IN SELECT id, title FROM public.wiki_guides WHERE author_id IS NULL
  LOOP
    -- Pick random author from array
    random_author := author_ids[1 + floor(random() * array_length(author_ids, 1))::int];

    -- Update guide with random author
    UPDATE public.wiki_guides
    SET
      author_id = random_author,
      updated_at = NOW()
    WHERE id = guide_record.id;

    RAISE NOTICE 'Assigned author % to guide: %', random_author, guide_record.title;
  END LOOP;
END $$;

-- ============================================================================
-- Assign Random Authors to Wiki Events
-- ============================================================================

DO $$
DECLARE
  author_ids uuid[] := ARRAY[
    '11111111-1111-1111-1111-111111111111'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    '66666666-6666-6666-6666-666666666666'::uuid,
    '77777777-7777-7777-7777-777777777777'::uuid,
    '88888888-8888-8888-8888-888888888888'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
    'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid
  ];
  event_record RECORD;
  random_author uuid;
BEGIN
  -- Assign random author to each event where author_id is NULL
  FOR event_record IN SELECT id, title FROM public.wiki_events WHERE author_id IS NULL
  LOOP
    -- Pick random author from array
    random_author := author_ids[1 + floor(random() * array_length(author_ids, 1))::int];

    -- Update event with random author
    UPDATE public.wiki_events
    SET
      author_id = random_author,
      updated_at = NOW()
    WHERE id = event_record.id;

    RAISE NOTICE 'Assigned author % to event: %', random_author, event_record.title;
  END LOOP;
END $$;

-- ============================================================================
-- Assign Random Authors to Wiki Locations
-- ============================================================================

DO $$
DECLARE
  author_ids uuid[] := ARRAY[
    '11111111-1111-1111-1111-111111111111'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    '66666666-6666-6666-6666-666666666666'::uuid,
    '77777777-7777-7777-7777-777777777777'::uuid,
    '88888888-8888-8888-8888-888888888888'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
    'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid
  ];
  location_record RECORD;
  random_author uuid;
BEGIN
  -- Assign random author to each location where author_id is NULL
  FOR location_record IN SELECT id, name FROM public.wiki_locations WHERE author_id IS NULL
  LOOP
    -- Pick random author from array
    random_author := author_ids[1 + floor(random() * array_length(author_ids, 1))::int];

    -- Update location with random author
    UPDATE public.wiki_locations
    SET
      author_id = random_author,
      updated_at = NOW()
    WHERE id = location_record.id;

    RAISE NOTICE 'Assigned author % to location: %', random_author, location_record.name;
  END LOOP;
END $$;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Verify guides have authors
SELECT
  COUNT(*) as guides_with_authors,
  (SELECT COUNT(*) FROM public.wiki_guides WHERE author_id IS NULL) as guides_without_authors
FROM public.wiki_guides
WHERE author_id IS NOT NULL;

-- Verify events have authors
SELECT
  COUNT(*) as events_with_authors,
  (SELECT COUNT(*) FROM public.wiki_events WHERE author_id IS NULL) as events_without_authors
FROM public.wiki_events
WHERE author_id IS NOT NULL;

-- Verify locations have authors
SELECT
  COUNT(*) as locations_with_authors,
  (SELECT COUNT(*) FROM public.wiki_locations WHERE author_id IS NULL) as locations_without_authors
FROM public.wiki_locations
WHERE author_id IS NOT NULL;

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- ✅ Step 3 Complete: Authors assigned to all wiki content
-- Summary of 004 Migration (all 3 steps):
--   ✅ Created 15 placeholder users in auth.users
--   ✅ Created 15 corresponding public profiles in public.users
--   ✅ Assigned random authors to wiki_guides where author_id was NULL
--   ✅ Assigned random authors to wiki_events where author_id was NULL
--   ✅ Assigned random authors to wiki_locations where author_id was NULL
--   ✅ No destructive operations performed (INSERT and UPDATE only)
