#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/setup-backup-scheduler.sh
# Description: Setup automated database backup scheduler using macOS launchd
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-15
#
# Schedules:
#   - Morning:  6:00 AM daily
#   - Noon:     12:00 PM daily
#   - Evening:  6:00 PM daily
#   - Nightly:  11:59 PM daily
#
# Usage:
#   ./scripts/setup-backup-scheduler.sh install   # Install and start scheduler
#   ./scripts/setup-backup-scheduler.sh uninstall # Stop and remove scheduler
#   ./scripts/setup-backup-scheduler.sh status    # Check scheduler status
#   ./scripts/setup-backup-scheduler.sh test      # Run a test backup
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"
LAUNCHD_DIR="${HOME}/Library/LaunchAgents"
BACKUP_SCRIPT="${SCRIPT_DIR}/db-backup-automated.sh"

# Backup schedule jobs (bash 3.2 compatible)
# Format: "name:hour:minute"
SCHEDULES="morning:6:0 noon:12:0 evening:18:0 nightly:23:59"

# Function to create launchd plist for a specific schedule
create_plist() {
  local schedule_name="$1"
  local hour_minute="$2"
  local hour="${hour_minute%:*}"
  local minute="${hour_minute#*:}"

  local plist_name="com.permahub.backup.${schedule_name}"
  local plist_file="${LAUNCHD_DIR}/${plist_name}.plist"

  echo -e "${YELLOW}Creating launchd job: ${schedule_name} (${hour}:${minute})${NC}"

  cat > "${plist_file}" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${plist_name}</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${BACKUP_SCRIPT}</string>
        <string>${schedule_name}</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>${hour}</integer>
        <key>Minute</key>
        <integer>${minute}</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>${PROJECT_ROOT}/backups/logs/launchd_${schedule_name}.log</string>

    <key>StandardErrorPath</key>
    <string>${PROJECT_ROOT}/backups/logs/launchd_${schedule_name}_error.log</string>

    <key>WorkingDirectory</key>
    <string>${PROJECT_ROOT}</string>

    <key>RunAtLoad</key>
    <false/>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
        <key>SUPABASE_DB_HOST</key>
        <string>127.0.0.1</string>
        <key>SUPABASE_DB_PORT</key>
        <string>5432</string>
        <key>SUPABASE_DB_USER</key>
        <string>postgres</string>
        <key>SUPABASE_DB_NAME</key>
        <string>postgres</string>
        <key>SUPABASE_DB_PASSWORD</key>
        <string>postgres</string>
    </dict>
</dict>
</plist>
EOF

  echo -e "${GREEN}✓${NC} Created: ${plist_file}"
}

# Function to install all schedulers
install_schedulers() {
  echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  Installing Backup Schedulers${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
  echo ""

  # Verify backup script exists
  if [ ! -f "${BACKUP_SCRIPT}" ]; then
    echo -e "${RED}Error: Backup script not found: ${BACKUP_SCRIPT}${NC}"
    exit 1
  fi

  # Make backup script executable
  chmod +x "${BACKUP_SCRIPT}"

  # Create LaunchAgents directory if it doesn't exist
  mkdir -p "${LAUNCHD_DIR}"

  # Create logs directory
  mkdir -p "${PROJECT_ROOT}/backups/logs"

  # Create plist files for each schedule
  for schedule_entry in ${SCHEDULES}; do
    local schedule_name="${schedule_entry%%:*}"
    local remaining="${schedule_entry#*:}"
    local hour="${remaining%%:*}"
    local minute="${remaining#*:}"
    create_plist "${schedule_name}" "${hour}:${minute}"
  done

  echo ""
  echo -e "${YELLOW}Loading launchd agents...${NC}"

  # Load each agent
  for schedule_entry in ${SCHEDULES}; do
    local schedule_name="${schedule_entry%%:*}"
    local plist_name="com.permahub.backup.${schedule_name}"
    local plist_file="${LAUNCHD_DIR}/${plist_name}.plist"

    launchctl unload "${plist_file}" 2>/dev/null || true
    launchctl load "${plist_file}"

    echo -e "${GREEN}✓${NC} Loaded: ${plist_name}"
  done

  echo ""
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  Installation Complete!${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "${BLUE}Backup Schedule:${NC}"
  echo -e "  • Morning:  6:00 AM daily"
  echo -e "  • Noon:     12:00 PM daily"
  echo -e "  • Evening:  6:00 PM daily"
  echo -e "  • Nightly:  11:59 PM daily"
  echo ""
  echo -e "${BLUE}Retention:${NC} 60 days"
  echo -e "${BLUE}Location:${NC} ${PROJECT_ROOT}/backups/database"
  echo -e "${BLUE}Logs:${NC} ${PROJECT_ROOT}/backups/logs"
  echo ""
  echo -e "${YELLOW}Note:${NC} Notifications require macOS notification permissions"
  echo ""
}

# Function to uninstall all schedulers
uninstall_schedulers() {
  echo -e "${YELLOW}Uninstalling backup schedulers...${NC}"
  echo ""

  for schedule_entry in ${SCHEDULES}; do
    local schedule_name="${schedule_entry%%:*}"
    local plist_name="com.permahub.backup.${schedule_name}"
    local plist_file="${LAUNCHD_DIR}/${plist_name}.plist"

    if [ -f "${plist_file}" ]; then
      launchctl unload "${plist_file}" 2>/dev/null || true
      rm -f "${plist_file}"
      echo -e "${GREEN}✓${NC} Removed: ${plist_name}"
    fi
  done

  echo ""
  echo -e "${GREEN}Uninstallation complete${NC}"
  echo ""
}

# Function to check scheduler status
check_status() {
  echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  Backup Scheduler Status${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
  echo ""

  local all_loaded=true

  for schedule_entry in ${SCHEDULES}; do
    local schedule_name="${schedule_entry%%:*}"
    local remaining="${schedule_entry#*:}"
    local hour="${remaining%%:*}"
    local minute="${remaining#*:}"
    local hour_minute="${hour}:${minute}"
    local plist_name="com.permahub.backup.${schedule_name}"
    local plist_file="${LAUNCHD_DIR}/${plist_name}.plist"

    echo -n "  ${schedule_name} (${hour_minute}): "

    if [ ! -f "${plist_file}" ]; then
      echo -e "${RED}Not installed${NC}"
      all_loaded=false
      continue
    fi

    if launchctl list | grep -q "${plist_name}"; then
      echo -e "${GREEN}Active${NC}"

      # Check last run from log file
      local log_file="${PROJECT_ROOT}/backups/logs/launchd_${schedule_name}.log"
      if [ -f "${log_file}" ]; then
        local last_run=$(tail -n 1 "${log_file}" 2>/dev/null | grep -o '\[.*\]' | head -n 1 || echo "Never")
        echo "    Last run: ${last_run}"
      fi
    else
      echo -e "${YELLOW}Loaded but not running${NC}"
    fi
  done

  echo ""

  if [ "$all_loaded" = true ]; then
    echo -e "${GREEN}All schedulers are installed and active${NC}"
  else
    echo -e "${YELLOW}Some schedulers are not installed${NC}"
    echo -e "${YELLOW}Run: $0 install${NC}"
  fi

  echo ""

  # Show recent backups
  echo -e "${BLUE}Recent Automated Backups:${NC}"
  find "${PROJECT_ROOT}/backups/database" -name "auto_*_full.sql.gz" 2>/dev/null | sort -r | head -n 5 | while read backup; do
    local name=$(basename "${backup}" "_full.sql.gz")
    local size=$(du -h "${backup}" | cut -f1)
    local date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "${backup}" 2>/dev/null || stat -c "%y" "${backup}" | cut -d' ' -f1,2 | cut -d':' -f1,2)
    echo "  ${name} (${size}) - ${date}"
  done || echo -e "  ${YELLOW}No automated backups found${NC}"

  echo ""
}

# Function to run a test backup
run_test() {
  echo -e "${YELLOW}Running test backup...${NC}"
  echo ""

  if [ ! -f "${BACKUP_SCRIPT}" ]; then
    echo -e "${RED}Error: Backup script not found: ${BACKUP_SCRIPT}${NC}"
    exit 1
  fi

  "${BACKUP_SCRIPT}" "test"

  echo ""
  echo -e "${GREEN}Test backup complete!${NC}"
  echo ""
}

# Main command dispatcher
COMMAND="${1:-status}"

case "${COMMAND}" in
  install)
    install_schedulers
    ;;
  uninstall)
    uninstall_schedulers
    ;;
  status)
    check_status
    ;;
  test)
    run_test
    ;;
  *)
    echo "Usage: $0 {install|uninstall|status|test}"
    echo ""
    echo "Commands:"
    echo "  install   - Install and start backup schedulers"
    echo "  uninstall - Stop and remove backup schedulers"
    echo "  status    - Check scheduler status"
    echo "  test      - Run a test backup"
    echo ""
    echo "Backup Schedule:"
    echo "  • Morning:  6:00 AM daily"
    echo "  • Noon:     12:00 PM daily"
    echo "  • Evening:  6:00 PM daily"
    echo "  • Nightly:  11:59 PM daily"
    echo ""
    exit 1
    ;;
esac
