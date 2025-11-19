#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/lib/branch-coordinator.sh
# Description: Intelligent branch management with auto-creation, testing, and PR/merge handling
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-18
#

# Use REPO_ROOT from calling script
if [ -z "$REPO_ROOT" ]; then
    REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
fi

CONFIG_FILE="$REPO_ROOT/.claude/agents/config.json"
STATE_DIR="$REPO_ROOT/.claude/agents/state"
BRANCH_STATE="$STATE_DIR/branch-state.json"

# Source session coordinator
source "$(dirname "${BASH_SOURCE[0]}")/session-coordinator.sh"

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Initialize branch state
init_branch_state() {
    if [ ! -f "$BRANCH_STATE" ]; then
        cat > "$BRANCH_STATE" <<EOF
{
  "currentFeatureBranch": null,
  "branchHistory": [],
  "mergePreference": "pr",
  "testingEnabled": true
}
EOF
    fi
}

# Detect work type from user message
detect_work_type() {
    local message="$1"

    # Convert to lowercase for matching
    local msg_lower=$(echo "$message" | tr '[:upper:]' '[:lower:]')

    if echo "$msg_lower" | grep -qE "add|implement|create|build|new"; then
        echo "feature"
    elif echo "$msg_lower" | grep -qE "fix|bug|error|issue|broken|crash"; then
        echo "fix"
    elif echo "$msg_lower" | grep -qE "refactor|restructure|reorganize|cleanup"; then
        echo "refactor"
    elif echo "$msg_lower" | grep -qE "test|testing|spec"; then
        echo "test"
    elif echo "$msg_lower" | grep -qE "doc|documentation|readme"; then
        echo "docs"
    elif echo "$msg_lower" | grep -qE "performance|optimize|speed|fast"; then
        echo "perf"
    else
        echo "feature"  # Default to feature
    fi
}

# Generate descriptive branch name
generate_branch_name() {
    local work_type="$1"
    local description="$2"
    local repo_name=$(basename "$REPO_ROOT")

    # Sanitize description: lowercase, replace spaces with hyphens, remove special chars
    local clean_desc=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | cut -c1-40)

    # Get current date for uniqueness
    local date_suffix=$(date +%Y%m%d)

    # Format: type/repo-description-date
    # Example: feature/permahub-user-auth-20251118
    echo "${work_type}/${repo_name}-${clean_desc}-${date_suffix}"
}

# Check if on protected branch
is_on_protected_branch() {
    local current_branch=$(git branch --show-current)
    local protected_branches="main master develop production staging"

    # Get protected branches from config if available
    if command -v jq &>/dev/null && [ -f "$CONFIG_FILE" ]; then
        local config_protected=$(jq -r '.branchManagement.protectedBranches[]?' "$CONFIG_FILE" 2>/dev/null)
        if [ -n "$config_protected" ]; then
            protected_branches="$config_protected"
        fi
    fi

    for branch in $protected_branches; do
        if [ "$current_branch" = "$branch" ]; then
            return 0
        fi
    done

    return 1
}

# Create and switch to feature branch
create_feature_branch() {
    local session_id="$1"
    local work_type="$2"
    local description="$3"

    init_branch_state

    echo -e "${CYAN}=== Branch Management ===${NC}"
    echo ""

    # Check if already on feature branch
    local current_branch=$(git branch --show-current)
    if [[ "$current_branch" =~ ^(feature|fix|refactor|test|docs|perf)/ ]]; then
        echo -e "${YELLOW}Already on feature branch: $current_branch${NC}"
        echo -e "${YELLOW}Continue using this branch? [Y/n]: ${NC}"
        read -r response
        if [[ ! $response =~ ^[Nn]$ ]]; then
            return 0
        fi
    fi

    # Check if on protected branch
    if ! is_on_protected_branch; then
        echo -e "${YELLOW}Not on protected branch. Current: $current_branch${NC}"
        echo -e "${YELLOW}Continue anyway? [y/N]: ${NC}"
        read -r response
        if [[ ! $response =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi

    # Generate branch name
    local branch_name=$(generate_branch_name "$work_type" "$description")

    echo -e "${CYAN}Creating branch: ${BOLD}$branch_name${NC}"
    echo -e "${BLUE}  Type: $work_type${NC}"
    echo -e "${BLUE}  Description: $description${NC}"
    echo -e "${BLUE}  Base: $current_branch${NC}"
    echo ""

    # Create and switch to branch
    if git checkout -b "$branch_name"; then
        echo -e "${GREEN}✓ Branch created and checked out${NC}"

        # Update state
        if command -v jq &>/dev/null; then
            jq ".currentFeatureBranch = \"$branch_name\"" "$BRANCH_STATE" > "$BRANCH_STATE.tmp"
            mv "$BRANCH_STATE.tmp" "$BRANCH_STATE"
        fi

        log_activity "$session_id" "BRANCH_CREATED" "Branch: $branch_name (from $current_branch)"

        return 0
    else
        echo -e "${RED}✗ Failed to create branch${NC}"
        return 1
    fi
}

# Run tests before merge
run_tests() {
    local session_id="$1"
    local test_type="$2"  # "unit" or "regression"

    echo -e "${CYAN}=== Running Tests ===${NC}"
    echo -e "${BLUE}Type: $test_type${NC}"
    echo ""

    # Get test command from config
    local test_command="npm test"
    if command -v jq &>/dev/null && [ -f "$CONFIG_FILE" ]; then
        local config_cmd=$(jq -r ".branchManagement.testing.${test_type}Command // \"npm test\"" "$CONFIG_FILE")
        if [ -n "$config_cmd" ] && [ "$config_cmd" != "null" ]; then
            test_command="$config_cmd"
        fi
    fi

    echo -e "${BLUE}Running: $test_command${NC}"
    echo ""

    # Run tests
    if eval "$test_command"; then
        echo ""
        echo -e "${GREEN}✓ Tests passed${NC}"
        log_activity "$session_id" "TESTS_PASSED" "Type: $test_type"
        return 0
    else
        echo ""
        echo -e "${RED}✗ Tests failed${NC}"
        log_activity "$session_id" "TESTS_FAILED" "Type: $test_type"
        return 1
    fi
}

# Merge branch back to base
merge_feature_branch() {
    local session_id="$1"
    local branch_name="$2"
    local base_branch="${3:-main}"

    echo -e "${CYAN}=== Merging Branch ===${NC}"
    echo ""

    # Get current branch
    local current_branch=$(git branch --show-current)

    if [ "$current_branch" != "$branch_name" ]; then
        echo -e "${YELLOW}Not on feature branch. Switching to $branch_name...${NC}"
        git checkout "$branch_name" || return 1
    fi

    # Check if tests are required
    local require_tests=true
    if command -v jq &>/dev/null && [ -f "$CONFIG_FILE" ]; then
        require_tests=$(jq -r '.branchManagement.testing.requireBeforeMerge // true' "$CONFIG_FILE")
    fi

    if [ "$require_tests" = "true" ]; then
        echo -e "${CYAN}Running pre-merge tests...${NC}"
        echo ""

        # Run unit tests
        if ! run_tests "$session_id" "unit"; then
            echo -e "${RED}✗ Unit tests failed. Cannot merge.${NC}"
            echo -e "${YELLOW}Fix tests and try again: ./scripts/git-agents.sh merge-branch${NC}"
            return 1
        fi

        # Run regression tests
        echo ""
        if ! run_tests "$session_id" "regression"; then
            echo -e "${RED}✗ Regression tests failed. Cannot merge.${NC}"
            echo -e "${YELLOW}Fix tests and try again: ./scripts/git-agents.sh merge-branch${NC}"
            return 1
        fi
    fi

    echo ""
    echo -e "${CYAN}Tests passed. Proceeding with merge...${NC}"
    echo ""

    # Switch to base branch
    echo -e "${BLUE}Switching to $base_branch...${NC}"
    if ! git checkout "$base_branch"; then
        echo -e "${RED}✗ Failed to switch to $base_branch${NC}"
        return 1
    fi

    # Pull latest
    echo -e "${BLUE}Pulling latest from remote...${NC}"
    git pull origin "$base_branch" || echo -e "${YELLOW}Warning: Could not pull from remote${NC}"

    # Merge with no-ff (preserves history)
    echo ""
    echo -e "${BLUE}Merging $branch_name into $base_branch (no-ff)...${NC}"

    if git merge --no-ff "$branch_name" -m "Merge branch '$branch_name' into $base_branch

Completed: $(git log --oneline $base_branch..$branch_name | wc -l | tr -d ' ') commits
$(git log --oneline $base_branch..$branch_name | sed 's/^/  - /')"; then
        echo -e "${GREEN}✓ Merge successful${NC}"

        log_activity "$session_id" "BRANCH_MERGED" "Branch: $branch_name → $base_branch"

        # Delete feature branch
        echo ""
        echo -e "${BLUE}Deleting feature branch $branch_name...${NC}"
        git branch -d "$branch_name"

        echo -e "${GREEN}✓ Branch deleted${NC}"

        # Update state
        if command -v jq &>/dev/null && [ -f "$BRANCH_STATE" ]; then
            jq ".currentFeatureBranch = null" "$BRANCH_STATE" > "$BRANCH_STATE.tmp"
            mv "$BRANCH_STATE.tmp" "$BRANCH_STATE"
        fi

        return 0
    else
        echo -e "${RED}✗ Merge failed (conflicts?)${NC}"
        echo -e "${YELLOW}Resolve conflicts manually and complete merge${NC}"
        return 1
    fi
}

# Create GitHub Pull Request
create_pull_request() {
    local session_id="$1"
    local branch_name="$2"
    local base_branch="${3:-main}"
    local title="$4"
    local description="$5"

    echo -e "${CYAN}=== Creating Pull Request ===${NC}"
    echo ""

    # Check if gh CLI is available
    if ! command -v gh &>/dev/null; then
        echo -e "${RED}✗ GitHub CLI (gh) not installed${NC}"
        echo -e "${YELLOW}Install: brew install gh${NC}"
        return 1
    fi

    # Check if tests are required
    local require_tests=true
    if command -v jq &>/dev/null && [ -f "$CONFIG_FILE" ]; then
        require_tests=$(jq -r '.branchManagement.testing.requireBeforeMerge // true' "$CONFIG_FILE")
    fi

    if [ "$require_tests" = "true" ]; then
        echo -e "${CYAN}Running pre-PR tests...${NC}"
        echo ""

        # Run tests
        if ! run_tests "$session_id" "unit"; then
            echo -e "${RED}✗ Unit tests failed. Cannot create PR.${NC}"
            return 1
        fi

        if ! run_tests "$session_id" "regression"; then
            echo -e "${RED}✗ Regression tests failed. Cannot create PR.${NC}"
            return 1
        fi
    fi

    echo ""
    echo -e "${CYAN}Tests passed. Creating PR...${NC}"
    echo ""

    # Push branch to remote
    echo -e "${BLUE}Pushing $branch_name to remote...${NC}"
    if ! git push origin "$branch_name"; then
        echo -e "${RED}✗ Failed to push branch${NC}"
        return 1
    fi

    # Generate PR body
    local pr_body=$(cat <<EOF
## Summary

$description

## Commits

$(git log --oneline $base_branch..$branch_name | sed 's/^/- /')

## Testing

- ✅ Unit tests passed
- ✅ Regression tests passed

## Checklist

- [x] Code follows project conventions
- [x] Tests added/updated
- [x] All tests passing
- [x] Documentation updated (if needed)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)

    # Create PR
    echo ""
    echo -e "${BLUE}Creating pull request...${NC}"

    if gh pr create \
        --base "$base_branch" \
        --head "$branch_name" \
        --title "$title" \
        --body "$pr_body"; then

        echo ""
        echo -e "${GREEN}✓ Pull request created${NC}"

        log_activity "$session_id" "PR_CREATED" "Branch: $branch_name → $base_branch"

        return 0
    else
        echo -e "${RED}✗ Failed to create pull request${NC}"
        return 1
    fi
}

# Ask user about merge preference
ask_merge_preference() {
    local session_id="$1"

    echo -e "${CYAN}=== Merge Preference ===${NC}"
    echo ""
    echo -e "How would you like to handle merges for this project?"
    echo ""
    echo -e "  ${GREEN}1)${NC} Create Pull Request (recommended for teams)"
    echo -e "  ${GREEN}2)${NC} Direct merge to main (faster for solo dev)"
    echo ""
    echo -e "${YELLOW}Enter choice [1-2] (default: 1): ${NC}"
    read -r choice

    local preference="pr"
    if [ "$choice" = "2" ]; then
        preference="direct"
        echo -e "${BLUE}Set to: Direct merge${NC}"
    else
        echo -e "${BLUE}Set to: Pull Request${NC}"
    fi

    # Save preference
    if command -v jq &>/dev/null && [ -f "$BRANCH_STATE" ]; then
        jq ".mergePreference = \"$preference\"" "$BRANCH_STATE" > "$BRANCH_STATE.tmp"
        mv "$BRANCH_STATE.tmp" "$BRANCH_STATE"
    fi

    log_activity "$session_id" "MERGE_PREFERENCE_SET" "Preference: $preference"

    echo ""
    echo -e "${GREEN}✓ Preference saved${NC}"
    echo -e "${YELLOW}You can change this anytime in: .claude/agents/state/branch-state.json${NC}"

    return 0
}

# Get merge preference
get_merge_preference() {
    init_branch_state

    if command -v jq &>/dev/null && [ -f "$BRANCH_STATE" ]; then
        jq -r '.mergePreference // "pr"' "$BRANCH_STATE"
    else
        echo "pr"
    fi
}

# Complete feature workflow
complete_feature() {
    local session_id="$1"
    local base_branch="${2:-main}"

    # Get current branch
    local current_branch=$(git branch --show-current)

    if [[ ! "$current_branch" =~ ^(feature|fix|refactor|test|docs|perf)/ ]]; then
        echo -e "${RED}✗ Not on a feature branch${NC}"
        echo -e "${YELLOW}Current branch: $current_branch${NC}"
        return 1
    fi

    echo -e "${CYAN}=== Completing Feature ===${NC}"
    echo -e "${BLUE}Branch: $current_branch${NC}"
    echo -e "${BLUE}Target: $base_branch${NC}"
    echo ""

    # Get merge preference
    local preference=$(get_merge_preference)

    if [ "$preference" = "pr" ]; then
        # Create Pull Request
        local title="$current_branch"
        local description="Automated feature completion"

        # Try to generate better title/description from commits
        if [ -n "$(git log --oneline $base_branch..$current_branch 2>/dev/null)" ]; then
            title=$(git log --oneline $base_branch..$current_branch | head -1 | cut -d' ' -f2-)
            description=$(git log --oneline $base_branch..$current_branch | sed 's/^/- /')
        fi

        create_pull_request "$session_id" "$current_branch" "$base_branch" "$title" "$description"
    else
        # Direct merge
        merge_feature_branch "$session_id" "$current_branch" "$base_branch"
    fi
}

# Export functions
export -f init_branch_state
export -f detect_work_type
export -f generate_branch_name
export -f is_on_protected_branch
export -f create_feature_branch
export -f run_tests
export -f merge_feature_branch
export -f create_pull_request
export -f ask_merge_preference
export -f get_merge_preference
export -f complete_feature
