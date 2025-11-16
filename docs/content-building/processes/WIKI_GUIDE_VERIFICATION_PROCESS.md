# Wiki Guide Systematic Verification Process

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/WIKI_GUIDE_VERIFICATION_PROCESS.md

**Description:** Complete systematic process for verifying wiki guide accuracy, compliance, and quality

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

**Version:** 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Verification Workflow](#verification-workflow)
4. [Step-by-Step Process](#step-by-step-process)
5. [Scoring Methodology](#scoring-methodology)
6. [Report Generation](#report-generation)
7. [Tools and Commands](#tools-and-commands)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

This document defines the systematic, repeatable process for verifying wiki guides against quality standards defined in [WIKI_CONTENT_CREATION_GUIDE.md](../WIKI_CONTENT_CREATION_GUIDE.md).

### Scope

**Applies to:**
- wiki_guides table content
- New guide submissions
- Updated guide revisions
- Periodic quality audits

**Verification covers:**
- Content accuracy (facts checked against authoritative sources)
- Content alignment (title/summary/content consistency)
- Structural compliance (word count, sections, formatting)
- Source documentation (citations, references)
- Permaculture relevance
- SQL seed file format compliance

### Output

Each verification produces:
- Detailed verification report (markdown file)
- Compliance score (0-100%)
- Prioritized recommendations
- Source documentation
- Pass/Fail determination

---

## Prerequisites

### Required Access

- ✅ PostgreSQL database access (local or remote)
- ✅ Internet access for web searches
- ✅ Access to WIKI_CONTENT_CREATION_GUIDE.md

### Required Tools

**For Manual Verification:**
- PostgreSQL client (psql or GUI)
- Web browser
- Text editor
- Access to WebSearch capability

**For Automated Verification:**
- Node.js (v18+)
- `/scripts/verify-guide.js` (optional automation script)

### Required Knowledge

- Understanding of WIKI_CONTENT_CREATION_GUIDE.md standards
- Basic SQL queries
- Web research skills
- Markdown formatting

---

## Verification Workflow

```
┌─────────────────────────────────────┐
│  1. SELECT GUIDE TO VERIFY          │
│     (by slug or ID)                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. RETRIEVE GUIDE DATA             │
│     - Title, slug, summary, content │
│     - Calculate metrics             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. VERIFY CONTENT ALIGNMENT        │
│     - Title ↔ Summary               │
│     - Title ↔ Content               │
│     - Summary ↔ Content             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. SEARCH WIKIPEDIA                │
│     - Find article or document none │
│     - Extract key facts             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. SEARCH AUTHORITATIVE SOURCES    │
│     - .edu extension services       │
│     - .gov resources                │
│     - Academic publications         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. VERIFY FACTUAL ACCURACY         │
│     - Compare guide facts to sources│
│     - Note discrepancies            │
│     - Calculate accuracy %          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  7. CHECK STRUCTURAL COMPLIANCE     │
│     - Word count                    │
│     - Required sections             │
│     - Formatting                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  8. VERIFY PERMACULTURE RELEVANCE   │
│     - Connection to principles      │
│     - Sustainability focus          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  9. CALCULATE COMPLIANCE SCORES     │
│     - Per-category scores           │
│     - Overall score                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  10. GENERATE VERIFICATION REPORT   │
│      - Save to /docs/verification/  │
│      - Include all findings         │
└─────────────────────────────────────┘
```

---

## Step-by-Step Process

### Step 1: Retrieve Guide Data

**Query the database:**

```sql
SELECT
  id,
  title,
  slug,
  summary,
  content,
  status,
  created_at,
  updated_at,
  published_at
FROM wiki_guides
WHERE slug = 'your-guide-slug-here';
```

**Calculate metrics:**

```sql
SELECT
  title,
  slug,
  LENGTH(summary) as summary_length,
  LENGTH(content) as content_length,
  LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count,
  LENGTH(content) - LENGTH(REPLACE(content, '\n', '')) as line_count
FROM wiki_guides
WHERE slug = 'your-guide-slug-here';
```

**Check category assignments:**

```sql
SELECT
  g.title,
  g.slug,
  STRING_AGG(c.name, ', ') as categories,
  COUNT(c.id) as category_count
FROM wiki_guides g
LEFT JOIN wiki_guide_categories gc ON g.id = gc.guide_id
LEFT JOIN wiki_categories c ON gc.category_id = c.id
WHERE g.slug = 'your-guide-slug-here'
GROUP BY g.id, g.title, g.slug;
```

**Record in verification report:**
- Guide ID
- Title
- Slug
- Summary length (chars)
- Content length (chars)
- Word count
- Number of categories
- Publication status
- Dates (created, updated, published)

---

### Step 2: Verify Content Alignment

Check three alignment relationships:

#### 2.1 Title ↔ Summary Alignment

**Questions to answer:**
- Does the summary accurately reflect what the title promises?
- Does the summary describe the same topic as the title?
- Is the scope in the summary consistent with the title's scope?

**Evaluation:**
- ✅ **PASS:** Summary accurately describes what title promises
- ⚠️ **PARTIAL:** Summary is related but scope differs (too broad/narrow)
- ❌ **FAIL:** Summary describes different topic or misleads

**Example evaluation:**
```
Title: "Starting Your First Backyard Flock"
Summary: "Everything you need to know about raising chickens in your backyard, from coop design to daily care routines."

Assessment: ✅ PASS - Summary accurately reflects title's beginner focus on backyard chickens
```

#### 2.2 Title ↔ Content Alignment

**Questions to answer:**
- Does the content deliver what the title promises?
- Are all major sections relevant to the title's topic?
- Does the content stay focused on the stated subject?

**Check for:**
- Off-topic sections that belong in different guides
- Content that's too broad or too narrow for the title
- Missing essential topics that the title implies

**Evaluation:**
- ✅ **PASS:** Content comprehensively covers what title promises
- ⚠️ **PARTIAL:** Content covers topic but lacks depth or has minor drift
- ❌ **FAIL:** Content doesn't deliver on title promise or major drift

#### 2.3 Summary ↔ Content Alignment

**Questions to answer:**
- Does the full content match what the summary describes?
- Are the key points mentioned in the summary actually covered in depth?
- Does the content provide what the summary promises?

**Red flags:**
- Summary promises specific information not in content
- Content covers topics not mentioned in summary
- Summary oversells what content delivers

**Record alignment scores:**
- Title ↔ Summary: Pass/Partial/Fail (percentage)
- Title ↔ Content: Pass/Partial/Fail (percentage)
- Summary ↔ Content: Pass/Partial/Fail (percentage)
- Overall Alignment Score: Average of three

---

### Step 3: Search for Wikipedia Article

**Search query format:**
```
"[topic name] wikipedia"
```

**Examples:**
- "backyard chickens wikipedia"
- "lacto-fermentation wikipedia"
- "oyster mushroom cultivation wikipedia"

**Process:**

1. **Execute search:**
   - Use web search engine or WebSearch tool
   - Look for `en.wikipedia.org` results

2. **Evaluate results:**
   - ✅ **Found:** Direct Wikipedia article exists
   - ⚠️ **Partial:** Related Wikipedia article (broader/narrower topic)
   - ❌ **Not Found:** No Wikipedia article exists

3. **Record Wikipedia information:**
   ```
   Wikipedia Article:
   - Status: Found / Partial / Not Found
   - URL: https://en.wikipedia.org/wiki/Article_Name
   - Title: [Exact Wikipedia article title]
   - Last checked: YYYY-MM-DD
   ```

4. **If found, extract key facts:**
   - Read Wikipedia article
   - Note key definitions, measurements, processes
   - Identify facts that appear in the guide
   - Note any contradictions

**Example documentation:**
```
Wikipedia Verification:
- Article: https://en.wikipedia.org/wiki/Urban_chicken_keeping
- Status: ✅ Found (directly relevant)
- Key facts extracted:
  * Common concerns: noise, odor, predators, health
  * Over 300 chicken breeds exist
  * Municipal regulations vary by location
  * Health concerns: bird flu, salmonella (low risk if proper care)
- Verified: 2025-11-15
```

---

### Step 4: Search for Authoritative Sources

**If Wikipedia found:** Search for 1-2 additional authoritative sources
**If Wikipedia NOT found:** Search for 2-3 authoritative sources (required)

#### 4.1 Extension Service Search

**Search queries:**
```
"[topic] site:.edu"
"[topic] extension service"
"[topic] university extension"
```

**Acceptable sources:**
- University extension services (.edu domains)
- Land-grant university publications
- Agricultural extension programs
- Horticultural extension guides

**Examples:**
- Oregon State University Extension
- University of Minnesota Extension
- Penn State Extension
- University of Illinois Extension

#### 4.2 Government Resource Search

**Search queries:**
```
"[topic] site:.gov"
"[topic] USDA"
"[topic] EPA"
```

**Acceptable sources:**
- USDA publications
- EPA guides
- National agricultural agencies
- Government research publications

#### 4.3 Academic/Peer-Reviewed Search

**Search queries:**
```
"[topic] research study"
"[topic] scientific publication"
"[topic] peer-reviewed"
```

**Acceptable sources:**
- PubMed/NCBI articles
- Academic journals
- Research publications
- Scientific papers

#### 4.4 Evaluate Source Quality

For each source found, evaluate:

**Authority:**
- [ ] Author credentials verifiable?
- [ ] Institution reputable?
- [ ] Domain appropriate (.edu, .gov, .org)?

**Relevance:**
- [ ] Tightly relevant to guide topic?
- [ ] Covers main aspects of guide?
- [ ] Not just tangentially related?

**Currency:**
- [ ] Publication date recent (within 10 years)?
- [ ] Information still current?
- [ ] No outdated practices?

**Consensus:**
- [ ] Multiple sources agree on key facts?
- [ ] No major contradictions?
- [ ] Represents current best practices?

#### 4.5 Record Source Information

```
Authoritative Sources Found:

Source 1:
- Name: Oregon State University Extension
- Title: "Backyard Chicken Coop Design"
- URL: https://extension.oregonstate.edu/catalog/ec-1644...
- Type: .edu Extension Service
- Publication Date: 2023
- Relevance: ✅ Directly covers coop requirements
- Authority: ✅ Land-grant university extension
- Key Facts: [list specific facts extracted]

Source 2:
- Name: University Extension Services
- Title: "Chicken Feed Protein Requirements"
- URL: [URL]
- Type: .edu Extension
- Publication Date: 2024
- Relevance: ✅ Covers nutrition topic
- Authority: ✅ University agricultural extension
- Key Facts: [list specific facts extracted]

Sources Status: ✅ PASS (2 authoritative sources found)
```

---

### Step 5: Verify Factual Accuracy

**Compare guide content against sources:**

#### 5.1 Extract Factual Claims from Guide

Identify all factual claims in the guide:
- Measurements (space, temperature, etc.)
- Ratios (salt %, spawn %, protein %)
- Timeframes (fermentation time, fruiting days)
- Processes (step-by-step instructions)
- Requirements (materials, conditions)

**Example extraction:**
```
Guide Claims:
1. "4 sq ft per bird inside coop"
2. "10 sq ft per bird in run"
3. "1 nest box per 3-4 hens"
4. "10 inches of roosting bar per bird"
5. "Layer feed: 16% protein"
6. "Starter feed: 20-24% protein"
```

#### 5.2 Cross-Reference Each Claim

For each claim, check against sources:

**Claim 1:** "4 sq ft per bird inside coop"
- Wikipedia: [Not specifically mentioned]
- OSU Extension: "3 sq ft with outdoor access, 8-10 sq ft without"
- Verification: ✅ ACCURATE (guide uses conservative 4 sq ft, within range)

**Claim 2:** "Layer feed: 16% protein"
- Extension sources: "15-18% protein for layers"
- Verification: ✅ ACCURATE (16% is within recommended range)

**Claim 3:** "Starter feed: 20-24% protein"
- Extension sources: "20-24% protein for chicks"
- Verification: ✅ ACCURATE (exact match)

#### 5.3 Document Discrepancies

If guide contradicts sources:

**Record:**
- Guide claim: [exact quote]
- Source information: [what sources say]
- Discrepancy: [describe difference]
- Severity: Minor / Moderate / Severe
- Recommendation: Correct / Note / Investigate

**Example:**
```
DISCREPANCY FOUND:
- Guide claims: "Ferment for 2 weeks"
- Sources state: "3-4 weeks at 68-72°F"
- Severity: Moderate (could lead to under-fermentation)
- Recommendation: Correct guide to 3-4 weeks
```

#### 5.4 Calculate Accuracy Score

**Formula:**
```
Accuracy % = (Verified Correct Claims / Total Factual Claims) × 100
```

**Example:**
```
Total claims checked: 15
Accurate: 13
Minor discrepancies: 1
Major errors: 1

Accuracy Score: 13/15 = 87%
```

**Grading:**
- 95-100%: ✅ Excellent
- 85-94%: ✅ Good
- 70-84%: ⚠️ Needs improvement
- Below 70%: ❌ Significant errors

---

### Step 6: Check Structural Compliance

#### 6.1 Word Count Verification

**Requirement:** Minimum 1,000 words (optimal 1,500-5,000)

**Check:**
```sql
SELECT
  title,
  LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count,
  CASE
    WHEN LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 >= 1500 THEN 'Optimal'
    WHEN LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 >= 1000 THEN 'Minimum Met'
    ELSE 'Below Minimum'
  END as word_count_status
FROM wiki_guides
WHERE slug = 'your-guide-slug';
```

**Score:**
- 1,500+ words: 100%
- 1,000-1,499 words: 80%
- 500-999 words: 50%
- Below 500 words: 25%

#### 6.2 Summary Length Verification

**Requirement:** 150-250 characters (recommended)

**Check:**
```sql
SELECT
  title,
  LENGTH(summary) as summary_length,
  CASE
    WHEN LENGTH(summary) BETWEEN 150 AND 250 THEN 'Optimal'
    WHEN LENGTH(summary) BETWEEN 100 AND 149 THEN 'Short'
    WHEN LENGTH(summary) > 250 THEN 'Too Long'
    ELSE 'Too Short'
  END as summary_status
FROM wiki_guides
WHERE slug = 'your-guide-slug';
```

**Score:**
- 150-250 chars: 100%
- 100-149 chars: 70%
- 251-300 chars: 70%
- Below 100 or above 300: 40%

#### 6.3 Required Sections Check

**Must have these sections:**

**Introduction Section:**
- [ ] Present in content
- [ ] 2-3 paragraphs minimum
- [ ] Explains topic and what readers will learn
- [ ] Lists key benefits (3-5 bullet points)

**Main Content Sections:**
- [ ] At least 4 major sections (##)
- [ ] Logical organization
- [ ] Subsections where appropriate (###)

**Troubleshooting Section:**
- [ ] Common problems identified
- [ ] Solutions provided
- [ ] Symptoms described

**Resources & Further Learning:**
- [ ] Present in content
- [ ] Verified sources listed (Wikipedia, .edu, .gov)
- [ ] Recommended reading included
- [ ] Related guides linked

**Conclusion:**
- [ ] Present in content
- [ ] 2-3 paragraphs
- [ ] Summarizes key takeaways
- [ ] Encourages next steps

**Score calculation:**
```
Sections Present / Sections Required × 100 = Section Score
```

Example:
- Required: 5 sections (Intro, Main, Troubleshooting, Resources, Conclusion)
- Present: 2 sections (Intro, Main)
- Score: 2/5 × 100 = 40%

#### 6.4 Markdown Formatting Check

**Verify:**
- [ ] Proper heading hierarchy (# → ## → ###)
- [ ] Lists formatted correctly (- or *)
- [ ] Bold/italic used appropriately
- [ ] Code blocks if applicable (```)
- [ ] Links formatted correctly ([text](url))
- [ ] No broken formatting

---

### Step 7: Verify Permaculture Relevance

#### 7.1 Connection to Permaculture Principles

**Check against permaculture ethics:**
- [ ] Earth Care - Does it benefit ecosystems/environment?
- [ ] People Care - Does it support human wellbeing?
- [ ] Fair Share - Does it promote sharing/redistribution?

**Check against permaculture principles:**
- [ ] Observe and interact
- [ ] Catch and store energy
- [ ] Obtain a yield
- [ ] Apply self-regulation
- [ ] Use renewable resources
- [ ] Produce no waste
- [ ] Design from patterns to details
- [ ] Integrate rather than segregate
- [ ] Use small and slow solutions
- [ ] Use and value diversity
- [ ] Use edges and value the marginal
- [ ] Creatively use and respond to change

**Must connect to at least 2 principles**

#### 7.2 Sustainability Focus

**Check for:**
- [ ] Reduces waste
- [ ] Recycles resources
- [ ] Closed-loop systems
- [ ] No synthetic chemicals
- [ ] Local/renewable resources
- [ ] Biodiversity support
- [ ] Climate resilience
- [ ] Traditional/indigenous knowledge

#### 7.3 Practical Value for Permahub Community

**Questions:**
- Is this actionable for practitioners?
- Does it provide homesteading/sustainable living value?
- Is it appropriate for small-scale application?
- Does it support food security/self-sufficiency?

**Score:**
- Strong permaculture connection + high practical value: 100%
- Clear connection + good practical value: 85%
- Weak connection or limited practical value: 60%
- No clear permaculture connection: 0% (FAIL - not suitable for Permahub)

---

### Step 8: Check Source Citation Compliance

#### 8.1 Resources Section Present?

**Check if guide includes:**
```markdown
## Resources & Further Learning

**Verified Sources:**
- [Source 1 with URL]
- [Source 2 with URL]

**Recommended Reading:**
- Book 1
- Book 2

**Related Guides:**
- [Guide 1](#)
- [Guide 2](#)
```

**Score:**
- Complete Resources section with verified sources: 100%
- Resources section present but incomplete: 50%
- No Resources section: 0%

#### 8.2 SQL Verification Notes Present?

**Check if seed file includes:**
```sql
-- VERIFICATION NOTES
-- Wikipedia: [URL] (verified YYYY-MM-DD)
-- Source 1: [Name and URL]
-- Source 2: [Name and URL]
-- Accuracy: VERIFIED / PARTIAL / NEEDS REVIEW
-- Last verification: YYYY-MM-DD
```

**Score:**
- Complete SQL verification notes: 100%
- Partial notes: 50%
- No verification notes: 0%

---

### Step 9: Calculate Overall Compliance Score

#### Scoring Breakdown

| Category | Weight | How to Score |
|----------|--------|--------------|
| **Word Count** | 15% | Based on 1,000+ word requirement |
| **Accuracy** | 25% | % of facts verified correct |
| **Source Citations** | 15% | Resources section + SQL notes |
| **Content Alignment** | 15% | Avg of 3 alignment checks |
| **Structure** | 15% | Required sections present |
| **Permaculture Relevance** | 10% | Connection strength + value |
| **Summary Quality** | 5% | Length + alignment |
| **TOTAL** | **100%** | Weighted average |

#### Calculation Formula

```
Overall Score =
  (Word Count Score × 0.15) +
  (Accuracy Score × 0.25) +
  (Citation Score × 0.15) +
  (Alignment Score × 0.15) +
  (Structure Score × 0.15) +
  (Relevance Score × 0.10) +
  (Summary Score × 0.05)
```

#### Example Calculation

```
Guide: "Starting Your First Backyard Flock"

Word Count: 200 words = 20% of minimum = 20/100 × 15% = 3%
Accuracy: 95% verified = 95/100 × 25% = 24%
Citations: No resources section = 0/100 × 15% = 0%
Alignment: 70% average = 70/100 × 15% = 11%
Structure: 40% sections present = 40/100 × 15% = 6%
Relevance: 100% strong connection = 100/100 × 10% = 10%
Summary: 70% (short but aligned) = 70/100 × 5% = 4%

Overall Score = 3 + 24 + 0 + 11 + 6 + 10 + 4 = 58%
```

#### Pass/Fail Determination

**Grading Scale:**
- **90-100%:** ✅ Excellent - Publish immediately
- **80-89%:** ✅ Good - Minor revisions recommended
- **70-79%:** ⚠️ Acceptable - Moderate revisions needed
- **60-69%:** ⚠️ Below Standard - Significant revisions required
- **Below 60%:** ❌ Does Not Meet Standards - Major revision or reject

**Critical Failures (Automatic Fail):**
- Accuracy below 70% (dangerous misinformation)
- No permaculture relevance (wrong platform)
- Plagiarism detected (ethical violation)

---

## Report Generation

### Report Template Location

`/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md`

### Report File Naming

```
/docs/verification/YYYY-MM-DD/[guide-slug]-verification.md
```

Example:
```
/docs/verification/2025-11-15/starting-first-backyard-flock-verification.md
```

### Report Structure

```markdown
# Guide Verification Report: [Guide Title]

**Guide Slug:** `guide-slug-here`
**Verification Date:** YYYY-MM-DD
**Verified By:** [Name or "Automated System"]
**Overall Score:** XX%

---

## 1. Guide Metadata

- **Title:** [Full title]
- **Slug:** [slug]
- **Status:** [draft/published/archived]
- **Word Count:** XXX words
- **Summary Length:** XXX characters
- **Categories:** X assigned ([list])
- **Created:** YYYY-MM-DD
- **Last Updated:** YYYY-MM-DD

---

## 2. Content Alignment Verification

### Title ↔ Summary: [✅/⚠️/❌] XX%
[Assessment and reasoning]

### Title ↔ Content: [✅/⚠️/❌] XX%
[Assessment and reasoning]

### Summary ↔ Content: [✅/⚠️/❌] XX%
[Assessment and reasoning]

**Overall Alignment Score:** XX%

---

## 3. External Source Verification

### Wikipedia
- **Status:** [Found/Not Found]
- **URL:** [URL or "N/A"]
- **Relevance:** [Direct/Partial/None]
- **Last Verified:** YYYY-MM-DD

### Authoritative Sources
**Source 1:**
- Name: [Source name]
- URL: [URL]
- Type: [.edu/.gov/academic]
- Relevance: [Rating]

**Source 2:**
[Same structure]

---

## 4. Factual Accuracy Check

### Facts Verified: XX total

| Claim | Source Says | Status | Notes |
|-------|-------------|--------|-------|
| [Claim 1] | [Source info] | ✅/⚠️/❌ | [Notes] |
| [Claim 2] | [Source info] | ✅/⚠️/❌ | [Notes] |

**Accuracy Score:** XX% (XX correct / XX total)

---

## 5. Structural Compliance

### Word Count
- **Current:** XXX words
- **Required:** 1,000 minimum
- **Status:** [✅/⚠️/❌]
- **Score:** XX%

### Required Sections
- [ ] Introduction with key benefits
- [ ] Main content (4+ sections)
- [ ] Troubleshooting
- [ ] Resources & Further Learning
- [ ] Conclusion

**Section Score:** XX%

---

## 6. Permaculture Relevance

### Connection to Principles
[List which principles apply and how]

### Sustainability Focus
[Describe sustainability connections]

### Practical Value
[Assess practical value for Permahub community]

**Relevance Score:** XX%

---

## 7. Source Citation Compliance

### Resources Section
- **Present:** [Yes/No]
- **Verified Sources Listed:** [Yes/No]
- **Quality:** [Excellent/Good/Poor/Missing]

### SQL Verification Notes
- **Present:** [Yes/No/Unknown]
- **Complete:** [Yes/No/Unknown]

**Citation Score:** XX%

---

## 8. Overall Compliance Score

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Word Count | XX% | 15% | XX% |
| Accuracy | XX% | 25% | XX% |
| Citations | XX% | 15% | XX% |
| Alignment | XX% | 15% | XX% |
| Structure | XX% | 15% | XX% |
| Relevance | XX% | 10% | XX% |
| Summary | XX% | 5% | XX% |
| **OVERALL** | **XX%** | **100%** | **XX%** |

**Grade:** [✅ Excellent / ✅ Good / ⚠️ Acceptable / ⚠️ Below Standard / ❌ Does Not Meet Standards]

---

## 9. Issues Identified

### 🔴 Critical Issues
1. [Issue description]
2. [Issue description]

### ⚠️ Important Issues
1. [Issue description]
2. [Issue description]

### ℹ️ Minor Issues
1. [Issue description]

---

## 10. Recommendations

### Immediate Actions (Priority 1)
1. [Action item with specific guidance]
2. [Action item with specific guidance]

### High Priority Actions
1. [Action item]
2. [Action item]

### Medium Priority Actions
1. [Action item]

---

## 11. Suggested Resources to Add

```markdown
## Resources & Further Learning

**Verified Sources:**
- [Wikipedia: Topic](URL) - Description (verified YYYY-MM-DD)
- [Source 2: Name](URL) - Description

**Recommended Reading:**
- Book/Article 1
- Book/Article 2

**Related Guides:**
- [Guide Title 1](#)
- [Guide Title 2](#)
```

---

## 12. Verification Checklist

**Content Alignment:**
- [ ] Title accurately reflects content scope
- [ ] Summary matches both title and content
- [ ] Content delivers on title's promise
- [ ] No off-topic sections or content drift
- [ ] All sections relevant to main topic

**Source Verification:**
- [ ] Wikipedia checked (URL recorded or "not found")
- [ ] 2+ authoritative sources identified
- [ ] Sources are tightly relevant
- [ ] Content facts verified against sources
- [ ] No contradictions with sources
- [ ] Sources cited in Resources section

**Structural:**
- [ ] Meets word count minimum (1,000+)
- [ ] Summary appropriate length (150-250)
- [ ] All required sections present
- [ ] Proper markdown formatting

**Quality:**
- [ ] Clear permaculture connection
- [ ] Accurate information (85%+)
- [ ] Practical, actionable content
- [ ] No dangerous misinformation

---

## 13. Final Verdict

**Status:** [✅ APPROVED / ⚠️ APPROVED WITH REVISIONS / ❌ REJECTED]

**Reasoning:**
[Explain final determination]

**Next Steps:**
[What should happen next]

---

**Verification Complete**
**Report Generated:** YYYY-MM-DD HH:MM:SS
```

---

## Tools and Commands

### Database Queries

**Retrieve guide:**
```sql
SELECT * FROM wiki_guides WHERE slug = 'guide-slug';
```

**Get metrics:**
```sql
SELECT
  title,
  slug,
  LENGTH(summary) as summary_len,
  LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count,
  status
FROM wiki_guides
WHERE slug = 'guide-slug';
```

**Check categories:**
```sql
SELECT g.title, STRING_AGG(c.name, ', ') as categories
FROM wiki_guides g
LEFT JOIN wiki_guide_categories gc ON g.id = gc.guide_id
LEFT JOIN wiki_categories c ON gc.category_id = c.id
WHERE g.slug = 'guide-slug'
GROUP BY g.title;
```

### Web Search Queries

**Wikipedia:**
```
"[topic] wikipedia"
```

**Extension services:**
```
"[topic] site:.edu"
"[topic] extension service"
```

**Government resources:**
```
"[topic] site:.gov"
```

**Academic sources:**
```
"[topic] research study"
"[topic] peer-reviewed"
```

### Automation Script

```bash
# Run automated verification
node scripts/verify-guide.js --slug guide-slug-here

# Verify all guides
node scripts/verify-all-guides.js

# Generate report only
node scripts/verify-guide.js --slug guide-slug --report-only
```

---

## Troubleshooting

### Issue: Cannot find Wikipedia article

**Solution:**
1. Try broader search terms
2. Search for related topics
3. Document as "No Wikipedia article found"
4. Find 2+ authoritative sources instead (required)

### Issue: Sources contradict each other

**Solution:**
1. Find additional sources for consensus
2. Document both perspectives in report
3. Recommend guide present both views
4. Explain context for different approaches

### Issue: Cannot verify specific fact

**Solution:**
1. Search for more specific sources
2. Mark fact as "Unable to verify" in report
3. Flag for manual research
4. Recommend adding citation or removing claim

### Issue: Guide has no permaculture connection

**Solution:**
1. Automatic fail - does not belong in Permahub
2. Recommend rejection or major revision
3. Suggest alternative platforms if topic valid but not permaculture

### Issue: Accuracy below 70%

**Solution:**
1. Flag as critical issue
2. Recommend major revision or rejection
3. Document all errors clearly
4. Provide correct information from sources
5. Do not approve for publication

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-15 | Initial process documentation | Libor Ballaty |

---

**End of Process Documentation**
