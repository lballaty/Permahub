# Seed Files Status

**Last Updated:** 2025-11-15 19:10

## Files Already Seeded (Completed)

Located in: `supabase/seeds/`

### 003_expanded_wiki_categories.sql (13K)
- ✅ **EXECUTED** - Nov 15, 2025
- **Content:** 45 wiki categories + 3 sample guides
- **Result:** Successfully loaded
  - 45 categories inserted
  - 3 guides inserted (Beekeeping, Fermentation, Mycology topics)
  - View count update failed (non-critical)

### Files Executed from Previous Location

**002_wiki_seed_data_madeira_EVENTS_LOCATIONS_ONLY.sql**
- ✅ **EXECUTED** - Location unknown (may have been deleted after execution)
- **Content:** Madeira-specific data
- **Result:** 
  - 8 events inserted
  - 9 locations inserted

---

## Files To Be Seeded

Located in: `supabase/to-be-seeded/`

### 004_future_events_seed.sql (19K)
- ❌ Not executed yet
- **Content:** Future event data
- **Estimated:** ~15-25 events

### 004_real_verified_wiki_content.sql (26K)
- ❌ Not executed yet
- **Content:** Verified guide content with sources
- **Estimated:** ~10-20 guides

### seed_madeira_czech.sql (66K)
- ❌ Not executed yet
- **Content:** Madeira + Czech Republic comprehensive data
- **Estimated:** ~30-50 combined entries
- **Note:** May contain duplicates of already-loaded Madeira data

---

## Current Database State

**Wiki Categories:** 45
**Wiki Guides:** 3
**Wiki Events:** 8
**Wiki Locations:** 9

**Total Records:** 65

---

## Recommendation

Before seeding additional files:
1. Create automated backup system
2. Verify no duplicate entries in to-be-seeded files
3. Check for data quality/compliance
4. Seed incrementally with verification between each file

---

## Files Location Summary

```
supabase/
├── seeds/
│   ├── 003_expanded_wiki_categories.sql (✅ executed)
│   └── 006_COMPLIANCE_REVIEW.md (documentation)
├── to-be-seeded/
│   ├── 004_future_events_seed.sql (⏭️ pending)
│   ├── 004_real_verified_wiki_content.sql (⏭️ pending)
│   └── seed_madeira_czech.sql (⏭️ pending)
└── [other migration/utility files]
```
