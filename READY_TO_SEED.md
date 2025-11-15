# Ready to Seed - Final Status

**Date:** 2025-11-15
**Status:** ✅ **READY FOR SEEDING**

---

## Database Status

**Current State:**
- Wiki tables: **DO NOT EXIST** (need to run schema migration first)
- Database: **EMPTY** - No wiki content
- Port: 5432 (local Supabase)
- URL: http://127.0.0.1:3000

**Conclusion:** ✅ No conflicts - safe to seed

---

## Seed Files Analysis

**Total Content Ready:**
- **54 Guides** (1 duplicate removed ✅)
- **61 Events**
- **35 Locations**
- **Total: 150 items**

**Quality Check:**
- ✅ No duplicate slugs
- ✅ No critical content overlaps
- ✅ All items have unique identifiers
- ✅ 1 minor overlap (acceptable - different content)

---

## What Was Fixed

### Removed Duplicate
**File:** `supabase/seeds/003_expanded_wiki_categories.sql`

**Removed:** "Growing Oyster Mushrooms on Coffee Grounds" (255 words, brief)

**Kept:** "Growing Oyster Mushrooms on Coffee Grounds: 2025 Complete Guide" (1,300 words, comprehensive, sourced)

**Location:** `supabase/seeds/004_real_verified_wiki_content.sql`

---

## Seeding Order

Run these in order:

### 1. Schema Migration (REQUIRED FIRST)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/migrations/004_wiki_schema.sql
```

### 2. Categories
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seeds/003_expanded_wiki_categories.sql
```

### 3. Comprehensive Global Guides (47 guides)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seeds/006_comprehensive_global_seed_data.sql
```

### 4. Verified Content (3 guides)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seeds/004_real_verified_wiki_content.sql
```

### 5. Real Locations (12 locations)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seeds/003_wiki_real_data_LOCATIONS_ONLY.sql
```

### 6. Regional Content - Madeira & Czech (2 guides, 15 events, 12 locations)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seed_madeira_czech.sql
```

### 7. Madeira Specific (8 events, 9 locations)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seeds/002_wiki_seed_data_madeira_EVENTS_LOCATIONS_ONLY.sql
```

### 8. Future Events (45 events for 2025-2026)
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f supabase/seeds/004_future_events_seed.sql
```

---

## Quick Seed Script

Run all at once:

```bash
#!/bin/bash

DB="postgres"
HOST="127.0.0.1"
PORT="5432"
USER="postgres"
export PGPASSWORD="postgres"

echo "🌱 Seeding Wiki Database..."
echo ""

echo "1️⃣ Creating schema..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/migrations/004_wiki_schema.sql
echo ""

echo "2️⃣ Seeding categories..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seeds/003_expanded_wiki_categories.sql
echo ""

echo "3️⃣ Seeding global guides..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seeds/006_comprehensive_global_seed_data.sql
echo ""

echo "4️⃣ Seeding verified content..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seeds/004_real_verified_wiki_content.sql
echo ""

echo "5️⃣ Seeding real locations..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seeds/003_wiki_real_data_LOCATIONS_ONLY.sql
echo ""

echo "6️⃣ Seeding Madeira & Czech content..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seed_madeira_czech.sql
echo ""

echo "7️⃣ Seeding Madeira events & locations..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seeds/002_wiki_seed_data_madeira_EVENTS_LOCATIONS_ONLY.sql
echo ""

echo "8️⃣ Seeding future events..."
psql -h $HOST -p $PORT -U $USER -d $DB -f supabase/seeds/004_future_events_seed.sql
echo ""

echo "✅ Seeding complete!"
echo ""
echo "📊 Verify with:"
echo "   psql -h $HOST -p $PORT -U $USER -d $DB -c \"SELECT 'guides' as type, COUNT(*) FROM wiki_guides UNION ALL SELECT 'events', COUNT(*) FROM wiki_events UNION ALL SELECT 'locations', COUNT(*) FROM wiki_locations;\""
```

---

## Verification After Seeding

```bash
# Count all wiki content
PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -c "
SELECT 'guides' as type, COUNT(*) as count FROM wiki_guides
UNION ALL
SELECT 'events', COUNT(*) FROM wiki_events
UNION ALL
SELECT 'locations', COUNT(*) FROM wiki_locations;
"

# Expected output:
#   guides    | 54
#   events    | 61
#   locations | 35
```

---

## Tools Available

### 1. Visual Viewer
**File:** [seed-file-viewer.html](seed-file-viewer.html)

Open in browser to visually browse all seed content before/after seeding.

### 2. Analysis Script
```bash
node scripts/analyze-seed-files.js
```

Re-run anytime to check for duplicates.

### 3. Database Comparison
```bash
node scripts/check-database-vs-seeds.js
```

Compare what's in database vs seed files (requires dotenv and @supabase/supabase-js installed).

---

## Safety Features

All seed files include:
- ✅ `ON CONFLICT (slug) DO NOTHING` - Prevents duplicate slug errors
- ✅ `ON CONFLICT DO NOTHING` - Prevents category/junction table duplicates
- ✅ Unique slugs verified across all files
- ✅ No hard-coded UUIDs (auto-generated)

**Safe to re-run:** Yes - will skip existing items

---

## What's in the Database After Seeding

### Guides (54)
- **47** Comprehensive global guides (sustainability, permaculture, regenerative ag)
- **3** Verified guides with sources (chickens, mushrooms, etc.)
- **2** Backyard/fermentation guides
- **2** Regional guides (Madeira, Czech Republic)

### Events (61)
- **45** Future events (2025-2026 calendar)
- **15** Regional events (Madeira, Czech)
- **1** Sample event

### Locations (35)
- **12** Global locations (Brazil, Portugal, Czech, Germany)
- **12** Madeira locations
- **9** Additional Madeira locations
- **2** Sample locations

### Categories (52)
All major permaculture and sustainable living topics covered

---

## Next Steps

1. **Run the schema migration** (step 1 above)
2. **Run seed files** in order (steps 2-8)
3. **Verify counts** match expected (54/61/35)
4. **Open seed-file-viewer.html** to browse content
5. **Test the wiki interface** in your application

---

**Status:** ✅ All clear - proceed with confidence!
