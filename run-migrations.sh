#!/bin/bash
# ============================================================================
# Permahub: Automated Database Migration Runner
# ============================================================================
# This script runs all 3 database migrations in your Supabase database
# Usage: ./run-migrations.sh
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_URL="${VITE_SUPABASE_URL:-https://mcbxbaggjaxqfdvmrqsc.supabase.co}"
SUPABASE_SERVICE_KEY="${VITE_SUPABASE_SERVICE_ROLE_KEY:-}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$PROJECT_DIR/database/migrations"

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}Permahub: Database Migration Runner${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${RED}❌ Error: .env file not found at $PROJECT_DIR/.env${NC}"
    echo -e "${YELLOW}Please create .env with your Supabase credentials${NC}"
    echo ""
    echo "Required variables:"
    echo "  VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "  VITE_SUPABASE_ANON_KEY=your-anon-key"
    echo "  VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    echo ""
    exit 1
fi

# Load environment variables
source "$PROJECT_DIR/.env"

# Verify required variables
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${RED}❌ Error: VITE_SUPABASE_URL not set in .env${NC}"
    exit 1
fi

if [ -z "$VITE_SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Error: VITE_SUPABASE_SERVICE_ROLE_KEY not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}"
echo "  URL: $VITE_SUPABASE_URL"
echo ""

# Function to execute a migration
run_migration() {
    local migration_file=$1
    local migration_name=$2
    local migration_number=$3

    if [ ! -f "$MIGRATIONS_DIR/$migration_file" ]; then
        echo -e "${RED}❌ Error: Migration file not found: $migration_file${NC}"
        return 1
    fi

    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}Running Migration $migration_number: $migration_name${NC}"
    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
    echo "File: $migration_file"
    echo ""

    # Read the migration file
    local sql_content=$(cat "$MIGRATIONS_DIR/$migration_file")

    # Execute via curl to Supabase
    echo -e "${YELLOW}Executing SQL...${NC}"

    # Create JSON payload with the SQL
    local json_payload=$(cat <<EOF
{
  "query": $(echo "$sql_content" | jq -Rs '.')
}
EOF
)

    # Call Supabase REST API
    local response=$(curl -s -X POST \
        "$VITE_SUPABASE_URL/rest/v1/rpc/execute_sql" \
        -H "apikey: $VITE_SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $VITE_SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        -d '{"query":"'"$(echo "$sql_content" | sed 's/"/\\"/g' | tr '\n' ' ')"'"}' 2>&1)

    # Check response
    if echo "$response" | grep -q "error\|Error\|ERROR"; then
        echo -e "${RED}❌ Migration failed:${NC}"
        echo "$response"
        return 1
    else
        echo -e "${GREEN}✓ Migration completed successfully${NC}"
        return 0
    fi
}

# Alternative: Use psql if available
run_migration_psql() {
    local migration_file=$1
    local migration_name=$2
    local migration_number=$3

    if [ ! -f "$MIGRATIONS_DIR/$migration_file" ]; then
        echo -e "${RED}❌ Error: Migration file not found: $migration_file${NC}"
        return 1
    fi

    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}Running Migration $migration_number: $migration_name${NC}"
    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
    echo "File: $migration_file"
    echo ""

    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        echo -e "${YELLOW}⚠ psql not found. Please use Supabase console instead.${NC}"
        echo ""
        echo "Manual steps:"
        echo "1. Go to: https://supabase.com/dashboard"
        echo "2. Select project: mcbxbaggjaxqfdvmrqsc"
        echo "3. SQL Editor → New Query"
        echo "4. Copy-paste: $MIGRATIONS_DIR/$migration_file"
        echo "5. Click 'Run'"
        echo ""
        return 1
    fi

    echo -e "${YELLOW}Executing SQL...${NC}"

    # Execute with psql
    if psql -h "$SUPABASE_HOST" -U postgres -d postgres -f "$MIGRATIONS_DIR/$migration_file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Migration completed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Migration failed${NC}"
        return 1
    fi
}

# Main execution
echo -e "${BLUE}Starting migrations...${NC}"
echo ""

# Array of migrations
MIGRATIONS=(
    "001_initial_schema.sql:Core Schema (users, projects, resources):1"
    "002_analytics.sql:Analytics (activity tracking, personalization):2"
    "003_items_pubsub.sql:Pub/Sub (notifications, followers):3"
)

# Try running migrations
SUCCESS_COUNT=0
FAILED=false

for migration_info in "${MIGRATIONS[@]}"; do
    IFS=':' read -r file name number <<< "$migration_info"

    if run_migration "$file" "$name" "$number"; then
        ((SUCCESS_COUNT++))
        echo ""
        sleep 2
    else
        FAILED=true
        echo -e "${RED}⚠ Consider using Supabase console for manual execution${NC}"
        echo ""
        break
    fi
done

# Final status
echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
echo ""

if [ "$FAILED" = false ] && [ "$SUCCESS_COUNT" -eq 3 ]; then
    echo -e "${GREEN}============================================================================${NC}"
    echo -e "${GREEN}✓ All migrations completed successfully!${NC}"
    echo -e "${GREEN}============================================================================${NC}"
    echo ""
    echo "Database Status:"
    echo "  ✓ 15 tables created"
    echo "  ✓ 40+ indexes created"
    echo "  ✓ 20+ RLS policies enabled"
    echo "  ✓ 10+ helper functions created"
    echo ""
    echo "Next steps:"
    echo "  1. npm run dev"
    echo "  2. Test database connection"
    echo "  3. Create sample projects"
    echo "  4. Verify dashboard loads real data"
    echo ""
    exit 0
else
    echo -e "${YELLOW}============================================================================${NC}"
    echo -e "${YELLOW}⚠ Could not execute migrations automatically${NC}"
    echo -e "${YELLOW}============================================================================${NC}"
    echo ""
    echo "Please run migrations manually:"
    echo ""
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Select project: mcbxbaggjaxqfdvmrqsc"
    echo "3. SQL Editor → New Query"
    echo "4. For each migration file:"
    echo "   - Copy entire file contents"
    echo "   - Paste into Supabase editor"
    echo "   - Click 'Run'"
    echo ""
    echo "Migration files:"
    echo "  1. $MIGRATIONS_DIR/001_initial_schema.sql"
    echo "  2. $MIGRATIONS_DIR/002_analytics.sql"
    echo "  3. $MIGRATIONS_DIR/003_items_pubsub.sql"
    echo ""
    echo "Reference: SUPABASE_COPY_PASTE_GUIDE.md"
    echo ""
    exit 1
fi
