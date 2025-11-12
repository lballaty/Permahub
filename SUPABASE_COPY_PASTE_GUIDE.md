# Permahub: Copy-Paste Guide for Supabase Migrations
**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_COPY_PASTE_GUIDE.md
**Description:** Easy copy-paste instructions for running database migrations
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-12

---

## 🎯 Quick Overview

You're going to copy 3 SQL files and paste them into Supabase. Takes 30 minutes total.

---

## 📍 Where to Go

1. Open browser
2. Go to: **https://supabase.com/dashboard**
3. Login if needed
4. Select project: **mcbxbaggjaxqfdvmrqsc**
5. Left sidebar → **SQL Editor**
6. Click **New Query** button (top right)

---

## 🔄 Migration 1: Core Schema

### Step 1: Open Migration File

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`

Open this file in your code editor (VS Code, TextEdit, etc.)

### Step 2: Select All & Copy

**In your code editor:**

1. Press: **Ctrl+A** (Windows) or **Cmd+A** (Mac)
   - Entire file is selected (you'll see it highlighted)
2. Press: **Ctrl+C** (Windows) or **Cmd+C** (Mac)
   - File is copied to clipboard

### Step 3: Paste into Supabase

**In Supabase SQL Editor:**

1. Click in the text area (white space)
2. Press: **Ctrl+V** (Windows) or **Cmd+V** (Mac)
   - SQL appears in editor

**Should see:** ~600 lines of SQL starting with `CREATE EXTENSION...`

### Step 4: Run the Query

**In Supabase SQL Editor:**

1. Find the blue **"Run"** button (top right)
   - Or press: **Ctrl+Enter** (Windows) / **Cmd+Enter** (Mac)
2. Click/press it
3. **Wait 2-3 minutes** for execution

**Expected:** Checkmark appears, no error messages

### Step 5: Verify Success

**Still in Supabase SQL Editor, run this:**

```sql
SELECT COUNT(*) as tables_created FROM information_schema.tables WHERE table_schema = 'public';
```

**Expected result:** Should show `8`

---

## 🔄 Migration 2: Analytics Schema

### Step 1: Open Migration File

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/002_analytics.sql`

Open in your code editor

### Step 2: Copy

1. **Ctrl+A** (or **Cmd+A**)
2. **Ctrl+C** (or **Cmd+C**)

### Step 3: Paste into New Query

**In Supabase:**

1. Click **New Query** (top right)
2. Click in text area
3. **Ctrl+V** (or **Cmd+V**)

### Step 4: Run

1. Click blue **"Run"** button (or **Ctrl+Enter** / **Cmd+Enter**)
2. Wait 1 minute

**Expected:** Checkmark, no errors

### Step 5: Verify

```sql
SELECT COUNT(*) as tables_created FROM information_schema.tables WHERE table_schema = 'public';
```

**Expected result:** Should show `10`

---

## 🔄 Migration 3: Pub/Sub & Notifications

### Step 1: Open Migration File

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/003_items_pubsub.sql`

Open in your code editor

### Step 2: Copy

1. **Ctrl+A** (or **Cmd+A**)
2. **Ctrl+C** (or **Cmd+C**)

### Step 3: Paste into New Query

**In Supabase:**

1. Click **New Query** (top right)
2. Click in text area
3. **Ctrl+V** (or **Cmd+V**)

### Step 4: Run

1. Click blue **"Run"** button (or **Ctrl+Enter** / **Cmd+Enter**)
2. Wait 2-3 minutes

**Expected:** Checkmark, no errors

### Step 5: Verify

```sql
SELECT COUNT(*) as tables_created FROM information_schema.tables WHERE table_schema = 'public';
```

**Expected result:** Should show `15`

---

## ✅ Final Verification

### Run this comprehensive check:

```sql
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Should show 15 tables with columns:**
- favorites (5 columns)
- item_followers (4 columns)
- items (20 columns)
- notification_preferences (8 columns)
- notifications (8 columns)
- project_user_connections (5 columns)
- projects (21 columns)
- publication_subscriptions (8 columns)
- resource_categories (7 columns)
- resources (20 columns)
- tags (4 columns)
- user_activity (7 columns)
- user_dashboard_config (6 columns)
- users (17 columns)

---

## 📝 Quick Reference: What to Do

### For Each Migration:

1. **Open** the .sql file
   - 001_initial_schema.sql
   - 002_analytics.sql
   - 003_items_pubsub.sql

2. **Copy** (Ctrl+A, Ctrl+C)

3. **Paste** in Supabase (Ctrl+V)

4. **Run** (Click blue button or Ctrl+Enter)

5. **Wait** (1-3 minutes)

6. **Verify** (Run COUNT query, check number increases)

7. **Repeat** for next migration

---

## ⚠️ Common Questions

**Q: What if I get an error?**
A: Check the error message. Most errors mean:
   - Missing line in copy-paste → Redo the migration
   - Table already exists → That's fine, proceed to next
   - Syntax error → Re-copy and paste the entire file

**Q: How do I know if it worked?**
A: Look for blue checkmark in Supabase. If you see ✓ and no red error, it worked.

**Q: Can I run them out of order?**
A: No. Always run 001, then 002, then 003 in that order.

**Q: What if I mess up?**
A: You can reset the database in Supabase. No harm done.

**Q: How long does each take?**
A: Migration 001 = 2-3 min, Migration 002 = 1 min, Migration 003 = 2-3 min

**Q: Do I need to do anything after?**
A: Run the final verification query to confirm all 15 tables created.

---

## 🚀 Let's Go!

**Step-by-step:**

1. ✅ Open: https://supabase.com/dashboard
2. ✅ Select: mcbxbaggjaxqfdvmrqsc project
3. ✅ Go to: SQL Editor
4. ✅ Click: New Query
5. ✅ Open migration file: 001_initial_schema.sql
6. ✅ Copy all (Ctrl+A, Ctrl+C)
7. ✅ Paste (Ctrl+V)
8. ✅ Run (Ctrl+Enter or click Run)
9. ✅ Verify (Run COUNT query)
10. ✅ Repeat for 002_analytics.sql
11. ✅ Repeat for 003_items_pubsub.sql
12. ✅ Final verification
13. ✅ Done! Database activated

---

## 🎉 You're All Set!

That's it. Follow the steps above and your database will be fully activated in 30 minutes.

**Next:** Read DATABASE_ACTIVATION_GUIDE.md for detailed explanations and troubleshooting.

---

**Status:** Ready to Execute
**Time:** 30 minutes
**Files to Copy:** 3
**Difficulty:** Very Easy
**Success Rate:** Very High

Let's activate that database! 🌱
