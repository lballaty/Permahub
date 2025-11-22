# Testing Architecture Document

**File:** `/docs/testing/TESTING_ARCHITECTURE.md`

**Description:** Technical architecture for implementing reusable testing strategy across multiple technology stacks

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-22

**Version:** 1.0

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Test Execution Model](#test-execution-model)
4. [Configuration Management](#configuration-management)
5. [Test Data Pipeline](#test-data-pipeline)
6. [Reporting & Metrics](#reporting--metrics)
7. [Agent Integration Points](#agent-integration-points)
8. [Stack-Specific Implementations](#stack-specific-implementations)
9. [Error Handling & Recovery](#error-handling--recovery)
10. [Deployment & CI/CD Integration](#deployment--cicd-integration)

---

## Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Development Workflow                     │
│                                                               │
│  Code Change → Pre-commit Hook → Test Selection → Execution │
│                      ↓                                        │
│              (Linting, Format Check)                         │
│                      ↓                                        │
│              Smoke Tests Pass? → Pre-push Hook               │
│                      ↓                                        │
│              Critical Tests Pass? → Git Push                 │
│                      ↓                                        │
│  Remote Branch → CI/CD Pipeline → Full Test Suite           │
│                      ↓                                        │
│              All Tests Pass? → Merge to Main                 │
│                      ↓                                        │
│              Deploy to Staging/Production                    │
└─────────────────────────────────────────────────────────────┘
```

### Layered Architecture

```
┌──────────────────────────────────────────────────┐
│  User / Agent Interface Layer                    │
│  (Request: "run tests", "add test")              │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│  Test Orchestration Layer                        │
│  (Decide which tests to run, when)               │
│  - Test discovery                                │
│  - Test filtering (by tag, path, pattern)        │
│  - Test ordering & parallelization               │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│  Test Execution Layer                            │
│  (Run the actual tests)                          │
│  - Framework adapters (Playwright, Bruno, etc)   │
│  - Test runners                                  │
│  - Test isolation                                │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│  Support Services Layer                          │
│  ├─ Test Data Management                         │
│  ├─ Configuration Management                     │
│  ├─ Secrets Management                           │
│  ├─ Test Environment Setup                       │
│  └─ Report Generation                            │
└──────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────┐
│  System Under Test (SUT)                         │
│  - Application Code                              │
│  - APIs                                          │
│  - Databases                                     │
│  - External Services                             │
└──────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Test Framework Abstraction Layer

**Purpose**: Provide unified interface for different test frameworks

**Structure**:
```
tests/
├── frameworks/
│   ├── playwright/
│   │   ├── config.js
│   │   ├── utils.js
│   │   └── page-objects/
│   │
│   ├── bruno/
│   │   ├── config.js
│   │   └── env-setup.js
│   │
│   └── flutter/
│       ├── config.dart
│       └── helpers/
```

**Responsibilities**:
- Abstract framework-specific setup
- Provide common utilities (login, API calls, etc)
- Handle browser/device launch
- Manage test environment

### 2. Test Configuration Manager

**Purpose**: Centralize all test configuration

**Structure**:
```
.env.test                    # Test environment variables
├── TEST_BASE_URL
├── TEST_API_URL
├── TEST_DB_URL
├── TEST_USER_EMAIL
├── TEST_USER_PASSWORD
└── (plus framework-specific vars)

config/
├── test.config.js           # Common config
├── playwright.config.js     # Playwright-specific
├── bruno-config.json        # API test config
└── flutter-test-config.json # Mobile test config
```

**Key Attributes**:
```javascript
{
  // Environment
  baseURL: 'http://localhost:3001',
  apiBaseURL: 'http://localhost:3001/api',

  // Execution
  timeout: 30000,
  retries: 0,  // Critical tests: 0, others: 1-2
  workers: 4,  // Parallel execution

  // Reporting
  outputDir: 'test-results',
  reportFormat: ['html', 'json', 'junit'],

  // Logging
  logLevel: 'info',
  screenshotOnFailure: true,
  videoOnFailure: true,

  // Test tags to run
  grep: '@smoke|@critical',
}
```

### 3. Test Data Pipeline

**Purpose**: Manage test fixtures and data lifecycle

**Architecture**:
```
┌─────────────────┐
│ Test Fixtures   │  (Static test data)
│ (JSON files)    │
└────────┬────────┘
         ↓
┌─────────────────────────────────┐
│ Test Data Generator             │
├─────────────────────────────────┤
│ - Read fixtures                 │
│ - Create variations             │
│ - Apply transformations         │
└────────┬────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ Test Environment Setup          │
├─────────────────────────────────┤
│ - Seed database                 │
│ - Create test users             │
│ - Initialize API mocks          │
└────────┬────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ Test Execution                  │
│ (Tests read from DB)            │
└────────┬────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ Test Cleanup                    │
├─────────────────────────────────┤
│ - Delete test records           │
│ - Reset database state          │
│ - Clear caches                  │
└─────────────────────────────────┘
```

**Test Fixtures Structure**:
```
tests/fixtures/
├── users/
│   ├── admin-user.json
│   ├── normal-user.json
│   ├── inactive-user.json
│   └── user-templates.js  (generators)
│
├── projects/
│   ├── sample-project.json
│   ├── archived-project.json
│   └── project-templates.js
│
└── api-responses/
    ├── login-success.json
    ├── login-error.json
    └── response-templates.js
```

### 4. Test Execution Engine

**Purpose**: Discover, filter, parallelize, and execute tests

**Test Discovery**:
```javascript
// Discover tests based on:
// 1. File patterns (*.spec.js, *.test.js, *.bru)
// 2. Directory structure
// 3. Test tags (@smoke, @critical, @feature:auth)

testFiles = discoverTests({
  patterns: ['**/*.spec.js', 'tests/api/**/*.bru'],
  excludePatterns: ['**/node_modules/**'],
  tags: ['@smoke', '@critical'],  // Optional filter
  grep: 'search-term',            // Optional pattern match
})
```

**Test Filtering**:
```javascript
// Filter discovered tests by:
filteredTests = filterTests(testFiles, {
  byTag: '@critical',                    // Single tag
  byTags: ['@critical', '@auth'],        // Multiple (OR logic)
  byPath: 'tests/features/auth/**',      // Directory
  byPattern: 'login',                    // Grep pattern
  byChangedFiles: gitChangedFiles,       // Only tests for changed files
  maxTests: 10,                          // Limit count
})
```

**Test Ordering & Parallelization**:
```javascript
// Order tests for optimal execution:
orderedTests = orderTests(filteredTests, {
  // 1. Dependencies (if A depends on B, run B first)
  // 2. Flakiness (reliable tests first)
  // 3. Duration (shorter tests first for faster feedback)
  // 4. Randomization (for finding hidden dependencies)
  strategy: 'dependencies-first'
})

// Parallelize with safety:
parallelGroups = parallelizeTests(orderedTests, {
  maxWorkers: 4,           // Parallel processes
  isolation: 'complete',   // Each test isolated
  sharedResources: false,  // No shared state
})
```

### 5. Report Generation & Metrics

**Purpose**: Provide comprehensive test reporting

**Report Pipeline**:
```
Test Results (Raw)
    ↓
┌──────────────────────────────────────┐
│ Report Generator                     │
├──────────────────────────────────────┤
│ ├─ Parse results                     │
│ ├─ Calculate metrics                 │
│ ├─ Generate formats                  │
│ ├─ Attach artifacts                  │
│ └─ Post to dashboards                │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Report Formats                       │
├──────────────────────────────────────┤
│ ├─ Plain Text (CLI)                  │
│ ├─ JSON (Metrics)                    │
│ ├─ HTML (Visual)                     │
│ ├─ JUnit XML (CI/CD)                 │
│ ├─ Markdown (Docs)                   │
│ └─ Artifacts (Screenshots, Videos)   │
└──────────────────────────────────────┘
```

**Report Content**:
```
test-results/
├── summary.txt
│   ├─ Test run overview
│   ├─ Pass/Fail counts
│   ├─ Execution time
│   └─ Failed test names
│
├── results.json
│   ├─ Structured results
│   ├─ Timing data
│   ├─ Tags
│   └─ Artifacts paths
│
├── report.html
│   ├─ Visual test report
│   ├─ Filtering/searching
│   ├─ Test code
│   └─ Stack traces
│
├── junit.xml
│   └─ CI/CD integration format
│
├── screenshots/
│   └─ Failed test screenshots
│
└── videos/
    └─ Failed test recordings
```

---

## Test Execution Model

### Sequential vs Parallel Execution

**Sequential** (for dependent tests):
```
Test 1 (Setup) → Test 2 → Test 3 → Test 4
  ↓              ↓         ↓         ↓
  5s             3s        4s        2s
                            Total: 14s
```

**Parallel** (for independent tests):
```
Test 1 ─┐
Test 2 ─┼→ [Execution Engine] → Results
Test 3 ─┤
Test 4 ─┘
         Total: 5s (max of individual times)
```

**Recommendation**:
```javascript
// Architecture:
const testTiers = {
  // Run sequentially (setup dependencies)
  smoke: {
    parallel: false,
    timeout: 30000,
  },

  // Run in parallel (independent tests)
  features: {
    parallel: true,
    workers: 4,
    timeout: 10000,
  },

  // Run with limited parallelization (API calls)
  api: {
    parallel: true,
    workers: 2,  // Rate limiting
    timeout: 5000,
  },
}
```

### Test Isolation Strategies

**Level 1: Complete Isolation** (Highest)
```
Each test:
  ├─ Gets own database
  ├─ Gets own test user
  ├─ Starts with fresh state
  └─ Cleans up completely

Result: Tests never interfere, but slower
Use for: Critical path tests, regression tests
```

**Level 2: Feature Isolation** (Middle)
```
Feature tests share:
  ├─ Same database
  ├─ Same test users
  ├─ Test data pre-created

But isolated:
  ├─ Each test within feature sandbox
  ├─ Cleanup happens per test
  └─ No cross-feature contamination

Result: Balanced speed/isolation
Use for: Feature tests, integration tests
```

**Level 3: Shared State** (Lowest)
```
Tests share:
  ├─ Everything (data, users, state)
  ├─ Must run in specific order
  ├─ Rely on previous test's data

Fastest but fragile
Use for: Smoke tests only (if needed for speed)
```

**Recommendation**: Use Level 1 (Complete Isolation) for correctness.

---

## Configuration Management

### Configuration Hierarchy

```
┌───────────────────────────────────────┐
│ Command Line Arguments (Highest)      │
│ npm run test -- --tag @smoke          │
└───────┬───────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ Environment Variables (.env)          │
│ TEST_BASE_URL=http://localhost:3001   │
└───────┬───────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ Framework Config Files                │
│ playwright.config.js                  │
│ bruno-config.json                     │
└───────┬───────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ Project Defaults (Lowest)             │
│ Built-in framework defaults           │
└───────────────────────────────────────┘
```

### Environment Variable Structure

```bash
# === Framework Selection ===
TEST_FRAMEWORK=playwright              # playwright, bruno, flutter
TEST_BROWSER=chromium                  # chromium, firefox, webkit

# === Server Configuration ===
TEST_BASE_URL=http://localhost:3001    # UI test base URL
TEST_API_URL=http://localhost:3001/api # API test base URL
TEST_WS_URL=ws://localhost:3001        # WebSocket URL (if needed)

# === Authentication ===
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=${SECURE_PASSWORD}  # From vault
TEST_API_TOKEN=${SECURE_TOKEN}         # From vault
TEST_REFRESH_TOKEN=${SECURE_TOKEN}     # From vault

# === Database ===
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=app_test
TEST_DB_USER=test_user
TEST_DB_PASSWORD=${SECURE_DB_PASSWORD}

# === Test Behavior ===
TEST_TIMEOUT=30000                     # milliseconds
TEST_RETRIES=0                         # For critical: 0, others: 1-2
TEST_WORKERS=4                         # Parallel execution
TEST_SLOW_MO=0                         # Slow down (debug)

# === Reporting ===
TEST_REPORT_FORMAT=html,json,junit     # Output formats
TEST_SCREENSHOT_ON_FAILURE=true
TEST_VIDEO_ON_FAILURE=true
TEST_LOG_LEVEL=info                    # debug, info, warn, error

# === External Services ===
MOCK_API_SERVER=true                   # Use mock vs real
MOCK_SERVER_PORT=3002
ENABLE_HEADLESS=true                   # Run browser headless
ENABLE_TRACE=false                     # Playwright trace
```

### Environment-Specific Configs

```
.env.test.local      # Local development (git ignored)
.env.test.ci         # CI/CD environment
.env.test.staging    # Staging environment
.env.test.prod       # Production testing (if any)

# Example .env.test.local:
TEST_BASE_URL=http://localhost:3001
TEST_API_URL=http://localhost:3001/api
TEST_BROWSER=chromium
TEST_SLOW_MO=100
TEST_SCREENSHOT_ON_FAILURE=true
TEST_LOG_LEVEL=debug
```

---

## Test Data Pipeline

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Test Execution Phase                                    │
└──────────┬──────────────────────────────────────────────┘
           ↓
    beforeAll() hooks
           ↓
    ┌──────────────────────────────────────────┐
    │ 1. Check Environment Setup               │
    │    - Can connect to database?            │
    │    - Can connect to API?                 │
    │    - Can create test users?              │
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ 2. Load Test Fixtures                    │
    │    - Read users.json                     │
    │    - Read projects.json                  │
    │    - Generate unique data                │
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ 3. Create Test Data                      │
    │    - Insert users into database          │
    │    - Create projects                     │
    │    - Set up relationships                │
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ 4. Verify Data Created                   │
    │    - Query database to confirm           │
    │    - Log IDs for debugging               │
    └──────────┬───────────────────────────────┘
               ↓
           beforeEach() hooks
               ↓
    ┌──────────────────────────────────────────┐
    │ Test Execution                           │
    │ (Tests use data from setup)              │
    └──────────┬───────────────────────────────┘
               ↓
           afterEach() hooks
               ↓
    ┌──────────────────────────────────────────┐
    │ 5. Per-Test Cleanup (optional)           │
    │    - Reset state if shared data          │
    │    - Clear caches                        │
    └──────────┬───────────────────────────────┘
               ↓
           afterAll() hooks
               ↓
    ┌──────────────────────────────────────────┐
    │ 6. Full Cleanup                          │
    │    - Delete all test data                │
    │    - Close database connections          │
    │    - Close browser/device                │
    └──────────────────────────────────────────┘
```

### Fixture Management Example

```javascript
// tests/helpers/test-data.js

const fixtures = {
  users: {
    admin: {
      email: 'admin@test.example.com',
      password: 'SecureTestPass123!',
      role: 'admin',
    },
    regular: {
      email: 'user@test.example.com',
      password: 'SecureTestPass123!',
      role: 'user',
    },
  },
  projects: {
    sample: {
      title: 'Sample Project',
      description: 'A test project',
      status: 'active',
    },
  },
};

// Generators for dynamic data
function generateTestUser() {
  const timestamp = Date.now();
  return {
    email: `test-${timestamp}@example.com`,
    password: 'SecureTestPass123!',
    firstName: 'Test',
    lastName: `User${timestamp}`,
  };
}

function generateTestProject(ownerUserId) {
  const timestamp = Date.now();
  return {
    title: `Test Project ${timestamp}`,
    description: `Automated test project created at ${timestamp}`,
    ownerId: ownerUserId,
  };
}

module.exports = {
  fixtures,
  generateTestUser,
  generateTestProject,
};
```

---

## Reporting & Metrics

### Report Structure

```javascript
// test-results/results.json
{
  "metadata": {
    "startTime": "2025-11-22T10:30:00Z",
    "endTime": "2025-11-22T10:35:45Z",
    "duration": 345000,  // milliseconds
    "framework": "playwright",
    "browser": "chromium",
    "environment": "local",
  },

  "summary": {
    "total": 30,
    "passed": 28,
    "failed": 2,
    "skipped": 0,
    "flaky": 0,
    "passRate": 0.933,  // 93.3%
  },

  "tiers": {
    "smoke": { passed: 5, failed: 0, duration: 15000 },
    "critical": { passed: 15, failed: 1, duration: 180000 },
    "features": { passed: 8, failed: 1, duration: 150000 },
  },

  "tests": [
    {
      "id": "test-1",
      "title": "User can log in",
      "path": "tests/e2e/critical/auth-workflow.spec.js",
      "tags": ["@critical", "@auth", "@smoke"],
      "status": "passed",
      "duration": 2500,
      "retries": 0,
      "error": null,
      "artifacts": {
        "screenshot": null,
        "video": null,
        "trace": null,
      }
    },
    {
      "id": "test-2",
      "title": "Search filters work",
      "path": "tests/e2e/features/search/search-filters.spec.js",
      "tags": ["@feature:search", "@ui"],
      "status": "failed",
      "duration": 8500,
      "retries": 1,
      "error": {
        "message": "Expected element not found",
        "code": "element_not_found",
        "selector": ".search-results > .card",
        "stackTrace": "..."
      },
      "artifacts": {
        "screenshot": "screenshots/search-filters-failed.png",
        "video": "videos/search-filters.webm",
        "trace": "traces/search-filters.zip",
      }
    },
  ],

  "performance": {
    "slowestTests": [
      { title: "Large dataset search", duration: 8500 },
      { title: "Complex form submission", duration: 7200 },
    ],
    "flakinessScore": 0,  // 0 = stable, 1 = very flaky
    "parallelEfficiency": 0.87,  // How well parallelization worked
  },
}
```

### Metrics Dashboard (Example)

```
Test Execution Metrics (Last 30 days)
═════════════════════════════════════════

Pass Rate:          95.2% ▲ (up from 92.1%)
Average Duration:   4m 32s ▼ (down from 5m 15s)
Flaky Tests:        1 ⚠️  (0 is ideal)
  └─ "Complex form" flakes 5% of time

Test Coverage:
  Smoke:            5/5 ✓
  Critical:         18/20 (90%) ⚠️ Missing: 2 workflows
  Features:         42/50 (84%) ⚠️

Regressions:
  Fixed by tests:   8 (this month)
  Caught in prod:   0 (good!)

Performance Trends:
  Fastest tier:     Smoke (15s avg)
  Slowest tier:     Critical (3m 20s avg)

Recent Failures:
  [ERROR] Search filters (flaky)
  [ERROR] Large dataset test (timeout)
  [ERROR] API rate limiting test
```

---

## Agent Integration Points

### Workflow Hooks for Agents

```
1. BEFORE_TEST_CREATION
   ├─ Verify feature/page exists
   ├─ Check if test already exists
   └─ Ask user: "Create test for this?"

2. TEST_TEMPLATE_LOADING
   ├─ Load appropriate template
   ├─ Fill in feature-specific details
   └─ Present to user for review

3. AFTER_TEST_CREATION
   ├─ Validate test syntax
   ├─ Check selectors against actual HTML
   └─ Run test to verify it works

4. BEFORE_FEATURE_IMPLEMENTATION
   ├─ Show failing tests (red tests)
   └─ Now implement feature

5. AFTER_IMPLEMENTATION
   ├─ Run tests again
   ├─ All should pass
   └─ If any fail: debug

6. BEFORE_COMMIT
   ├─ Verify all tests pass
   ├─ Update FixRecord.md
   └─ Commit code + tests together

7. PRE_PUSH_CHECK
   ├─ Run critical tests
   └─ Block push if tests fail
```

### Agent Guardrails (Do's and Don'ts)

```javascript
// ✅ AGENT MUST DO THIS:
- Create tests from templates
- Run tests before committing
- Show user test logic for approval
- Clean up test data after running
- Document tests in code comments
- Update FixRecord.md

// ❌ AGENT MUST NOT DO THIS:
- Create tests without user review
- Hardcode credentials in tests
- Create flaky tests (timing-dependent)
- Commit untested code
- Ignore test failures
- Leave test data in database
- Create expensive resources without cleanup
- Skip cleanup in afterAll hooks
```

---

## Stack-Specific Implementations

### Playwright (UI Testing)

**Architecture**:
```
tests/e2e/
├── playwright.config.js        # Base config
├── fixtures/                   # Test data
├── helpers/
│   ├── auth-helpers.js        # Login, signup
│   ├── page-objects.js        # Page Object Models
│   └── api-helpers.js         # API testing within tests
│
└── features/
    ├── auth/
    │   ├── login.spec.js
    │   └── pages/LoginPage.js
    └── dashboard/
        ├── dashboard.spec.js
        └── pages/DashboardPage.js
```

**Page Object Pattern**:
```javascript
// tests/e2e/features/auth/pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button:has-text("Login")');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// In test file:
import { LoginPage } from './pages/LoginPage.js';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@example.com', 'password');
  // assertions...
});
```

### Bruno (API Testing)

**Architecture**:
```
tests/api/
├── bruno.json                  # Bruno config
├── environments/
│   ├── local.bru
│   ├── staging.bru
│   └── production.bru
│
└── [resource]/
    ├── create.bru
    ├── read.bru
    ├── update.bru
    └── delete.bru
```

**Test Request Format**:
```
# tests/api/auth/login.bru
meta {
  name: Login User
  desc: ''
  seq: 1
}

auth: bearer {{auth_token}}

post {
  url: {{base_url}}/auth/login
  body: json
  auth: none
}

body:json {
  {
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }
}

tests {
  test("Status is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Response has token", function() {
    expect(res.getBody().token).to.exist;
  });
}
```

### Flutter Integration Testing

**Architecture**:
```
test/integration/
├── app_test.dart               # Main app test
├── auth_test.dart              # Auth workflow
├── features/
│   ├── search_test.dart
│   └── project_test.dart
│
└── helpers/
    ├── test_data.dart
    └── gestures.dart
```

**Test Structure**:
```dart
void main() {
  group('Authentication Flow', () {
    late WidgetTester tester;

    setUp(() async {
      // Create test app
      await tester.pumpWidget(const MyApp());
    });

    tearDown(() async {
      // Cleanup
      await deleteTestUser();
    });

    testWidgets('User can login', (WidgetTester tester) async {
      // Test implementation
      expect(find.text('Welcome'), findsOneWidget);
    });
  });
}
```

---

## Error Handling & Recovery

### Test Failure Categories

```
┌─────────────────────────────────────┐
│ Test Failure Classification         │
└─────────────────────────────────────┘

1. Test Code Error
   └─ Syntax error, assertion error
   └─ Action: Fix test code

2. Environment Error
   └─ Cannot connect to server
   └─ Action: Check server, wait, retry

3. Test Data Error
   └─ Cannot create test user
   └─ Action: Check database, cleanup old data

4. Flaky Test
   └─ Sometimes passes, sometimes fails
   └─ Action: Add waits, retry logic, refactor

5. Real Bug Found
   └─ Application code is broken
   └─ Action: Create regression test, fix code
```

### Retry Strategy

```javascript
// Config
{
  // Critical tests: never retry (fail immediately if broken)
  smoke: { retries: 0 },
  critical: { retries: 0 },

  // Feature tests: retry once (for flakiness)
  features: { retries: 1 },

  // API tests: retry with exponential backoff
  api: {
    retries: 2,
    backoff: 'exponential',
    delay: 500,  // ms
  },
}

// Implementation
async function runTestWithRetry(test, maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await test();
      return { status: 'passed', attempts: attempt };
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 500;
      await sleep(delay);
    }
  }
}
```

### Error Reporting

```javascript
// When test fails:
{
  "failure": {
    "title": "Search filters work",
    "error": {
      "type": "ElementNotFound",
      "message": "Could not find element .search-results > .card",
      "selector": ".search-results > .card",
      "timeout": 30000,
    },

    "diagnostics": {
      "lastAction": "click on filter button",
      "expectedState": "Results filtered",
      "actualState": "Spinner still loading",
      "suggestions": [
        "1. Check if selector is correct (selector changed?)",
        "2. Increase timeout if element loads slowly",
        "3. Add wait for element visibility",
        "4. Check console errors",
      ]
    },

    "artifacts": {
      "screenshot": "failure-01.png",
      "video": "failure-01.webm",
      "console": ["error: ...", "error: ..."],
      "networkRequests": [
        { url: "/api/search", status: 200, duration: 150 },
      ]
    }
  }
}
```

---

## Deployment & CI/CD Integration

### CI/CD Pipeline Integration

```yaml
# .github/workflows/test.yml or gitlab-ci.yml

stages:
  - test
  - report
  - deploy

test:smoke:
  stage: test
  script:
    - npm run test:smoke
  timeout: 30 minutes
  artifacts:
    reports:
      junit: test-results/junit.xml
    paths:
      - test-results/
  only:
    - merge_requests

test:critical:
  stage: test
  script:
    - npm run test:critical
  timeout: 5 minutes
  artifacts:
    reports:
      junit: test-results/junit.xml
  only:
    - merge_requests
    - main

test:all:
  stage: test
  script:
    - npm run test:all
  timeout: 15 minutes
  artifacts:
    reports:
      junit: test-results/junit.xml
    paths:
      - test-results/
  only:
    - main
    - scheduled  # Nightly runs

report:tests:
  stage: report
  script:
    - npm run test:report
  dependencies:
    - test:all
  artifacts:
    paths:
      - test-results/report.html
  only:
    - main

deploy:staging:
  stage: deploy
  script:
    - npm run deploy:staging
  dependencies:
    - test:all
  only:
    - main
    - tags
```

### Test Blocking Strategy

```javascript
// When tests fail, block merging:

if (testResults.smoke.failed > 0) {
  // Block push
  exit(1);
  message: "❌ Smoke tests failed. Fix before pushing.";
}

if (testResults.critical.failed > 0) {
  // Block merge to main
  exit(1);
  message: "❌ Critical tests failed. Fix before merging.";
}

if (testResults.summary.flakinessScore > 0.1) {
  // Warn but don't block
  warn("⚠️ Some tests are flaky. Consider investigating.");
}
```

---

## Next Steps

1. Review this architecture document
2. Proceed to [TESTING_IMPLEMENTATION.md](TESTING_IMPLEMENTATION.md) for implementation steps
3. Then to [AGENT_TESTING_RULES.md](AGENT_TESTING_RULES.md) for agent integration

