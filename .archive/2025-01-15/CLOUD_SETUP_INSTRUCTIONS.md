# Cloud Supabase Setup Instructions

Since the CLI connection is being refused (database might be paused), here's how to set up the wiki schema in your cloud Supabase manually.

---

## Option 1: Via Supabase Dashboard (Recommended)

### 1. Go to Supabase SQL Editor
Open: https://supabase.com/dashboard/project/mcbxbaggjaxqfdvmrqsc/sql/new

### 2. Apply Wiki Schema
1. Open the file: `database/wiki-complete-schema.sql`
2. Copy all contents (Cmd+A, Cmd+C)
3. Paste into SQL Editor
4. Click **RUN** (or press Cmd+Enter)

This will create all 12 wiki tables:
- wiki_categories
- wiki_guides
- wiki_events
- wiki_locations
- wiki_collections
- wiki_favorites
- And 6 translation tables

### 3. Apply Seed Data (Optional)
**First seed file:**
1. Open `database/seeds/001_wiki_seed_data.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **RUN**

**Madeira-specific data:**
1. Open `database/seeds/002_wiki_seed_data_madeira.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **RUN**

This will add:
- 15 categories
- 10 guides
- 14 events
- 17 locations

---

## Option 2: Wake Up Database & Use CLI

If the database is paused, you need to wake it up first:

### 1. Open Supabase Dashboard
https://supabase.com/dashboard/project/mcbxbaggjaxqfdvmrqsc

### 2. Check Database Status
- If it shows "Paused", click "Resume" or "Restore"
- Wait for it to become active (may take 1-2 minutes)

### 3. Then Run CLI Push
```bash
supabase db push
```

---

## Option 3: Direct PostgreSQL Connection

If you have the database password:

```bash
# Get connection string from Supabase dashboard
# Settings → Database → Connection string → Direct connection

psql "postgresql://postgres:[YOUR-PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:5432/postgres" \
  -f database/wiki-complete-schema.sql
```

---

## After Schema is Applied

### Update Frontend to Use Cloud

Create or update `.env.local`:

```bash
# Cloud Supabase Configuration
VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY_FROM_DASHBOARD>
```

To get your anon key:
1. Go to https://supabase.com/dashboard/project/mcbxbaggjaxqfdvmrqsc/settings/api
2. Copy the **anon** **public** key
3. Paste it into `.env.local`

### Verify Connection

```bash
# Test API endpoint
curl https://mcbxbaggjaxqfdvmrqsc.supabase.co/rest/v1/wiki_categories?select=id,name_en&limit=3 \
  -H "apikey: YOUR_ANON_KEY"
```

---

## For Remote Team Members

Once schema is applied and frontend is configured:

### 1. Share the Cloud URL
```
Supabase URL: https://mcbxbaggjaxqfdvmrqsc.supabase.co
Anon Key: <from dashboard>
```

### 2. They Update Their .env.local
```bash
VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
VITE_SUPABASE_ANON_KEY=<the_anon_key>
```

### 3. They Start Dev Server
```bash
npm install  # if needed
npm run dev
```

### 4. Everyone Accesses Same Cloud Database
All team members will now be reading/writing to the same cloud database.

---

## Troubleshooting

### "Connection refused" Error
- Database is likely paused (free tier pauses after inactivity)
- Go to dashboard and resume/restore database
- Wait 1-2 minutes for it to fully wake up

### "Permission denied" in SQL Editor
- Make sure you're logged into correct account
- Check you have owner/admin access to project

### Schema Already Exists
- If tables already exist, you can:
  - Drop them first: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
  - Or use `CREATE TABLE IF NOT EXISTS` (already in schema file)

---

## Current Local Setup

Your local Supabase is still working perfectly with the wiki schema and seed data.

**Switch between local and cloud** by changing `.env.local`:

**Local Development:**
```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

**Cloud/Remote Testing:**
```bash
VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
VITE_SUPABASE_ANON_KEY=<from_dashboard>
```

---

**Recommendation:** Use Option 1 (Dashboard SQL Editor) - it's the fastest and most reliable way to set up the schema.
