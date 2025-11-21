# Database Sync Procedure: Local vs Cloud

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/database/DATABASE_SYNC_PROCEDURE.md

**Description:** Step-by-step procedure for comparing and syncing database content between local development and cloud Supabase

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-20

---

## 🎯 Overview

This procedure allows you to:
1. **Compare** content (data) between local and cloud databases
2. **Identify differences** in tables, records, and auth users
3. **Sync data** from one environment to another
4. **Validate** that sync completed successfully

**Important:** This focuses on **content/data**, not schema. For schema changes, use migrations.

---

## 📊 Database Environments

### Local Database
- **Type:** Supabase Local (PostgreSQL)
- **Location:** `127.0.0.1:5432`
- **Database:** `postgres`
- **Port:** 5432
- **Started via:** `./start.sh`
- **Config:** `supabase/config.toml`
- **Auth:** Supabase Auth (local)

### Cloud Database
- **Type:** Supabase Cloud
- **URL:** `https://mcbxbaggjaxqfdvmrqsc.supabase.co`
- **Project ID:** `mcbxbaggjaxqfdvmrqsc`
- **Database:** PostgreSQL (AWS)
- **Port:** 5432 (via pooler)
- **Host:** `aws-1-eu-west-3.pooler.supabase.com`
- **Auth:** Supabase Auth (cloud)

---

## 🔑 Connection Credentials

### Local Database Connection
```bash
# Connection string
psql postgresql://postgres:postgres@127.0.0.1:5432/postgres

# Environment variable
PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres
```

### Cloud Database Connection
```bash
# Connection string
psql postgresql://postgres.mcbxbaggjaxqfdvmrqsc:PASSWORD@aws-1-eu-west-3.pooler.supabase.com:5432/postgres

# Environment variable (replace PASSWORD with actual password)
PGPASSWORD='PASSWORD' psql -h aws-1-eu-west-3.pooler.supabase.com -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc
```

**Note:** Cloud password is in your `.env` file as `VITE_SUPABASE_SERVICE_ROLE_KEY` or stored in password manager.

---

## 📋 Step 1: Prerequisites

Before syncing, ensure:

- [ ] Local Supabase is running (`./start.sh` was executed)
- [ ] Cloud Supabase project is accessible (https://supabase.com/dashboard)
- [ ] You have cloud database password
- [ ] Both databases have been migrated (same migration versions)
- [ ] No active users modifying data in either environment

---

## 🔍 Step 2: Compare Database Content

### Option A: Quick Table Row Counts

Get a quick overview of data distribution:

```bash
#!/bin/bash
# Compare row counts between local and cloud

echo "=== LOCAL DATABASE ROW COUNTS ==="
PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres -c "
SELECT schemaname, tablename,
       (SELECT count(*) FROM pg_class WHERE relname = tablename) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;"

echo ""
echo "=== CLOUD DATABASE ROW COUNTS ==="
PGPASSWORD='YOUR_CLOUD_PASSWORD' psql -h aws-1-eu-west-3.pooler.supabase.com -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc -c "
SELECT schemaname, tablename,
       (SELECT count(*) FROM pg_class WHERE relname = tablename) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;"
```

**Expected Output Example:**
```
 schemaname |         tablename          | row_count
------------+----------------------------+-----------
 public     | wiki_events                |       145
 public     | wiki_guides                |        89
 public     | wiki_locations             |       234
 public     | resource_categories        |        22
```

### Option B: Full Database Dumps

For comprehensive comparison, create full dumps of both databases:

#### 2a. Create Local Database Dump

```bash
# Dump entire local database (including auth)
PGPASSWORD=postgres pg_dump -h 127.0.0.1 -d postgres -U postgres \
  --no-password \
  --verbose \
  > /tmp/permahub_local_dump.sql

# Check dump file size
ls -lh /tmp/permahub_local_dump.sql

# Count total lines
wc -l /tmp/permahub_local_dump.sql
```

**Output:** Creates SQL file with all table definitions and data from local DB

#### 2b. Create Cloud Database Dump

```bash
# Dump entire cloud database (including auth)
PGPASSWORD='YOUR_CLOUD_PASSWORD' pg_dump -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres \
  -U postgres.mcbxbaggjaxqfdvmrqsc \
  --no-password \
  --verbose \
  > /tmp/permahub_cloud_dump.sql

# Check dump file size
ls -lh /tmp/permahub_cloud_dump.sql

# Count total lines
wc -l /tmp/permahub_cloud_dump.sql
```

#### 2c. Compare Dumps

```bash
# Generate summary of differences
echo "=== COMPARING DUMPS ==="
echo ""
echo "File sizes:"
ls -lh /tmp/permahub_local_dump.sql /tmp/permahub_cloud_dump.sql
echo ""

echo "Line counts:"
echo "Local: $(wc -l < /tmp/permahub_local_dump.sql) lines"
echo "Cloud: $(wc -l < /tmp/permahub_cloud_dump.sql) lines"
echo ""

echo "Creating diff report..."
diff -u /tmp/permahub_local_dump.sql /tmp/permahub_cloud_dump.sql > /tmp/db_differences.diff
echo "Differences saved to: /tmp/db_differences.diff"
echo ""
echo "Total differences (lines):"
wc -l /tmp/db_differences.diff
```

### Option C: Specific Table Comparison

Compare individual critical tables:

```bash
# Compare specific table (e.g., wiki_guides)
TABLE_NAME="wiki_guides"

echo "=== LOCAL: $TABLE_NAME ==="
PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres \
  -c "SELECT COUNT(*) as total_rows, MAX(created_at) as latest_update FROM public.$TABLE_NAME;"

echo ""
echo "=== CLOUD: $TABLE_NAME ==="
PGPASSWORD='YOUR_CLOUD_PASSWORD' psql -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc \
  -c "SELECT COUNT(*) as total_rows, MAX(created_at) as latest_update FROM public.$TABLE_NAME;"
```

---

## 🔄 Step 3: Sync Strategies

Choose the appropriate strategy based on your situation:

### Strategy A: Seed Local from Cloud (Recommended for Development)

**Use when:** Cloud is "source of truth" and you want fresh local data for development

**Steps:**

1. **Backup local database:**
   ```bash
   PGPASSWORD=postgres pg_dump -h 127.0.0.1 -d postgres -U postgres \
     > /tmp/permahub_local_backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Clear local tables (CAUTION: Destructive):**
   ```bash
   PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres << EOF
   -- Disable RLS temporarily to allow truncation
   ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

   -- Truncate all public tables in order (respecting foreign keys)
   TRUNCATE TABLE IF EXISTS public.wiki_events CASCADE;
   TRUNCATE TABLE IF EXISTS public.wiki_guides CASCADE;
   TRUNCATE TABLE IF EXISTS public.wiki_locations CASCADE;
   TRUNCATE TABLE IF EXISTS public.wiki_categories CASCADE;
   TRUNCATE TABLE IF EXISTS public.wiki_theme_groups CASCADE;
   TRUNCATE TABLE IF EXISTS public.wiki_multilingual_content CASCADE;
   TRUNCATE TABLE IF EXISTS public.event_registrations CASCADE;
   TRUNCATE TABLE IF EXISTS public.notifications CASCADE;
   TRUNCATE TABLE IF EXISTS public.notification_preferences CASCADE;
   TRUNCATE TABLE IF EXISTS public.favorites CASCADE;
   TRUNCATE TABLE IF EXISTS public.resources CASCADE;
   TRUNCATE TABLE IF EXISTS public.projects CASCADE;
   TRUNCATE TABLE IF EXISTS public.users CASCADE;
   TRUNCATE TABLE IF EXISTS public.tags CASCADE;
   TRUNCATE TABLE IF EXISTS public.resource_categories CASCADE;

   -- Re-enable RLS
   ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;
   EOF
   ```

3. **Dump specific tables from cloud:**
   ```bash
   # Dump only public schema data (no auth)
   PGPASSWORD='YOUR_CLOUD_PASSWORD' pg_dump \
     -h aws-1-eu-west-3.pooler.supabase.com \
     -d postgres \
     -U postgres.mcbxbaggjaxqfdvmrqsc \
     --schema=public \
     --data-only \
     > /tmp/cloud_public_data.sql
   ```

4. **Restore to local:**
   ```bash
   PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres \
     < /tmp/cloud_public_data.sql
   ```

5. **Verify:**
   ```bash
   PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres \
     -c "SELECT COUNT(*) FROM public.wiki_guides;"
   ```

### Strategy B: Seed Cloud from Local (For Initial Setup)

**Use when:** Local has verified data you want to push to cloud

**Steps:**

1. **Dump local public data:**
   ```bash
   PGPASSWORD=postgres pg_dump -h 127.0.0.1 -d postgres -U postgres \
     --schema=public \
     --data-only \
     > /tmp/local_public_data.sql
   ```

2. **Backup cloud (CRITICAL):**
   ```bash
   PGPASSWORD='YOUR_CLOUD_PASSWORD' pg_dump \
     -h aws-1-eu-west-3.pooler.supabase.com \
     -d postgres \
     -U postgres.mcbxbaggjaxqfdvmrqsc \
     > /tmp/permahub_cloud_backup_$(date +%Y%m%d_%H%M%S).sql
   ```

3. **Clear cloud tables (CAUTION: Destructive):**
   ```bash
   PGPASSWORD='YOUR_CLOUD_PASSWORD' psql \
     -h aws-1-eu-west-3.pooler.supabase.com \
     -d postgres \
     -U postgres.mcbxbaggjaxqfdvmrqsc << EOF
   -- Truncate all public tables
   TRUNCATE TABLE IF EXISTS public.wiki_events CASCADE;
   TRUNCATE TABLE IF EXISTS public.wiki_guides CASCADE;
   -- ... (repeat for all tables)
   EOF
   ```

4. **Restore local data to cloud:**
   ```bash
   PGPASSWORD='YOUR_CLOUD_PASSWORD' psql \
     -h aws-1-eu-west-3.pooler.supabase.com \
     -d postgres \
     -U postgres.mcbxbaggjaxqfdvmrqsc \
     < /tmp/local_public_data.sql
   ```

5. **Verify in Supabase Console:**
   - Go to: https://supabase.com/dashboard
   - Select project: mcbxbaggjaxqfdvmrqsc
   - Go to: Table Editor
   - Check row counts in each table

### Strategy C: Merge Data (Advanced)

**Use when:** Both databases have different data you want to preserve

**Steps:**

1. **Export cloud wiki_guides:**
   ```bash
   PGPASSWORD='YOUR_CLOUD_PASSWORD' psql \
     -h aws-1-eu-west-3.pooler.supabase.com \
     -d postgres \
     -U postgres.mcbxbaggjaxqfdvmrqsc \
     --csv \
     -c "SELECT * FROM public.wiki_guides;" \
     > /tmp/cloud_wiki_guides.csv
   ```

2. **Import to local (handling duplicates):**
   ```bash
   PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres << EOF
   -- Insert only records not already in local (by ID)
   INSERT INTO public.wiki_guides
   SELECT * FROM public.csv_import_temp
   WHERE id NOT IN (SELECT id FROM public.wiki_guides)
   ON CONFLICT (id) DO NOTHING;
   EOF
   ```

3. **Verify merge:**
   ```bash
   echo "Local guides: $(PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres -tc "SELECT COUNT(*) FROM public.wiki_guides;")"
   ```

---

## ✅ Step 4: Validation Checklist

After syncing, verify completeness:

```bash
#!/bin/bash
# Comprehensive sync validation

echo "=== SYNC VALIDATION REPORT ==="
echo "Generated: $(date)"
echo ""

TABLES=(
  "wiki_guides"
  "wiki_events"
  "wiki_locations"
  "wiki_categories"
  "users"
  "projects"
  "resources"
  "resource_categories"
  "notifications"
  "favorites"
)

SOURCE_DB="127.0.0.1"  # Change to cloud host for reverse validation
SOURCE_USER="postgres"
SOURCE_PASS="postgres"

for TABLE in "${TABLES[@]}"; do
  LOCAL_COUNT=$(PGPASSWORD=$SOURCE_PASS psql -h $SOURCE_DB -d postgres -U $SOURCE_USER -tc "SELECT COUNT(*) FROM public.$TABLE;")
  echo "✓ $TABLE: $LOCAL_COUNT records"
done

echo ""
echo "Validation complete!"
```

---

## 🚨 Troubleshooting

### Issue: "Permission denied" during sync

**Solution:** Use service role key, not anon key
```bash
# WRONG - Uses anon key (limited permissions)
PGPASSWORD='ANON_KEY' psql -h ...

# CORRECT - Uses service role key (full permissions)
PGPASSWORD='SERVICE_ROLE_KEY' psql -h ...
```

### Issue: "relation does not exist"

**Solution:** Ensure migrations were run in order
```bash
# Check migration status on cloud
# Go to: https://supabase.com/dashboard → SQL Editor
# Run: SELECT * FROM _supabase_migrations;
```

### Issue: Foreign key constraint violations

**Solution:** Truncate in correct order (child tables first)
```bash
# Correct order
TRUNCATE TABLE public.notifications CASCADE;  -- Child
TRUNCATE TABLE public.users CASCADE;           -- Parent
```

### Issue: RLS prevents truncation

**Solution:** Disable RLS temporarily
```bash
ALTER TABLE public.wiki_guides DISABLE ROW LEVEL SECURITY;
TRUNCATE TABLE public.wiki_guides;
ALTER TABLE public.wiki_guides ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Sync Scripts (Ready to Use)

### script: sync-local-from-cloud.sh

```bash
#!/bin/bash
# Sync local database from cloud (Cloud → Local)
# WARNING: This will OVERWRITE local data!

set -e

# Configuration
LOCAL_HOST="127.0.0.1"
LOCAL_USER="postgres"
LOCAL_PASS="postgres"
LOCAL_DB="postgres"

CLOUD_HOST="aws-1-eu-west-3.pooler.supabase.com"
CLOUD_USER="postgres.mcbxbaggjaxqfdvmrqsc"
CLOUD_PASS="${1:-}"  # Pass as first argument
CLOUD_DB="postgres"

if [ -z "$CLOUD_PASS" ]; then
  echo "Usage: $0 <cloud_password>"
  exit 1
fi

echo "🔄 Syncing LOCAL database from CLOUD..."
echo "⚠️  WARNING: This will OVERWRITE all local data!"
read -p "Continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Cancelled"
  exit 0
fi

echo ""
echo "1️⃣  Backing up local database..."
BACKUP_FILE="/tmp/permahub_local_backup_$(date +%Y%m%d_%H%M%S).sql"
PGPASSWORD=$LOCAL_PASS pg_dump -h $LOCAL_HOST -d $LOCAL_DB -U $LOCAL_USER > "$BACKUP_FILE"
echo "   ✓ Backup saved to: $BACKUP_FILE"

echo ""
echo "2️⃣  Dumping cloud database..."
CLOUD_DUMP="/tmp/cloud_dump_temp.sql"
PGPASSWORD=$CLOUD_PASS pg_dump -h $CLOUD_HOST -d $CLOUD_DB -U $CLOUD_USER \
  --schema=public --data-only > "$CLOUD_DUMP"
echo "   ✓ Cloud dump created"

echo ""
echo "3️⃣  Clearing local tables..."
PGPASSWORD=$LOCAL_PASS psql -h $LOCAL_HOST -d $LOCAL_DB -U $LOCAL_USER << EOF
TRUNCATE TABLE public.wiki_events CASCADE;
TRUNCATE TABLE public.wiki_guides CASCADE;
TRUNCATE TABLE public.wiki_locations CASCADE;
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.favorites CASCADE;
TRUNCATE TABLE public.resources CASCADE;
TRUNCATE TABLE public.projects CASCADE;
TRUNCATE TABLE public.users CASCADE;
TRUNCATE TABLE public.resource_categories CASCADE;
TRUNCATE TABLE public.tags CASCADE;
EOF
echo "   ✓ Local tables cleared"

echo ""
echo "4️⃣  Restoring cloud data to local..."
PGPASSWORD=$LOCAL_PASS psql -h $LOCAL_HOST -d $LOCAL_DB -U $LOCAL_USER < "$CLOUD_DUMP"
echo "   ✓ Data restored"

echo ""
echo "5️⃣  Validating sync..."
LOCAL_GUIDES=$(PGPASSWORD=$LOCAL_PASS psql -h $LOCAL_HOST -d $LOCAL_DB -U $LOCAL_USER -tc "SELECT COUNT(*) FROM public.wiki_guides;")
CLOUD_GUIDES=$(PGPASSWORD=$CLOUD_PASS psql -h $CLOUD_HOST -d $CLOUD_DB -U $CLOUD_USER -tc "SELECT COUNT(*) FROM public.wiki_guides;")

echo "   Local wiki_guides: $LOCAL_GUIDES records"
echo "   Cloud wiki_guides: $CLOUD_GUIDES records"

if [ "$LOCAL_GUIDES" = "$CLOUD_GUIDES" ]; then
  echo "   ✓ Sync successful!"
else
  echo "   ⚠️  Record counts don't match - review backup: $BACKUP_FILE"
fi

echo ""
echo "✅ Sync complete!"
echo "Backup location: $BACKUP_FILE"
```

---

## 📝 Sync Schedule Recommendations

| Scenario | Frequency | Strategy |
|----------|-----------|----------|
| **Development** | Daily | Sync local from cloud (morning) to get latest |
| **Testing** | After each major feature | Seed cloud from local |
| **Production** | Manual | Document every sync with approval |
| **Content Updates** | Real-time | Use migrations + seeded data files |

---

## 🔐 Security Notes

**Important:**

- ❌ Never commit `.env` with credentials
- ❌ Never share cloud password in messages/logs
- ✅ Always backup before destructive sync
- ✅ Use service role key for direct DB access
- ✅ Document all cloud syncs with date/time/reason
- ✅ Review dumps before importing to prevent data corruption

---

## 📚 Related Documentation

- [Supabase Cloud Setup](./supabase-cloud-setup.md)
- [Supabase Local Setup](./supabase-local-setup.md)
- [Data Model Documentation](./data-model.md)
- [Migration Guide](../architecture/migrations-guide.md)

---

**Last Updated:** 2025-11-20

**Status:** Ready to Use

**Next Steps:**
1. Choose a sync strategy (A, B, or C)
2. Run prerequisite checks
3. Execute sync steps
4. Validate with checklist
5. Document results in FixRecord.md
