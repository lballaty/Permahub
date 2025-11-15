#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/db-backup-manager.sh
# Description: Database backup management utility - list, verify, restore, and delete backups
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-15
#
# Usage:
#   ./scripts/db-backup-manager.sh list              # List all backups
#   ./scripts/db-backup-manager.sh verify <backup>   # Verify backup integrity
#   ./scripts/db-backup-manager.sh restore <backup>  # Restore a backup
#   ./scripts/db-backup-manager.sh delete <backup>   # Delete a backup
#   ./scripts/db-backup-manager.sh info <backup>     # Show backup details
#   ./scripts/db-backup-manager.sh cleanup           # Remove old backups
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"
BACKUP_DIR="${PROJECT_ROOT}/backups/database"
DB_HOST="${SUPABASE_DB_HOST:-127.0.0.1}"
DB_PORT="${SUPABASE_DB_PORT:-5432}"
DB_USER="${SUPABASE_DB_USER:-postgres}"
DB_NAME="${SUPABASE_DB_NAME:-postgres}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD:-postgres}"

# Function to list all backups
list_backups() {
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Available Database Backups${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  if [ ! -d "${BACKUP_DIR}" ]; then
    echo -e "${YELLOW}No backup directory found${NC}"
    return
  fi

  # List compressed backups
  local backups=$(find "${BACKUP_DIR}" -name "*_full.sql.gz" -o -name "*_full.sql" 2>/dev/null | sort -r)

  if [ -z "${backups}" ]; then
    echo -e "${YELLOW}No backups found${NC}"
    return
  fi

  echo -e "${BLUE}Name                                    Size      Date${NC}"
  echo "-------------------------------------------------------------------"

  echo "${backups}" | while read backup_file; do
    local basename=$(basename "${backup_file}")
    local name="${basename%_full.sql*}"
    local size=$(du -h "${backup_file}" | cut -f1)
    local date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "${backup_file}" 2>/dev/null || stat -c "%y" "${backup_file}" | cut -d' ' -f1,2 | cut -d':' -f1,2)

    # Color code by type
    if [[ "${name}" == auto_* ]]; then
      echo -e "${GREEN}${name}${NC} ${size} ${date}"
    elif [[ "${name}" == emergency-* ]]; then
      echo -e "${RED}${name}${NC} ${size} ${date}"
    elif [[ "${name}" == pre-* ]]; then
      echo -e "${YELLOW}${name}${NC} ${size} ${date}"
    else
      echo -e "${name} ${size} ${date}"
    fi
  done

  echo ""
  echo -e "${BLUE}Legend:${NC}"
  echo -e "  ${GREEN}auto_*${NC}      - Automated scheduled backups"
  echo -e "  ${YELLOW}pre-*${NC}       - Pre-operation safety backups"
  echo -e "  ${RED}emergency-*${NC} - Emergency manual backups"
  echo ""
}

# Function to verify backup
verify_backup() {
  local backup_name="$1"

  if [ -z "${backup_name}" ]; then
    echo -e "${RED}Error: No backup name specified${NC}"
    exit 1
  fi

  local backup_file="${BACKUP_DIR}/${backup_name}_full.sql.gz"
  if [ ! -f "${backup_file}" ]; then
    backup_file="${BACKUP_DIR}/${backup_name}_full.sql"
  fi

  if [ ! -f "${backup_file}" ]; then
    echo -e "${RED}Error: Backup not found: ${backup_name}${NC}"
    exit 1
  fi

  echo -e "${YELLOW}Verifying backup: ${backup_name}${NC}"
  echo ""

  # Check if file exists and is not empty
  if [ ! -s "${backup_file}" ]; then
    echo -e "${RED}✗ Backup file is empty${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓${NC} File exists and is not empty"

  # For gzip files, test compression
  if [[ "${backup_file}" == *.gz ]]; then
    if gzip -t "${backup_file}" 2>/dev/null; then
      echo -e "${GREEN}✓${NC} Compression integrity verified"
    else
      echo -e "${RED}✗ Compressed file is corrupted${NC}"
      exit 1
    fi

    # Test decompression and check for SQL content
    if gunzip -c "${backup_file}" 2>/dev/null | head -n 100 | grep -q "PostgreSQL database dump"; then
      echo -e "${GREEN}✓${NC} SQL dump structure verified"
    else
      echo -e "${RED}✗ Does not appear to be a valid PostgreSQL dump${NC}"
      exit 1
    fi
  else
    # For uncompressed files, check SQL structure
    if head -n 100 "${backup_file}" | grep -q "PostgreSQL database dump"; then
      echo -e "${GREEN}✓${NC} SQL dump structure verified"
    else
      echo -e "${RED}✗ Does not appear to be a valid PostgreSQL dump${NC}"
      exit 1
    fi
  fi

  # Check metadata file
  local metadata_file="${BACKUP_DIR}/${backup_name}_metadata.json"
  if [ -f "${metadata_file}" ]; then
    echo -e "${GREEN}✓${NC} Metadata file found"
  else
    echo -e "${YELLOW}⚠${NC} Metadata file not found (non-critical)"
  fi

  echo ""
  echo -e "${GREEN}Backup verification successful!${NC}"
  echo ""
}

# Function to show backup info
show_info() {
  local backup_name="$1"

  if [ -z "${backup_name}" ]; then
    echo -e "${RED}Error: No backup name specified${NC}"
    exit 1
  fi

  local metadata_file="${BACKUP_DIR}/${backup_name}_metadata.json"

  if [ ! -f "${metadata_file}" ]; then
    echo -e "${YELLOW}No metadata file found for: ${backup_name}${NC}"
    echo -e "${YELLOW}This might be an older backup${NC}"
    return
  fi

  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Backup Information${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  # Pretty print JSON metadata
  if command -v jq &> /dev/null; then
    jq . "${metadata_file}"
  else
    cat "${metadata_file}"
  fi

  echo ""
}

# Function to restore backup
restore_backup() {
  local backup_name="$1"

  if [ -z "${backup_name}" ]; then
    echo -e "${RED}Error: No backup name specified${NC}"
    exit 1
  fi

  local backup_file="${BACKUP_DIR}/${backup_name}_full.sql.gz"
  if [ ! -f "${backup_file}" ]; then
    backup_file="${BACKUP_DIR}/${backup_name}_full.sql"
  fi

  if [ ! -f "${backup_file}" ]; then
    echo -e "${RED}Error: Backup not found: ${backup_name}${NC}"
    exit 1
  fi

  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Database Restore${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "Backup: ${GREEN}${backup_name}${NC}"
  echo -e "File: ${backup_file}"
  echo -e "Target: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
  echo ""

  # Safety warning
  echo -e "${RED}WARNING: This will REPLACE the current database!${NC}"
  echo -e "${YELLOW}All current data will be lost!${NC}"
  echo ""
  read -p "Type 'RESTORE' to confirm: " CONFIRM

  if [ "${CONFIRM}" != "RESTORE" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
  fi

  # Create safety backup
  echo ""
  echo -e "${YELLOW}Creating safety backup of current database...${NC}"
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  "${SCRIPT_DIR}/db-backup.sh" "pre-restore-${TIMESTAMP}"

  # Perform restore
  echo ""
  echo -e "${YELLOW}Restoring database...${NC}"

  if [[ "${backup_file}" == *.gz ]]; then
    gunzip -c "${backup_file}" | PGPASSWORD="${DB_PASSWORD}" psql \
      -h "${DB_HOST}" \
      -p "${DB_PORT}" \
      -U "${DB_USER}" \
      -d "${DB_NAME}"
  else
    PGPASSWORD="${DB_PASSWORD}" psql \
      -h "${DB_HOST}" \
      -p "${DB_PORT}" \
      -U "${DB_USER}" \
      -d "${DB_NAME}" \
      < "${backup_file}"
  fi

  if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Restore Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo ""
  else
    echo -e "${RED}Restore failed!${NC}"
    echo -e "${YELLOW}You may need to restore from: backups/database/pre-restore-${TIMESTAMP}_full.sql${NC}"
    exit 1
  fi
}

# Function to delete backup
delete_backup() {
  local backup_name="$1"

  if [ -z "${backup_name}" ]; then
    echo -e "${RED}Error: No backup name specified${NC}"
    exit 1
  fi

  echo -e "${YELLOW}Delete backup: ${backup_name}${NC}"
  echo ""
  echo -e "${RED}This will permanently delete all files for this backup!${NC}"
  echo ""
  read -p "Type 'DELETE' to confirm: " CONFIRM

  if [ "${CONFIRM}" != "DELETE" ]; then
    echo -e "${YELLOW}Deletion cancelled${NC}"
    exit 0
  fi

  # Delete all related files
  rm -f "${BACKUP_DIR}/${backup_name}"*

  echo -e "${GREEN}Backup deleted: ${backup_name}${NC}"
}

# Function to cleanup old backups
cleanup_backups() {
  local retention_days="${1:-60}"

  echo -e "${YELLOW}Cleaning up backups older than ${retention_days} days...${NC}"
  echo ""

  local deleted_count=0

  find "${BACKUP_DIR}" -name "auto_*_full.sql.gz" -type f -mtime +${retention_days} | while read OLD_BACKUP; do
    BASE_NAME=$(basename "${OLD_BACKUP}" "_full.sql.gz")
    echo -e "  Removing: ${BASE_NAME}"
    rm -f "${BACKUP_DIR}/${BASE_NAME}"*
    deleted_count=$((deleted_count + 1))
  done

  if [ ${deleted_count} -gt 0 ]; then
    echo ""
    echo -e "${GREEN}Deleted ${deleted_count} old backup sets${NC}"
  else
    echo -e "${GREEN}No old backups to delete${NC}"
  fi
}

# Main command dispatcher
COMMAND="${1:-list}"

case "${COMMAND}" in
  list)
    list_backups
    ;;
  verify)
    verify_backup "$2"
    ;;
  info)
    show_info "$2"
    ;;
  restore)
    restore_backup "$2"
    ;;
  delete)
    delete_backup "$2"
    ;;
  cleanup)
    cleanup_backups "$2"
    ;;
  *)
    echo "Usage: $0 {list|verify|info|restore|delete|cleanup} [backup-name]"
    echo ""
    echo "Commands:"
    echo "  list              - List all available backups"
    echo "  verify <name>     - Verify backup integrity"
    echo "  info <name>       - Show backup details"
    echo "  restore <name>    - Restore a backup (creates safety backup first)"
    echo "  delete <name>     - Delete a backup"
    echo "  cleanup [days]    - Remove backups older than N days (default: 60)"
    echo ""
    exit 1
    ;;
esac
