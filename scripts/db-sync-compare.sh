#!/bin/bash

# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/db-sync-compare.sh
# Description: Compare local and cloud database content (row counts, latest updates)
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-20
# Usage: ./scripts/db-sync-compare.sh [cloud_password]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
LOCAL_HOST="127.0.0.1"
LOCAL_USER="postgres"
LOCAL_PASS="postgres"
LOCAL_DB="postgres"

CLOUD_HOST="aws-1-eu-west-3.pooler.supabase.com"
CLOUD_USER="postgres.mcbxbaggjaxqfdvmrqsc"
CLOUD_PASS="${1:-}"
CLOUD_DB="postgres"

# Tables to compare
TABLES=(
  "wiki_guides"
  "wiki_events"
  "wiki_locations"
  "wiki_categories"
  "wiki_theme_groups"
  "wiki_multilingual_content"
  "users"
  "projects"
  "resources"
  "resource_categories"
  "tags"
  "favorites"
  "notifications"
  "notification_preferences"
  "event_registrations"
  "issue_tracking"
)

# Function to print header
print_header() {
  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

# Function to check connection
check_connection() {
  local host=$1
  local user=$2
  local pass=$3
  local label=$4

  echo -n "Checking $label connection... "
  if PGPASSWORD="$pass" psql -h "$host" -d "$CLOUD_DB" -U "$user" -c "SELECT 1;" &>/dev/null 2>&1 || \
     PGPASSWORD="$pass" psql -h "$host" -d "$LOCAL_DB" -U "$user" -c "SELECT 1;" &>/dev/null 2>&1; then
    echo -e "${GREEN}✓ Connected${NC}"
    return 0
  else
    echo -e "${RED}✗ Failed to connect${NC}"
    return 1
  fi
}

# Function to get table info
get_table_info() {
  local host=$1
  local user=$2
  local pass=$3
  local table=$4

  PGPASSWORD="$pass" psql -h "$host" -d "$LOCAL_DB" -U "$user" -t -c "
    SELECT
      '$table'::text as table_name,
      COUNT(*)::text as row_count,
      TO_CHAR(MAX(CASE WHEN created_at IS NOT NULL THEN created_at ELSE updated_at END), 'YYYY-MM-DD HH24:MI')::text as latest_update
    FROM public.$table;" 2>/dev/null | tr -d ' '
}

# Main execution
echo -e "${BLUE}"
echo "   Database Content Comparison"
echo "   Local vs Cloud"
echo "   Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "${NC}"

# Check if cloud password provided
if [ -z "$CLOUD_PASS" ]; then
  echo -e "${YELLOW}⚠️  Cloud password not provided${NC}"
  echo ""
  echo "Usage: $0 <cloud_password>"
  echo ""
  echo "Get cloud password from:"
  echo "  1. .env file (VITE_SUPABASE_SERVICE_ROLE_KEY)"
  echo "  2. Supabase Dashboard → Settings → Database → Connection info"
  echo "  3. Password manager"
  echo ""
  exit 1
fi

print_header "1. Connection Status"

check_connection "$LOCAL_HOST" "$LOCAL_USER" "$LOCAL_PASS" "LOCAL" || {
  echo -e "${RED}✗ Cannot connect to local database${NC}"
  echo "  Make sure Supabase is running: ./start.sh"
  exit 1
}

check_connection "$CLOUD_HOST" "$CLOUD_USER" "$CLOUD_PASS" "CLOUD" || {
  echo -e "${RED}✗ Cannot connect to cloud database${NC}"
  echo "  Check cloud password and network connection"
  exit 1
}

print_header "2. Table Comparison"

echo -e "${YELLOW}Comparing $(echo ${#TABLES[@]}) tables...${NC}"
echo ""

# Create comparison table
printf "%-35s | %-12s | %-12s | %-10s\n" "TABLE" "LOCAL" "CLOUD" "DIFF"
printf "%-35s | %-12s | %-12s | %-10s\n" "$(printf '%.0s-' {1..33})" "$(printf '%.0s-' {1..10})" "$(printf '%.0s-' {1..10})" "$(printf '%.0s-' {1..8})"

TOTAL_LOCAL=0
TOTAL_CLOUD=0
DIFFERENCES=0

for TABLE in "${TABLES[@]}"; do
  # Get local count
  LOCAL_COUNT=$(PGPASSWORD=$LOCAL_PASS psql -h $LOCAL_HOST -d $LOCAL_DB -U $LOCAL_USER -tc \
    "SELECT COUNT(*) FROM public.$TABLE UNION SELECT 0 LIMIT 1;" 2>/dev/null | tr -d ' ' || echo "0")

  # Get cloud count
  CLOUD_COUNT=$(PGPASSWORD=$CLOUD_PASS psql -h $CLOUD_HOST -d $CLOUD_DB -U $CLOUD_USER -tc \
    "SELECT COUNT(*) FROM public.$TABLE UNION SELECT 0 LIMIT 1;" 2>/dev/null | tr -d ' ' || echo "0")

  TOTAL_LOCAL=$((TOTAL_LOCAL + LOCAL_COUNT))
  TOTAL_CLOUD=$((TOTAL_CLOUD + CLOUD_COUNT))

  # Calculate difference
  if [ "$LOCAL_COUNT" -eq "$CLOUD_COUNT" ]; then
    DIFF_STR="✓ same"
    DIFF_COLOR="$GREEN"
  else
    DIFF=$((CLOUD_COUNT - LOCAL_COUNT))
    if [ $DIFF -gt 0 ]; then
      DIFF_STR="+$DIFF (cloud)"
      DIFF_COLOR="$YELLOW"
    else
      DIFF_STR="$DIFF (local)"
      DIFF_COLOR="$RED"
    fi
    DIFFERENCES=$((DIFFERENCES + 1))
  fi

  printf "%-35s | %12d | %12d | ${DIFF_COLOR}%-10s${NC}\n" "$TABLE" "$LOCAL_COUNT" "$CLOUD_COUNT" "$DIFF_STR"
done

print_header "3. Summary"

echo -e "Total records:"
echo -e "  Local: ${GREEN}$TOTAL_LOCAL${NC}"
echo -e "  Cloud: ${GREEN}$TOTAL_CLOUD${NC}"
echo ""

if [ $DIFFERENCES -eq 0 ]; then
  echo -e "${GREEN}✓ All tables are in sync!${NC}"
else
  echo -e "${YELLOW}⚠️  $DIFFERENCES table(s) have differences${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Decide which database is source of truth"
  echo "  2. Run sync procedure: See docs/database/DATABASE_SYNC_PROCEDURE.md"
  echo "  3. Backup before syncing: pg_dump > /tmp/backup_\$(date +%Y%m%d_%H%M%S).sql"
fi

print_header "4. Recent Updates"

echo -e "${YELLOW}Latest updates by table:${NC}"
echo ""

for TABLE in "${TABLES[@]}"; do
  LATEST=$(PGPASSWORD=$LOCAL_PASS psql -h $LOCAL_HOST -d $LOCAL_DB -U $LOCAL_USER -tc \
    "SELECT TO_CHAR(MAX(CASE WHEN created_at IS NOT NULL THEN created_at ELSE updated_at END), 'YYYY-MM-DD HH24:MI')
     FROM public.$TABLE;" 2>/dev/null | tr -d ' ')

  if [ -n "$LATEST" ] && [ "$LATEST" != "NULL" ]; then
    printf "  %-30s: %s (local)\n" "$TABLE" "$LATEST"
  fi
done

echo ""
echo -e "${BLUE}Comparison complete!${NC}"
echo "See: docs/database/DATABASE_SYNC_PROCEDURE.md for sync instructions"
echo ""
