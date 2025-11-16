# Events & Locations Improvement Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/EVENTS_LOCATIONS_IMPROVEMENT_PLAN.md

**Created:** 2025-11-16

**Purpose:** Incremental plan to improve all events and locations to meet quality standards

---

## 📊 Current Status

### Wiki Guides
✅ **COMPLETE** - All 5 guides meet standards (1,647-2,606 words each)

### Events
❌ **0% Complete** - All 45 events need expansion
- Current: 89-154 characters
- Required: 1,500-2,500 characters (150-250 words)
- **Gap:** Need 10-25x expansion for each event

### Locations
⚠️ **26% Complete** - 9/34 locations meet standards
- 9 locations: 2,385-3,346 characters ✅
- 22 locations: 380-700 characters (need 5-7x expansion)
- 3 locations: <400 characters (need 8-10x expansion)

---

## 🎯 Strategy: Phased Incremental Approach

### Phase 1: Critical Locations (Quick Wins)
**Goal:** Fix the 3 shortest locations first
**Time:** 30-45 minutes
**Impact:** High - removes critical gaps

### Phase 2: Medium Locations (Systematic)
**Goal:** Expand 22 medium-length locations in batches
**Time:** 2-3 hours (can be split across sessions)
**Impact:** High - achieves 100% location completion

### Phase 3: Events (Large Task)
**Goal:** Expand event descriptions
**Time:** 3-5 hours (can be split across sessions)
**Impact:** Medium-High - improves user experience

---

## 📋 PHASE 1: Critical Locations (3 locations)

### Intention
Fix the most inadequate content first. These 3 locations have descriptions so short they provide almost no value to users. Expanding them removes the worst quality issues.

### Locations to Improve

#### 1. **Ponta do Sol Community Garden** (347 chars → 2,000-3,000 chars)
**Current gaps:**
- No explanation of why it's listed
- No details about what's offered
- No information on how to engage
- Missing gardening programs/workshops info
- No contact details

**Research needed:**
- Search for "Ponta do Sol Community Garden Madeira"
- Check if website exists
- Find out about community programs
- Identify what makes it valuable for permaculture

**Expansion plan:**
- WHY: Community gardening in coastal Madeira town
- WHAT: Shared garden plots, workshops, plant sharing
- HOW: Volunteer days, membership, workshops
- SPECIFIC: Schedule, costs, contact methods

---

#### 2. **Quinta das Cruzes Botanical Garden** (352 chars → 2,000-3,000 chars)
**Current gaps:**
- Brief mention only
- No educational programs described
- Missing plant collection details
- No connection to permaculture explained

**Research needed:**
- Search for "Quinta das Cruzes Botanical Garden Funchal"
- Check official website
- Find out about collections, tours, programs
- Identify permaculture-relevant species

**Expansion plan:**
- WHY: Historic botanical garden with permaculture relevance
- WHAT: Plant collections, educational programs, tours
- HOW: Visiting hours, guided tours, educational materials
- SPECIFIC: Endemic species, subtropical plants, admission

---

#### 3. **Canto das Fontes Glamping & Organic Farm** (380 chars → 2,000-3,000 chars)
**Current gaps:**
- Agritourism model not explained
- Organic practices not detailed
- Educational opportunities missing
- No booking or contact info

**Research needed:**
- Search for "Canto das Fontes Madeira glamping"
- Check website/booking platforms
- Find out about organic certification
- Identify farm-to-table programs

**Expansion plan:**
- WHY: Example of profitable permaculture agritourism
- WHAT: Accommodation + organic farm + education
- HOW: Booking, farm tours, workshops
- SPECIFIC: Rates, organic produce, activities

---

### Deliverables (Phase 1)
- [ ] Research all 3 locations (web search)
- [ ] Write comprehensive descriptions (2,000-3,000 chars each)
- [ ] Create SQL file: `008_critical_locations_improvements.sql`
- [ ] Apply to database
- [ ] Verify descriptions meet standards
- [ ] Git commit: "feat: expand 3 critical location descriptions"

---

## 📋 PHASE 2: Medium Locations (22 locations)

### Intention
Systematically improve all remaining locations to achieve 100% completion. These locations have basic info but lack depth. Expanding them creates a truly valuable directory for practitioners.

### Batch Strategy
Work in batches of 5-7 locations to make progress manageable and allow for incremental commits.

### Batch 1: Czech Educational Centers (5 locations)
**Intention:** Complete all Czech educational institutions first

1. **Mendel University Brno** (410-513 chars → 2,000-3,000)
   - Research: Permaculture programs, research, student access
   - Focus: Academic programs, research projects, public workshops

2. **Permakultura CS Prague Library** (500 chars → 2,000-3,000)
   - Research: Library collections, events, membership
   - Focus: Educational resources, community hub role

3. **Permakultura CS Brno Library** (478 chars → 2,000-3,000)
   - Research: Similar to Prague, regional differences
   - Focus: Southern Moravia focus, local resources

4. **Czech University of Life Sciences Prague** (513 chars → 2,000-3,000)
   - Research: Programs, research, public access
   - Focus: Academic excellence, practical training

5. **KOKOZA Urban Agriculture Network** (567 chars → 2,000-3,000)
   - Research: Network structure, projects, how to join
   - Focus: Urban permaculture, community organizing

**Deliverable:** `009_czech_educational_locations.sql`

---

### Batch 2: Czech Markets & Gardens (7 locations)
**Intention:** Complete Czech community food systems

1. **Prague Farmers Market Network** (439 chars)
2. **Brno Organic Market Zelný trh** (405 chars)
3. **Community Garden Kuchyňka Prague** (409 chars)
4. **Holešovice Community Garden Prague** (397 chars)
5. **Funchal Organic Market** (409 chars)
6. **Czech Seed Bank & Heritage Varieties** (407 chars)
7. **Southern Bohemia Permaculture Garden** (476 chars)

**Deliverable:** `010_czech_markets_gardens.sql`

---

### Batch 3: Madeira Farms & Projects (6 locations)
**Intention:** Complete Madeira agricultural sites

1. **Alma Farm Gaula** (405 chars)
2. **Permaculture Project Fajã da Ovelha** (451 chars)
3. **Madeira Native Plant Nursery** (450 chars)
4. **Levada das 25 Fontes Water Heritage Site** (408 chars)
5. **Mercado Agrícola do Santo da Serra** (411 chars)
6. **Mercado dos Lavradores Funchal** (426 chars)

**Deliverable:** `011_madeira_farms_projects.sql`

---

### Batch 4: Czech & Madeira Communities (4 locations)
**Intention:** Complete remaining community sites

1. **Czech Republic First Full Ecovillage Project** (619 chars)
2. **Permaculture Farm & Learning Community Tábua** (417 chars)
3. **Naturopia Sustainable Community** (385 chars)
4. **Arambha Eco Village Project** (385 chars)

**Deliverable:** `012_community_sites.sql`

---

### Phase 2 Summary
- **Total:** 22 locations in 4 batches
- **Time:** ~30-45 min per batch = 2-3 hours total
- **Can be split:** Each batch is independent
- **Incremental commits:** After each batch

---

## 📋 PHASE 3: Events (45 events)

### Intention
Expand event descriptions to help users make informed attendance decisions. Currently, descriptions are too short to understand what events offer, who should attend, or what to bring.

### Challenge
Events are global (Lisboa, Brazil, Czech, UK, Australia, USA) and dates range from 2025-2026. Many may be past or cancelled. Need to verify each is still relevant.

### Recommended Approach: Quality over Quantity

**Option A: Selective Expansion (Recommended)**
- Identify 10-15 most relevant upcoming events
- Fully research and expand those
- Mark past/cancelled events appropriately
- **Time:** 1-2 hours
- **Result:** High-quality descriptions for active events

**Option B: Template-Based Enhancement**
- Create standard template for event descriptions
- Fill with available information
- Flag events needing organizer input
- **Time:** 2-3 hours
- **Result:** Consistent but possibly generic descriptions

**Option C: Comprehensive Research**
- Research all 45 events individually
- Verify each URL still works
- Contact organizers if needed
- **Time:** 4-6 hours
- **Result:** Complete but very time-intensive

### Event Description Template (if using Option A or B)

```markdown
[Detailed intro paragraph about what the event covers]

**What You'll Learn:**
- [Specific skill or knowledge 1]
- [Specific skill or knowledge 2]
- [Specific skill or knowledge 3]

**Who Should Attend:**
[Target audience description]

**Prerequisites:**
[Required skills/knowledge, or "None - beginner friendly"]

**What to Bring:**
- [Item 1]
- [Item 2]
- [Clothing/equipment needs]

**Schedule:**
[If available: daily schedule or time blocks]

**Instructors/Organizers:**
[Brief bio or organization description]

**Location Details:**
[Specific location, accessibility, parking, etc.]

**Registration:**
[How to register, deadlines, cancellation policy]

**Questions?**
[Contact information]
```

### Recommended: Start with Option A
1. Query database to find events with dates in future
2. Research 10-15 most relevant
3. Expand those comprehensively
4. Create SQL file
5. Leave rest for future session or mark as needing input

**Deliverable:** `013_selected_events_expansion.sql`

---

## 🎯 Incremental Execution Plan

### Session 1 (Today - 45 min)
- ✅ Verify wiki guides complete
- ✅ Create this plan document
- [ ] Phase 1: Expand 3 critical locations
- [ ] Commit: "feat: expand 3 critical location descriptions"

### Session 2 (Future - 45 min)
- [ ] Phase 2, Batch 1: Czech educational centers (5 locations)
- [ ] Commit: "feat: expand Czech educational location descriptions"

### Session 3 (Future - 45 min)
- [ ] Phase 2, Batch 2: Czech markets & gardens (7 locations)
- [ ] Commit: "feat: expand Czech market and garden descriptions"

### Session 4 (Future - 45 min)
- [ ] Phase 2, Batch 3: Madeira farms & projects (6 locations)
- [ ] Commit: "feat: expand Madeira farm location descriptions"

### Session 5 (Future - 30 min)
- [ ] Phase 2, Batch 4: Community sites (4 locations)
- [ ] Commit: "feat: expand community location descriptions"

### Session 6 (Future - 1-2 hours)
- [ ] Phase 3: Research and expand 10-15 selected events
- [ ] Commit: "feat: expand selected event descriptions"

---

## 📊 Progress Tracking

| Phase | Locations/Events | Status | Completion |
|-------|------------------|--------|------------|
| Wiki Guides | 5 guides | ✅ Complete | 100% |
| Phase 1 | 3 critical locations | ⏳ Pending | 0% |
| Phase 2.1 | 5 Czech educational | ⏳ Pending | 0% |
| Phase 2.2 | 7 Czech markets/gardens | ⏳ Pending | 0% |
| Phase 2.3 | 6 Madeira farms | ⏳ Pending | 0% |
| Phase 2.4 | 4 Communities | ⏳ Pending | 0% |
| Phase 3 | 10-15 selected events | ⏳ Pending | 0% |

**Overall Progress:**
- Guides: 100% ✅
- Locations: 26% → Target: 100%
- Events: 0% → Target: 33% (15/45)

---

## 🎓 Quality Standards for Locations

Each location description must include:

### 1. WHY Listed (100-150 words)
- Unique value to permaculture community
- What problem it solves or need it fills
- Relevance to different practitioner types

### 2. WHAT It Offers (200-300 words)
- Specific programs, workshops, courses
- Products available (plants, tools, books)
- Expertise or knowledge available
- Categories/subjects it supports

### 3. HOW to Engage (100-150 words)
- Visiting hours/schedule
- Membership or access requirements
- Volunteering opportunities
- Educational programs
- Purchasing options

### 4. SPECIFIC Details (100-150 words)
- Contact information
- Pricing (if applicable)
- Website/social media
- Location/accessibility
- Languages spoken
- Special requirements

### Total: 500-750 words (2,000-3,000 characters)

---

## 🎓 Quality Standards for Events

Each event description must include:

### 1. Learning Outcomes (100-150 words)
- What specific skills/knowledge attendees gain
- Hands-on vs. theoretical components
- Takeaways (materials, certificates, etc.)

### 2. Audience & Prerequisites (50-75 words)
- Who should attend
- Required skill level
- Physical requirements

### 3. Practical Information (100-150 words)
- What to bring
- Schedule/agenda
- Location details
- Accommodation (if multi-day)

### 4. Registration & Contact (75-100 words)
- How to register
- Pricing details
- Cancellation policy
- Contact for questions

### Total: 325-475 words (1,500-2,500 characters)

---

## ✅ Success Criteria

### Locations Complete When:
- [ ] All 34 locations have 2,000-3,000 character descriptions
- [ ] All include WHY/WHAT/HOW/SPECIFIC sections
- [ ] All websites verified (if applicable)
- [ ] All applied to database
- [ ] All committed to git incrementally

### Events Complete When:
- [ ] At least 15 events have 1,500-2,500 character descriptions
- [ ] All include learning outcomes, audience, practical info, registration
- [ ] All event URLs verified as working
- [ ] Past/cancelled events marked appropriately
- [ ] All applied to database
- [ ] All committed to git

---

**Next Action:** Execute Phase 1 - Expand 3 critical locations
