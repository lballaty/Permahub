#!/bin/bash
#
# File: .githooks/setup-hooks.sh
# Description: Setup script to install git hooks for Permahub project
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-16
#

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up Permahub git hooks...${NC}"
echo ""

# Get the git root directory
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$GIT_ROOT" ]; then
    echo -e "${YELLOW}⚠️  Error: Not in a git repository${NC}"
    exit 1
fi

HOOKS_DIR="$GIT_ROOT/.git/hooks"
SOURCE_DIR="$GIT_ROOT/.githooks"

# Check if .githooks directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${YELLOW}⚠️  Error: .githooks directory not found${NC}"
    exit 1
fi

# Install pre-commit hook
echo -e "${BLUE}Installing pre-commit hook...${NC}"

if [ -f "$SOURCE_DIR/pre-commit" ]; then
    cp "$SOURCE_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
    chmod +x "$HOOKS_DIR/pre-commit"
    echo -e "${GREEN}✅ pre-commit hook installed${NC}"
else
    echo -e "${YELLOW}⚠️  pre-commit hook not found in $SOURCE_DIR${NC}"
fi

echo ""
echo -e "${GREEN}✅ Git hooks setup complete!${NC}"
echo ""
echo -e "${BLUE}Installed hooks:${NC}"
ls -lh "$HOOKS_DIR" | grep -v ".sample" | grep -E "^-" | awk '{print "  - " $9}'
echo ""
echo -e "${BLUE}What happens now:${NC}"
echo -e "  • Pre-commit hook will check for FixRecord.md updates"
echo -e "  • You'll be prompted if you commit a fix without documentation"
echo -e "  • You can bypass with: ${YELLOW}git commit --no-verify${NC} (not recommended)"
echo ""
echo -e "${GREEN}Happy coding! 🌱${NC}"
