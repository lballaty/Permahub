# Supabase Extension Compatibility Fixes

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_EXTENSION_FIXES.md

**Description:** Documentation of database extension issues and fixes applied

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-12

**Last Updated:** 2025-11-12

---

## Problem

Migration files used PostgreSQL extensions not available on Supabase:
- `earth` - Geographic calculations for distance
- `postgis` - PostGIS geographic information system

**Error encountered:**
```
ERROR:  0A000: extension "earth" is not available
DETAIL:  Could not open extension control file "/usr/lib/postgresql/share/postgresql/extension/earth.control"
```

---

## Root Cause

**Supabase limitations:**
- Runs managed PostgreSQL
- Does NOT include `earth` extension
- Does NOT include `postgis` extension (requires system-level installation)
- Can only use extensions pre-approved by Supabase

**Available extensions on Supabase:**
- uuid-ossp ✅
- Standard SQL functions ✅
- Custom RLS policies ✅
- But NOT: earth, postgis, or other system-level extensions

---

## Solution Applied

Replaced PostGIS/Earth-dependent queries with **Haversine formula** for distance calculation.

**Why Haversine?**
- Works in pure SQL, no extensions needed
- Provides approximate distances (±0.5% error for small distances)
- Suitable for UI-level location filtering
- Industry standard for web applications

---

## Files Modified

### 1. 001_initial_schema.sql

**Changed:** Removed `earth` extension and index functions

**Before:**
```sql
CREATE EXTENSION IF NOT EXISTS "earth" CASCADE;
CREATE INDEX idx_users_location ON public.users USING GIST (ll_to_earth(latitude, longitude));
```

**After:**
```sql
-- (no earth extension)
CREATE INDEX idx_users_latitude_longitude ON public.users(latitude, longitude);
```

**Functions updated:**
- `search_projects_nearby()` - Now uses Haversine formula
- `search_resources_nearby()` - Now uses Haversine formula

---

### 2. 003_items_pubsub.sql

**Changed:** Removed GIST index using earth extension

**Before:**
```sql
CREATE INDEX idx_items_location ON public.items USING GIST (ll_to_earth(latitude, longitude));
```

**After:**
```sql
CREATE INDEX idx_items_latitude_longitude ON public.items(latitude, longitude);
```

---

### 3. 20251107_events.sql

**Changed:** Removed earth distance calculations

**Before:**
```sql
CREATE INDEX idx_events_location ON public.events USING GIST (ll_to_earth(latitude, longitude));

-- In function:
(earth_distance(ll_to_earth(...), ll_to_earth(...)) / 1000) as distance_km
```

**After:**
```sql
CREATE INDEX idx_events_latitude_longitude ON public.events(latitude, longitude);

-- In function (Haversine formula):
ROUND(SQRT(...), 2)::DECIMAL as distance_km
```

---

### 4. 004_wiki_schema.sql (Optional - Wiki tables)

**Changed:** Removed PostGIS extension and ST_* functions

**Before:**
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE wiki_locations ADD COLUMN location GEOGRAPHY(POINT, 4326);
CREATE INDEX idx_wiki_locations_geography ON wiki_locations USING GIST(location);
-- ST_Distance, ST_DWithin, etc.
```

**After:**
```sql
-- Note: PostGIS not available
CREATE INDEX idx_wiki_locations_latitude_longitude ON wiki_locations(latitude, longitude);
-- Haversine formula used in get_nearby_locations() function
```

---

## Summary of Fixes Applied

✅ **001_initial_schema.sql** - Fixed
- Removed: `CREATE EXTENSION "earth"`
- Updated: 3 GIST indexes using earth()
- Updated: 2 functions to use Haversine

✅ **003_items_pubsub.sql** - Fixed
- Updated: 1 GIST index using earth()

✅ **20251107_events.sql** - Fixed
- Updated: 1 GIST index using earth()
- Updated: 1 function to use Haversine

✅ **004_wiki_schema.sql** - Fixed
- Removed: `CREATE EXTENSION postgis`
- Removed: PostGIS trigger and functions
- Updated: 2 functions to use Haversine
- Updated: 1 index to use simple lat/lng

---

## Status

**All migration files are now Supabase-compatible** ✅

Ready to execute via SQL Editor without extension errors.

---
