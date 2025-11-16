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

