# Supabase Setup Guide for Permahub

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_SETUP_GUIDE.md

## 🚀 Quick Start

Your Supabase project is already created and configured in the app:
- **Project URL:** https://mcbxbaggjaxqfdvmrqsc.supabase.co
- **Anon Key:** Configured in `.env` file

Now you need to create the database tables by running 3 SQL migration files.

---

## 📋 Setup Steps

### Step 1: Go to Supabase Console
1. Open: https://supabase.com/dashboard
2. Select your project: **mcbxbaggjaxqfdvmrqsc**
3. Go to **SQL Editor** (left sidebar)

### Step 2: Run Migration 1 - Initial Schema
1. Click **New Query**
2. Copy the entire contents of: `/database/migrations/001_initial_schema.sql`
3. Paste into the SQL editor
4. Click **Run**
5. Wait for success ✓

**What this creates:**
- 8 core tables (users, projects, resources, etc.)
- 1,400+ lines of SQL
- 20+ indexes for performance
- Row-level security policies
- Helper functions for geospatial queries
- Default tags and categories

### Step 3: Run Migration 2 - Analytics
1. Click **New Query**
2. Copy the entire contents of: `/database/migrations/002_analytics.sql`
3. Paste into the SQL editor
4. Click **Run**
5. Wait for success ✓

**What this creates:**
- User activity tracking
- Dashboard personalization
- Popular items views
- Trending items
- Analytics functions

### Step 4: Run Migration 3 - Pub/Sub System
1. Click **New Query**
2. Copy the entire contents of: `/database/migrations/003_items_pubsub.sql`
3. Paste into the SQL editor
4. Click **Run**
5. Wait for success ✓

**What this creates:**
- Unified items table
- Notification system
- Follower system
- Publication subscriptions
- Real-time notification helpers

---

## ✅ Verification

After running all 3 migrations, verify success:

### Check Tables Exist
1. Go to **Database** → **Tables** (left sidebar)
2. You should see these tables:
   - `users`
   - `projects`
   - `resources`
   - `resource_categories`
   - `project_user_connections`
   - `favorites`
   - `tags`
   - `user_activity`
   - `user_dashboard_config`
   - `items`
   - `publication_subscriptions`
   - `item_followers`
   - `notifications`
   - `notification_preferences`

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

1. ✅ Run all 3 migrations
2. ✅ Verify tables and extensions
3. ✅ Configure email provider
4. ✅ Set up redirect URLs
5. 🚀 Run `npm run dev` and test

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

### Notification System
- **items** - Flexible unified items
- **notifications** - User notifications
- **notification_preferences** - User settings
- **item_followers** - Users following items
- **publication_subscriptions** - Follower tracking

### Analytics Tables
- **user_activity** - Activity tracking
- **user_dashboard_config** - User dashboard settings

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

**Setup completed! Your Permahub backend is ready to go! 🌱**
