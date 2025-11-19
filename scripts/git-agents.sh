#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/git-agents.sh
# Description: Main CLI for intelligent Git agent system
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-18
#

set -e

# Get repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Load libraries
LIB_DIR="$REPO_ROOT/.claude/agents/lib"
source "$LIB_DIR/session-coordinator.sh"
source "$LIB_DIR/commit-coordinator.sh"
source "$LIB_DIR/sync-coordinator.sh"
source "$LIB_DIR/branch-coordinator.sh"

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Show usage
usage() {
    cat <<EOF
${BOLD}Git Agent System - Intelligent multi-session commit and sync management${NC}

${BOLD}USAGE:${NC}
    ./scripts/git-agents.sh <command> [options]

${BOLD}COMMANDS:${NC}

  ${CYAN}Session Management:${NC}
    init-session              Initialize a new agent session
    end-session <id>          End a specific session
    status                    Show all active sessions and system status
    cleanup                   Clean up stale sessions

  ${CYAN}Commit Operations:${NC}
    commit <msg> <files...>   Perform safe atomic commit with validation
    validate <files...>       Validate if files can be committed together

  ${CYAN}Sync Operations:${NC}
    sync                      Perform intelligent sync to GitHub
    sync-check                Check if sync is needed (non-blocking)
    sync-status               Show sync status and history

  ${CYAN}Branch Management:${NC}
    create-branch <type> <desc>  Create feature branch
    complete-feature          Complete feature (test + merge/PR)
    set-merge-pref <pr|direct>   Set merge preference
    branch-status             Show current branch status

  ${CYAN}Monitoring:${NC}
    watch                     Watch for uncommitted changes
    activity                  Show recent activity log
    logs [session-id]         Show logs for a session

  ${CYAN}Configuration:${NC}
    config                    Show current configuration
    config-edit               Edit configuration file

  ${CYAN}Help:${NC}
    help                      Show this help message

${BOLD}EXAMPLES:${NC}

  # Initialize session (do this when opening Claude Code)
  ./scripts/git-agents.sh init-session

  # Safe commit with validation
  ./scripts/git-agents.sh commit "feat: Add user auth" src/auth.js

  # Check system status
  ./scripts/git-agents.sh status

  # Intelligent sync
  ./scripts/git-agents.sh sync

  # Create feature branch
  ./scripts/git-agents.sh create-branch feature "user authentication"

  # Complete feature with tests and PR
  ./scripts/git-agents.sh complete-feature

${BOLD}MULTI-SESSION:${NC}
  This system supports multiple simultaneous Claude Code sessions.
  Each session coordinates via shared state to prevent conflicts.

${BOLD}DOCUMENTATION:${NC}
  ${GREEN}Full Guide:${NC}            .claude/agents/README.md
  ${GREEN}Installation:${NC}          .claude/agents/INSTALL.md
  ${GREEN}Multi-Repo Setup:${NC}      .claude/agents/MULTI_REPO_GUIDE.md
  ${GREEN}Branch Management:${NC}     .claude/agents/BRANCH_MANAGEMENT.md
  ${GREEN}Quick Reference:${NC}       .claude/agents/QUICKREF.md
  ${GREEN}Configuration:${NC}         .claude/agents/config.json

  ${CYAN}View documentation:${NC}
    cat .claude/agents/README.md
    open .claude/agents/README.md        # macOS
    less .claude/agents/MULTI_REPO_GUIDE.md  # Multi-repo setup

EOF
}

# Initialize session
cmd_init_session() {
    echo -e "${BOLD}${CYAN}=== Initializing Git Agent Session ===${NC}"
    echo ""

    # Clean up stale sessions first
    cleanup_stale_sessions

    # Generate session ID
    local session_id=$(generate_session_id)

    # Register session
    if register_session "$session_id"; then
        echo -e "${GREEN}✓ Session initialized: $session_id${NC}"
        echo -e "${CYAN}  PID: $$${NC}"
        echo -e "${CYAN}  Start time: $(date '+%Y-%m-%d %H:%M:%S')${NC}"

        # Show active sessions
        local active_count=$(get_active_session_count)
        echo -e "${CYAN}  Active sessions: $active_count${NC}"

        echo ""
        echo -e "${YELLOW}Save this session ID for later reference:${NC}"
        echo -e "${BOLD}$session_id${NC}"
        echo ""
        echo -e "${BLUE}To end this session later, run:${NC}"
        echo -e "  ./scripts/git-agents.sh end-session $session_id"
        echo ""

        # Store session ID for this shell
        echo "$session_id" > /tmp/git-agent-session-$$.id

        return 0
    else
        echo -e "${RED}✗ Failed to initialize session${NC}"
        return 1
    fi
}

# End session
cmd_end_session() {
    local session_id="$1"

    if [ -z "$session_id" ]; then
        # Try to get from current shell
        if [ -f "/tmp/git-agent-session-$$.id" ]; then
            session_id=$(cat "/tmp/git-agent-session-$$.id")
        else
            echo -e "${RED}Error: No session ID provided${NC}"
            echo -e "Usage: ./scripts/git-agents.sh end-session <session-id>"
            return 1
        fi
    fi

    echo -e "${CYAN}Ending session: $session_id${NC}"

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠ Warning: You have uncommitted changes${NC}"
        git status --short
        echo ""
        read -p "$(echo -e ${YELLOW}Continue ending session? [y/N]: ${NC})" -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}Session end cancelled${NC}"
            return 0
        fi
    fi

    # Check for unpushed commits
    if should_sync "$session_id"; then
        echo -e "${YELLOW}⚠ You have unpushed commits${NC}"
        read -p "$(echo -e ${YELLOW}Sync before ending session? [Y/n]: ${NC})" -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            intelligent_sync "$session_id"
        fi
    fi

    # Unregister session
    unregister_session "$session_id"

    echo -e "${GREEN}✓ Session ended${NC}"

    # Clean up temp file
    rm -f "/tmp/git-agent-session-$$.id"

    return 0
}

# Show status
cmd_status() {
    echo -e "${BOLD}${CYAN}=== Git Agent System Status ===${NC}"
    echo ""

    # Active sessions
    local active_count=$(get_active_session_count)
    echo -e "${CYAN}Active Sessions: $active_count${NC}"

    if [ "$active_count" -gt 0 ]; then
        echo ""
        get_active_sessions | while read -r sid; do
            if [ -f "$STATE_DIR/session-${sid}.heartbeat" ]; then
                local heartbeat=$(cat "$STATE_DIR/session-${sid}.heartbeat")
                echo -e "  ${BOLD}$sid${NC}"
                echo -e "    Last heartbeat: $heartbeat"
            fi
        done
    fi

    echo ""

    # Repository status
    echo -e "${CYAN}Repository Status:${NC}"
    local current_branch=$(git branch --show-current)
    echo -e "  Branch: ${BOLD}$current_branch${NC}"

    # Uncommitted changes
    local uncommitted=$(git status --porcelain | wc -l | tr -d ' ')
    if [ "$uncommitted" -gt 0 ]; then
        echo -e "  Uncommitted changes: ${YELLOW}$uncommitted file(s)${NC}"
    else
        echo -e "  Uncommitted changes: ${GREEN}None${NC}"
    fi

    # Unpushed commits
    git fetch origin &>/dev/null
    local unpushed=$(git log origin/"$current_branch".."$current_branch" --oneline 2>/dev/null | wc -l | tr -d ' ')
    if [ "$unpushed" -gt 0 ]; then
        echo -e "  Unpushed commits: ${YELLOW}$unpushed${NC}"
    else
        echo -e "  Unpushed commits: ${GREEN}None${NC}"
    fi

    echo ""

    # Sync status
    if [ -f "$SYNC_STATE" ] && command -v jq &>/dev/null; then
        echo -e "${CYAN}Sync Status:${NC}"
        local last_sync=$(jq -r '.lastSyncTime // "Never"' "$SYNC_STATE")
        local total_syncs=$(jq -r '.totalSyncs // 0' "$SYNC_STATE")
        echo -e "  Last sync: $last_sync"
        echo -e "  Total syncs: $total_syncs"
    fi

    echo ""

    # Lock status
    if [ -d "$COMMIT_LOCK" ]; then
        local owner=$(cat "$COMMIT_LOCK/owner" 2>/dev/null || echo "unknown")
        echo -e "${YELLOW}⚠ Commit lock held by: $owner${NC}"
    fi

    if [ -d "$SYNC_LOCK" ]; then
        local owner=$(cat "$SYNC_LOCK/owner" 2>/dev/null || echo "unknown")
        echo -e "${YELLOW}⚠ Sync lock held by: $owner${NC}"
    fi
}

# Safe commit
cmd_commit() {
    local message="$1"
    shift
    local files=("$@")

    if [ -z "$message" ] || [ ${#files[@]} -eq 0 ]; then
        echo -e "${RED}Error: Message and files required${NC}"
        echo -e "Usage: ./scripts/git-agents.sh commit \"<message>\" <file1> [file2...]"
        return 1
    fi

    # Get or create session ID
    local session_id
    if [ -f "/tmp/git-agent-session-$$.id" ]; then
        session_id=$(cat "/tmp/git-agent-session-$$.id")
    else
        session_id=$(generate_session_id)
        register_session "$session_id"
        echo "$session_id" > /tmp/git-agent-session-$$.id
    fi

    # Perform safe commit
    safe_commit "$session_id" "$message" "${files[@]}"
}

# Intelligent sync
cmd_sync() {
    # Get or create session ID
    local session_id
    if [ -f "/tmp/git-agent-session-$$.id" ]; then
        session_id=$(cat "/tmp/git-agent-session-$$.id")
    else
        session_id=$(generate_session_id)
        register_session "$session_id"
        echo "$session_id" > /tmp/git-agent-session-$$.id
    fi

    intelligent_sync "$session_id"
}

# Show activity log
cmd_activity() {
    local lines="${1:-50}"

    if [ ! -f "$ACTIVITY_LOG" ]; then
        echo -e "${YELLOW}No activity logged yet${NC}"
        return 0
    fi

    echo -e "${BOLD}${CYAN}=== Recent Activity (last $lines entries) ===${NC}"
    echo ""
    tail -n "$lines" "$ACTIVITY_LOG"
}

# Create feature branch
cmd_create_branch() {
    local work_type="$1"
    local description="$2"

    if [ -z "$work_type" ] || [ -z "$description" ]; then
        echo -e "${RED}Error: Type and description required${NC}"
        echo -e "Usage: ./scripts/git-agents.sh create-branch <type> \"<description>\""
        echo -e "Types: feature, fix, refactor, test, docs, perf"
        return 1
    fi

    # Get or create session ID
    local session_id
    if [ -f "/tmp/git-agent-session-$$.id" ]; then
        session_id=$(cat "/tmp/git-agent-session-$$.id")
    else
        session_id=$(generate_session_id)
        register_session "$session_id"
        echo "$session_id" > /tmp/git-agent-session-$$.id
    fi

    create_feature_branch "$session_id" "$work_type" "$description"
}

# Complete feature
cmd_complete_feature() {
    local base_branch="${1:-main}"

    # Get or create session ID
    local session_id
    if [ -f "/tmp/git-agent-session-$$.id" ]; then
        session_id=$(cat "/tmp/git-agent-session-$$.id")
    else
        session_id=$(generate_session_id)
        register_session "$session_id"
        echo "$session_id" > /tmp/git-agent-session-$$.id
    fi

    complete_feature "$session_id" "$base_branch"
}

# Set merge preference
cmd_set_merge_pref() {
    local preference="$1"

    if [ "$preference" != "pr" ] && [ "$preference" != "direct" ]; then
        echo -e "${RED}Error: Invalid preference${NC}"
        echo -e "Usage: ./scripts/git-agents.sh set-merge-pref <pr|direct>"
        return 1
    fi

    # Get or create session ID
    local session_id
    if [ -f "/tmp/git-agent-session-$$.id" ]; then
        session_id=$(cat "/tmp/git-agent-session-$$.id")
    else
        session_id=$(generate_session_id)
        register_session "$session_id"
        echo "$session_id" > /tmp/git-agent-session-$$.id
    fi

    init_branch_state

    # Save preference
    if command -v jq &>/dev/null && [ -f "$BRANCH_STATE" ]; then
        jq ".mergePreference = \"$preference\"" "$BRANCH_STATE" > "$BRANCH_STATE.tmp"
        mv "$BRANCH_STATE.tmp" "$BRANCH_STATE"
    fi

    echo -e "${GREEN}✓ Merge preference set to: $preference${NC}"
    log_activity "$session_id" "MERGE_PREFERENCE_SET" "Preference: $preference"
}

# Show branch status
cmd_branch_status() {
    local current_branch=$(git branch --show-current)

    echo -e "${BOLD}${CYAN}=== Branch Status ===${NC}"
    echo ""
    echo -e "${CYAN}Current Branch:${NC} ${BOLD}$current_branch${NC}"

    if [[ "$current_branch" =~ ^(feature|fix|refactor|test|docs|perf)/ ]]; then
        echo -e "${GREEN}✓ On feature branch${NC}"

        # Show commits on this branch
        local base_branch=$(git config --get branch."$current_branch".merge | sed 's|refs/heads/||' || echo "main")
        local commit_count=$(git log --oneline "$base_branch".."$current_branch" 2>/dev/null | wc -l | tr -d ' ')

        if [ "$commit_count" -gt 0 ]; then
            echo -e "${CYAN}Commits on this branch:${NC} $commit_count"
            echo ""
            git log --oneline "$base_branch".."$current_branch" | sed 's/^/  /'
        fi

        # Show merge preference
        init_branch_state
        if command -v jq &>/dev/null && [ -f "$BRANCH_STATE" ]; then
            local pref=$(jq -r '.mergePreference // "pr"' "$BRANCH_STATE")
            echo ""
            echo -e "${CYAN}Merge preference:${NC} $pref"
        fi
    else
        echo -e "${YELLOW}⚠ Not on a feature branch${NC}"
    fi
}

# Main command dispatcher
main() {
    local command="${1:-help}"
    shift || true

    case "$command" in
        init-session)
            cmd_init_session
            ;;
        end-session)
            cmd_end_session "$@"
            ;;
        status)
            cmd_status
            ;;
        cleanup)
            cleanup_stale_sessions
            echo -e "${GREEN}✓ Cleanup complete${NC}"
            ;;
        commit)
            cmd_commit "$@"
            ;;
        sync)
            cmd_sync
            ;;
        sync-check)
            session_id=$(cat "/tmp/git-agent-session-$$.id" 2>/dev/null || echo "temp")
            quick_sync_check "$session_id"
            ;;
        activity)
            cmd_activity "$@"
            ;;
        config)
            if command -v jq &>/dev/null; then
                jq '.' "$CONFIG_FILE"
            else
                cat "$CONFIG_FILE"
            fi
            ;;
        config-edit)
            ${EDITOR:-nano} "$CONFIG_FILE"
            ;;
        create-branch)
            cmd_create_branch "$@"
            ;;
        complete-feature)
            cmd_complete_feature "$@"
            ;;
        set-merge-pref)
            cmd_set_merge_pref "$@"
            ;;
        branch-status)
            cmd_branch_status
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            echo -e "${RED}Unknown command: $command${NC}"
            echo ""
            usage
            exit 1
            ;;
    esac
}

# Run main
main "$@"
