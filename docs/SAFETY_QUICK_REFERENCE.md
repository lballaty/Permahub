# Database Safety - Quick Reference Card

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/SAFETY_QUICK_REFERENCE.md

**Last Updated:** 2025-11-15

---

## 🛡️ Two-Layer Protection System

```
┌─────────────────────────────────────────────┐
│ LAYER 1: Claude Permissions (AI Level)     │
│ Status: ✅ ACTIVE                           │
│ File: .claude/settings.local.json          │
│ Protection: AI asks YOU before executing   │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│ LAYER 2: Programmatic Hooks (Shell Level)  │
│ Status: 🔧 Ready to enable                  │
│ File: .hooks/database-safety.sh            │
│ Protection: Shell intercepts ALL commands   │
└─────────────────────────────────────────────┘
```

---

## 🚨 What's Protected

### ✅ Requires Approval:
- All SQL: DROP, TRUNCATE, DELETE, ALTER, UPDATE
- All docker exec (any command)
- docker volume rm (permanent data loss)
- docker-compose down (could include -v)
- npx supabase db reset
- Database restores
- Backup deletion
- .env file changes

### ✅ Auto-Allowed:
- Git operations (recoverable)
- npm install (regenerable)
- Backup creation (encouraged!)
- Read operations (safe)
- Migration creation (git-tracked)

---

## 📝 Quick Commands

### Test Infrastructure:
```bash
./scripts/test-safety-hooks.sh
```

### Enable Layer 2 (Shell Hooks):
```bash
./scripts/enable-safety-hooks.sh
source .hooks/database-safety.sh
```

### Check Hooks Active:
```bash
type psql    # Should say "psql is a function"
```

### Create Backup:
```bash
./scripts/db-backup.sh "backup-name"
```

---

## 🔒 Security Guarantees

| Feature | AI | You |
|---------|-----|-----|
| Bypass Layer 1 | ❌ | ❌ |
| Bypass Layer 2 | ❌ | ✅* |
| Approve operations | ❌ | ✅ |
| Type confirmations | ❌ | ✅ |

*Only in YOUR terminal with `command` prefix

---

## 📚 Documentation

- **Overview:** [COMPLETE_SAFETY_IMPLEMENTATION_SUMMARY.md](COMPLETE_SAFETY_IMPLEMENTATION_SUMMARY.md)
- **Database Only:** [DATABASE_ONLY_SAFETY_SUMMARY.md](DATABASE_ONLY_SAFETY_SUMMARY.md)
- **Programmatic Hooks:** [PROGRAMMATIC_HOOKS_IMPLEMENTATION.md](PROGRAMMATIC_HOOKS_IMPLEMENTATION.md)
- **AI Cannot Bypass:** [AI_CANNOT_BYPASS.md](AI_CANNOT_BYPASS.md)
- **Docker Operations:** [DOCKER_DESTRUCTIVE_OPERATIONS.md](DOCKER_DESTRUCTIVE_OPERATIONS.md)
- **All Operations:** [DESTRUCTIVE_OPERATIONS_CATALOG.md](DESTRUCTIVE_OPERATIONS_CATALOG.md)

---

## ✅ Status

**Layer 1:** ✅ Active
**Layer 2:** 🔧 Ready (run enable script)
**Protection:** 70+ destructive patterns
**AI Bypass:** ❌ Impossible
**Your Control:** ✅ Complete
