#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/init-claude-session.sh
# Description: Auto-initialize Git Agent when Claude Code session starts
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-18
#

# Get repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

# Check if session already initialized for this process
if [ -f "/tmp/git-agent-session-$$.id" ]; then
    SESSION_ID=$(cat "/tmp/git-agent-session-$$.id")
    echo -e "${GREEN}✓ Git Agent session already active: $SESSION_ID${NC}"
    exit 0
fi

# Initialize session
echo -e "${BOLD}${CYAN}Initializing Git Agent for this Claude Code session...${NC}"

# Run the git-agents init command
cd "$REPO_ROOT"
SESSION_OUTPUT=$("$REPO_ROOT/scripts/git-agents.sh" init-session 2>&1)

# Extract session ID from output
SESSION_ID=$(echo "$SESSION_OUTPUT" | grep -E '^[a-z0-9]{8}$' | tail -1)

if [ -n "$SESSION_ID" ]; then
    echo -e "${GREEN}✓ Git Agent initialized${NC}"
    echo -e "${CYAN}  Session: $SESSION_ID${NC}"
    echo -e "${CYAN}  Active sessions: $(cat "$REPO_ROOT/.claude/agents/state/active-sessions.json" | grep -c '"id"')${NC}"
    echo ""
    echo -e "${YELLOW}Agent Features:${NC}"
    echo -e "  • ${GREEN}Incremental commits${NC} - Automatically enforced (max 2 files)"
    echo -e "  • ${GREEN}Commit validation${NC} - Format and atomicity checks"
    echo -e "  • ${GREEN}Intelligent sync${NC} - Adaptive timing based on activity"
    echo -e "  • ${GREEN}Multi-session safe${NC} - Coordinates across Claude sessions"
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo -e "  ./scripts/git-agents.sh status      - View system status"
    echo -e "  ./scripts/git-agents.sh sync        - Sync to GitHub"
    echo -e "  ./scripts/git-agents.sh activity    - View recent activity"
    echo ""
else
    echo -e "${YELLOW}⚠ Session initialization had issues, but continuing...${NC}"
fi

exit 0
