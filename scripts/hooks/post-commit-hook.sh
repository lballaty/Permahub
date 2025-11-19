#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/hooks/post-commit-hook.sh
# Description: Post-commit hook to update FixRecord.md with actual commit hash and create git tag
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

echo -e "${BLUE}🔄 Running post-commit hook...${NC}"

# Get project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

# Get the commit hash
COMMIT_HASH=$(git rev-parse HEAD)
SHORT_HASH=${COMMIT_HASH:0:7}

echo -e "${BLUE}📝 Commit hash: ${SHORT_HASH}${NC}"

# Read current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}📦 Version: ${CURRENT_VERSION}${NC}"

# Update FixRecord.md: Replace "PENDING" with actual commit hash
if grep -q "PENDING" FixRecord.md; then
    echo -e "${BLUE}📝 Updating FixRecord.md with commit hash...${NC}"

    # Replace the first occurrence of PENDING with the actual commit hash
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\`PENDING\`/\`${SHORT_HASH}\`/" FixRecord.md
    else
        # Linux
        sed -i "s/\`PENDING\`/\`${SHORT_HASH}\`/" FixRecord.md
    fi

    echo -e "${GREEN}✅ Commit hash added to FixRecord.md${NC}"

    # Create git tag for this version
    if ! git tag | grep -q "v${CURRENT_VERSION}"; then
        git tag -a "v${CURRENT_VERSION}" -m "Version ${CURRENT_VERSION}"
        echo -e "${GREEN}✅ Git tag created: v${CURRENT_VERSION}${NC}"
    else
        echo -e "${YELLOW}ℹ️  Tag v${CURRENT_VERSION} already exists${NC}"
    fi

    # Amend the commit to include the updated FixRecord.md (without triggering hooks again)
    git add FixRecord.md
    git commit --amend --no-edit --no-verify

    echo -e "${GREEN}✅ Post-commit hook completed successfully!${NC}"
else
    echo -e "${YELLOW}ℹ️  No PENDING placeholder found in FixRecord.md${NC}"
fi

exit 0
