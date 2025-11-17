#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/auto-sync-github.sh
# Description: Automatically sync all local branches to GitHub every 2 hours
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-17
#

# Configuration
REPO_DIR="/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub"
LOG_FILE="/tmp/permahub-autosync.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Logging function
log() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
}

# Notification function (macOS)
notify() {
    osascript -e "display notification \"$1\" with title \"Permahub Auto-Sync\" sound name \"default\""
    log "NOTIFICATION: $1"
}

# Change to repository directory
cd "$REPO_DIR" || {
    log "ERROR: Cannot access repository directory: $REPO_DIR"
    exit 1
}

log "========== Auto-Sync Started =========="

# Fetch latest from remote
log "Fetching from remote..."
if ! git fetch origin 2>&1 | tee -a "$LOG_FILE"; then
    log "ERROR: Failed to fetch from remote"
    notify "Failed to fetch from GitHub. Check internet connection."
    exit 1
fi

# Get all local branches
BRANCHES=$(git for-each-ref --format='%(refname:short)' refs/heads/)

if [ -z "$BRANCHES" ]; then
    log "No local branches found"
    exit 0
fi

SYNC_COUNT=0
ERROR_COUNT=0
CONFLICT_DETECTED=false

# Loop through each branch
while IFS= read -r branch; do
    log "Checking branch: $branch"

    # Check if branch exists on remote
    if git show-ref --verify --quiet "refs/remotes/origin/$branch"; then
        # Branch exists on remote, check if we're ahead
        LOCAL=$(git rev-parse "$branch" 2>/dev/null)
        REMOTE=$(git rev-parse "origin/$branch" 2>/dev/null)
        BASE=$(git merge-base "$branch" "origin/$branch" 2>/dev/null)

        if [ "$LOCAL" = "$REMOTE" ]; then
            log "  ✓ Branch '$branch' is up to date"
        elif [ "$LOCAL" = "$BASE" ]; then
            log "  ← Branch '$branch' is behind remote (no local commits to push)"
        elif [ "$REMOTE" = "$BASE" ]; then
            # Local is ahead, safe to push
            log "  → Branch '$branch' has local commits, pushing..."
            if git push origin "$branch" 2>&1 | tee -a "$LOG_FILE"; then
                log "  ✓ Successfully pushed '$branch'"
                ((SYNC_COUNT++))
            else
                log "  ✗ Failed to push '$branch'"
                ((ERROR_COUNT++))
            fi
        else
            # Diverged - conflict situation
            log "  ⚠ CONFLICT: Branch '$branch' has diverged from remote"
            notify "Conflict detected on branch '$branch'. Manual resolution required."
            CONFLICT_DETECTED=true
            ((ERROR_COUNT++))
        fi
    else
        # New branch, doesn't exist on remote yet
        log "  → New branch '$branch', pushing to remote..."
        if git push -u origin "$branch" 2>&1 | tee -a "$LOG_FILE"; then
            log "  ✓ Successfully pushed new branch '$branch'"
            ((SYNC_COUNT++))
        else
            log "  ✗ Failed to push new branch '$branch'"
            ((ERROR_COUNT++))
        fi
    fi
done <<< "$BRANCHES"

# Summary
log "========== Auto-Sync Completed =========="
log "Branches synced: $SYNC_COUNT"
log "Errors: $ERROR_COUNT"

if [ "$CONFLICT_DETECTED" = true ]; then
    log "⚠ Conflicts detected - manual resolution required"
elif [ $ERROR_COUNT -gt 0 ]; then
    notify "Auto-sync completed with $ERROR_COUNT error(s). Check log: $LOG_FILE"
elif [ $SYNC_COUNT -gt 0 ]; then
    log "✓ Successfully synced $SYNC_COUNT branch(es)"
else
    log "✓ All branches already up to date"
fi

log ""
exit 0
