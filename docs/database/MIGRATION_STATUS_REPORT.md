# Migration Status Report - Local Database

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/database/MIGRATION_STATUS_REPORT.md

**Description:** Verification of applied migrations vs available migration files

**Generated:** 2025-01-18

---

## Summary

**Local Supabase Status:** ✅ Running
**Migrations Applied:** 17 out of 21 files
**Missing Migrations:** 4 files not yet applied

---

## Applied Migrations (17)

These migrations are currently applied to the local database:

| # | Version | Name | Status |
|---|---------|------|--------|
| 1 | 00 | bootstrap_execute_sql | ✅ Applied |
| 2 | 001 | initial_schema | ✅ Applied |
| 3 | 002 | analytics | ✅ Applied |
| 4 | 003 | items_pubsub | ✅ Applied |
| 5 | 004 | expanded_categories | ✅ Applied |
| 6 | 005 | row_level_security_policies | ✅ Applied |
| 7 | 006 | wiki_schema | ✅ Applied |
| 8 | 007 | wiki_multilingual_content | ✅ Applied |
| 9 | 008 | newsletter_subscriptions | ✅ Applied |
| 10 | 009 | user_personalization | ✅ Applied |
| 11 | 010 | storage_buckets | ✅ Applied |
| 12 | 011 | add_view_counts | ✅ Applied |
| 13 | 012 | issue_tracking | ✅ Applied |
| 14 | 013 | event_registrations | ✅ Applied |
| 15 | 014 | issue_tracking_logs | ✅ Applied |
| 16 | 015 | wikipedia_references | ✅ Applied |
| 17 | 016 | fix_guides_events_rls | ✅ Applied |

---

## Missing Migrations (4)

These migration files exist but are NOT yet applied:

| # | File | Status | Action Required |
|---|------|--------|-----------------|
| 1 | 014_add_soft_deletes.sql | ❌ Not Applied | Need to apply |
| 2 | 017_create_wiki_theme_groups.sql | ❌ Not Applied | Need to apply |
| 3 | 018_link_categories_to_themes.sql | ❌ Not Applied | Need to apply |
| 4 | *Additional untracked files* | ❌ Unknown | Need to verify |

**Note:** There's a naming conflict - we have both:
- `014_issue_tracking_logs.sql` (APPLIED)
- `014_add_soft_deletes.sql` (NOT APPLIED)

This needs to be resolved by renaming one of them.

---

## Archived Migrations

These files are archived and should NOT be applied:

- `.archived_20251107_00_theme_associations.sql`
- `.archived_20251112_wiki_content_tables.sql`
- `.archived_20251114000000_wiki_complete_schema_fixed.sql`

---

## Action Items

### 1. ⚠️ Resolve Naming Conflict

**Problem:** Two files with version `014`:
- `014_issue_tracking_logs.sql` (already applied)
- `014_add_soft_deletes.sql` (not applied)

**Solution:** Rename `014_add_soft_deletes.sql` to next available number:
```bash
mv supabase/migrations/014_add_soft_deletes.sql supabase/migrations/017_add_soft_deletes.sql
```

**Then update sequence:**
```bash
mv supabase/migrations/017_create_wiki_theme_groups.sql supabase/migrations/018_create_wiki_theme_groups.sql
mv supabase/migrations/018_link_categories_to_themes.sql supabase/migrations/019_link_categories_to_themes.sql
```

### 2. Apply Missing Migrations

After renaming, apply in order:

```bash
# Apply soft deletes
supabase migration apply 017_add_soft_deletes

# Apply theme groups
supabase migration apply 018_create_wiki_theme_groups

# Apply category-theme links
supabase migration apply 019_link_categories_to_themes
```

Or run all pending:
```bash
supabase db push
```

### 3. Verify Migration Status

After applying, verify:
```bash
SUPABASE_DB_PORT=5432 PGPASSWORD=postgres psql -h 127.0.0.1 -U postgres -d postgres -c "SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;"
```

Should show all migrations 00 through 019.

---

## Migration Files Inventory

### Current Structure:
```
supabase/migrations/
├── 00_bootstrap_execute_sql.sql          ✅ Applied
├── 001_initial_schema.sql                ✅ Applied
├── 002_analytics.sql                     ✅ Applied
├── 003_items_pubsub.sql                  ✅ Applied
├── 004_expanded_categories.sql           ✅ Applied
├── 005_row_level_security_policies.sql   ✅ Applied
├── 006_wiki_schema.sql                   ✅ Applied
├── 007_wiki_multilingual_content.sql     ✅ Applied
├── 008_newsletter_subscriptions.sql      ✅ Applied
├── 009_user_personalization.sql          ✅ Applied
├── 010_storage_buckets.sql               ✅ Applied
├── 011_add_view_counts.sql               ✅ Applied
├── 012_issue_tracking.sql                ✅ Applied
├── 013_event_registrations.sql           ✅ Applied
├── 014_issue_tracking_logs.sql           ✅ Applied (CONFLICT!)
├── 014_add_soft_deletes.sql              ❌ Not Applied (CONFLICT!)
├── 015_wikipedia_references.sql          ✅ Applied
├── 016_fix_guides_events_rls.sql         ✅ Applied
├── 017_create_wiki_theme_groups.sql      ❌ Not Applied (needs rename to 018)
└── 018_link_categories_to_themes.sql     ❌ Not Applied (needs rename to 019)
```

### After Renaming:
```
supabase/migrations/
├── 00_bootstrap_execute_sql.sql          ✅ Applied
├── 001_initial_schema.sql                ✅ Applied
├── 002_analytics.sql                     ✅ Applied
├── 003_items_pubsub.sql                  ✅ Applied
├── 004_expanded_categories.sql           ✅ Applied
├── 005_row_level_security_policies.sql   ✅ Applied
├── 006_wiki_schema.sql                   ✅ Applied
├── 007_wiki_multilingual_content.sql     ✅ Applied
├── 008_newsletter_subscriptions.sql      ✅ Applied
├── 009_user_personalization.sql          ✅ Applied
├── 010_storage_buckets.sql               ✅ Applied
├── 011_add_view_counts.sql               ✅ Applied
├── 012_issue_tracking.sql                ✅ Applied
├── 013_event_registrations.sql           ✅ Applied
├── 014_issue_tracking_logs.sql           ✅ Applied
├── 015_wikipedia_references.sql          ✅ Applied
├── 016_fix_guides_events_rls.sql         ✅ Applied
├── 017_add_soft_deletes.sql              ⏳ Ready to apply (renamed)
├── 018_create_wiki_theme_groups.sql      ⏳ Ready to apply (renamed)
└── 019_link_categories_to_themes.sql     ⏳ Ready to apply (renamed)
```

---

## Next Steps

1. **Resolve naming conflict** (rename files)
2. **Apply missing migrations** (017, 018, 019)
3. **Verify all migrations applied**
4. **Proceed with regression testing**

---

## Database Health Check

After applying all migrations, verify:

### Tables Exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### RLS Enabled:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Functions Present:
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

### Triggers Active:
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

---

**Status:** ⚠️ Action Required - Resolve conflicts and apply missing migrations
**Next Action:** Rename conflicting migration files and apply pending migrations
**Estimated Time:** 30 minutes
