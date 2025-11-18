# Permahub Cloud Database Push - Execution Checklist

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/CLOUD_PUSH_CHECKLIST.md

**Description:** Step-by-step checklist for pushing local database to Supabase cloud

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-17

**Estimated Time:** 2.5-3.5 hours

**Total Migrations:** 20 (00, 001-019)

---

## 📋 Pre-Flight Checks

**Before starting, verify:**

- [ ] All local changes committed to git
- [ ] Migration files renamed (no duplicates):
  - ✅ `018_create_wiki_theme_groups.sql` (was 010)
  - ✅ `019_link_categories_to_themes.sql` (was 011)
- [ ] Migration 003 fixed (duplicate column removed)
- [ ] Documentation updated (MIGRATION_SUMMARY.md, supabase-cloud-setup.md)
- [ ] Supabase credentials available (.env file)
- [ ] Supabase project URL: `https://mcbxbaggjaxqfdvmrqsc.supabase.co`

---

## Phase 1: Database Migrations (30-45 minutes)

### Access Supabase Console

- [ ] Open browser to: https://supabase.com/dashboard
- [ ] Login with credentials
- [ ] Select project: **mcbxbaggjaxqfdvmrqsc**
- [ ] Navigate to **SQL Editor** (left sidebar)

### Run Migrations in Order

**CRITICAL:** Run migrations in exact numeric order (00 → 019)

For each migration, follow these steps:
1. Click **New Query** button
2. Open migration file locally
3. Copy entire contents (Cmd+A, Cmd+C)
4. Paste into SQL Editor (Cmd+V)
5. Click **Run** button
6. Wait for "Success. No rows returned" or success message
7. Check for any errors (red text)
8. If error occurs, STOP and troubleshoot before proceeding

---

#### Migration 01: Bootstrap
- [ ] File: `supabase/migrations/00_bootstrap_execute_sql.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 02: Initial Schema (Core Tables)
- [ ] File: `supabase/migrations/001_initial_schema.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Creates 8 core tables (users, projects, resources, favorites, tags, etc.)
- [ ] Notes: _____________________________________________

#### Migration 03: Analytics
- [ ] File: `supabase/migrations/002_analytics.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Creates: user_activity, user_dashboard_config
- [ ] Notes: _____________________________________________

#### Migration 04: Notifications System
- [ ] File: `supabase/migrations/003_items_pubsub.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Creates 5 tables (items, notifications, item_followers, etc.)
- [ ] Notes: _____________________________________________

#### Migration 05: Expanded Categories
- [ ] File: `supabase/migrations/004_expanded_categories.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 06: Row Level Security Policies
- [ ] File: `supabase/migrations/005_row_level_security_policies.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 07: Wiki Schema
- [ ] File: `supabase/migrations/006_wiki_schema.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Creates: wiki_guides, wiki_events, wiki_locations, wiki_categories
- [ ] Notes: _____________________________________________

#### Migration 08: Wiki Multilingual Content
- [ ] File: `supabase/migrations/007_wiki_multilingual_content.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 09: Newsletter Subscriptions
- [ ] File: `supabase/migrations/008_newsletter_subscriptions.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 10: User Personalization
- [ ] File: `supabase/migrations/009_user_personalization.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 11: Storage Buckets
- [ ] File: `supabase/migrations/010_storage_buckets.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 12: View Counts
- [ ] File: `supabase/migrations/011_add_view_counts.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 13: Issue Tracking
- [ ] File: `supabase/migrations/012_issue_tracking.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 14: Event Registrations
- [ ] File: `supabase/migrations/013_event_registrations.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 15: Issue Tracking Logs
- [ ] File: `supabase/migrations/014_issue_tracking_logs.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 16: Wikipedia References
- [ ] File: `supabase/migrations/015_wikipedia_references.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 17: Fix Guides/Events RLS
- [ ] File: `supabase/migrations/016_fix_guides_events_rls.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Notes: _____________________________________________

#### Migration 18: Add Soft Deletes
- [ ] File: `supabase/migrations/017_add_soft_deletes.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Adds: deleted_at, deleted_by columns to wiki tables
- [ ] Notes: _____________________________________________

#### Migration 19: Create Wiki Theme Groups
- [ ] File: `supabase/migrations/018_create_wiki_theme_groups.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Creates: wiki_theme_groups table
- [ ] Notes: _____________________________________________

#### Migration 20: Link Categories to Themes
- [ ] File: `supabase/migrations/019_link_categories_to_themes.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Adds theme_id column to wiki_categories
- [ ] Notes: _____________________________________________

---

### ✅ Migration Completion Check

After all 20 migrations complete:

- [ ] All migrations ran without errors
- [ ] No red error messages in SQL Editor
- [ ] Total migrations run: 20 (00, 001-019)

---

## Phase 2: Seed Data (5 minutes)

### Seed File 1: Expanded Wiki Categories
- [ ] File: `supabase/seeds/003_expanded_wiki_categories.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Populates wiki_categories table with category data
- [ ] Notes: _____________________________________________

### Seed File 2: Wiki Theme Groups
- [ ] File: `supabase/seeds/012_wiki_theme_groups_seed.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Inserts 15 theme groups with icons and sort order
- [ ] Notes: _____________________________________________

### Seed File 3: Link Categories to Themes
- [ ] File: `supabase/seeds/013_link_categories_to_themes.sql`
- [ ] Status: ⬜ Pending / ✅ Success / ❌ Error
- [ ] Updates wiki_categories to link to theme groups
- [ ] Notes: _____________________________________________

---

## Phase 3: Verification (20 minutes)

### Check Database Tables

- [ ] Navigate to **Database** → **Tables** (left sidebar)
- [ ] Verify **23+ tables** exist
- [ ] Check for these critical tables:

**Core Tables:**
- [ ] users
- [ ] projects
- [ ] resources
- [ ] resource_categories
- [ ] favorites
- [ ] tags

**Wiki System:**
- [ ] wiki_guides
- [ ] wiki_events
- [ ] wiki_locations
- [ ] wiki_categories
- [ ] wiki_theme_groups
- [ ] wiki_multilingual_content

**Notification System:**
- [ ] items
- [ ] notifications
- [ ] notification_preferences
- [ ] item_followers
- [ ] publication_subscriptions

**Analytics:**
- [ ] user_activity
- [ ] user_dashboard_config

**Features:**
- [ ] newsletter_subscriptions
- [ ] user_personalization
- [ ] event_registrations
- [ ] issue_tracking
- [ ] wikipedia_references

### Check Theme Groups Data

- [ ] Navigate to **Database** → **Table Editor**
- [ ] Select table: `wiki_theme_groups`
- [ ] Verify **15 rows** exist
- [ ] Check data includes:
  - [ ] name (e.g., "Animal Husbandry & Livestock")
  - [ ] slug (e.g., "animal-husbandry-livestock")
  - [ ] icon (e.g., "🐓")
  - [ ] sort_order (1-15)
  - [ ] is_active = true

### Check Extensions

- [ ] Navigate to **Database** → **Extensions**
- [ ] Verify enabled:
  - [ ] uuid-ossp ✓
  - [ ] pgcrypto ✓ (if needed)

### Check RLS Policies

- [ ] Click on any table (e.g., wiki_guides)
- [ ] Go to **Auth** tab
- [ ] Verify **Enable RLS** is toggled ON
- [ ] Check policies are listed

---

## Phase 4: Connection Testing (15 minutes)

### Update Local Environment

- [ ] Verify `.env` file has correct Supabase URL and keys:
  ```
  VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```

### Start Development Server

- [ ] Open terminal in project root
- [ ] Run: `./start.sh`
- [ ] Wait for server to start on port 3001
- [ ] Verify no startup errors

### Test Database Connection

- [ ] Open browser to: http://localhost:3001
- [ ] Open browser console (F12 → Console tab)
- [ ] Check for Supabase connection messages
- [ ] Look for any connection errors (red text)
- [ ] Test authentication flow (if applicable)

### Test Theme Loading

- [ ] Navigate to: http://localhost:3001/src/wiki/wiki-home.html
- [ ] Open browser console
- [ ] Check for "Loading themes from database..." message
- [ ] Verify "Loaded 15 themes" message appears
- [ ] Check theme dropdown populates with 15 themes
- [ ] Test theme filter functionality

---

## Phase 5: Integration Testing (1-2 hours)

### Wiki Guides Testing

- [ ] Navigate to: http://localhost:3001/src/wiki/wiki-guides.html
- [ ] Verify theme dropdown shows 15 themes
- [ ] Test filtering by theme
- [ ] Test language switching (EN, PT, ES)
- [ ] Verify theme names translate correctly

### Wiki Events Testing

- [ ] Navigate to: http://localhost:3001/src/wiki/wiki-events.html
- [ ] Verify events load from cloud database
- [ ] Check contact information displays
- [ ] Test event details modal

### Wiki Locations Testing

- [ ] Navigate to: http://localhost:3001/src/wiki/wiki-map.html
- [ ] Verify locations load from cloud database
- [ ] Check map markers display
- [ ] Test location popups with contact info

### Create New Content

- [ ] Navigate to: http://localhost:3001/src/wiki/wiki-editor.html
- [ ] Try creating a new guide
- [ ] Select theme from dropdown
- [ ] Save to database
- [ ] Verify appears in database (Table Editor)

---

## Phase 6: Final Checks

### Data Integrity

- [ ] All migrations completed successfully
- [ ] All seed files ran successfully
- [ ] 23+ tables created
- [ ] 15 theme groups populated
- [ ] RLS policies active
- [ ] No orphaned data

### Performance

- [ ] Pages load in < 3 seconds
- [ ] Database queries execute quickly
- [ ] No timeout errors
- [ ] Browser console clean (no errors)

### Security

- [ ] RLS enabled on all tables
- [ ] Anonymous access works correctly
- [ ] Authenticated access works correctly
- [ ] No unauthorized data access possible

---

## 🎉 Success Criteria

**Cloud push is successful if:**

✅ All 20 migrations ran without errors (00, 001-019)
✅ All 3 seed files ran without errors
✅ 23+ tables exist in Supabase cloud
✅ 15 theme groups populated in wiki_theme_groups
✅ Local dev server connects to cloud database
✅ Theme dropdown shows 15 themes
✅ Language switching works
✅ RLS policies protect data
✅ No console errors in browser

---

## 🚨 Troubleshooting

### Migration Fails

**Error:** "relation already exists"
- **Cause:** Migration already ran previously
- **Fix:** Skip migration or use `DROP TABLE IF EXISTS` first

**Error:** "syntax error at or near..."
- **Cause:** SQL syntax issue or missing dependency
- **Fix:** Check previous migrations ran successfully

**Error:** "foreign key constraint"
- **Cause:** Migration order wrong or missing dependency
- **Fix:** Verify migrations ran in correct order (00-018)

### No Data in Tables

**Issue:** Tables exist but are empty
- **Cause:** Seed files not run
- **Fix:** Run all 3 seed files in supabase/seeds/

### Theme Dropdown Empty

**Issue:** Theme dropdown shows no options
- **Cause:** Seed file 012 didn't run or failed
- **Fix:**
  1. Check wiki_theme_groups table in Supabase
  2. If empty, re-run seed file 012
  3. Check browser console for JavaScript errors

### Connection Errors

**Issue:** "Failed to connect to Supabase"
- **Cause:** Wrong URL or API key
- **Fix:** Verify .env file has correct credentials

---

## 📞 Support

If you encounter issues:

1. **Check:** Browser console (F12 → Console)
2. **Check:** Supabase logs (Dashboard → Logs)
3. **Check:** Migration error messages in SQL Editor
4. **Review:** This checklist for missed steps
5. **Review:** [docs/database/supabase-cloud-setup.md](database/supabase-cloud-setup.md)

---

## 📝 Post-Push Actions

After successful cloud push:

- [ ] Update FixRecord.md with cloud push details
- [ ] Commit all documentation updates
- [ ] Tag release: `git tag v1.0-cloud-ready`
- [ ] Push to GitHub: `git push origin main --tags`
- [ ] Update TODO.md to mark cloud push complete

---

**Checklist completed on:** _____________________

**Completed by:** _____________________

**Total time:** _______ hours

**Status:** ⬜ In Progress / ✅ Success / ❌ Failed

**Notes:**
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

**Last Updated:** 2025-11-17
