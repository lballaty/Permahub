# Supabase Manual Migration Steps
**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_MANUAL_MIGRATION_STEPS.md

**Description:** Step-by-step manual instructions to run all database migrations in Supabase

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-12

**Last Updated:** 2025-11-12

---

## Status: CRITICAL - MANUAL EXECUTION REQUIRED

The database currently has **11 tables deployed** (eco-themes feature migrations), but is **missing 16 core tables** needed for the app to function.

**Tables Currently Missing:**
- users (referenced by auth.users)
- projects
- resources
- resource_categories
- project_user_connections
- favorites
- items
- notifications
- notification_preferences
- item_followers
- publication_subscriptions
- user_activity
- user_dashboard_config
- tags
- And 10+ wiki-related tables

---

## Why Manual Execution?

Supabase REST API does not provide:
- Generic SQL execution endpoints
- RPC functions for arbitrary SQL (unless pre-created)
- Direct SQL console access via API

**Therefore:** The only reliable method is to use Supabase's web SQL Editor and copy-paste SQL directly.

**Time Required:** 15-20 minutes of mechanical execution

---

## Step-by-Step Instructions

### Step 1: Log in to Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Sign in with your account
3. Select project: **mcbxbaggjaxqfdvmrqsc**
4. Click **SQL Editor** in the left sidebar

### Step 2: Create Bootstrap RPC Function (REQUIRED FIRST)

**Status:** This RPC function needs to exist for programmatic migration execution

1. In SQL Editor, clear any existing text
2. Copy and paste the entire content of this file:
   ```
   /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/00_bootstrap_execute_sql.sql
   ```
3. Click **Run** (or press Ctrl+Enter)
4. Verify: You should see **"success"** message

**What This Does:**
- Creates a `public.execute_sql(query TEXT)` RPC function
- Allows programmatic migration execution from Node.js scripts
- Required for future automated deployments

---

### Step 3: Execute Core Migrations (1 of 3)

**File:** `001_initial_schema.sql`

This creates the core tables:
- users
- projects
- resources
- resource_categories
- project_user_connections
- favorites
- tags

**Steps:**

1. In SQL Editor, clear the window
2. Open file: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**
6. **Wait for completion** - This file has 596 lines and may take 10-15 seconds
7. Verify: Check for any errors in output panel

**Expected Result:**
```
FUNCTION create_or_update_user_trigger
FUNCTION create_resource_trigger
COMMENT
...
(many more successful statements)
```

---

### Step 4: Execute Analytics Migration (2 of 3)

**File:** `002_analytics.sql`

This creates:
- user_activity table
- user_dashboard_config table
- Analytics indexes

**Steps:**

1. In SQL Editor, clear the window
2. Open file: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/002_analytics.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**
6. **Wait for completion** - File has 294 lines, may take 5-10 seconds
7. Verify: Check for errors

**Expected Result:**
```
CREATE TABLE
CREATE INDEX
CREATE POLICY
(and more...)
```

---

### Step 5: Execute Notifications & Pub/Sub Migration (3 of 3)

**File:** `003_items_pubsub.sql`

This creates:
- items table (flexible container for projects, resources, events)
- notifications table
- notification_preferences table
- item_followers table
- publication_subscriptions table

**Steps:**

1. In SQL Editor, clear the window
2. Open file: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/003_items_pubsub.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**
6. **Wait for completion** - File has 526 lines
7. Verify: Check for errors

**Expected Result:**
```
CREATE TABLE
CREATE INDEX
CREATE POLICY
(and more...)
```

---

### Step 6: Verify Core Tables Were Created

After running all 3 core migrations, verify tables exist:

```sql
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Steps:**

1. In SQL Editor, clear the window
2. Paste the query above
3. Click **Run**
4. Verify you see at least these tables:
   - ✅ favorites
   - ✅ notifications
   - ✅ items
   - ✅ projects
   - ✅ resources
   - ✅ user_activity
   - ✅ user_dashboard_config
   - ✅ users

---

## Optional: Execute Feature Migrations (4+ of 16)

**Status:** These are already deployed (found 11 tables in database)

The following feature migrations can optionally be re-run if needed:

- `004_wiki_schema.sql` - Wiki system tables
- `20251107_eco_themes.sql` - Eco theme system
- `20251107_discussions.sql` - Discussion forum
- `20251107_events.sql` - Event system
- `20251107_reviews.sql` - Review system
- And 5+ more...

**Note:** These are likely already in your database (11 existing tables found). Only run if you get "table already exists" errors.

---

## Troubleshooting

### Error: "relation 'public.xyz' already exists"

**Cause:** Table already created in previous run

**Solution:** This is safe to ignore - migration is already complete

**What to do:**
- Continue to next migration
- Or modify SQL statement to use `CREATE TABLE IF NOT EXISTS`

---

### Error: "column 'xyz' already exists"

**Cause:** Column already in table from previous migration

**Solution:** Safe to ignore

**What to do:**
- Continue to next migration

---

### Error: "could not find function 'auth.users'"

**Cause:** Supabase auth tables not initialized

**Solution:** Create a test user first to initialize auth schema

**Steps:**
1. Go to Supabase dashboard
2. Click **Authentication** → **Users**
3. Click **Create New User**
4. Enter test email: `test@permahub.local`
5. Set password: `TestPassword123!`
6. Click **Create User**

Then re-run the migration.

---

### Error: "permission denied for schema 'public'"

**Cause:** User doesn't have admin access

**Solution:** Ensure you're using the service role key or admin account

**What to do:**
- Log out and log back in
- Verify you're the project owner

---

### SQL Editor shows "Loading..." forever

**Cause:** Large file taking too long to process

**Solution:** Wait up to 30 seconds for processing

**What to do:**
- Don't click anything - let it finish
- If it times out after 30 seconds, try smaller chunks
- Or try running just one CREATE TABLE statement at a time

---

## Verification Checklist

After executing all 3 core migrations, verify:

- [ ] No critical errors in SQL Editor output
- [ ] At least 8 core tables exist (query above)
- [ ] RLS policies are enabled (check Authentication → Policies)
- [ ] No syntax errors reported

**To check RLS policies:**
1. Go to **Authentication** → **Policies**
2. Verify policies are listed for tables:
   - users
   - projects
   - resources
   - items
   - notifications

---

## Next Steps

After migrations are complete:

1. **Test Database Connection:**
   ```bash
   npm run dev
   ```
   The app should now connect to Supabase successfully

2. **Create Sample Data:**
   - Sign up a test user
   - Create a test project
   - Create a test resource
   - Verify they appear in the dashboard

3. **Run Tests:**
   ```bash
   npm run test:all
   ```

4. **Deploy to Cloud:**
   - Push code to GitHub
   - Deploy to Vercel or Netlify
   - Configure environment variables on cloud

5. **Invite Beta Users:**
   - Share live URL
   - Gather feedback
   - Iterate

---

## Time Breakdown

| Task | Time |
|------|------|
| Step 1: Log in | 1 min |
| Step 2: Create RPC | 2 min |
| Step 3: Core schema | 3 min |
| Step 4: Analytics | 2 min |
| Step 5: Pub/Sub | 3 min |
| Step 6: Verify | 2 min |
| **Total** | **~15 min** |

---

## Important Files Referenced

All migration files are in:
```
/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/
```

Key files:
- `00_bootstrap_execute_sql.sql` - RPC function (run first!)
- `001_initial_schema.sql` - Core tables
- `002_analytics.sql` - Analytics
- `003_items_pubsub.sql` - Notifications

---

## Contact

Questions? Issues?

**Email:** libor@arionetworks.com

**Status:** This guide is your step-by-step manual for getting the database live without needing external tools.

---

**Last Updated:** 2025-11-12

**Next:** After completing these steps, run `npm run dev` to test the connection!
