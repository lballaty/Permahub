# Agent Enforcement Strategy

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/testing/AGENT_ENFORCEMENT_STRATEGY.md`

**Description:** Complete system for ensuring AI agents follow the testing strategy documents

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-22

**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Three-Layer Enforcement System](#three-layer-enforcement-system)
4. [Layer 1: Agent Instructions](#layer-1-agent-instructions)
5. [Layer 2: Pre-Commit Hook](#layer-2-pre-commit-hook)
6. [Layer 3: Manual Review](#layer-3-manual-review)
7. [Setup Instructions](#setup-instructions)
8. [Usage Guide](#usage-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### The Problem

Without enforcement, agents might:
- ❌ Create tests without user approval
- ❌ Commit failing tests
- ❌ Skip cleanup in test data
- ❌ Hardcode credentials
- ❌ Create flaky/unreliable tests
- ❌ Ignore testing strategy documents

### The Solution

A **three-layer enforcement system** that:

1. **Layer 1 (Instructions)** - Agent system prompt that agents MUST follow
2. **Layer 2 (Automation)** - Pre-commit hook that validates compliance
3. **Layer 3 (Review)** - Manual user review of compliance

Together, these layers ensure agents consistently follow the testing strategy.

---

## How It Works

### Simplified Flow

```
┌─────────────────────────────────────────┐
│ User Interacts with Agent               │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ LAYER 1: Agent Reads System Prompt      │
│                                         │
│ Agent must:                             │
│ - Read AGENT_TESTING_RULES.md           │
│ - Read TESTING_STRATEGY docs            │
│ - Understand mandatory workflow         │
│ - Acknowledge rules before proceeding   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Agent Does Code Work                    │
│                                         │
│ While doing work:                       │
│ - Creates tests BEFORE implementation   │
│ - Asks user for approvals               │
│ - Runs tests before committing          │
│ - Updates FixRecord.md                  │
│ - Documents all changes                 │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ LAYER 2: Pre-Commit Hook Validation     │
│                                         │
│ Hook checks:                            │
│ - Tests actually run successfully       │
│ - No hardcoded credentials              │
│ - Test isolation verified               │
│ - Cleanup hooks present                 │
│ - FixRecord.md updated                  │
│ - Documentation complete                │
│                                         │
│ Result:                                 │
│ ✅ PASS → Commit allowed                │
│ ❌ FAIL → Commit blocked (can override) │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ LAYER 3: Manual Review                  │
│                                         │
│ User verifies:                          │
│ - Tests make sense                      │
│ - Feature works correctly                │
│ - No regressions introduced             │
│ - Commit message is clear               │
│ - FixRecord.md is accurate              │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Commit Pushed to GitHub                 │
└─────────────────────────────────────────┘
```

---

## Three-Layer Enforcement System

### Layer 1: Agent Instructions

**File:** `/.claude/agents/agent-system-prompt.md`

**What it does:**
- Agents read this document BEFORE starting any code work
- Contains mandatory rules and workflow steps
- References all testing strategy documents
- Defines consequences of breaking rules

**Key sections:**
- Rule #1: Human Authority Override
- Rule #2: Tests Come First
- Rule #3: Mandatory Checks Before Any Test
- Rule #4: Forbidden Practices
- Rule #5: Test Execution Protocol
- Rule #6: Error Reporting Format
- Rule #7: Documentation Requirements
- Rule #8: Commit Requirements
- Rule #9: When to Escalate

**How to use:**
```
1. Copy the Agent Instructions section
2. Paste into conversation with agent
3. Agent reads and acknowledges
4. Agent follows rules for entire session
```

### Layer 2: Pre-Commit Hook

**File:** `/.githooks/validate-test-compliance.sh`

**What it does:**
- Runs automatically before each commit
- Validates 7 key compliance checks
- Blocks commits that violate critical rules
- Warns about issues that should be fixed
- Allows override with user confirmation

**The 7 Checks:**

```
CHECK 1: Tests Are Functional
  - Verifies all tests in commit actually run and pass
  - Blocks commit if tests fail

CHECK 2: No Hardcoded Credentials
  - Scans for password/secret patterns in code
  - Prevents accidental credential leaks
  - Blocks if credentials found

CHECK 3: Test Isolation
  - Checks for global state modifications
  - Warns if tests might interfere with each other
  - Allows override with warning

CHECK 4: Test Cleanup
  - Verifies afterEach/afterAll cleanup hooks
  - Warns if test data might persist
  - Allows override with warning

CHECK 5: FixRecord.md Updated
  - Ensures documentation is maintained
  - Warns if code changes without FixRecord update
  - Allows override with warning

CHECK 6: Test Documentation
  - Checks for file headers and JSDoc comments
  - Warns if documentation is missing
  - Allows override with warning

CHECK 7: Test Tags
  - Verifies tests have proper tags (@unit, @integration, @e2e)
  - Warns if tags are missing
  - Allows override with warning
```

**How to use:**
```bash
# Happens automatically
git commit -m "feat: Add new feature"

# Hook runs → checks compliance
# If violations → commit blocked
# If warnings → asks to continue
# If passes → commit allowed
```

### Layer 3: Manual Review

**What you do:**
- Review the code changes
- Verify tests make sense
- Ensure no regressions
- Check FixRecord.md is accurate
- Approve before merge

**Questions to ask:**
- Do the tests match the feature?
- Are all edge cases covered?
- Will these tests catch regressions?
- Is the documentation clear?
- Does the code follow project standards?

---

## Layer 1: Agent Instructions

### Setup

**Step 1: Save the system prompt**

The system prompt is already created at:
```
/.claude/agents/agent-system-prompt.md
```

**Step 2: Use with every agent interaction**

Every time you use an agent for code work:

1. Read the system prompt file
2. Copy the "Agent Instructions" section
3. Paste it into your conversation with the agent
4. Wait for agent to acknowledge
5. Proceed with code tasks

**Step 3: Agent acknowledges**

Look for agent response like:

```
I've read and understood the Agent System Prompt for Permahub.
I acknowledge that I must:
✅ Follow the mandatory testing workflow
✅ Ask for approval before creating tests
✅ Run tests before committing
✅ Update FixRecord.md
✅ Report errors clearly
✅ Escalate when stuck

I'm ready to proceed. What code task would you like me to help with?
```

**Don't proceed** unless the agent explicitly acknowledges the rules.

### Key Rules Agents Must Follow

#### Rule: Test Before Implementation

```javascript
// CORRECT WORKFLOW
Agent: "I'll create tests for this feature. Here's what will be tested:"
(Shows test names and behaviors)

User: "Approved"

Agent: "Creating tests... (tests fail - RED)"
Agent: "Implementing feature..."
Agent: "Running tests... (tests pass - GREEN)"
Agent: "Committing everything"

// WRONG WORKFLOW
Agent: "Implementing feature now..."
(No tests created)
Agent: "Here are the tests" (after implementation)
```

#### Rule: Ask Before Creating Tests

```javascript
// CORRECT
Agent: "User wants to add dark mode.
I'll create tests first. Should I:
- Test toggle button exists?
- Test theme applies to all components?
- Test preference persists?"

User: "Yes, all three. Also add mobile test."

Agent: "Creating tests..."

// WRONG
Agent: "Creating dark mode tests..."
(Doesn't ask, surprises user with implementation)
```

#### Rule: Never Hardcode Credentials

```javascript
// WRONG ❌
test('user can login', async () => {
  await page.fill('input[type=email]', 'test@example.com');
  await page.fill('input[type=password]', 'MyPassword123!');
});

// RIGHT ✅
import { testUser } from '../fixtures/test-users.js';

test('user can login', async () => {
  await page.fill('input[type=email]', testUser.email);
  await page.fill('input[type=password]', testUser.password);
});
```

#### Rule: Always Run Tests Before Committing

```bash
# Agent MUST do this before committing
npx playwright test tests/e2e/critical/auth-workflow.spec.js

# Verify output shows: ✓ X passed

# Only then:
git add .
git commit -m "..."
```

---

## Layer 2: Pre-Commit Hook

### Setup

**Step 1: Hook is already installed**

The hook file exists at:
```
/.githooks/validate-test-compliance.sh
```

It's already executable (chmod +x).

**Step 2: Verify it runs**

Test it by creating a test commit:

```bash
# Create a test file
echo "test('example', () => {});" > tests/test.spec.js

# Try to commit
git add tests/test.spec.js
git commit -m "test: Example test"

# You should see:
# 🧪 Running Test Strategy Compliance Checks...
# [CHECK 1] Verifying tests are functional...
```

**Step 3: Hook will block violations**

When hook finds violations:

```
❌ COMMIT BLOCKED: 1 critical violation(s)

Fix the issues above and try again.

Override and commit anyway? (y/N):
```

You can:
- **N** (default): Fix the issue and retry
- **y**: Override and commit anyway (hook logs the violation)

### How the Hook Works

The hook runs **7 automatic checks**:

#### Check 1: Tests Are Functional

```bash
# Hook runs your test
npx playwright test tests/e2e/critical/auth-workflow.spec.js

# If test fails → BLOCKS COMMIT
# If test passes → continues to next check
```

#### Check 2: No Hardcoded Credentials

```bash
# Hook searches for password patterns
grep -E "password\s*=\s*['\"]" tests/e2e/auth.spec.js

# If found → BLOCKS COMMIT
# If not found → continues
```

#### Check 3: Test Isolation

```bash
# Hook checks for shared state
grep "window\.[a-zA-Z]|global\.[a-zA-Z]" tests/e2e/auth.spec.js

# If found → WARNS (allows override)
# If not found → continues
```

#### Check 4: Test Cleanup

```bash
# Hook checks for afterEach/afterAll hooks
grep "afterEach|afterAll" tests/e2e/editor.spec.js

# If test modifies data but no cleanup → WARNS
# If cleanup present → continues
```

#### Check 5: FixRecord.md Updated

```bash
# Hook checks if FixRecord.md was changed
git diff --cached --name-only | grep FixRecord.md

# If code changed but no FixRecord → WARNS
# If FixRecord updated → continues
```

#### Check 6: Documentation Present

```bash
# Hook checks for file header comments
head -20 tests/e2e/auth.spec.js | grep "File:|Description:|Purpose:"

# If missing → WARNS
# If present → continues
```

#### Check 7: Tags Present

```bash
# Hook checks for @unit, @integration, or @e2e tags
grep "@unit|@integration|@e2e" tests/e2e/auth.spec.js

# If missing → WARNS
# If present → continues
```

### Hook Behavior Summary

```
CRITICAL VIOLATIONS (Blocks commit):
  ❌ Tests don't run/fail
  ❌ Hardcoded credentials found

WARNINGS (Allows with confirmation):
  ⚠️ Test isolation issues
  ⚠️ Missing cleanup hooks
  ⚠️ FixRecord.md not updated
  ⚠️ Documentation missing
  ⚠️ Tags missing

If all pass:
  ✅ Commit allowed automatically
```

---

## Layer 3: Manual Review

### What You Review

After agent commits, review:

**1. Test Logic**
```javascript
// Do the tests match the feature?
test('dark mode toggle shows/hides', async () => {
  // Does this test the feature correctly?
});
```

**2. Feature Implementation**
```javascript
// Does the implementation match what tests expect?
function toggleDarkMode() {
  // Is this correct and complete?
}
```

**3. FixRecord.md Entry**
```markdown
### 2025-11-22 - Add Dark Mode Feature

Issue: Users requested dark mode
Solution: Added toggle button and localStorage persistence
Files: src/theme.js, tests/features/dark-mode.spec.js

✓ Is this accurate?
✓ Does it match the code changes?
```

**4. Commit Message**
```bash
# Is the message clear about why this was done?
git log -1

# Output should show what and why
feat: Add dark mode toggle with persistence

- Users can toggle dark mode in settings
- Theme preference saved to localStorage
- All components respect theme setting
```

**5. No Regressions**
```bash
# Do existing tests still pass?
npm run test:critical
npm run test:smoke

# Any new failures?
```

### Review Checklist

```markdown
Test Review:
  ☐ Tests match the feature description
  ☐ All edge cases covered
  ☐ Tests fail initially (red)
  ☐ Tests pass with implementation (green)
  ☐ Proper tags used (@unit, @integration, @e2e)
  ☐ No hardcoded credentials
  ☐ Cleanup hooks present
  ☐ Test isolation verified

Code Review:
  ☐ Implementation matches tests
  ☐ Code is clean and maintainable
  ☐ JSDoc comments present
  ☐ No console.log debugging left
  ☐ Follows project standards

Documentation Review:
  ☐ FixRecord.md is accurate
  ☐ Commit message is clear
  ☐ Links to related issues
  ☐ Explains the "why"

Quality Review:
  ☐ No new failures in npm run test:critical
  ☐ No new failures in npm run test:smoke
  ☐ No console errors or warnings
```

---

## Setup Instructions

### Installation Checklist

```bash
# 1. Verify system prompt exists
ls -la .claude/agents/agent-system-prompt.md
# Should show file exists

# 2. Verify hook exists and is executable
ls -la .githooks/validate-test-compliance.sh
# Should show: -rwxr-xr-x

# 3. Verify hook is installed in git
cat .git/hooks/pre-commit | grep validate-test-compliance
# Should show the hook is installed

# 4. Verify testing documents exist
ls -la docs/testing/AGENT_TESTING_RULES.md
ls -la docs/testing/TESTING_REQUIREMENTS.md
ls -la docs/testing/TESTING_ARCHITECTURE.md
ls -la docs/testing/TESTING_IMPLEMENTATION.md

# All should exist
```

### Install the Pre-Commit Hook

The hook might already be installed, but verify:

```bash
# Check if hook is installed
if grep -q "validate-test-compliance" .git/hooks/pre-commit; then
  echo "✓ Hook already installed"
else
  echo "⚠ Hook not installed, installing now..."

  # Add to pre-commit hook
  cat >> .git/hooks/pre-commit << 'EOF'

# Test Compliance Validation
if [ -f .githooks/validate-test-compliance.sh ]; then
  bash .githooks/validate-test-compliance.sh
  if [ $? -ne 0 ]; then
    exit 1
  fi
fi
EOF

  chmod +x .git/hooks/pre-commit
  echo "✓ Hook installed"
fi
```

---

## Usage Guide

### For Users (When Working with Agents)

**Step 1: Prepare for agent interaction**

```bash
# Make sure dev server is ready
npm run dev
# Or use: ./start.sh
```

**Step 2: Provide agent with system prompt**

```
I need you to help with [code task].

Before you start, here's the system prompt you must follow:
[COPY PASTE from .claude/agents/agent-system-prompt.md]

Do you understand and acknowledge these rules?
```

**Step 3: Wait for acknowledgment**

The agent should respond with something like:

```
✅ I've read and understood the testing requirements.
I will:
- Ask for approval before creating tests
- Run tests before committing
- Update FixRecord.md
- Document all changes

I'm ready to proceed. What would you like me to do?
```

**Step 4: Proceed with task**

```
Create a dark mode feature with:
- Toggle button in header
- Preference persists
- All components respect theme
```

**Step 5: Review before merge**

```
Agent created commit. Let me review:
- Tests look good ✓
- Implementation correct ✓
- FixRecord updated ✓
- Ready to merge ✓
```

### For Agents (Enforced by This System)

The agent will see clear requirements:

1. **Read all testing documents** - Must do before any code work
2. **Ask for approval** - Cannot create tests without user approval
3. **Run tests first** - Create RED tests before implementation
4. **Update FixRecord.md** - Must document all changes
5. **Pre-commit hook validation** - Automatic compliance checks
6. **Manual review** - User reviews all changes

### Example: Adding a Feature

```
User: "Add a search feature"

Agent: "I'll create a search feature with tests. Here's what I'll test:
  1. User can enter search query
  2. Results display matching items
  3. No results shows empty state message
  4. Search works on mobile

Should I proceed?"

User: "Yes, and also test keyboard shortcuts"

Agent: "Adding test for keyboard shortcut. Creating tests (RED)...
  [Tests fail - feature not implemented yet]

Implementing feature...

Running tests (GREEN)...
  [All tests pass]

Updating FixRecord.md...

Committing..."

[Hook runs validation]

User: "Reviewing changes..."
  • Tests make sense ✓
  • Code works correctly ✓
  • FixRecord is clear ✓

Ready to merge!
```

---

## Troubleshooting

### Problem: Hook runs but doesn't validate anything

**Cause:** Hook isn't integrated with git

**Fix:**
```bash
# Reinstall hook
if [ -f .git/hooks/pre-commit ]; then
  rm .git/hooks/pre-commit
fi

# Create new hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
if [ -f .githooks/validate-test-compliance.sh ]; then
  bash .githooks/validate-test-compliance.sh
fi
EOF

chmod +x .git/hooks/pre-commit

# Test it
git commit -m "test"
```

### Problem: Hook gives false positives (blocks valid tests)

**Cause:** Hook might be too strict

**Solution:**

Review the specific check that's failing:

```bash
# If check is wrong, override with:
git commit -m "feat: Add feature" --no-verify

# But this should be rare - hook is designed to be helpful
# Report the false positive so we can fix it
```

### Problem: Agent isn't following rules

**Cause:** Agent didn't read or misunderstood the system prompt

**Fix:**

```
Agent, I notice you [specific violation].

Please re-read:
- .claude/agents/agent-system-prompt.md
- docs/testing/AGENT_TESTING_RULES.md

Specifically review: [Section name]

Can you confirm you understand the rule before continuing?
```

### Problem: Pre-commit hook is too slow

**Cause:** Tests take too long to validate

**Solution:**

The hook runs actual tests before committing. This is intentional.

Options:
1. Run `npm run test:smoke` separately first (faster)
2. Create only smoke/critical tests for CI (faster)
3. Override with `--no-verify` if tests are already passing

### Problem: Tests pass locally but hook says they fail

**Cause:** Dev server not running or different environment

**Fix:**

```bash
# Make sure dev server is running
npm run dev
# or
./start.sh

# Try commit again
git commit -m "..."
```

---

## Metrics: Is the System Working?

Track these metrics to see if enforcement is effective:

**Monthly Tracking:**

```markdown
### Test Strategy Compliance Metrics

**Commits with tests:** X out of Y (goal: 100%)
**FixRecord.md updated:** X out of Y (goal: 100%)
**Hook violations blocked:** X (goal: trending down)
**Tests passing rate:** X% (goal: > 95%)
**Test failure root cause:**
  - Environment issues: X
  - Real bugs: X
  - Test flakiness: X

**Agent compliance:**
- Requested approval before creating: X%
- Ran tests before committing: X%
- Updated FixRecord.md: X%
- All tests passing on commit: X%
```

---

## Summary: The Three Layers

| Layer | Tool | When | What | Enforcement |
|-------|------|------|------|------------|
| **1** | Agent System Prompt | Before every task | Instructions agent must follow | Agent acknowledges |
| **2** | Pre-Commit Hook | Before every commit | Automated validation | Blocks or warns |
| **3** | Manual Review | Before merge | Human verification | User approval |

Together, these ensure consistent, high-quality test creation and maintenance.

---

## Related Documents

- [AGENT_TESTING_RULES.md](AGENT_TESTING_RULES.md) - Detailed rules (for agents)
- [TESTING_REQUIREMENTS.md](TESTING_REQUIREMENTS.md) - What to test (for agents)
- [TESTING_ARCHITECTURE.md](TESTING_ARCHITECTURE.md) - How to design (for agents)
- [TESTING_IMPLEMENTATION.md](TESTING_IMPLEMENTATION.md) - How to implement (for agents)
- [Agent System Prompt](/.claude/agents/agent-system-prompt.md) - Copy-paste instructions

---

**Last Updated:** 2025-11-22

**Status:** Active - Three-layer enforcement system in place

**Questions?** Review the related documents or ask the team.
