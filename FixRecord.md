# Fix Record

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/FixRecord.md

**Description:** Sequential record of all fixes, bugs, and issues resolved in the Permahub project

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

---

## Purpose

This file maintains a chronological record of every fix applied to the project. Each entry includes:
- Date of fix
- Git commit hash (when applicable)
- Detailed description of the issue and resolution
- Files affected
- Author of the fix

---

## Format

```markdown
### YYYY-MM-DD - Issue Title

**Commit:** `<commit-hash>` (if committed)

**Issue:**
Brief description of the problem

**Root Cause:**
What caused the issue

**Solution:**
How it was fixed

**Files Changed:**
- path/to/file1.ext
- path/to/file2.ext

**Author:** Name <email>

---
```

---

## Fix History

### 2025-11-16 - Fix JavaScript import errors in auth pages

**Commit:** (pending)

**Issue:**
Signup, forgot password, and reset password pages failed to load with error: "The requested module '/src/js/supabase-client.js' does not provide an export named 'default'"

**Root Cause:**
Auth page JavaScript files were using default import syntax (`import supabaseClient from`) but supabase-client.js exports a named export (`export { supabase }`), not a default export.

**Solution:**
Changed all auth page imports from:
```javascript
import supabaseClient from '../../js/supabase-client.js';
```
to:
```javascript
import { supabase as supabaseClient } from '../../js/supabase-client.js';
```

**Files Changed:**
- src/wiki/js/wiki-signup.js
- src/wiki/js/wiki-forgot-password.js
- src/wiki/js/wiki-reset-password.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Fix favicon 404 errors

**Commit:** (pending)

**Issue:**
Browser console showed 404 errors for `/favicon.ico` on all wiki pages

**Root Cause:**
No favicon file existed in the public assets directory

**Solution:**
1. Created SVG favicon with 🌱 seedling emoji at `/src/assets/favicon.svg`
2. Added explicit favicon link to HTML `<head>` sections of all auth pages:
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg">
   ```

**Files Changed:**
- src/assets/favicon.svg (created)
- public/favicon.svg (created)
- src/wiki/wiki-signup.html
- src/wiki/wiki-login.html
- src/wiki/wiki-forgot-password.html
- src/wiki/wiki-reset-password.html

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Fix invalid HTML pattern regex in signup form

**Commit:** (pending)

**Issue:**
Browser console warning: "Pattern attribute value [a-z0-9_-]{3,20} is not a valid regular expression: Invalid character in character class"

**Root Cause:**
In HTML pattern attributes, the dash `-` character needs to be escaped when used in a character class, or placed at the beginning/end of the class.

**Solution:**
Escaped the dash character in the username input pattern:
```html
<!-- Before -->
pattern="[a-z0-9_-]{3,20}"

<!-- After -->
pattern="[a-z0-9_\-]{3,20}"
```

**Files Changed:**
- src/wiki/wiki-signup.html

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Hide "Create Page" button for unauthenticated users

**Commit:** (pending)

**Issue:**
Users who are not logged in could still see and access the "Create Page" button in the navigation header, which should only be available to authenticated users.

**Root Cause:**
The auth-header.js file was updating the login/logout button based on authentication status, but was not managing the visibility of the "Create Page" button in the navigation menu.

**Solution:**
Updated auth-header.js to:
1. Query for the "Create Page" button (`a[href="wiki-editor.html"]`) on page load
2. Show the button (set `display: ''`) when user is logged in
3. Hide the button (set `display: 'none'`) when user is logged out

This ensures that unauthenticated users cannot see the content creation interface in the navigation.

**Files Changed:**
- src/wiki/js/auth-header.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Protect wiki editor from unauthenticated access

**Commit:** (pending)

**Issue:**
Unauthenticated users could access the wiki editor page (wiki-editor.html) directly by typing the URL, even though the "Create Page" button was hidden. This allowed them to see the editor interface, though they couldn't actually save content.

**Root Cause:**
The wiki editor JavaScript (wiki-editor.js) had no authentication check. It would initialize the Quill editor, load categories, and set up all form handlers regardless of whether the user was logged in.

**Solution:**
Added authentication check at the start of the editor initialization in wiki-editor.js:
1. Check for authenticated user using `supabase.getCurrentUser()` and localStorage auth token
2. If user is not authenticated, call `showAuthRequiredMessage()` and stop initialization
3. Created `showAuthRequiredMessage()` function that:
   - Hides the editor form and header
   - Displays a user-friendly message explaining authentication is required
   - Shows benefits of creating an account
   - Provides "Log In" and "Sign Up" buttons
   - Includes a "Back to Home" link

This ensures unauthenticated users see a helpful message instead of a non-functional editor.

**Files Changed:**
- src/wiki/js/wiki-editor.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Add auth-header.js to all wiki pages and remove Create button from auth pages

**Commit:** (pending)

**Issue:**
The "Create Page" button visibility control in auth-header.js was only working on wiki-home.html. Other wiki pages (events, map, guides, favorites, page viewer, editor) still showed the button when users were logged out. Additionally, authentication pages (login, signup, forgot-password, reset-password) showed the "Create Page" button which doesn't make sense in that context.

**Root Cause:**
1. The auth-header.js script was only loaded on wiki-home.html, not on other wiki pages
2. Authentication pages included the "Create Page" button in their navigation HTML

**Solution:**
1. Added `<script type="module" src="js/auth-header.js"></script>` to all main wiki pages:
   - wiki-events.html
   - wiki-editor.html
   - wiki-map.html
   - wiki-page.html
   - wiki-favorites.html
   - wiki-guides.html

2. Removed the "Create Page" button HTML from authentication pages:
   - wiki-login.html (removed line 52)
   - wiki-signup.html (removed line 52)
   - wiki-forgot-password.html (removed line 52)
   - wiki-reset-password.html (removed line 52)

This ensures consistent auth-based UI behavior across all wiki pages and cleaner navigation on auth pages.

**Files Changed:**
- src/wiki/wiki-events.html
- src/wiki/wiki-editor.html
- src/wiki/wiki-map.html
- src/wiki/wiki-page.html
- src/wiki/wiki-favorites.html
- src/wiki/wiki-guides.html
- src/wiki/wiki-login.html
- src/wiki/wiki-signup.html
- src/wiki/wiki-forgot-password.html
- src/wiki/wiki-reset-password.html

**Author:** Claude Code <noreply@anthropic.com>

---


### 2025-11-16 - Disable content creation buttons for unauthenticated users

**Commit:** (pending)

**Issue:**
The "Add Event", "Add Location", and "Edit This Page" buttons were fully functional for unauthenticated users, potentially leading to confusion when clicking them would ultimately fail due to backend authentication requirements.

**Root Cause:**
These action buttons had no frontend authentication checks. They were always enabled and clickable, regardless of the user's login status.

**Solution:**
1. Added unique IDs to content creation buttons:
   - wiki-events.html: Added `id="addEventBtn"` to "Add Event" button (line 110)
   - wiki-map.html: Added `id="addLocationBtn"` to "Add Location" button (line 66)
   - wiki-page.html: Added `id="editPageBtn"` to "Edit This Page" button (line 134)

2. Updated auth-header.js to manage these buttons based on authentication status:
   - When logged in: Enable buttons (remove disabled state, restore opacity, clear tooltips)
   - When logged out: Disable buttons (add disabled class, reduce opacity to 0.5, add tooltips, prevent navigation with alert)

This provides clear visual feedback to users that these actions require authentication.

**Files Changed:**
- src/wiki/wiki-events.html
- src/wiki/wiki-map.html
- src/wiki/wiki-page.html
- src/wiki/js/auth-header.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Improve editor UX for unauthenticated users with banner approach

**Commit:** (pending)

**Issue:**
The previous implementation completely hid the editor for unauthenticated users, preventing them from exploring the interface before deciding to sign up. This created a poor discovery experience.

**Root Cause:**
The authentication check in wiki-editor.js used `showAuthRequiredMessage()` which replaced the entire editor with a login prompt, making it impossible for users to see what they'd be signing up for.

**Solution:**
Replaced the blocking authentication approach with a more user-friendly banner approach:

1. **Show prominent authentication banner** at top of editor:
   - Eye-catching red gradient banner with warning icon
   - Clear message: "You are not logged in - Editing is disabled"
   - Explains users can explore but not save
   - Provides "Log In" and "Sign Up" buttons directly in banner

2. **Disable save/publish functionality** while keeping editor interactive:
   - Disable "Publish" button (grayed out, shows tooltip, alerts on click)
   - Disable "Save Draft" button (grayed out, shows tooltip, alerts on click)
   - Keep "Preview" button enabled (it's read-only)
   - All form fields remain interactive for exploration

3. **Removed old `showAuthRequiredMessage()` function** that was blocking the editor entirely

This approach allows users to:
- Explore the editor interface and features
- Type and format content to test the experience
- Preview how the published content would look
- Make an informed decision about signing up

But prevents them from:
- Publishing content
- Saving drafts
- Actually creating database entries

**Files Changed:**
- src/wiki/js/wiki-editor.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Fix guides page not loading guides from database

**Commit:** (pending)

**Issue:**
The guides page (wiki-guides.html) was not loading any guides from the database. The page displayed correctly but the guides grid remained empty or showed a loading spinner indefinitely.

**Root Cause:**
The HTML file referenced a JavaScript module `js/wiki-guides.js` on line 208, but this file did not exist in the codebase. Without this script, no database queries were executed and no guides could be displayed.

**Solution:**
Created the missing wiki-guides.js file with complete functionality:

1. **Database Integration:**
   - Fetches published guides from `wiki_guides` table
   - Loads categories from `wiki_categories` table
   - Fetches guide-category relationships from `wiki_guide_categories` junction table
   - Enriches guides with author information from `users` table

2. **User Interface Features:**
   - Dynamic category filter buttons generated from database
   - Search functionality (filters by title, summary, and category names)
   - Three sorting options: newest, most popular (by view count), alphabetical
   - Responsive grid display with featured images
   - Shows guide summary, categories, author name, and view count
   - Links each guide to the detail page (wiki-page.html)

3. **Implementation Pattern:**
   - Followed the same architectural pattern as wiki-home.js and wiki-events.js
   - Uses the supabase client wrapper for database queries
   - Includes proper error handling and loading states
   - Implements XSS protection via escapeHtml() function

The implementation ensures guides load and display correctly with all filtering, searching, and sorting functionality working as designed.

**Files Changed:**
- src/wiki/js/wiki-guides.js (created)

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Standardize guide card format across guides page and home page

**Commit:** (pending)

**Issue:**
The guide cards displayed on wiki-guides.html had a different format than those on wiki-home.html. The guides page showed featured images, "Read Guide" buttons, and a different metadata layout, creating an inconsistent user experience across the wiki.

**Root Cause:**
When wiki-guides.js was created, it used a custom card format instead of matching the existing card format established in wiki-home.js. The two pages should present guides in the same way for consistency.

**Solution:**
Updated wiki-guides.js to match the guide card format from wiki-home.js:

**Changes made:**
1. Removed featured image display from guide cards
2. Removed "Read Guide" button (title is now the clickable link)
3. Added card-meta section showing date, author, and view count in same format
4. Made guide title a clickable link (previously was plain text with separate button)
5. Changed URL parameter from `?id=` to `?slug=` for consistency
6. Added `formatDate()` function to display relative dates (e.g., "2 days ago", "1 week ago")
7. Simplified card layout to match home page structure exactly

**Before:**
- Featured image at top
- Plain text title
- Author/views split left/right
- "Read Guide" button
- Link: `wiki-page.html?id={id}`

**After:**
- Card-meta header (date, author, views)
- Clickable title link
- Summary text
- Category tags
- Link: `wiki-page.html?slug={slug}`

This ensures users see the same guide card presentation whether browsing on the home page or the dedicated guides page.

**Files Changed:**
- src/wiki/js/wiki-guides.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Fix loading spinner persisting on wiki page content viewer

**Commit:** (committing now)

**Issue:**
When viewing individual guide pages (wiki-page.html), the "Loading guide content..." spinner remained visible even after the guide content had been successfully loaded and rendered. The actual content appeared below the spinner, creating a poor user experience.

**Root Cause:**
The JavaScript code in wiki-page.js was selecting the wrong div element to replace. It was using `articleDivs[articleDivs.length - 1]` (the last div) to insert content, but the loading spinner was in a different div (index 4 out of 6 divs). This caused the content to be inserted into the wrong location while the spinner remained untouched.

**Solution:**
Updated the content replacement logic in wiki-page.js to:

1. **Search for the spinner div specifically**: Loop through all divs in `.wiki-content` and find the one containing `.fa-spinner` class
2. **Replace its content**: Once found, replace the innerHTML of that specific div with the rendered guide content
3. **Verify removal**: Added console logging to confirm the spinner was successfully removed
4. **Fallback**: If spinner is not found (edge case), fall back to the last div

**Code changes:**
- Changed from: `const articleBody = articleDivs[articleDivs.length - 1]`
- Changed to: Loop through divs, find the one with `div.querySelector('.fa-spinner')`
- Added verification: `articleBody.querySelector('.fa-spinner') === null` to confirm removal

**Results:**
- Loading spinner is now properly removed when content loads
- Guide content displays cleanly without loading artifacts
- Console logs confirm: "🔍 Verifying spinner removed: YES"

**Files Changed:**
- src/wiki/js/wiki-page.js

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Create comprehensive regression tests for authentication page fixes

**Commit:** (committing now)

**Issue:**
Authentication page fixes from earlier (JavaScript import errors, favicon 404s, HTML pattern validation) did not have Playwright regression tests to prevent future regressions.

**Root Cause:**
Tests were created for recent fixes (guides page, spinner, auth UI) but earlier fixes from the same day were not covered by automated tests.

**Solution:**
Created comprehensive Playwright test file `tests/e2e/auth-pages-regression.spec.js` covering:

1. **JavaScript Import Errors Fix:**
   - Tests that wiki-signup.js, wiki-forgot-password.js, wiki-reset-password.js load without module import errors
   - Verifies no "does not provide an export named" errors appear in console
   - Confirms forms initialize correctly

2. **Favicon 404 Errors Fix:**
   - Tests that favicon loads without 404 errors on all auth pages
   - Verifies explicit favicon link exists in HTML head
   - Confirms SVG favicon format is used

3. **Invalid HTML Pattern Regex Fix:**
   - Tests that no HTML pattern validation warnings appear in console
   - Verifies username pattern accepts valid input
   - Confirms no HTML validation errors across all auth pages

4. **General Auth Pages Health:**
   - Smoke tests for all auth pages loading without errors
   - Verifies forms are visible on all pages
   - Confirms Create Page button is not present on auth pages

**Test Tags:**
- @regression, @auth-pages (main suite)
- @imports, @critical (JavaScript imports)
- @favicon, @assets (favicon loading)
- @validation, @html, @forms (HTML validation)
- @smoke, @health (general health checks)

Tags enable selective test execution: `npx playwright test --grep @imports` or `npx playwright test --grep @favicon`

**Files Changed:**
- tests/e2e/auth-pages-regression.spec.js (created)

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Create regression tests for authentication UI fixes

**Commit:** (committing now)

**Issue:**
Authentication UI fixes (Create Page button visibility, content creation buttons, editor UX) did not have Playwright regression tests to prevent future regressions.

**Root Cause:**
Tests were needed to verify that authentication-based UI controls work correctly for both authenticated and unauthenticated users across all wiki pages.

**Solution:**
Created comprehensive Playwright test file `tests/e2e/auth-ui-regression.spec.js` with 27 tests covering:

1. **Create Page Button Visibility:**
   - Tests button is hidden for unauthenticated users on wiki-home.html
   - Tests button is hidden across all wiki pages when logged out
   - Tests button is not present on auth pages

2. **Content Creation Buttons:**
   - Tests "Add Event" button is disabled when logged out
   - Tests "Add Location" button is disabled when logged out
   - Tests "Edit This Page" button is disabled when logged out
   - Tests tooltips appear on disabled buttons
   - Tests navigation is prevented with alerts

3. **Editor UX:**
   - Tests authentication banner is shown
   - Tests editor remains visible for exploration
   - Tests Publish/Save Draft buttons are disabled
   - Tests Preview button remains enabled
   - Tests Login/Sign Up buttons appear in banner
   - Tests users can type in fields for exploration

4. **Auth Header & UX:**
   - Tests auth header initializes correctly
   - Tests UI updates based on auth state
   - Tests clear visual feedback (opacity, tooltips)
   - Tests explanations for disabled actions

**Test Tags:**
@regression @auth @ui @create-button @content-buttons @critical @editor @banner @auth-header @ux

**Files Changed:**
- tests/e2e/auth-ui-regression.spec.js (created)

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Create regression tests for guides page functionality

**Commit:** (committing now)

**Issue:**
Guides page fixes (loading from database, card format standardization) did not have Playwright regression tests to prevent future regressions.

**Root Cause:**
Tests were needed to verify that the guides page loads correctly from the database, displays guides in the standardized format, and provides all search/filter/sort functionality.

**Solution:**
Created comprehensive Playwright test file `tests/e2e/wiki-guides-regression.spec.js` with 35 tests covering:

1. **Guides Loading from Database:**
   - Tests guides load from wiki_guides table
   - Tests guide count displays correctly
   - Tests data enrichment with author information
   - Tests data enrichment with category information
   - Tests only published guides are displayed
   - Tests no console errors during loading

2. **Guide Card Format Standardization:**
   - Tests cards use standardized format matching home page
   - Tests card-meta section (date, author, views)
   - Tests guide titles are clickable links
   - Tests slug parameter instead of id
   - Tests categories display as tags
   - Tests overall format consistency

3. **Search Functionality:**
   - Tests search filters by title, summary, category names
   - Tests search updates guide count
   - Tests empty search shows all guides

4. **Sorting Functionality:**
   - Tests sort by newest (created_at desc)
   - Tests sort by popular (view_count desc)
   - Tests sort alphabetically
   - Tests active sort button states
   - Tests sorting persists with search

5. **Category Filtering:**
   - Tests "All Guides" shows all guides
   - Tests category filters load from database
   - Tests category filtering works correctly
   - Tests filter count updates
   - Tests active filter states

6. **Data Enrichment:**
   - Tests author names fetched from users table
   - Tests categories fetched via junction table
   - Tests view counts displayed
   - Tests relative date formatting

7. **Security & Error Handling:**
   - Tests XSS protection via escapeHtml()
   - Tests empty state displays helpful message
   - Tests database error handling

**Test Tags:**
@regression @guides @critical @database @ui @search @sorting @filtering @data @security @xss

**Files Changed:**
- tests/e2e/wiki-guides-regression.spec.js (created)

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Create regression tests for wiki page spinner fix

**Commit:** (committing now)

**Issue:**
The loading spinner fix on wiki page content viewer did not have Playwright regression tests to prevent future regressions.

**Root Cause:**
Tests were needed to verify that the loading spinner is correctly removed after content loads and that the div selection logic works as intended.

**Solution:**
Created comprehensive Playwright test file `tests/e2e/wiki-page-spinner-regression.spec.js` with 18 tests covering:

1. **Loading Spinner Removal:**
   - Tests spinner is removed after content loads
   - Tests "Loading guide content..." message is removed
   - Tests guide content displays without loading artifacts
   - Tests verification message is logged in console
   - Tests correct div containing spinner is found

2. **Content Rendering:**
   - Tests guide title renders correctly
   - Tests guide metadata (author, date, views) renders
   - Tests category tags render
   - Tests markdown content is converted to HTML

3. **Div Selection Logic:**
   - Tests div with .fa-spinner class is found
   - Tests content is replaced in correct div
   - Tests content length is logged after replacement

4. **Error Handling:**
   - Tests guide not found is handled gracefully
   - Tests fallback to last div if spinner not found
   - Tests no console errors occur

5. **View Count Increment:**
   - Tests view count is incremented when page loads

**Test Tags:**
@regression @wiki-page @critical @spinner @content @implementation @error @analytics

**Files Changed:**
- tests/e2e/wiki-page-spinner-regression.spec.js (created)

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Create test coverage documentation for all regression tests

**Commit:** (pending)

**Issue:**
With comprehensive regression tests now in place, there was no central documentation explaining what tests exist, what they cover, how to run them selectively, and how the tagging system works.

**Root Cause:**
Four regression test files were created covering all fixes from FixRecord.md, but no documentation existed to help developers understand the test structure, coverage, or execution strategies.

**Solution:**
Created comprehensive test coverage documentation `tests/TEST_COVERAGE.md` containing:

1. **Test Execution Guide:**
   - How to run all regression tests
   - How to run specific test suites by tag
   - How to run tests by feature area
   - Examples of selective test execution

2. **Test Files and Coverage:**
   - Detailed description of each test file
   - List of all test suites within each file
   - Mapping of tests to FixRecord.md entries
   - Test counts for each file

3. **Coverage Statistics:**
   - Total of 4 regression test files created
   - Total of 100 regression tests
   - 11 distinct fixes covered
   - 100% coverage of FixRecord.md entries from 2025-11-16

4. **Tag Reference:**
   - Complete list of all test tags
   - Explanation of priority, feature, functionality, and quality tags
   - Examples of how to use tags for selective execution

5. **CI/CD Integration:**
   - GitHub Actions example configuration
   - Test report generation instructions
   - Best practices for automated testing

6. **Maintenance Guidelines:**
   - Process for adding tests for new fixes
   - How to handle test failures
   - Test file naming conventions

This documentation provides a single source of truth for understanding and working with the regression test suite.

**Files Changed:**
- tests/TEST_COVERAGE.md (created)

**Author:** Claude Code <noreply@anthropic.com>

---

### 2025-11-16 - Remove service role key from frontend for cloud deployment security

**Commit:** (pending)

**Issue:**
Service role key was exposed in frontend config.js file, creating a critical security vulnerability for cloud deployment. Service role keys bypass all Row Level Security (RLS) policies and should NEVER be exposed in client-side code.

**Root Cause:**
During initial development, service role key was added to SUPABASE_CONFIG object in config.js as a configuration option. While it was never actually used in production requests (verified via code search showing no `useServiceRole = true` calls), having it in the frontend code posed security risks:
1. Would be visible in built JavaScript bundle
2. Would appear in browser DevTools
3. Could be extracted by anyone viewing the source

**Solution:**
1. **Removed service role key from config.js:**
   - Deleted `serviceRoleKey` property from SUPABASE_CONFIG
   - Added documentation explaining anon key is safe to expose
   - Added comment noting service role key should only exist in server-side scripts

2. **Added environment detection:**
   - Created `isLocalEnvironment()` function to detect local vs cloud deployment
   - Automatically uses local Supabase (http://127.0.0.1:3000) when on localhost
   - Automatically uses cloud Supabase (https://mcbxbaggjaxqfdvmrqsc.supabase.co) for GitHub Pages
   - Added cloud anon key (safe to expose - designed to be public)

3. **Removed useServiceRole parameter from supabase-client.js:**
   - Deleted `useServiceRole` parameter from `request()` method
   - Simplified token logic to only use: `this.authToken || SUPABASE_CONFIG.anonKey`
   - Added documentation explaining only user tokens or anon key should be used

4. **Verified security:**
   - Service role key now only exists in server-side migration scripts (migrate.js, execute-all-migrations.mjs)
   - All frontend requests use either authenticated user JWT tokens or public anon key
   - RLS policies remain the primary security mechanism (189 policies across 30+ tables)

**Security Impact:**
- ✅ Service role key no longer exposed in frontend
- ✅ Cannot be extracted from built JavaScript
- ✅ RLS policies cannot be bypassed from browser
- ✅ Anon key exposure is safe (designed to be public)
- ✅ User data protected by RLS regardless of client

**Files Changed:**
- src/js/config.js
- src/js/supabase-client.js

**Author:** Claude Code <noreply@anthropic.com>

---

