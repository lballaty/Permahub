# Contact Information Analysis - Events & Locations

**Date:** 2025-11-16
**Purpose:** Verify contact information fields in database schema and seed files

---

## Current Database Schema

### wiki_events Table Fields:
```sql
INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees, status
)
```

**Contact Fields Available:**
- ✅ `registration_url` - Website/registration link
- ❌ **MISSING: `contact_email`** - No email field
- ❌ **MISSING: `contact_phone`** - No phone field
- ❌ **MISSING: `organizer_name`** - No organizer field

---

### wiki_locations Table Fields:
```sql
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, contact_email, tags, status
)
```

**Contact Fields Available:**
- ✅ `website` - Organization website
- ✅ `contact_email` - Email address
- ❌ **MISSING: `contact_phone`** - No phone field
- ❌ **MISSING: `contact_name`** - No contact person field

---

## Gap Analysis

### wiki_events - NEEDS IMPROVEMENT ⚠️

**Missing Critical Fields:**
1. **contact_email** - Users cannot email event organizers
2. **contact_phone** - Users cannot call for questions
3. **organizer_name** - Unclear who is running the event
4. **organizer_organization** - Missing organizational context

**Current Workaround:**
- Only has `registration_url` which may or may not provide contact info
- Users must visit external website to find contact details

**Impact:**
- ❌ Users cannot directly contact organizers
- ❌ Reduces event accessibility
- ❌ Increases friction for participation

---

### wiki_locations - BETTER, BUT INCOMPLETE ⚠️

**Has:**
- ✅ `contact_email` - Good!
- ✅ `website` - Good!

**Missing:**
1. **contact_phone** - No phone number field
2. **contact_name** - No contact person name

**Impact:**
- ⚠️ Users can email but not call
- ⚠️ No personal contact point
- ⚠️ Less accessible for non-email users

---

## Current Seed File Status

### seed_madeira_czech.sql

**wiki_events (31 events):**
- ✅ All have `registration_url` (websites)
- ❌ No email addresses (field doesn't exist)
- ❌ No phone numbers (field doesn't exist)
- ⚠️ Cannot add contact info without schema change

**wiki_locations (25 locations):**
- ✅ All have `website` (23/25)
- ✅ All have `contact_email` field populated
- ❌ No phone numbers (field doesn't exist)
- ✅ Can verify/improve email addresses

---

### 004_future_events_seed.sql

**wiki_events (45 events):**
- ✅ All have `registration_url`
- ❌ No email addresses (field doesn't exist)
- ❌ No phone numbers (field doesn't exist)

---

## Recommendations

### IMMEDIATE ACTIONS (No Schema Change Required):

1. **Verify wiki_locations Contact Emails**
   - Check all 25 locations have valid email addresses
   - Research missing ones from websites
   - Add generic emails where specific ones unavailable (e.g., info@domain.com)

2. **Update Verification Script**
   - Add check for `contact_email` in locations (required field)
   - Add check for `registration_url` in events (required field)
   - Flag missing contact information

---

### RECOMMENDED SCHEMA IMPROVEMENTS (Require Migration):

#### For wiki_events Table:
```sql
ALTER TABLE wiki_events ADD COLUMN contact_email VARCHAR(255);
ALTER TABLE wiki_events ADD COLUMN contact_phone VARCHAR(50);
ALTER TABLE wiki_events ADD COLUMN organizer_name VARCHAR(255);
ALTER TABLE wiki_events ADD COLUMN organizer_organization VARCHAR(255);
```

#### For wiki_locations Table:
```sql
ALTER TABLE wiki_locations ADD COLUMN contact_phone VARCHAR(50);
ALTER TABLE wiki_locations ADD COLUMN contact_name VARCHAR(255);
ALTER TABLE wiki_locations ADD COLUMN contact_hours TEXT;  -- Business hours
```

---

### UPDATED VERIFICATION REQUIREMENTS

#### wiki_events (80% threshold):
- ✅ Title (10+ chars) - **20 points**
- ✅ Description (50+ chars) - **20 points**
- ✅ Date (valid format) - **20 points**
- ✅ Location name - **15 points**
- ✅ Event type - **15 points**
- ✅ Registration URL - **5 points**
- **NEW: Contact email** - **5 points** (if field added)

#### wiki_locations (80% threshold):
- ✅ Name (5+ chars) - **20 points**
- ✅ Description (100+ chars) - **30 points**
- ✅ GPS coordinates - **25 points**
- ✅ Location type - **15 points**
- ✅ **Contact email** - **5 points** (REQUIRED)
- ✅ Website - **2.5 points**
- ✅ Tags (3+) - **2.5 points**

---

## Action Plan

### Phase 1: Verify Current Data (No Schema Change) ✅ CAN DO NOW

1. **Check all wiki_locations contact emails:**
   - Verify 25 locations have emails
   - Research missing ones
   - Update seed file

2. **Check all wiki_events registration URLs:**
   - Verify all 76 events have URLs
   - Ensure URLs are valid
   - Add missing ones from web research

3. **Update verification script:**
   - Add contact_email requirement for locations
   - Add registration_url requirement for events
   - Re-run verification

**Time Estimate:** 2 hours

---

### Phase 2: Schema Improvements (Require User Approval) 🔜 FUTURE

1. **Create migration file:**
   - Add contact fields to both tables
   - Update RLS policies if needed

2. **Research contact information:**
   - Find phone numbers for events (from websites)
   - Find phone numbers for locations
   - Organizer names and organizations

3. **Update seed files:**
   - Add contact_email, contact_phone for events
   - Add contact_phone, contact_name for locations

4. **Update verification requirements:**
   - Contact email required for events & locations
   - Contact phone recommended (bonus points)

**Time Estimate:** 4-6 hours

---

## Summary

### Current State:
- ✅ **wiki_locations**: Has email, can improve
- ⚠️ **wiki_events**: Missing email/phone entirely

### Immediate Action (Today):
1. Verify all location emails are populated
2. Research missing emails from websites
3. Update verification script to require contact info

### Future Improvement (Needs User Approval):
1. Add contact_email, contact_phone to wiki_events
2. Add contact_phone to wiki_locations
3. Research and populate phone numbers
4. Update seed files with contact info

---

**Recommendation:** Start with Phase 1 (verify current emails) today, then propose Phase 2 schema improvements to user.
