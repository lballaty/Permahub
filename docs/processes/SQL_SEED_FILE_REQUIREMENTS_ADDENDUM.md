# SQL Seed File Requirements - Comprehensive Addendum

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md

**Description:** Complete SQL structure, status handling, and execution requirements for wiki seed files

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

**Version:** 1.0.0

---

## Table of Contents

1. [Status Field Requirements](#status-field-requirements)
2. [Table Structure Compliance](#table-structure-compliance)
3. [SQL Execution Guarantees](#sql-execution-guarantees)
4. [Common SQL Errors and Prevention](#common-sql-errors-and-prevention)
5. [Testing and Validation](#testing-and-validation)

---

## Status Field Requirements

### Overview

The `status` field controls content visibility and lifecycle across all wiki tables. Understanding status defaults and behavior is **CRITICAL** for proper content insertion.

### Status Values by Table

#### wiki_guides

**Schema Definition:**
```sql
status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
```

**Valid Values:**
- `'draft'` - **DEFAULT** - Not visible to public, creator only
- `'published'` - Visible to all users, shows in search/browse
- `'archived'` - Hidden from public view but preserved

**published_at Field:**
```sql
published_at TIMESTAMPTZ
```
- NOT auto-set (no DEFAULT)
- Should be set to `NOW()` when status = 'published'
- Remains NULL for draft content
- Used for "recently published" sorting

**Recommended INSERT for Public Content:**
```sql
INSERT INTO wiki_guides (
  title, slug, summary, content,
  status,
  published_at
) VALUES (
  'Guide Title',
  'guide-slug',
  'Summary here',
  E'Content here',
  'published',    -- Make immediately visible
  NOW()           -- Set publish timestamp
);
```

**Recommended INSERT for Draft Content:**
```sql
INSERT INTO wiki_guides (
  title, slug, summary, content,
  status
  -- published_at intentionally omitted (will be NULL)
) VALUES (
  'Guide Title',
  'guide-slug',
  'Summary here',
  E'Content here',
  'draft'    -- Not visible until published
);
```

#### wiki_events

**Schema Definition:**
```sql
status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed'))
```

**Valid Values:**
- `'draft'` - Not visible to public
- `'published'` - **DEFAULT** - Visible, accepting registrations
- `'cancelled'` - Event cancelled, shown with cancelled status
- `'completed'` - Event finished, shown in past events

**Key Difference:** Events default to 'published' (unlike guides which default to 'draft')

**Why?** Events are time-sensitive - typically added when already confirmed/public.

**Recommended INSERT for Future Event:**
```sql
INSERT INTO wiki_events (
  title, slug, description, event_date,
  status
) VALUES (
  'Workshop Title',
  'workshop-title-2026-05',
  'Workshop description',
  '2026-05-15',
  'published'    -- Or omit entirely (defaults to 'published')
);
```

**Recommended INSERT for Completed Event (Historical):**
```sql
INSERT INTO wiki_events (
  title, slug, description, event_date,
  status
) VALUES (
  'Past Workshop',
  'past-workshop-2024-03',
  'Workshop description',
  '2024-03-15',
  'completed'    -- Mark as already happened
);
```

#### wiki_locations

**Schema Definition:**
```sql
status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
```

**Valid Values:**
- `'draft'` - Not visible to public
- `'published'` - **DEFAULT** - Visible on map and in search
- `'archived'` - No longer active but preserved (e.g., farm closed)

**Recommended INSERT for Active Location:**
```sql
INSERT INTO wiki_locations (
  name, slug, description, latitude, longitude,
  status
) VALUES (
  'Location Name',
  'location-slug',
  'Description here',
  50.0755,
  14.4378,
  'published'    -- Or omit entirely (defaults to 'published')
);
```

### Status Decision Matrix

| Content Type | Default | Recommended for Seed Files | Reasoning |
|--------------|---------|---------------------------|-----------|
| **wiki_guides** | `'draft'` | `'published'` | Seed files are pre-verified, should be immediately visible |
| **wiki_events** | `'published'` | `'published'` | Events are typically confirmed before seeding |
| **wiki_locations** | `'published'` | `'published'` | Locations should be immediately discoverable |

**IMPORTANT:** Always explicitly set `status = 'published'` in seed files even when it's the default. This makes intent clear and prevents issues if defaults change.

---

## Table Structure Compliance

### Critical Schema Requirements

#### Auto-Generated Fields - DO NOT INCLUDE

These fields are automatically populated by PostgreSQL and should **NEVER** be included in INSERT statements:

**ALL TABLES:**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

❌ **WRONG - Including auto-generated fields:**
```sql
INSERT INTO wiki_guides (
  id,                    -- ❌ Will be auto-generated
  title,
  slug,
  created_at,            -- ❌ Will be auto-set to NOW()
  updated_at             -- ❌ Will be auto-set to NOW()
) VALUES (
  gen_random_uuid(),     -- ❌ Unnecessary
  'Title',
  'slug',
  NOW(),                 -- ❌ Redundant
  NOW()                  -- ❌ Redundant
);
```

✅ **CORRECT - Omit auto-generated fields:**
```sql
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status
) VALUES (
  'Title',
  'slug',
  'Summary',
  E'Content',
  'published'
);
-- id, created_at, updated_at generated automatically
```

#### Reference Fields - Usually NULL for Seed Data

**author_id Field:**
```sql
author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
```

- Present in: wiki_guides, wiki_events, wiki_locations
- References auth.users table (Supabase authentication)
- Should be NULL for seed data (no authenticated user context)
- Can be set later through application when user claims content

❌ **WRONG - Setting fake author_id:**
```sql
INSERT INTO wiki_guides (
  title, slug, summary, content,
  author_id
) VALUES (
  'Title', 'slug', 'Summary', E'Content',
  '00000000-0000-0000-0000-000000000000'  -- ❌ Fake UUID
);
```

✅ **CORRECT - Omit or explicitly NULL:**
```sql
-- Option 1: Omit entirely (defaults to NULL)
INSERT INTO wiki_guides (
  title, slug, summary, content, status
) VALUES (
  'Title', 'slug', 'Summary', E'Content', 'published'
);

-- Option 2: Explicit NULL
INSERT INTO wiki_guides (
  title, slug, summary, content, status, author_id
) VALUES (
  'Title', 'slug', 'Summary', E'Content', 'published', NULL
);
```

### Complete Field Lists

#### wiki_guides - Recommended INSERT Structure

```sql
INSERT INTO wiki_guides (
  -- REQUIRED FIELDS
  title,              -- TEXT NOT NULL (50-100 chars)
  slug,               -- TEXT NOT NULL UNIQUE (lowercase-hyphen)
  summary,            -- TEXT NOT NULL (100-150 chars)
  content,            -- TEXT NOT NULL (1000+ words, markdown)

  -- RECOMMENDED FIELDS
  status,             -- TEXT DEFAULT 'draft' → set to 'published'
  published_at,       -- TIMESTAMPTZ → set to NOW() when published

  -- OPTIONAL FIELDS
  featured_image,     -- TEXT (URL)
  view_count,         -- INTEGER DEFAULT 0 (can set or omit)
  allow_comments,     -- BOOLEAN DEFAULT true (can omit)
  allow_edits,        -- BOOLEAN DEFAULT true (can omit)
  notify_group        -- BOOLEAN DEFAULT false (can omit)

  -- OMIT: id, author_id, created_at, updated_at
) VALUES (
  'Guide Title Here',
  'guide-slug-here',
  'Brief summary 100-150 characters describing what readers will learn.',
  E'# Guide Title\n\n## Introduction\n\nFull markdown content...',
  'published',
  NOW()
  -- Omit optional fields unless specific values needed
);
```

#### wiki_events - Recommended INSERT Structure

```sql
INSERT INTO wiki_events (
  -- REQUIRED FIELDS
  title,              -- TEXT NOT NULL (30-80 chars)
  slug,               -- TEXT NOT NULL UNIQUE (include date: event-2026-05)
  description,        -- TEXT NOT NULL (300-1000 chars)
  event_date,         -- DATE NOT NULL (YYYY-MM-DD, future date)

  -- RECOMMENDED FIELDS
  start_time,         -- TIME (HH:MM:SS)
  end_time,           -- TIME (HH:MM:SS)
  location_name,      -- TEXT (venue name)
  location_address,   -- TEXT (full address)
  latitude,           -- DOUBLE PRECISION (decimal degrees)
  longitude,          -- DOUBLE PRECISION (decimal degrees)
  event_type,         -- TEXT (workshop/meetup/tour/course/workday)
  price,              -- NUMERIC(10,2) DEFAULT 0
  price_display,      -- TEXT (human-readable: "Free", "$25")
  registration_url,   -- TEXT (registration link)
  max_attendees,      -- INTEGER (capacity)
  status,             -- TEXT DEFAULT 'published' (can omit or set explicitly)

  -- OPTIONAL FIELDS
  featured_image,     -- TEXT (event photo URL)
  is_recurring,       -- BOOLEAN DEFAULT false
  recurrence_rule,    -- TEXT (RRULE format if recurring)
  current_attendees   -- INTEGER DEFAULT 0 (usually omit)

  -- OMIT: id, author_id, created_at, updated_at
) VALUES (
  'Workshop on Natural Building',
  'natural-building-workshop-2026-05',
  'Learn hands-on natural building techniques including cob, adobe, and earthbag construction. Suitable for beginners.',
  '2026-05-16',
  '09:00:00',
  '17:00:00',
  'Permaculture Farm Name',
  '123 Farm Road, City, Country',
  50.0755,
  14.4378,
  'workshop',
  25.00,
  '$25',
  'https://example.com/register',
  20,
  'published'
);
```

#### wiki_locations - Recommended INSERT Structure

```sql
INSERT INTO wiki_locations (
  -- REQUIRED FIELDS
  name,               -- TEXT NOT NULL (30-100 chars)
  slug,               -- TEXT NOT NULL UNIQUE
  description,        -- TEXT NOT NULL (400-1500 chars)
  latitude,           -- DOUBLE PRECISION NOT NULL
  longitude,          -- DOUBLE PRECISION NOT NULL

  -- RECOMMENDED FIELDS
  address,            -- TEXT (complete address)
  location_type,      -- TEXT (farm/garden/education/community/business)
  website,            -- TEXT (official URL)
  contact_email,      -- TEXT (public contact)
  contact_phone,      -- TEXT (public phone)
  tags,               -- TEXT[] (5-15 tags)
  status,             -- TEXT DEFAULT 'published' (can omit or set explicitly)

  -- OPTIONAL FIELDS
  featured_image,     -- TEXT (location photo URL)
  opening_hours       -- JSONB (structured hours)

  -- OMIT: id, author_id, created_at, updated_at
) VALUES (
  'Demonstration Farm',
  'demonstration-farm-location',
  'A working permaculture demonstration farm offering tours, workshops, and educational programs. Features food forest, aquaponics, natural building, and regenerative agriculture practices.',
  50.0755,
  14.4378,
  '123 Farm Road, Rural District, Country 12345',
  'farm',
  'https://demonstrationfarm.example.com',
  'info@demonstrationfarm.example.com',
  '+1-555-0123',
  ARRAY['permaculture', 'education', 'tours', 'food-forest', 'aquaponics', 'workshops'],
  'published'
);
```

---

## SQL Execution Guarantees

### Ensuring SQL Will Run Successfully

#### 1. Syntax Validation Checklist

Before executing any seed file:

- [ ] **Multi-line format** - Column list and values on separate lines
- [ ] **Proper escaping** - E'...' for newlines, doubled quotes for apostrophes
- [ ] **Semicolons** - Every statement ends with `;`
- [ ] **No auto-generated fields** - id, created_at, updated_at omitted
- [ ] **Valid status values** - Match CHECK constraints exactly
- [ ] **Unique slugs** - No duplicates across database or seed files
- [ ] **Required fields present** - All NOT NULL fields included
- [ ] **Data types correct** - Strings quoted, numbers unquoted, arrays formatted
- [ ] **Date formats valid** - YYYY-MM-DD for dates, HH:MM:SS for times
- [ ] **Coordinate precision** - 4+ decimal places for lat/long

#### 2. Schema Compliance Validation

**Query to verify table structure:**
```sql
-- Check wiki_guides structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'wiki_guides'
ORDER BY ordinal_position;

-- Check wiki_events structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'wiki_events'
ORDER BY ordinal_position;

-- Check wiki_locations structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'wiki_locations'
ORDER BY ordinal_position;
```

**Always verify against actual schema before mass insert!**

#### 3. Constraint Validation

**Check constraint violations BEFORE insertion:**

```sql
-- Check slug uniqueness (guides)
SELECT slug, COUNT(*) as count
FROM wiki_guides
WHERE slug IN ('new-slug-1', 'new-slug-2', 'new-slug-3')
GROUP BY slug
HAVING COUNT(*) > 0;
-- If returns rows: slug already exists, choose different slug

-- Check status values are valid
SELECT 'Valid' WHERE 'published' IN ('draft', 'published', 'archived');
-- Should return 'Valid'

-- Check date is in future (for events)
SELECT '2026-05-16'::DATE > CURRENT_DATE as is_future;
-- Should return TRUE for future events

-- Check coordinates are in valid range
SELECT
  latitude BETWEEN -90 AND 90 as lat_valid,
  longitude BETWEEN -180 AND 180 as lon_valid
FROM (VALUES (50.0755::DOUBLE PRECISION, 14.4378::DOUBLE PRECISION)) AS t(latitude, longitude);
-- Both should return TRUE
```

#### 4. Transaction Safety

**Always use transactions for seed file execution:**

```sql
BEGIN;

-- Insert guides
INSERT INTO wiki_guides (...) VALUES (...);
INSERT INTO wiki_guides (...) VALUES (...);

-- Link categories
DO $$
DECLARE
  guide_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'guide-slug';
  INSERT INTO wiki_guide_categories (guide_id, category_id)
  VALUES (guide_id, (SELECT id FROM wiki_categories WHERE slug = 'category-slug'));
END $$;

-- Insert events
INSERT INTO wiki_events (...) VALUES (...);

-- Insert locations
INSERT INTO wiki_locations (...) VALUES (...);

-- Verify inserts worked
SELECT COUNT(*) FROM wiki_guides WHERE slug IN ('slug1', 'slug2');
SELECT COUNT(*) FROM wiki_events WHERE slug IN ('event-slug1');
SELECT COUNT(*) FROM wiki_locations WHERE slug IN ('location-slug1');

-- If all looks good:
COMMIT;

-- If issues found:
-- ROLLBACK;
```

**Benefits:**
- All inserts succeed or all fail (atomic)
- Can verify before committing
- Easy rollback on error
- Database never in partial state

---

## Common SQL Errors and Prevention

### Error 1: Syntax Error - Unescaped Quote

**Error Message:**
```
ERROR: syntax error at or near "s"
LINE 3: 'Farmer's Guide to Composting',
                 ^
```

**Cause:** Single quote inside string not escaped

❌ **WRONG:**
```sql
title = 'Farmer's Guide'
```

✅ **CORRECT:**
```sql
title = 'Farmer''s Guide'  -- Doubled quote
-- OR
title = E'Farmer\'s Guide'  -- Escaped quote (with E prefix)
```

### Error 2: Check Constraint Violation - Invalid Status

**Error Message:**
```
ERROR: new row for relation "wiki_guides" violates check constraint "wiki_guides_status_check"
DETAIL: Failing row contains (..., active, ...).
```

**Cause:** Status value not in CHECK constraint list

❌ **WRONG:**
```sql
status = 'active'  -- Not valid, must be draft/published/archived
```

✅ **CORRECT:**
```sql
-- For wiki_guides:
status = 'published'  -- OR 'draft' OR 'archived'

-- For wiki_events:
status = 'published'  -- OR 'draft' OR 'cancelled' OR 'completed'

-- For wiki_locations:
status = 'published'  -- OR 'draft' OR 'archived'
```

### Error 3: Unique Constraint Violation - Duplicate Slug

**Error Message:**
```
ERROR: duplicate key value violates unique constraint "wiki_guides_slug_key"
DETAIL: Key (slug)=(composting-basics) already exists.
```

**Cause:** Slug already exists in database

**Prevention:**
```sql
-- Check BEFORE inserting
SELECT id, title, slug FROM wiki_guides WHERE slug = 'composting-basics';

-- If exists, choose different slug:
'composting-basics-2025'
'composting-basics-beginners'
'composting-basics-advanced'
```

### Error 4: Not-Null Constraint Violation - Missing Required Field

**Error Message:**
```
ERROR: null value in column "summary" violates not-null constraint
DETAIL: Failing row contains (..., null, ...).
```

**Cause:** Required field omitted from INSERT

❌ **WRONG:**
```sql
INSERT INTO wiki_guides (title, slug, content, status)  -- Missing summary
VALUES ('Title', 'slug', E'Content', 'published');
```

✅ **CORRECT:**
```sql
INSERT INTO wiki_guides (title, slug, summary, content, status)
VALUES ('Title', 'slug', 'Summary here', E'Content', 'published');
```

### Error 5: Type Mismatch - Wrong Data Type

**Error Message:**
```
ERROR: invalid input syntax for type double precision: "not a number"
```

**Cause:** String provided where number expected

❌ **WRONG:**
```sql
latitude = 'fifty degrees'
price = 'twenty dollars'
```

✅ **CORRECT:**
```sql
latitude = 50.0755
price = 20.00
```

### Error 6: Foreign Key Violation - Category Doesn't Exist

**Error Message:**
```
ERROR: insert or update on table "wiki_guide_categories" violates foreign key constraint
DETAIL: Key (category_id)=(...) is not present in table "wiki_categories".
```

**Cause:** Trying to link to non-existent category

**Prevention:**
```sql
-- Check category exists BEFORE linking
SELECT id, slug FROM wiki_categories WHERE slug = 'permaculture-design';

-- If category doesn't exist, create it first or use different category
```

### Error 7: Date Format Error

**Error Message:**
```
ERROR: invalid input syntax for type date: "16-05-2026"
```

**Cause:** Wrong date format

❌ **WRONG:**
```sql
event_date = '16-05-2026'  -- DD-MM-YYYY
event_date = '05/16/2026'  -- MM/DD/YYYY
```

✅ **CORRECT:**
```sql
event_date = '2026-05-16'  -- YYYY-MM-DD (ISO format)
```

---

## Testing and Validation

### Pre-Execution Testing

#### Test 1: Syntax Validation (Dry Run)

```bash
# Test SQL file syntax without executing
psql "postgresql://postgres:postgres@localhost:54322/postgres" \
  --set ON_ERROR_STOP=on \
  --single-transaction \
  --dry-run \
  -f supabase/to-be-seeded/004_future_events_seed.sql

# If syntax errors exist, will report them
# If successful, nothing will be inserted (dry run)
```

#### Test 2: Transaction Test (Rollback)

```sql
-- Execute in transaction, verify, then rollback
BEGIN;

-- Run INSERT statements
\i supabase/to-be-seeded/004_future_events_seed.sql

-- Verify counts
SELECT 'Guides' as type, COUNT(*) as inserted FROM wiki_guides WHERE created_at > NOW() - INTERVAL '1 minute';
SELECT 'Events' as type, COUNT(*) as inserted FROM wiki_events WHERE created_at > NOW() - INTERVAL '1 minute';
SELECT 'Locations' as type, COUNT(*) as inserted FROM wiki_locations WHERE created_at > NOW() - INTERVAL '1 minute';

-- Check sample content
SELECT id, title, slug, status FROM wiki_guides ORDER BY created_at DESC LIMIT 3;

-- Rollback to undo (for testing)
ROLLBACK;
-- OR commit if everything looks good:
-- COMMIT;
```

#### Test 3: Duplicate Detection

```bash
# Run duplicate checker before inserting
npm run check:duplicates
npm run check:duplicates:guides
npm run check:duplicates:events
npm run check:duplicates:locations
```

#### Test 4: Automated Validation

```bash
# Verify seed file structure
npm run verify:seed:file supabase/to-be-seeded/new_seed_file.sql

# Check specific content type
node scripts/verify-seed-file.js --file=new_seed_file.sql --type=guides
```

### Post-Execution Verification

#### Verification Queries

```sql
-- Verify guides inserted correctly
SELECT
  id,
  title,
  slug,
  status,
  LENGTH(content) as content_length,
  published_at,
  created_at
FROM wiki_guides
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;

-- Verify events inserted correctly
SELECT
  id,
  title,
  slug,
  event_date,
  status,
  location_name,
  latitude,
  longitude
FROM wiki_events
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;

-- Verify locations inserted correctly
SELECT
  id,
  name,
  slug,
  location_type,
  status,
  latitude,
  longitude,
  array_length(tags, 1) as tag_count
FROM wiki_locations
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;

-- Verify category linkages
SELECT
  g.title,
  g.slug,
  c.name as category,
  c.slug as category_slug
FROM wiki_guides g
JOIN wiki_guide_categories gc ON g.id = gc.guide_id
JOIN wiki_categories c ON gc.category_id = c.id
WHERE g.created_at > NOW() - INTERVAL '5 minutes'
ORDER BY g.title, c.name;

-- Check for missing categories (guides without any category)
SELECT g.id, g.title, g.slug
FROM wiki_guides g
LEFT JOIN wiki_guide_categories gc ON g.id = gc.guide_id
WHERE gc.guide_id IS NULL
  AND g.created_at > NOW() - INTERVAL '5 minutes';
```

#### Status Verification

```sql
-- Verify published content is actually visible
SELECT
  'Guides' as type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
  SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
  SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived_count
FROM wiki_guides
WHERE created_at > NOW() - INTERVAL '5 minutes'

UNION ALL

SELECT
  'Events' as type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
  SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
FROM wiki_events
WHERE created_at > NOW() - INTERVAL '5 minutes'

UNION ALL

SELECT
  'Locations' as type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
  SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
  SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived_count
FROM wiki_locations
WHERE created_at > NOW() - INTERVAL '5 minutes';
```

### Rollback Procedures

If issues found after insertion:

```sql
-- Delete all content inserted in last 5 minutes
BEGIN;

-- Get list of what will be deleted (review first)
SELECT 'Guide' as type, id, title, slug FROM wiki_guides
WHERE created_at > NOW() - INTERVAL '5 minutes';

SELECT 'Event' as type, id, title, slug FROM wiki_events
WHERE created_at > NOW() - INTERVAL '5 minutes';

SELECT 'Location' as type, id, name, slug FROM wiki_locations
WHERE created_at > NOW() - INTERVAL '5 minutes';

-- If list looks correct, delete:
DELETE FROM wiki_guides WHERE created_at > NOW() - INTERVAL '5 minutes';
DELETE FROM wiki_events WHERE created_at > NOW() - INTERVAL '5 minutes';
DELETE FROM wiki_locations WHERE created_at > NOW() - INTERVAL '5 minutes';

-- Verify deletions
SELECT COUNT(*) FROM wiki_guides WHERE created_at > NOW() - INTERVAL '5 minutes';

-- Commit if satisfied
COMMIT;
-- Or rollback if need to undo
-- ROLLBACK;
```

---

## Quick Reference Card

### Status Values Quick Reference

| Table | DEFAULT | Valid Values | Seed Recommendation |
|-------|---------|-------------|-------------------|
| wiki_guides | `'draft'` | draft, published, archived | `'published'` + `NOW()` for published_at |
| wiki_events | `'published'` | draft, published, cancelled, completed | `'published'` (or omit) |
| wiki_locations | `'published'` | draft, published, archived | `'published'` (or omit) |

### Fields to ALWAYS Omit

```
id                 -- Auto-generated UUID
author_id          -- NULL for seed data
created_at         -- Auto-set to NOW()
updated_at         -- Auto-set to NOW()
```

### Fields to ALWAYS Include

**wiki_guides:**
- title, slug, summary, content, status, published_at (if published)

**wiki_events:**
- title, slug, description, event_date, status (recommended)

**wiki_locations:**
- name, slug, description, latitude, longitude, status (recommended)

### Pre-Flight Checklist

Before executing seed file:

- [ ] All slugs unique (check database + other seed files)
- [ ] All required fields present
- [ ] Auto-generated fields omitted
- [ ] Status values valid
- [ ] Dates in YYYY-MM-DD format
- [ ] Coordinates validated
- [ ] Strings properly escaped
- [ ] Categories exist (for guides)
- [ ] SQL syntax validated
- [ ] Tested in transaction with rollback

---

**End of Addendum**

**Related Documents:**
- [wiki-content-guide.md](../features/wiki-content-guide.md) - Main creation guide
- [CONTENT_CREATION_SYSTEM_REQUIREMENTS.md](CONTENT_CREATION_SYSTEM_REQUIREMENTS.md) - System requirements
- [WIKI_GUIDE_VERIFICATION_PROCESS.md](WIKI_GUIDE_VERIFICATION_PROCESS.md) - Verification process
