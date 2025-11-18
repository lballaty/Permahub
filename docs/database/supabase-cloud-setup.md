# Supabase Setup Guide for Permahub

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_SETUP_GUIDE.md

## 🚀 Quick Start

Your Supabase project is already created and configured in the app:
- **Project URL:** https://mcbxbaggjaxqfdvmrqsc.supabase.co
- **Anon Key:** Configured in `.env` file

Now you need to create the database tables by running **20 SQL migration files** plus **3 seed files**.

---

## 📋 Setup Steps

### Step 1: Go to Supabase Console
1. Open: https://supabase.com/dashboard
2. Select your project: **mcbxbaggjaxqfdvmrqsc**
3. Go to **SQL Editor** (left sidebar)

### Step 2: Run All 20 Migrations in Order

**IMPORTANT:** Run migrations in numeric order (00, 001, 002... 019)

For each migration file in `supabase/migrations/`:

1. Click **New Query**
2. Copy the entire contents of the migration file
3. Paste into the SQL editor
4. Click **Run**
5. Wait for success ✓
6. Proceed to next migration

**Migration Order:**

| # | File | Purpose |
|---|------|---------|
| 1 | `00_bootstrap_execute_sql.sql` | Bootstrap utilities |
| 2 | `001_initial_schema.sql` | 8 core tables |
| 3 | `002_analytics.sql` | Analytics tracking |
| 4 | `003_items_pubsub.sql` | Notifications (5 tables) |
| 5 | `004_expanded_categories.sql` | Category system |
| 6 | `005_row_level_security_policies.sql` | RLS enhancement |
| 7 | `006_wiki_schema.sql` | Wiki tables (guides, events, locations) |
| 8 | `007_wiki_multilingual_content.sql` | i18n support |
| 9 | `008_newsletter_subscriptions.sql` | Newsletter |
| 10 | `009_user_personalization.sql` | User prefs |
| 11 | `010_storage_buckets.sql` | File storage |
| 12 | `011_add_view_counts.sql` | View tracking |
| 13 | `012_issue_tracking.sql` | Issue system |
| 14 | `013_event_registrations.sql` | Event RSVP |
| 15 | `014_issue_tracking_logs.sql` | Logging |
| 16 | `015_wikipedia_references.sql` | Wiki links |
| 17 | `016_fix_guides_events_rls.sql` | RLS fixes |
| 18 | `017_add_soft_deletes.sql` | Soft delete support |
| 19 | `018_create_wiki_theme_groups.sql` | Theme groups table |
| 20 | `019_link_categories_to_themes.sql` | Category-theme linking |

**Estimated time:** 30-45 minutes total

### Step 3: Run All 3 Seed Files

After all migrations complete successfully, run the seed files in `supabase/seeds/`:

1. `003_expanded_wiki_categories.sql` - Wiki category data
2. `012_wiki_theme_groups_seed.sql` - 15 theme group definitions
3. `013_link_categories_to_themes.sql` - Link categories to themes

**Estimated time:** 5 minutes total

---

## ✅ Verification

After running all 20 migrations and 3 seed files, verify success:

### Check Tables Exist
1. Go to **Database** → **Tables** (left sidebar)
2. You should see **23+ tables** including:

**Core Tables:**
   - `users`, `projects`, `resources`, `resource_categories`
   - `project_user_connections`, `favorites`, `tags`

**Notification System:**
   - `items`, `publication_subscriptions`, `item_followers`
   - `notifications`, `notification_preferences`

**Analytics:**
   - `user_activity`, `user_dashboard_config`

**Wiki System:**
   - `wiki_guides`, `wiki_events`, `wiki_locations`
   - `wiki_categories`, `wiki_theme_groups`
   - `wiki_multilingual_content`

**Feature Tables:**
   - `newsletter_subscriptions`, `user_personalization`
   - `event_registrations`, `issue_tracking`, `issue_tracking_logs`
   - `wikipedia_references`

### Check Theme Groups Populated
1. Go to **Database** → **Table Editor**
2. Select `wiki_theme_groups` table
3. Verify **15 theme groups** exist with icons and sort order

### Check Extensions Enabled
1. Go to **Database** → **Extensions** (left sidebar)
2. Verify these are enabled:
   - `uuid-ossp` ✓
   - `earth` ✓

---

## 🔐 Security Configuration

### Enable Row Level Security (RLS)
RLS is automatically enabled by the migrations. Verify:

1. Go to **Database** → **Tables**
2. Click on each table
3. Go to **Auth** tab
4. Verify **Enable RLS** is toggled ON

All policies are pre-configured in the migrations.

---

## 📊 Default Data

The migrations include:
- 21 default tags (project types, techniques, skills, etc.)
- 22 default resource categories (seeds, tools, services, etc.)

These are pre-populated to get you started immediately.

---

## 🔑 API Keys

Your API keys are already configured. They are:

**Anonymous Key (safe for frontend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDE4NDYsImV4cCI6MjA3ODA3Nzg0Nn0.agjLGl7uW0S1tGgivGBVthHWAgw0YxHjJNLHkhsViO0
```

**Service Role Key (keep secret - server-side only):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUwMTg0NiwiZXhwIjoyMDc4MDc3ODQ2fQ.dTRFNjBrZHsLERsjzqSckpJ1oaQcCjIw98_UvgKyQJU
```

These are stored in `.env` file (do not commit).

---

## 📧 Authentication Setup

### Configure Email Provider
1. Go to **Authentication** → **Providers** (left sidebar)
2. Click **Email**
3. Configure:
   - Email OTP expiry: 24 hours
   - Custom SMTP (optional - uses SendGrid by default)

### Configure Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - `http://localhost:3000/auth`
   - `http://localhost:3000/dashboard`
   - Your production domain (when deployed)

---

## 🔧 Testing Connection

Once migrations are complete, test the connection:

```bash
# Start development server
npm run dev

# The app will try to connect to Supabase
# Check browser console (F12) for any errors
# You should see successful Supabase connection
```

---

## 🐛 Troubleshooting

### Migration Fails with "table already exists"
- One of the migrations was already run
- Check **Database** → **Tables** to see what exists
- You can re-run migrations safely (they use `IF NOT EXISTS`)

### RLS Policies Not Working
- Verify RLS is enabled on each table
- Check user is authenticated in browser console
- Verify `auth.uid()` returns a value

### Map/Geospatial Features Not Working
- Verify `earth` extension is enabled
- Restart dev server after enabling extension
- Check browser console for errors

### Getting "permission denied" errors
- Check RLS policies match your user ID
- Verify user is authenticated
- Check Supabase Auth logs

---

## 🚀 Next Steps

1. ✅ Run all 20 migrations (30-45 min)
2. ✅ Run all 3 seed files (5 min)
3. ✅ Verify 23+ tables created
4. ✅ Verify 15 theme groups populated
5. ✅ Configure email provider
6. ✅ Set up redirect URLs
7. 🚀 Run `./start.sh` and test connection

---

## 📚 Database Schema Overview

### Core Tables
- **users** - User profiles (22 columns)
- **projects** - Permaculture projects (21 columns)
- **resources** - Marketplace items (20 columns)
- **resource_categories** - Item categories (7 columns)

### Relationship Tables
- **project_user_connections** - Users in projects
- **favorites** - User bookmarks
- **tags** - Predefined tags

### Wiki System
- **wiki_guides** - Community guides
- **wiki_events** - Events and happenings
- **wiki_locations** - Project locations
- **wiki_categories** - Content categories
- **wiki_theme_groups** - 15 theme groupings
- **wiki_multilingual_content** - Translation support

### Notification System
- **items** - Flexible unified items
- **notifications** - User notifications
- **notification_preferences** - User settings
- **item_followers** - Users following items
- **publication_subscriptions** - Follower tracking

### Analytics Tables
- **user_activity** - Activity tracking
- **user_dashboard_config** - User dashboard settings

### Feature Tables
- **newsletter_subscriptions** - Newsletter management
- **user_personalization** - User preferences
- **event_registrations** - Event RSVP system
- **issue_tracking** - Issue management
- **wikipedia_references** - External wiki links

---

## 🔗 Useful Views

After migrations, these views are available:

- `v_active_projects` - Active projects with creator info
- `v_available_resources` - Available resources with provider info
- `v_popular_projects` - Top 20 projects by views
- `v_popular_resources` - Top 20 resources by views
- `v_user_top_items` - User's top interacted items
- `v_trending_today` - Today's trending items
- `v_user_engagement` - User engagement stats
- `v_unread_notifications` - User's unread count
- `v_items_with_stats` - Items with follower stats

---

## 📞 Support

If you encounter issues:

1. Check browser console: `F12` → **Console** tab
2. Check Supabase logs: Dashboard → **Logs**
3. Verify environment variables: `.env` file
4. Review error messages in SQL Editor

For detailed database schema, see: `/docs/architecture/data-model.md`

---

**Setup completed! Your Permahub cloud database is ready to go! 🌱**

**Last Updated:** 2025-11-17
**Migrations:** 20 files (00, 001-019)
**Seed Files:** 3 files
**Total Tables:** 23+
**Theme Groups:** 15
