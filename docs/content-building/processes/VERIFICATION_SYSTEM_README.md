# Wiki Guide Verification System

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/VERIFICATION_SYSTEM_README.md

**Description:** Overview of the wiki guide verification system, tools, and workflow

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## 📋 Overview

The Wiki Guide Verification System ensures all wiki guides meet quality standards before publication. The system includes:

1. **Process Documentation** - Step-by-step verification methodology
2. **Report Template** - Standardized report format
3. **Automation Script** - Automated checks for metrics and metadata
4. **Saved Reports** - Historical verification records

---

## 🗂️ System Components

### 1. Process Documentation

**File:** [WIKI_GUIDE_VERIFICATION_PROCESS.md](WIKI_GUIDE_VERIFICATION_PROCESS.md)

**Purpose:** Complete systematic process for verifying wiki guides

**Contents:**
- 10-step verification workflow
- SQL queries for data extraction
- Web search patterns for Wikipedia and authoritative sources
- Factual accuracy verification methodology
- Compliance scoring formulas
- Report generation guidelines
- Troubleshooting guide

**When to Use:** Every time you verify a guide manually

---

### 2. Report Template

**File:** [/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md](/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md)

**Purpose:** Standard structure for verification reports

**Contents:**
- 13-section report structure
- Placeholder instructions
- Scoring formula documentation
- Compliance threshold (80%)

**When to Use:** When creating full manual verification reports

---

### 3. Automation Script

**File:** [/scripts/verify-guide.js](/scripts/verify-guide.js)

**Purpose:** Automated partial verification of guides

**Capabilities:**
- ✅ Fetches guide metadata from database
- ✅ Calculates word count and line count
- ✅ Checks category assignments
- ✅ Verifies SQL seed file existence
- ✅ Generates automated compliance scores
- ✅ Saves partial verification report

**Limitations:**
- ❌ Cannot verify factual accuracy (requires Wikipedia/source checking)
- ❌ Cannot assess citation quality (requires content analysis)
- ❌ Cannot verify title/summary/content alignment (requires reading)
- ❌ Cannot check content structure (requires section analysis)
- ❌ Cannot assess permaculture relevance (requires domain knowledge)

**When to Use:** As a first pass before manual verification

---

### 4. Verification Reports Directory

**Location:** `/docs/verification/YYYY-MM-DD/`

**Purpose:** Permanent storage of verification reports

**Structure:**
```
/docs/verification/
├── 2025-11-15/
│   ├── starting-first-backyard-flock-verification.md
│   ├── lacto-fermentation-verification.md
│   ├── growing-oyster-mushrooms-verification.md
│   └── [guide-slug]-automated.md (from automation script)
├── 2025-11-16/
│   └── [future reports]
└── [future dates]
```

**When to Use:** Reference past verifications, track improvements

---

## 🚀 Quick Start

### Verify a Single Guide (Automated)

```bash
# Using npm script
npm run verify:guide starting-first-backyard-flock

# Or directly
node scripts/verify-guide.js starting-first-backyard-flock
```

**Output:** Automated report saved to `/docs/verification/YYYY-MM-DD/[slug]-automated.md`

**Next Steps:** Complete manual verification following process documentation

---

### Verify All Guides (Automated)

```bash
# Using npm script
npm run verify:all-guides

# Or directly
node scripts/verify-guide.js --all
```

**Output:** Automated reports for all guides in database

**Next Steps:** Manually verify each guide using process documentation

---

### Manual Verification Workflow

1. **Run Automated Check First**
   ```bash
   npm run verify:guide [guide-slug]
   ```

2. **Review Automated Report**
   - Check word count compliance
   - Check category assignments
   - Note any automated issues

3. **Follow Process Documentation**
   - Open [WIKI_GUIDE_VERIFICATION_PROCESS.md](WIKI_GUIDE_VERIFICATION_PROCESS.md)
   - Follow all 10 steps
   - Search Wikipedia for relevant article
   - Find 2+ authoritative sources
   - Verify factual accuracy
   - Check citations and resources section
   - Assess permaculture relevance

4. **Generate Full Report**
   - Copy [GUIDE_VERIFICATION_REPORT_TEMPLATE.md](/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md)
   - Fill in all sections
   - Replace all `[PLACEHOLDER]` values
   - Calculate compliance scores

5. **Save Report**
   - Save to `/docs/verification/YYYY-MM-DD/[guide-slug]-verification.md`

6. **Take Action**
   - If score ≥80%: PASS ✅ (guide meets standards)
   - If score <80%: FAIL ❌ (guide needs improvement)
   - Share recommendations with content author

---

## 📊 Compliance Scoring

### Overall Score Formula

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

### Pass/Fail Threshold

- **PASS:** ≥80% overall compliance
- **FAIL:** <80% overall compliance

### Component Weights

| Component | Weight | Reasoning |
|-----------|--------|-----------|
| Factual Accuracy | 25% | Most critical - incorrect information is worse than missing information |
| Word Count | 15% | Important for depth and completeness |
| Citations | 15% | Essential for credibility and verification |
| Title/Summary/Content Alignment | 15% | Important for user expectations |
| Content Structure | 15% | Affects usability and completeness |
| Permaculture Relevance | 10% | Important but can be improved more easily |
| Summary Quality | 5% | Least critical but still valuable |

---

## 🔍 Example Verification Results

### Current Status (as of 2025-11-15)

| Guide | Word Count | Accuracy | Overall Score | Status |
|-------|-----------|----------|---------------|--------|
| Starting Your First Backyard Flock | 200 (20%) | 95% | 60.75% | ❌ FAIL |
| Lacto-Fermentation | 223 (22%) | 90% | 59.55% | ❌ FAIL |
| Growing Oyster Mushrooms | 255 (25.5%) | 85% | 59.83% | ❌ FAIL |

**Common Issues:**
- All guides severely below 1,000-word minimum
- No guides have Resources & Further Learning sections
- No guides have source citations
- No SQL seed files exist for guides
- Content structure incomplete (missing required sections)

**Strengths:**
- All guides have high factual accuracy (85-95%)
- Wikipedia articles found for all topics
- Authoritative sources available for all topics
- Good title/summary/content alignment
- Strong permaculture relevance (especially mushroom guide)

---

## 🛠️ Tools Reference

### Automated Checks (verify-guide.js)

**What it checks automatically:**
- ✅ Word count
- ✅ Summary length
- ✅ Category assignments
- ✅ SQL seed file existence
- ✅ Basic metadata (created date, updated date)

**What requires manual verification:**
- 🔍 Wikipedia article search
- 🔍 Authoritative source search
- 🔍 Factual accuracy cross-referencing
- 🔍 Citation quality assessment
- 🔍 Content alignment analysis
- 🔍 Section structure checking
- 🔍 Permaculture relevance assessment

### Database Queries

All SQL queries needed for verification are documented in [WIKI_GUIDE_VERIFICATION_PROCESS.md](WIKI_GUIDE_VERIFICATION_PROCESS.md) including:

- Guide metadata query
- Category assignment query
- Content extraction query
- Word count calculation
- Guide statistics query

### Web Search Patterns

Documented in process guide:

- Wikipedia search: `"[topic]" wikipedia`
- Extension services: `"[topic]" site:.edu extension`
- Government sources: `"[topic]" site:.gov`
- Academic sources: `"[topic]" site:.edu research`

---

## 📝 Best Practices

### Before Verification

1. **Read the guide standards** in [WIKI_CONTENT_CREATION_GUIDE.md](/docs/WIKI_CONTENT_CREATION_GUIDE.md)
2. **Run automated check first** to identify obvious issues
3. **Have process documentation open** for reference

### During Verification

1. **Take notes** of specific issues and examples
2. **Record all sources** with full URLs
3. **Document verification date** on all source checks
4. **Be thorough** - check every factual claim
5. **Be objective** - use documented criteria

### After Verification

1. **Save report immediately** to prevent loss
2. **Share with content author** if guide fails
3. **Track improvements** by re-verifying after updates
4. **Update process documentation** if you find better methods

---

## 🔄 Re-Verification Workflow

When a guide is updated after failing verification:

1. **Check what was updated**
   ```sql
   SELECT title, slug, updated_at
   FROM wiki_guides
   WHERE slug = 'guide-slug'
   ORDER BY updated_at DESC;
   ```

2. **Run automated check**
   ```bash
   npm run verify:guide [guide-slug]
   ```

3. **Compare to previous report**
   - Open previous report from `/docs/verification/[date]/`
   - Note which issues were addressed
   - Note which issues remain

4. **Complete full verification**
   - Follow process documentation
   - May be faster if only specific sections changed
   - Still verify accuracy of any changed content

5. **Generate new report**
   - Use template
   - Note improvements from previous version
   - Calculate new compliance score

6. **Archive reports**
   - Keep both old and new reports
   - Shows improvement history

---

## 📚 Related Documentation

- [WIKI_CONTENT_CREATION_GUIDE.md](/docs/WIKI_CONTENT_CREATION_GUIDE.md) - Standards for creating guides
- [WIKI_CONTENT_GUIDE_VERIFICATION.md](/docs/WIKI_CONTENT_GUIDE_VERIFICATION.md) - Pre-existing verification guidelines
- [WIKI_GUIDE_VERIFICATION_PROCESS.md](WIKI_GUIDE_VERIFICATION_PROCESS.md) - Complete verification process
- [GUIDE_VERIFICATION_REPORT_TEMPLATE.md](/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md) - Report template

---

## 🐛 Troubleshooting

### Automation Script Issues

**Error: "Missing Supabase credentials"**
- Check `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` is set
- Verify `VITE_SUPABASE_ANON_KEY` is set

**Error: "Guide not found"**
- Verify guide slug is correct
- Check guide exists in database: `SELECT slug FROM wiki_guides;`
- Slug must be exact match (case-sensitive)

**Error: "Failed to fetch categories"**
- Check database connection
- Verify `wiki_guide_categories` table exists
- Check RLS policies allow reading

### Manual Verification Issues

**Can't find Wikipedia article**
- Try variations of search terms
- Search for broader topic
- Document "NOT FOUND" in report
- Find 2+ alternative authoritative sources

**Can't access extension sources**
- Try different universities (.edu domains)
- Search for government sources (.gov domains)
- Look for peer-reviewed research
- Document all sources attempted

**Unsure about permaculture relevance**
- Review permaculture principles and ethics
- Check if guide mentions sustainability, closed loops, or resilience
- Assess connection to Earth Care, People Care, Fair Share
- When in doubt, assign medium score (50-70%)

---

## 🎯 Quality Goals

### Short-term (Next 30 days)

- ✅ Verification system documented and operational
- 🔲 All existing guides verified and reports saved
- 🔲 All guides updated to meet 80% threshold
- 🔲 SQL seed files created for all guides

### Medium-term (Next 90 days)

- 🔲 New guides verified before publication
- 🔲 Verification integrated into content workflow
- 🔲 Resources sections added to all guides
- 🔲 Word counts meet minimums (1,000+)

### Long-term (Ongoing)

- 🔲 Maintain 80%+ compliance for all guides
- 🔲 Re-verify guides annually
- 🔲 Update guides when sources change
- 🔲 Expand verification process as needed

---

## 🤝 Contributing

If you improve the verification process:

1. **Document your changes** in the process guide
2. **Update the template** if report structure changes
3. **Update the automation script** if new checks are added
4. **Update this README** with new best practices

---

**Last Updated:** 2025-11-15

**System Status:** ✅ Operational

**Next Review:** 2025-12-15
