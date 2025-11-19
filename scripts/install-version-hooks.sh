#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/install-version-hooks.sh
# Description: Install version management git hooks
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-01-18
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Installing version management git hooks...${NC}"
echo ""

# Get project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

# Check if hooks directory exists
if [ ! -d ".git/hooks" ]; then
    echo -e "${RED}❌ Error: .git/hooks directory not found${NC}"
    echo "Are you in a git repository?"
    exit 1
fi

# Source hook files
PRE_COMMIT_SOURCE="scripts/hooks/version-bump-hook.sh"
POST_COMMIT_SOURCE="scripts/hooks/post-commit-hook.sh"

# Destination hook files
PRE_COMMIT_DEST=".git/hooks/pre-commit"
POST_COMMIT_DEST=".git/hooks/post-commit"

# Check if source hooks exist
if [ ! -f "$PRE_COMMIT_SOURCE" ]; then
    echo -e "${RED}❌ Error: Pre-commit hook not found: $PRE_COMMIT_SOURCE${NC}"
    exit 1
fi

if [ ! -f "$POST_COMMIT_SOURCE" ]; then
    echo -e "${RED}❌ Error: Post-commit hook not found: $POST_COMMIT_SOURCE${NC}"
    exit 1
fi

# Backup existing hooks if they exist
if [ -f "$PRE_COMMIT_DEST" ]; then
    echo -e "${YELLOW}⚠️  Existing pre-commit hook found${NC}"
    BACKUP_FILE="${PRE_COMMIT_DEST}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$PRE_COMMIT_DEST" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backed up to: ${BACKUP_FILE}${NC}"
fi

if [ -f "$POST_COMMIT_DEST" ]; then
    echo -e "${YELLOW}⚠️  Existing post-commit hook found${NC}"
    BACKUP_FILE="${POST_COMMIT_DEST}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$POST_COMMIT_DEST" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backed up to: ${BACKUP_FILE}${NC}"
fi

# Copy hooks to .git/hooks
echo -e "${BLUE}📋 Copying pre-commit hook...${NC}"
cp "$PRE_COMMIT_SOURCE" "$PRE_COMMIT_DEST"

echo -e "${BLUE}📋 Copying post-commit hook...${NC}"
cp "$POST_COMMIT_SOURCE" "$POST_COMMIT_DEST"

# Make hooks executable
chmod +x "$PRE_COMMIT_DEST"
chmod +x "$POST_COMMIT_DEST"

echo -e "${GREEN}✅ Hooks installed successfully!${NC}"
echo ""
echo -e "${BLUE}📌 Installed hooks:${NC}"
echo "  • Pre-commit:  .git/hooks/pre-commit"
echo "  • Post-commit: .git/hooks/post-commit"
echo ""
echo -e "${BLUE}📝 What these hooks do:${NC}"
echo "  1. Pre-commit:"
echo "     - Checks that FixRecord.md is updated"
echo "     - Auto-increments patch version in package.json"
echo "     - Adds version section to FixRecord.md"
echo "     - Stages updated files"
echo ""
echo "  2. Post-commit:"
echo "     - Updates FixRecord.md with actual commit hash"
echo "     - Creates git tag for the version"
echo "     - Amends commit with updated FixRecord.md"
echo ""
echo -e "${GREEN}✅ You're all set!${NC}"
echo -e "${YELLOW}⚠️  Remember: Every commit must include FixRecord.md updates!${NC}"
echo ""

exit 0
