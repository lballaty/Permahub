# Database Safety Procedures

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/DATABASE_SAFETY_PROCEDURES.md

**Description:** Critical safety protocols for all database operations

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-14

---

## 🚨 CRITICAL RULES - NEVER VIOLATE

### Rule #1: ALWAYS Backup Before Destructive Operations

**ANY operation that could delete, modify, or reset data MUST be preceded by a full database backup.**

Destructive operations include:
- `supabase db reset`
- `supabase db push --destructive`
- `DROP TABLE`
- `DROP DATABASE`
- `TRUNCATE`
- Manual data deletion affecting > 10 rows
- Schema migrations that drop columns or tables
- Any operation with `CASCADE`

**Required procedure:**
```bash
# MANDATORY: Run backup BEFORE any destructive operation
./scripts/db-backup.sh "pre-reset-$(date +%Y%m%d-%H%M%S)"

# Wait for backup to complete successfully
# Verify backup files exist in ./backups/database/

# ONLY THEN proceed with destructive operation
```

### Rule #2: NEVER Auto-Reset Without Explicit Approval

Database resets require explicit human approval. No automated process should ever:
- Run `supabase db reset` without user confirmation
- Drop and recreate databases automatically
- Execute destructive migrations automatically

**Approval required from:**
- Project owner (Libor Ballaty)
- OR explicit command from authenticated user
- OR manual execution with backup verification

### Rule #3: Maintain Backup History

**Backup retention policy:**
- Keep last 10 full backups automatically
- Keep all backups from production deployments permanently
- Keep pre-migration backups for 30 days minimum
- Archive backups older than 30 days (compress, move to cold storage)

---

## 📋 Standard Operating Procedures

### Before ANY Migration

```bash
# 1. Create timestamped backup
MIGRATION_NAME="005_user_personalization"  # Example
./scripts/db-backup.sh "pre-migration-${MIGRATION_NAME}-$(date +%Y%m%d-%H%M%S)"

# 2. Verify backup succeeded
ls -lh backups/database/latest_full.sql

# 3. Test migration on local/dev database first
npx supabase db push --local

# 4. Verify migration succeeded
npx supabase db diff

# 5. ONLY THEN apply to staging/production
```

### Before Database Reset

```bash
# 1. MANDATORY backup
./scripts/db-backup.sh "pre-reset-$(date +%Y%m%d-%H%M%S)"

# 2. Verify backup file exists and has reasonable size
ls -lh backups/database/latest_full.sql
# Should see file size > 0 bytes

# 3. Document reason for reset
echo "Reset reason: [REASON]" >> backups/database/reset_log.txt
echo "Reset date: $(date)" >> backups/database/reset_log.txt
echo "Git commit: $(git rev-parse HEAD)" >> backups/database/reset_log.txt
echo "---" >> backups/database/reset_log.txt

# 4. ONLY THEN proceed
npx supabase db reset --local
```

### After Failed Migration

```bash
# DO NOT reset immediately!

# 1. Diagnose the issue
npx supabase db diff
cat .supabase/migrations/*.sql  # Review failing migration

# 2. Document the error
echo "Migration failed at $(date)" >> docs/migration_failures.log
echo "Error: [PASTE ERROR]" >> docs/migration_failures.log

# 3. Fix migration file OR restore from backup
# Option A: Fix the migration
# Edit migration file, test locally

# Option B: Restore from backup
./scripts/db-restore.sh backups/database/latest_full.sql

# 4. Re-attempt migration
```

---

## 🔧 Database Backup Script

### Usage

```bash
# Create backup with custom name
./scripts/db-backup.sh "descriptive-name"

# Create backup with automatic timestamp
./scripts/db-backup.sh

# Examples
./scripts/db-backup.sh "pre-production-deploy"
./scripts/db-backup.sh "before-rls-policy-changes"
./scripts/db-backup.sh "weekly-backup-$(date +%Y-week-%U)"
```

### What Gets Backed Up

The script creates 4 backup files:

1. **Full dump** (`*_full.sql`): Complete database including schema + data
2. **Schema only** (`*_schema.sql`): Just table structures, functions, policies
3. **Data only** (`*_data.sql`): Just the data as INSERT statements
4. **Custom format** (`*_custom.dump`): Binary format for pg_restore

Plus metadata JSON with:
- Timestamp
- Database connection info
- Git commit and branch
- Creator username

### Backup Locations

```
backups/database/
├── backup_20251114_143022_full.sql
├── backup_20251114_143022_schema.sql
├── backup_20251114_143022_data.sql
├── backup_20251114_143022_custom.dump
├── backup_20251114_143022_metadata.json
├── latest_full.sql → backup_20251114_143022_full.sql
└── latest_custom.dump → backup_20251114_143022_custom.dump
```

---

## 🔄 Database Restore Procedures

### Restore from Full Backup

```bash
# Stop the local Supabase instance
npx supabase stop

# Start fresh instance
npx supabase start

# Restore from backup
PGPASSWORD=postgres psql \
  -h 127.0.0.1 \
  -p 54322 \
  -U postgres \
  -d postgres \
  < backups/database/latest_full.sql

# Verify restoration
npx supabase db diff
```

### Restore from Custom Format

```bash
# Using pg_restore for selective restoration
pg_restore \
  -h 127.0.0.1 \
  -p 54322 \
  -U postgres \
  -d postgres \
  --clean \
  --if-exists \
  backups/database/latest_custom.dump

# Restore specific tables only
pg_restore \
  -h 127.0.0.1 \
  -p 54322 \
  -U postgres \
  -d postgres \
  --table=users \
  --table=projects \
  backups/database/latest_custom.dump
```

### Restore Schema Only (for testing migrations)

```bash
# Restore just the schema structure
PGPASSWORD=postgres psql \
  -h 127.0.0.1 \
  -p 54322 \
  -U postgres \
  -d postgres \
  < backups/database/backup_NAME_schema.sql
```

---

## 🚦 Pre-Flight Checklist

### Before Running Migrations

- [ ] Created backup with `./scripts/db-backup.sh`
- [ ] Verified backup file exists and size > 0
- [ ] Reviewed migration SQL for destructive operations
- [ ] Tested migration on local database first
- [ ] Documented migration purpose and expected changes
- [ ] Have rollback plan ready
- [ ] Git commit is clean (all changes committed)

### Before Database Reset

- [ ] Created backup with `./scripts/db-backup.sh`
- [ ] Verified backup file exists
- [ ] Documented reason for reset
- [ ] Confirmed reset is absolutely necessary
- [ ] No alternative solution available
- [ ] Obtained explicit approval from project owner
- [ ] Notified team members (if applicable)

### Before Production Deployment

- [ ] All migrations tested on local database
- [ ] All migrations tested on staging database
- [ ] Production backup created and verified
- [ ] Rollback procedure documented and tested
- [ ] Database maintenance window scheduled
- [ ] Stakeholders notified
- [ ] Monitoring alerts configured
- [ ] Post-deployment verification plan ready

---

## 🔐 Access Control

### Local Development

- Full access to local Supabase instance
- Can reset local database after backup
- Should practice backup/restore regularly

### Staging Environment

- Require backup before any destructive operation
- Track all schema changes in git
- Document all manual changes
- Regular automated backups (daily)

### Production Environment

- **NEVER** reset production database
- **ALWAYS** backup before migrations
- Require two-person approval for destructive operations
- Automated backups every 6 hours
- Point-in-time recovery enabled
- Backup retention: 30 days minimum

---

## 📊 Backup Verification

### Verify Backup Integrity

```bash
# Test restore to temporary database
createdb test_restore
psql test_restore < backups/database/latest_full.sql

# Verify table counts match
psql -d test_restore -c "\dt"
psql -d postgres -c "\dt"

# Compare row counts
psql -d test_restore -c "SELECT COUNT(*) FROM users;"
psql -d postgres -c "SELECT COUNT(*) FROM users;"

# Cleanup
dropdb test_restore
```

### Automated Backup Tests

```bash
# Run weekly backup verification
./scripts/verify-backup.sh backups/database/latest_full.sql
```

---

## 🚨 Emergency Recovery

### Database Corruption

1. **STOP** all writes to database immediately
2. Create emergency backup of current state
3. Restore from most recent verified backup
4. Investigate cause of corruption
5. Implement preventive measures

### Accidental Data Deletion

1. **DO NOT** panic or make it worse
2. Immediately backup current state (preserves what remains)
3. Identify most recent backup before deletion
4. Restore deleted data from backup
5. Verify data integrity
6. Implement additional safeguards

### Failed Migration

1. **DO NOT** reset database
2. Backup current state
3. Review migration error carefully
4. Fix migration file
5. Re-attempt migration
6. If unfixable, restore from pre-migration backup

---

## 📝 Backup Log Template

Keep a log of all backups and restores:

```
backups/database/backup_log.md

## 2025-11-14

### 14:30 - Pre-Reset Backup
- **Reason:** Testing new migration system
- **Backup:** pre-reset-20251114-143022
- **Size:** 2.3 MB
- **Git:** f498a53
- **Status:** ✓ Verified

### 15:45 - Post-Migration Backup
- **Reason:** After applying migrations 004-006
- **Backup:** post-migration-20251114-154522
- **Size:** 2.5 MB
- **Git:** 05b546b
- **Status:** ✓ Verified
```

---

## 🎯 Quick Reference

### Common Commands

```bash
# Backup before reset
./scripts/db-backup.sh "pre-reset-$(date +%Y%m%d-%H%M%S)"

# Backup before migration
./scripts/db-backup.sh "pre-migration-$(date +%Y%m%d-%H%M%S)"

# Restore latest backup
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres < backups/database/latest_full.sql

# List all backups
ls -lht backups/database/*_full.sql

# Verify backup
file backups/database/latest_full.sql
head -20 backups/database/latest_full.sql
```

### Emergency Contacts

- **Project Owner:** Libor Ballaty <libor@arionetworks.com>
- **Database Issues:** Check logs in `.supabase/logs/`
- **Migration Issues:** Review `supabase/migrations/*.sql`
- **Backup Issues:** Check `backups/database/*.log`

---

## ⚠️ REMEMBER

1. **Backup is mandatory, not optional**
2. **Never reset without backup**
3. **Test on local first, always**
4. **Document everything**
5. **When in doubt, backup again**

---

**Last Updated:** 2025-11-14

**Status:** Active Policy - Must be followed for all database operations