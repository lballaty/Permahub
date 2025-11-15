#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/db-backup.sh
# Description: Safe database backup script - MUST run before any destructive operations
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-14
#
# Usage:
#   ./scripts/db-backup.sh [backup-name]
#   ./scripts/db-backup.sh "pre-reset-2025-11-14"
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups/database"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="${1:-backup_${TIMESTAMP}}"
DB_HOST="${SUPABASE_DB_HOST:-127.0.0.1}"
DB_PORT="${SUPABASE_DB_PORT:-5432}"
DB_USER="${SUPABASE_DB_USER:-postgres}"
DB_NAME="${SUPABASE_DB_NAME:-postgres}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD:-postgres}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Permahub Database Backup Utility${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Backup name: ${GREEN}${BACKUP_NAME}${NC}"
echo -e "Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo -e "Timestamp: ${TIMESTAMP}"
echo ""

# Full database dump
FULL_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}_full.sql"
echo -e "${YELLOW}[1/4]${NC} Creating full database dump..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --clean \
  --if-exists \
  --create \
  > "${FULL_BACKUP}"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Full dump saved to: ${FULL_BACKUP}"
  FULL_SIZE=$(du -h "${FULL_BACKUP}" | cut -f1)
  echo -e "  Size: ${FULL_SIZE}"
else
  echo -e "${RED}✗${NC} Failed to create full dump!"
  exit 1
fi

# Schema-only dump
SCHEMA_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}_schema.sql"
echo -e "${YELLOW}[2/4]${NC} Creating schema-only dump..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --schema-only \
  --clean \
  --if-exists \
  > "${SCHEMA_BACKUP}"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Schema dump saved to: ${SCHEMA_BACKUP}"
else
  echo -e "${RED}✗${NC} Failed to create schema dump!"
fi

# Data-only dump
DATA_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}_data.sql"
echo -e "${YELLOW}[3/4]${NC} Creating data-only dump..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --data-only \
  --column-inserts \
  > "${DATA_BACKUP}"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Data dump saved to: ${DATA_BACKUP}"
  DATA_SIZE=$(du -h "${DATA_BACKUP}" | cut -f1)
  echo -e "  Size: ${DATA_SIZE}"
else
  echo -e "${RED}✗${NC} Failed to create data dump!"
fi

# Custom format backup (for pg_restore)
CUSTOM_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}_custom.dump"
echo -e "${YELLOW}[4/4]${NC} Creating custom format backup..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --format=custom \
  > "${CUSTOM_BACKUP}"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Custom backup saved to: ${CUSTOM_BACKUP}"
  CUSTOM_SIZE=$(du -h "${CUSTOM_BACKUP}" | cut -f1)
  echo -e "  Size: ${CUSTOM_SIZE}"
else
  echo -e "${RED}✗${NC} Failed to create custom backup!"
fi

# Create metadata file
METADATA_FILE="${BACKUP_DIR}/${BACKUP_NAME}_metadata.json"
echo -e "${YELLOW}[META]${NC} Creating backup metadata..."
cat > "${METADATA_FILE}" << EOF
{
  "backup_name": "${BACKUP_NAME}",
  "timestamp": "${TIMESTAMP}",
  "database": {
    "host": "${DB_HOST}",
    "port": "${DB_PORT}",
    "name": "${DB_NAME}",
    "user": "${DB_USER}"
  },
  "files": {
    "full": "${FULL_BACKUP}",
    "schema": "${SCHEMA_BACKUP}",
    "data": "${DATA_BACKUP}",
    "custom": "${CUSTOM_BACKUP}"
  },
  "created_by": "$(whoami)",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')"
}
EOF

echo -e "${GREEN}✓${NC} Metadata saved to: ${METADATA_FILE}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Backup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Backup location: ${GREEN}${BACKUP_DIR}${NC}"
echo -e "Backup files:"
echo -e "  • Full dump:   ${BACKUP_NAME}_full.sql (${FULL_SIZE})"
echo -e "  • Schema only: ${BACKUP_NAME}_schema.sql"
echo -e "  • Data only:   ${BACKUP_NAME}_data.sql (${DATA_SIZE})"
echo -e "  • Custom:      ${BACKUP_NAME}_custom.dump (${CUSTOM_SIZE})"
echo -e "  • Metadata:    ${BACKUP_NAME}_metadata.json"
echo ""

# Create a "latest" symlink
ln -sf "${BACKUP_NAME}_full.sql" "${BACKUP_DIR}/latest_full.sql"
ln -sf "${BACKUP_NAME}_custom.dump" "${BACKUP_DIR}/latest_custom.dump"
echo -e "Symlinks updated: latest_full.sql, latest_custom.dump"
echo ""

# Cleanup old backups (keep last 10)
BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}"/*_full.sql 2>/dev/null | wc -l)
if [ "${BACKUP_COUNT}" -gt 10 ]; then
  echo -e "${YELLOW}Cleaning up old backups (keeping last 10)...${NC}"
  ls -1t "${BACKUP_DIR}"/*_full.sql | tail -n +11 | while read OLD_BACKUP; do
    BASE_NAME=$(basename "${OLD_BACKUP}" "_full.sql")
    rm -f "${BACKUP_DIR}/${BASE_NAME}"*
    echo -e "  Removed: ${BASE_NAME}"
  done
fi

echo -e "${GREEN}Done!${NC}"
echo ""
echo -e "${YELLOW}To restore this backup:${NC}"
echo -e "  psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} < ${FULL_BACKUP}"
echo -e "${YELLOW}Or using custom format:${NC}"
echo -e "  pg_restore -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} ${CUSTOM_BACKUP}"
echo ""