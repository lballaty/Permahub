#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/sync-stop.sh
# Description: Stop auto-sync service
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-17
#

PLIST="$HOME/Library/LaunchAgents/com.permahub.autosync.plist"

echo "Stopping Permahub Auto-Sync service..."

if launchctl list | grep -q "com.permahub.autosync"; then
    launchctl unload "$PLIST"
    echo "✓ Service stopped successfully"
else
    echo "⚠ Service was not running"
fi

echo ""
echo "To start again, run: ./scripts/sync-start.sh"
