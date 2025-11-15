# Local Supabase Development Setup

**Status:** ✅ WORKING - Supabase running successfully on Intel Mac
**Supabase CLI:** v2.58.5 (latest)
**Docker:** Colima 0.8.4 with VZ framework
**Goal:** Set up local Supabase for development, then migrate to cloud when ready

---

## Quick Start (Intel Mac with Colima)

**TL;DR - Use the startup script:**

```bash
# Make executable (first time only)
chmod +x ./startsupabase.sh

# Start everything
./startsupabase.sh

# Check status
./startsupabase.sh --status

# Stop when done
./startsupabase.sh --stop
```

**The script handles:**
- ✅ Starting Colima if not running
- ✅ Setting correct Docker context
- ✅ Starting all Supabase services
- ✅ Health checking containers
- ✅ Displaying service URLs

---

## Why Local Development?

✅ **Pros:**
- No API rate limits
- Free unlimited requests
- Test migrations safely
- Faster iteration
- No internet required
- Full control over data

⚠️ **Cons:**
- Requires Docker running (~2GB RAM)
- Need to migrate data to cloud later
- Local only (not accessible from other devices)

---

## Step 1: Start Docker (Colima)

Since you're using Colima, start it first:

```bash
# Start Colima (if not running)
colima start

# Check Docker is working
docker ps
```

**Expected:** Docker daemon is running

---

## Step 2: Update Supabase CLI (Recommended)

```bash
# Update Supabase CLI to latest version
brew upgrade supabase

# Verify new version
supabase --version
```

---

## Step 3: Initialize Supabase Locally

```bash
# Initialize Supabase in your project
supabase init

# This creates:
# - supabase/config.toml (configuration)
# - supabase/seed.sql (seed data)
# - supabase/.gitignore
```

**Expected output:**
```
Finished supabase init.
```

---

## Step 4: Start Local Supabase

```bash
# Start all Supabase services (PostgreSQL, Auth, Storage, etc.)
supabase start

# This will:
# - Download Docker images (~1-2 minutes first time)
# - Start PostgreSQL database
# - Start Auth server
# - Start Storage server
# - Start Realtime server
```

**Expected output:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGci...
service_role key: eyJhbGci...
```

**Save these URLs and keys!** You'll need them in Step 7.

---

## Step 5: Apply Database Schema

Now apply your wiki schema to the local database:

### Option A: Use Consolidated Schema (Recommended)

```bash
# Apply the complete wiki schema
supabase db reset

# Then run your complete schema
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f database/wiki-complete-schema.sql
```

### Option B: Use Supabase Migrations

```bash
# Copy migration files to supabase directory
mkdir -p supabase/migrations

# Create a single migration from your complete schema
cp database/wiki-complete-schema.sql supabase/migrations/20231112000000_wiki_complete_schema.sql

# Apply migrations
supabase db reset
```

### Option C: Manual SQL Editor

1. Open Supabase Studio: http://localhost:54323
2. Click **SQL Editor**
3. Copy contents of [database/wiki-complete-schema.sql](database/wiki-complete-schema.sql)
4. Paste and click **RUN**

---

## Step 6: Add Sample Data (Optional)

```bash
# Apply seed data
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f database/seeds/001_wiki_seed_data.sql
```

**Or via Studio:**
1. Open http://localhost:54323
2. SQL Editor → New Query
3. Copy [database/seeds/001_wiki_seed_data.sql](database/seeds/001_wiki_seed_data.sql)
4. RUN

---

## Step 7: Update Frontend Configuration

### Create `.env.local` file

Create a new file for local development:

```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Local Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOF
```

**Note:** The local anon key is a demo key that works with local Supabase.

### Update `vite.config.js`

Make sure Vite loads `.env.local` in development:

```javascript
// vite.config.js should already handle this, but verify:
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // ... rest of config
  }
})
```

### Update `src/js/config.js` (Already Done)

Your [config.js](src/js/config.js) already uses `getEnv()` which will read from `.env.local` automatically! No changes needed.

---

## Step 8: Start Development Server

```bash
# Start Vite dev server
npm run dev

# Open browser
open http://localhost:3000/src/wiki/wiki-home.html
```

---

## Step 9: Verify Connection

### Check in Browser Console

Open DevTools (F12) and run:

```javascript
// Check if wikiAPI is loaded
console.log('wikiAPI:', typeof window.wikiAPI);

// Test database connection
const guides = await wikiAPI.guides.getAll();
console.log('Guides loaded:', guides.length, guides);

const categories = await wikiAPI.categories.getAll();
console.log('Categories loaded:', categories.length, categories);
```

**Expected:**
- `wikiAPI: object`
- `Guides loaded: 6` (if you ran seed data)
- `Categories loaded: 10`

### Check in Supabase Studio

1. Open http://localhost:54323
2. Click **Table Editor**
3. You should see all wiki tables:
   - wiki_guides
   - wiki_events
   - wiki_categories
   - etc.

---

## Common Commands

### Check Status
```bash
# Check if Supabase is running
supabase status

# View logs
supabase logs
```

### Stop/Restart
```bash
# Stop Supabase (keeps data)
supabase stop

# Start again
supabase start

# Reset database (deletes all data)
supabase db reset
```

### Backup/Restore
```bash
# Dump local database
pg_dump postgresql://postgres:postgres@localhost:54322/postgres > backup.sql

# Restore
psql postgresql://postgres:postgres@localhost:54322/postgres < backup.sql
```

---

## Development Workflow

### 1. Daily Development

```bash
# Morning: Start services
colima start
supabase start
npm run dev

# Work on your code...

# Evening: Stop services (optional, saves RAM)
supabase stop
colima stop
```

### 2. Making Schema Changes

```bash
# Create a new migration
supabase migration new add_new_feature

# Edit the migration file in supabase/migrations/
# Then apply it
supabase db reset
```

### 3. Testing

```bash
# Reset database to clean state
supabase db reset

# Run seed data
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f database/seeds/001_wiki_seed_data.sql

# Run your tests
npm test
```

---

## Migrating to Cloud Later

When you're ready to move to production:

### Option 1: Export Schema and Data

```bash
# Dump your local database
supabase db dump --local > production_schema.sql

# Apply to cloud Supabase
supabase db push
```

### Option 2: Manual Migration

1. Export data from local Studio (CSV)
2. Run schema in cloud SQL Editor
3. Import CSV data via cloud Studio

### Option 3: Supabase Link (Recommended)

```bash
# Link to your cloud project
supabase link --project-ref mcbxbaggjaxqfdvmrqsc

# Push local schema to cloud
supabase db push
```

---

## Troubleshooting

### **CRITICAL**: "error while creating mount source path '/Users/.../docker.sock': operation not supported"

This is a known issue with Intel Mac + Colima VZ framework + Supabase CLI.

**Root Cause:** Supabase CLI tries to mount Docker socket file which isn't supported by Colima's VZ framework on macOS.

**Solution:** Use the startup script (`./startsupabase.sh`) which automatically:
1. Sets Docker context to `colima`
2. Unsets `DOCKER_HOST` environment variable
3. Runs `supabase start` with correct configuration

**Manual fix if needed:**
```bash
# Ensure correct Docker context
docker context use colima

# Start Supabase (unset DOCKER_HOST is critical)
unset DOCKER_HOST && supabase start
```

**Why this works:**
- Colima context points to `/var/run/docker.sock` (inside VM)
- Unsetting DOCKER_HOST prevents trying to mount `~/.colima/default/docker.sock` (on host)
- Supabase containers can access Docker daemon without socket mounting

### "Cannot connect to Docker daemon"

```bash
# Start Colima
colima start

# Check status
colima status

# Verify Docker context
docker context use colima
docker ps
```

### "Port 54321 already in use"

```bash
# Stop existing Supabase
supabase stop

# Or stop the conflicting service
lsof -ti:54321 | xargs kill -9
```

### "Migration failed"

```bash
# Reset and try again
supabase db reset

# Check logs
supabase logs db
```

### "Frontend can't connect"

1. Check Supabase is running: `supabase status`
2. Verify `.env.local` has correct URL
3. Restart Vite: `npm run dev`
4. Check browser console for errors

### "Seed data not showing"

```bash
# Check if data exists
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -c "SELECT COUNT(*) FROM wiki_guides;"

# If zero, re-run seed
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f database/seeds/001_wiki_seed_data.sql
```

---

## Comparison: Local vs Cloud

| Feature | Local Supabase | Cloud Supabase |
|---------|----------------|----------------|
| **Cost** | Free | Free tier: 500MB, then paid |
| **Speed** | Very fast | Depends on internet |
| **Setup** | 10 minutes | 5 minutes |
| **Persistence** | Until you reset | Permanent |
| **Collaboration** | Solo only | Team access |
| **Internet** | Not required | Required |
| **Resources** | Uses ~2GB RAM | No local resources |
| **Deployment** | Manual sync | Auto-deploy |

---

## Recommended Approach

**For Development (Now):**
1. ✅ Use Local Supabase
2. ✅ Develop all features
3. ✅ Test everything thoroughly
4. ✅ Iterate quickly without limits

**For Production (Later):**
1. Set up cloud Supabase project
2. Run schema in cloud SQL Editor
3. Configure production `.env` variables
4. Deploy to Vercel/Netlify
5. Point DNS to production

**Best Practice:**
- Keep `.env.local` for local development
- Use `.env.production` for cloud (never commit!)
- Use same migration files for both

---

## Next Steps

### Immediate (Now):

1. **Start Colima:**
   ```bash
   colima start
   ```

2. **Initialize Supabase:**
   ```bash
   supabase init
   supabase start
   ```

3. **Apply Schema:**
   Open http://localhost:54323 and run [wiki-complete-schema.sql](database/wiki-complete-schema.sql)

4. **Add Seed Data:**
   Run [001_wiki_seed_data.sql](database/seeds/001_wiki_seed_data.sql)

5. **Create `.env.local`:**
   ```bash
   echo "VITE_SUPABASE_URL=http://localhost:54321" > .env.local
   echo "VITE_SUPABASE_ANON_KEY=<anon_key_from_supabase_start>" >> .env.local
   ```

6. **Start Dev Server:**
   ```bash
   npm run dev
   ```

7. **Test Connection:**
   Open http://localhost:3000/src/wiki/wiki-home.html

### After Development Complete:

1. Export local database
2. Create cloud Supabase project
3. Import schema and data
4. Update production config
5. Deploy to Vercel

---

## Files to Update

### Add to `.gitignore`
```
.env.local
supabase/.branches/
supabase/.temp/
```

### Keep in Git
```
supabase/config.toml
supabase/migrations/
database/
```

---

## Resources

- **Supabase Local Development:** https://supabase.com/docs/guides/cli/local-development
- **Supabase Studio:** http://localhost:54323 (when running)
- **Colima Docs:** https://github.com/abiosoft/colima

---

**Status:** Ready to set up local development
**Estimated Time:** 15-20 minutes
**Next Command:** `colima start && supabase init`
