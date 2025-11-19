#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/lib/commit-coordinator.sh
# Description: Commit coordination library with locking for multi-session safety
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
COMMIT_LOCK="$REPO_ROOT/.git/commit.lock"
COMMIT_QUEUE="$STATE_DIR/commit-queue.json"
# Source session coordinator
source "$(dirname "${BASH_SOURCE[0]}")/session-coordinator.sh"

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Acquire commit lock
acquire_commit_lock() {
    local session_id="$1"
    local timeout=30
    local elapsed=0

    echo -e "${BLUE}Acquiring commit lock...${NC}"

    while [ $elapsed -lt $timeout ]; do
        if mkdir "$COMMIT_LOCK" 2>/dev/null; then
            # Lock acquired
            echo "$session_id" > "$COMMIT_LOCK/owner"
            echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$COMMIT_LOCK/timestamp"
            echo "$$" > "$COMMIT_LOCK/pid"

            echo -e "${GREEN}✓ Commit lock acquired${NC}"
            log_activity "$session_id" "LOCK_ACQUIRED" "Commit lock"
            return 0
        fi

        # Check if lock is stale
        if [ -f "$COMMIT_LOCK/timestamp" ]; then
            local lock_time=$(cat "$COMMIT_LOCK/timestamp")
            local lock_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "$lock_time" +%s 2>/dev/null || echo 0)
            local current_time=$(date +%s)
            local lock_age=$((current_time - lock_timestamp))

            if [ $lock_age -gt 30 ]; then
                echo -e "${YELLOW}Stale lock detected (${lock_age}s old), removing...${NC}"
                release_commit_lock "system" 2>/dev/null
                continue
            fi

            # Show who owns the lock
            if [ -f "$COMMIT_LOCK/owner" ]; then
                local owner=$(cat "$COMMIT_LOCK/owner")
                echo -e "${YELLOW}Waiting for lock (owned by: $owner)...${NC}"
            fi
        fi

        sleep 1
        ((elapsed++))
    done

    echo -e "${RED}✗ Failed to acquire commit lock (timeout)${NC}"
    return 1
}

# Release commit lock
release_commit_lock() {
    local session_id="$1"

    if [ -d "$COMMIT_LOCK" ]; then
        rm -rf "$COMMIT_LOCK"
        echo -e "${GREEN}✓ Commit lock released${NC}"
        log_activity "$session_id" "LOCK_RELEASED" "Commit lock"
        return 0
    fi

    return 1
}

# Validate commit atomicity
validate_commit_atomicity() {
    local files=("$@")
    local file_count=${#files[@]}
    local max_files=2

    # Get max files from config
    if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
        max_files=$(jq -r '.agents.commitQuality.maxFilesPerCommit // 2' "$CONFIG_FILE")
    fi

    if [ $file_count -gt $max_files ]; then
        echo -e "${RED}✗ Atomicity violation: $file_count files (max: $max_files)${NC}"
        echo -e "${YELLOW}  Files to commit:${NC}"
        for file in "${files[@]}"; do
            echo -e "${YELLOW}    - $file${NC}"
        done
        echo ""
        echo -e "${YELLOW}  Please split this into separate commits.${NC}"
        return 1
    fi

    echo -e "${GREEN}✓ Atomicity check passed ($file_count file(s))${NC}"
    return 0
}

# Validate commit message format
validate_commit_message() {
    local message="$1"

    # Get allowed prefixes from config
    local allowed_prefixes="feat|fix|docs|refactor|test|chore|style|perf"

    if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
        local prefixes=$(jq -r '.agents.commitQuality.allowedPrefixes | join("|")' "$CONFIG_FILE" 2>/dev/null)
        if [ -n "$prefixes" ] && [ "$prefixes" != "null" ]; then
            allowed_prefixes="$prefixes"
        fi
    fi

    # Check conventional commit format
    if echo "$message" | grep -qE "^($allowed_prefixes)(\(.+\))?: .+"; then
        echo -e "${GREEN}✓ Commit message format valid${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Commit message doesn't follow conventional format${NC}"
        echo -e "${YELLOW}  Expected: <type>: <description>${NC}"
        echo -e "${YELLOW}  Types: $allowed_prefixes${NC}"
        echo -e "${YELLOW}  Example: feat: Add user authentication${NC}"
        echo ""
        echo -e "${YELLOW}  Your message: $message${NC}"
        echo ""

        # Ask if user wants to continue
        read -p "$(echo -e ${YELLOW}Continue anyway? [y/N]: ${NC})" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            return 0
        else
            return 1
        fi
    fi
}

# Check if FixRecord.md needs updating
check_fixrecord_requirement() {
    local message="$1"
    local files=("${@:2}")

    # Check if this is a fix-related commit
    local fix_keywords="fix|bug|error|issue|patch|correct|resolve"

    if echo "$message" | grep -qiE "$fix_keywords"; then
        # Check if FixRecord.md is in the commit
        local fixrecord_included=false
        for file in "${files[@]}"; do
            if [ "$file" = "FixRecord.md" ]; then
                fixrecord_included=true
                break
            fi
        done

        if [ "$fixrecord_included" = false ]; then
            echo -e "${YELLOW}⚠ This appears to be a bug fix${NC}"
            echo -e "${YELLOW}  FixRecord.md should be updated and included${NC}"
            echo ""
            read -p "$(echo -e ${YELLOW}Continue without FixRecord.md? [y/N]: ${NC})" -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                return 1
            fi
        else
            echo -e "${GREEN}✓ FixRecord.md is included${NC}"
        fi
    fi

    return 0
}

# Safe commit with all validations
safe_commit() {
    local session_id="$1"
    local message="$2"
    shift 2
    local files=("$@")

    echo -e "${CYAN}=== Commit Validation ===${NC}"
    echo ""

    # Validate atomicity
    if ! validate_commit_atomicity "${files[@]}"; then
        return 1
    fi

    # Validate commit message
    if ! validate_commit_message "$message"; then
        return 1
    fi

    # Check FixRecord requirement
    if ! check_fixrecord_requirement "$message" "${files[@]}"; then
        return 1
    fi

    echo ""
    echo -e "${CYAN}=== Committing ===${NC}"
    echo ""

    # Acquire lock
    if ! acquire_commit_lock "$session_id"; then
        return 1
    fi

    # Add files
    echo -e "${BLUE}Staging files...${NC}"
    for file in "${files[@]}"; do
        git add "$file"
        echo -e "  ${GREEN}✓${NC} $file"
    done

    # Commit
    echo ""
    echo -e "${BLUE}Creating commit...${NC}"
    if git commit -m "$message"; then
        echo -e "${GREEN}✓ Commit successful${NC}"
        log_activity "$session_id" "COMMIT_SUCCESS" "$message"

        # Release lock
        release_commit_lock "$session_id"
        return 0
    else
        echo -e "${RED}✗ Commit failed${NC}"
        log_activity "$session_id" "COMMIT_FAILED" "$message"

        # Release lock
        release_commit_lock "$session_id"
        return 1
    fi
}

# Export functions
export -f acquire_commit_lock
export -f release_commit_lock
export -f validate_commit_atomicity
export -f validate_commit_message
export -f check_fixrecord_requirement
export -f safe_commit
