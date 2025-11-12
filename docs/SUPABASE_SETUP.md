# Supabase Setup Guide for Permahub Wiki

This guide will help you connect your Permahub Wiki to Supabase.

## Current Status

✅ Supabase client code is ready (`src/js/supabase-client.js`)
✅ Wiki API wrapper is implemented (`src/wiki/js/wiki-supabase.js`)
✅ Database migrations are prepared (5 migration files)
✅ Seed data is ready (2 seed files)

## Option 1: Use Existing Supabase Project (Quick Start)

Your config file already has credentials for an existing Supabase project:

```
URL: https://mcbxbaggjaxqfdvmrqsc.supabase.co
Project Ref: mcbxbaggjaxqfdvmrqsc
```

**If you have access to this project:**

1. Go to [https://supabase.com/dashboard/project/mcbxbaggjaxqfdvmrqsc](https://supabase.com/dashboard/project/mcbxbaggjaxqfdvmrqsc)
2. Click on **SQL Editor** in the left sidebar
3. Run the migrations in order (see step 3 below)

**If you don't have access, proceed to Option 2.**

---

## Option 2: Create New Supabase Project

### Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up or log in
4. Click **New Project**
5. Fill in:
   - **Name**: Permahub Wiki
   - **Database Password**: (choose a strong password - save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
6. Click **Create new project** (takes ~2 minutes)

### Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Project Settings** (⚙️ icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (click "Reveal" first)

### Step 3: Update Configuration

**Option A: Environment Variables (Recommended for production)**

Create `.env` file in project root:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Option B: Direct Config (Quick for testing)**

Edit `src/js/config.js` and replace the fallback values on lines 34-42.

---

## Step 4: Run Database Migrations

Go to your Supabase project dashboard:

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Run each migration file IN ORDER:

### Migration 1: Initial Schema
Copy and paste content from `database/migrations/001_initial_schema.sql`
Click **Run** ▶️

### Migration 2: Analytics
Copy and paste content from `database/migrations/002_analytics.sql`
Click **Run** ▶️

### Migration 3: PubSub
Copy and paste content from `database/migrations/003_items_pubsub.sql`
Click **Run** ▶️

### Migration 4: Wiki Schema ⭐ (Most Important)
Copy and paste content from `database/migrations/004_wiki_schema.sql`
Click **Run** ▶️

### Migration 5: Multilingual Content
Copy and paste content from `database/migrations/005_wiki_multilingual_content.sql`
Click **Run** ▶️

**Verify migrations worked:**
- Click **Table Editor** in sidebar
- You should see tables like: `wiki_guides`, `wiki_events`, `wiki_locations`, etc.

---

## Step 5: Seed Sample Data (Optional)

To add sample wiki content:

1. In **SQL Editor**, create new query
2. Copy content from `database/seeds/001_wiki_seed_data.sql`
3. Click **Run** ▶️
4. Optionally run `database/seeds/002_wiki_seed_data_madeira.sql` for Madeira-specific content

---

## Step 6: Enable Row Level Security (RLS)

The migrations already set up RLS policies, but verify:

1. Go to **Authentication** → **Policies**
2. Check that policies exist for:
   - `wiki_guides`
   - `wiki_events`
   - `wiki_locations`
   - `wiki_favorites`
   - `wiki_collections`

**Default policies:**
- ✅ Anyone can READ published content
- ✅ Authenticated users can CREATE content
- ✅ Content authors can UPDATE/DELETE their own content
- ✅ Users can manage their own favorites/collections

---

## Step 7: Test the Connection

### Quick Test:

Open your browser console on `wiki-home.html` and run:

```javascript
// Test connection
import { wikiAPI } from './js/wiki-supabase.js';

// Fetch guides
const guides = await wikiAPI.getGuides();
console.log('Guides:', guides);

// Get stats
const stats = await wikiAPI.getStats();
console.log('Stats:', stats);
```

If you see data (or empty arrays), it's working! 🎉

---

## Step 8: Switch Wiki to Use Supabase

Your wiki pages currently use mock data. To switch to real data:

### Update `wiki-home.js`:

Replace the sample `guides` array with:

```javascript
import { wikiAPI } from './wiki-supabase.js';

// Load guides from Supabase
let guides = [];

async function loadGuides() {
  guides = await wikiAPI.getGuides({ limit: 10 });
  renderGuides();
}

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
  loadGuides();
  initializeCategoryFilters();
  initializeSearch();
});
```

### Update `wiki-events.js`:

Add Supabase loading:

```javascript
import { wikiAPI } from './wiki-supabase.js';

async function loadEvents() {
  const events = await wikiAPI.getEvents();
  // Render events to page
}
```

---

## Troubleshooting

### Error: "JWT expired" or "Invalid API key"
- Check that you copied the correct anon key
- Make sure you're using the anon key, not the service role key for client-side

### Error: "relation does not exist"
- Migrations didn't run successfully
- Re-run the migration files in SQL Editor

### Error: "permission denied"
- RLS policies might be blocking access
- Check Authentication → Policies
- Ensure "anon" role can SELECT from tables

### No data showing up
- Run the seed data files to add sample content
- Or create content manually in Table Editor

---

## Next Steps

Once connected:

1. ✅ Create your first guide using the wiki editor
2. ✅ Add events and locations
3. ✅ Test search and filtering (will now search real data)
4. ✅ Enable user authentication for creating content
5. ✅ Set up email templates for magic links

---

## Production Deployment

Before deploying:

1. **Use environment variables** - Don't commit `.env` to git
2. **Rotate service role key** - Never expose it client-side
3. **Set up custom domain** for Supabase
4. **Configure email templates** in Supabase dashboard
5. **Review RLS policies** - Ensure they match your security needs
6. **Set up monitoring** - Supabase has built-in analytics

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)

---

Need help? Check the [Supabase Discord](https://discord.supabase.com/) or GitHub issues.
