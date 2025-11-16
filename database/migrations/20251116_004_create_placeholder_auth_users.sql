/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_004_create_placeholder_auth_users.sql
 * Description: Create placeholder users in auth.users table (Step 1 of 3)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Create 15 placeholder authentication accounts for permaculture community members
 * Safety: Only INSERT operations - no destructive actions
 * Run Order: Run this FIRST, then 20251116_005, then 20251116_006
 */

-- Insert 15 placeholder users into auth.users
-- Using deterministic UUIDs for easy reference
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud
) VALUES
  -- User 1: Sarah Chen - Composting Expert
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'sarah.chen@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 2: Marcus Green - Water Management Specialist
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'marcus.green@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 3: Elena Rodriguez - Food Preservation Guide
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'elena.rodriguez@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 4: James Wilson - Soil Health Advocate
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'james.wilson@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 5: Aisha Patel - Urban Gardening Expert
  (
    '55555555-5555-5555-5555-555555555555'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'aisha.patel@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 6: Carlos Mendez - Agroforestry Specialist
  (
    '66666666-6666-6666-6666-666666666666'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'carlos.mendez@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 7: Yuki Tanaka - Seed Saving Advocate
  (
    '77777777-7777-7777-7777-777777777777'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'yuki.tanaka@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 8: Hannah O'Brien - Regenerative Farming
  (
    '88888888-8888-8888-8888-888888888888'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'hannah.obrien@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 9: David Kim - Natural Building Expert
  (
    '99999999-9999-9999-9999-999999999999'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'david.kim@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 10: Sofia Andersson - Climate Resilience
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'sofia.andersson@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 11: Ahmed Hassan - Desert Permaculture
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'ahmed.hassan@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 12: Emma Thompson - Community Organizer
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'emma.thompson@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 13: Raj Sharma - Tropical Permaculture
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'raj.sharma@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 14: Maria Silva - Indigenous Knowledge
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'maria.silva@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),

  -- User 15: Oliver Schmidt - Biodynamic Farming
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'oliver.schmidt@permahub.community',
    crypt('placeholder_password_change_me', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  );

-- Verify auth users created
SELECT
  COUNT(*) as total_placeholder_auth_users,
  'Auth users created successfully' as status
FROM auth.users
WHERE email LIKE '%@permahub.community';

-- ✅ Step 1 Complete: 15 auth.users created
-- Next: Run 20251116_005_create_placeholder_public_profiles.sql
