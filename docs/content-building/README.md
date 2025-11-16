# Content Building System - Documentation Hub

**Location:** `/docs/content-building/`

**Purpose:** Complete documentation for creating, verifying, and managing wiki content (guides, events, locations)

**Last Updated:** 2025-11-16

---

## 📚 Quick Navigation

### 🎯 I Want To...

| Task | Start Here |
|------|-----------|
| **Create a new guide** | [wiki-content-guide.md](guides/wiki-content-guide.md) |
| **Create an event** | [wiki-content-guide.md](guides/wiki-content-guide.md#creating-events) |
| **Create a location** | [wiki-content-guide.md](guides/wiki-content-guide.md#creating-locations) |
| **Verify content quality** | [VERIFICATION_SYSTEM_README.md](processes/VERIFICATION_SYSTEM_README.md) |
| **Check SQL formatting** | [SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md) |
| **Understand the system** | [CONTENT_CREATION_SYSTEM_REQUIREMENTS.md](processes/CONTENT_CREATION_SYSTEM_REQUIREMENTS.md) |
| **Generate verification report** | [GUIDE_VERIFICATION_REPORT_TEMPLATE.md](templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md) |
| **Review past verifications** | [verification-reports/](verification-reports/) |

---

## 📁 Directory Structure

```
/docs/content-building/
├── README.md                          (this file - navigation hub)
├── /guides                            (Content creation guides)
├── /processes                         (Workflows & procedures)
├── /sql-requirements                  (SQL & database specifications)
├── /templates                         (Report templates)
└── /verification-reports              (Historical verification reports)
```

---

## 📖 Documentation by Directory

### `/guides/` - Content Creation Guides

**Purpose:** Learn how to create quality wiki content

| File | Size | Description |
|------|------|-------------|
| [wiki-content-guide.md](guides/wiki-content-guide.md) | 73KB | **MASTER GUIDE** - Complete standards, templates, and requirements for guides, events, and locations |
| [wiki-schema-compliance.md](guides/wiki-schema-compliance.md) | 15KB | Database schema validation and field requirements |
| [wiki-translation.md](guides/wiki-translation.md) | 10KB | Multilingual content support (11 languages) |

**Start with:** `wiki-content-guide.md` - it's comprehensive and includes everything you need.

---

### `/processes/` - Workflows & Procedures

**Purpose:** Systematic processes for creating and verifying content

| File | Size | Description |
|------|------|-------------|
| [CONTENT_CREATION_SYSTEM_REQUIREMENTS.md](processes/CONTENT_CREATION_SYSTEM_REQUIREMENTS.md) | 72KB | **SYSTEM OVERVIEW** - Complete requirements, workflows, and implementation roadmap |
| [WIKI_GUIDE_VERIFICATION_PROCESS.md](processes/WIKI_GUIDE_VERIFICATION_PROCESS.md) | 30KB | 10-step systematic verification process for guides |
| [VERIFICATION_SYSTEM_README.md](processes/VERIFICATION_SYSTEM_README.md) | 12KB | Quick start guide for verification system |

**Planned (To Create):**
- [ ] WIKI_EVENT_VERIFICATION_PROCESS.md
- [ ] WIKI_LOCATION_VERIFICATION_PROCESS.md
- [ ] DUPLICATE_PREVENTION_GUIDE.md

**Start with:** `VERIFICATION_SYSTEM_README.md` for quick overview, then dive into specific processes.

---

### `/sql-requirements/` - SQL & Database Specifications

**Purpose:** Ensure SQL seed files execute correctly

| File | Size | Description |
|------|------|-------------|
| [SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md) | 25KB | **CRITICAL** - SQL structure, status handling, execution guarantees, error prevention |

**Covers:**
- Status field requirements (draft/published)
- Table structure compliance
- SQL execution guarantees
- Common errors and prevention
- Testing and validation procedures

**Start with:** This if you're creating SQL seed files - it ensures your SQL will run without errors.

---

### `/templates/` - Report Templates

**Purpose:** Standardized templates for verification reports

| File | Description |
|------|-------------|
| [GUIDE_VERIFICATION_REPORT_TEMPLATE.md](templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md) | Standard 13-section verification report template |

**Planned (To Create):**
- [ ] EVENT_VERIFICATION_REPORT_TEMPLATE.md
- [ ] LOCATION_VERIFICATION_REPORT_TEMPLATE.md

**How to use:** Copy template, fill in all sections, calculate compliance score (80% = pass).

---

### `/verification-reports/` - Historical Reports

**Purpose:** Archive of all content verification reports

**Structure:**
```
verification-reports/
├── 2025-11-15/          (3 guide verifications)
│   ├── starting-first-backyard-flock-verification.md
│   ├── lacto-fermentation-verification.md
│   └── growing-oyster-mushrooms-verification.md
└── 2025-11-16/          (5 seed file verifications)
    ├── seed_madeira_czech-verification.md
    ├── 004_real_verified_wiki_content-verification.md
    ├── 004_future_events_seed-verification.md
    ├── VERIFICATION_SUMMARY.md
    └── MANUAL_REVIEW_seed_madeira_czech.md
```

**Purpose:** Track quality over time, reference past decisions, identify patterns.

---

## 🚀 Getting Started Workflows

### New to Content Creation?

**Step 1:** Read [wiki-content-guide.md](guides/wiki-content-guide.md) (focus on your content type)
**Step 2:** Review [SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md)
**Step 3:** Create your content following templates
**Step 4:** Verify using [VERIFICATION_SYSTEM_README.md](processes/VERIFICATION_SYSTEM_README.md)

**Estimated Time:** 2-3 hours for first guide

### Creating Your First Guide

1. **Research & Plan** (30-60 min)
   - Topic research
   - Source verification
   - Outline structure

2. **Write Content** (60-90 min)
   - Follow [wiki-content-guide.md](guides/wiki-content-guide.md) structure
   - Minimum 1,000 words
   - Include all required sections

3. **Format as SQL** (15-30 min)
   - Use [SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md)
   - Set status = 'published'
   - Link to 2-4 categories

4. **Verify** (10-30 min)
   - Run automated checks
   - Manual review if needed
   - Generate report

### Creating an Event or Location

**Follow same process but:**
- Events: 300-1,000 char description (not 1,000+ words)
- Locations: 400-1,500 char description
- Both require accurate GPS coordinates
- Verification process is simpler (fewer requirements)

---

## 📊 Content Quality Standards

### Guides

- **Word Count:** 1,000 minimum (1,500-5,000 optimal)
- **Structure:** Introduction, 4+ main sections, Troubleshooting, Resources, Conclusion
- **Sources:** 5+ verified sources required
- **Pass Threshold:** 80% overall compliance

### Events

- **Description:** 300-1,000 characters
- **Date:** Future date (YYYY-MM-DD)
- **Location:** Coordinates if in-person
- **Status:** 'published' (default)

### Locations

- **Description:** 400-1,500 characters
- **Coordinates:** Required, validated
- **Tags:** 5-15 relevant tags
- **Type:** farm/garden/education/community/business

---

## 🛠️ Automation Tools

**Located in:** `/scripts/`

| Script | Purpose | Usage |
|--------|---------|-------|
| `verify-guide.js` | Automated guide verification | `npm run verify:guide [slug]` |
| `verify-seed-file.js` | Seed file verification | `npm run verify:seed:file [file]` |
| `check-duplicates.js` | Duplicate detection | `npm run check:duplicates` (planned) |
| `generate-wiki-content.js` | Interactive content creation | `node scripts/generate-wiki-content.js` |

**See:** [VERIFICATION_SYSTEM_README.md](processes/VERIFICATION_SYSTEM_README.md#tools-reference) for complete tool documentation.

---

## 📈 System Metrics

### Current Status (as of 2025-11-16)

**Documentation:**
- ✅ Guides creation: Complete (73KB)
- ✅ SQL requirements: Complete (25KB)
- ✅ System requirements: Complete (72KB)
- ✅ Guide verification: Complete (30KB)
- ⚠️ Event verification: Needs dedicated process
- ⚠️ Location verification: Needs dedicated process
- ❌ Duplicate prevention: Critical gap

**Content Quality:**
- Guides in database: 3 (all need improvement)
- Guides in seed files: 5 (67-100% ready)
- Events in seed files: 76 (45 = 100% ready)
- Locations in seed files: 50 (96% ready)

**Verification Reports:** 8 reports generated

---

## 🎯 Roadmap

### Phase 1: Foundation (Week 1) - IN PROGRESS ✅

- [x] Create comprehensive requirements document
- [x] Create SQL execution requirements
- [x] Reorganize documentation structure
- [ ] Enhance guide verification process
- [ ] Create event verification process
- [ ] Create location verification process
- [ ] Create duplicate prevention guide

### Phase 2: Automation (Week 2)

- [ ] Enhance verify-guide.js
- [ ] Create verify-event.js
- [ ] Create verify-location.js
- [ ] Create comprehensive duplicate checker
- [ ] Interactive content creation tool

### Phase 3: Integration (Week 3)

- [ ] Unified CLI tool
- [ ] End-to-end testing
- [ ] Usage examples and tutorials

### Phase 4: Production (Week 4)

- [ ] Onboarding materials
- [ ] Training documentation
- [ ] Metrics dashboard

---

## 🔗 Related Documentation

### Other Doc Directories

- **[/docs/features/](../features/)** - Feature documentation (i18n, eco-themes, etc.)
- **[/docs/database/](../database/)** - Database setup and migrations
- **[/docs/operations/](../operations/)** - Operations guides (backups, safety, etc.)
- **[/docs/processes/](../processes/)** - Other process documentation

### External References

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Markdown Guide:** https://www.markdownguide.org/

---

## 🤝 Contributing

### Adding New Documentation

1. Place in appropriate subdirectory
2. Follow naming conventions (kebab-case)
3. Include standard file header
4. Update this README
5. Update root TABLE_OF_CONTENTS.md

### Updating Existing Documentation

1. Make changes
2. Update "Last Updated" date
3. Update version if applicable
4. Document changes in git commit

### File Header Template

```markdown
# Document Title

**File:** /full/path/to/file.md

**Description:** Clear purpose of document

**Author:** Your Name <your.email@example.com>

**Created:** YYYY-MM-DD

**Last Updated:** YYYY-MM-DD

**Version:** X.Y.Z (if applicable)
```

---

## ❓ FAQ

**Q: Which document should I read first?**
A: [wiki-content-guide.md](guides/wiki-content-guide.md) - it's the master reference for creating content.

**Q: How do I know if my SQL will work?**
A: Follow [SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md) and use the pre-flight checklist.

**Q: What's the difference between 'draft' and 'published'?**
A: See [SQL Requirements - Status Field](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md#status-field-requirements). TL;DR: Use 'published' for seed files.

**Q: How do I verify my content meets quality standards?**
A: Run `npm run verify:guide [slug]` then follow [WIKI_GUIDE_VERIFICATION_PROCESS.md](processes/WIKI_GUIDE_VERIFICATION_PROCESS.md).

**Q: Can I create events and locations with the same tools?**
A: Partially - current tools are guide-focused. Event/location processes are in development (see roadmap).

**Q: How do I check for duplicate content?**
A: Currently manual - check database and seed files. Automated duplicate detection is planned for Phase 2.

---

## 📞 Getting Help

**Issue:** Can't find what you need in docs
**Solution:** Check [CONTENT_CREATION_SYSTEM_REQUIREMENTS.md](processes/CONTENT_CREATION_SYSTEM_REQUIREMENTS.md) - it has complete index

**Issue:** SQL syntax errors
**Solution:** Review [SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md#common-sql-errors-and-prevention)

**Issue:** Content fails verification
**Solution:** Check verification report for specific issues, fix, and re-verify

**Issue:** Not sure which status to use
**Solution:** See [Status Decision Matrix](sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md#status-decision-matrix)

---

## 📊 Document Size Reference

| Document | Size | Read Time | Purpose |
|----------|------|-----------|---------|
| wiki-content-guide.md | 73KB | 45 min | Comprehensive creation guide |
| CONTENT_CREATION_SYSTEM_REQUIREMENTS.md | 72KB | 45 min | System overview & roadmap |
| WIKI_GUIDE_VERIFICATION_PROCESS.md | 30KB | 20 min | Verification workflow |
| SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md | 25KB | 15 min | SQL execution guide |
| VERIFICATION_SYSTEM_README.md | 12KB | 10 min | Quick start |

**Total Documentation:** ~240KB, ~2.5 hours to read everything (not necessary!)

---

**Last Updated:** 2025-11-16

**System Status:** ✅ Foundation Complete - Phase 1 in progress

**Next Review:** After Phase 1 completion
