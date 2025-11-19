# Branch Management Agent - Complete Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/BRANCH_MANAGEMENT.md
**Description:** Intelligent automatic branch creation, testing, and PR/merge workflow
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-18
**Version:** 1.0.0

---

## 🎯 Overview

The Branch Management Agent automatically:
1. **Creates feature branches** for every piece of work
2. **Names branches descriptively** (repo + purpose + what was done + date)
3. **Runs tests** (unit + regression) before merge/PR
4. **Creates PRs** by default (or direct merge if configured)
5. **Preserves history** using no-ff merge strategy
6. **Enforces test creation** for every change

---

## 🌿 Automatic Branch Creation

### When It Happens

**Every time you ask me (Claude) to work on something:**

```
You: "Add user authentication"
         ↓
Agent detects: NEW FEATURE
         ↓
Creates branch: feature/permahub-user-authentication-20251118
         ↓
Switches to branch
         ↓
Ready to work!
```

### Branch Naming Convention

**Format:** `{type}/{repo}-{description}-{date}`

**Components:**
- `type`: feature|fix|refactor|test|docs|perf
- `repo`: Repository name (e.g., "permahub")
- `description`: Sanitized work description (40 chars max)
- `date`: YYYYMMDD format

**Examples:**
```
feature/permahub-user-authentication-20251118
fix/permahub-wiki-editor-crash-20251118
refactor/permahub-database-queries-20251118
test/permahub-auth-validation-20251118
docs/permahub-api-documentation-20251118
perf/permahub-query-optimization-20251118
```

### Work Type Detection

Agent automatically detects work type from your request:

| Your Request | Detected Type | Branch Prefix |
|--------------|---------------|---------------|
| "Add user auth" | feature | `feature/` |
| "Fix crash" | fix | `fix/` |
| "Refactor code" | refactor | `refactor/` |
| "Add tests" | test | `test/` |
| "Update docs" | docs | `docs/` |
| "Optimize query" | perf | `perf/` |

---

## 🧪 Testing Requirements

### Test-Driven Development Enforced

**For EVERY change, agent requires:**

1. **Unit Tests**
   - Test the specific code changed
   - Run before merge/PR
   - Command: `npm test` (configurable)

2. **Regression Tests**
   - Ensure nothing broke
   - Run full test suite
   - Command: `npm run test:regression` (configurable)

### Test Creation Workflow

```
You: "Add login feature"
         ↓
Me: Creates feature/permahub-login-20251118
         ↓
Me: Implements login code
         ↓
Me: "Now I'll create tests for this change..."
         ↓
Me: Creates test/login.test.js with unit tests
         ↓
Me: Updates regression test suite
         ↓
Me: Commits both code + tests
         ↓
Agent: Runs tests before merge
         ↓
Tests pass ✓
         ↓
Agent: Creates PR or merges
```

### Test Configuration

**In `.claude/agents/config.json`:**

```json
{
  "branchManagement": {
    "testing": {
      "requireBeforeMerge": true,
      "unitCommand": "npm test",
      "regressionCommand": "npm run test:regression",
      "testTimeout": 120000,
      "createTestsForEveryChange": true
    }
  }
}
```

---

## 🔀 Merge Strategies

### Default: Pull Request (Recommended)

**Workflow:**
```
1. Feature branch created
2. Work completed (multiple commits)
3. Tests created and pass
4. Agent pushes branch to GitHub
5. Agent creates Pull Request
6. You (or team) review PR
7. Merge when ready
```

**PR Contents:**
- ✅ Summary of changes
- ✅ List of commits
- ✅ Test results (unit + regression)
- ✅ Checklist (code review items)

**Example PR:**
```markdown
## Summary

Implements user authentication with email/password

## Commits

- feat: Add auth schema
- feat: Add auth service
- feat: Add auth routes
- test: Add auth unit tests
- test: Add auth regression tests

## Testing

- ✅ Unit tests passed (15/15)
- ✅ Regression tests passed (142/142)

## Checklist

- [x] Code follows project conventions
- [x] Tests added/updated
- [x] All tests passing
- [x] Documentation updated

---

🤖 Generated with Claude Code
```

### Alternative: Direct Merge

**For solo development:**

**Workflow:**
```
1. Feature branch created
2. Work completed (multiple commits)
3. Tests created and pass
4. Agent merges to main (no-ff)
5. Feature branch deleted
6. Changes synced to GitHub
```

**Merge commit message:**
```
Merge branch 'feature/permahub-user-auth-20251118' into main

Completed: 5 commits
  - feat: Add auth schema
  - feat: Add auth service
  - feat: Add auth routes
  - test: Add auth unit tests
  - test: Add auth regression tests
```

### No-FF Merge Strategy

**Why no-ff (no fast-forward)?**

Preserves complete history and traceability:

```
# With no-ff (✓ Recommended)
*   Merge branch 'feature/X' into main
|\
| * feat: Add feature X part 3
| * feat: Add feature X part 2
| * feat: Add feature X part 1
|/
* Previous commit

# With fast-forward (✗ Not used)
* feat: Add feature X part 3
* feat: Add feature X part 2
* feat: Add feature X part 1
* Previous commit
```

**Benefits:**
- ✅ Clear feature boundaries
- ✅ Easy to see what was part of one feature
- ✅ Can revert entire feature with one command
- ✅ Better for `git bisect`

---

## ⚙️ Configuration

### Per-Project Settings

**Configure merge preference:**

```json
{
  "branchManagement": {
    "mergeStrategy": {
      "default": "pr",          // or "direct"
      "strategy": "no-ff",       // merge strategy
      "deleteBranchAfterMerge": true,
      "requireTestsPass": true
    }
  }
}
```

### First-Time Setup

**Agent will ask:**
```
=== Merge Preference ===

How would you like to handle merges for this project?

  1) Create Pull Request (recommended for teams)
  2) Direct merge to main (faster for solo dev)

Enter choice [1-2] (default: 1):
```

**Your choice is saved** in `.claude/agents/state/branch-state.json`

**Change anytime:**
```bash
./scripts/git-agents.sh set-merge-preference [pr|direct]
```

---

## 🎬 Complete Workflow Examples

### Example 1: Feature with PR

**You:** "Add user authentication"

**Agent:**
```
=== Branch Management ===

Creating branch: feature/permahub-user-authentication-20251118
  Type: feature
  Description: add user authentication
  Base: main

✓ Branch created and checked out

[... I implement the feature ...]

Commit 1/4: feat: Add auth schema ✓
Commit 2/4: feat: Add auth service ✓
Commit 3/4: feat: Add auth middleware ✓
Commit 4/4: test: Add auth tests ✓

=== Completing Feature ===
Branch: feature/permahub-user-authentication-20251118
Target: main

Running pre-PR tests...

=== Running Tests ===
Type: unit

Running: npm test

✓ All tests passed (18/18)

=== Running Tests ===
Type: regression

Running: npm run test:regression

✓ All tests passed (145/145)

Tests passed. Creating PR...

Pushing feature/permahub-user-authentication-20251118 to remote...

Creating pull request...

✓ Pull request created
   URL: https://github.com/yourname/permahub/pull/42

Feature complete! Review PR and merge when ready.
```

### Example 2: Bug Fix with Direct Merge

**You:** "Fix wiki editor crash"

**Agent:**
```
=== Branch Management ===

Creating branch: fix/permahub-wiki-editor-crash-20251118
  Type: fix
  Description: fix wiki editor crash
  Base: main

✓ Branch created and checked out

[... I fix the bug ...]

Commit 1/3: fix: Add null check in wiki editor ✓
Commit 2/3: test: Add test for null case ✓
Commit 3/3: docs: Update FixRecord.md ✓

=== Completing Feature ===
Branch: fix/permahub-wiki-editor-crash-20251118
Target: main
Merge preference: direct

Running pre-merge tests...

=== Running Tests ===
Type: unit

✓ Tests passed

=== Running Tests ===
Type: regression

✓ Tests passed

Tests passed. Proceeding with merge...

Switching to main...
Pulling latest from remote...
Merging fix/permahub-wiki-editor-crash-20251118 into main (no-ff)...

✓ Merge successful
✓ Branch deleted

Syncing to GitHub...
✓ Pushed to origin/main

Fix complete!
```

### Example 3: Tests Fail

**Agent:**
```
Commit 1/2: feat: Add payment processing ✓
Commit 2/2: test: Add payment tests ✓

=== Completing Feature ===

Running pre-merge tests...

=== Running Tests ===
Type: unit

Running: npm test

❌ 2 tests failed:
  - payment.test.js: Invalid API key
  - payment.test.js: Timeout on webhook

✗ Unit tests failed. Cannot merge.

Branch: feature/permahub-payment-processing-20251118
Status: NOT MERGED

Please fix failing tests and try again:
  ./scripts/git-agents.sh complete-feature

I'll stay on this branch for you to debug.
```

---

## 📝 CLI Commands

### Branch Commands

```bash
# Create feature branch (automatic when work starts)
./scripts/git-agents.sh create-branch <type> "<description>"

# Examples:
./scripts/git-agents.sh create-branch feature "user authentication"
./scripts/git-agents.sh create-branch fix "wiki editor crash"

# Complete feature (merge or PR)
./scripts/git-agents.sh complete-feature

# Set merge preference
./scripts/git-agents.sh set-merge-preference [pr|direct]

# Show current branch status
./scripts/git-agents.sh branch-status

# List feature branches
./scripts/git-agents.sh list-branches
```

---

## 🏗️ Integration with Other Agents

### Commit Agent Integration

**Branch agent + Commit agent work together:**

```
1. Branch agent: Creates feature branch
2. Commit agent: Validates incremental commits (max 2 files)
3. Commit agent: Enforces conventional commits
4. Branch agent: Runs tests before merge
5. Branch agent: Creates PR or merges
```

**Example:**
```
Branch: feature/permahub-user-auth-20251118

Commits on this branch:
  feat: Add auth schema           (1 file) ✓
  feat: Add auth service          (2 files) ✓
  feat: Add auth middleware       (1 file) ✓
  test: Add auth tests            (2 files) ✓

All commits atomic ✓
All tests pass ✓
Ready to merge ✓
```

### Sync Agent Integration

**After merge, sync agent handles push:**

```
Branch merged to main
         ↓
Sync agent detects unpushed commits
         ↓
Waits for idle period (or immediate if configured)
         ↓
Pushes to GitHub
         ↓
Done!
```

---

## 🎓 Best Practices

### 1. One Feature = One Branch

**✅ Good:**
```
Branch: feature/permahub-user-auth-20251118
- Add auth schema
- Add auth service
- Add auth routes
- Add tests
```

**❌ Bad:**
```
Branch: feature/permahub-misc-changes-20251118
- Add auth
- Fix wiki bug
- Update docs
- Refactor database
```

### 2. Always Create Tests

**Before merge, ensure:**
- [x] Unit tests for new code
- [x] Regression tests updated
- [x] All tests pass
- [x] Test coverage maintained

### 3. Descriptive Branch Names

**✅ Good:**
```
feature/permahub-oauth-google-integration-20251118
fix/permahub-memory-leak-in-api-handler-20251118
```

**❌ Bad:**
```
feature/permahub-stuff-20251118
fix/permahub-bug-20251118
```

### 4. Use PR for Team Projects

**Solo dev:** Direct merge is fine
**Team:** Always use PR for code review

### 5. Keep Branches Short-Lived

**Target:** Merge within 1-2 days
**Max:** 1 week before merge

Long-lived branches = merge conflicts

---

## 🔧 Troubleshooting

### Issue 1: Tests Failing

**Problem:** Can't merge because tests fail

**Solution:**
```bash
# Stay on feature branch
# Fix the failing tests
# Run tests locally
npm test

# Try merge again
./scripts/git-agents.sh complete-feature
```

### Issue 2: Branch Name Too Long

**Problem:** Branch name exceeds 60 chars

**Solution:**
Shorten description when creating:
```bash
# Instead of:
"implement user authentication with email password and oauth"

# Use:
"user authentication"
```

### Issue 3: Merge Conflicts

**Problem:** Can't merge due to conflicts

**Solution:**
```bash
# Update from main
git checkout main
git pull origin main

# Rebase feature branch
git checkout feature/your-branch
git rebase main

# Resolve conflicts
# ... edit files ...

git add .
git rebase --continue

# Try merge again
./scripts/git-agents.sh complete-feature
```

### Issue 4: No Tests Yet in Project

**Problem:** Project doesn't have test infrastructure

**Solution:**
Temporarily disable test requirement:
```json
{
  "branchManagement": {
    "testing": {
      "requireBeforeMerge": false
    }
  }
}
```

Then set up testing:
```bash
npm install --save-dev jest
# Create test files
# Re-enable: "requireBeforeMerge": true
```

---

## 📊 Benefits Summary

| Feature | Benefit |
|---------|---------|
| **Auto branch creation** | Never forget to create branch |
| **Descriptive names** | Easy to understand what branch does |
| **Includes repo name** | Clear which project in multi-repo setup |
| **Includes date** | Know when branch was created |
| **Test enforcement** | No untested code merged |
| **PR by default** | Code review built-in |
| **No-ff merge** | Complete history preserved |
| **Configurable** | Adapt to team or solo workflow |

---

## 🚀 Getting Started

**1. Enable branch management:**

Already enabled in default config!

**2. Set your preference:**

```bash
./scripts/git-agents.sh set-merge-preference pr
```

**3. Start working:**

```
You: "Add new feature"
Agent: Creates branch automatically
Agent: Guides you through work
Agent: Creates PR when done
```

**4. That's it!**

The agent handles everything else.

---

## 📖 Related Documentation

- **Full Guide:** `.claude/agents/README.md`
- **Multi-Repo Setup:** `.claude/agents/MULTI_REPO_GUIDE.md`
- **Configuration:** `.claude/agents/config.json`
- **Quick Reference:** `.claude/agents/QUICKREF.md`

---

**Version:** 1.0.0
**Author:** Libor Ballaty <libor@arionetworks.com>
**Last Updated:** 2025-11-18
**Status:** Production Ready
