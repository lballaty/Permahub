# Testing Quick Reference

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/testing/QUICK_REFERENCE.md

**Description:** Quick reference guide for running tests

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

---

## 🚀 Common Commands

### Quick Tests (< 2 minutes)

```bash
npm run test:smoke          # Health check (30 seconds)
npm run test:quick          # Same as smoke
npm run test:critical       # Critical paths only (1-2 min)
```

### By Test Type

```bash
npm run test:unit           # Unit tests (fast)
npm run test:integration    # Integration tests (medium)
npm run test:e2e            # E2E tests (slow)
npm run test:all            # Everything
```

### By Feature

```bash
npm run test:wiki           # Wiki features
npm run test:auth           # Authentication
npm run test:database       # Database tests
npm run test:search         # Search functionality
npm run test:filters        # Filter tests
```

### By Device

```bash
npm run test:mobile         # Mobile tests
npm run test:responsive     # Responsive design
npm run test:browsers       # All browsers
npm run test:cross-browser  # Smoke tests on all browsers
```

### Debug & Development

```bash
npm run test:e2e:ui         # Interactive UI
npm run test:e2e:headed     # See browser
npm run test:debug          # Debug mode
npm run test:headed:slow    # Slow motion
npm run test:report         # View last report
```

### Specific Areas

```bash
# Wiki pages
npm run test:integration:wiki

# Auth flows
npm run test:integration:auth

# Smoke tests
npm run test:e2e:smoke

# Regression tests
npm run test:e2e:regression
```

---

## 🏷️ Tag Reference

### Run tests by tag

```bash
# Syntax
npx playwright test --grep @tag

# Examples
npx playwright test --grep @critical
npx playwright test --grep @wiki
npx playwright test --grep @smoke
npx playwright test --grep @mobile
npx playwright test --grep "@unit.*@auth"
npx playwright test --grep-invert @e2e
```

### Available Tags

**Levels:** `@unit`, `@integration`, `@e2e`

**Features:** `@wiki`, `@auth`, `@database`, `@supabase`, `@i18n`, `@map`, `@search`, `@filters`, `@favorites`, `@crud`

**Priority:** `@critical`, `@smoke`, `@regression`

**Environment:** `@mobile`, `@responsive`, `@tablet`, `@a11y`

---

## 📋 Test Workflow

### Before Commit

```bash
npm run test:smoke
```

### Before PR

```bash
npm run test:ci
```

### Before Release

```bash
npm run test:all
npm run test:cross-browser
```

### During Development

```bash
npm run test:e2e:ui
```

---

## 🎯 Test Suite Structure

```
tests/
├── unit/                   # Fast isolated tests
│   ├── supabase/          # Database client tests
│   ├── utils/             # Utility function tests
│   └── helpers/           # Helper function tests
│
├── integration/           # Component/page tests
│   ├── wiki/              # Wiki page tests
│   ├── auth/              # Auth flow tests
│   └── pages/             # Other page tests
│
└── e2e/                   # Full user journeys
    ├── critical-paths/    # Must-pass scenarios
    ├── regression/        # Catch regressions
    └── smoke/             # Quick health checks
```

---

## 🔍 Finding Tests

```bash
# List all tests
npx playwright test --list

# List tests matching pattern
npx playwright test --list --grep @wiki

# List tests in specific file
npx playwright test --list tests/unit/supabase/client.spec.js
```

---

## 🐛 Quick Troubleshooting

### Tests failing?

1. Check dev server is running: `http://localhost:3000`
2. Check Supabase is connected
3. Clear cache: `rm -rf node_modules && npm install`
4. Reinstall browsers: `npx playwright install`

### Flaky tests?

```bash
# Run with retries
npx playwright test --retries=2

# Run specific test multiple times
npx playwright test --repeat-each=5 tests/path/to/test.spec.js
```

### Need more info?

```bash
# Verbose output
npx playwright test --reporter=line

# Show trace
npx playwright test --trace on

# Debug specific test
npx playwright test --debug tests/path/to/test.spec.js
```

---

## ⚡ Pro Tips

### 1. Run specific test

```bash
# By name
npx playwright test --grep "should display guides"

# By file
npx playwright test tests/unit/supabase/client.spec.js
```

### 2. Run tests in parallel

```bash
# Default (parallel)
npm run test:e2e

# Force sequential
npx playwright test --workers=1
```

### 3. Update snapshots

```bash
npx playwright test --update-snapshots
```

### 4. Run on specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 5. Generate report

```bash
# After tests run
npm run test:report

# Or
npx playwright show-report
```

---

## 📊 Test Execution Time

| Command | Approx Time | Tests Run |
|---------|-------------|-----------|
| `npm run test:smoke` | 30s | ~20 tests |
| `npm run test:critical` | 1-2 min | ~30 tests |
| `npm run test:unit` | 1 min | ~50 tests |
| `npm run test:integration` | 3-5 min | ~100 tests |
| `npm run test:e2e` | 5-10 min | ~80 tests |
| `npm run test:all` | 10-15 min | ~230+ tests |

---

## 🎨 Visual Testing

```bash
# Run with UI mode (best for development)
npm run test:e2e:ui

# Run headed (see browser)
npm run test:e2e:headed

# Slow motion
npm run test:headed:slow
```

---

## 📱 Mobile Testing

```bash
# All mobile tests
npm run test:mobile

# Specific mobile browser
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari

# Tablet
npx playwright test --project=tablet
```

---

## 🔐 Environment Setup

### Required

1. Dev server running on port 3000
2. Supabase connection (local or cloud)
3. `.env` file with credentials

### Optional

1. `SLOW_MO=100` - Slow motion mode
2. `CI=true` - CI environment settings

---

## 📖 More Information

See [/docs/testing/README.md](README.md) for complete documentation.

---

**Quick Help:**

```bash
npx playwright test --help
```

**Last Updated:** 2025-11-16
