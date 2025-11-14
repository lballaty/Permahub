# Database Setup Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/DATABASE_SETUP.md

**Description:** Step-by-step guide to set up the Permahub database

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-14

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Check Current Database State

1. Open Supabase Dashboard: http://127.0.0.1:54321 (local) or https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Run this file: `check_database.sql`
4. Review the output to see what's already in your database

### Step 2: Apply All Migrations

1. In SQL Editor, run: `apply_all_migrations.sql`
2. This will safely:
   - Add `view_count` to events and locations
   - Create the `increment_view_count()` function
   - Add initial view counts to existing data
   - Show you a complete status report

### Step 3: (Optional) Load Demo Data

If you want the Madeira and Czech Republic demo data:
1. Run: `seed_madeira_czech.sql`
2. This adds 10+ locations, 2 guides, and 20+ events

---

## 📋 What Gets Created

### Tables (Already Exist):
- ✅ `wiki_guides` - with view_count
- ✅ `wiki_categories`
- ✅ `wiki_guide_categories`
- ✅ `wiki_events` - **will get view_count added**
- ✅ `wiki_locations` - **will get view_count added**

### New Features Added:
- ✅ `view_count` column on events
- ✅ `view_count` column on locations
- ✅ `increment_view_count()` database function
- ✅ Performance indexes
- ✅ Initial random view counts for existing data

### Database Functions:
```sql
-- Call this to increment view count for any item:
SELECT increment_view_count('wiki_guides', 'guide-uuid-here');
SELECT increment_view_count('wiki_events', 'event-uuid-here');
SELECT increment_view_count('wiki_locations', 'location-uuid-here');
```

---

## 🔍 Troubleshooting

### If migrations fail:

**Error: "relation already exists"**
- ✅ This is OK! The script checks and skips existing items

**Error: "permission denied"**
- Make sure you're logged in to Supabase with admin access
- Check your API keys in `.env`

**Error: "column already exists"**
- ✅ This is OK! The script handles this gracefully

### Verify Everything Works:

```sql
-- Check all tables have data
SELECT
  'guides' as type, COUNT(*) as count FROM wiki_guides
UNION ALL
SELECT 'categories', COUNT(*) FROM wiki_categories
UNION ALL
SELECT 'events', COUNT(*) FROM wiki_events
UNION ALL
SELECT 'locations', COUNT(*) FROM wiki_locations;

-- Check view_count columns exist
SELECT column_name, table_name
FROM information_schema.columns
WHERE column_name = 'view_count'
AND table_schema = 'public';

-- Test increment function
SELECT increment_view_count('wiki_guides',
  (SELECT id FROM wiki_guides LIMIT 1)
);
```

---

## 🚀 After Setup

Once migrations are complete:

1. **Restart your dev server** (if running)
2. **Clear browser cache** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. **Test the features**:
   - Open a guide → view count should increment
   - Check events show view counts
   - Check locations show view counts
   - Save/publish in editor should work

---

## 📊 Expected Data After Setup

| Table | Expected Count | Notes |
|-------|---------------|-------|
| `wiki_categories` | 15-45 | Basic + expanded categories |
| `wiki_guides` | 3-10 | Sample guides |
| `wiki_events` | 3-25 | Sample events |
| `wiki_locations` | 3-15 | Sample locations |
| `wiki_guide_categories` | 5-30 | Category associations |

---

## 🆘 Need Help?

1. Check the console logs in browser (F12)
2. Check Supabase logs in dashboard
3. Run `check_database.sql` to see current state
4. All migrations are **idempotent** - safe to run multiple times

---

## ✅ Verification Checklist

After running migrations, verify:

- [ ] `check_database.sql` shows all wiki tables
- [ ] `wiki_events` has `view_count` column
- [ ] `wiki_locations` has `view_count` column
- [ ] `increment_view_count` function exists
- [ ] All tables have some data (count > 0)
- [ ] Browser shows guides/events/locations
- [ ] Opening a guide increments view count
- [ ] Save/Publish in editor works without errors

---

**Status:** Ready to use after running migrations

**Last Updated:** 2025-11-14
