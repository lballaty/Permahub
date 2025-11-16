/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_005_create_placeholder_public_profiles.sql
 * Description: Create public user profiles for placeholder users (Step 2 of 3)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Create public.users profiles corresponding to auth.users accounts
 * Safety: Only INSERT operations - no destructive actions
 * Run Order: Run this SECOND (after 20251116_004), then run 20251116_006
 * Prerequisite: 20251116_004_create_placeholder_auth_users.sql must be run first
 */

-- Insert corresponding public user profiles
INSERT INTO public.users (
  id,
  email,
  full_name,
  bio,
  is_public_profile,
  created_at,
  updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'sarah.chen@permahub.community',
    'Sarah Chen',
    'Composting expert with 10+ years experience in turning waste into black gold.',
    true,
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'marcus.green@permahub.community',
    'Marcus Green',
    'Water management specialist focused on swales, rainwater harvesting, and erosion control.',
    true,
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'elena.rodriguez@permahub.community',
    'Elena Rodriguez',
    'Food preservation guide specializing in lacto-fermentation and traditional techniques.',
    true,
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    'james.wilson@permahub.community',
    'James Wilson',
    'Soil health advocate passionate about regenerative agriculture and carbon sequestration.',
    true,
    NOW(),
    NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555'::uuid,
    'aisha.patel@permahub.community',
    'Aisha Patel',
    'Urban gardening expert bringing permaculture to city environments.',
    true,
    NOW(),
    NOW()
  ),
  (
    '66666666-6666-6666-6666-666666666666'::uuid,
    'carlos.mendez@permahub.community',
    'Carlos Mendez',
    'Agroforestry specialist with experience in tropical and temperate food forests.',
    true,
    NOW(),
    NOW()
  ),
  (
    '77777777-7777-7777-7777-777777777777'::uuid,
    'yuki.tanaka@permahub.community',
    'Yuki Tanaka',
    'Seed saving advocate preserving heirloom varieties for future generations.',
    true,
    NOW(),
    NOW()
  ),
  (
    '88888888-8888-8888-8888-888888888888'::uuid,
    'hannah.obrien@permahub.community',
    'Hannah O''Brien',
    'Regenerative farming pioneer transforming degraded land into thriving ecosystems.',
    true,
    NOW(),
    NOW()
  ),
  (
    '99999999-9999-9999-9999-999999999999'::uuid,
    'david.kim@permahub.community',
    'David Kim',
    'Natural building expert specializing in cob, straw bale, and earthbag construction.',
    true,
    NOW(),
    NOW()
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'sofia.andersson@permahub.community',
    'Sofia Andersson',
    'Climate resilience consultant helping communities adapt to changing conditions.',
    true,
    NOW(),
    NOW()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'ahmed.hassan@permahub.community',
    'Ahmed Hassan',
    'Desert permaculture specialist working with arid and semi-arid ecosystems.',
    true,
    NOW(),
    NOW()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'emma.thompson@permahub.community',
    'Emma Thompson',
    'Community organizer connecting permaculture practitioners worldwide.',
    true,
    NOW(),
    NOW()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'raj.sharma@permahub.community',
    'Raj Sharma',
    'Tropical permaculture designer with projects across Southeast Asia.',
    true,
    NOW(),
    NOW()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
    'maria.silva@permahub.community',
    'Maria Silva',
    'Indigenous knowledge keeper sharing traditional ecological wisdom.',
    true,
    NOW(),
    NOW()
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
    'oliver.schmidt@permahub.community',
    'Oliver Schmidt',
    'Biodynamic farming practitioner integrating cosmic rhythms with agriculture.',
    true,
    NOW(),
    NOW()
  );

-- Verify public profiles created
SELECT
  COUNT(*) as total_public_profiles,
  'Public profiles created successfully' as status
FROM public.users
WHERE email LIKE '%@permahub.community';

-- ✅ Step 2 Complete: 15 public.users profiles created
-- Next: Run 20251116_006_assign_placeholder_authors_to_content.sql
