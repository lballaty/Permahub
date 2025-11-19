#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/lib/session-coordinator.sh
# Description: Session coordination library for multi-session Git agent system
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
ACTIVE_SESSIONS_FILE="$STATE_DIR/active-sessions.json"
ACTIVITY_LOG="$STATE_DIR/activity.log"

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log_activity() {
    local session_id="$1"
    local action="$2"
    local details="$3"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$session_id] $action: $details" >> "$ACTIVITY_LOG"
}

# Generate unique session ID
generate_session_id() {
    if command -v uuidgen &> /dev/null; then
        uuidgen | tr '[:upper:]' '[:lower:]' | cut -d'-' -f1
    else
        echo "session-$(date +%s)-$$"
    fi
}

# Register new session
register_session() {
    local session_id="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # Create lock for safe concurrent access
    local lock_file="$STATE_DIR/sessions.lock"
    local lock_acquired=false
    local attempts=0

    while [ $attempts -lt 10 ]; do
        if mkdir "$lock_file" 2>/dev/null; then
            lock_acquired=true
            break
        fi
        sleep 0.1
        ((attempts++))
    done

    if [ "$lock_acquired" = false ]; then
        echo -e "${RED}Failed to acquire session lock${NC}" >&2
        return 1
    fi

    # Read current sessions
    local sessions="[]"
    if [ -f "$ACTIVE_SESSIONS_FILE" ]; then
        sessions=$(cat "$ACTIVE_SESSIONS_FILE")
    fi

    # Add new session
    local new_session=$(cat <<EOF
{
  "id": "$session_id",
  "pid": $$,
  "startTime": "$timestamp",
  "lastHeartbeat": "$timestamp",
  "status": "active"
}
EOF
)

    # Use jq if available, otherwise simple append
    if command -v jq &> /dev/null; then
        echo "$sessions" | jq ". += [$new_session]" > "$ACTIVE_SESSIONS_FILE"
    else
        # Fallback: manual JSON manipulation
        if [ "$sessions" = "[]" ]; then
            echo "[$new_session]" > "$ACTIVE_SESSIONS_FILE"
        else
            # Remove closing bracket, add comma and new session
            echo "$sessions" | sed 's/]$//' > "$ACTIVE_SESSIONS_FILE.tmp"
            echo ",$new_session]" >> "$ACTIVE_SESSIONS_FILE.tmp"
            mv "$ACTIVE_SESSIONS_FILE.tmp" "$ACTIVE_SESSIONS_FILE"
        fi
    fi

    # Create session-specific files
    touch "$STATE_DIR/session-${session_id}.heartbeat"
    echo "$timestamp" > "$STATE_DIR/session-${session_id}.heartbeat"

    # Release lock
    rmdir "$lock_file"

    log_activity "$session_id" "SESSION_START" "PID: $$"

    echo "$session_id"
    return 0
}

# Update session heartbeat
update_heartbeat() {
    local session_id="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "$timestamp" > "$STATE_DIR/session-${session_id}.heartbeat"

    # Update in active-sessions.json
    if command -v jq &> /dev/null && [ -f "$ACTIVE_SESSIONS_FILE" ]; then
        local sessions=$(cat "$ACTIVE_SESSIONS_FILE")
        echo "$sessions" | jq "map(if .id == \"$session_id\" then .lastHeartbeat = \"$timestamp\" else . end)" > "$ACTIVE_SESSIONS_FILE.tmp"
        mv "$ACTIVE_SESSIONS_FILE.tmp" "$ACTIVE_SESSIONS_FILE"
    fi
}

# Unregister session
unregister_session() {
    local session_id="$1"

    # Acquire lock
    local lock_file="$STATE_DIR/sessions.lock"
    local attempts=0
    while [ $attempts -lt 10 ]; do
        if mkdir "$lock_file" 2>/dev/null; then
            break
        fi
        sleep 0.1
        ((attempts++))
    done

    # Remove from active sessions
    if command -v jq &> /dev/null && [ -f "$ACTIVE_SESSIONS_FILE" ]; then
        local sessions=$(cat "$ACTIVE_SESSIONS_FILE")
        echo "$sessions" | jq "map(select(.id != \"$session_id\"))" > "$ACTIVE_SESSIONS_FILE"
    fi

    # Remove session-specific files
    rm -f "$STATE_DIR/session-${session_id}."*

    # Release lock
    rmdir "$lock_file" 2>/dev/null

    log_activity "$session_id" "SESSION_END" "Graceful shutdown"
}

# Clean up stale sessions
cleanup_stale_sessions() {
    local stale_timeout=300  # 5 minutes
    local current_time=$(date +%s)

    if [ ! -f "$ACTIVE_SESSIONS_FILE" ]; then
        return 0
    fi

    # Read all session heartbeat files
    for heartbeat_file in "$STATE_DIR"/session-*.heartbeat; do
        if [ ! -f "$heartbeat_file" ]; then
            continue
        fi

        local session_id=$(basename "$heartbeat_file" | sed 's/session-//; s/.heartbeat//')
        local last_heartbeat=$(cat "$heartbeat_file")
        local heartbeat_time=$(date -j -f "%Y-%m-%d %H:%M:%S" "$last_heartbeat" +%s 2>/dev/null || echo 0)

        local age=$((current_time - heartbeat_time))

        if [ $age -gt $stale_timeout ]; then
            echo -e "${YELLOW}Cleaning up stale session: $session_id (${age}s old)${NC}"
            unregister_session "$session_id"
        fi
    done
}

# Get active session count
get_active_session_count() {
    cleanup_stale_sessions

    if [ ! -f "$ACTIVE_SESSIONS_FILE" ]; then
        echo "0"
        return
    fi

    if command -v jq &> /dev/null; then
        cat "$ACTIVE_SESSIONS_FILE" | jq 'length'
    else
        # Fallback: count objects
        grep -c '"id"' "$ACTIVE_SESSIONS_FILE" 2>/dev/null || echo "0"
    fi
}

# Check if session is active
is_session_active() {
    local session_id="$1"

    if [ ! -f "$STATE_DIR/session-${session_id}.heartbeat" ]; then
        return 1
    fi

    local last_heartbeat=$(cat "$STATE_DIR/session-${session_id}.heartbeat")
    local heartbeat_time=$(date -j -f "%Y-%m-%d %H:%M:%S" "$last_heartbeat" +%s 2>/dev/null || echo 0)
    local current_time=$(date +%s)
    local age=$((current_time - heartbeat_time))

    if [ $age -lt 300 ]; then
        return 0
    else
        return 1
    fi
}

# Get all active session IDs
get_active_sessions() {
    cleanup_stale_sessions

    if [ ! -f "$ACTIVE_SESSIONS_FILE" ]; then
        echo "[]"
        return
    fi

    if command -v jq &> /dev/null; then
        cat "$ACTIVE_SESSIONS_FILE" | jq -r '.[].id'
    else
        grep '"id"' "$ACTIVE_SESSIONS_FILE" | cut -d'"' -f4
    fi
}

# Export functions
export -f log_activity
export -f generate_session_id
export -f register_session
export -f update_heartbeat
export -f unregister_session
export -f cleanup_stale_sessions
export -f get_active_session_count
export -f is_session_active
export -f get_active_sessions
