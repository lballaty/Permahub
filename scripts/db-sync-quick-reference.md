# Database Sync - Quick Reference

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/db-sync-quick-reference.md

**Description:** Fast lookup commands for database syncing

---

## 🚀 Quick Commands

### Check What's Different (No Risk)

```bash
# Compare row counts (local vs cloud)
./scripts/db-sync-compare.sh
```

### Get Database Dumps

```bash
# Dump local database
PGPASSWORD=postgres pg_dump -h 127.0.0.1 -d postgres -U postgres > /tmp/local_dump.sql

# Dump cloud database
PGPASSWORD='YOUR_CLOUD_PASSWORD' pg_dump -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc > /tmp/cloud_dump.sql
```

### Sync Cloud → Local (Recommended for Dev)

```bash
# One-liner with backup
PGPASSWORD=postgres pg_dump -h 127.0.0.1 -d postgres -U postgres > \
  /tmp/backup_$(date +%Y%m%d_%H%M%S).sql && \
PGPASSWORD='CLOUD_PASSWORD' pg_dump -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc --schema=public --data-only | \
PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres
```

### Sync Local → Cloud (After Seeding Data)

```bash
# Backup cloud first
PGPASSWORD='CLOUD_PASSWORD' pg_dump -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc > /tmp/cloud_backup.sql

# Then sync
PGPASSWORD=postgres pg_dump -h 127.0.0.1 -d postgres -U postgres \
  --schema=public --data-only | \
PGPASSWORD='CLOUD_PASSWORD' psql -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc
```

---

## 📊 Connection Details

```
Local:  PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres
Cloud:  PGPASSWORD='PASSWORD' psql -h aws-1-eu-west-3.pooler.supabase.com \
        -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc
```

Replace `PASSWORD` with cloud database password (from `.env` or password manager)

---

## ⚠️ Before Syncing

- [ ] Local Supabase running: `./start.sh`
- [ ] Cloud accessible: https://supabase.com/dashboard
- [ ] Backup created: `/tmp/backup_*.sql`
- [ ] No active users in either database

---

## 🔍 Verify Sync Success

```bash
# Check specific table
TABLE="wiki_guides"

echo "LOCAL:"
PGPASSWORD=postgres psql -h 127.0.0.1 -d postgres -U postgres -tc \
  "SELECT COUNT(*) FROM public.$TABLE;"

echo "CLOUD:"
PGPASSWORD='CLOUD_PASSWORD' psql -h aws-1-eu-west-3.pooler.supabase.com \
  -d postgres -U postgres.mcbxbaggjaxqfdvmrqsc -tc \
  "SELECT COUNT(*) FROM public.$TABLE;"
```

---

## 📖 Full Guide

See: [DATABASE_SYNC_PROCEDURE.md](../docs/database/DATABASE_SYNC_PROCEDURE.md)
