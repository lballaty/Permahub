# Catalog of All Destructive Database Operations

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/DESTRUCTIVE_OPERATIONS_CATALOG.md

**Description:** Comprehensive list of all possible destructive database operations that require approval

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## Definition of "Destructive Operation"

Any operation that:
1. Deletes data permanently
2. Modifies existing data in bulk
3. Drops or alters database schema
4. Resets or recreates database
5. Changes access controls or security policies
6. Could cause data loss if executed incorrectly

---

## Category 1: Supabase CLI Commands

### Database Reset Operations
```bash
npx supabase db reset                    # Destroys and recreates entire database
npx supabase db reset --local
npx supabase db reset --linked
supabase db reset                        # Without npx prefix
```

### Database Push Operations (Destructive Mode)
```bash
npx supabase db push --destructive       # Applies migrations with DROP commands
npx supabase db push --linked --destructive
supabase db push --destructive
```

### Migration Operations
```bash
npx supabase migration repair            # Can modify migration history
npx supabase db remote commit            # Commits remote changes (could overwrite)
supabase migration repair
```

### Database Diff with Apply
```bash
npx supabase db diff --schema public | psql  # Could apply destructive changes
```

---

## Category 2: Direct SQL Commands (via psql)

### DROP Commands
```sql
DROP TABLE users;
DROP TABLE users CASCADE;
DROP SCHEMA public CASCADE;
DROP DATABASE postgres;
DROP EXTENSION "uuid-ossp";
DROP FUNCTION function_name();
DROP TRIGGER trigger_name;
DROP POLICY policy_name;
DROP INDEX index_name;
DROP VIEW view_name;
DROP MATERIALIZED VIEW mv_name;
DROP SEQUENCE sequence_name;
DROP TYPE type_name;
```

### TRUNCATE Commands
```sql
TRUNCATE TABLE users;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE users, projects, resources;
```

### DELETE Commands (Bulk)
```sql
DELETE FROM users;
DELETE FROM users WHERE created_at < '2025-01-01';
DELETE FROM users WHERE true;  -- Deletes all rows
```

### ALTER Commands (Destructive Variants)
```sql
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users DROP CONSTRAINT constraint_name;
ALTER TABLE users RENAME TO old_users;  -- Could break application
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;  -- Security risk
```

### UPDATE Commands (Bulk)
```sql
UPDATE users SET is_deleted = true;
UPDATE users SET email = 'deleted@example.com';
UPDATE users SET role = 'admin' WHERE true;  -- Security risk
```

---

## Category 3: PostgreSQL Command-Line Tools

### pg_dump (Potentially Risky)
```bash
pg_dump --clean                          # Generates DROP statements
pg_dump --if-exists                      # Generates DROP IF EXISTS
```

### psql with Inline SQL
```bash
psql -c "DROP TABLE users;"
psql -c "TRUNCATE TABLE users;"
psql -c "DELETE FROM users;"
psql -f destructive_script.sql
PGPASSWORD=postgres psql -c "DROP TABLE users;"
```

### pg_restore (Can Overwrite)
```bash
pg_restore --clean                       # Drops objects before restoring
pg_restore --clean --if-exists
```

### dropdb Command
```bash
dropdb postgres
dropdb -f postgres                       # Force drop (kills connections)
```

---

## Category 4: Docker/Container Commands

### Docker Exec (Database Operations)
```bash
docker exec supabase_db psql -U postgres -c "DROP TABLE users;"
docker exec supabase_db dropdb postgres
docker exec -it supabase_db bash         # Opens shell with DB access
```

### Docker Container Deletion
```bash
docker rm -f supabase_db                 # Removes database container
docker-compose down -v                   # Removes volumes (data loss)
docker volume rm supabase_db_data
```

---

## Category 5: File System Operations

### Direct File Deletion
```bash
rm -rf .supabase/                        # Deletes local Supabase state
rm -rf backups/database/                 # Deletes backups (dangerous!)
rm supabase/migrations/*.sql             # Deletes migration files
```

### Migration File Modification
```bash
sed -i 's/CREATE/DROP/' migrations/001.sql
echo "DROP TABLE users;" >> migrations/001.sql
```

---

## Category 6: Supabase Dashboard API

### API Calls (if scripted)
```bash
curl -X POST https://api.supabase.com/v1/projects/PROJECT/database/reset
curl -X DELETE https://api.supabase.com/v1/projects/PROJECT/tables/users
```

---

## Category 7: Node.js/JavaScript Scripts

### Direct Supabase Client Usage
```javascript
// In a script file
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(URL, SERVICE_ROLE_KEY);

await supabase.from('users').delete().neq('id', 0);  // Deletes all
await supabase.rpc('drop_all_tables');               // If function exists
```

### SQL Execution via Client
```javascript
await supabase.rpc('exec_sql', {
  query: 'DROP TABLE users CASCADE'
});
```

---

## Category 8: Python Scripts

### psycopg2 or Similar
```python
import psycopg2
conn = psycopg2.connect("postgresql://...")
cur = conn.cursor()
cur.execute("DROP TABLE users CASCADE;")
conn.commit()
```

---

## Category 9: Environment Variable Manipulation

### Changing Database Credentials
```bash
export VITE_SUPABASE_URL="https://malicious-db.com"
export VITE_SUPABASE_SERVICE_ROLE_KEY="malicious-key"
# Then any script runs against wrong database
```

### Changing .env File
```bash
sed -i 's/SUPABASE_URL=.*/SUPABASE_URL=wrong_url/' .env
```

---

## Category 10: Build/Deploy Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "reset-db": "supabase db reset --local",
    "nuke": "rm -rf .supabase && supabase db reset"
  }
}
```

```bash
npm run reset-db
npm run nuke
```

---

## Category 11: Git Operations (Indirect)

### Deleting Migration Files from Git
```bash
git rm supabase/migrations/*.sql
git commit -m "Remove migrations"
git push --force                         # Loses migration history
```

### Reverting Database Changes
```bash
git revert <migration-commit>            # Could create conflicting state
git reset --hard HEAD~10                 # Loses migration files
```

---

## Category 12: Backup/Restore Scripts

### Restore Operations (Overwrites Current Data)
```bash
./scripts/db-restore.sh old_backup.sql   # Replaces current database
psql < backups/last_week.sql             # Overwrites current state
```

---

## Category 13: Shell Script Execution

### Any Shell Script That Contains Destructive Commands
```bash
./scripts/cleanup.sh
./scripts/reset-dev-environment.sh
./scripts/nuke-and-rebuild.sh
bash -c "psql -c 'DROP TABLE users;'"
sh -c "supabase db reset"
```

---

## Category 14: Privilege Escalation

### Changing File Permissions
```bash
chmod 777 .env                           # Exposes credentials
chmod +x malicious_script.sh             # Makes dangerous script executable
```

### Running Commands as Root
```bash
sudo psql -c "DROP TABLE users;"
sudo docker exec supabase_db dropdb postgres
```

---

## Pattern-Based Detection Rules

To catch all destructive operations, we need to block commands containing:

### SQL Patterns
- `DROP`
- `TRUNCATE`
- `DELETE` (without WHERE or with broad WHERE)
- `UPDATE` (without WHERE or with broad WHERE)
- `ALTER.*DROP`
- `CASCADE`
- `--clean`
- `--if-exists`

### Command Patterns
- `db reset`
- `dropdb`
- `rm -rf`
- `docker rm`
- `docker-compose down -v`
- `--destructive`
- `--force`
- `-f` (in deletion contexts)

### File Patterns
- `.env` modifications
- `.supabase/` operations
- `backups/` deletions
- `migrations/` deletions or modifications

---

## Recommended Permission Strategy

### Block All, Allow Specific (Whitelist Approach)

Instead of blocking patterns, ONLY allow known-safe operations:

**Safe Operations:**
- Read-only queries (`SELECT`, `EXPLAIN`)
- Backup creation
- Status checks
- Logs viewing
- Non-destructive migrations (CREATE, ADD)

**Require Approval:**
- Everything else

---

## Implementation Strategy

### 1. Claude Permissions Configuration

Move ALL potentially destructive operations to "ask" list:

```json
{
  "permissions": {
    "ask": [
      "Bash(*reset*)",
      "Bash(*drop*)",
      "Bash(*DROP*)",
      "Bash(*truncate*)",
      "Bash(*TRUNCATE*)",
      "Bash(*delete*)",
      "Bash(*DELETE*)",
      "Bash(*--destructive*)",
      "Bash(*CASCADE*)",
      "Bash(*rm -rf*)",
      "Bash(*docker rm*)",
      "Bash(*docker-compose down*)",
      "Bash(psql:* -c *)",
      "Bash(psql:* -f *)",
      "Bash(npx supabase db reset:*)",
      "Bash(npx supabase db push:*)",
      "Bash(supabase db reset:*)",
      "Bash(supabase db push:*)",
      "Bash(./scripts/db-restore.sh:*)",
      "Bash(*exec_sql*)",
      "Bash(*ALTER*DROP*)",
      "Edit(.env)",
      "Edit(.env.*)",
      "Edit(**/migrations/**)"
    ]
  }
}
```

### 2. Pre-Command Hook (If Supported)

Create a hook that analyzes every command before execution:

```bash
#!/bin/bash
# .claude/hooks/pre-bash.sh

COMMAND="$1"

# Destructive pattern detection
DESTRUCTIVE_PATTERNS=(
  "DROP"
  "TRUNCATE"
  "DELETE FROM"
  "db reset"
  "dropdb"
  "rm -rf"
  "docker rm"
  "--destructive"
  "CASCADE"
  "ALTER.*DROP"
)

for pattern in "${DESTRUCTIVE_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "🚨 DESTRUCTIVE OPERATION DETECTED: $pattern"
    echo "Command: $COMMAND"
    echo ""
    echo "Required before proceeding:"
    echo "1. Create backup: ./scripts/db-backup.sh"
    echo "2. Verify backup exists: ls -lh backups/database/latest_full.sql"
    echo ""
    read -p "Have you created a backup? (yes/no): " backup_done
    if [ "$backup_done" != "yes" ]; then
      echo "❌ Operation blocked. Create backup first."
      exit 1
    fi

    read -p "Are you absolutely sure? Type 'DESTROY' to confirm: " confirm
    if [ "$confirm" != "DESTROY" ]; then
      echo "❌ Operation cancelled."
      exit 1
    fi

    echo "⚠️  Proceeding with destructive operation..."
    break
  fi
done

exit 0
```

### 3. Wrapper Scripts

Create safe wrapper scripts that enforce backup-first pattern:

```bash
# scripts/safe-db-reset.sh
#!/bin/bash
echo "🔒 Safe Database Reset"
echo "Step 1: Creating backup..."
./scripts/db-backup.sh "pre-reset-$(date +%Y%m%d-%H%M%S)" || exit 1
echo "Step 2: Resetting database..."
npx supabase db reset --local
echo "✅ Reset complete. Backup saved."
```

---

## Testing Checklist

After implementing stricter permissions, verify:

- [ ] `npx supabase db reset` requires approval
- [ ] `psql -c "DROP TABLE"` requires approval
- [ ] `rm -rf .supabase` requires approval
- [ ] `docker rm supabase_db` requires approval
- [ ] `./scripts/db-restore.sh` requires approval
- [ ] Editing `.env` requires approval
- [ ] Editing migration files requires approval
- [ ] Safe operations (status, logs, SELECT) work without approval
- [ ] Backup creation works without approval

---

## Audit Log

All destructive operations should be logged:

```bash
# Append to backups/database/destructive_operations.log
echo "$(date)|$(whoami)|$COMMAND|$PWD" >> backups/database/destructive_operations.log
```

---

**Last Updated:** 2025-11-15

**Status:** Comprehensive catalog ready for implementation
