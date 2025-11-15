# Programmatic Database Safety Hooks - Shell-Level Enforcement

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/PROGRAMMATIC_HOOKS_IMPLEMENTATION.md

**Description:** How to implement actual programmatic hooks that enforce database safety at the shell level

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## 🎯 Objective

**Current State:** Claude permissions ask AI to request approval (agent-level)
**Goal:** Add shell-level programmatic enforcement that blocks commands before execution

**Two Layers of Protection:**
1. ✅ Claude permissions (AI agent asks permission) - **IMPLEMENTED**
2. 🔧 Shell hooks (programmatic blocking) - **THIS DOCUMENT**

---

## 🔍 Current Limitation

**Claude Permissions:**
- Rely on AI agent respecting the configuration
- AI asks user for approval
- User can grant approval
- Command executes

**Limitation:** If Claude permissions are bypassed or user accidentally approves, command still executes.

**Solution:** Add shell-level hooks that intercept commands BEFORE execution.

---

## 🛡️ Programmatic Hook Approaches

### Option 1: Shell Wrapper Functions (Recommended)

Override dangerous commands with wrapper functions that require confirmation.

**Implementation:**

```bash
# File: ~/.bashrc or ~/.zshrc or project-specific .envrc

# Wrapper for psql
psql() {
    echo "🚨 DATABASE OPERATION DETECTED"
    echo "Command: psql $@"
    echo ""

    # Check if this is a destructive operation
    if echo "$@" | grep -qiE "DROP|TRUNCATE|DELETE|ALTER.*DROP|reset"; then
        echo "⚠️  DESTRUCTIVE SQL DETECTED"
        echo ""
        echo "Required steps:"
        echo "1. Backup exists: ls -lh backups/database/latest_full.sql"
        echo "2. Type 'DESTROY' to confirm"
        echo ""
        read -p "Confirmation: " confirm

        if [ "$confirm" != "DESTROY" ]; then
            echo "❌ Operation blocked by safety hook"
            return 1
        fi
    fi

    # Execute actual psql
    command psql "$@"
}

# Wrapper for docker exec
docker() {
    local subcmd="$1"

    if [ "$subcmd" = "exec" ]; then
        echo "🚨 DOCKER EXEC DETECTED"
        echo "Command: docker $@"
        echo ""

        # Check if accessing database
        if echo "$@" | grep -qiE "supabase|postgres|db|psql|dropdb|pg_"; then
            echo "⚠️  DATABASE ACCESS DETECTED"
            echo ""
            read -p "Type 'EXECUTE' to confirm: " confirm

            if [ "$confirm" != "EXECUTE" ]; then
                echo "❌ Operation blocked by safety hook"
                return 1
            fi
        fi
    fi

    # Execute actual docker
    command docker "$@"
}

# Wrapper for docker-compose
docker-compose() {
    echo "🚨 DOCKER-COMPOSE DETECTED"
    echo "Command: docker-compose $@"

    # Check for volume deletion flags
    if echo "$@" | grep -qE "\-v|--volumes"; then
        echo ""
        echo "❌ VOLUME DELETION FLAG DETECTED (-v or --volumes)"
        echo "This will PERMANENTLY DELETE database volumes!"
        echo ""
        read -p "Type 'DELETE-VOLUMES' to confirm: " confirm

        if [ "$confirm" != "DELETE-VOLUMES" ]; then
            echo "❌ Operation blocked by safety hook"
            return 1
        fi
    fi

    # Execute actual docker-compose
    command docker-compose "$@"
}

# Wrapper for npx supabase
npx() {
    local tool="$1"
    local subcmd="$2"

    if [ "$tool" = "supabase" ] && [ "$subcmd" = "db" ]; then
        echo "🚨 SUPABASE DB COMMAND DETECTED"
        echo "Command: npx supabase db $3 $4 $5"

        if echo "$3" | grep -qE "reset|push"; then
            echo ""
            echo "⚠️  DESTRUCTIVE DATABASE OPERATION"
            echo ""
            echo "Last backup: $(ls -t backups/database/*.sql 2>/dev/null | head -1 || echo 'NO BACKUP FOUND')"
            echo ""
            read -p "Create backup first? (yes/no): " backup

            if [ "$backup" = "yes" ]; then
                ./scripts/db-backup.sh "pre-${3}-$(date +%Y%m%d-%H%M%S)"
            fi

            read -p "Type 'PROCEED' to continue: " confirm
            if [ "$confirm" != "PROCEED" ]; then
                echo "❌ Operation blocked by safety hook"
                return 1
            fi
        fi
    fi

    # Execute actual npx
    command npx "$@"
}
```

**Activate in current session:**
```bash
source ~/.bashrc
# or
source ~/.zshrc
```

---

### Option 2: Pre-Command Hook (Zsh)

Zsh supports a `preexec` hook that runs before every command.

**Implementation:**

```bash
# File: ~/.zshrc

preexec() {
    local cmd="$1"

    # Database destructive patterns
    local destructive_patterns=(
        "DROP"
        "TRUNCATE"
        "DELETE FROM"
        "docker.*exec.*psql"
        "docker.*volume.*rm"
        "docker-compose.*down.*-v"
        "supabase db reset"
        "dropdb"
        "pg_restore"
    )

    for pattern in "${destructive_patterns[@]}"; do
        if echo "$cmd" | grep -qiE "$pattern"; then
            echo ""
            echo "🚨 DESTRUCTIVE OPERATION DETECTED"
            echo "Pattern: $pattern"
            echo "Command: $cmd"
            echo ""
            echo "This command is blocked by programmatic safety hooks."
            echo ""
            echo "To execute, use: ALLOW_DESTRUCTIVE=1 $cmd"
            echo ""

            # Block unless explicitly allowed
            if [ "$ALLOW_DESTRUCTIVE" != "1" ]; then
                return 1
            fi
        fi
    done
}
```

**Usage:**
```bash
# This will be blocked:
psql -c "DROP TABLE users;"

# This will prompt for confirmation:
ALLOW_DESTRUCTIVE=1 psql -c "DROP TABLE users;"
```

---

### Option 3: Bash PROMPT_COMMAND Hook

Bash can use `PROMPT_COMMAND` to check before executing.

**Implementation:**

```bash
# File: ~/.bashrc

# Store the last command
PROMPT_COMMAND='LAST_CMD=$(history 1 | sed "s/^[ ]*[0-9]*[ ]*//")'

# Trap before command execution
trap 'check_destructive_command' DEBUG

check_destructive_command() {
    local cmd="$BASH_COMMAND"

    # Skip if already checked
    [[ "$cmd" == "check_destructive_command" ]] && return 0

    # Database destructive patterns
    if echo "$cmd" | grep -qiE "DROP|TRUNCATE|DELETE FROM|docker exec.*psql|docker volume rm|dropdb"; then
        echo ""
        echo "🚨 DESTRUCTIVE DATABASE OPERATION DETECTED"
        echo "Command: $cmd"
        echo ""

        read -p "Continue? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "❌ Command blocked"
            return 1
        fi
    fi
}
```

---

### Option 4: Git Pre-Commit Hook (For Database Files)

Prevent committing database dumps or credentials accidentally.

**Implementation:**

```bash
# File: .git/hooks/pre-commit

#!/bin/bash

# Check for database dumps being committed
if git diff --cached --name-only | grep -qE "\.sql$|\.dump$"; then
    echo "🚨 WARNING: Database dump file detected in commit"
    git diff --cached --name-only | grep -E "\.sql$|\.dump$"
    echo ""
    read -p "Are you sure you want to commit database dumps? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        echo "❌ Commit blocked"
        exit 1
    fi
fi

# Check for .env files
if git diff --cached --name-only | grep -qE "\.env$"; then
    echo "❌ ERROR: .env file should NOT be committed"
    git diff --cached --name-only | grep -E "\.env$"
    exit 1
fi

exit 0
```

```bash
chmod +x .git/hooks/pre-commit
```

---

### Option 5: direnv with Environment Validation

Use `direnv` to load project-specific environment with safety hooks.

**Implementation:**

```bash
# File: .envrc (in project root)

# Load safety hooks
source ./.hooks/database-safety.sh

# Verify backup exists before allowing destructive operations
export DB_SAFETY_CHECK=1

# Function to check backup freshness
check_backup() {
    local latest_backup=$(ls -t backups/database/*.sql 2>/dev/null | head -1)
    if [ -z "$latest_backup" ]; then
        echo "❌ NO BACKUP FOUND"
        return 1
    fi

    local backup_age=$(( $(date +%s) - $(stat -f %m "$latest_backup" 2>/dev/null || stat -c %Y "$latest_backup") ))
    local max_age=$((2 * 3600)) # 2 hours

    if [ $backup_age -gt $max_age ]; then
        echo "⚠️  Latest backup is $(($backup_age / 3600)) hours old"
        return 1
    fi

    return 0
}

# Override destructive commands
alias supabase-db-reset='check_backup && npx supabase db reset'
alias psql-destructive='check_backup && psql'
```

```bash
# Allow direnv
direnv allow .
```

---

### Option 6: Docker Override with Wrapper Script

Create a wrapper script for docker commands.

**Implementation:**

```bash
# File: ~/bin/docker (must be in PATH before /usr/bin/docker)

#!/bin/bash

REAL_DOCKER=/usr/bin/docker

# Check for destructive operations
if [ "$1" = "exec" ] && echo "$@" | grep -qiE "psql|dropdb|pg_|postgres"; then
    echo "🚨 DATABASE ACCESS VIA DOCKER DETECTED"
    echo "Command: docker $@"
    echo ""
    read -p "Type 'ALLOW' to proceed: " confirm

    if [ "$confirm" != "ALLOW" ]; then
        echo "❌ Blocked by safety wrapper"
        exit 1
    fi
fi

if [ "$1" = "volume" ] && [ "$2" = "rm" ]; then
    echo "🚨 DOCKER VOLUME DELETION DETECTED"
    echo "This is PERMANENT and will delete database data!"
    echo ""
    read -p "Type 'DELETE-VOLUME' to confirm: " confirm

    if [ "$confirm" != "DELETE-VOLUME" ]; then
        echo "❌ Blocked by safety wrapper"
        exit 1
    fi
fi

# Execute real docker
exec $REAL_DOCKER "$@"
```

```bash
chmod +x ~/bin/docker
# Ensure ~/bin is before /usr/bin in PATH
export PATH="$HOME/bin:$PATH"
```

---

## 🎯 Recommended Implementation Strategy

### Phase 1: Project-Specific Hooks (Immediate)

1. Create `.hooks/database-safety.sh` in project root
2. Source from `.envrc` or project shell
3. Override dangerous commands with wrappers
4. Test with non-destructive commands

### Phase 2: Global Shell Hooks (This Week)

1. Add wrapper functions to `~/.bashrc` or `~/.zshrc`
2. Test in new shell session
3. Ensure doesn't break normal workflows
4. Refine confirmation prompts

### Phase 3: Docker Wrapper (Optional)

1. Create docker wrapper script
2. Place in `~/bin/docker`
3. Test docker commands
4. Ensure doesn't interfere with non-database containers

---

## 📝 Implementation Template

Create this file structure:

```
Permahub/
├── .hooks/
│   ├── database-safety.sh       # Shell wrapper functions
│   ├── pre-commit               # Git pre-commit hook
│   └── README.md                # Hook documentation
├── .envrc                       # direnv configuration (sources hooks)
└── scripts/
    ├── enable-safety-hooks.sh   # Setup script
    └── test-safety-hooks.sh     # Test script (existing)
```

---

## 🚀 Quick Setup Script

Create `scripts/enable-safety-hooks.sh`:

```bash
#!/bin/bash

echo "Setting up programmatic database safety hooks..."

# Create hooks directory
mkdir -p .hooks

# Create database safety hooks file
cat > .hooks/database-safety.sh << 'EOF'
#!/bin/bash
# Programmatic database safety hooks

# Override psql
psql() {
    if echo "$@" | grep -qiE "DROP|TRUNCATE|DELETE|ALTER.*DROP"; then
        echo "🚨 DESTRUCTIVE SQL DETECTED"
        read -p "Type 'DESTROY' to confirm: " confirm
        [ "$confirm" != "DESTROY" ] && echo "❌ Blocked" && return 1
    fi
    command psql "$@"
}

# Override docker exec
docker() {
    if [ "$1" = "exec" ] && echo "$@" | grep -qiE "db|postgres|psql"; then
        echo "🚨 DATABASE ACCESS DETECTED"
        read -p "Type 'EXECUTE' to confirm: " confirm
        [ "$confirm" != "EXECUTE" ] && echo "❌ Blocked" && return 1
    fi
    command docker "$@"
}

export -f psql docker
EOF

# Make executable
chmod +x .hooks/database-safety.sh

# Create .envrc if doesn't exist
if [ ! -f .envrc ]; then
    cat > .envrc << 'EOF'
# Load database safety hooks
source ./.hooks/database-safety.sh
EOF
    echo "Created .envrc"
fi

# Allow direnv
if command -v direnv &> /dev/null; then
    direnv allow .
    echo "✅ direnv configured"
else
    echo "⚠️  direnv not installed. Install with: brew install direnv"
    echo "    Then add to ~/.zshrc: eval \"\$(direnv hook zsh)\""
fi

echo ""
echo "✅ Safety hooks installed"
echo ""
echo "To activate in current shell:"
echo "  source .hooks/database-safety.sh"
echo ""
echo "To activate automatically:"
echo "  Install direnv and it will load automatically when entering this directory"
```

```bash
chmod +x scripts/enable-safety-hooks.sh
./scripts/enable-safety-hooks.sh
```

---

## 🧪 Testing Programmatic Hooks

```bash
# Test psql wrapper
psql -c "SELECT 1;"                    # Should work (safe)
psql -c "DROP TABLE test;"             # Should prompt for confirmation

# Test docker wrapper
docker ps                              # Should work (safe)
docker exec supabase_db psql -c "..."  # Should prompt for confirmation

# Test with environment override
ALLOW_DESTRUCTIVE=1 psql -c "DROP TABLE test;"  # Should work (explicitly allowed)
```

---

## 📊 Comparison: Claude Permissions vs Programmatic Hooks

| Feature | Claude Permissions | Programmatic Hooks |
|---------|-------------------|-------------------|
| **Protection Level** | AI agent | Shell/OS level |
| **Bypass Risk** | AI could ignore | Hard to bypass |
| **User Experience** | Approval in UI | Shell prompt |
| **Works Without Claude** | ❌ No | ✅ Yes |
| **Catches Manual Commands** | ❌ No (only through Claude) | ✅ Yes |
| **Catches Script Commands** | ⚠️ Depends | ✅ Yes |
| **Performance Impact** | None | Minimal |
| **Setup Complexity** | Low | Medium |

**Recommendation:** Use BOTH layers for defense in depth.

---

## 🎯 Final Architecture

### Layer 1: Claude Permissions (AI Agent)
- Configured in `.claude/settings.local.json`
- AI asks user before executing destructive commands
- ✅ Protects against AI autonomous actions

### Layer 2: Programmatic Hooks (Shell Level)
- Configured in `.hooks/database-safety.sh`
- Shell intercepts and blocks commands
- ✅ Protects against manual commands
- ✅ Protects against scripts
- ✅ Works even without Claude

### Layer 3: Git Hooks
- Configured in `.git/hooks/pre-commit`
- Prevents committing secrets
- ✅ Protects against accidental commits

### Layer 4: Backup System
- Configured in `scripts/db-backup.sh`
- Automated backups
- ✅ Recovery mechanism if all else fails

---

## 🚀 Next Steps

1. **Immediate:** Apply Claude permissions (`.claude/settings.local.json.strict`)
2. **Today:** Setup programmatic hooks (`./scripts/enable-safety-hooks.sh`)
3. **This Week:** Install direnv for automatic hook loading
4. **This Month:** Add git pre-commit hooks
5. **Ongoing:** Test and refine based on workflow

---

**Last Updated:** 2025-11-15

**Status:** Implementation guide ready - Programmatic enforcement available
