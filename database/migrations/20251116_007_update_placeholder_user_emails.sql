/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_007_update_placeholder_user_emails.sql
 * Description: Update placeholder user emails to use local test domains for Mailpit testing
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Change placeholder user emails from @permahub.community to local test domains
 *          so they work with local Mailpit SMTP testing
 * Safety: Only UPDATE operations - no destructive actions
 */

-- Update auth.users emails to use local test domains
UPDATE auth.users
SET
  email = 'sarah.chen@test.local',
  updated_at = NOW()
WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;

UPDATE auth.users
SET
  email = 'marcus.green@test.local',
  updated_at = NOW()
WHERE id = '22222222-2222-2222-2222-222222222222'::uuid;

UPDATE auth.users
SET
  email = 'elena.rodriguez@test.local',
  updated_at = NOW()
WHERE id = '33333333-3333-3333-3333-333333333333'::uuid;

UPDATE auth.users
SET
  email = 'james.wilson@test.local',
  updated_at = NOW()
WHERE id = '44444444-4444-4444-4444-444444444444'::uuid;

UPDATE auth.users
SET
  email = 'aisha.patel@test.local',
  updated_at = NOW()
WHERE id = '55555555-5555-5555-5555-555555555555'::uuid;

UPDATE auth.users
SET
  email = 'carlos.mendez@test.local',
  updated_at = NOW()
WHERE id = '66666666-6666-6666-6666-666666666666'::uuid;

UPDATE auth.users
SET
  email = 'yuki.tanaka@test.local',
  updated_at = NOW()
WHERE id = '77777777-7777-7777-7777-777777777777'::uuid;

UPDATE auth.users
SET
  email = 'hannah.obrien@test.local',
  updated_at = NOW()
WHERE id = '88888888-8888-8888-8888-888888888888'::uuid;

UPDATE auth.users
SET
  email = 'david.kim@test.local',
  updated_at = NOW()
WHERE id = '99999999-9999-9999-9999-999999999999'::uuid;

UPDATE auth.users
SET
  email = 'sofia.andersson@test.local',
  updated_at = NOW()
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;

UPDATE auth.users
SET
  email = 'ahmed.hassan@test.local',
  updated_at = NOW()
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;

UPDATE auth.users
SET
  email = 'emma.thompson@test.local',
  updated_at = NOW()
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid;

UPDATE auth.users
SET
  email = 'raj.sharma@test.local',
  updated_at = NOW()
WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid;

UPDATE auth.users
SET
  email = 'maria.silva@test.local',
  updated_at = NOW()
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid;

UPDATE auth.users
SET
  email = 'oliver.schmidt@test.local',
  updated_at = NOW()
WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid;

-- Update corresponding public.users emails to match
UPDATE public.users
SET
  email = 'sarah.chen@test.local',
  updated_at = NOW()
WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;

UPDATE public.users
SET
  email = 'marcus.green@test.local',
  updated_at = NOW()
WHERE id = '22222222-2222-2222-2222-222222222222'::uuid;

UPDATE public.users
SET
  email = 'elena.rodriguez@test.local',
  updated_at = NOW()
WHERE id = '33333333-3333-3333-3333-333333333333'::uuid;

UPDATE public.users
SET
  email = 'james.wilson@test.local',
  updated_at = NOW()
WHERE id = '44444444-4444-4444-4444-444444444444'::uuid;

UPDATE public.users
SET
  email = 'aisha.patel@test.local',
  updated_at = NOW()
WHERE id = '55555555-5555-5555-5555-555555555555'::uuid;

UPDATE public.users
SET
  email = 'carlos.mendez@test.local',
  updated_at = NOW()
WHERE id = '66666666-6666-6666-6666-666666666666'::uuid;

UPDATE public.users
SET
  email = 'yuki.tanaka@test.local',
  updated_at = NOW()
WHERE id = '77777777-7777-7777-7777-777777777777'::uuid;

UPDATE public.users
SET
  email = 'hannah.obrien@test.local',
  updated_at = NOW()
WHERE id = '88888888-8888-8888-8888-888888888888'::uuid;

UPDATE public.users
SET
  email = 'david.kim@test.local',
  updated_at = NOW()
WHERE id = '99999999-9999-9999-9999-999999999999'::uuid;

UPDATE public.users
SET
  email = 'sofia.andersson@test.local',
  updated_at = NOW()
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;

UPDATE public.users
SET
  email = 'ahmed.hassan@test.local',
  updated_at = NOW()
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;

UPDATE public.users
SET
  email = 'emma.thompson@test.local',
  updated_at = NOW()
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid;

UPDATE public.users
SET
  email = 'raj.sharma@test.local',
  updated_at = NOW()
WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid;

UPDATE public.users
SET
  email = 'maria.silva@test.local',
  updated_at = NOW()
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid;

UPDATE public.users
SET
  email = 'oliver.schmidt@test.local',
  updated_at = NOW()
WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid;

-- Verification: Show all updated emails
SELECT
  u.full_name,
  u.email as public_email,
  au.email as auth_email
FROM public.users u
LEFT JOIN auth.users au ON au.id = u.id
WHERE u.email LIKE '%@test.local'
ORDER BY u.full_name;

-- Summary
SELECT
  COUNT(*) as total_test_users,
  'Test users updated successfully' as status
FROM auth.users
WHERE email LIKE '%@test.local';

-- ✅ Migration Complete
-- All placeholder users now use @test.local emails that will work with Mailpit
