#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/lib/sync-coordinator.sh
# Description: Intelligent sync coordination with adaptive timing and multi-session awareness
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-18
#

# Use REPO_ROOT from calling script (don't recalculate it)
# If not set, calculate it (for direct execution)
if [ -z "$REPO_ROOT" ]; then
    REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
fi

CONFIG_FILE="$REPO_ROOT/.claude/agents/config.json"
STATE_DIR="$REPO_ROOT/.claude/agents/state"
SYNC_LOCK="$STATE_DIR/sync.lock"
SYNC_STATE="$STATE_DIR/sync-state.json"
# Source session coordinator
source "$(dirname "${BASH_SOURCE[0]}")/session-coordinator.sh"

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Initialize sync state
init_sync_state() {
    if [ ! -f "$SYNC_STATE" ]; then
        cat > "$SYNC_STATE" <<EOF
{
  "lastSyncTime": null,
  "lastSyncSuccess": null,
  "consecutiveFailures": 0,
  "totalSyncs": 0,
  "activityLevel": "idle"
}
EOF
    fi
}

# Acquire sync lock
acquire_sync_lock() {
    local session_id="$1"
    local timeout=120
    local elapsed=0

    echo -e "${BLUE}Acquiring sync lock...${NC}"

    while [ $elapsed -lt $timeout ]; do
        if mkdir "$SYNC_LOCK" 2>/dev/null; then
            echo "$session_id" > "$SYNC_LOCK/owner"
            echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$SYNC_LOCK/timestamp"
            echo "$$" > "$SYNC_LOCK/pid"

            echo -e "${GREEN}✓ Sync lock acquired${NC}"
            log_activity "$session_id" "SYNC_LOCK_ACQUIRED" "Preparing to sync"
            return 0
        fi

        # Check for stale lock
        if [ -f "$SYNC_LOCK/timestamp" ]; then
            local lock_time=$(cat "$SYNC_LOCK/timestamp")
            local lock_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "$lock_time" +%s 2>/dev/null || echo 0)
            local current_time=$(date +%s)
            local lock_age=$((current_time - lock_timestamp))

            if [ $lock_age -gt 120 ]; then
                echo -e "${YELLOW}Stale sync lock detected (${lock_age}s old), removing...${NC}"
                release_sync_lock "system" 2>/dev/null
                continue
            fi

            if [ -f "$SYNC_LOCK/owner" ]; then
                local owner=$(cat "$SYNC_LOCK/owner")
                echo -e "${YELLOW}Sync in progress by: $owner${NC}"
            fi
        fi

        sleep 2
        ((elapsed += 2))
    done

    echo -e "${RED}✗ Failed to acquire sync lock (timeout)${NC}"
    return 1
}

# Release sync lock
release_sync_lock() {
    local session_id="$1"

    if [ -d "$SYNC_LOCK" ]; then
        rm -rf "$SYNC_LOCK"
        echo -e "${GREEN}✓ Sync lock released${NC}"
        log_activity "$session_id" "SYNC_LOCK_RELEASED" "Sync completed"
        return 0
    fi

    return 1
}

# Check if sync is needed
should_sync() {
    local session_id="$1"

    # Check if there are unpushed commits
    git fetch origin &>/dev/null

    local current_branch=$(git branch --show-current)
    local unpushed=$(git log origin/"$current_branch".."$current_branch" --oneline 2>/dev/null | wc -l | tr -d ' ')

    if [ "$unpushed" -gt 0 ]; then
        echo -e "${CYAN}Found $unpushed unpushed commit(s)${NC}"
        return 0
    fi

    echo -e "${BLUE}No unpushed commits, sync not needed${NC}"
    return 1
}

# Calculate next sync interval based on activity
calculate_sync_interval() {
    local min_interval=1800  # 30 minutes
    local max_interval=14400  # 4 hours

    # Get config values
    if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
        min_interval=$(jq -r '.agents.syncIntelligence.minIntervalSeconds // 1800' "$CONFIG_FILE")
        max_interval=$(jq -r '.agents.syncIntelligence.maxIntervalSeconds // 14400' "$CONFIG_FILE")
    fi

    # Check recent activity (commits in last hour)
    local recent_commits=$(git log --since="1 hour ago" --oneline | wc -l | tr -d ' ')

    if [ "$recent_commits" -gt 5 ]; then
        # High activity - sync more frequently
        echo $min_interval
    elif [ "$recent_commits" -gt 2 ]; then
        # Moderate activity
        echo $(( (min_interval + max_interval) / 2 ))
    else
        # Low activity
        echo $max_interval
    fi
}

# Check if we're in work hours
is_work_hours() {
    local work_start="09:00"
    local work_end="18:00"

    if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
        work_start=$(jq -r '.agents.syncIntelligence.workHoursStart // "09:00"' "$CONFIG_FILE")
        work_end=$(jq -r '.agents.syncIntelligence.workHoursEnd // "18:00"' "$CONFIG_FILE")
    fi

    local current_hour=$(date +%H)
    local start_hour=$(echo "$work_start" | cut -d':' -f1)
    local end_hour=$(echo "$work_end" | cut -d':' -f1)

    if [ "$current_hour" -ge "$start_hour" ] && [ "$current_hour" -lt "$end_hour" ]; then
        return 0
    else
        return 1
    fi
}

# Detect if system is idle
is_system_idle() {
    local idle_threshold=900  # 15 minutes

    if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
        idle_threshold=$(jq -r '.agents.syncIntelligence.idleThresholdSeconds // 900' "$CONFIG_FILE")
    fi

    # Check last commit time
    local last_commit_time=$(git log -1 --format=%ct 2>/dev/null || echo 0)
    local current_time=$(date +%s)
    local time_since_commit=$((current_time - last_commit_time))

    if [ $time_since_commit -gt $idle_threshold ]; then
        return 0
    else
        return 1
    fi
}

# Perform intelligent sync
intelligent_sync() {
    local session_id="$1"

    echo -e "${CYAN}=== Intelligent Sync ===${NC}"
    echo -e "${CYAN}Session: $session_id${NC}"
    echo ""

    # Initialize state
    init_sync_state

    # Check if sync is needed
    if ! should_sync "$session_id"; then
        echo -e "${GREEN}✓ Repository is up to date${NC}"
        return 0
    fi

    # Check active sessions
    local active_count=$(get_active_session_count)
    echo -e "${CYAN}Active sessions: $active_count${NC}"

    # Check if we should sync now
    if is_system_idle; then
        echo -e "${GREEN}✓ System is idle - good time to sync${NC}"
    elif is_work_hours; then
        echo -e "${YELLOW}⚠ During work hours and active - syncing anyway${NC}"
    else
        echo -e "${BLUE}Outside work hours${NC}"
    fi

    echo ""

    # Acquire lock
    if ! acquire_sync_lock "$session_id"; then
        echo -e "${YELLOW}Another session is syncing, skipping...${NC}"
        return 1
    fi

    # Fetch latest
    echo -e "${BLUE}Fetching from remote...${NC}"
    if ! git fetch origin; then
        echo -e "${RED}✗ Fetch failed${NC}"
        release_sync_lock "$session_id"
        return 1
    fi

    # Get current branch
    local current_branch=$(git branch --show-current)
    echo -e "${CYAN}Branch: $current_branch${NC}"

    # Check for conflicts
    if git show-ref --verify --quiet "refs/remotes/origin/$current_branch"; then
        local local_commit=$(git rev-parse "$current_branch")
        local remote_commit=$(git rev-parse "origin/$current_branch")
        local base_commit=$(git merge-base "$current_branch" "origin/$current_branch" 2>/dev/null)

        if [ "$local_commit" != "$base_commit" ] && [ "$remote_commit" != "$base_commit" ]; then
            echo -e "${RED}✗ Branch has diverged from remote!${NC}"
            echo -e "${YELLOW}  Manual resolution required${NC}"
            echo -e "${YELLOW}  Run: git pull --rebase origin $current_branch${NC}"

            # Send notification
            osascript -e "display notification \"Branch '$current_branch' has diverged. Manual merge needed.\" with title \"Permahub Sync Conflict\" sound name \"default\"" 2>/dev/null

            release_sync_lock "$session_id"
            return 1
        fi
    fi

    # Push
    echo ""
    echo -e "${BLUE}Pushing to remote...${NC}"
    if git push origin "$current_branch"; then
        echo -e "${GREEN}✓ Sync successful${NC}"

        # Update sync state
        if command -v jq &> /dev/null; then
            local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
            jq ".lastSyncTime = \"$timestamp\" | .lastSyncSuccess = true | .consecutiveFailures = 0 | .totalSyncs += 1" "$SYNC_STATE" > "$SYNC_STATE.tmp"
            mv "$SYNC_STATE.tmp" "$SYNC_STATE"
        fi

        log_activity "$session_id" "SYNC_SUCCESS" "Branch: $current_branch"

        # Calculate next sync interval
        local next_interval=$(calculate_sync_interval)
        local next_sync_readable=$(date -v +${next_interval}S '+%H:%M:%S')
        echo -e "${CYAN}Next sync recommended around: $next_sync_readable${NC}"

        release_sync_lock "$session_id"
        return 0
    else
        echo -e "${RED}✗ Push failed${NC}"

        # Update failure count
        if command -v jq &> /dev/null; then
            jq ".lastSyncSuccess = false | .consecutiveFailures += 1" "$SYNC_STATE" > "$SYNC_STATE.tmp"
            mv "$SYNC_STATE.tmp" "$SYNC_STATE"
        fi

        log_activity "$session_id" "SYNC_FAILED" "Branch: $current_branch"

        release_sync_lock "$session_id"
        return 1
    fi
}

# Quick sync check (non-blocking)
quick_sync_check() {
    local session_id="$1"

    # Don't acquire lock, just check status
    if [ -d "$SYNC_LOCK" ]; then
        echo -e "${YELLOW}Sync in progress by another session${NC}"
        return 0
    fi

    if should_sync "$session_id"; then
        echo -e "${CYAN}Sync recommended (unpushed commits exist)${NC}"
        return 2
    fi

    echo -e "${GREEN}Repository is synchronized${NC}"
    return 0
}

# Export functions
export -f init_sync_state
export -f acquire_sync_lock
export -f release_sync_lock
export -f should_sync
export -f calculate_sync_interval
export -f is_work_hours
export -f is_system_idle
export -f intelligent_sync
export -f quick_sync_check
