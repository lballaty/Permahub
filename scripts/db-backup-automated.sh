#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/db-backup-automated.sh
# Description: Enhanced automated database backup with compression, verification, and notifications
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-15
#
# Features:
# - Automatic compression with gzip
# - Backup integrity verification
# - macOS notification on success/failure
# - 60-day retention policy
# - Detailed logging
# - Error recovery
#
# Usage:
#   ./scripts/db-backup-automated.sh [backup-type]
#   backup-type: morning, noon, evening, nightly (default: auto)
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"
BACKUP_DIR="${PROJECT_ROOT}/backups/database"
LOG_DIR="${PROJECT_ROOT}/backups/logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_TYPE="${1:-auto}"
BACKUP_NAME="auto_${BACKUP_TYPE}_${TIMESTAMP}"
DB_HOST="${SUPABASE_DB_HOST:-127.0.0.1}"
DB_PORT="${SUPABASE_DB_PORT:-5432}"
DB_USER="${SUPABASE_DB_USER:-postgres}"
DB_NAME="${SUPABASE_DB_NAME:-postgres}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD:-postgres}"
RETENTION_DAYS=60

# Create directories if they don't exist
mkdir -p "${BACKUP_DIR}"
mkdir -p "${LOG_DIR}"

# Log file for this backup
LOG_FILE="${LOG_DIR}/backup_${TIMESTAMP}.log"

# Function to log messages
log() {
  local level="$1"
  shift
  local message="$@"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

# Function to send macOS notification
send_notification() {
  local title="$1"
  local message="$2"
  local sound="${3:-default}"

  osascript -e "display notification \"${message}\" with title \"${title}\" sound name \"${sound}\""

  # Also create a notification that requires acknowledgment
  osascript <<EOF
    display dialog "${message}" with title "${title}" buttons {"OK"} default button "OK" with icon note giving up after 300
EOF
}

# Function to verify backup integrity
verify_backup() {
  local backup_file="$1"

  log "INFO" "Verifying backup integrity: ${backup_file}"

  if [ ! -f "${backup_file}" ]; then
    log "ERROR" "Backup file does not exist: ${backup_file}"
    return 1
  fi

  # Check if file is not empty
  if [ ! -s "${backup_file}" ]; then
    log "ERROR" "Backup file is empty: ${backup_file}"
    return 1
  fi

  # For SQL files, check for basic structure
  if [[ "${backup_file}" == *.sql ]]; then
    if ! grep -q "PostgreSQL database dump" "${backup_file}"; then
      log "ERROR" "Backup file does not appear to be a valid PostgreSQL dump"
      return 1
    fi
  fi

  # For gzip files, test compression integrity
  if [[ "${backup_file}" == *.gz ]]; then
    if ! gzip -t "${backup_file}" 2>/dev/null; then
      log "ERROR" "Compressed backup file is corrupted"
      return 1
    fi
  fi

  log "INFO" "Backup verification successful"
  return 0
}

# Function to cleanup old backups
cleanup_old_backups() {
  log "INFO" "Cleaning up backups older than ${RETENTION_DAYS} days..."

  local deleted_count=0

  # Find and delete backups older than retention period
  find "${BACKUP_DIR}" -name "auto_*_full.sql.gz" -type f -mtime +${RETENTION_DAYS} | while read OLD_BACKUP; do
    BASE_NAME=$(basename "${OLD_BACKUP}" "_full.sql.gz")
    log "INFO" "Removing old backup: ${BASE_NAME}"
    rm -f "${BACKUP_DIR}/${BASE_NAME}"*
    deleted_count=$((deleted_count + 1))
  done

  if [ ${deleted_count} -gt 0 ]; then
    log "INFO" "Deleted ${deleted_count} old backup sets"
  else
    log "INFO" "No old backups to delete"
  fi

  # Also cleanup old log files
  find "${LOG_DIR}" -name "backup_*.log" -type f -mtime +${RETENTION_DAYS} -delete
}

# Main backup process
main() {
  log "INFO" "═══════════════════════════════════════════════════════"
  log "INFO" "  Permahub Automated Database Backup"
  log "INFO" "═══════════════════════════════════════════════════════"
  log "INFO" "Backup type: ${BACKUP_TYPE}"
  log "INFO" "Backup name: ${BACKUP_NAME}"
  log "INFO" "Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
  log "INFO" "Retention: ${RETENTION_DAYS} days"
  log "INFO" ""

  # Check if PostgreSQL tools are available
  if ! command -v pg_dump &> /dev/null; then
    log "ERROR" "pg_dump not found. Please install PostgreSQL client tools."
    send_notification "Backup Failed" "pg_dump not found - install PostgreSQL client tools" "Basso"
    exit 1
  fi

  # Check if database is accessible
  if ! PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT 1" > /dev/null 2>&1; then
    log "ERROR" "Cannot connect to database at ${DB_HOST}:${DB_PORT}"
    send_notification "Backup Failed" "Cannot connect to database" "Basso"
    exit 1
  fi

  # Full database dump
  FULL_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}_full.sql"
  log "INFO" "[1/5] Creating full database dump..."

  if PGPASSWORD="${DB_PASSWORD}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --clean \
    --if-exists \
    --create \
    > "${FULL_BACKUP}" 2>> "${LOG_FILE}"; then

    FULL_SIZE=$(du -h "${FULL_BACKUP}" | cut -f1)
    log "INFO" "✓ Full dump saved: ${FULL_BACKUP} (${FULL_SIZE})"
  else
    log "ERROR" "Failed to create full dump"
    send_notification "Backup Failed" "Failed to create database dump" "Basso"
    exit 1
  fi

  # Verify backup
  log "INFO" "[2/5] Verifying backup integrity..."
  if ! verify_backup "${FULL_BACKUP}"; then
    log "ERROR" "Backup verification failed"
    send_notification "Backup Failed" "Backup verification failed" "Basso"
    exit 1
  fi

  # Compress backup
  log "INFO" "[3/5] Compressing backup..."
  if gzip -9 "${FULL_BACKUP}" 2>> "${LOG_FILE}"; then
    COMPRESSED_BACKUP="${FULL_BACKUP}.gz"
    COMPRESSED_SIZE=$(du -h "${COMPRESSED_BACKUP}" | cut -f1)
    log "INFO" "✓ Backup compressed: ${COMPRESSED_SIZE}"

    # Verify compressed backup
    if ! verify_backup "${COMPRESSED_BACKUP}"; then
      log "ERROR" "Compressed backup verification failed"
      send_notification "Backup Failed" "Compressed backup is corrupted" "Basso"
      exit 1
    fi
  else
    log "ERROR" "Failed to compress backup"
    send_notification "Backup Failed" "Failed to compress backup" "Basso"
    exit 1
  fi

  # Create metadata file
  METADATA_FILE="${BACKUP_DIR}/${BACKUP_NAME}_metadata.json"
  log "INFO" "[4/5] Creating backup metadata..."

  cat > "${METADATA_FILE}" << EOF
{
  "backup_name": "${BACKUP_NAME}",
  "backup_type": "${BACKUP_TYPE}",
  "timestamp": "${TIMESTAMP}",
  "database": {
    "host": "${DB_HOST}",
    "port": "${DB_PORT}",
    "name": "${DB_NAME}",
    "user": "${DB_USER}"
  },
  "files": {
    "full_compressed": "${COMPRESSED_BACKUP}",
    "metadata": "${METADATA_FILE}",
    "log": "${LOG_FILE}"
  },
  "sizes": {
    "compressed": "${COMPRESSED_SIZE}"
  },
  "retention_days": ${RETENTION_DAYS},
  "created_by": "$(whoami)",
  "git_commit": "$(git -C "${PROJECT_ROOT}" rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_branch": "$(git -C "${PROJECT_ROOT}" branch --show-current 2>/dev/null || echo 'unknown')",
  "verified": true
}
EOF

  log "INFO" "✓ Metadata saved: ${METADATA_FILE}"

  # Cleanup old backups
  log "INFO" "[5/5] Cleaning up old backups..."
  cleanup_old_backups

  # Update latest symlink
  ln -sf "$(basename "${COMPRESSED_BACKUP}")" "${BACKUP_DIR}/latest_auto.sql.gz"

  # Success summary
  log "INFO" ""
  log "INFO" "═══════════════════════════════════════════════════════"
  log "INFO" "  Backup Complete!"
  log "INFO" "═══════════════════════════════════════════════════════"
  log "INFO" "Backup file: ${COMPRESSED_BACKUP}"
  log "INFO" "Compressed size: ${COMPRESSED_SIZE}"
  log "INFO" "Log file: ${LOG_FILE}"
  log "INFO" ""

  # Send success notification
  send_notification "Backup Successful" "Database backup completed successfully (${COMPRESSED_SIZE})" "Glass"

  log "INFO" "To restore this backup:"
  log "INFO" "  gunzip -c ${COMPRESSED_BACKUP} | psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}"
  log "INFO" ""
}

# Error handling
trap 'log "ERROR" "Backup script failed with error on line $LINENO"; send_notification "Backup Failed" "Unexpected error during backup" "Basso"; exit 1' ERR

# Run main function
main

exit 0
