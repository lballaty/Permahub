# Content Creation System - Requirements Document

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/CONTENT_CREATION_SYSTEM_REQUIREMENTS.md

**Description:** Comprehensive requirements for a complete content creation, verification, and duplication prevention system

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

**Version:** 1.0.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [User Stories](#user-stories)
4. [Functional Requirements](#functional-requirements)
5. [Content Type Requirements](#content-type-requirements)
6. [Quality Assurance Requirements](#quality-assurance-requirements)
7. [Duplication Prevention Requirements](#duplication-prevention-requirements)
8. [System Components](#system-components)
9. [Workflows](#workflows)
10. [Success Criteria](#success-criteria)
11. [Implementation Phases](#implementation-phases)

---

## Executive Summary

### Purpose

Create a **complete, end-to-end content creation system** for Permahub wiki that:
- Guides creators through content creation for Guides, Events, and Locations
- Ensures all content meets quality standards
- Prevents duplicate content
- Verifies content against database before insertion
- Provides automated validation and feedback
- Maintains consistency across all wiki content

### Scope

**In Scope:**
- Wiki Guides creation and verification
- Wiki Events creation and verification
- Wiki Locations creation and verification
- Duplicate content detection (database + seed files)
- Quality standards enforcement
- SQL seed file generation and validation
- Automated verification workflows
- Integration with existing database schema

**Out of Scope (Future Phases):**
- Content translation workflows
- User interface for content creation
- Direct database insertion (seed files only)
- Content moderation workflows
- Content versioning/history

### Current State Assessment

**Existing Assets:**
- ✅ Wiki Content Creation Guide (73KB, comprehensive)
- ✅ Wiki Schema Compliance Check
- ✅ Guide Verification Process (guides only)
- ✅ Guide Verification Report Template
- ✅ Verification System README
- ⚠️ Partial automation (verify-guide.js - guides only)
- ⚠️ Seed file verification (all types, but newly created)
- ⚠️ Seed file analysis tools
- ⚠️ Database comparison tools
- ❌ Event creation workflow (missing)
- ❌ Event verification process (missing)
- ❌ Location creation workflow (missing)
- ❌ Location verification process (missing)
- ❌ Real-time duplicate detection (missing)
- ❌ Content-aware duplication checker (missing)

### Gap Analysis Summary

| Component | Status | Priority |
|-----------|--------|----------|
| **Guide Creation Documentation** | ✅ Complete | - |
| **Guide Verification Process** | ⚠️ Needs enhancement | HIGH |
| **Guide Automation** | ⚠️ Partial | HIGH |
| **Event Creation Documentation** | ⚠️ Partial in main guide | HIGH |
| **Event Verification Process** | ❌ Missing | HIGH |
| **Event Automation** | ❌ Missing | HIGH |
| **Location Creation Documentation** | ⚠️ Partial in main guide | HIGH |
| **Location Verification Process** | ❌ Missing | HIGH |
| **Location Automation** | ❌ Missing | HIGH |
| **Duplicate Detection - Guides** | ❌ Missing | CRITICAL |
| **Duplicate Detection - Events** | ❌ Missing | CRITICAL |
| **Duplicate Detection - Locations** | ❌ Missing | CRITICAL |
| **Database Integration** | ⚠️ Query tools exist | MEDIUM |
| **Quality Standards Consolidation** | ⚠️ Scattered across docs | HIGH |

---

## System Overview

### System Goals

1. **Consistency:** All content follows standardized templates and quality criteria
2. **Accuracy:** All content is factually verified and properly sourced
3. **Uniqueness:** No duplicate content in database or seed files
4. **Completeness:** All required fields populated, all sections present
5. **Quality:** Content meets minimum standards for depth, structure, and style
6. **Compliance:** Content aligns with database schema and permaculture principles

### Key Principles

1. **Creator-Friendly:** Clear guidance, helpful feedback, supportive tone
2. **Automated Where Possible:** Reduce manual verification burden
3. **Fail-Fast:** Catch issues early in creation process
4. **Transparent:** Show creators exactly what's needed and why
5. **Database-Aware:** Check against existing content before creation
6. **Type-Specific:** Different requirements for guides/events/locations

---

## User Stories

### As a Content Creator (Human)

1. **I want to** create a new guide **so that** I can share knowledge with the community
   - **Given** I have a topic idea
   - **When** I follow the creation workflow
   - **Then** I receive guidance on structure, length, and quality requirements
   - **And** I can verify my content meets standards before submission

2. **I want to** check if my topic already exists **so that** I don't create duplicate content
   - **Given** I have a guide title or topic
   - **When** I run duplication check
   - **Then** I see if similar content exists in database or seed files
   - **And** I receive recommendations (create new, enhance existing, or merge)

3. **I want to** create an event entry **so that** community members can discover it
   - **Given** I have event details (date, location, description)
   - **When** I follow the event creation workflow
   - **Then** I receive a properly formatted SQL seed file
   - **And** I'm confident the event meets quality standards

4. **I want to** add a location **so that** others can find and visit it
   - **Given** I have location details and coordinates
   - **When** I follow the location creation workflow
   - **Then** I verify coordinates are accurate
   - **And** I check location doesn't already exist

### As an LLM Agent

5. **I want to** generate content programmatically **so that** I can bulk-create seed data
   - **Given** I have source data and topic research
   - **When** I use the automated creation tools
   - **Then** Content is generated following exact templates
   - **And** All quality checks pass automatically

6. **I want to** verify content before submission **so that** only quality content is added
   - **Given** I have generated wiki content
   - **When** I run verification workflow
   - **Then** I receive pass/fail status with specific issues
   - **And** I can fix issues programmatically

### As a Verifier/Reviewer

7. **I want to** quickly assess content quality **so that** I can approve or request changes
   - **Given** New content is submitted
   - **When** I run verification process
   - **Then** I receive compliance score and detailed report
   - **And** I see specific issues prioritized by severity

8. **I want to** verify content uniqueness **so that** database remains clean
   - **Given** New content ready for insertion
   - **When** I check for duplicates
   - **Then** I see similarity scores vs existing content
   - **And** I can identify potential duplicates before insertion

---

## Functional Requirements

### FR-1: Content Creation

#### FR-1.1: Guide Creation
- **Requirement:** System shall provide complete workflow for creating wiki guides
- **Inputs:** Topic, research sources, target audience
- **Outputs:** SQL INSERT statement with properly formatted guide
- **Validation:**
  - Title 50-100 characters
  - Summary 100-150 characters
  - Content 1,000+ words minimum
  - Markdown structure compliance
  - All required sections present
  - Sources cited
- **Success Criteria:** Generated guide passes verification with 80%+ score

#### FR-1.2: Event Creation
- **Requirement:** System shall provide complete workflow for creating wiki events
- **Inputs:** Event details, date, location, pricing
- **Outputs:** SQL INSERT statement with properly formatted event
- **Validation:**
  - Title 30-80 characters
  - Description 300-1000 characters
  - Future date (not past)
  - Valid coordinates if location specified
  - Pricing format correct
- **Success Criteria:** Generated event passes validation checks

#### FR-1.3: Location Creation
- **Requirement:** System shall provide complete workflow for creating wiki locations
- **Inputs:** Location name, address, coordinates, description
- **Outputs:** SQL INSERT statement with properly formatted location
- **Validation:**
  - Name 30-100 characters
  - Description 400-1500 characters
  - Coordinates validated against address
  - Location type specified
  - 5-15 tags present
- **Success Criteria:** Generated location passes validation checks

### FR-2: Quality Verification

#### FR-2.1: Automated Verification
- **Requirement:** System shall automatically verify content quality
- **Process:**
  1. Extract content from SQL or markdown
  2. Calculate metrics (word count, character counts)
  3. Check structural compliance
  4. Verify required fields present
  5. Calculate compliance score
  6. Generate detailed report
- **Success Criteria:** Verification completes in <10 seconds, accuracy >95%

#### FR-2.2: Manual Verification Support
- **Requirement:** System shall support manual verification workflow
- **Process:**
  1. Load automated verification results
  2. Perform source fact-checking
  3. Verify permaculture relevance
  4. Assess content alignment
  5. Document findings in standard report
- **Success Criteria:** Verifier can complete review in <30 minutes per guide

#### FR-2.3: Factual Accuracy Verification
- **Requirement:** System shall support factual accuracy verification
- **Process:**
  1. Extract topic from title
  2. Search Wikipedia for topic article
  3. Search authoritative sources (.edu, .gov)
  4. Cross-reference key facts
  5. Document sources and verification date
- **Success Criteria:** Source URLs documented, verification date recorded

### FR-3: Duplicate Detection

#### FR-3.1: Database Duplication Check
- **Requirement:** System shall check for duplicates in existing database content
- **Inputs:** Content title, slug, or full text
- **Checks:**
  - Exact slug match (100% duplicate)
  - Title similarity >80%
  - Content similarity >60% (using word overlap or embeddings)
  - Topic overlap based on categories
- **Outputs:**
  - List of similar existing content
  - Similarity scores per item
  - Recommendation (create new, update existing, merge)
- **Success Criteria:** Detects all exact duplicates, flags 90%+ of near-duplicates

#### FR-3.2: Seed File Duplication Check
- **Requirement:** System shall check for duplicates in pending seed files
- **Inputs:** New content
- **Checks:**
  - Check all seed files in `/supabase/to-be-seeded/`
  - Exact slug match across all files
  - Title/content similarity
  - Date/location overlap (for events/locations)
- **Outputs:**
  - List of similar seed file content
  - File names containing duplicates
  - Line numbers for review
- **Success Criteria:** Scans all seed files in <5 seconds

#### FR-3.3: Content-Aware Similarity Detection
- **Requirement:** System shall detect semantic similarity beyond exact matches
- **Methods:**
  - Word count overlap percentage
  - Key phrase extraction and comparison
  - Category/tag overlap analysis
  - Geographic proximity (for events/locations)
- **Thresholds:**
  - 90-100% similarity: Definite duplicate
  - 70-89% similarity: Likely duplicate, review needed
  - 50-69% similarity: Possible overlap, check carefully
  - <50% similarity: Likely unique
- **Success Criteria:** Reduces duplicate submissions by 80%+

### FR-4: SQL Generation

#### FR-4.1: Properly Formatted INSERT Statements
- **Requirement:** System shall generate syntactically correct SQL
- **Format:**
  - Multi-line format for readability
  - E'...' for escaped strings
  - Doubled single quotes for apostrophes
  - Proper UUID placeholders
  - Column list explicit
- **Success Criteria:** Generated SQL executes without syntax errors

#### FR-4.2: Category Linking
- **Requirement:** System shall generate category linkage SQL
- **Format:**
  ```sql
  DO $$
  DECLARE
    guide_id UUID;
  BEGIN
    SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'guide-slug';
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES
      (guide_id, (SELECT id FROM wiki_categories WHERE slug = 'category-1')),
      (guide_id, (SELECT id FROM wiki_categories WHERE slug = 'category-2'));
  END $$;
  ```
- **Success Criteria:** Categories linked correctly, no orphaned records

### FR-5: Workflow Automation

#### FR-5.1: Interactive Creation Tool
- **Requirement:** System shall provide interactive content creation tool
- **Features:**
  - Guided prompts for all required fields
  - Real-time validation feedback
  - Duplicate check before finalization
  - Preview of generated SQL
  - Save draft/export options
- **Success Criteria:** 90% of users complete creation without errors

#### FR-5.2: Batch Content Generation
- **Requirement:** System shall support batch content creation
- **Features:**
  - CSV/JSON input support
  - Bulk duplicate checking
  - Progress reporting
  - Error handling and logging
  - Rollback on failures
- **Success Criteria:** Process 100+ items/hour with <5% error rate

---

## Content Type Requirements

### Guides Requirements

#### Structure Requirements
1. **Introduction Section** (Required)
   - 2-3 paragraphs introducing topic
   - Clear statement of what readers will learn
   - Key benefits listed (3-5 bullets)
   - Minimum 200 words

2. **Main Content Sections** (Required, 4+ sections)
   - Logical organization
   - Subsections where appropriate
   - Practical steps with measurements/timing
   - Each section minimum 300 words

3. **Troubleshooting Section** (Required)
   - Common problems identified
   - Solutions provided for each
   - Symptoms clearly described
   - Minimum 200 words

4. **Resources & Further Learning** (Required)
   - Verified sources (Wikipedia, .edu, .gov)
   - Recommended reading books/articles
   - Related guides linked
   - Minimum 5 sources

5. **Conclusion Section** (Required)
   - 2-3 paragraphs
   - Summarizes key takeaways
   - Encourages next steps
   - Minimum 150 words

#### Quality Metrics
- **Word Count:** 1,000 minimum, 1,500-5,000 optimal
- **Title Length:** 50-100 characters
- **Summary Length:** 100-150 characters
- **Category Count:** 2-4 categories
- **Factual Accuracy:** 85%+ verified against sources
- **Permaculture Relevance:** Clear connection to 2+ principles

### Events Requirements

#### Required Fields
- **title:** Event name (30-80 chars)
- **slug:** URL-friendly identifier
- **description:** Full description (300-1,000 chars)
- **event_date:** Future date (YYYY-MM-DD)
- **event_type:** workshop/meetup/tour/course/workday
- **status:** 'published' for active events

#### Optional But Recommended
- **start_time / end_time:** Time range
- **location_name / location_address:** Venue details
- **latitude / longitude:** Coordinates for mapping
- **price / price_display:** Pricing information
- **registration_url:** Registration link
- **max_attendees:** Capacity limit

#### Quality Metrics
- **Description Quality:** Answers who/what/when/where/why
- **Completeness:** All recommended fields filled
- **Date Validity:** Future date, realistic timeframe
- **Location Accuracy:** Coordinates match address
- **Pricing Clarity:** Clear and unambiguous

### Locations Requirements

#### Required Fields
- **name:** Location name (30-100 chars)
- **slug:** URL-friendly identifier
- **description:** Full description (400-1,500 chars)
- **latitude / longitude:** Accurate coordinates (required)
- **status:** 'published' for active locations

#### Optional But Recommended
- **address:** Complete physical address
- **location_type:** farm/garden/education/community/business
- **website:** Official URL
- **contact_email / contact_phone:** Public contact info
- **tags:** 5-15 relevant tags
- **opening_hours:** JSONB structured hours

#### Quality Metrics
- **Description Quality:** Specific features, access info, significance
- **Coordinate Accuracy:** Verified against Google Maps
- **Tag Relevance:** Searchable, relevant tags
- **Contact Info:** Valid and current
- **Completeness:** 80%+ of recommended fields filled

---

## Quality Assurance Requirements

### QA-1: Compliance Scoring

**Overall Score Formula:**
```
Overall Score =
  (Word Count Score × 0.15) +
  (Factual Accuracy × 0.25) +
  (Source Citations × 0.15) +
  (Content Alignment × 0.15) +
  (Structure Compliance × 0.15) +
  (Permaculture Relevance × 0.10) +
  (Summary Quality × 0.05)
```

**Pass Threshold:** 80%

**Score Interpretation:**
- 90-100%: Excellent quality
- 80-89%: Good quality (pass)
- 70-79%: Needs minor improvements
- 60-69%: Needs significant improvements
- <60%: Fail - major revisions required

### QA-2: Required Checks

#### Pre-Creation Checks
- [ ] Topic not duplicate of existing content
- [ ] Creator has necessary information/sources
- [ ] Topic aligns with permaculture/sustainability
- [ ] Appropriate content type selected

#### Post-Creation Checks
- [ ] All required fields populated
- [ ] Field lengths within specifications
- [ ] Slug is unique and properly formatted
- [ ] SQL syntax is valid
- [ ] Categories exist and are appropriate
- [ ] Coordinates validated (if applicable)
- [ ] Dates are valid and future (for events)
- [ ] Content structure follows template
- [ ] Sources cited and verifiable
- [ ] No sensitive/private information included

#### Pre-Insertion Checks
- [ ] No duplicate in database
- [ ] No duplicate in seed files
- [ ] All verification checks passed
- [ ] Compliance score ≥80%
- [ ] Manual review completed (if required)

---

## Duplication Prevention Requirements

### DP-1: Detection Strategy

#### Level 1: Exact Match Detection (Critical)
**Check:** Slug uniqueness
- **Database:** Query `SELECT COUNT(*) FROM wiki_guides WHERE slug = $1`
- **Seed Files:** Parse all SQL files for existing slug
- **Action:** If found, reject with error

#### Level 2: High Similarity Detection (Critical)
**Check:** Title similarity >90%
- **Method:** Lowercase comparison, remove punctuation
- **Database:** Query similar titles using ILIKE or similarity function
- **Seed Files:** Parse and compare all titles
- **Action:** If found, show matches and require confirmation

#### Level 3: Content Similarity Detection (High Priority)
**Check:** Content overlap >70%
- **Method:** Word count overlap, key phrase extraction
- **Database:** Query guides with similar content
- **Seed Files:** Parse content sections and compare
- **Action:** Show potential duplicates, recommend review

#### Level 4: Topic Overlap Detection (Medium Priority)
**Check:** Same categories, similar tags
- **Method:** Category intersection, tag overlap
- **Database:** Find content with 3+ matching categories
- **Seed Files:** Extract and compare categories/tags
- **Action:** Flag for review, may be different angles on same topic

#### Level 5: Geographic Overlap (For Locations/Events)
**Check:** Same coordinates or very close proximity
- **Method:** Haversine distance <100 meters
- **Database:** Spatial query for nearby locations
- **Seed Files:** Extract coordinates and calculate distances
- **Action:** Flag as potential duplicate, verify distinct

### DP-2: Duplicate Resolution Workflow

**When Duplicate Detected:**

1. **Show Comparison:**
   - Display new content side-by-side with existing
   - Highlight similarities
   - Show similarity scores

2. **Provide Options:**
   - **Option A:** Cancel - content too similar
   - **Option B:** Enhance Existing - add new info to existing content
   - **Option C:** Create New - different angle/depth justifies separate entry
   - **Option D:** Merge - combine both into comprehensive guide

3. **Document Decision:**
   - Record what was found
   - Document why new content was/wasn't created
   - Update existing content if enhanced

### DP-3: Database Query Tools

**Required Queries:**

```sql
-- Check slug uniqueness
SELECT id, title, slug FROM wiki_guides WHERE slug = $1;

-- Find similar titles
SELECT id, title, slug, similarity(title, $1) as sim
FROM wiki_guides
WHERE similarity(title, $1) > 0.7
ORDER BY sim DESC;

-- Find content by category overlap
SELECT g.id, g.title, COUNT(*) as matching_categories
FROM wiki_guides g
JOIN wiki_guide_categories gc ON g.id = gc.guide_id
WHERE gc.category_id IN (SELECT unnest($1::uuid[]))
GROUP BY g.id, g.title
HAVING COUNT(*) >= 3;

-- Find nearby locations (for locations/events)
SELECT id, name, latitude, longitude,
  calculate_distance($1, $2, latitude, longitude) as distance_km
FROM wiki_locations
WHERE calculate_distance($1, $2, latitude, longitude) < 0.1
ORDER BY distance_km;
```

---

## System Components

### Component 1: Creation Guides (Existing)

**Files:**
- `docs/features/wiki-content-guide.md` (master reference)
- `docs/features/wiki-schema-compliance.md`

**Purpose:** Define standards, templates, and requirements

**Status:** ✅ Complete for guides, partial for events/locations

### Component 2: Verification Process (Partial)

**Files:**
- `docs/processes/WIKI_GUIDE_VERIFICATION_PROCESS.md` (guides only)
- `docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md`
- `docs/processes/VERIFICATION_SYSTEM_README.md`

**Purpose:** Systematic quality verification

**Status:** ⚠️ Complete for guides only, needs expansion

**Required Additions:**
- Event verification process
- Location verification process
- Unified verification workflow

### Component 3: Automation Tools (Partial)

**Files:**
- `scripts/verify-guide.js` (guides only)
- `scripts/verify-seed-file.js` (all types, basic)
- `scripts/analyze-seed-files.js`
- `scripts/check-database-vs-seeds.js`
- `scripts/generate-wiki-content.js` (exists but needs enhancement)

**Purpose:** Automate creation, verification, duplication detection

**Status:** ⚠️ Partial - needs enhancement and expansion

**Required Additions:**
- Interactive creation tool (all types)
- Comprehensive duplicate checker
- Database integration for real-time checks
- Content similarity analyzer
- Batch processing tools

### Component 4: Duplication Prevention (Missing)

**Required Files:**
- `scripts/check-duplicates.js` (NEW - comprehensive checker)
- `docs/processes/DUPLICATE_PREVENTION_GUIDE.md` (NEW)

**Purpose:** Prevent duplicate content before insertion

**Status:** ❌ Missing - critical gap

### Component 5: Database Integration (Partial)

**Current Tools:**
- Basic SQL queries in verification process
- Database comparison script (basic)

**Required Enhancements:**
- Real-time database connectivity
- Duplicate detection queries
- Content similarity search
- Batch verification against database

### Component 6: Reporting & Documentation

**Files:**
- Verification reports (generated)
- Compliance reports (generated)

**Purpose:** Track quality, document decisions

**Status:** ⚠️ Partial - templates exist, need automation

---

## Workflows

### Workflow 1: Create New Guide

```
┌─────────────────────────────────────────┐
│ 1. IDEATION                             │
│    - Creator identifies topic           │
│    - Gathers research sources           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. DUPLICATE CHECK                      │
│    - Search database for similar topics │
│    - Search seed files                  │
│    - Review similarity scores           │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │  Duplicate?│
         └─────┬─────┘
         NO    │    YES
         │     │     │
         │     └─────┤
         │           ▼
         │     ┌─────────────────┐
         │     │ RESOLVE         │
         │     │ - Review match  │
         │     │ - Enhance or    │
         │     │   Cancel        │
         │     └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 3. CONTENT CREATION                     │
│    - Follow template structure          │
│    - Write required sections            │
│    - Cite sources                       │
│    - Meet word count minimums           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. SQL GENERATION                       │
│    - Format as INSERT statement         │
│    - Generate category linkage          │
│    - Validate SQL syntax                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. AUTOMATED VERIFICATION               │
│    - Run verify-guide.js                │
│    - Check word count, structure        │
│    - Validate fields                    │
│    - Calculate compliance score         │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │ Score≥80%? │
         └─────┬─────┘
         NO    │    YES
         │     │     │
         ▼     │     │
  ┌──────────┐│     │
  │ FIX      ││     │
  │ ISSUES   ││     │
  └─────┬────┘│     │
        │     │     │
        └─────┘     │
                    ▼
┌─────────────────────────────────────────┐
│ 6. MANUAL VERIFICATION (Optional)       │
│    - Fact-check against sources         │
│    - Verify permaculture relevance      │
│    - Check content alignment            │
│    - Generate detailed report           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 7. FINALIZATION                         │
│    - Save to seed file                  │
│    - Update documentation               │
│    - Mark ready for migration           │
└─────────────────────────────────────────┘
```

### Workflow 2: Verify Existing Content

```
┌─────────────────────────────────────────┐
│ 1. SELECT CONTENT                       │
│    - From database or seed file         │
│    - By slug, ID, or batch              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. AUTOMATED CHECKS                     │
│    - Extract metrics                    │
│    - Validate structure                 │
│    - Check required fields              │
│    - Calculate scores                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. MANUAL REVIEW                        │
│    - Search Wikipedia                   │
│    - Find authoritative sources         │
│    - Verify facts                       │
│    - Assess permaculture relevance      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. REPORT GENERATION                    │
│    - Fill report template               │
│    - Calculate overall score            │
│    - List recommendations               │
│    - Save to verification directory     │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │  PASS?    │
         └─────┬─────┘
         YES   │    NO
         │     │     │
         │     └─────┤
         │           ▼
         │     ┌─────────────────┐
         │     │ REMEDIATION     │
         │     │ - Fix issues    │
         │     │ - Re-verify     │
         │     └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 5. APPROVAL                             │
│    - Mark as verified                   │
│    - Ready for migration/publication    │
└─────────────────────────────────────────┘
```

### Workflow 3: Batch Duplicate Detection

```
┌─────────────────────────────────────────┐
│ 1. LOAD CONTENT                         │
│    - Database: Query all content        │
│    - Seed Files: Parse all SQL files    │
│    - Create searchable index            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. ANALYZE SLUGS                        │
│    - Find exact duplicates              │
│    - Report conflicts immediately       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. ANALYZE TITLES                       │
│    - Calculate similarity scores        │
│    - Flag >90% matches                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. ANALYZE CONTENT                      │
│    - Extract key phrases                │
│    - Calculate content overlap          │
│    - Flag >70% matches                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. ANALYZE CATEGORIES/TAGS              │
│    - Find topic overlap                 │
│    - Flag 3+ matching categories        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 6. ANALYZE GEOGRAPHY (Events/Locations) │
│    - Calculate coordinate distances     │
│    - Flag <100m proximity               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 7. GENERATE REPORT                      │
│    - List all potential duplicates      │
│    - Group by similarity level          │
│    - Provide recommendations            │
│    - Save to reports directory          │
└─────────────────────────────────────────┘
```

---

## Success Criteria

### System-Level Success Criteria

1. **Consistency Rate:** 95%+ of content follows templates
2. **Quality Pass Rate:** 80%+ of submitted content passes verification
3. **Duplicate Prevention:** <5% duplicate submissions reach database
4. **Automation Coverage:** 70%+ of verification checks automated
5. **User Satisfaction:** 85%+ of creators find system helpful
6. **Processing Time:** Verification completes in <10 seconds
7. **Documentation Coverage:** 100% of processes documented

### Content Quality Success Criteria

**Guides:**
- 90%+ have 1,000+ words
- 85%+ include Resources section with 5+ sources
- 80%+ pass factual accuracy check
- 95%+ have all required sections

**Events:**
- 95%+ have description 300+ characters
- 90%+ have valid future dates
- 85%+ have location coordinates
- 80%+ have clear pricing information

**Locations:**
- 95%+ have description 400+ characters
- 99%+ have validated coordinates
- 85%+ have 5+ relevant tags
- 80%+ have contact information

### Process Success Criteria

1. **Creation Time:** Average guide created in <2 hours
2. **Verification Time:** Automated check completes in <10 seconds
3. **Manual Review Time:** <30 minutes per guide
4. **Duplicate Detection:** Finds 100% exact duplicates, 90%+ near-duplicates
5. **Fix Time:** Issues can be fixed in <30 minutes on average

---

## Implementation Phases

### Phase 1: Foundation Consolidation (Week 1)

**Objective:** Consolidate existing documentation and fix critical gaps

**Tasks:**
1. ✅ Create requirements document (this document)
2. 🔲 Enhance WIKI_GUIDE_VERIFICATION_PROCESS.md with missing content:
   - Add database schema reference
   - Add SQL formatting requirements
   - Add complete quality checklist
   - Add content structure template
3. 🔲 Create DUPLICATE_PREVENTION_GUIDE.md
4. 🔲 Document event verification process
5. 🔲 Document location verification process

**Deliverables:**
- Complete verification process documentation
- Duplicate prevention guide
- Enhanced quality checklists

### Phase 2: Automation Enhancement (Week 2)

**Objective:** Enhance and expand automation tools

**Tasks:**
1. 🔲 Enhance verify-guide.js:
   - Add SQL format validation
   - Add template compliance checks
   - Add database duplicate checking
2. 🔲 Create verify-event.js
3. 🔲 Create verify-location.js
4. 🔲 Create check-duplicates.js:
   - Database connectivity
   - Seed file parsing
   - Similarity algorithms
   - Comprehensive reporting
5. 🔲 Enhance generate-wiki-content.js:
   - Interactive prompts
   - Real-time validation
   - Duplicate checking integration

**Deliverables:**
- Enhanced verification scripts
- Comprehensive duplicate checker
- Interactive creation tool

### Phase 3: Integration & Testing (Week 3)

**Objective:** Integrate all components and test end-to-end

**Tasks:**
1. 🔲 Create unified CLI tool for all content types
2. 🔲 Test guide creation workflow end-to-end
3. 🔲 Test event creation workflow end-to-end
4. 🔲 Test location creation workflow end-to-end
5. 🔲 Test duplicate detection with various scenarios
6. 🔲 Test batch verification of existing seed files
7. 🔲 Document all npm scripts
8. 🔲 Create usage examples and tutorials

**Deliverables:**
- Unified content creation CLI
- Test results documentation
- User guides and tutorials

### Phase 4: Production Readiness (Week 4)

**Objective:** Prepare for production use

**Tasks:**
1. 🔲 Create content creator onboarding guide
2. 🔲 Create verifier training materials
3. 🔲 Set up automated testing
4. 🔲 Create troubleshooting guide
5. 🔲 Document common issues and solutions
6. 🔲 Create metrics/reporting dashboard (optional)
7. 🔲 Final system documentation review

**Deliverables:**
- Onboarding materials
- Training documentation
- Production-ready system

---

## Appendix A: File Structure

### Required Files (After Implementation)

```
/Permahub
├── /docs
│   ├── /features
│   │   ├── wiki-content-guide.md (✅ exists, 73KB)
│   │   ├── wiki-schema-compliance.md (✅ exists)
│   │   └── wiki-verification.md (✅ exists)
│   ├── /processes
│   │   ├── CONTENT_CREATION_SYSTEM_REQUIREMENTS.md (✅ this file)
│   │   ├── WIKI_GUIDE_VERIFICATION_PROCESS.md (⚠️ needs enhancement)
│   │   ├── WIKI_EVENT_VERIFICATION_PROCESS.md (🔲 to create)
│   │   ├── WIKI_LOCATION_VERIFICATION_PROCESS.md (🔲 to create)
│   │   ├── DUPLICATE_PREVENTION_GUIDE.md (🔲 to create)
│   │   └── VERIFICATION_SYSTEM_README.md (✅ exists)
│   ├── /templates
│   │   ├── GUIDE_VERIFICATION_REPORT_TEMPLATE.md (✅ exists)
│   │   ├── EVENT_VERIFICATION_REPORT_TEMPLATE.md (🔲 to create)
│   │   └── LOCATION_VERIFICATION_REPORT_TEMPLATE.md (🔲 to create)
│   └── /verification
│       ├── /2025-11-15 (✅ exists)
│       └── /2025-11-16 (✅ exists)
├── /scripts
│   ├── verify-guide.js (⚠️ exists, needs enhancement)
│   ├── verify-event.js (🔲 to create)
│   ├── verify-location.js (🔲 to create)
│   ├── verify-seed-file.js (✅ exists, 25KB)
│   ├── check-duplicates.js (🔲 to create - CRITICAL)
│   ├── create-guide-interactive.js (🔲 to create)
│   ├── create-event-interactive.js (🔲 to create)
│   ├── create-location-interactive.js (🔲 to create)
│   ├── generate-wiki-content.js (⚠️ exists, needs enhancement)
│   ├── analyze-seed-files.js (✅ exists)
│   └── check-database-vs-seeds.js (✅ exists)
└── /supabase
    └── /to-be-seeded (✅ exists)
        ├── 004_future_events_seed.sql (✅ 100% ready)
        ├── 004_real_verified_wiki_content.sql (⚠️ 67% ready)
        ├── 005_wiki_content_improvements.sql (✅ exists)
        ├── 006_events_locations_improvements.sql (✅ exists)
        └── seed_madeira_czech.sql (⚠️ 89% ready)
```

---

## Appendix B: npm Scripts

### Recommended Package.json Scripts

```json
{
  "scripts": {
    "content:create:guide": "node scripts/create-guide-interactive.js",
    "content:create:event": "node scripts/create-event-interactive.js",
    "content:create:location": "node scripts/create-location-interactive.js",

    "verify:guide": "node scripts/verify-guide.js",
    "verify:event": "node scripts/verify-event.js",
    "verify:location": "node scripts/verify-location.js",
    "verify:all-guides": "node scripts/verify-guide.js --all",

    "verify:seed:file": "node scripts/verify-seed-file.js",
    "verify:seed:madeira": "node scripts/verify-seed-file.js supabase/to-be-seeded/seed_madeira_czech.sql",
    "verify:seed:verified": "node scripts/verify-seed-file.js supabase/to-be-seeded/004_real_verified_wiki_content.sql",
    "verify:seed:events": "node scripts/verify-seed-file.js supabase/to-be-seeded/004_future_events_seed.sql",
    "verify:seed:all": "node scripts/verify-seed-file.js --all",

    "check:duplicates": "node scripts/check-duplicates.js",
    "check:duplicates:guides": "node scripts/check-duplicates.js --type=guides",
    "check:duplicates:events": "node scripts/check-duplicates.js --type=events",
    "check:duplicates:locations": "node scripts/check-duplicates.js --type=locations",

    "analyze:seeds": "node scripts/analyze-seed-files.js",
    "compare:db-seeds": "node scripts/check-database-vs-seeds.js"
  }
}
```

---

## Appendix C: Quality Metrics Dashboard

### Recommended Metrics to Track

**Content Creation Metrics:**
- Total guides/events/locations created
- Average creation time
- Automation vs manual creation ratio
- Most popular categories

**Quality Metrics:**
- Average verification score
- Pass/fail ratio
- Most common issues
- Time to fix issues

**Duplication Metrics:**
- Duplicates detected
- Duplicates prevented
- False positive rate
- Time saved by prevention

**Efficiency Metrics:**
- Verification time (automated)
- Review time (manual)
- Content approval rate
- System uptime/reliability

---

**End of Requirements Document**

**Next Steps:**
1. Review and approve requirements
2. Prioritize features for Phase 1
3. Begin implementation of critical gaps
4. Set up project tracking
