# URL Validation Summary

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/verification/url-validation-summary.md
**Created:** 2025-11-16
**Author:** Libor Ballaty <libor@arionetworks.com>

---

## Overview

This document summarizes all URLs extracted from the database for validation.

---

## Files Created

### 1. Event URLs
**Files:**
- [event-urls-for-validation.csv](event-urls-for-validation.csv) (8.4KB)
- [event-urls-for-validation.json](event-urls-for-validation.json) (17KB)

**Total Events with URLs:** 45

**Data Includes:**
- Event slug, title, type, date
- Organizer organization
- Registration URL (primary URL to validate)
- Contact website (backup URL)
- Contact email

**Known Issues:**
- ❌ Growing Power (greenhouse-winter-dec-2025): https://www.growingpower.org/education → Redirects to loan company

---

### 2. Location URLs
**Files:**
- [location-urls-for-validation.csv](location-urls-for-validation.csv) (4.6KB)
- [location-urls-for-validation.json](location-urls-for-validation.json) (9.1KB)

**Total Locations with URLs:** 31

**Data Includes:**
- Location slug, name, type
- Website URL
- Contact email, phone, name

---

### 3. Guides
**Status:** ✅ No external URLs to validate

Guides are self-contained content without external website links. They may reference sources in their content but don't have dedicated URL fields.

**Total Guides:** 5
1. Cold Climate Permaculture in Czech Republic
2. Growing Oyster Mushrooms on Coffee Grounds
3. Lacto-Fermentation: Ancient Preservation Made Simple
4. Starting Your First Backyard Flock
5. Subtropical Permaculture in Madeira: Complete Guide

---

## URL Validation Statistics

### Total URLs to Validate: 76

| Category | Count | Status |
|----------|-------|--------|
| Event URLs | 45 | ⏳ Pending validation |
| Location URLs | 31 | ⏳ Pending validation |
| Guide URLs | 0 | ✅ N/A |
| **Total** | **76** | |

---

## Next Steps

### Option 1: Automated Validation Script

Create `scripts/validate-urls.js` to:
1. Read JSON files
2. Test each URL (HTTP status, redirects)
3. Check for keyword relevance (organization name in page content)
4. Generate validation report

**Estimated Time:** 1-2 hours to build script

---

### Option 2: Manual Review

Use CSV files to manually check URLs in browser:
1. Open CSV in spreadsheet
2. Visit each URL
3. Mark as Valid/Invalid/Redirect
4. Document replacement URLs

**Estimated Time:** 4-6 hours

---

### Option 3: Hybrid Approach (Recommended)

1. Run automated script to identify obvious issues (404s, redirects)
2. Manually review flagged URLs
3. Research replacement URLs for invalid ones
4. Update database

**Estimated Time:** 2-3 hours

---

## URL Validation Criteria

### Valid URL
- ✅ Returns HTTP 200 status
- ✅ Domain matches organization name or is clearly related
- ✅ Content is relevant to event/location topic
- ✅ No redirects to unrelated sites

### Invalid URL
- ❌ Returns 404 or 500 error
- ❌ Redirects to unrelated site (e.g., loan company)
- ❌ Domain parked/for sale
- ❌ Content completely unrelated

### Suspicious URL
- ⚠️ Redirects to different but related domain
- ⚠️ Generic domain (medium.com, workaway.info)
- ⚠️ Dead organization (Growing Power - defunct 2017)

---

## Sample Event URLs to Check

### High Priority (Workshops/Courses)
1. Growing Power → https://www.growingpower.org/education (CONFIRMED INVALID)
2. Urban Farm Lisboa → https://urbanfarmlisboa.pt/workshops
3. Eco Caminhos → https://ecocaminhos.com/pdc
4. Permakultura CZ → https://www.permakultura.cz/akce
5. Transition Town Totnes → https://www.transitiontowntotnes.org/events

### Educational Institutions
6. Brooklyn Botanic Garden → https://www.bbg.org/education
7. Cornell Maple Program → https://blogs.cornell.edu/cornellmaple
8. UC Davis Student Farm → https://asi.ucdavis.edu/programs/sf

### Non-Profits
9. TreePeople → https://www.treepeople.org/calendar
10. Seed Savers Exchange → https://www.seedsavers.org/events

---

## Sample Location URLs to Check

### Farms
1. Alma Farm Gaula → https://medium.com/@Madeirafriends (⚠️ Generic domain)
2. Canto das Fontes → https://cantodasfontes.pt/
3. Quinta das Colmeias → http://www.quinta-das-colmeias.com (⚠️ HTTP not HTTPS)

### Community Gardens
4. KOKOZA Network → https://komunitnizahrady.cz/
5. Holešovice Garden → https://komunitnizahrady.cz/

### Education Centers
6. Permakultura CS Prague → https://www.permakulturacs.cz/english/
7. Czech University Prague → https://studyinprague.cz/
8. Mendel University → https://mendelu.cz/en/

---

## Recommended Actions

### Immediate (This Week)
1. ✅ Create URL validation script
2. ✅ Run automated checks
3. ✅ Identify all invalid/redirected URLs
4. ✅ Create issues list

### Short Term (Next Week)
5. ✅ Research replacement URLs for invalid ones
6. ✅ Create database migration to fix URLs
7. ✅ Run migration
8. ✅ Verify all URLs functional

### Long Term (Ongoing)
9. ✅ Add URL validation to event/location creation forms
10. ✅ Periodic URL health checks (quarterly)
11. ✅ Monitor for domain expirations

---

## URL Validation Script Specification

### Input
- Read JSON files: `event-urls-for-validation.json`, `location-urls-for-validation.json`

### Processing
For each URL:
1. Send HTTP HEAD request (faster than GET)
2. Follow redirects (max 5)
3. Record final URL and status code
4. Check if domain changed
5. Optionally: Fetch page title and check for organization name

### Output
Generate markdown report:
```markdown
## URL Validation Report
Date: 2025-11-16

### Summary
- Total URLs tested: 76
- Valid: 65 (85%)
- Invalid: 5 (7%)
- Redirected: 6 (8%)

### Invalid URLs
| Slug | Organization | Original URL | Status | Issue |
|------|--------------|--------------|--------|-------|
| greenhouse-winter-dec-2025 | Growing Power | https://growingpower.org | 301 → loan site | Domain taken over |

### Redirected URLs
| Slug | Organization | Original URL | Final URL | Note |
|------|--------------|--------------|-----------|------|
| ... | ... | ... | ... | ... |

### Valid URLs
All remaining URLs returned 200 status with no suspicious redirects.
```

---

## Files for Programmatic Validation

**Events:** [event-urls-for-validation.json](event-urls-for-validation.json)

```json
[
  {
    "slug": "greenhouse-winter-dec-2025",
    "title": "Greenhouse Management in Winter",
    "event_type": "workshop",
    "event_date": "2025-12-06",
    "organizer_organization": "Growing Power",
    "registration_url": "https://www.growingpower.org/education",
    "contact_website": "https://www.growingpower.org/education",
    "contact_email": "info@growingpower.org"
  },
  ...
]
```

**Locations:** [location-urls-for-validation.json](location-urls-for-validation.json)

```json
[
  {
    "slug": "alma-farm-gaula-madeira",
    "name": "Alma Farm Gaula",
    "location_type": "farm",
    "website": "https://medium.com/@Madeirafriends",
    "contact_email": "info@almafarm.pt",
    "contact_phone": "+351 291 524 100",
    "contact_name": "Alma Farm Team"
  },
  ...
]
```

---

## Decision Needed

**Question for User:**

Which approach do you prefer?

1. **Build automated validation script** (1-2 hours dev, instant results)
2. **Manual review in browser** (4-6 hours, more thorough)
3. **Hybrid approach** (2-3 hours total, recommended)

Once decided, I can:
- Build the validation script
- Create the validation report
- Generate database migration to fix invalid URLs

---

**Status:** Awaiting user decision on validation approach

**Files Ready:**
- ✅ event-urls-for-validation.csv
- ✅ event-urls-for-validation.json
- ✅ location-urls-for-validation.csv
- ✅ location-urls-for-validation.json
