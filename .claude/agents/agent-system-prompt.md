# Agent System Prompt: Testing Strategy Enforcement

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/agent-system-prompt.md`

**Description:** System prompt that MUST be provided to all Claude agents working on this project to enforce testing strategy compliance

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-22

**Version:** 1.0

---

## HOW TO USE THIS PROMPT

**CRITICAL:** Every time you interact with a Claude agent for code work on this project:

1. **Copy the "Agent Instructions" section below**
2. **Paste it into your conversation with the agent BEFORE asking any coding tasks**
3. **The agent will acknowledge these instructions and follow them for the entire session**

---

## Agent Instructions

### TESTING STRATEGY ENFORCEMENT

You are working on the **Permahub** project. This project has a **strict testing strategy** that ALL agents MUST follow. These rules are non-negotiable.

**CRITICAL FILES YOU MUST READ BEFORE ANY CODE WORK:**

1. Read: `/docs/testing/AGENT_TESTING_RULES.md` ← **START HERE**
2. Read: `/docs/testing/TESTING_REQUIREMENTS.md`
3. Read: `/docs/testing/TESTING_ARCHITECTURE.md`
4. Read: `/docs/testing/TESTING_IMPLEMENTATION.md`
5. Read: `/.claude/CLAUDE.md` ← Project development standards

**You may NOT proceed with any code task until you have reviewed these documents.**

---

## MANDATORY RULES

### Rule #1: Human Authority Override
- ✅ You MUST ask for explicit approval before creating tests
- ✅ You MUST ask for explicit approval before implementing features
- ✅ You MUST show the user what will change before committing
- ❌ You MUST NEVER silently create tests without asking

### Rule #2: Tests Come First
When implementing a feature:

```
Step 1: User requests feature
Step 2: You ask for approval to create tests
Step 3: You show test names and expected behaviors
Step 4: User approves OR modifies tests
Step 5: You create tests (they fail - RED)
Step 6: You implement feature (tests pass - GREEN)
Step 7: You update FixRecord.md
Step 8: You commit everything together
```

### Rule #3: Mandatory Checks Before Any Test

BEFORE creating ANY test, you MUST:

1. ✅ **Check feature exists**: `grep -r "feature-name" src/`
2. ✅ **Check test doesn't exist**: `grep -r "feature-name" tests/`
3. ✅ **Verify selectors**: For UI tests, verify the selectors actually exist in HTML
4. ✅ **Run test (red)**: Verify test FAILS before feature implemented
5. ✅ **Run test (green)**: Verify test PASSES after feature implemented
6. ✅ **Check cleanup**: Verify tests clean up their data (afterEach hooks)
7. ✅ **Check isolation**: Verify tests don't depend on each other

### Rule #4: Forbidden Practices

You MUST NEVER:

- ❌ Create tests without user approval
- ❌ Commit failing tests
- ❌ Hardcode passwords, credentials, or secrets in tests
- ❌ Skip test cleanup (test data must be deleted)
- ❌ Create flaky/unreliable tests
- ❌ Test non-existent features
- ❌ Commit without updating FixRecord.md
- ❌ Commit without running tests first
- ❌ Ignore test failures

### Rule #5: Test Execution Protocol

Every time you run tests:

```
1. BEFORE: Verify dev server is running
2. SELECT: Run only relevant tests first (not entire suite)
3. RUN: Execute with: npx playwright test [specific-test]
4. ANALYZE: Check pass/fail count
5. REPORT: Show results to user
6. DECIDE: Ask user what to do if any fail
```

### Rule #6: Error Reporting Format

If a test fails, report EXACTLY like this:

```
❌ Test Failed: [test name]

Error Message:
[exact error from test framework]

Location:
[file:line]

What I tried:
1. [action]
2. [action]

What I need:
[question for user]

Options:
A) I'll fix it this way...
B) You review and I'll fix...
C) Skip this test...
```

### Rule #7: Documentation Requirements

EVERY test file must have:

```javascript
/**
 * File: tests/e2e/critical/auth-workflow.spec.js
 *
 * Purpose: Test authentication workflows
 *
 * Tests in this file:
 * - User signup
 * - User login
 * - Password reset
 *
 * Tags: @critical @auth @smoke
 * Run: npx playwright test auth-workflow.spec.js
 */
```

EVERY test must have:

```javascript
/**
 * Test: User can log in
 *
 * Purpose: Verify login flow works end-to-end
 *
 * What it tests:
 * 1. User navigates to login page
 * 2. User enters credentials
 * 3. User is redirected to dashboard
 *
 * What it does NOT test:
 * - Password strength validation
 * - Forgot password flow
 */
```

### Rule #8: Commit Requirements

BEFORE committing, verify:

- ✅ All tests run successfully
- ✅ FixRecord.md is updated
- ✅ Code has JSDoc comments
- ✅ No hardcoded credentials
- ✅ Test data cleaned up
- ✅ Commit message explains the "why"

### Rule #9: When to Escalate

Ask the user for help when:

- ❓ Test fails but you don't understand why
- ❓ Feature doesn't exist as described
- ❓ Test would be flaky (unreliable)
- ❓ Multiple valid testing approaches
- ❓ Significant database/schema changes needed

---

## PROJECT-SPECIFIC TESTING DETAILS

### Testing Tiers (in order of priority)

1. **Smoke Tests** (`npm run test:smoke`)
   - Purpose: Quick health check
   - Tags: `@e2e @smoke`
   - Time: < 30 seconds
   - When: Before every commit

2. **Critical Path Tests** (`npm run test:critical`)
   - Purpose: Must pass before deployment
   - Tags: `@critical`
   - Time: < 2 minutes
   - When: Before pushing

3. **Feature Tests** (`npx playwright test [specific-test]`)
   - Purpose: Test individual features
   - Tags: `@integration @feature-name`
   - When: While developing

### Test File Structure

```
tests/
├── unit/                          # Fast, isolated tests
│   ├── supabase/
│   └── utils/
├── integration/                   # Component tests
│   ├── wiki/
│   ├── auth/
│   └── pages/
└── e2e/                          # Full user journeys
    ├── critical-paths/
    ├── regression/
    └── smoke/
```

### Key Test Commands

```bash
# Quick check (run BEFORE committing)
npm run test:smoke

# Before pushing
npm run test:critical

# Specific test file
npx playwright test tests/e2e/critical/auth-workflow.spec.js

# Run and debug
npm run test:debug

# View last report
npm run test:report
```

---

## WHAT HAPPENS IF YOU BREAK THE RULES

**If you violate these rules, the pre-commit hook will:**

1. 🛑 **Block your commit** - The commit will fail
2. 📋 **Show what's wrong** - Specific rule violations
3. ❓ **Ask for confirmation** - "Do you want to proceed anyway?"
4. 📝 **Log the violation** - Records in project history

**If you bypass the hook or ignore violations:**

- Your commits will be reviewed manually
- The user will be notified
- You may lose commit permissions

---

## HELPFUL RESOURCES

**Key Documentation:**
- `/docs/testing/AGENT_TESTING_RULES.md` - Detailed rules
- `/docs/testing/TESTING_REQUIREMENTS.md` - What to test
- `/docs/testing/TESTING_ARCHITECTURE.md` - Test design patterns
- `/docs/testing/TESTING_IMPLEMENTATION.md` - How to set up tests
- `/.claude/CLAUDE.md` - Project development standards

**Quick Reference:**
- Test templates: See `TESTING_IMPLEMENTATION.md`
- Playwright docs: https://playwright.dev
- Page Object pattern: See `TESTING_ARCHITECTURE.md`

---

## ACKNOWLEDGMENT

**By proceeding with any code task, you acknowledge that:**

- ✅ You have read the testing strategy documents
- ✅ You understand and accept these rules
- ✅ You will follow the mandatory workflow
- ✅ You will not bypass or ignore the rules
- ✅ You will ask for help when stuck

If you do not agree with any of these rules, **STOP and ask the user for clarification before proceeding.**

---

**Last Updated:** 2025-11-22

**Status:** Active - All agents must follow these rules

**Questions?** Ask the user before proceeding with any code work.
