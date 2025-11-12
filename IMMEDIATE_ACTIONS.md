# Immediate Actions - Get Database Connected 🚀

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/IMMEDIATE_ACTIONS.md

**Description:** Step-by-step guide to connect Supabase database and enable testing

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-07

---

## 🎯 What We Need to Do NOW

The app is running locally but **NOT connected to the database yet**. We need:

1. **Run 3 SQL migrations in Supabase** (creates all tables)
2. **Verify tables are created**
3. **Test database connection from app**
4. **Then create tests to verify everything**

---

## ✅ STEP 1: Run SQL Migrations (15 minutes)

### What These Do:
- **001_initial_schema.sql** - Creates 8 core tables (users, projects, resources, etc.)
- **002_analytics.sql** - Creates analytics & personalization tables
- **003_items_pubsub.sql** - Creates notification & follower system

### How to Run:

#### Open Supabase Console
1. Go to: https://supabase.com/dashboard
2. Click on project: **mcbxbaggjaxqfdvmrqsc**
3. Left sidebar → **SQL Editor**

#### Run Migration #1 (Initial Schema)

1. Click **New Query** (top-right corner)
2. **Copy entire contents** of:
   `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`

3. **Paste into Supabase SQL Editor**

4. **Click RUN** (blue button, top-right)

5. **Wait for success** - you'll see:
   ```
   ✓ 596 rows affected
   Success. No errors.
   ```

#### Run Migration #2 (Analytics)

1. Click **New Query** again
2. **Copy entire contents** of:
   `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/002_analytics.sql`

3. **Paste and Run**

4. **Wait for success**

#### Run Migration #3 (Pub/Sub)

1. Click **New Query** again
2. **Copy entire contents** of:
   `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/003_items_pubsub.sql`

3. **Paste and Run**

4. **Wait for success**

---

## ✅ STEP 2: Verify Tables Are Created (5 minutes)

### Check Tables Exist

In Supabase Dashboard:

1. Left sidebar → **Database** → **Tables**
2. You should see these tables:
   - ✅ `users`
   - ✅ `projects`
   - ✅ `resources`
   - ✅ `resource_categories`
   - ✅ `project_user_connections`
   - ✅ `favorites`
   - ✅ `tags`
   - ✅ `user_activity`
   - ✅ `user_dashboard_config`
   - ✅ `items`
   - ✅ `publication_subscriptions`
   - ✅ `item_followers`
   - ✅ `notifications`
   - ✅ `notification_preferences`

### Check Extensions Are Enabled

1. Left sidebar → **Database** → **Extensions**
2. Verify these are installed:
   - ✅ `uuid-ossp` - for generating UUIDs
   - ✅ `earth` - for geospatial queries (maps)

---

## ✅ STEP 3: Start Dev Server and Test Connection

```bash
npm run dev
```

Opens: http://localhost:3001

### Check Browser Console (F12)

Look for these signs of success:
- ✅ No 403/404 errors
- ✅ No "Failed to connect to Supabase" errors
- ✅ CSS and images load
- ✅ i18n system initialized
- ✅ Any RLS-related messages are OK (expected)

---

## 🧪 STEP 4: Create Test Infrastructure

Once database is connected, we'll create:

### A. Unit Tests (Vitest)
Test individual functions:
- ✅ i18n translation functions
- ✅ Supabase client methods
- ✅ Configuration loading
- ✅ Utility functions

### B. E2E Tests (Playwright)
Test complete user flows:
- ✅ Authentication (signup, login, logout)
- ✅ Project discovery (browse, search, filter)
- ✅ Map functionality (load, click, filter)
- ✅ Resource marketplace (browse, search, filter)
- ✅ Add items (create project, create resource)
- ✅ Multi-language switching
- ✅ Navigation between pages

---

## 📊 Test Plan Overview

### What Tests Will Verify:

```
Database Connection
├── Can query users table
├── Can query projects table
├── Can query resources table
└── RLS policies work correctly

Authentication Flow
├── User can sign up with email
├── User can login with email/password
├── User profile created in database
├── Session persists
└── Logout works

Project Discovery
├── Projects load from database
├── Filtering by type works
├── Filtering by location works
├── Search works
└── Click project shows details

Map Features
├── Map loads
├── Project markers appear
├── Marker click shows info
└── Radius filtering works

Resources Marketplace
├── Resources load
├── Category filtering works
├── Price filtering works
└── Search works

User Profile
├── User can edit profile
├── Changes persist in database
└── Profile visible in system

Multi-language
├── Can switch languages
├── All pages translate
└── Language persists
```

---

## 🚦 Status Check - Before Moving Forward

After running migrations, check these:

### In Supabase Dashboard:
- [ ] All 3 migrations completed successfully
- [ ] 14 tables exist in Database → Tables
- [ ] 2 extensions enabled (uuid-ossp, earth)
- [ ] RLS is enabled on tables (check each table's Auth tab)

### In Browser:
- [ ] Dev server running: `npm run dev`
- [ ] Pages load at http://localhost:3001/src/pages/
- [ ] No errors in F12 → Console
- [ ] Network tab shows no 403 errors

### In Code:
- [ ] `/src/js/config.js` has correct Supabase URL
- [ ] `.env` file has correct credentials
- [ ] `supabase-client.js` can access environment variables

---

## 📝 Next: Create Tests

Once database is confirmed working:

1. **Install test dependencies:**
   ```bash
   npm install --save-dev vitest @testing-library/dom jsdom
   npm install --save-dev @playwright/test
   ```

2. **Create test files:**
   ```
   /tests
   ├── unit/
   │   ├── i18n.test.js
   │   ├── config.test.js
   │   └── supabase-client.test.js
   └── e2e/
       ├── auth.spec.js
       ├── dashboard.spec.js
       └── resources.spec.js
   ```

3. **Update package.json:**
   ```json
   "scripts": {
     "test": "vitest",
     "test:unit": "vitest run",
     "test:e2e": "playwright test",
     "test:ui": "vitest --ui"
   }
   ```

4. **Write comprehensive tests** for all features

---

## ⚠️ Common Issues During Migrations

### "Table already exists" Error
- This is OK! Migrations use `CREATE TABLE IF NOT EXISTS`
- You can re-run migrations safely

### "Permission denied" in RLS Policies
- This is OK! The policies create restrictions
- Tests will handle this

### "Extension not found" (earth)
- In Supabase SQL Editor, run:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "earth" CASCADE;
  ```

### "UUID-OSSP not found"
- Run:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

---

## 🎯 Timeline

- **Now:** Run migrations (15 min)
- **Next:** Verify tables (5 min)
- **Then:** Test database connection (5 min)
- **After:** Create tests (1-2 hours)
- **Finally:** Run tests and verify everything (30 min)

**Total time to full testing ready: ~2-2.5 hours**

---

## 📞 Reference Files

See these for detailed info:
- `SUPABASE_SETUP_GUIDE.md` - Detailed Supabase setup
- `DEVELOPMENT.md` - Development guide
- `.claude/claude.md` - Coding standards
- `SETUP_COMPLETE.md` - What's been done so far

---

## Ready to Begin?

1. ✅ Open Supabase dashboard
2. ✅ Copy-paste Migration #1 and run it
3. ✅ Copy-paste Migration #2 and run it
4. ✅ Copy-paste Migration #3 and run it
5. ✅ Verify tables exist
6. ✅ Come back and tell me results

Once confirmed, we'll create the test suites!

---

**Let's get this database connected! 🚀**
