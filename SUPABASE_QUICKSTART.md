# 🚀 Supabase Quick Start (5 Minutes)

Follow these steps to get your wiki connected to Supabase.

## Prerequisites

- Supabase account ([sign up free](https://supabase.com))

## Step 1: Create Supabase Project (2 min)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Enter:
   - Name: `Permahub Wiki`
   - Database Password: **(save this!)**
   - Region: (choose closest)
4. Click **Create new project**
5. ⏳ Wait ~2 minutes for setup

## Step 2: Run Database Schema (1 min)

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open this file: `database/wiki-complete-schema.sql`
4. Copy ALL the content
5. Paste into the SQL Editor
6. Click **RUN** ▶️

✅ You should see "Success. No rows returned"

**Verify**: Click **Table Editor** - you should see `wiki_guides`, `wiki_events`, `wiki_locations`, etc.

## Step 3: Add Sample Data (Optional, 30 sec)

1. In SQL Editor, click **New Query**
2. Open: `database/seeds/001_wiki_seed_data.sql`
3. Copy & paste
4. Click **RUN** ▶️

This adds 6 sample guides, 3 events, and 6 locations.

## Step 4: Get Your API Keys (30 sec)

1. Click **Project Settings** (⚙️ icon)
2. Click **API**
3. Copy these two values:
   - **Project URL**
   - **anon public** key

## Step 5: Update Config (1 min)

Edit `src/js/config.js`:

```javascript
export const SUPABASE_CONFIG = {
  url: 'YOUR_PROJECT_URL_HERE',  // Replace line 34
  anonKey: 'YOUR_ANON_KEY_HERE', // Replace line 37
  serviceRoleKey: getEnv('VITE_SUPABASE_SERVICE_ROLE_KEY', '')
};
```

## Step 6: Test It! (30 sec)

1. Open `src/wiki/wiki-home.html` in your browser
2. Open browser console (F12)
3. Check for any errors

The wiki should now be connected! 🎉

---

## What's Next?

- **Add content**: Use the wiki editor to create guides
- **Enable auth**: Set up magic link or email/password
- **Deploy**: Push to GitHub Pages or Vercel
- **Custom domain**: Configure in Supabase settings

## Need More Details?

See `docs/SUPABASE_SETUP.md` for comprehensive guide with troubleshooting.

---

## Troubleshooting

**"Failed to fetch"**
- Check that you replaced the URL and key in config.js
- Make sure Supabase project is running (not paused)

**"relation does not exist"**
- The migration didn't run successfully
- Re-run `wiki-complete-schema.sql` in SQL Editor

**No data showing**
- Did you run the seed data?
- Or create content manually in Table Editor

---

## Quick Commands

**View all guides:**
```sql
SELECT * FROM wiki_guides;
```

**Count content:**
```sql
SELECT
  (SELECT COUNT(*) FROM wiki_guides) as guides,
  (SELECT COUNT(*) FROM wiki_events) as events,
  (SELECT COUNT(*) FROM wiki_locations) as locations;
```

**Create a test guide:**
```sql
INSERT INTO wiki_guides (title, slug, summary, content, status)
VALUES (
  'My First Guide',
  'my-first-guide',
  'This is a test guide',
  'Content goes here...',
  'published'
);
```
