#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/hooks/version-bump-hook.sh
# Description: Pre-commit hook to automatically bump version and enforce FixRecord.md updates
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

echo -e "${BLUE}🔄 Running version bump pre-commit hook...${NC}"

# Get project root directory (where package.json lives)
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

# Check if FixRecord.md is staged
if ! git diff --cached --name-only | grep -q "FixRecord.md"; then
    echo -e "${RED}❌ ERROR: FixRecord.md must be updated with every commit!${NC}"
    echo -e "${YELLOW}📝 Please add an entry to FixRecord.md documenting your changes.${NC}"
    echo ""
    echo "Format:"
    echo "### YYYY-MM-DD - Issue Title"
    echo "**Commit:** (will be added automatically)"
    echo "**Issue:** Brief description"
    echo "**Root Cause:** What caused it"
    echo "**Solution:** How you fixed it"
    echo "**Files Changed:** List of files"
    echo "**Author:** Your Name <email>"
    echo ""
    echo -e "${YELLOW}After updating FixRecord.md, stage it with:${NC}"
    echo "  git add FixRecord.md"
    echo ""
    exit 1
fi

# Read current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}📦 Current version: ${CURRENT_VERSION}${NC}"

# Parse version components (assuming semantic versioning: MAJOR.MINOR.PATCH)
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"

echo -e "${GREEN}⬆️  Bumping version: ${CURRENT_VERSION} → ${NEW_VERSION}${NC}"

# Update version in package.json using node
node -e "
const fs = require('fs');
const pkg = require('./package.json');
pkg.version = '${NEW_VERSION}';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Get current timestamp for FixRecord.md
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
CURRENT_DATE=$(date '+%Y-%m-%d')

# Check if FixRecord.md already has a version section for this commit
# If not, add version header at the appropriate location
TEMP_FILE=$(mktemp)

# Read FixRecord.md and check if we need to add version header
if ! grep -q "## Version ${NEW_VERSION}" FixRecord.md; then
    echo -e "${BLUE}📝 Adding version section to FixRecord.md${NC}"

    # Find the line number where "---" appears after the format section (line 47)
    # We'll insert the new version section after the format section and before existing entries

    # Create new version section
    VERSION_SECTION="
## Version ${NEW_VERSION} - ${TIMESTAMP}
**Commit:** \`PENDING\`

"

    # Read file and insert version section at the right place
    # Insert after line 50 (after the format section ends)
    {
        head -n 50 FixRecord.md
        echo "$VERSION_SECTION"
        tail -n +51 FixRecord.md
    } > "$TEMP_FILE"

    mv "$TEMP_FILE" FixRecord.md
    echo -e "${GREEN}✅ Version section added to FixRecord.md${NC}"
else
    echo -e "${BLUE}ℹ️  Version section already exists in FixRecord.md${NC}"

    # Update the timestamp if it exists
    if grep -q "## Version ${NEW_VERSION} -" FixRecord.md; then
        sed -i.bak "s/## Version ${NEW_VERSION} - .*/## Version ${NEW_VERSION} - ${TIMESTAMP}/" FixRecord.md
        rm FixRecord.md.bak
        echo -e "${GREEN}✅ Updated timestamp in version section${NC}"
    fi
fi

# Stage the updated files
git add package.json FixRecord.md

echo -e "${GREEN}✅ Version bumped and staged successfully!${NC}"
echo -e "${BLUE}📌 New version: ${NEW_VERSION}${NC}"
echo ""
echo -e "${YELLOW}Note: Commit hash will be added after commit completes.${NC}"

exit 0
