# Permahub Test Suite

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/README.md

**Description:** Comprehensive testing documentation for Permahub

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-07

---

## 📋 Test Structure

```
/tests
├── unit/                   # Unit tests (Vitest)
│   ├── i18n.test.js       # i18n system tests
│   ├── config.test.js     # Configuration tests
│   └── supabase-client.test.js  # Supabase client tests
│
├── e2e/                    # End-to-end tests (Playwright)
│   ├── auth.spec.js       # Authentication flows
│   ├── dashboard.spec.js  # Project discovery
│   ├── resources.spec.js  # Marketplace
│   ├── map.spec.js        # Map functionality
│   └── complete-flow.spec.js  # Full user journey
│
└── README.md              # This file
```

---

## 🚀 Running Tests

### Install Test Dependencies

```bash
npm install --save-dev vitest @testing-library/dom jsdom
npm install --save-dev @playwright/test
```

### Run Unit Tests

```bash
npm run test:unit    # Run once and exit
npm run test         # Watch mode
npm run test:ui      # Visual dashboard
```

### Run E2E Tests

```bash
npm run test:e2e     # Run all E2E tests
npm run test:e2e -- --ui  # Visual mode
```

### Run All Tests

```bash
npm run test:all     # Unit + E2E
```

---

## 🧪 Unit Tests (Vitest)

Location: `/tests/unit/`

### i18n Tests (`i18n.test.js`)
Tests the multi-language translation system:
- ✅ Language initialization
- ✅ Translation key lookup
- ✅ Language switching
- ✅ Fallback to English
- ✅ Missing key handling
- ✅ LocalStorage persistence
- ✅ Browser language detection
- ✅ All 3 languages (en, pt, es)

### Config Tests (`config.test.js`)
Tests environment configuration:
- ✅ Loads VITE_SUPABASE_URL
- ✅ Loads VITE_SUPABASE_ANON_KEY
- ✅ Loads VITE_SUPABASE_SERVICE_ROLE_KEY
- ✅ Fallback values work
- ✅ Environment detection

### Supabase Client Tests (`supabase-client.test.js`)
Tests the Supabase API wrapper:
- ✅ Client initialization
- ✅ Authentication headers
- ✅ API request formatting
- ✅ Query parameter building
- ✅ Error handling
- ✅ Response parsing

---

## 🎭 E2E Tests (Playwright)

Location: `/tests/e2e/`

### Authentication Tests (`auth.spec.js`)

**Test: User Registration**
- Navigate to `/auth.html`
- Wait for splash screen
- Click "Register" tab
- Fill email and password
- Click sign up button
- Verify success message
- Check user in Supabase

**Test: User Login**
- Navigate to `/auth.html`
- Click "Login" tab
- Fill email and password
- Click login button
- Verify redirect to dashboard
- Check session persists

**Test: Magic Link Email**
- Navigate to `/auth.html`
- Enter email
- Click "Send Magic Link"
- Verify email sent message
- (In real test: open email, click link)

**Test: Password Reset**
- Navigate to `/auth.html`
- Click "Forgot Password"
- Enter email
- Click reset button
- Verify reset email sent

**Test: Logout**
- Login to app
- Click user menu
- Click logout
- Verify redirected to home
- Check session cleared

**Test: Profile Completion**
- Login to app
- Verify profile completion form
- Fill full name, bio, location
- Select skills and interests
- Click save
- Verify profile updated in database

### Dashboard Tests (`dashboard.spec.js`)

**Test: Load Dashboard**
- Login to app
- Navigate to `/dashboard.html`
- Verify page loads
- Check projects display

**Test: Filter by Type**
- On dashboard
- Click type filter dropdown
- Select "Permaculture"
- Verify projects filtered
- Results show only selected type

**Test: Filter by Location**
- On dashboard
- Enter location search
- Verify results update
- Shows nearby projects

**Test: Search Projects**
- On dashboard
- Enter search term
- Verify results show matching projects
- Clear search returns all

**Test: Project Details**
- On dashboard
- Click project card
- Navigate to `/project.html?id=...`
- Verify project details load
- Check map with project location
- Verify contact info shows

**Test: Add to Favorites**
- On dashboard
- Click heart icon on project
- Verify added to favorites
- Check in user's favorites

---

### Map Tests (`map.spec.js`)

**Test: Map Loads**
- Navigate to `/map.html`
- Verify Leaflet.js loads
- Check map container visible
- Verify OpenStreetMap tiles load

**Test: Project Markers**
- On map page
- Verify projects display as markers
- Check marker count matches database
- Click marker shows project info

**Test: Marker Click Navigation**
- On map
- Click marker
- Verify popup shows project name
- Click "View Details" link
- Navigate to project page

**Test: Distance Radius Filter**
- On map
- Find radius slider (5-500km)
- Change radius
- Verify markers update
- Only show projects within radius

**Test: Map Interaction**
- On map
- Drag/pan map
- Zoom in and out
- Verify markers stay visible
- No errors in console

---

### Resources Tests (`resources.spec.js`)

**Test: Load Resources**
- Navigate to `/resources.html`
- Verify page loads
- Check resources display
- Verify list populated

**Test: Filter by Category**
- On resources page
- Click category filter
- Select category (Seeds, Tools, etc.)
- Verify filtered results
- Results match selected category

**Test: Filter by Price**
- On resources page
- Set price range
- Verify results updated
- Only show items in range

**Test: Search Resources**
- On resources page
- Enter search term
- Verify results updated
- Results match search term
- Clear search shows all

**Test: Contact Provider**
- On resources page
- Click resource
- Find contact button
- Verify email/phone shows
- Contact link works

**Test: Add Resource to Favorites**
- On resources page
- Click heart on resource
- Verify added to favorites
- Check in user's favorites

**Test: Add New Resource**
- On `/add-item.html`
- Select "Resource"
- Fill resource details
- Upload image
- Set price and category
- Click submit
- Verify resource created in database

---

### Complete Flow Tests (`complete-flow.spec.js`)

**Test: New User Journey**
1. Visit landing page
2. Click "Get Started"
3. Register with email
4. Complete profile
5. Verify in dashboard
6. Search for projects
7. View project details
8. Check on map
9. Browse resources
10. Add favorite resource
11. Verify in profile

**Test: Project Creator Journey**
1. Login as user
2. Navigate to "Add Item"
3. Create new project
4. Fill all details
5. Upload images
6. Set location on map
7. Submit
8. Verify appears in dashboard
9. Check on map
10. Verify editable by creator

**Test: Language Switching**
1. Verify English translations load
2. Click language switcher
3. Select Portuguese
4. Verify all text translates
5. Reload page
6. Verify language persists
7. Switch to Spanish
8. Verify Spanish translations
9. Check all pages translate

**Test: Multi-Device Responsive**
1. Test desktop view (1200px+)
2. Test tablet view (768px)
3. Test mobile view (< 768px)
4. Verify layout adapts
5. Verify touch interactions work
6. No horizontal scroll on mobile

---

## 📊 Test Coverage Goals

| Component | Coverage | Priority |
|-----------|----------|----------|
| i18n System | 100% | High |
| Authentication | 90% | High |
| Dashboard | 85% | High |
| Map Features | 80% | High |
| Resources | 85% | High |
| Profile | 80% | Medium |
| Navigation | 100% | High |
| Responsive Design | 95% | High |
| RLS Policies | 70% | Medium |
| Performance | 75% | Medium |

**Target: 85%+ overall coverage**

---

## ✅ Test Execution Checklist

### Pre-Test Setup
- [ ] Database migrations complete
- [ ] All 14 tables created
- [ ] RLS policies enabled
- [ ] Test user created in Supabase
- [ ] Dev server running
- [ ] Browser cache cleared

### During Tests
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] No 403 permission errors
- [ ] No console errors
- [ ] All network requests successful
- [ ] Database queries work correctly

### After Tests
- [ ] Generate coverage report
- [ ] Review any failing tests
- [ ] Fix issues found
- [ ] Re-run tests until all pass
- [ ] Check performance metrics
- [ ] Document results

---

## 🐛 Debugging Tests

### View Test Output
```bash
# Detailed console output
npm run test:unit -- --reporter=verbose

# Visual UI dashboard
npm run test:ui
```

### Debug Playwright Tests
```bash
# Open Playwright Inspector
npm run test:e2e -- --debug

# View test steps in browser
npm run test:e2e -- --headed
```

### Check Supabase During Tests
1. Open Supabase Dashboard
2. Navigate to **Logs**
3. Watch real-time query execution
4. Check for RLS policy errors
5. Monitor performance

---

## 📈 Continuous Testing

### Watch Mode (Vitest)
```bash
npm run test
# Reruns tests when files change
# Useful during development
```

### Headed Mode (Playwright)
```bash
npm run test:e2e -- --headed
# Opens browser window
# See tests running live
# Great for debugging
```

---

## 🔗 Related Files

- `IMMEDIATE_ACTIONS.md` - Get database connected
- `DEVELOPMENT.md` - Development guide
- `SUPABASE_SETUP_GUIDE.md` - Database setup
- `.claude/claude.md` - Coding standards
- `/package.json` - Test scripts

---

## 🚀 Next Steps

1. Run Supabase migrations (IMMEDIATE_ACTIONS.md)
2. Verify database connection
3. Install test dependencies: `npm install --save-dev vitest @testing-library/dom jsdom @playwright/test`
4. Create test files (templates provided below)
5. Run tests: `npm run test:unit`
6. Fix any failures
7. Run E2E tests: `npm run test:e2e`
8. Achieve 85%+ coverage
9. Deploy with confidence!

---

**Ready to test? Let's do this! 🚀**
