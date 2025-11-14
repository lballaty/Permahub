#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/db-restore.sh
# Description: Safe database restore script
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-14
#
# Usage:
#   ./scripts/db-restore.sh <backup-file>
#   ./scripts/db-restore.sh backups/database/backup_20251114_143022_full.sql
#

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_FILE="${1}"
DB_HOST="${SUPABASE_DB_HOST:-127.0.0.1}"
DB_PORT="${SUPABASE_DB_PORT:-54322}"
DB_USER="${SUPABASE_DB_USER:-postgres}"
DB_NAME="${SUPABASE_DB_NAME:-postgres}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD:-postgres}"

if [ -z "${BACKUP_FILE}" ]; then
  echo -e "${RED}Error: No backup file specified${NC}"
  echo ""
  echo "Usage: $0 <backup-file>"
  echo ""
  echo "Available backups:"
  ls -lht backups/database/*_full.sql 2>/dev/null | head -5 || echo "No backups found"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
  exit 1
fi

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Database Restore Utility${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Backup file: ${GREEN}${BACKUP_FILE}${NC}"
echo -e "Target database: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo ""

# Safety check
echo -e "${RED}WARNING: This will REPLACE the current database!${NC}"
echo -e "${YELLOW}Make sure you have backed up the current database first!${NC}"
echo ""
read -p "Are you sure you want to proceed? (yes/NO): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
  echo -e "${YELLOW}Restore cancelled.${NC}"
  exit 0
fi

echo ""
echo -e "${YELLOW}Creating backup of current database before restore...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
./scripts/db-backup.sh "pre-restore-${TIMESTAMP}"

echo ""
echo -e "${YELLOW}Restoring database...${NC}"
PGPASSWORD="${DB_PASSWORD}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  < "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  Restore Complete!${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "Restored from: ${GREEN}${BACKUP_FILE}${NC}"
  echo ""
else
  echo -e "${RED}✗ Restore failed!${NC}"
  echo -e "${YELLOW}Your database may be in an inconsistent state.${NC}"
  echo -e "${YELLOW}Consider restoring from: backups/database/pre-restore-${TIMESTAMP}_full.sql${NC}"
  exit 1
fi