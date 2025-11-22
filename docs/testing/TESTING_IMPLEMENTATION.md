# Testing Implementation Guide

**File:** `/docs/testing/TESTING_IMPLEMENTATION.md`

**Description:** Step-by-step implementation guide for setting up testing infrastructure across different tech stacks

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-22

**Version:** 1.0

---

## Table of Contents

1. [Pre-Implementation Checklist](#pre-implementation-checklist)
2. [Playwright Setup (Web UI Testing)](#playwright-setup-web-ui-testing)
3. [Bruno Setup (API Testing)](#bruno-setup-api-testing)
4. [Flutter Setup (Mobile Testing)](#flutter-setup-mobile-testing)
5. [Common Configuration](#common-configuration)
6. [Test Data Setup](#test-data-setup)
7. [CI/CD Integration](#cicd-integration)
8. [Testing Best Practices](#testing-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Implementation Checklist

Before implementing testing for your project, verify:

- [ ] **Project structure exists** (src/, tests/ directories)
- [ ] **Development environment works** (dev server starts, no errors)
- [ ] **Git repository initialized** (can create commits)
- [ ] **Node.js/npm installed** (for Playwright, Bruno)
- [ ] **Databases available** (test database created)
- [ ] **API endpoints working** (can make test requests)
- [ ] **.env file configured** (correct URLs, credentials)
- [ ] **Team alignment** (strategy reviewed and approved)

### Installation Prerequisites

```bash
# Verify Node.js version (18+)
node --version

# Verify npm version (9+)
npm --version

# Create test directories
mkdir -p tests/{e2e,api,fixtures,helpers}
mkdir -p test-results

# Verify dev server port configuration
grep "port:" vite.config.js  # Should show port 3001
# OR check your framework's config
```

---

## Playwright Setup (Web UI Testing)

### Step 1: Install Playwright

```bash
npm install -D @playwright/test

# This installs:
# - Playwright test runner
# - Browser binaries (chromium, firefox, webkit)
# - Test utilities
```

### Step 2: Create playwright.config.js

Create `/playwright.config.js` in project root:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test discovery
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',

  // Timeouts
  timeout: 30 * 1000,  // 30 seconds per test
  expect: {
    timeout: 5 * 1000,  // 5 seconds for assertions
  },

  // Execution
  fullyParallel: true,
  workers: process.env.CI ? 1 : 4,  // 1 in CI, 4 locally
  retries: process.env.CI ? 2 : 0,  // Retry in CI only
  forbidOnly: !!process.env.CI,      // Block test.only() in CI

  // Reporting
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],  // Console output
    process.env.CI && ['junit', { outputFile: 'test-results/junit.xml' }],
  ].filter(Boolean),

  // Global configuration
  use: {
    // Use environment variable for baseURL
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3001',

    // Debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Browser
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 10 * 1000,
  },

  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      grep: /@mobile/,  // Only run @mobile tests
    },
  ],
});
```

### Step 3: Create Test Structure

```bash
# Create directory structure
mkdir -p tests/e2e/{smoke,critical,features}
mkdir -p tests/e2e/features/{auth,dashboard,search}
mkdir -p tests/helpers
mkdir -p tests/fixtures
```

### Step 4: Create Test Template

Create `tests/PLAYWRIGHT_TEST_TEMPLATE.js`:

```javascript
/**
 * Test Template for Playwright
 *
 * Copy this when creating new tests and fill in the [BRACKETS]
 *
 * GUIDELINES:
 * - Keep tests focused (one behavior per test)
 * - Use meaningful names describing what's tested
 * - Add comments explaining the "why"
 * - Use page objects for UI interactions
 * - Always clean up test data
 */

import { test, expect } from '@playwright/test';
import { [FeatureName]Page } from './pages/[FeatureName]Page';

test.describe('[Feature Name] @[feature-tag] @[category]', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    // Setup: Create page once for all tests in this group
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    // Cleanup: Close page
    await page.close();
  });

  test.beforeEach(async () => {
    // Before each test: Navigate to page
    await page.goto('/path/to/page');

    // Optional: Log in if needed
    // await page.locator('a:has-text("Login")').click();
  });

  test('[Feature] - specific behavior being tested @critical', async () => {
    // Arrange (Setup)
    const [FeatureName]Page = new [FeatureName]Page(page);

    // Act (Do something)
    await [FeatureName]Page.[action]();

    // Assert (Check result)
    await expect(page.locator('[selector]')).toBeVisible();
  });

  test('[Feature] - another behavior @feature', async () => {
    // Implementation...
  });
});
```

### Step 5: Create Helper Functions

Create `tests/helpers/auth-helpers.js`:

```javascript
/**
 * Playwright helper functions for authentication
 * Usage: import { loginUser } from './helpers/auth-helpers.js'
 */

export async function loginUser(page, email, password) {
  /**
   * Log in a user via the login form
   * Waits for dashboard to load before returning
   */
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button:has-text("Login")').click();

  // Wait for navigation to dashboard
  await page.waitForURL('/dashboard');

  return page;
}

export async function signupUser(page, userData) {
  /**
   * Sign up a new user
   * Returns: { userId, email, token }
   */
  await page.goto('/signup');

  await page.locator('input[name="firstName"]').fill(userData.firstName);
  await page.locator('input[name="lastName"]').fill(userData.lastName);
  await page.locator('input[type="email"]').fill(userData.email);
  await page.locator('input[type="password"]').fill(userData.password);

  await page.locator('button:has-text("Sign Up")').click();
  await page.waitForURL('/verify-email');

  return { email: userData.email };
}

export async function logout(page) {
  /**
   * Log out the current user
   */
  await page.locator('button:has-text("Menu")').click();
  await page.locator('a:has-text("Logout")').click();
  await page.waitForURL('/login');
}
```

### Step 6: Create Page Objects

Create `tests/e2e/features/auth/pages/LoginPage.js`:

```javascript
/**
 * Page Object Model for Login Page
 * Encapsulates all selectors and interactions for login page
 */

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Selectors
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button:has-text("Login")');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.forgotLink = page.locator('a:has-text("Forgot Password")');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    /**
     * Complete login flow
     * Waits for navigation to complete
     */
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // Wait for either success (redirect) or error
    await Promise.race([
      this.page.waitForURL('/dashboard'),
      this.errorMessage.isVisible(),
    ]);
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async clickForgotPassword() {
    await this.forgotLink.click();
  }
}
```

### Step 7: Create First Test

Create `tests/e2e/critical/auth-workflow.spec.js`:

```javascript
import { test, expect } from '@playwright/test';
import { generateTestUser } from '../../fixtures/test-data';
import { LoginPage } from '../features/auth/pages/LoginPage';

test.describe('Authentication Workflow @critical @auth', () => {
  let testUser;

  test.beforeAll(async () => {
    // Create a test user for authentication tests
    testUser = generateTestUser();
    // In real app, you'd create this in database here
    console.log('Test user:', testUser.email);
  });

  test('User can log in @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);

    // Verify we're on dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('User sees error with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(testUser.email, 'wrongpassword');

    // Verify error message shown
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Invalid credentials');
  });
});
```

### Step 8: Create npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke --project=chromium",
    "test:critical": "playwright test --grep @critical --project=chromium",
    "test:feature:auth": "playwright test tests/e2e/features/auth --project=chromium",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

### Step 9: Run Tests

```bash
# Run smoke tests
npm run test:smoke

# Run specific test file
npx playwright test tests/e2e/critical/auth-workflow.spec.js

# Run with headed browser (see what's happening)
npm run test:headed

# Debug mode (step through)
npm run test:debug
```

---

## Bruno Setup (API Testing)

### Step 1: Install Bruno

```bash
# Via npm
npm install -D @usebruno/cli

# Or download from https://www.usebruno.com/
```

### Step 2: Create Bruno Collection Structure

```bash
mkdir -p tests/api
# Bruno will create this structure automatically
```

### Step 3: Initialize Bruno Collection

```bash
# Create bruno.json in tests/api/
{
  "version": "1",
  "name": "API Tests",
  "uid": "api-test-collection"
}
```

### Step 4: Create Environment Files

Create `tests/api/environments/local.bru`:

```
vars {
  base_url: http://localhost:3001/api
  auth_token: {{access_token}}
}
```

Create `tests/api/environments/staging.bru`:

```
vars {
  base_url: https://staging.example.com/api
  auth_token: {{access_token}}
}
```

### Step 5: Create API Test Template

Create `tests/api/BRUNO_REQUEST_TEMPLATE.bru`:

```
meta {
  name: [Request Name]
  desc: [Brief description]
  seq: 1
}

auth: bearer {{auth_token}}

[METHOD] {
  url: {{base_url}}/[endpoint]
  body: [json|form|xml]
  auth: [none|bearer|basic]
}

headers {
  Content-Type: application/json
}

body:json {
  {
    "field": "value"
  }
}

tests {
  test("Status is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Response has expected field", function() {
    expect(res.getBody().field).to.exist;
  });
}

script:pre-request {
  // Pre-request setup if needed
  bru.setEnvVar("timestamp", Date.now());
}
```

### Step 6: Create Auth Request

Create `tests/api/auth/login.bru`:

```
meta {
  name: Login
  desc: Authenticate user and get token
  seq: 1
}

post {
  url: {{base_url}}/auth/login
}

headers {
  Content-Type: application/json
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
    const body = res.getBody();
    expect(body.token).to.exist;
    expect(body.token.length).to.be.greaterThan(0);

    // Save token for subsequent requests
    bru.setEnvVar("access_token", body.token);
  });

  test("Token is JWT format", function() {
    const body = res.getBody();
    const parts = body.token.split('.');
    expect(parts.length).to.equal(3);
  });
}
```

### Step 7: Create CRUD Tests

Create `tests/api/projects/create-project.bru`:

```
meta {
  name: Create Project
  desc: Create a new project
  seq: 2
}

auth: bearer {{auth_token}}

post {
  url: {{base_url}}/projects
}

headers {
  Content-Type: application/json
}

body:json {
  {
    "title": "Test Project {{timestamp}}",
    "description": "Automated test project",
    "category": "Development"
  }
}

tests {
  test("Status is 201 Created", function() {
    expect(res.getStatus()).to.equal(201);
  });

  test("Response has project ID", function() {
    const body = res.getBody();
    expect(body.id).to.exist;
    bru.setEnvVar("project_id", body.id);
  });

  test("Project has all fields", function() {
    const body = res.getBody();
    expect(body.title).to.exist;
    expect(body.description).to.exist;
    expect(body.createdAt).to.exist;
  });
}
```

### Step 8: Run Bruno Tests

```bash
# Run all tests in collection
bruno run tests/api --env local

# Run specific request
bruno run tests/api/auth/login.bru --env local

# Export results
bruno run tests/api --env local --output report.json
```

---

## Flutter Setup (Mobile Testing)

### Step 1: Create Test Directory

```bash
mkdir -p test/integration
mkdir -p test/helpers
```

### Step 2: Create pubspec.yaml Dependencies

Add to `pubspec.yaml`:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  flutter_driver:
    sdk: flutter
```

### Step 3: Create Test Helper

Create `test/helpers/test_data.dart`:

```dart
class TestUser {
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  TestUser({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
  });

  static TestUser createTestUser() {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    return TestUser(
      email: 'test+$timestamp@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
    );
  }
}
```

### Step 4: Create Test Helper Functions

Create `test/helpers/test_helpers.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';

Future<void> loginUser(
  WidgetTester tester,
  String email,
  String password,
) async {
  // Tap login button
  await tester.tap(find.text('Login'));
  await tester.pumpAndSettle();

  // Enter email
  await tester.enterText(
    find.byType(TextFormField).first,
    email,
  );

  // Enter password
  await tester.enterText(
    find.byType(TextFormField).last,
    password,
  );

  // Tap login
  await tester.tap(find.text('Sign In'));
  await tester.pumpAndSettle();
}

Future<void> logout(WidgetTester tester) async {
  // Open menu
  await tester.tap(find.byIcon(Icons.menu));
  await tester.pumpAndSettle();

  // Tap logout
  await tester.tap(find.text('Logout'));
  await tester.pumpAndSettle();
}
```

### Step 5: Create Integration Test

Create `test/integration/auth_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:your_app/main.dart';
import '../helpers/test_helpers.dart';
import '../helpers/test_data.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Authentication Tests', () {
    final testUser = TestUser.createTestUser();

    testWidgets('User can login', (WidgetTester tester) async {
      await tester.binding.window.physicalSizeTestValue =
        const Size(1080, 1920);

      addTearDown(tester.binding.window.clearPhysicalSizeTestValue);

      await tester.pumpWidget(const MyApp());
      await tester.pumpAndSettle();

      // Login
      await loginUser(tester, testUser.email, testUser.password);

      // Verify on dashboard
      expect(find.text('Dashboard'), findsOneWidget);
    });

    testWidgets('Wrong password shows error', (WidgetTester tester) async {
      await tester.binding.window.physicalSizeTestValue =
        const Size(1080, 1920);

      await tester.pumpWidget(const MyApp());
      await tester.pumpAndSettle();

      await loginUser(tester, testUser.email, 'wrongpassword');

      // Verify error shown
      expect(find.text('Invalid credentials'), findsOneWidget);
    });
  });
}
```

### Step 6: Create npm Scripts

Add to `pubspec.yaml`:

```yaml
scripts:
  test:integration: flutter test integration_test/
  test:all: flutter test
```

### Step 7: Run Tests

```bash
# Run integration tests
flutter test integration_test/auth_test.dart

# Run on specific device
flutter test integration_test/ -d chrome

# Run with verbose output
flutter test integration_test/ -v
```

---

## Common Configuration

### Create .env.test File

```bash
# .env.test (add to .gitignore)
# Application URLs
TEST_BASE_URL=http://localhost:3001
TEST_API_URL=http://localhost:3001/api
TEST_WS_URL=ws://localhost:3001

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=SecureTestPass123!
TEST_USER_FIRST_NAME=Test
TEST_USER_LAST_NAME=User

# Database
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=app_test
TEST_DB_USER=test_user
TEST_DB_PASSWORD=test_password

# Test Behavior
TEST_TIMEOUT=30000
TEST_RETRIES=0
TEST_WORKERS=4
TEST_HEADLESS=true
TEST_SLOW_MO=0

# Reporting
TEST_REPORT_FORMAT=html,json
TEST_SCREENSHOT_ON_FAILURE=true
TEST_VIDEO_ON_FAILURE=true
```

### Create .env.example

```bash
# .env.example (commit this)
TEST_BASE_URL=http://localhost:3001
TEST_API_URL=http://localhost:3001/api
TEST_USER_EMAIL=test@example.com
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=app_test
```

### Load Environment Variables

```javascript
// tests/config/env.js
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
dotenv.config({ path: '.env.test.local' });

export const config = {
  baseURL: process.env.TEST_BASE_URL || 'http://localhost:3001',
  apiURL: process.env.TEST_API_URL || 'http://localhost:3001/api',
  timeout: parseInt(process.env.TEST_TIMEOUT || '30000'),
  headless: process.env.TEST_HEADLESS !== 'false',
};

export default config;
```

---

## Test Data Setup

### Create Fixture Files

Create `tests/fixtures/users.json`:

```json
{
  "admin": {
    "email": "admin@test.example.com",
    "password": "SecureTestPass123!",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User"
  },
  "regular": {
    "email": "user@test.example.com",
    "password": "SecureTestPass123!",
    "role": "user",
    "firstName": "Regular",
    "lastName": "User"
  }
}
```

### Create Database Seeding Script

Create `tests/helpers/db-helpers.js`:

```javascript
import { sql } from 'your-db-client';

export async function seedTestUser(userData) {
  /**
   * Create a test user in the database
   */
  const result = await sql`
    INSERT INTO users (email, password, first_name, last_name, role)
    VALUES (${userData.email}, ${userData.password},
            ${userData.firstName}, ${userData.lastName}, ${userData.role})
    RETURNING id, email
  `;

  return result[0];
}

export async function deleteTestUser(userId) {
  /**
   * Clean up test user
   */
  await sql`
    DELETE FROM users WHERE id = ${userId}
  `;
}

export async function clearTestDatabase() {
  /**
   * Clean slate for tests
   */
  await sql`DELETE FROM users WHERE email LIKE '%@test.example.com%'`;
  await sql`DELETE FROM projects WHERE owner_id IN
    (SELECT id FROM users WHERE email LIKE '%@test.example.com%')`;
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: app_test
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Create test database
        env:
          PGHOST: localhost
          PGUSER: postgres
          PGPASSWORD: test_password
        run: |
          psql -c "CREATE DATABASE app_test;"
          psql app_test < database/test-schema.sql

      - name: Run smoke tests
        run: npm run test:smoke

      - name: Run critical tests
        run: npm run test:critical

      - name: Run full test suite
        run: npm run test:all

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
          retention-days: 7

      - name: Publish test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## Testing Best Practices

### 1. Keep Tests Independent

```javascript
// ❌ BAD - Test depends on previous test
test('create project', () => { /* ... */ });
test('edit project', () => {
  // Assumes previous test created a project
  const projectId = window.lastCreatedProjectId;
});

// ✅ GOOD - Each test sets up its own data
test('create project', async () => {
  const project = await createTestProject();
  // ...
});

test('edit project', async () => {
  const project = await createTestProject();
  // Now edit it
});
```

### 2. Use Meaningful Names

```javascript
// ❌ BAD
test('test 1', () => {});
test('user flow', () => {});

// ✅ GOOD
test('user can sign up and log in', () => {});
test('search filters narrow results by category', () => {});
```

### 3. Follow AAA Pattern (Arrange-Act-Assert)

```javascript
test('user can log in', async ({ page }) => {
  // ARRANGE (Setup)
  const testUser = await createTestUser();

  // ACT (Do something)
  await loginPage.login(testUser.email, testUser.password);

  // ASSERT (Check result)
  await expect(page).toHaveURL('/dashboard');
});
```

### 4. Clean Up After Tests

```javascript
test('user can create project', async ({ page }) => {
  // Create
  const project = await createTestProject();

  // Test
  await testProject(project);

  // Cleanup - always do this!
  test.afterEach(async () => {
    await deleteTestProject(project.id);
  });
});
```

### 5. Wait for Elements Properly

```javascript
// ❌ BAD - Hardcoded waits
await page.waitForTimeout(1000);

// ✅ GOOD - Wait for actual elements
await expect(page.locator('.results')).toBeVisible();
await page.waitForURL('/results');
```

---

## Troubleshooting

### Playwright Issues

**Issue**: "Timed out waiting for element"
```
Solution:
1. Check selector is correct: await page.locator('selector').isVisible()
2. Add wait time: await page.waitForSelector('selector', { timeout: 5000 })
3. Check if element is in iframe: frame.locator('selector')
4. Add debug: await page.pause() to step through
```

**Issue**: "page.goto: net::ERR_CONNECTION_REFUSED"
```
Solution:
1. Verify dev server running: npm run dev
2. Check baseURL in config matches actual port
3. Verify .env.test has correct TEST_BASE_URL
```

**Issue**: Flaky tests passing/failing randomly
```
Solution:
1. Replace arbitrary waits with element waits
2. Ensure proper cleanup between tests
3. Check for race conditions in async code
4. Use waitForLoadState() for navigation
```

### Database Issues

**Issue**: "Cannot create test user - email already exists"
```
Solution:
1. Run cleanup: npm run test:cleanup
2. Check database for orphaned test records
3. Use timestamps for unique test data
```

**Issue**: "Database connection refused"
```
Solution:
1. Verify database running: psql -l
2. Check TEST_DB_HOST, TEST_DB_PORT in .env.test
3. Verify test database exists: createdb app_test
```

---

## Next Steps

1. Follow setup instructions for your tech stack
2. Create first test using templates
3. Run locally to verify working
4. Proceed to [AGENT_TESTING_RULES.md](AGENT_TESTING_RULES.md)
5. Integrate with CI/CD pipeline

