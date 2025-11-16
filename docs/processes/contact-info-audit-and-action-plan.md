# Contact Information Audit & Action Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/contact-info-audit-and-action-plan.md
**Created:** 2025-11-16
**Author:** Libor Ballaty <libor@arionetworks.com>

---

## Executive Summary

**Status:** 🔴 CRITICAL ISSUES FOUND

### Key Findings:

1. ❌ **Invalid URLs:** Multiple event registration URLs are dead/redirected (e.g., Growing Power → loan company)
2. ❌ **UI Not Updated:** New contact fields exist in database but are NOT displayed in UI
3. ❌ **Forms Missing Fields:** Event creation form doesn't include new contact fields
4. ⚠️ **Database Design:** Current design duplicates organizer data across events (no normalization)

---

## Issue 1: Invalid Registration URLs

### Problem

Several event URLs redirect to unrelated websites or are no longer active.

### Confirmed Invalid URLs

| Event | Organization | Current URL | Issue |
|-------|--------------|-------------|-------|
| Greenhouse Management in Winter | Growing Power | https://www.growingpower.org/education | **INVALID** - Redirects to loan company (Growing Power UK) |

### All URLs Requiring Verification (45 total)

```
1.  https://urbanfarmlisboa.pt/workshops
2.  https://ecocaminhos.com/pdc
3.  https://www.permakultura.cz/akce
4.  https://www.transitiontowntotnes.org/events
5.  https://sunseed.org.uk/workshops
6.  https://www.fermedubec.com/en/
7.  https://quintadovale.pt/events
8.  https://www.permacultureplus.com.au/courses
9.  https://growinghomeinc.org/events
10. https://fungially.com/pages/workshops
11. https://www.treepeople.org/calendar
12. https://www.naturalbeekeepingtrust.org/events
13. https://www.findhorn.org/events
14. https://permacultureartisans.com/events
15. https://www.solarliving.org/workshops
16. https://www.herb-pharm.com/events
17. https://fullbellyfarm.com/events
18. https://rodaleinstitute.org/education
19. https://www.urbantilth.org/programs
20. https://greywateraction.org/workshops
21. https://www.stonebarnscenter.org/engage
22. https://punpunthailand.org/workshops
23. https://www.permablitz.net/events
24. https://www.earthshipglobal.com/academy
25. https://www.groworganicapples.com/workshops
26. https://www.polyfacefarms.com/events
27. https://www.wildernessawareness.org/programs
28. https://asi.ucdavis.edu/programs/sf
29. https://www.aprovecho.org/events
30. https://www.fourseasonfarm.com/workshops
31. https://www.carbongold.com/workshops
32. https://oaec.org/events
33. https://www.commongroundgarden.org/events
34. https://www.seedsavers.org/events
35. https://www.bbg.org/education
36. https://www.portlandfruit.org/events
37. https://www.permaculture.org/courses
38. https://blogs.cornell.edu/cornellmaple
39. https://www.johnnyseeds.com/growers-library
40. https://growingwarriors.org/training
41. https://www.jpibiodynamics.org/events
42. https://crfg.org/events
43. https://www.permacultureday.org
44. https://www.esalen.org/workshops
```

### Recommended Actions

1. Create automated URL checker script
2. Manually verify all 45 URLs
3. Research replacement URLs for invalid ones
4. Update database with correct URLs
5. Add URL validation to event creation form

---

## Issue 2: UI Not Displaying New Contact Fields

### Problem

Database has new contact fields, but UI doesn't display them.

### Database Fields Added (Migration 008)

**wiki_events table:**
- ✅ `organizer_name` VARCHAR(255)
- ✅ `organizer_organization` VARCHAR(255)
- ✅ `contact_email` VARCHAR(255)
- ✅ `contact_phone` VARCHAR(50)
- ✅ `contact_website` VARCHAR(500)

**wiki_locations table:**
- ✅ `contact_phone` VARCHAR(50)
- ✅ `contact_name` VARCHAR(255)
- ✅ `contact_hours` TEXT
- ✅ `social_media` JSONB

### UI Files Requiring Updates

#### 1. Event Display Page
**File:** [src/wiki/wiki-events.html](../../src/wiki/wiki-events.html)
- Location: Event grid container (line 150)
- **Action:** Add contact info section to event cards

#### 2. Event Rendering JavaScript
**File:** [src/wiki/js/wiki-events.js](../../src/wiki/js/wiki-events.js)

**Function 1: `renderEvents()` (lines 88-155)**
- Currently displays: title, date, time, location, author, description
- **Missing:** organizer_name, organizer_organization, contact_email, contact_phone

**Function 2: `showEventDetails()` (lines 320-440)**
- Currently displays: Full event details modal
- **Missing:** Contact section with email, phone, organizer info

#### 3. Event Creation Form
**File:** [src/wiki/wiki-editor.html](../../src/wiki/wiki-editor.html)
- Current fields: Event Date, Start Time, End Time, Location (lines 235-258)
- **Missing:** Contact information input fields

#### 4. Event Save Function
**File:** [src/wiki/js/wiki-editor.js](../../src/wiki/js/wiki-editor.js)
- Function: `saveEvent()` (lines 535-548)
- **Missing:** Collection and saving of contact fields

---

## Issue 3: Database Normalization Recommendation

### Current Design Issues

**Problem:** Organizer information is duplicated across events

Example:
```sql
Event 1: organizer_name = 'Growing Power', organizer_organization = 'Growing Power'
Event 2: organizer_name = 'Growing Power', organizer_organization = 'Growing Power'
Event 3: organizer_name = 'Growing Power', organizer_organization = 'Growing Power'
```

If Growing Power changes their email/phone, we must update ALL events manually.

### Proposed Unified Contact/Organizer Table

**New Table: `wiki_organizers`**

```sql
CREATE TABLE wiki_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  organization_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(500),
  social_media JSONB,
  address TEXT,
  description TEXT,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'active'
);
```

**Benefits:**
1. ✅ Single source of truth for organizer data
2. ✅ Update organizer contact once, affects all events
3. ✅ Can be reused across events, locations, guides
4. ✅ Reduces data duplication
5. ✅ Easier to maintain data quality

**Relationships:**

```sql
-- Events reference organizers
ALTER TABLE wiki_events
  ADD COLUMN organizer_id UUID REFERENCES wiki_organizers(id);

-- Locations reference organizers (optional)
ALTER TABLE wiki_locations
  ADD COLUMN organizer_id UUID REFERENCES wiki_organizers(id);

-- Guides can reference authors/organizations
ALTER TABLE wiki_guides
  ADD COLUMN organization_id UUID REFERENCES wiki_organizers(id);
```

### Migration Strategy

**Option A: Keep current fields, add normalized table later**
- Pros: No breaking changes, gradual migration
- Cons: Data duplication continues

**Option B: Migrate to normalized structure**
- Pros: Clean design, no duplication
- Cons: Requires data migration, UI updates

**Recommendation:** Option A initially, plan Option B for v2.0

---

## Granular Action Plan

### Phase 1: URL Validation & Cleanup (Estimated: 4-6 hours)

#### Task 1.1: Create URL Validation Script
**File to create:** `scripts/validate-event-urls.js`

**Script should:**
- Connect to local Supabase
- Fetch all event URLs
- Test each URL (follow redirects)
- Check for 404, domain changes, redirect loops
- Output report with invalid URLs

**Code skeleton:**
```javascript
// scripts/validate-event-urls.js
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

async function validateEventURLs() {
  // Connect to DB
  // Fetch all events with registration_url
  // For each URL: test with HEAD request
  // Log: Valid, Invalid (404), Redirected (to where?)
  // Save report to docs/verification/url-validation-report.md
}
```

**Acceptance Criteria:**
- [ ] Script runs without errors
- [ ] Tests all 45 event URLs
- [ ] Generates markdown report
- [ ] Identifies invalid/redirected URLs

---

#### Task 1.2: Manually Verify All URLs
**Estimated:** 2-3 hours

**Process:**
1. Run validation script
2. Review each flagged URL manually
3. Research correct replacement URLs
4. Document findings in spreadsheet

**Deliverable:** CSV file with:
```
event_slug, current_url, status, correct_url, notes
greenhouse-winter-dec-2025, https://growingpower.org/education, INVALID, [research needed], Redirects to loan company
```

---

#### Task 1.3: Update Database with Correct URLs
**Estimated:** 30 minutes

**Create migration file:** `database/migrations/20251116_010_fix_invalid_event_urls.sql`

```sql
-- Fix Growing Power event (organization defunct)
UPDATE wiki_events
SET
  registration_url = NULL,  -- or replacement URL if found
  contact_website = NULL,
  organizer_organization = 'Growing Power (Defunct 2017)'
WHERE slug = 'greenhouse-winter-dec-2025';

-- Fix other invalid URLs...
```

**Acceptance Criteria:**
- [ ] All invalid URLs corrected or set to NULL
- [ ] Migration file created and tested
- [ ] Verification query confirms all URLs valid

---

### Phase 2: UI Implementation - Display Contact Fields (Estimated: 6-8 hours)

#### Task 2.1: Update Event Card Display
**File:** `src/wiki/js/wiki-events.js`
**Function:** `renderEvents()` (lines 88-155)

**Changes needed:**
```javascript
// Add organizer info to event card
if (event.organizer_name || event.organizer_organization) {
  cardHTML += `
    <div class="event-organizer">
      <i class="fas fa-users"></i>
      <span>${escapeHtml(event.organizer_name || event.organizer_organization)}</span>
    </div>
  `;
}

// Add contact email
if (event.contact_email) {
  cardHTML += `
    <div class="event-contact">
      <i class="fas fa-envelope"></i>
      <a href="mailto:${event.contact_email}">${escapeHtml(event.contact_email)}</a>
    </div>
  `;
}
```

**Acceptance Criteria:**
- [ ] Organizer name displays on event cards
- [ ] Contact email displays as clickable mailto link
- [ ] Styling consistent with existing design
- [ ] Mobile responsive

---

#### Task 2.2: Update Event Details Modal
**File:** `src/wiki/js/wiki-events.js`
**Function:** `showEventDetails()` (lines 320-440)

**Changes needed:**
Add new section in modal:

```javascript
// After location section, add contact section
let contactHTML = '<div class="event-contact-section">';
contactHTML += '<h3>Contact Information</h3>';

if (event.organizer_name) {
  contactHTML += `<p><strong>Organizer:</strong> ${escapeHtml(event.organizer_name)}</p>`;
}
if (event.organizer_organization) {
  contactHTML += `<p><strong>Organization:</strong> ${escapeHtml(event.organizer_organization)}</p>`;
}
if (event.contact_email) {
  contactHTML += `
    <p>
      <i class="fas fa-envelope"></i>
      <a href="mailto:${event.contact_email}">${escapeHtml(event.contact_email)}</a>
    </p>
  `;
}
if (event.contact_phone) {
  contactHTML += `
    <p>
      <i class="fas fa-phone"></i>
      <a href="tel:${event.contact_phone}">${escapeHtml(event.contact_phone)}</a>
    </p>
  `;
}
if (event.contact_website) {
  contactHTML += `
    <p>
      <i class="fas fa-globe"></i>
      <a href="${event.contact_website}" target="_blank">${escapeHtml(event.contact_website)}</a>
    </p>
  `;
}
contactHTML += '</div>';
```

**Acceptance Criteria:**
- [ ] Contact section appears in event modal
- [ ] All contact fields display when present
- [ ] Phone numbers are clickable (tel: links)
- [ ] Email addresses are clickable (mailto: links)
- [ ] External links open in new tab

---

#### Task 2.3: Update Event Creation Form
**File:** `src/wiki/wiki-editor.html`
**Location:** After location field (line 256)

**Add form fields:**
```html
<!-- Organizer Information -->
<div class="form-section">
  <h3>Organizer & Contact Information</h3>

  <div class="form-group">
    <label for="eventOrganizerName">Organizer Name</label>
    <input type="text" id="eventOrganizerName" placeholder="Person organizing the event">
  </div>

  <div class="form-group">
    <label for="eventOrganizerOrganization">Organization</label>
    <input type="text" id="eventOrganizerOrganization" placeholder="Hosting organization">
  </div>

  <div class="form-group">
    <label for="eventContactEmail">Contact Email</label>
    <input type="email" id="eventContactEmail" placeholder="info@organization.org">
  </div>

  <div class="form-group">
    <label for="eventContactPhone">Contact Phone</label>
    <input type="tel" id="eventContactPhone" placeholder="+1 555 123 4567">
  </div>

  <div class="form-group">
    <label for="eventContactWebsite">Contact Website</label>
    <input type="url" id="eventContactWebsite" placeholder="https://example.org/events">
  </div>
</div>
```

**Acceptance Criteria:**
- [ ] All 5 contact fields added to form
- [ ] Input validation (email, phone, URL formats)
- [ ] Fields are optional (not required)
- [ ] Consistent styling with existing form

---

#### Task 2.4: Update Event Save Function
**File:** `src/wiki/js/wiki-editor.js`
**Function:** `saveEvent()` (lines 535-548)

**Changes needed:**
```javascript
const eventData = {
  // ... existing fields ...
  organizer_name: document.getElementById('eventOrganizerName')?.value || null,
  organizer_organization: document.getElementById('eventOrganizerOrganization')?.value || null,
  contact_email: document.getElementById('eventContactEmail')?.value || null,
  contact_phone: document.getElementById('eventContactPhone')?.value || null,
  contact_website: document.getElementById('eventContactWebsite')?.value || null,
};
```

**Acceptance Criteria:**
- [ ] All contact fields saved to database
- [ ] NULL values handled correctly for empty fields
- [ ] Email/phone/URL validation before save
- [ ] Success/error messages displayed

---

### Phase 3: Location Contact Fields UI (Estimated: 4 hours)

Similar updates needed for wiki_locations:

#### Task 3.1: Update Location Display
**Files:**
- Location card rendering
- Location details modal

**Add display for:**
- contact_name
- contact_phone
- contact_hours
- social_media

#### Task 3.2: Update Location Form
**Add fields:**
- Contact person name
- Contact phone
- Operating hours
- Social media links (optional JSONB)

---

### Phase 4: Database Normalization (Estimated: 8-12 hours)

**OPTIONAL - Recommend for v2.0**

#### Task 4.1: Design Organizers Table
**File to create:** `database/migrations/20251117_001_create_organizers_table.sql`

**Schema:**
```sql
CREATE TABLE wiki_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  organization_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(500),
  social_media JSONB,
  address TEXT,
  description TEXT,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'active'
);

-- Indexes
CREATE INDEX idx_organizers_name ON wiki_organizers(name);
CREATE INDEX idx_organizers_email ON wiki_organizers(contact_email);

-- RLS Policies
ALTER TABLE wiki_organizers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers are viewable by everyone"
  ON wiki_organizers FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can create organizers"
  ON wiki_organizers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
```

#### Task 4.2: Migrate Existing Data
**File:** `database/migrations/20251117_002_migrate_to_organizers.sql`

**Steps:**
1. Extract unique organizers from wiki_events
2. Insert into wiki_organizers
3. Update wiki_events with organizer_id
4. Keep legacy fields for backward compatibility

#### Task 4.3: Update UI for Organizers
- Organizer dropdown in event form (autocomplete)
- "Create new organizer" button
- Organizer profile pages
- Organizer management interface

---

## Summary: Priority Order

### 🔴 URGENT (Do Now)
1. ✅ URL validation script
2. ✅ Fix Growing Power URL (confirmed invalid)
3. ✅ Verify all 45 URLs manually
4. ✅ Update database with correct URLs

### 🟡 HIGH PRIORITY (This Week)
5. ✅ Add contact fields to event display (cards + modal)
6. ✅ Add contact fields to event creation form
7. ✅ Update event save function
8. ✅ Test end-to-end event creation with contacts

### 🟢 MEDIUM PRIORITY (Next Week)
9. ✅ Add contact fields to location display
10. ✅ Add contact fields to location form
11. ✅ Style contact sections (CSS)
12. ✅ Mobile responsive testing

### 🔵 LOW PRIORITY (Future / v2.0)
13. ⏳ Design organizers table schema
14. ⏳ Create data migration plan
15. ⏳ Implement organizer management UI
16. ⏳ Migrate existing data to normalized structure

---

## Files to Create

1. `scripts/validate-event-urls.js` - URL validation script
2. `database/migrations/20251116_010_fix_invalid_event_urls.sql` - URL fixes
3. `docs/verification/url-validation-report.md` - URL audit results
4. `database/migrations/20251117_001_create_organizers_table.sql` - Organizers table (optional)
5. `database/migrations/20251117_002_migrate_to_organizers.sql` - Data migration (optional)

## Files to Modify

1. `src/wiki/js/wiki-events.js` - Display contact fields
2. `src/wiki/wiki-editor.html` - Add contact form fields
3. `src/wiki/js/wiki-editor.js` - Save contact fields
4. `src/wiki/wiki-events.html` - Update event grid template (if needed)
5. CSS files - Style contact sections

---

## Estimated Total Time

| Phase | Hours |
|-------|-------|
| Phase 1: URL Validation | 4-6 hours |
| Phase 2: Events UI | 6-8 hours |
| Phase 3: Locations UI | 4 hours |
| Phase 4: Normalization (optional) | 8-12 hours |
| **Total (Required)** | **14-18 hours** |
| **Total (With Normalization)** | **22-30 hours** |

---

## Next Steps

**Immediate Actions:**

1. Review this action plan
2. Approve priority order
3. Decide: Phase 4 normalization now or later?
4. Start with Task 1.1: Create URL validation script

**Questions for User:**

1. Should we proceed with database normalization (Phase 4) or defer to v2.0?
2. Are there other organizations besides Growing Power known to be defunct?
3. Should invalid URLs be set to NULL or show a "Contact organizer directly" message?
4. Any specific styling preferences for contact information display?

---

**Status:** Awaiting user approval to proceed

**Last Updated:** 2025-11-16
