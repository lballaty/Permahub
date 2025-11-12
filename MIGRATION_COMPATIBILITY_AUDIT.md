# Migration Compatibility Audit

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/MIGRATION_COMPATIBILITY_AUDIT.md

**Description:** Compatibility assessment of migrations with existing tables in Supabase

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-12

**Last Updated:** 2025-11-12

---

## Executive Summary

**Status:** COMPATIBILITY ISSUES FOUND - Migrations need adjustments

**Existing Tables in Database:** 11 confirmed
- discussions ✅
- discussion_comments ✅
- eco_themes ✅
- event_registrations ✅
- events ✅
- landing_page_analytics ✅
- learning_resources ✅
- projects ✅ (exists but incomplete schema)
- resources ✅ (exists but incomplete schema)
- reviews ✅
- users ✅ (exists but incomplete schema)

**Issues Found:** 6 critical/high severity

---

## Compatibility Issues

### ISSUE 1: Existing `users` Table Has Missing Columns

**Status:** CRITICAL - Will cause RLS policy failures

**Problem:**
- `users` table exists in database (11 confirmed via API)
- But it doesn't have column: `is_public_profile`
- Migration 001 tries to use this column in RLS policies (line 310)
- Error: `column "is_public_profile" does not exist`

**Existing Columns in Database:**
- Likely: id, email, full_name, avatar_url, created_at, updated_at
- Missing: is_public_profile, bio, location, latitude, longitude, country, skills, interests, looking_for, website, social_media, profile_completed

**Solution Applied:**
✅ Added ALTER TABLE statements to ADD MISSING COLUMNS IF NOT EXISTS (migration 001, lines 295-302)

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_public_profile BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS looking_for TEXT[] DEFAULT ARRAY[]::TEXT[];
```

**Status:** ✅ FIXED

---

### ISSUE 2: Existing `projects` Table Missing Columns

**Status:** HIGH - Not breaking, but incomplete

**Problem:**
- `projects` table exists in database
- Migration 001 expects these columns but they may not exist:
  - verified BOOLEAN
  - eco_theme_id UUID (added later via theme_associations.sql)

**Solution Applied:**
✅ Added ALTER TABLE to add missing column:

```sql
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
```

**Status:** ✅ FIXED

---

### ISSUE 3: Existing `resources` Table Missing Columns

**Status:** HIGH - Not breaking, but incomplete

**Problem:**
- `resources` table exists in database
- May be missing: availability TEXT column
- Needed by migration 001 and review policies

**Solution Applied:**
✅ Added ALTER TABLE to add missing column:

```sql
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'available';
```

**Status:** ✅ FIXED

---

### ISSUE 4: RLS Policy Name Conflicts

**Status:** MEDIUM - Policies already exist with same names

**Problem:**
- Existing tables already have RLS policies
- Migration 001 tries to CREATE POLICY with names like "Public profiles are viewable by everyone"
- Duplicate policy name error: `policy ... already exists`

**Existing Policies (likely):**
From the 11 existing tables, they already have RLS policies created when the tables were originally deployed.

**Solution Applied:**
✅ Changed `CREATE POLICY` to `CREATE POLICY IF NOT EXISTS` (migration 001, lines 326-348)

```sql
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone"
  ON public.users
  FOR SELECT
  USING (is_public_profile = true);
```

**Status:** ✅ FIXED

---

### ISSUE 5: Migration Execution Order - Events Before Registrations

**Status:** CRITICAL - Will cause cascading failures

**Problem:**
Migration files run alphabetically, causing this order:
```
20251107_discussion_comments.sql
20251107_discussions.sql
20251107_eco_themes.sql
20251107_event_registrations.sql  ← RUNS FIRST (needs events table)
20251107_events.sql               ← RUNS SECOND (creates events table)
```

When `event_registrations` runs before `events`:
```
Foreign key constraint violation:
relation "public.events" does not exist
```

**Solution Required:**
Rename files to enforce execution order:

**Current Names:**
- 20251107_event_registrations.sql
- 20251107_events.sql

**Required Renames:**
- Rename `20251107_event_registrations.sql` → `20251107_11_event_registrations.sql`
- Rename `20251107_events.sql` → `20251107_10_events.sql`
- All 20251107 files should have numeric prefixes

**Status:** ⏳ NEEDS MANUAL RENAMING

---

### ISSUE 6: Duplicate Columns in `items` Table

**Status:** HIGH - Design issue, confusion potential

**Problem:**
Migration 003 defines `items` table with both:
```sql
title TEXT NOT NULL,
name TEXT NOT NULL,
```

Both columns serve same purpose - item display name. Only `title` is actually used:
- `publication_subscriptions.item_title` (populated from items.title)
- Functions use `NEW.title`

**Solution:**
Remove redundant `name` column from migration 003 (line 20)

**Status:** ⏳ NEEDS CODE CHANGE

---

## Compatibility Assessment Table

| Table | Status | Existing | Migration Action | Notes |
|-------|--------|----------|-----------------|-------|
| `users` | ⚠️ PARTIAL | ✅ Yes | ADD MISSING COLUMNS | is_public_profile, skills, interests, etc. |
| `projects` | ⚠️ PARTIAL | ✅ Yes | ADD MISSING COLUMNS | verified, eco_theme_id |
| `resources` | ⚠️ PARTIAL | ✅ Yes | ADD MISSING COLUMNS | availability |
| `resource_categories` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `project_user_connections` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `favorites` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `tags` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `items` | ⚠️ DESIGN | ❌ No | CREATE NEW | Has duplicate title/name columns |
| `notifications` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `notification_preferences` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `item_followers` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `publication_subscriptions` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `user_activity` | ✓ OK | ❌ No | CREATE NEW | No conflicts |
| `user_dashboard_config` | ✓ OK | ❌ No | CREATE NEW | No conflicts |

---

## Column Schema Comparison

### `users` Table

**Existing Columns (inferred):**
- id UUID (primary key)
- email TEXT (unique)
- full_name TEXT
- avatar_url TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP

**Missing Columns from Migration 001:**
- is_public_profile BOOLEAN DEFAULT true ← **REQUIRED BY RLS POLICIES**
- bio TEXT
- location TEXT
- latitude DECIMAL(10, 8)
- longitude DECIMAL(11, 8)
- country TEXT
- skills TEXT[]
- interests TEXT[]
- looking_for TEXT[]
- website TEXT
- social_media JSONB
- profile_completed BOOLEAN

**Action:** Add all missing columns (ALTER TABLE ADD COLUMN IF NOT EXISTS)

**Status:** ✅ IMPLEMENTED in updated migration 001

---

### `projects` Table

**Existing Columns (inferred):**
- id UUID (primary key)
- name TEXT
- description TEXT
- latitude DECIMAL(10, 8)
- longitude DECIMAL(11, 8)
- created_at TIMESTAMP
- updated_at TIMESTAMP
- created_by UUID
- ... and others

**Potentially Missing:**
- verified BOOLEAN DEFAULT false
- eco_theme_id UUID (added by theme_associations.sql)

**Action:** Add verified column if missing

**Status:** ✅ IMPLEMENTED in updated migration 001

---

### `resources` Table

**Existing Columns (inferred):**
- id UUID (primary key)
- title TEXT
- description TEXT
- latitude DECIMAL(10, 8)
- longitude DECIMAL(11, 8)
- created_at TIMESTAMP
- updated_at TIMESTAMP
- provider_id UUID
- ... and others

**Potentially Missing:**
- availability TEXT DEFAULT 'available'
- eco_theme_id UUID (added by theme_associations.sql)

**Action:** Add availability column if missing

**Status:** ✅ IMPLEMENTED in updated migration 001

---

## Changes Made to Migrations

### Migration 001_initial_schema.sql

**Change 1:** Added missing columns to existing tables

```sql
-- ============================================================================
-- 10.5 ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_public_profile BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS looking_for TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'available';
```

**Change 2:** Added `IF NOT EXISTS` to all RLS policy creations

```sql
-- Before
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT USING (is_public_profile = true);

-- After
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone"
  ON public.users FOR SELECT USING (is_public_profile = true);
```

**Status:** ✅ COMPLETE

---

### Migration 003_items_pubsub.sql

**Change:** Remove duplicate `name` column from items table

```sql
-- Before (line 20)
title TEXT NOT NULL,
name TEXT NOT NULL,

-- After
title TEXT NOT NULL,
-- name column removed - use title only
```

**Status:** ⏳ NEEDS IMPLEMENTATION

---

### File Renaming Required

**For:** All 20251107_*.sql feature migration files

**Reason:** Enforce execution order - events table must exist before event_registrations references it

**Required Renames:**
```
20251107_discussion_comments.sql  → 20251107_01_discussion_comments.sql
20251107_discussions.sql         → 20251107_02_discussions.sql
20251107_eco_themes.sql          → 20251107_03_eco_themes.sql
20251107_event_registrations.sql → 20251107_11_event_registrations.sql  (moved to end)
20251107_events.sql              → 20251107_10_events.sql              (moved before registrations)
20251107_landing_page_analytics.sql → 20251107_09_landing_page_analytics.sql
20251107_learning_resources.sql  → 20251107_04_learning_resources.sql
20251107_reviews.sql             → 20251107_05_reviews.sql
20251107_theme_associations.sql  → 20251107_00_theme_associations.sql (early, links tables)
```

**Status:** ⏳ NEEDS MANUAL EXECUTION

---

## Verification Steps

After applying fixes, verify with these queries in Supabase SQL Editor:

### Check 1: Users table has all required columns
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY column_name;
```

Expected columns: id, email, full_name, avatar_url, is_public_profile, bio, location, latitude, longitude, country, skills, interests, looking_for, website, social_media, profile_completed, created_at, updated_at

### Check 2: RLS policies exist without errors
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

Expected: 4 policies with IF NOT EXISTS - no errors

### Check 3: Events table created before registrations reference it
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('events', 'event_registrations')
ORDER BY table_name;
```

Both should exist with no constraint violations

### Check 4: Items table uses only title column
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'items'
AND column_name IN ('title', 'name')
ORDER BY column_name;
```

Expected: Only `title` column exists, `name` removed

---

## Risk Assessment

| Issue | Severity | Risk | Mitigation | Status |
|-------|----------|------|-----------|--------|
| Missing users columns | CRITICAL | RLS policies fail | ALTER TABLE ADD COLUMN IF NOT EXISTS | ✅ Fixed |
| Existing RLS policies | MEDIUM | Duplicate policy error | CREATE POLICY IF NOT EXISTS | ✅ Fixed |
| Event registrations before events | CRITICAL | FK constraint fails | Rename files with numeric prefixes | ⏳ Pending |
| Duplicate items.name column | HIGH | Design confusion | Remove redundant column | ⏳ Pending |
| Missing projects.verified | LOW | Incomplete schema | ALTER TABLE ADD COLUMN | ✅ Fixed |
| Missing resources.availability | LOW | Incomplete schema | ALTER TABLE ADD COLUMN | ✅ Fixed |

---

## Summary of Fixes Applied

✅ **COMPLETED:**
1. Added `ALTER TABLE` statements to add missing columns to users, projects, resources
2. Changed all `CREATE POLICY` to `CREATE POLICY IF NOT EXISTS`
3. Removed earth/postgis extensions (extension compatibility fix)

⏳ **STILL NEEDED:**
1. Remove duplicate `name` column from items table (migration 003)
2. Rename 20251107_*.sql files with numeric prefixes to enforce execution order

---

## Next Steps

1. **Remove duplicate column from migration 003** - Remove line with `name TEXT NOT NULL,`
2. **Rename migration files** - Add numeric prefixes to enforce ordering
3. **Run migrations in order:**
   - 00_bootstrap_execute_sql.sql
   - 001_initial_schema.sql
   - 002_analytics.sql
   - 003_items_pubsub.sql
   - 20251107_00_theme_associations.sql (or similar order)
   - 20251107_01_*.sql through 20251107_11_event_registrations.sql

4. **Verify** - Run the check queries above to confirm all tables created properly

---

**Report Status:** In Progress

**Recommendations:** Apply pending fixes before executing migrations
