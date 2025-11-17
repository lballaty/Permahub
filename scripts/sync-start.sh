#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/sync-start.sh
# Description: Start auto-sync service
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-17
#

PLIST="$HOME/Library/LaunchAgents/com.permahub.autosync.plist"

echo "Starting Permahub Auto-Sync service..."

# Check if plist exists
if [ ! -f "$PLIST" ]; then
    echo "✗ Error: Configuration file not found at $PLIST"
    exit 1
fi

# Unload if already loaded (ensures fresh start)
if launchctl list | grep -q "com.permahub.autosync"; then
    echo "  Stopping existing service..."
    launchctl unload "$PLIST" 2>/dev/null
fi

# Load the service
if launchctl load "$PLIST"; then
    echo "✓ Service started successfully"
    echo ""
    echo "Auto-sync will run every 2 hours"
    echo "Check status: ./scripts/sync-status.sh"
    echo "Stop service: ./scripts/sync-stop.sh"
else
    echo "✗ Failed to start service"
    exit 1
fi
