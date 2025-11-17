#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/sync-status.sh
# Description: Check status of auto-sync service
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-17
#

LOG_FILE="/tmp/permahub-autosync.log"

echo "========================================="
echo "Permahub Auto-Sync Status"
echo "========================================="
echo ""

# Check if launchd service is loaded
if launchctl list | grep -q "com.permahub.autosync"; then
    echo "✓ Service Status: RUNNING"
else
    echo "✗ Service Status: STOPPED"
fi

echo ""
echo "Configuration:"
echo "  - Sync Interval: Every 2 hours (7200 seconds)"
echo "  - Log File: $LOG_FILE"
echo ""

# Check if log file exists
if [ -f "$LOG_FILE" ]; then
    echo "Last 10 log entries:"
    echo "---"
    tail -n 10 "$LOG_FILE"
else
    echo "No log file found yet (service hasn't run)"
fi

echo ""
echo "========================================="
echo "Commands:"
echo "  Start:  ./scripts/sync-start.sh"
echo "  Stop:   ./scripts/sync-stop.sh"
echo "  Status: ./scripts/sync-status.sh"
echo "========================================="
