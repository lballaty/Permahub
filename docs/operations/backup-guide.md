# Permahub Database Backup System Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/BACKUP_SYSTEM_GUIDE.md

**Description:** Complete guide to Permahub's automated database backup system

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## Overview

Permahub uses a comprehensive automated backup system that creates verified database backups 4 times daily with 60-day retention. The system includes compression, integrity verification, macOS notifications, and automated cleanup.

### Key Features

- **4x Daily Automated Backups** (6 AM, 12 PM, 6 PM, 11:59 PM)
- **60-Day Retention Policy** for automated backups
- **Compression** with gzip level 9 (saves ~85% disk space)
- **Integrity Verification** after every backup
- **macOS Notifications** with user acknowledgment
- **Automated Cleanup** of old backups
- **Complete Database Backup** including all Supabase schemas
- **Metadata Tracking** with git commit/branch information

---

## What Gets Backed Up?

### All Supabase Schemas

The backup system captures the ENTIRE database including:

#### ✅ Public Schema
- All wiki tables (guides, events, locations, categories, etc.)
- User profiles and settings
- Favorites, notifications, analytics
- All your custom application data

#### ✅ Auth Schema
- User accounts and authentication
- Session management
- OAuth integrations
- MFA settings
- Audit logs

#### ✅ Storage Schema
- File storage metadata
- Bucket configurations
- Object references
- S3 multipart uploads

#### ✅ Vault Schema
- Secrets management
- Encrypted storage

#### ✅ Realtime Schema
- Subscription configurations
- Real-time connections

#### ✅ System Schemas
- Extensions
- GraphQL
- PgBouncer
- Supabase Functions
- Migration history

**Result:** Complete disaster recovery capability - restore and everything works!

---

## Backup Types

### Automated Backups

**Format:** `auto_<type>_YYYYMMDD_HHMMSS`

- `auto_morning_*` - 6:00 AM daily
- `auto_noon_*` - 12:00 PM daily
- `auto_evening_*` - 6:00 PM daily
- `auto_nightly_*` - 11:59 PM daily

**Retention:** 60 days

### Manual Backups

**Format:** `backup_YYYYMMDD_HHMMSS` or custom name

Created manually when needed:
```bash
./scripts/db-backup.sh "before-major-change"
```

**Retention:** Manual (kept indefinitely unless manually deleted)

### Emergency Backups

**Format:** `emergency-*` or `pre-*`

Created automatically before risky operations by safety hooks.

**Retention:** Manual (kept indefinitely for safety)

---

## Quick Start

### Check Backup Status

```bash
./scripts/setup-backup-scheduler.sh status
```

Shows:
- Scheduler status (active/inactive)
- Next scheduled backups
- Recent backups

### List All Backups

```bash
./scripts/db-backup-manager.sh list
```

### Create Manual Backup

```bash
./scripts/db-backup.sh "my-backup-name"
```

### Verify Backup Integrity

```bash
./scripts/db-backup-manager.sh verify <backup-name>
```

### Restore a Backup

```bash
./scripts/db-backup-manager.sh restore <backup-name>
```

**Safety Note:** Restore automatically creates a pre-restore backup first!

---

## Scripts Reference

### db-backup.sh

**Purpose:** Manual database backup script

**Usage:**
```bash
./scripts/db-backup.sh [backup-name]
./scripts/db-backup.sh "pre-migration"
```

**Creates:**
- Full database dump (SQL)
- Schema-only dump (SQL)
- Data-only dump (SQL with column inserts)
- Custom format dump (for pg_restore)
- Metadata JSON file

**Features:**
- Automatic directory creation
- "Latest" symlinks
- Cleanup of old backups (keeps last 10)
- Git commit tracking

---

### db-backup-automated.sh

**Purpose:** Enhanced automated backup with compression and verification

**Usage:**
```bash
./scripts/db-backup-automated.sh [backup-type]
./scripts/db-backup-automated.sh morning
./scripts/db-backup-automated.sh test
```

**Features:**
- Full database dump
- Automatic compression (gzip -9)
- Integrity verification (before and after compression)
- macOS notifications with acknowledgment
- Detailed logging
- Metadata with verification status
- 60-day retention with automatic cleanup

**Output:**
- Compressed backup: `<name>_full.sql.gz`
- Metadata: `<name>_metadata.json`
- Log file: `backup_YYYYMMDD_HHMMSS.log`

---

### db-backup-manager.sh

**Purpose:** Backup management utility

**Commands:**

```bash
# List all backups
./scripts/db-backup-manager.sh list

# Verify backup integrity
./scripts/db-backup-manager.sh verify <backup-name>

# Show backup details
./scripts/db-backup-manager.sh info <backup-name>

# Restore backup (creates safety backup first)
./scripts/db-backup-manager.sh restore <backup-name>

# Delete backup
./scripts/db-backup-manager.sh delete <backup-name>

# Cleanup old backups (60 days default)
./scripts/db-backup-manager.sh cleanup [days]
```

**Features:**
- Color-coded backup types (auto, emergency, pre-*)
- Integrity verification
- Safe restore with automatic pre-restore backup
- Selective cleanup

---

### setup-backup-scheduler.sh

**Purpose:** Install and manage automated backup scheduler

**Commands:**

```bash
# Install schedulers (4x daily)
./scripts/setup-backup-scheduler.sh install

# Check scheduler status
./scripts/setup-backup-scheduler.sh status

# Run test backup
./scripts/setup-backup-scheduler.sh test

# Uninstall schedulers
./scripts/setup-backup-scheduler.sh uninstall
```

**Schedule:**
- Morning: 6:00 AM
- Noon: 12:00 PM
- Evening: 6:00 PM
- Nightly: 11:59 PM

**Implementation:** Uses macOS launchd (native scheduling)

---

### db-restore.sh

**Purpose:** Safe database restore script

**Usage:**
```bash
./scripts/db-restore.sh <backup-file>
```

**Features:**
- Safety confirmation prompt
- Automatic pre-restore backup
- Handles compressed and uncompressed backups
- Error handling with recovery instructions

---

## Backup Files Structure

### Directory Layout

```
backups/
├── database/                          # Backup files
│   ├── auto_morning_20251115_060000_full.sql.gz
│   ├── auto_morning_20251115_060000_metadata.json
│   ├── auto_noon_20251115_120000_full.sql.gz
│   ├── auto_noon_20251115_120000_metadata.json
│   ├── emergency-pre-rebuild_*_full.sql
│   ├── latest_auto.sql.gz            # Symlink to latest auto backup
│   └── latest_full.sql                # Symlink to latest manual backup
├── logs/                              # Backup logs
│   ├── backup_20251115_060000.log
│   ├── launchd_morning.log
│   ├── launchd_noon.log
│   ├── launchd_evening.log
│   └── launchd_nightly.log
└── backup-config.json                 # Configuration file
```

### Metadata File Format

```json
{
  "backup_name": "auto_morning_20251115_060000",
  "backup_type": "morning",
  "timestamp": "20251115_060000",
  "database": {
    "host": "127.0.0.1",
    "port": "5432",
    "name": "postgres",
    "user": "postgres"
  },
  "files": {
    "full_compressed": "./backups/database/auto_morning_20251115_060000_full.sql.gz",
    "metadata": "./backups/database/auto_morning_20251115_060000_metadata.json",
    "log": "./backups/logs/backup_20251115_060000.log"
  },
  "sizes": {
    "compressed": "104K"
  },
  "retention_days": 60,
  "created_by": "liborballaty",
  "git_commit": "bea7e96...",
  "git_branch": "main",
  "verified": true
}
```

---

## Notifications

### macOS Notification System

The automated backup system sends macOS notifications that:

1. **Require acknowledgment** - User must click "OK"
2. **Play sounds**
   - Success: "Glass" sound
   - Failure: "Basso" sound
3. **Show details**
   - Backup name
   - Compressed size
   - Success/failure status

### Notification Permissions

Ensure Terminal or your IDE has notification permissions:

1. Open **System Settings** → **Notifications**
2. Find **Terminal** (or your IDE)
3. Enable **Allow notifications**

---

## Troubleshooting

### Backups Not Running

1. **Check scheduler status:**
   ```bash
   ./scripts/setup-backup-scheduler.sh status
   ```

2. **Check launchd logs:**
   ```bash
   cat backups/logs/launchd_morning.log
   cat backups/logs/launchd_morning_error.log
   ```

3. **Verify database is accessible:**
   ```bash
   PGPASSWORD=postgres psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -c "SELECT 1"
   ```

4. **Reinstall schedulers:**
   ```bash
   ./scripts/setup-backup-scheduler.sh uninstall
   ./scripts/setup-backup-scheduler.sh install
   ```

### Backup Verification Fails

1. **Run verification manually:**
   ```bash
   ./scripts/db-backup-manager.sh verify <backup-name>
   ```

2. **Check for corruption:**
   ```bash
   gzip -t backups/database/<backup-name>_full.sql.gz
   ```

3. **Review backup logs:**
   ```bash
   cat backups/logs/backup_*.log
   ```

### Restore Fails

1. **Verify backup first:**
   ```bash
   ./scripts/db-backup-manager.sh verify <backup-name>
   ```

2. **Check database connection:**
   ```bash
   psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -c "SELECT 1"
   ```

3. **Check error logs:**
   ```bash
   # Look for specific PostgreSQL errors
   ```

4. **Manual restore:**
   ```bash
   gunzip -c backups/database/<backup>_full.sql.gz | psql -h 127.0.0.1 -p 5432 -U postgres -d postgres
   ```

### Disk Space Issues

1. **Check backup sizes:**
   ```bash
   du -sh backups/database/*
   ```

2. **Cleanup old backups:**
   ```bash
   ./scripts/db-backup-manager.sh cleanup 30  # Keep only last 30 days
   ```

3. **Delete specific backups:**
   ```bash
   ./scripts/db-backup-manager.sh delete <backup-name>
   ```

---

## Best Practices

### Before Major Changes

Always create a manual backup:
```bash
./scripts/db-backup.sh "before-migration-005"
```

### Monthly Testing

Test restore procedure monthly:
```bash
# 1. Create test backup
./scripts/db-backup.sh "monthly-restore-test"

# 2. Verify it
./scripts/db-backup-manager.sh verify monthly-restore-test_YYYYMMDD_HHMMSS

# 3. Check backup details
./scripts/db-backup-manager.sh info monthly-restore-test_YYYYMMDD_HHMMSS
```

### Regular Monitoring

Check scheduler status weekly:
```bash
./scripts/setup-backup-scheduler.sh status
```

### Offsite Backups

For production, also keep offsite backups:
```bash
# Copy to external drive
cp -r backups/database /Volumes/ExternalDrive/permahub-backups/

# Or upload to cloud storage
# aws s3 sync backups/database s3://permahub-backups/
```

---

## Configuration

### Backup Configuration File

Location: `backups/backup-config.json`

Key settings:
- Schedule times
- Retention policies
- Notification preferences
- Compression settings
- Database connection details

### Environment Variables

Backup scripts respect these environment variables:

```bash
SUPABASE_DB_HOST=127.0.0.1      # Database host
SUPABASE_DB_PORT=5432            # Database port
SUPABASE_DB_USER=postgres        # Database user
SUPABASE_DB_NAME=postgres        # Database name
SUPABASE_DB_PASSWORD=postgres    # Database password
```

Set in `.env` file or pass directly:
```bash
SUPABASE_DB_PORT=5432 ./scripts/db-backup.sh
```

---

## Recovery Scenarios

### Complete Database Loss

1. **Stop Supabase:**
   ```bash
   supabase stop
   ```

2. **Start fresh Supabase:**
   ```bash
   supabase start
   ```

3. **Restore latest backup:**
   ```bash
   ./scripts/db-backup-manager.sh restore auto_nightly_20251114_235900
   ```

4. **Verify data:**
   ```bash
   psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -c "\dt public.*"
   ```

### Corrupted Data

1. **Identify good backup:**
   ```bash
   ./scripts/db-backup-manager.sh list
   ```

2. **Verify backup:**
   ```bash
   ./scripts/db-backup-manager.sh verify <backup-name>
   ```

3. **Restore (creates safety backup first):**
   ```bash
   ./scripts/db-backup-manager.sh restore <backup-name>
   ```

### Migration Rollback

1. **Find pre-migration backup:**
   ```bash
   ./scripts/db-backup-manager.sh list | grep pre-migration
   ```

2. **Restore it:**
   ```bash
   ./scripts/db-backup-manager.sh restore pre-migration-YYYYMMDD_HHMMSS
   ```

---

## Maintenance

### Daily

- Automatic (scheduled backups run automatically)

### Weekly

- Check scheduler status
- Review backup logs for any warnings

### Monthly

- Test restore procedure
- Review disk space usage
- Verify oldest backup still valid

### Quarterly

- Review retention policy
- Consider offsite backup strategy
- Update documentation if needed

---

## Security Considerations

### Backup File Security

- Backups contain **sensitive data** (user accounts, emails, passwords)
- Stored in `backups/database/` directory
- **Not committed to git** (.gitignore)
- Local filesystem permissions apply

### Best Practices

1. **Encrypt backups for production:**
   ```bash
   gpg --encrypt backups/database/<backup>.sql.gz
   ```

2. **Secure backup directory:**
   ```bash
   chmod 700 backups/
   ```

3. **Never commit backups to version control**

4. **Use strong database passwords**

5. **Offsite backups should be encrypted**

---

## Disaster Recovery Plan

### Full System Recovery

1. **Install Permahub dependencies**
   - Node.js, npm
   - PostgreSQL client tools
   - Supabase CLI

2. **Clone repository**
   ```bash
   git clone <repo-url>
   cd Permahub
   ```

3. **Copy backups**
   - Restore `backups/` directory from external storage

4. **Start Supabase**
   ```bash
   supabase start
   ```

5. **Restore database**
   ```bash
   ./scripts/db-backup-manager.sh restore <latest-backup>
   ```

6. **Verify application**
   ```bash
   npm run dev
   ```

**Recovery Time Objective (RTO):** < 1 hour

**Recovery Point Objective (RPO):** Max 6 hours (worst case: between noon and evening backups)

---

## Support

### Questions or Issues

1. Check this documentation
2. Review log files in `backups/logs/`
3. Check git commit history for recent changes
4. Consult Supabase documentation: https://supabase.com/docs

### Reporting Issues

Include:
- Error messages
- Relevant log files
- Backup name and type
- Database status output

---

## Appendix

### Compression Ratios

Typical compression with gzip -9:

- Uncompressed full backup: ~628 KB
- Compressed full backup: ~104 KB
- **Compression ratio: ~83%**

### Backup Times

On local Supabase instance:

- Full dump: ~1 second
- Verification: < 1 second
- Compression: < 1 second
- **Total: ~2-3 seconds per backup**

### Disk Space Estimates

For 60-day retention with 4x daily backups:

- Backups per day: 4
- Backups total: 240
- Size per backup: ~104 KB
- **Total disk space: ~25 MB**

Very reasonable for complete peace of mind!

---

**Last Updated:** 2025-11-15

**Status:** Active and Operational

**Next Review:** 2025-12-15
