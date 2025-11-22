# Agent Testing Rules & Instructions

**File:** `/docs/testing/AGENT_TESTING_RULES.md`

**Description:** Strict rules and procedures that AI agents MUST follow when creating, running, and managing tests

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-22

**Version:** 1.0

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Test Creation Workflow](#test-creation-workflow)
3. [Mandatory Checks](#mandatory-checks)
4. [Forbidden Practices](#forbidden-practices)
5. [Test Execution Protocol](#test-execution-protocol)
6. [Error Handling](#error-handling)
7. [Documentation Requirements](#documentation-requirements)
8. [Commit Requirements](#commit-requirements)
9. [Escalation Procedures](#escalation-procedures)

---

## Core Principles

### 1. **Human Authority Override**

Agents work **under human oversight**. A human user must:
- ✅ Request test creation (explicitly)
- ✅ Review test logic before implementation
- ✅ Approve test behavior
- ✅ Approve commits containing tests

**Exception**: Agents may create tests for bugs AFTER the user describes the bug and acknowledges test creation.

### 2. **Tests Before Implementation**

When creating a new feature:

```
User: "Add dark mode feature"
  ↓
Agent: "I'll create tests first. Review these test cases:"
  (Show test names and expected behaviors)
  ↓
User: "Approved" OR "Modify these tests"
  ↓
Agent: "Creating tests that fail (red tests)"
  ↓
Agent: "Implementing feature to pass tests"
  ↓
Agent: "Tests now pass (green tests)"
  ↓
Agent: "Committing feature + tests"
```

**NOT** like this:
```
User: "Add dark mode"
Agent: (quietly creates tests after implementation)
Agent: (commits without asking)
```

### 3. **No Silent Failures**

If anything fails, agent MUST:
- 🛑 Stop immediately
- 🔴 Report error clearly
- 📝 Show diagnostics
- ❓ Ask what to do next

**Never** commit incomplete work or skip test failures.

### 4. **Accountability Through Documentation**

Every test creation MUST be documented:
- Test file created ✓
- Test logic explained ✓
- FixRecord.md updated ✓
- Commits reference tests ✓

---

## Test Creation Workflow

### MANDATORY WORKFLOW (Non-negotiable)

```
┌────────────────────────────────────────┐
│ STEP 1: User Requests Feature/Fix      │
├────────────────────────────────────────┤
│ User says: "Add feature X" OR          │
│ "Fix bug Y"                            │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 2: Agent Asks for Approval        │
├────────────────────────────────────────┤
│ Agent shows:                           │
│ - Tests that will be created           │
│ - Expected test behaviors              │
│ - Files that will be modified          │
│                                        │
│ Agent asks: "Create these tests?"      │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 3: User Approves OR Modifies      │
├────────────────────────────────────────┤
│ User: "Approved" OR                    │
│ "Add test for X" OR                    │
│ "Remove test for Y"                    │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 4: Agent Creates Tests (Red)      │
├────────────────────────────────────────┤
│ - Uses template                        │
│ - Fills in specifics                   │
│ - Tests FAIL (not implemented yet)     │
│ - Shows test output                    │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 5: Agent Implements Feature       │
├────────────────────────────────────────┤
│ - Writes code to pass tests            │
│ - No scope creep                       │
│ - Focused on one feature               │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 6: Run Tests Locally (Green)      │
├────────────────────────────────────────┤
│ Agent runs: npm run test:smoke          │
│            npm run test:critical        │
│                                        │
│ All must pass ✓                        │
│ If any fail: GO BACK TO STEP 5         │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 7: Update FixRecord.md            │
├────────────────────────────────────────┤
│ Add entry:                             │
│ - Issue description                    │
│ - Root cause (if fix)                  │
│ - Solution                             │
│ - Files changed                        │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 8: Commit Code + Tests + Docs     │
├────────────────────────────────────────┤
│ Agent stages:                          │
│ - tests/[feature].spec.js              │
│ - src/[feature].js                     │
│ - FixRecord.md                         │
│                                        │
│ Agent commits with message showing:    │
│ - What was done                        │
│ - Why tests were created               │
│ - Which issues fixed                   │
└─────────────────┬──────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│ STEP 9: Run Pre-Push Hook Tests        │
├────────────────────────────────────────┤
│ npm run test:critical                  │
│                                        │
│ If pass: Ready to push ✓               │
│ If fail: GO BACK TO STEP 5             │
└────────────────────────────────────────┘
```

**Every step is mandatory. Cannot skip.**

---

## Mandatory Checks

### Check #1: Feature Actually Exists

Before creating tests for a feature, agent MUST:

```javascript
// ✅ GOOD - Verify first
"I need to create tests for the search feature.
Let me verify it exists by:
1. Reading src/features/search/search.js
2. Checking search appears in UI files
3. Finding existing search functionality"

// ❌ BAD - Assume without checking
"I'll create tests for the search feature"
(But search doesn't exist yet!)
```

**Implementation**:
```
When user says: "Create test for feature X"

Agent must:
1. Search codebase: grep -r "feature-x"
2. Find related files
3. Report: "Found feature in: [files]"
4. Then: "Ready to create tests. Show them?"

If NOT found:
1. Report: "I cannot find feature X in codebase"
2. Ask: "Should I create tests for new feature?"
3. Wait for approval before proceeding
```

### Check #2: Test Doesn't Already Exist

Before creating test, agent MUST:

```javascript
// ✅ GOOD - Check for existing tests
"I'll check if tests already exist...
grep -r "dark mode" tests/
Result: tests/features/theme/dark-mode.spec.js exists

This test already exists. Should I:
- Update it?
- Add more tests?
- Skip test creation?"

// ❌ BAD - Create duplicate
"Creating dark mode tests..."
(Doesn't realize tests already exist)
```

**Implementation**:
```bash
# Agent must run before creating any test:
grep -r "[feature-name]" tests/

# If found: Report and ask user what to do
# If not found: Proceed with creation
```

### Check #3: Selector Verification

For UI tests, agent MUST verify selectors exist:

```javascript
// ✅ GOOD - Verify selector works
"Test will use selector: .search-results .card
Let me verify this exists in wiki-home.html...
✓ Found: class="search-results"
✓ Found: class="card"
✓ Ready to use selector"

// ❌ BAD - Hardcode selector without verification
test('search works', async () => {
  await expect(page.locator('.search-results .card')).toBeVisible();
  // Selector might not exist!
})
```

**Implementation**:
```javascript
// Before writing UI test, run:
const selectors = [
  '.search-results',
  '.search-results .card',
  'button:has-text("Search")',
];

for (const selector of selectors) {
  const exists = await page.locator(selector).isVisible();
  console.log(`${selector}: ${exists ? '✓' : '❌'}`);
}

// Only create test if selectors exist
```

### Check #4: Test Passes When Feature Works

Agent MUST verify:
- ✓ Test FAILS before feature is implemented
- ✓ Test PASSES after feature is implemented

```javascript
// ✅ GOOD
Agent: "Creating test (red - should fail)"
Output: Test FAILS ✓

Agent: "Implementing feature"

Agent: "Running test (green - should pass)"
Output: Test PASSES ✓

// ❌ BAD
Agent: "Creating test"
Test: PASSES immediately??
This means test is broken or feature already exists!
```

**Implementation**:
```
1. Create test from template
2. Run test: npx playwright test [test-name]
3. Verify FAILS with: "Expected element not found" (or similar)
4. If test PASSES unexpectedly:
   Report: "⚠️ Test passed without implementation"
   Action: Review test logic
   Ask user: "Is this test correct?"
5. Implement feature
6. Run test again
7. Verify PASSES with: "1 passed"
```

### Check #5: No Hardcoded Credentials

Agent MUST NEVER hardcode credentials in test code:

```javascript
// ❌ FORBIDDEN - Credentials in code
test('user can login', async () => {
  await page.locator('input[type="email"]').fill('test@example.com');
  await page.locator('input[type="password"]').fill('MySecretPassword123!');
});

// ✅ REQUIRED - Use environment variables
import { testUser } from '../fixtures/test-users.js';

test('user can login', async () => {
  await page.locator('input[type="email"]').fill(testUser.email);
  await page.locator('input[type="password"]').fill(testUser.password);
});
```

**Implementation**:
- Agent must check all test code
- Flag any hardcoded secrets with 🚨
- Replace with environment variable references
- Never commit test with credentials

### Check #6: Test Data Cleanup

Agent MUST verify cleanup in every test:

```javascript
// ❌ FORBIDDEN - No cleanup
test('create project', async () => {
  const project = await createTestProject({
    title: 'Test Project'
  });

  // Test it...
  // Forgot to cleanup!
});

// ✅ REQUIRED - Always cleanup
test('create project', async () => {
  const project = await createTestProject({
    title: 'Test Project'
  });

  // Test it...

  // Cleanup
  afterEach(async () => {
    await deleteTestProject(project.id);
  });
});
```

**Implementation**:
```
Before committing test, agent must:
1. Check for afterEach() or afterAll() hooks
2. Verify cleanup calls appropriate functions
3. Report: "✓ Cleanup verified" OR "❌ Missing cleanup"
4. Fix before committing
```

### Check #7: Test Isolation

Agent MUST verify tests don't depend on each other:

```javascript
// ❌ FORBIDDEN - Test depends on another test
test('create project', async () => {
  const project = await createProject();
  window.lastProject = project; // Shared state
});

test('edit project', async () => {
  const project = window.lastProject; // Depends on previous test!
});

// ✅ REQUIRED - Each test independent
test('create project', async () => {
  const project = await createProject();
  // Test in isolation
});

test('edit project', async () => {
  const project = await createProject(); // Creates own data
  // Test in isolation
});
```

**Implementation**:
```
Agent must:
1. Review test file
2. Check each test is independent
3. Look for shared global state
4. Look for file dependencies between tests
5. Report: "✓ Tests are isolated" OR "❌ Found dependencies"
6. Fix before committing
```

---

## Forbidden Practices

### ❌ NEVER: Commit Tests Without Running Them

```javascript
// FORBIDDEN
Agent: "Created auth-workflow.spec.js"
Agent: "Committing..."
// Never actually ran the test!
```

**REQUIRED**:
```bash
# Agent must run EVERY time before commit
npx playwright test tests/e2e/critical/auth-workflow.spec.js

# Verify output shows:
# ✓ X passed
# OR understand why they failed and fix
```

### ❌ NEVER: Ignore Test Failures

```javascript
// FORBIDDEN
Test output: "❌ Test failed - Expected: visible, Got: timeout"
Agent: "I'll commit anyway"
```

**REQUIRED**:
```
If test fails:
1. STOP immediately
2. Report error clearly
3. Show diagnostic info
4. Ask: "What should I do?"
5. Don't proceed until fixed
```

### ❌ NEVER: Create Flaky Tests

```javascript
// ❌ FORBIDDEN - Flaky (passes/fails randomly)
test('search works', async () => {
  await page.waitForTimeout(1000); // Magic number
  await expect(page.locator('.results')).toBeVisible();
});

// ✅ REQUIRED - Stable
test('search works', async () => {
  await expect(page.locator('.results')).toBeVisible();
  // Waits until element is visible, no magic timeouts
});
```

### ❌ NEVER: Create Tests That Modify Production

```javascript
// ❌ FORBIDDEN
test('create user', async () => {
  await api.post('/users', { email: 'real@user.com' });
  // Actually creates user in production!
});

// ✅ REQUIRED
test('create user', async () => {
  await api.post('/users', { email: 'test@example.com' });
  // Uses test environment/email

  afterEach(async () => {
    await deleteTestUser('test@example.com');
  });
});
```

### ❌ NEVER: Skip Cleanup

```javascript
// ❌ FORBIDDEN
test('create project', async () => {
  const project = await createProject();
  // Create passes, but don't cleanup
});

// ✅ REQUIRED
test('create project', async () => {
  const project = await createProject();

  afterEach(async () => {
    await deleteProject(project.id);
  });
});
```

### ❌ NEVER: Commit Without FixRecord.md

```javascript
// ❌ FORBIDDEN
Agent: (modifies tests)
Agent: git commit -m "Update tests"
Agent: git push
// Never updated FixRecord.md!

// ✅ REQUIRED
Agent: (modifies tests)
Agent: (updates FixRecord.md with entry)
Agent: git add tests/... FixRecord.md
Agent: git commit -m "Update tests"
Agent: git push
```

### ❌ NEVER: Create Tests for Features That Don't Exist

```javascript
// ❌ FORBIDDEN
Agent: "Create test for dark mode"
Agent: (Creates test)
Agent: (Dark mode feature doesn't exist yet)
Agent: (Commits failing test)

// ✅ REQUIRED
Agent: "Create test for dark mode"
Agent: grep -r "dark mode" src/
Agent: "❌ Dark mode feature not found"
Agent: "Create new dark mode feature first?"
Agent: (Wait for user response)
```

---

## Test Execution Protocol

### When Agent Runs Tests

Agent MUST follow this protocol EVERY TIME:

```
1. BEFORE running tests:
   ├─ Verify dev server is running
   └─ Verify database is accessible

2. SELECT tests to run:
   ├─ Running feature test? Run just that test
   ├─ Before commit? Run npm run test:critical
   └─ Before push? Run full suite

3. RUN tests:
   └─ npm run test:smoke
      npm run test:critical
      npx playwright test [specific-test]

4. ANALYZE results:
   ├─ Count passes: ✓ X passed
   ├─ Count failures: ❌ Y failed
   └─ Note flaky tests: ⚠️ Z flaky

5. REPORT findings:
   ├─ Show summary
   ├─ Show failed test names
   ├─ Show error messages
   └─ Show artifacts if available

6. DECIDE next action:
   ├─ If all pass → Proceed
   ├─ If some fail → Fix and rerun
   └─ If unclear → Ask user
```

### Never Run Unreviewed Tests

```javascript
// ❌ FORBIDDEN
Agent: "I created tests. Let me run them."
// User never saw the test logic!

// ✅ REQUIRED
Agent: "I'll create tests for this feature. Review first:"
Agent: (Show test names and behaviors)
User: "Approved"
Agent: "Running tests now..."
```

---

## Error Handling

### When Tests Fail

```
Test Failure Detected
  ↓
STOP immediately
  ↓
Show error message exactly as test framework reported it
  ↓
If obvious fix:
  ├─ Fix issue
  ├─ Rerun test
  └─ Report result
  ↓
If unclear why failed:
  ├─ Show diagnostic info
  ├─ Report: "I can't fix this automatically"
  └─ Ask user: "What should I do?"
  ↓
NEVER commit failing tests
```

### Error Message Template

When test fails, agent MUST report EXACTLY like this:

```
❌ Test Failed: [test name]

Error Message:
[exact error from framework]

Location:
[file:line]

What I tried:
1. [Action]
2. [Action]

What I need:
[Ask user for next step]

Options:
A) I'll fix it this way: [suggestion]
B) You fix it and I'll rerun
C) Skip this test for now
```

### Diagnostic Information Required

When reporting errors, agent MUST include:

```javascript
{
  "test_name": "user can login",
  "error_type": "TimeoutError",
  "error_message": "Expected element not found: .results",
  "file": "tests/e2e/auth.spec.js:45",
  "timeout": "30000ms",
  "last_action": "await page.click('.login-button')",
  "selector_checked": ".results",
  "page_url": "http://localhost:3001/dashboard",
  "timestamp": "2025-11-22T10:30:45Z"
}
```

---

## Documentation Requirements

### EVERY test must have documentation:

```javascript
/**
 * Test: User can log in
 *
 * Purpose: Verify login flow works end-to-end
 *
 * What it tests:
 * 1. User can navigate to login page
 * 2. User can enter email and password
 * 3. User is redirected to dashboard after login
 * 4. Dashboard shows correct user info
 *
 * What it does NOT test:
 * - Password strength validation
 * - Forgot password flow
 * - Social login
 *
 * Dependencies:
 * - Test user must exist in database
 * - Email service not required (skipped)
 *
 * Flakiness: None known
 * Maintenance: Update if login form selectors change
 */
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  // Implementation...
});
```

### EVERY test file must have header:

```javascript
/**
 * File: tests/e2e/critical/auth-workflow.spec.js
 *
 * Purpose: Test authentication workflows
 *
 * Tests in this file:
 * - User signup
 * - User login
 * - User logout
 * - Password reset
 *
 * Setup: Requires test database and email service mock
 * Cleanup: Deletes all test users after each test
 *
 * Tags: @critical @auth @smoke
 * Run: npx playwright test auth-workflow.spec.js
 */
```

### Agent MUST document its changes:

```javascript
// ✅ GOOD commit message
git commit -m "feat: Add dark mode toggle tests and implementation

- Created tests/features/theme/dark-mode.spec.js
  ├─ Test: Dark mode button toggles theme
  ├─ Test: Theme preference persists after reload
  └─ Test: All components respect theme setting

- Implemented src/features/theme/dark-mode.js
  ├─ Adds toggle button to header
  ├─ Stores preference in localStorage
  └─ Applies theme to all components

Tests: All 3 tests pass ✓
Cleanup: Test data auto-cleaned

Closes: Feature request #123"

// ❌ BAD - No detail
git commit -m "add tests"
```

---

## Commit Requirements

### BEFORE committing, agent MUST verify:

```javascript
// Checklist for every commit:

□ All changed tests have been run and pass
□ All new code has been tested
□ FixRecord.md has been updated
□ Code has JSDoc comments
□ No hardcoded credentials
□ No hardcoded URLs or secrets
□ Test data is cleaned up
□ No console.log() debugging left
□ Commit message explains the "why"
□ No unrelated changes in commit

// Only commit when ALL checkboxes are ticked
```

### Commit Message Format

```
[type]: [Brief description]

[Optional: More details]

Affected files:
- file1.js
- file2.spec.js
- FixRecord.md

Tests:
- ✓ [Test name] (new)
- ✓ [Test name] (updated)
- ✓ [Test name] (regression)

Closes: Issue #123 (if applicable)
```

### Examples:

```bash
# ✅ GOOD
git commit -m "fix: Update login form selector for new HTML structure

The login form HTML was refactored, breaking the test selector
.login-form-input. Updated to use new selector input[type=email].

Affected files:
- tests/e2e/critical/auth-workflow.spec.js
- FixRecord.md

Tests:
- ✓ User can log in (updated selector)
- ✓ User sees error with wrong password

Closes: Issue #456"

# ❌ BAD
git commit -m "fix tests"
```

---

## Escalation Procedures

### When Agent Gets Stuck

Agent MUST escalate (ask user for help) when:

1. **Test fails but cause is unclear**
   ```
   Agent: "Test 'create project' failed with TimeoutError
   but I can't determine why. Could you:
   1. Review the error in test-results/
   2. Check if selector '.modal' exists
   3. Let me know if this is test error or code error?"
   ```

2. **Feature doesn't exist as described**
   ```
   Agent: "I can't find the 'dark mode' feature in the code.
   Did you mean:
   A) Create tests for NEW dark mode feature?
   B) Tests are for existing theme feature?
   C) Something else?"
   ```

3. **Test would be flaky**
   ```
   Agent: "This test relies on timing which makes it flaky.
   Should I:
   A) Add explicit waits for elements?
   B) Skip this test for now?
   C) Refactor the feature code?"
   ```

4. **Multiple valid approaches**
   ```
   Agent: "I can test the search feature two ways:

   Option 1: Test via UI (slower, more realistic)
   Option 2: Test via API (faster, less coverage)

   Which approach should I use?"
   ```

5. **Significant changes needed**
   ```
   Agent: "To test this feature properly, I need to:
   - Modify test database schema
   - Update test data fixtures
   - Create new helper functions

   Should I proceed?"
   ```

### Escalation Format

Agent must use this format:

```
🆘 ESCALATION REQUIRED

Issue: [Clear description]

Why I'm stuck:
1. [Reason]
2. [Reason]

Information needed:
- [Detail A]
- [Detail B]

Options:
A) [Suggestion 1]
B) [Suggestion 2]
C) [Suggestion 3]

Please advise which option to take.
```

---

## Summary: What Agents MUST Do

✅ **MUST DO:**
- Ask before creating tests
- Run tests before committing
- Clean up test data
- Update FixRecord.md
- Use environment variables for secrets
- Verify features exist before testing
- Verify tests fail initially (red → green)
- Report all errors clearly
- Ask user when stuck
- Document all tests thoroughly

❌ **MUST NEVER:**
- Create tests without user approval
- Commit failing tests
- Leave test data in database
- Hardcode credentials or URLs
- Skip test runs
- Commit without FixRecord.md update
- Create flaky/unreliable tests
- Ignore errors
- Test non-existent features
- Commit without showing user what changed

---

## References

- [TESTING_REQUIREMENTS.md](TESTING_REQUIREMENTS.md) - What to test
- [TESTING_ARCHITECTURE.md](TESTING_ARCHITECTURE.md) - How to design tests
- [TESTING_IMPLEMENTATION.md](TESTING_IMPLEMENTATION.md) - How to implement tests

---

**Last Updated:** 2025-11-22

**Status:** Active - Agents must follow these rules

**Question about these rules?** Ask the team lead or user before proceeding.

