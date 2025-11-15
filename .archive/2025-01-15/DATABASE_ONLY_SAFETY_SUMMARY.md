# Database-Only Safety Configuration - Final

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/DATABASE_ONLY_SAFETY_SUMMARY.md

**Description:** Final safety configuration focused ONLY on database content/structure (not git-tracked)

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## 🎯 Core Principle

**Protect ONLY what cannot be recovered via git:**
- ✅ Database content (user data, projects, resources)
- ✅ Database structure (tables, columns, indexes)
- ✅ Database configuration (.env files with credentials)
- ✅ Backups (safety net)
- ❌ NOT code files (git-tracked, recoverable)
- ❌ NOT migrations (git-tracked, recoverable)

---

## 🛡️ What IS Protected (Requires Approval)

### 1. All Direct Database Operations

**SQL Commands (any containing these keywords):**
- `DROP` - Drops tables, columns, databases
- `TRUNCATE` - Empties tables
- `DELETE` - Removes rows
- `ALTER` - Modifies structure
- `UPDATE` - Changes data
- `CASCADE` - Cascading deletes
- `reset` - Database resets

**All psql commands require approval:**
```bash
psql -c "..."                          # ⚠️  Requires approval
PGPASSWORD=postgres psql -c "..."      # ⚠️  Requires approval
SUPABASE_DB_PORT=5432 psql -c "..."    # ⚠️  Requires approval
```

### 2. All Docker Database Access

**docker exec - ANY command:**
```bash
docker exec supabase_db psql ...       # ⚠️  Requires approval
docker exec supabase_db bash           # ⚠️  Requires approval
docker exec -it supabase_db sh         # ⚠️  Requires approval
docker exec supabase_db dropdb ...     # ⚠️  Requires approval
```

**docker run with database access:**
```bash
docker run ... psql ...                 # ⚠️  Requires approval
docker run ... pg_restore ...           # ⚠️  Requires approval
docker run ... dropdb ...               # ⚠️  Requires approval
docker run --network ... postgres ...   # ⚠️  Requires approval
```

### 3. Database Container/Volume Operations

**Container operations (database containers only):**
```bash
docker rm supabase_db                   # ⚠️  Requires approval
docker rm supabase-db-permahub          # ⚠️  Requires approval
docker rm postgres-1                    # ⚠️  Requires approval
docker stop supabase_db                 # ⚠️  Requires approval
docker kill supabase_db                 # ⚠️  Requires approval
```

**Volume operations (ALL - permanent data loss):**
```bash
docker volume rm supabase_db_data       # ⚠️  Requires approval
docker volume prune                     # ⚠️  Requires approval
docker system prune -v                  # ⚠️  Requires approval
```

**docker-compose operations:**
```bash
docker-compose down                     # ⚠️  Requires approval
docker-compose down -v                  # ⚠️  Requires approval
docker-compose up --force-recreate      # ⚠️  Requires approval
```

### 4. Supabase Database Commands

**Database operations:**
```bash
npx supabase db reset                   # ⚠️  Requires approval
npx supabase db push                    # ⚠️  Requires approval
supabase db reset                       # ⚠️  Requires approval
```

### 5. Database Tools

**PostgreSQL tools:**
```bash
pg_dump --clean                         # ⚠️  Requires approval
pg_restore ...                          # ⚠️  Requires approval
dropdb postgres                         # ⚠️  Requires approval
createdb postgres                       # ⚠️  Requires approval
```

### 6. Database Scripts

**Custom database scripts:**
```bash
./scripts/db-restore.sh                 # ⚠️  Requires approval
./scripts/fix-rls-policies.sh           # ⚠️  Requires approval
./scripts/fix-rls-policies.py           # ⚠️  Requires approval
```

### 7. Environment & Credentials

**.env files (contain DB credentials):**
```bash
Edit(.env)                              # ⚠️  Requires approval
Write(.env)                             # ⚠️  Requires approval
Edit(.env.local)                        # ⚠️  Requires approval
rm .env                                 # ⚠️  Requires approval
```

**Credential extraction:**
```bash
docker inspect ... | grep password      # ⚠️  Requires approval
docker inspect ... | grep PASSWORD      # ⚠️  Requires approval
```

### 8. Backup Deletion

**Backup files (the safety net):**
```bash
rm backups/database/backup.sql          # ⚠️  Requires approval
rm -rf backups/                         # ⚠️  Requires approval
mv backups/old_backups/                 # ⚠️  Requires approval
```

---

## ✅ What is NOT Protected (Auto-Allowed)

### 1. All Git Operations (Git-Tracked, Recoverable)

```bash
git checkout feature-branch             # ✅ Auto-allowed
git add src/                            # ✅ Auto-allowed
git commit -m "message"                 # ✅ Auto-allowed
git push origin main                    # ✅ Auto-allowed
git rm old_file.js                      # ✅ Auto-allowed
git reset --hard HEAD                   # ✅ Auto-allowed
git revert abc123                       # ✅ Auto-allowed
```

**Rationale:** All recoverable via git history

### 2. Migration Files (Git-Tracked)

```bash
npx supabase migration new add_column   # ✅ Auto-allowed
supabase migration list                 # ✅ Auto-allowed
cat migrations/001_initial.sql          # ✅ Auto-allowed
vim migrations/002_add_field.sql        # ✅ Auto-allowed
```

**Rationale:** Migration files are in git, recoverable

### 3. Code File Operations (Git-Tracked)

```bash
rm src/old_component.js                 # ✅ Auto-allowed
rm -rf temp_folder/                     # ✅ Auto-allowed
mv src/old.js src/new.js                # ✅ Auto-allowed
cp src/template.js src/new.js           # ✅ Auto-allowed
```

**Rationale:** All code is in git, easily recoverable

**Exception:** Deleting backups/ or .env still requires approval

### 4. Package Management

```bash
npm install                             # ✅ Auto-allowed
npm install express                     # ✅ Auto-allowed
npx playwright install                  # ✅ Auto-allowed
```

**Rationale:** package.json is in git, node_modules is regenerable

### 5. File Permissions

```bash
chmod +x script.sh                      # ✅ Auto-allowed
chmod 755 deploy.sh                     # ✅ Auto-allowed
```

**Rationale:** Git tracks permissions, recoverable

### 6. Script Execution (Non-Database)

```bash
bash build.sh                           # ✅ Auto-allowed
sh deploy.sh                            # ✅ Auto-allowed
python3 analyze.py                      # ✅ Auto-allowed
node test.js                            # ✅ Auto-allowed
```

**Rationale:** Scripts are in git, can review before running

### 7. Read Operations (All Safe)

```bash
cat migrations/001.sql                  # ✅ Auto-allowed
grep "CREATE TABLE" *.sql               # ✅ Auto-allowed
ls backups/database/                    # ✅ Auto-allowed
head -20 backup.sql                     # ✅ Auto-allowed
docker ps                               # ✅ Auto-allowed
docker logs supabase_db --tail 10       # ✅ Auto-allowed
docker images                           # ✅ Auto-allowed
```

**Rationale:** Read-only, no risk

### 8. Backup Creation (Encouraged!)

```bash
./scripts/db-backup.sh                  # ✅ Auto-allowed
./scripts/db-backup.sh "pre-deploy"     # ✅ Auto-allowed
```

**Rationale:** Creating backups is SAFE and encouraged

### 9. Status Commands

```bash
npx supabase status                     # ✅ Auto-allowed
supabase status                         # ✅ Auto-allowed
docker-compose ps                       # ✅ Auto-allowed
git status                              # ✅ Auto-allowed
```

**Rationale:** Status checks are read-only

---

## 🔍 Key Protection Patterns in "ask" List

```json
"ask": [
  "Bash(*reset*)",               // Catches: db reset, docker reset, etc.
  "Bash(*DROP*)",                // Catches: DROP TABLE, DROP DATABASE
  "Bash(*TRUNCATE*)",            // Catches: TRUNCATE TABLE
  "Bash(*DELETE*)",              // Catches: DELETE FROM
  "Bash(*ALTER*)",               // Catches: ALTER TABLE DROP COLUMN
  "Bash(*UPDATE*)",              // Catches: UPDATE users SET
  "Bash(*CASCADE*)",             // Catches: DROP ... CASCADE

  "Bash(rm:*backups*)",          // Protects backup directory
  "Bash(rm:*.env*)",             // Protects environment files

  "Bash(docker exec:*)",         // ALL docker exec (DB access)
  "Bash(docker run:* psql:*)",   // Docker psql access
  "Bash(docker rm:*db*)",        // Removing DB containers
  "Bash(docker volume rm:*)",    // Permanent data loss
  "Bash(docker-compose down:*)", // Could include -v flag

  "Bash(psql:*)",                // ALL psql commands
  "Bash(npx supabase db:*)",     // ALL supabase db commands
  "Bash(pg_restore:*)",          // Overwrites database
  "Bash(dropdb:*)",              // Drops database

  "Edit(.env)",                  // Editing credentials
  "Write(.env)"                  // Overwriting credentials
]
```

---

## 📊 Comparison: Before vs After

### Before (Current Config - RISKY)
```
❌ docker exec supabase_db psql -c "DROP TABLE users;"    → Executes immediately
❌ psql -c "TRUNCATE TABLE projects;"                     → Executes immediately
❌ docker volume rm supabase_db_data                      → Permanent data loss
❌ npx supabase db reset                                  → Database destroyed
❌ rm backups/database/*.sql                              → Safety net deleted
```

### After (Strict Config - SAFE)
```
⚠️  docker exec supabase_db psql -c "DROP TABLE users;"   → Requires approval
⚠️  psql -c "TRUNCATE TABLE projects;"                    → Requires approval
⚠️  docker volume rm supabase_db_data                     → Requires approval
⚠️  npx supabase db reset                                 → Requires approval
⚠️  rm backups/database/*.sql                             → Requires approval

✅ git commit -m "update schema"                          → Auto-allowed (git-tracked)
✅ rm src/old_file.js                                     → Auto-allowed (git-tracked)
✅ npm install                                            → Auto-allowed (package.json in git)
✅ ./scripts/db-backup.sh                                 → Auto-allowed (creating safety)
✅ npx supabase migration new                             → Auto-allowed (git-tracked)
```

---

## 🎯 Design Philosophy

### Protected (Non-Git-Tracked)
1. **Database content** - Not in git, live user data
2. **Database structure** - Not in git, production state
3. **Environment variables** - Not in git (in .gitignore)
4. **Backups** - Not in git (in .gitignore)
5. **Docker volumes** - Not in git, contains database files

### Not Protected (Git-Tracked)
1. **Source code** - In git, easily recoverable
2. **Migration files** - In git, versioned
3. **Configuration files** - In git (except .env)
4. **Scripts** - In git, versioned
5. **Dependencies** - Regenerable from package.json (in git)

---

## 🚀 Ready to Apply

**Configuration file:** [.claude/settings.local.json.strict](.claude/settings.local.json.strict)

**Command to apply:**
```bash
cp .claude/settings.local.json.strict .claude/settings.local.json
```

**What this protects:**
- ✅ Database content and structure (40+ patterns)
- ✅ Docker database operations (25+ patterns)
- ✅ Environment credentials (5+ patterns)
- ✅ Backups (3+ patterns)

**What this does NOT protect:**
- ❌ Git-tracked files (code, migrations, etc.)
- ❌ Development workflows (git, npm, etc.)
- ❌ Read operations (cat, grep, ls, etc.)
- ❌ Backup creation (encouraged!)

**Total approval requests per day:** 1-3 (only for actual database operations)

**Impact on normal development:** Minimal

---

## ✅ Final Checklist

- [x] Database operations require approval
- [x] Docker database access requires approval
- [x] Volume operations require approval
- [x] Backup deletion requires approval
- [x] .env changes require approval
- [x] Git operations auto-allowed (recoverable)
- [x] Migration creation auto-allowed (git-tracked)
- [x] Code changes auto-allowed (git-tracked)
- [x] Backup creation auto-allowed (encouraged)
- [x] Read operations auto-allowed (safe)
- [ ] **USER APPROVAL TO APPLY**

---

## 📞 Quick Decision Guide

**Q: Will this command modify database content or structure?**
- Yes → ⚠️  Requires approval
- No → ✅ Auto-allowed

**Q: Is this file/operation tracked in git?**
- Yes → ✅ Auto-allowed (recoverable via git)
- No → Check if database-related

**Q: Can this be recovered from git?**
- Yes → ✅ Auto-allowed
- No → ⚠️  Requires approval

**Examples:**
- `git rm migrations/001.sql` → ✅ Auto-allowed (git can recover)
- `psql -c "DELETE FROM users;"` → ⚠️  Requires approval (cannot recover from git)
- `rm src/component.js` → ✅ Auto-allowed (git can recover)
- `docker volume rm supabase_db_data` → ⚠️  Requires approval (permanent data loss)

---

**Ready to apply?**

**Command:**
```bash
cp .claude/settings.local.json.strict .claude/settings.local.json
```

**Should I proceed?**

---

**Last Updated:** 2025-11-15

**Status:** ✅ Complete - Awaiting final approval to apply
