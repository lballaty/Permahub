#!/bin/bash

# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/enable-safety-hooks.sh
# Description: Setup programmatic database safety hooks at shell level
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-15

set -e

echo "=========================================="
echo "Database Safety Hooks Setup"
echo "=========================================="
echo ""

# Create hooks directory
echo "Creating .hooks directory..."
mkdir -p .hooks

# Create database safety hooks file
echo "Creating database safety wrapper functions..."
cat > .hooks/database-safety.sh << 'HOOK_EOF'
#!/bin/bash
# Programmatic database safety hooks
# This file contains shell wrapper functions that intercept destructive database operations

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Override psql to require confirmation for destructive operations
psql() {
    local args="$*"

    # Check for destructive SQL patterns
    if echo "$args" | grep -qiE "DROP|TRUNCATE|DELETE|ALTER.*DROP|reset"; then
        echo -e "${RED}🚨 DESTRUCTIVE SQL OPERATION DETECTED${NC}"
        echo "Command: psql $args"
        echo ""
        echo -e "${YELLOW}This command could permanently delete database data!${NC}"
        echo ""

        # Check for recent backup
        local latest_backup=$(ls -t backups/database/*.sql 2>/dev/null | head -1)
        if [ -n "$latest_backup" ]; then
            local backup_time=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$latest_backup" 2>/dev/null || \
                              stat -c "%y" "$latest_backup" 2>/dev/null | cut -d. -f1)
            echo -e "${GREEN}Latest backup: $backup_time${NC}"
        else
            echo -e "${RED}⚠️  NO BACKUP FOUND!${NC}"
            echo "Run: ./scripts/db-backup.sh"
            echo ""
        fi

        echo ""
        read -p "Type 'DESTROY' to confirm: " confirm

        if [ "$confirm" != "DESTROY" ]; then
            echo -e "${RED}❌ Operation blocked by safety hook${NC}"
            return 1
        fi
    fi

    # Execute actual psql
    command psql "$@"
}

# Override docker to require confirmation for database access
docker() {
    local subcmd="$1"
    shift
    local args="$*"

    # Check docker exec for database access
    if [ "$subcmd" = "exec" ]; then
        if echo "$args" | grep -qiE "supabase|postgres|db|psql|dropdb|pg_dump|pg_restore"; then
            echo -e "${RED}🚨 DATABASE ACCESS VIA DOCKER DETECTED${NC}"
            echo "Command: docker exec $args"
            echo ""
            echo -e "${YELLOW}This grants direct access to the database!${NC}"
            echo ""
            read -p "Type 'EXECUTE' to confirm: " confirm

            if [ "$confirm" != "EXECUTE" ]; then
                echo -e "${RED}❌ Operation blocked by safety hook${NC}"
                return 1
            fi
        fi
    fi

    # Check docker volume operations
    if [ "$subcmd" = "volume" ]; then
        local vol_op="$1"
        if [ "$vol_op" = "rm" ] || [ "$vol_op" = "prune" ]; then
            echo -e "${RED}🚨 DOCKER VOLUME DELETION DETECTED${NC}"
            echo "Command: docker volume $vol_op $2 $3 $4"
            echo ""
            echo -e "${RED}⚠️  THIS WILL PERMANENTLY DELETE DATABASE DATA!${NC}"
            echo ""
            read -p "Type 'DELETE-VOLUME' to confirm: " confirm

            if [ "$confirm" != "DELETE-VOLUME" ]; then
                echo -e "${RED}❌ Operation blocked by safety hook${NC}"
                return 1
            fi
        fi
    fi

    # Check docker rm for database containers
    if [ "$subcmd" = "rm" ]; then
        if echo "$args" | grep -qiE "supabase|postgres|db"; then
            echo -e "${RED}🚨 DATABASE CONTAINER REMOVAL DETECTED${NC}"
            echo "Command: docker rm $args"
            echo ""
            read -p "Type 'REMOVE' to confirm: " confirm

            if [ "$confirm" != "REMOVE" ]; then
                echo -e "${RED}❌ Operation blocked by safety hook${NC}"
                return 1
            fi
        fi
    fi

    # Execute actual docker
    command docker "$subcmd" "$@"
}

# Override docker-compose to check for volume deletion
docker-compose() {
    local args="$*"

    # Check for volume deletion flags
    if echo "$args" | grep -qE "\-v|--volumes"; then
        echo -e "${RED}🚨 DOCKER-COMPOSE VOLUME DELETION DETECTED${NC}"
        echo "Command: docker-compose $args"
        echo ""
        echo -e "${RED}⚠️  THIS WILL PERMANENTLY DELETE DATABASE VOLUMES!${NC}"
        echo ""
        read -p "Type 'DELETE-VOLUMES' to confirm: " confirm

        if [ "$confirm" != "DELETE-VOLUMES" ]; then
            echo -e "${RED}❌ Operation blocked by safety hook${NC}"
            return 1
        fi
    fi

    # Execute actual docker-compose
    command docker-compose "$@"
}

# Override npx supabase db commands
npx() {
    local tool="$1"
    local subcmd="$2"
    local dbcmd="$3"

    if [ "$tool" = "supabase" ] && [ "$subcmd" = "db" ]; then
        if echo "$dbcmd" | grep -qE "reset|push"; then
            echo -e "${RED}🚨 SUPABASE DATABASE OPERATION DETECTED${NC}"
            echo "Command: npx supabase db $dbcmd $4 $5"
            echo ""

            # Check for recent backup
            local latest_backup=$(ls -t backups/database/*.sql 2>/dev/null | head -1)
            if [ -n "$latest_backup" ]; then
                echo -e "${GREEN}Latest backup found${NC}"
            else
                echo -e "${RED}⚠️  NO BACKUP FOUND!${NC}"
                read -p "Create backup first? (yes/no): " backup

                if [ "$backup" = "yes" ]; then
                    ./scripts/db-backup.sh "pre-${dbcmd}-$(date +%Y%m%d-%H%M%S)"
                fi
            fi

            echo ""
            read -p "Type 'PROCEED' to continue: " confirm

            if [ "$confirm" != "PROCEED" ]; then
                echo -e "${RED}❌ Operation blocked by safety hook${NC}"
                return 1
            fi
        fi
    fi

    # Execute actual npx
    command npx "$@"
}

echo -e "${GREEN}✅ Database safety hooks loaded${NC}"
echo "Protected commands: psql, docker, docker-compose, npx supabase"

# Export functions for subshells
export -f psql docker docker-compose npx 2>/dev/null || true
HOOK_EOF

chmod +x .hooks/database-safety.sh

echo "✅ Created .hooks/database-safety.sh"
echo ""

# Create .envrc if it doesn't exist
if [ ! -f .envrc ]; then
    echo "Creating .envrc file..."
    cat > .envrc << 'EOF'
# Load database safety hooks
source ./.hooks/database-safety.sh

echo "🛡️  Database safety hooks active"
EOF
    echo "✅ Created .envrc"
else
    # Check if hooks are already sourced
    if ! grep -q "database-safety.sh" .envrc; then
        echo "" >> .envrc
        echo "# Load database safety hooks" >> .envrc
        echo "source ./.hooks/database-safety.sh" >> .envrc
        echo "✅ Updated .envrc"
    else
        echo "ℹ️  .envrc already configured"
    fi
fi

echo ""

# Check for direnv
if command -v direnv &> /dev/null; then
    echo "✅ direnv is installed"
    direnv allow .
    echo "✅ direnv configured for this directory"
else
    echo "⚠️  direnv is not installed"
    echo ""
    echo "To enable automatic hook loading:"
    echo "1. Install direnv:"
    echo "   brew install direnv"
    echo ""
    echo "2. Add to your shell config (~/.zshrc or ~/.bashrc):"
    echo "   eval \"\$(direnv hook zsh)\"    # for zsh"
    echo "   eval \"\$(direnv hook bash)\"   # for bash"
    echo ""
    echo "3. Restart your shell or run: source ~/.zshrc"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To activate hooks in current shell:"
echo "  source .hooks/database-safety.sh"
echo ""
echo "To test the hooks:"
echo "  psql -c \"SELECT 1;\"              # Should work (safe)"
echo "  psql -c \"DROP TABLE test;\"       # Should prompt (destructive)"
echo ""
echo "To bypass hooks (emergency only):"
echo "  command psql -c \"...\"            # Uses original psql"
echo ""
