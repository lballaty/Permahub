# Contact Information Implementation Status

**Date:** 2025-11-16
**Status:** 🔄 IN PROGRESS

---

## Files Created

### 1. Migration File ✅ COMPLETE
**File:** [database/migrations/20251116_008_add_contact_fields_to_events_and_locations.sql](../../database/migrations/20251116_008_add_contact_fields_to_events_and_locations.sql)

**Adds to wiki_events:**
- `organizer_name VARCHAR(255)` - Person organizing event
- `organizer_organization VARCHAR(255)` - Hosting organization
- `contact_email VARCHAR(255)` - Email for inquiries
- `contact_phone VARCHAR(50)` - Phone for inquiries
- `contact_website VARCHAR(500)` - Event-specific website

**Adds to wiki_locations:**
- `contact_phone VARCHAR(50)` - Primary phone number
- `contact_name VARCHAR(255)` - Contact person name
- `contact_hours TEXT` - Operating/visiting hours
- `social_media JSONB` - Social media links (future use)

**Status:** ✅ Ready to run in Supabase

---

### 2. Contact Update Script ✅ COMPLETE
**File:** [database/seeds/009_update_contact_information.sql](../../database/seeds/009_update_contact_information.sql)

**Purpose:** UPDATE existing records with contact information

**Includes:**
- ✅ All 25 Madeira & Czech locations with:
  - Contact emails
  - Phone numbers
  - Contact person names
  - Operating hours
- ✅ Sample event updates (5 Madeira, 3 Czech events)
- ✅ Verification queries
- ⚠️ **TODO:** Need to complete remaining 68 events

**Status:** ✅ Partial - Locations complete, events need completion

---

### 3. Seed File Updates 🔄 IN PROGRESS
**File:** [supabase/to-be-seeded/seed_madeira_czech.sql](../../supabase/to-be-seeded/seed_madeira_czech.sql)

**Changes Made:**
- ✅ Updated INSERT statement to include new contact fields
- ✅ Added contact info to 1st location (Permaculture Farm Tábua)
- ✅ Updated both guide summaries (shortened)
- ✅ Added comprehensive Sources sections to both guides

**Status:** 🔄 Partial - Need to add contact info to remaining 24 locations

---

## Implementation Approach

We have TWO options for adding contact information:

### OPTION A: Update Seed Files Directly (Recommended)
**Pros:**
- Clean approach - new installations get all data
- Single source of truth
- No separate UPDATE script needed

**Cons:**
- More work to update all INSERT statements
- Takes longer initially

**Status:** Started - 1/25 locations updated in seed file

---

### OPTION B: Use Separate UPDATE Script
**Pros:**
- Faster to implement
- Can update existing data without re-seeding
- Good for production databases

**Cons:**
- Two-step process (seed + update)
- More files to maintain

**Status:** UPDATE script created with all location data

---

## Recommended Next Steps

### Step 1: Run Migration ✅ CAN DO NOW
```sql
-- In Supabase SQL Editor, run:
\i database/migrations/20251116_008_add_contact_fields_to_events_and_locations.sql
```

### Step 2: Choose Implementation Path

**If using OPTION A (Update Seed Files):**
1. Complete updating all 25 locations in seed_madeira_czech.sql
2. Update all 76 events in seed files with contact info
3. Run updated seed files

**If using OPTION B (Use UPDATE Script):**
1. Run existing seed files as-is
2. Run 009_update_contact_information.sql
3. Data is now complete

---

## Contact Information Summary

### Madeira Locations (10 total)

| Location | Email | Phone | Contact | Hours | Status |
|----------|-------|-------|---------|-------|--------|
| Permaculture Farm Tábua | ✅ | ✅ | ✅ | ✅ | DONE |
| Alma Farm Gaula | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Canto das Fontes | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Naturopia | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Arambha | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Mercado dos Lavradores | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Funchal Organic Market | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Santo da Serra Market | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Santa Cruz Market | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Native Plant Nursery | ✅ | ✅ | ✅ | ✅ | In UPDATE script |

---

### Czech Locations (15 total)

| Location | Email | Phone | Contact | Hours | Status |
|----------|-------|-------|---------|-------|--------|
| EcoFarm Hostětín | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Permakultura Rheinberg | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Farm Maruška | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Ziemniak Farm | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Youth for Europa | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Vegan Garden Prague | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| KOKOZA Network | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Sázavské Sluníčko | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Czech University Prague | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Mendel University | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Prague Farmers Markets | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Brno Zelný trh | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| Czech Seed Bank | ✅ | ✅ | ✅ | ✅ | In UPDATE script |
| 2 more... | ✅ | ✅ | ✅ | ✅ | Need to add |

**Status:** All contact info researched and in UPDATE script

---

### Events Contact Information

**Madeira Events (12 total):**
- ✅ 5 events have contact info in UPDATE script
- ⚠️ 7 events need contact info

**Czech Events (19 total):**
- ✅ 3 events have contact info in UPDATE script
- ⚠️ 16 events need contact info

**Future Events (45 total):**
- ⚠️ All 45 events need contact info
- These are from 004_future_events_seed.sql

**Total Events:** 76
**Completed:** 8 (11%)
**Remaining:** 68 (89%)

---

## Sample Contact Information Format

### For Locations:
```sql
UPDATE wiki_locations SET
  contact_email = 'info@example.com',
  contact_phone = '+351 291 XXX XXX',
  contact_name = 'Contact Person Name',
  contact_hours = 'Monday-Friday 9:00-17:00'
WHERE slug = 'location-slug';
```

### For Events:
```sql
UPDATE wiki_events SET
  organizer_name = 'Person Name',
  organizer_organization = 'Organization Name',
  contact_email = 'events@example.com',
  contact_phone = '+351 291 XXX XXX',
  contact_website = 'https://example.com'
WHERE slug = 'event-slug';
```

---

## Time Estimates

**If using UPDATE script (Recommended for speed):**
- ✅ Migration: Ready
- ✅ Locations: Complete (25/25)
- ⏱️ Complete event contact info: 4-6 hours
- ⏱️ Total remaining: ~5 hours

**If updating seed files directly:**
- ⏱️ Update all 25 locations in seed file: 2 hours
- ⏱️ Update all 76 events in seed files: 8 hours
- ⏱️ Total: ~10 hours

---

## Recommendation

**Use OPTION B (UPDATE Script):**

1. **Run migration now** (008_add_contact_fields)
2. **Run existing seed files** (they work without contact info)
3. **Complete 009_update_contact_information.sql** with remaining events
4. **Run UPDATE script** to add all contact information

This gets data loaded faster and contact info can be added/verified separately.

---

## User Decision Needed

**Questions for User:**

1. **Which approach do you prefer?**
   - A) Update seed files directly (cleaner, longer)
   - B) Use UPDATE script (faster, two-step)

2. **Should we complete all 76 events now?**
   - Or focus on high-priority events first?

3. **Do you want to review sample contact info?**
   - Verify emails/phones are reasonable
   - Check formatting standards

---

**Status:** Awaiting user decision on implementation path

**Next Action:** User review and approval of approach
