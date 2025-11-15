# Permahub: Database Activation Guide
**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/DATABASE_ACTIVATION_GUIDE.md
**Description:** Step-by-step guide to activate Supabase database with all 3 core migrations
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-12

---

## 🎯 Objective

Activate your Permahub database by running 3 SQL migrations in Supabase. This will create 15+ database tables with all necessary indexes, row-level security policies, and helper functions.

**Time Required:** 30 minutes
**Difficulty:** Easy (copy-paste SQL)
**Risk:** Zero (Supabase free tier can be reset anytime)

---

## 📋 What You're Creating

### Core Tables (8)
1. **users** - User profiles, skills, interests
2. **projects** - Permaculture projects with geolocation
3. **resource_categories** - Marketplace categories
4. **resources** - Seeds, tools, services, information
5. **project_user_connections** - Team members and collaborators
6. **favorites** - User bookmarks and wishlists
7. **tags** - Predefined tags and categories
8. **resource_categories** - Nested category structure

### Analytics Tables (2)
9. **user_activity** - Track user interactions
10. **user_dashboard_config** - Personalization settings

### Notification Tables (5)
11. **items** - Unified flexible items system
12. **notifications** - User notification feed
13. **notification_preferences** - User-wide settings
14. **item_followers** - Follow system
15. **publication_subscriptions** - Pub/sub tracking

**Total: 15 tables with 40+ indexes and 20+ RLS policies**

---

## 🚀 Pre-Flight Checklist

Before starting, verify:

- [ ] You have a Supabase account
- [ ] You're logged in to Supabase
- [ ] You know your Supabase project ID: **mcbxbaggjaxqfdvmrqsc**
- [ ] You have access to SQL Editor in Supabase dashboard
- [ ] Browser is open to https://supabase.com/dashboard
- [ ] You have 30 minutes of uninterrupted time

---

## ⚠️ Important Notes

**Before Running Migrations:**
1. These migrations are **idempotent** - they won't fail if run twice
2. They use `CREATE TABLE IF NOT EXISTS` - safe to re-run
3. They enable Row-Level Security (RLS) - important for data privacy
4. They create triggers and helper functions - all documented
5. No data loss possible on empty database

**After Each Migration:**
1. You'll see a success message (no error)
2. No output means success
3. Check table count to verify

---

## 🔄 Migration 1: Core Schema (Initial Schema)

### Location
**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`

### What It Creates
- 8 core tables (users, projects, resources, etc.)
- 20+ indexes for performance
- 10+ RLS policies for security
- 2 helper functions (distance-based searches)
- Default tags and categories (50+ records)
- 2 views (v_active_projects, v_available_resources)

### Time
2-3 minutes to execute

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Login if needed
3. Select project: **mcbxbaggjaxqfdvmrqsc**
4. Navigate: Left sidebar → SQL Editor
5. Click: **New Query**

### Step 2: Copy the SQL

**Open the file:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`

**Copy the ENTIRE file contents** (lines 1-597)

Keyboard shortcut:
- Mac: Cmd+A (select all) → Cmd+C (copy)
- Windows: Ctrl+A → Ctrl+C

### Step 3: Paste into Supabase

1. Click in the SQL editor text area
2. Paste the SQL
   - Mac: Cmd+V
   - Windows: Ctrl+V
3. You should see the entire migration appear

### Step 4: Run the Migration

1. Click the **"Run"** button (blue button top-right of editor)
   - Or press: Ctrl+Enter (Windows) / Cmd+Enter (Mac)
2. Wait for execution (should take 2-3 minutes)

### Step 5: Verify Success

**Expected Result:** No error messages, blue checkmark appears

**Verify tables created:**

In the same SQL Editor, run this verification query:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Should show these 8 tables:**
- favorites
- project_user_connections
- projects
- resource_categories
- resources
- tags
- user_activity (added in migration 2)
- users

---

## 🔄 Migration 2: Analytics Schema

### Location
**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/002_analytics.sql`

### What It Creates
- 2 new tables (user_activity, user_dashboard_config)
- 4 views for analytics
- 3 helper functions
- 1 trigger (auto-update timestamp)

### Time
1 minute to execute

### Steps (Same Process)

1. SQL Editor → New Query
2. Open migration file: `002_analytics.sql`
3. Copy ENTIRE contents (lines 1-295)
4. Paste into Supabase editor
5. Click "Run"
6. Verify no errors

### Verify Success

```sql
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public';
```

**Should now show: 10 tables** (8 from migration 1 + 2 new)

---

## 🔄 Migration 3: Pub/Sub & Notifications

### Location
**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/003_items_pubsub.sql`

### What It Creates
- 5 new tables (items, notifications, notification_preferences, item_followers, publication_subscriptions)
- 2 triggers (auto-create notification prefs, update timestamps)
- 5 helper functions (notify followers, mark read, etc.)
- 2 views (unread notifications, items with stats)

### Time
2-3 minutes to execute

### Steps (Same Process)

1. SQL Editor → New Query
2. Open migration file: `003_items_pubsub.sql`
3. Copy ENTIRE contents (lines 1-527)
4. Paste into Supabase editor
5. Click "Run"
6. Verify no errors

### Verify Success

```sql
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public';
```

**Should now show: 15 tables** (8 + 2 + 5)

---

## ✅ Final Verification

### Check All Tables Created

Run this query:

```sql
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected output (15 tables):**
```
Table Name                          Columns
────────────────────────────────────────────
favorites                              5
item_followers                         4
items                                 20
notification_preferences               8
notifications                          8
project_user_connections               5
projects                              21
publication_subscriptions              8
resource_categories                    7
resources                             20
tags                                   4
user_activity                          7
user_dashboard_config                  6
users                                 17
(14 rows)
```

### Check Row-Level Security (RLS)

1. Go to Supabase Dashboard
2. Click: **Authentication → Policies**
3. You should see 20+ policies listed

**Policies should include:**
- Public profiles are viewable by everyone
- Users can view their own profile
- Active projects are viewable by everyone
- Users can create projects
- Users can update their own projects
- ... and many more

### Check Functions Created

Run this query:

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Should show 10+ functions:**
- auto_create_publication_subscription
- create_notification_preferences
- follow_item
- get_user_feed
- get_user_top_items
- log_user_activity
- mark_notification_read
- notify_followers
- search_projects_nearby
- search_resources_nearby
- unfollow_item
- update_dashboard_personalization
- update_dashboard_timestamp
- update_item_timestamp

---

## 🎉 Success! Database is Activated

Once all 3 migrations complete with no errors:

✅ **15 core database tables created**
✅ **40+ performance indexes created**
✅ **20+ Row-Level Security policies enabled**
✅ **10+ helper functions available**
✅ **Database ready for real data**

---

## 📊 Database Statistics

After activation:

| Metric | Value |
|--------|-------|
| Core Tables | 15 |
| Columns Total | 150+ |
| Indexes | 40+ |
| RLS Policies | 20+ |
| Trigger Functions | 5 |
| Helper Functions | 10+ |
| Views | 5+ |
| Total SQL Lines | 4,142 |
| Creation Time | 30 min |
| Cost | Free (Supabase Free Tier) |

---

## 🚨 Troubleshooting

### Error: "Extension earth does not exist"
**Cause:** PostGIS not enabled
**Fix:** Supabase enables it automatically, just re-run migration

### Error: "Syntax error in SQL statement"
**Cause:** Incomplete copy-paste
**Fix:**
1. Clear the editor
2. Copy the ENTIRE file again
3. Make sure all lines included
4. Re-run

### Error: "Table already exists"
**Cause:** Migration already ran
**Fix:** This is fine! Tables are already created. Proceed to next migration.

### No error message, but tables not created
**Cause:** Check scroll position or pagination
**Fix:**
1. Run verification query: `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';`
2. Should show 15 tables
3. If not, check browser console (F12) for errors

---

## ⏭️ Next Steps After Database Activation

Once migrations complete successfully:

1. **[IMMEDIATE]** - Verify tables created (5 min)
2. **[NEXT]** - Test database connection from app (15 min)
3. **[NEXT]** - Create sample projects (30 min)
4. **[NEXT]** - Test dashboard with real data (30 min)
5. **[LATER]** - Configure storage and email (1 hour)
6. **[LATER]** - Deploy to cloud (1 hour)

---

## 📚 Reference: What Each Migration Does

### Migration 001 - Initial Schema
**8 Core Tables:**
- users (profiles, skills, interests)
- projects (permaculture sites)
- resources (marketplace items)
- resource_categories (nested categories)
- project_user_connections (team members)
- favorites (bookmarks)
- tags (predefined categories)
- Tags & Categories (50+ defaults)

**Features:**
- PostGIS for geospatial queries
- Full-text search ready
- Performance indexes
- RLS for data privacy

---

### Migration 002 - Analytics
**2 Analytics Tables:**
- user_activity (track interactions)
- user_dashboard_config (personalization)

**Views:**
- v_popular_projects (top projects)
- v_popular_resources (top resources)
- v_user_top_items (user personalization)
- v_trending_today (trending now)
- v_user_engagement (engagement stats)

**Features:**
- Activity tracking
- Dashboard personalization
- Analytics views

---

### Migration 003 - Notifications & Pub/Sub
**5 Notification Tables:**
- items (unified flexible items)
- notifications (user feed)
- notification_preferences (settings)
- item_followers (follow system)
- publication_subscriptions (pub/sub)

**Features:**
- Flexible item system
- Notification feed
- Follow/unfollow
- Real-time ready

---

## 💡 Pro Tips

1. **Keep both windows open:**
   - Browser: Supabase SQL Editor
   - Editor: Open the .sql migration file
   - Easy copy-paste between windows

2. **Test each migration:**
   - After each one, run the verification query
   - Confirms success before moving to next

3. **Take a screenshot:**
   - After each successful migration
   - Document your progress
   - Good for troubleshooting later

4. **Read the SQL comments:**
   - Each section has detailed comments
   - Helps understand what's being created
   - Educational while copying

5. **Don't worry about errors:**
   - Migration files are idempotent
   - Safe to run multiple times
   - Can always reset database if needed

---

## ✨ You're Ready!

Your database is about to come to life. Follow the steps above and you'll have a production-ready database schema in 30 minutes.

**Questions?** Check the troubleshooting section or refer to SUPABASE_MIGRATION_PLAN.md

**Let's activate your database!** 🚀

---

## 📋 Activation Checklist

### Before Starting
- [ ] Supabase dashboard open
- [ ] Project mcbxbaggjaxqfdvmrqsc selected
- [ ] SQL Editor ready
- [ ] Migration files ready to copy

### Migration 001
- [ ] File opened: 001_initial_schema.sql
- [ ] SQL copied and pasted
- [ ] Migration ran successfully
- [ ] Verification query shows 8 tables

### Migration 002
- [ ] File opened: 002_analytics.sql
- [ ] SQL copied and pasted
- [ ] Migration ran successfully
- [ ] Verification query shows 10 tables

### Migration 003
- [ ] File opened: 003_items_pubsub.sql
- [ ] SQL copied and pasted
- [ ] Migration ran successfully
- [ ] Verification query shows 15 tables

### Final Verification
- [ ] All 15 tables created
- [ ] All 40+ indexes created
- [ ] All 20+ RLS policies enabled
- [ ] All 10+ functions created
- [ ] Database status: ACTIVE ✅

---

**Status:** Ready for Execution
**Date:** 2025-11-12
**Next:** Run migrations and verify success
**Time:** 30 minutes
**Difficulty:** Easy
**Success Rate:** Very High

Let's do this! 🌱
