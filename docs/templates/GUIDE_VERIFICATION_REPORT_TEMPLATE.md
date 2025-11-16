# Wiki Guide Verification Report Template

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md

**Description:** Standard template for wiki guide verification reports

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## Instructions for Use

This template provides the standard structure for wiki guide verification reports. Follow the systematic verification process documented in `/docs/processes/WIKI_GUIDE_VERIFICATION_PROCESS.md`.

**Key Instructions:**
1. Replace ALL `[PLACEHOLDER]` values with actual data
2. Run all SQL queries documented in the process guide
3. Search Wikipedia and authoritative sources
4. Calculate scores using documented formulas
5. Save completed report to: `/docs/verification/YYYY-MM-DD/[guide-slug]-verification.md`

---

# Wiki Guide Verification Report

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/verification/[YYYY-MM-DD]/[GUIDE-SLUG]-verification.md

**Guide Title:** [GUIDE TITLE]

**Guide Slug:** [guide-slug]

**Verification Date:** [YYYY-MM-DD]

**Verified By:** [Your Name or Agent Name]

---

## Executive Summary

**Overall Compliance Score:** [XX]% ([PASS/FAIL] - [Above/Below] 80% threshold)

**Critical Issues:**
- [List 3-5 most critical issues here]

**Strengths:**
- [List 3-5 strengths here]

---

## 1. Basic Metadata

**Database Query Used:**
```sql
SELECT
  title,
  slug,
  LENGTH(summary) as summary_length,
  LENGTH(content) as content_length,
  LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count,
  LENGTH(content) - LENGTH(REPLACE(content, '\n', '')) as line_count
FROM wiki_guides
WHERE slug = '[guide-slug]';
```

**Results:**
- **Title:** [TITLE]
- **Summary Length:** [XXX] characters
- **Content Length:** [XXX] characters
- **Word Count:** [XXX] words
- **Line Count:** [XX] lines

**Compliance:**
- [✅/❌] Title present and clear
- [✅/❌] Summary present ([XXX] chars - [within/outside] 100-150 range)
- [✅/❌] Word count [meets/below] minimum ([XXX]/1,000 = [XX]%)

---

## 2. Category Assignment

**Database Query Used:**
```sql
SELECT
  g.title,
  g.slug,
  STRING_AGG(c.name, ', ') as categories,
  COUNT(c.id) as category_count
FROM wiki_guides g
LEFT JOIN wiki_guide_categories gc ON g.id = gc.guide_id
LEFT JOIN wiki_categories c ON gc.category_id = c.id
WHERE g.slug = '[guide-slug]'
GROUP BY g.id, g.title, g.slug;
```

**Results:**
- **Categories:** [Category 1, Category 2, etc.]
- **Category Count:** [X]

**Compliance:**
- [✅/❌] Appropriate categories assigned
- [✅/❌] Multiple relevant categories used
- [Notes on category appropriateness]

---

## 3. Title/Summary/Content Alignment

**Title:** "[GUIDE TITLE]"

**Summary:** "[SUMMARY TEXT]"

**Content Topics Covered:**
- [Topic 1]
- [Topic 2]
- [Topic 3]
- [etc.]

**Alignment Assessment:**
- [✅/❌] Title accurately reflects content scope
- [✅/❌] Summary mentions topics covered in content
- [✅/❌] Content delivers on summary promises
- [✅/❌] No misleading claims or scope creep
- [Additional notes]

**Alignment Score:** [XX]%

---

## 4. External Source Verification

### Wikipedia Check

**Search Query:** "[search terms used]"

**Result:** [URL or "NOT FOUND"]

**Relevance:** [HIGHLY RELEVANT / RELEVANT / NOT RELEVANT / NOT FOUND]
- [Notes on why relevant/not relevant]
- [What topics are covered]
- [Currency and quality notes]

### Authoritative Sources Found

**Source 1:** [Source Name]
- **URL:** [URL if available]
- **Type:** [.edu extension / .gov agency / peer-reviewed / etc.]
- **Authority:** [High/Medium/Low]
- **Relevance:** [Highly relevant / Relevant / Tangential]
- **Notes:** [What this source covers]

**Source 2:** [Source Name]
- **URL:** [URL if available]
- **Type:** [.edu extension / .gov agency / peer-reviewed / etc.]
- **Authority:** [High/Medium/Low]
- **Relevance:** [Highly relevant / Relevant / Tangential]
- **Notes:** [What this source covers]

**Source 3:** [Source Name] (if applicable)
- **URL:** [URL if available]
- **Type:** [.edu extension / .gov agency / peer-reviewed / etc.]
- **Authority:** [High/Medium/Low]
- **Relevance:** [Highly relevant / Relevant / Tangential]
- **Notes:** [What this source covers]

**Source Quality Assessment:**
- [✅/❌] Wikipedia article found and [highly relevant / relevant / not relevant]
- [✅/❌] [Extension/Academic/Government] sources identified
- [✅/❌] Sources are authoritative and current

---

## 5. Factual Accuracy Verification

**Methodology:** Cross-reference guide claims against Wikipedia and authoritative sources

**Claims Verified:**

1. **Claim:** "[Factual claim from guide]"
   - **Source:** [Source where verified]
   - **Verification:** [CORRECT ✅ / PARTIALLY CORRECT ⚠️ / INCORRECT ❌]
   - **Notes:** [Any additional context]

2. **Claim:** "[Factual claim from guide]"
   - **Source:** [Source where verified]
   - **Verification:** [CORRECT ✅ / PARTIALLY CORRECT ⚠️ / INCORRECT ❌]
   - **Notes:** [Any additional context]

[Continue for all major factual claims - aim for 10-20 claims]

**Factual Claims:** [XX] total claims
**Verified Correct:** [XX] claims
**Partially Correct:** [XX] claims
**Incorrect/Unverified:** [XX] claims
**Accuracy Score:** [XX]%

**Calculation:** ([Verified Correct] + 0.5 × [Partially Correct]) / [Total Claims] × 100

---

## 6. Citation & Resources Section

**Resources Section Present:** [YES ✅ / NO ❌]

**In-Text Citations Present:** [YES ✅ / NO ❌]

**Expected Format:**
```markdown
## Resources & Further Learning

### Academic & Extension Sources
- [Source 1 with URL]
- [Source 2 with URL]

### Online Resources
- [Wikipedia or other quality web resources]

### Books & Publications
- [Relevant books if applicable]
```

**Citation Score:** [XX]% ([0% if no citations / 50% if partial / 100% if complete])

**Notes:** [Any observations about citation quality or completeness]

---

## 7. Content Structure Compliance

**Required Sections per Guide:**
- [✅/❌] Title present
- [✅/❌] Summary present
- [✅/❌] Main content present
- [✅/❌] "Why This Matters" section
- [✅/❌] "Getting Started" section
- [✅/❌] "Common Challenges" section
- [✅/❌] "Resources & Further Learning" section
- [✅/❌] [Any topic-specific required sections, e.g., "Safety" for food topics]

**Structure Score:** [XX]% ([X]/[X] expected sections)

**Notes:** [Any observations about structure quality or organization]

---

## 8. Permaculture Relevance

**Permaculture Principles Referenced:**
- [Principle 1 if applicable]
- [Principle 2 if applicable]
- [etc.]

**Connection to Permaculture Ethics:**
- **Earth Care:** [How guide connects to Earth Care]
- **People Care:** [How guide connects to People Care]
- **Fair Share:** [How guide connects to Fair Share]

**Permaculture Design Principles Applied:**
- [Design principle 1, e.g., "Obtain a yield"]
- [Design principle 2, e.g., "Use biological resources"]
- [etc.]

**Relevance Score:** [XX]%

**Notes:** [Observations about permaculture connection strength and how to improve]

---

## 9. SQL Seed File Verification

**Seed File Location Expected:** `/database/seeds/wiki-guides/[guide-slug].sql`

**Seed File Exists:** [YES ✅ / NO ❌ / UNKNOWN ⚠️]

**SQL Format Compliance:** [VERIFIED ✅ / NOT VERIFIED ❌]

**Format Checks (if file exists):**
- [✅/❌] Multi-line INSERT format used
- [✅/❌] Proper header with file path
- [✅/❌] Proper escaping of quotes
- [✅/❌] Content matches database exactly
- [✅/❌] Verification notes present

**Verification Notes Present:** [YES ✅ / NO ❌ / N/A]

**Verification Notes Format (if present):**
```sql
-- VERIFICATION NOTES
-- Wikipedia: [URL] (verified [DATE])
-- Source 1: [Description]
-- Source 2: [Description]
-- Accuracy: [VERIFIED/PARTIAL/etc.] - [Notes]
-- Last verification: [DATE]
```

**SQL Score:** [XX]% ([0% if not verified / 100% if fully compliant])

**Notes:** [Any observations about seed file quality or issues]

---

## 10. Overall Compliance Score

**Scoring Formula:**
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

**Component Scores:**
- Word Count: [XX]% ([XXX]/1,000 words)
- Factual Accuracy: [XX]%
- Citations: [XX]%
- Alignment: [XX]%
- Structure: [XX]%
- Relevance: [XX]%
- Summary: [XX]% ([100% if present and good / 50% if present but weak / 0% if missing])

**Calculation:**
```
([Word Count] × 0.15) + ([Accuracy] × 0.25) + ([Citation] × 0.15) + ([Alignment] × 0.15) + ([Structure] × 0.15) + ([Relevance] × 0.10) + ([Summary] × 0.05)
= [XX] + [XX] + [XX] + [XX] + [XX] + [XX] + [XX]
= [XX.XX]%
```

**OVERALL COMPLIANCE: [XX.XX]% - [PASS/FAIL]**

**Threshold:** 80% required for PASS

---

## 11. Recommendations for Improvement

### Critical Priority (Must Fix)

1. **[Issue Title]**
   - Current: [Current state]
   - Target: [Target state]
   - Action: [Specific action needed]

2. **[Issue Title]**
   - Current: [Current state]
   - Target: [Target state]
   - Action: [Specific action needed]

[Continue for all critical issues]

### High Priority (Should Fix)

[Number]. **[Issue Title]**
   - [Description of issue and recommended action]

[Continue for all high priority issues]

### Medium Priority (Nice to Have)

[Number]. **[Issue Title]**
   - [Description of issue and recommended action]

[Continue for all medium priority issues]

---

## 12. Verification Agent Notes

**Agent Process:**
1. [Step 1 performed]
2. [Step 2 performed]
3. [etc. - follow 10 steps from process guide]

**Issues Encountered:**
- [Issue 1 if any, or "None"]
- [Issue 2 if any]

**Time to Complete:** [~XX minutes]

**Confidence Level:** [High/Medium/Low] ([XX]%)

**Special Notes:**
- [Any special observations]
- [Context that affects the verification]
- [Recommendations for future verifications]

---

## 13. Approval Status

**Status:** [✅ MEETS STANDARDS / ❌ DOES NOT MEET STANDARDS]

**Reason:** [Overall compliance XX% ([above/below] 80% threshold)]

**Blockers:** ([if FAIL status])
- [Blocker 1]
- [Blocker 2]
- [etc.]

**Critical Safety/Quality Concerns:** ([if applicable])
- [Concern 1 - e.g., missing safety information for food topics]
- [Concern 2]

**Next Steps:**
1. [Step 1]
2. [Step 2]
3. [etc.]

---

**Verification Complete**

**Report Generated:** [YYYY-MM-DD]

**Report Format Version:** 1.0
