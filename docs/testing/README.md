# Permahub Testing Documentation

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/testing/README.md

**Description:** Comprehensive testing strategy and documentation for Permahub

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Architecture](#test-architecture)
3. [Test Types](#test-types)
4. [Running Tests](#running-tests)
5. [Tag System](#tag-system)
6. [Writing Tests](#writing-tests)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Permahub uses a **3-tier testing strategy**:

1. **Unit Tests** - Fast, isolated function tests
2. **Integration Tests** - Component and page-level tests
3. **E2E Tests** - Full user journey tests

**Testing Framework:** Playwright Test (for all test types)

**Coverage Goals:**
- Unit tests: 80%+ coverage of core functions
- Integration tests: All major page components
- E2E tests: All critical user paths

---

## 🏗️ Test Architecture

```
tests/
├── unit/                           # Unit tests (fast, isolated)
│   ├── supabase/
│   │   ├── client.spec.js          @unit @supabase @database
│   │   └── wiki-api.spec.js        @unit @wiki @api
│   ├── utils/
│   │   ├── i18n.spec.js            @unit @i18n @localization
│   │   └── version.spec.js         @unit @version
│   └── helpers/
│       └── date-formatter.spec.js  @unit @helpers @date
│
├── integration/                    # Integration tests (medium)
│   ├── wiki/
│   │   ├── home-page.spec.js       @integration @wiki @home @database
│   │   ├── events-page.spec.js     @integration @wiki @events @database
│   │   ├── map-page.spec.js        @integration @wiki @map @leaflet @database
│   │   ├── guide-page.spec.js      @integration @wiki @guide @database
│   │   └── editor.spec.js          @integration @wiki @editor @crud
│   ├── auth/
│   │   ├── login.spec.js           @integration @auth @login
│   │   ├── signup.spec.js          @integration @auth @signup
│   │   ├── password-reset.spec.js  @integration @auth @password-reset
│   │   └── oauth.spec.js           @integration @auth @oauth
│   └── pages/
│       ├── dashboard.spec.js       @integration @dashboard
│       ├── projects.spec.js        @integration @projects
│       └── resources.spec.js       @integration @resources
│
└── e2e/                            # End-to-end tests (slow)
    ├── critical-paths/
    │   ├── user-registration-flow.spec.js   @e2e @critical @auth-flow
    │   ├── guide-creation-flow.spec.js      @e2e @critical @content-creation
    │   ├── event-registration-flow.spec.js  @e2e @critical @event-registration
    │   └── search-and-discover.spec.js      @e2e @critical @search
    ├── regression/
    │   ├── navigation.spec.js      @e2e @regression @navigation
    │   ├── filters.spec.js         @e2e @regression @filters
    │   ├── favorites.spec.js       @e2e @regression @favorites
    │   └── mobile-responsive.spec.js @e2e @regression @mobile @responsive
    └── smoke/
        └── health-check.spec.js    @e2e @smoke @health-check
```

---

## 🧪 Test Types

### Unit Tests

**Purpose:** Test individual functions in isolation

**Characteristics:**
- Very fast (< 100ms per test)
- No external dependencies
- Mock database calls
- Focus on business logic

**Example:**
```javascript
test('should validate email format', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
  expect(isValidEmail('invalid')).toBe(false);
});
```

### Integration Tests

**Purpose:** Test components and pages with real dependencies

**Characteristics:**
- Medium speed (100ms - 2s per test)
- Real database connections
- Test component interactions
- Verify UI rendering

**Example:**
```javascript
test('should display guides from database', async ({ page }) => {
  await page.goto('/src/wiki/wiki-home.html');
  const guides = await page.locator('#guidesGrid .card');
  expect(await guides.count()).toBeGreaterThan(0);
});
```

### End-to-End Tests

**Purpose:** Test complete user journeys

**Characteristics:**
- Slow (2s - 30s per test)
- Full stack testing
- Real user interactions
- Multi-page flows

**Example:**
```javascript
test('user can create and publish guide', async ({ page }) => {
  await page.goto('/src/wiki/wiki-login.html');
  await login(page);
  await page.goto('/src/wiki/wiki-editor.html');
  await fillGuideForm(page);
  await publishGuide(page);
  await verifyGuidePublished(page);
});
```

---

## 🚀 Running Tests

### Quick Start

```bash
# Run smoke tests (fastest health check)
npm run test:smoke

# Run all unit tests
npm run test:unit

# Run all integration tests
npm run test:integration

# Run complete test suite
npm run test:all
```

### By Test Type

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Smoke tests (quick health check)
npm run test:smoke

# Critical path tests
npm run test:critical
```

### By Feature

```bash
# All wiki tests
npm run test:wiki

# All authentication tests
npm run test:auth

# All database tests
npm run test:database

# All search tests
npm run test:search

# All filter tests
npm run test:filters
```

### By Browser

```bash
# Run on all browsers (Chrome, Firefox, Safari)
npm run test:browsers

# Run smoke tests cross-browser
npm run test:cross-browser

# Mobile tests
npm run test:mobile

# Responsive design tests
npm run test:responsive
```

### Debug Mode

```bash
# Open Playwright UI
npm run test:e2e:ui

# Run with headed browsers
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:debug

# Slow motion (easier to follow)
npm run test:headed:slow

# Generate trace files
npm run test:trace
```

### CI/CD

```bash
# Run CI test suite (smoke + critical + integration)
npm run test:ci

# Generate coverage report
npm run test:coverage
```

---

## 🏷️ Tag System

Tests use tags for flexible filtering and organization.

### Test Level Tags

| Tag | Description | Speed |
|-----|-------------|-------|
| `@unit` | Unit tests | < 100ms |
| `@integration` | Integration tests | 100ms - 2s |
| `@e2e` | End-to-end tests | 2s - 30s |

### Feature Area Tags

| Tag | Description |
|-----|-------------|
| `@wiki` | Wiki functionality |
| `@auth` | Authentication |
| `@database` | Requires database |
| `@supabase` | Supabase-specific |
| `@i18n` | Internationalization |
| `@map` | Map/geolocation |
| `@search` | Search functionality |
| `@filters` | Filtering features |
| `@favorites` | Favorites/bookmarks |
| `@crud` | Create/Read/Update/Delete |

### Priority Tags

| Tag | Description |
|-----|-------------|
| `@critical` | Must pass before deployment |
| `@smoke` | Quick health checks |
| `@regression` | Catch regressions |

### Environment Tags

| Tag | Description |
|-----|-------------|
| `@mobile` | Mobile-specific |
| `@responsive` | Responsive design |
| `@tablet` | Tablet-specific |
| `@a11y` | Accessibility |

### Using Tags

```bash
# Run only critical tests
npx playwright test --grep @critical

# Run wiki tests
npx playwright test --grep @wiki

# Run unit tests for authentication
npx playwright test --grep "@unit.*@auth"

# Run all tests except E2E
npx playwright test --grep-invert @e2e

# Run smoke tests for wiki
npx playwright test --grep "@smoke.*@wiki"
```

---

## ✍️ Writing Tests

### Test File Template

```javascript
/*
 * File: /path/to/test.spec.js
 * Description: Purpose of this test suite
 * Author: Your Name <email@example.com>
 * Created: YYYY-MM-DD
 *
 * Tags: @level @feature @priority
 */

import { test, expect, describe } from '@playwright/test';

describe('Feature Name - Test Type @tag1 @tag2', () => {

  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test.describe('Category of Tests', () => {

    test('should do something specific @additional-tag', async ({ page }) => {
      // Test code
      await page.goto('/path/to/page');

      // Assertions
      await expect(page.locator('.element')).toBeVisible();
    });
  });
});
```

### Best Practices

#### 1. Clear Test Names

✅ **Good:**
```javascript
test('should display error message for invalid email format', async ({ page }) => {
  // ...
});
```

❌ **Bad:**
```javascript
test('email test', async ({ page }) => {
  // ...
});
```

#### 2. Use Page Objects for Complex Interactions

```javascript
// page-objects/wiki-home.js
export class WikiHomePage {
  constructor(page) {
    this.page = page;
    this.guidesGrid = page.locator('#guidesGrid');
    this.categoryFilters = page.locator('.category-filter');
  }

  async goto() {
    await this.page.goto('/src/wiki/wiki-home.html');
  }

  async selectCategory(categoryName) {
    await this.categoryFilters.filter({ hasText: categoryName }).click();
  }
}

// In test file
const wikiHome = new WikiHomePage(page);
await wikiHome.goto();
await wikiHome.selectCategory('Gardening');
```

#### 3. Tag Appropriately

```javascript
// Multiple tags for flexibility
test('should filter guides by category @integration @wiki @filters @database', async ({ page }) => {
  // ...
});
```

#### 4. Handle Timeouts Gracefully

```javascript
// Wait for element with reasonable timeout
await page.waitForSelector('.card', { timeout: 5000 });

// Use custom timeouts for slow operations
await expect(page.locator('.loader')).not.toBeVisible({ timeout: 10000 });
```

#### 5. Clean Up After Tests

```javascript
test.afterEach(async ({ page }) => {
  // Clear localStorage
  await page.evaluate(() => localStorage.clear());

  // Close any open dialogs
  await page.keyboard.press('Escape');
});
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run smoke tests
        run: npm run test:smoke

      - name: Run critical tests
        run: npm run test:critical

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running smoke tests..."
npm run test:smoke

if [ $? -ne 0 ]; then
  echo "❌ Smoke tests failed. Commit aborted."
  exit 1
fi

echo "✅ Tests passed!"
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Install Playwright browsers
npx playwright install
```

#### 2. Tests timing out

**Solution:**
- Increase timeout in playwright.config.js
- Check if dev server is running on port 3000
- Verify Supabase connection

#### 3. Database connection errors

**Solution:**
```bash
# Check Supabase is running
# For local: supabase status

# Verify .env file has correct credentials
cat .env | grep VITE_SUPABASE
```

#### 4. Flaky tests

**Solution:**
- Add explicit waits: `await page.waitForTimeout(500)`
- Use `waitForSelector` instead of `locator().click()`
- Increase retries in CI: `retries: 2`

#### 5. Browser launch failures

**Solution:**
```bash
# Install system dependencies (Linux)
npx playwright install-deps

# macOS - install browsers
npx playwright install
```

### Debug Tips

```bash
# View last test report
npm run test:report

# Run single test file
npx playwright test tests/unit/supabase/client.spec.js

# Run tests matching pattern
npx playwright test --grep "should display guides"

# Show browser during test
npx playwright test --headed --project=chromium

# Pause on failure
npx playwright test --debug
```

---

## 📊 Test Reports

### HTML Report

```bash
# Generate and view report
npm run test:e2e
npm run test:report
```

### JSON Report

Located at: `test-results/results.json`

### Screenshots and Videos

- Screenshots: `test-results/`  (on failure)
- Videos: `test-results/` (on failure)
- Traces: `test-results/` (on retry)

---

## 📈 Coverage Goals

| Test Type | Target Coverage |
|-----------|-----------------|
| Unit Tests | 80%+ |
| Integration Tests | All major pages |
| E2E Tests | All critical paths |

### Checking Coverage

```bash
npm run test:coverage
```

---

## 🎯 Test Strategy Summary

**Daily Development:**
```bash
npm run test:smoke  # Before committing
```

**Before PR:**
```bash
npm run test:ci  # Smoke + Critical + Integration
```

**Before Release:**
```bash
npm run test:all  # Full suite
npm run test:cross-browser  # Multi-browser
```

**Quick Iteration:**
```bash
npm run test:e2e:ui  # Interactive UI
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](../architecture/testing-best-practices.md)
- [Writing Maintainable Tests](../architecture/test-maintenance.md)

---

**Last Updated:** 2025-11-16

**Maintained By:** Libor Ballaty <libor@arionetworks.com>
