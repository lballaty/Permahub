# Wiki UI Regression Testing Checklist

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/testing/WIKI_UI_REGRESSION_TESTING_CHECKLIST.md

**Description:** Comprehensive UI regression testing checklist for Permahub Wiki before cloud deployment

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-18

---

## 🎯 Testing Objective

Ensure all wiki UI pages, features, and user flows work correctly on local database before deploying to cloud.

**Test Environment:**
- Local Supabase instance (http://127.0.0.1:3000)
- All 20 migrations applied
- Browser: Chrome, Firefox, Safari
- Devices: Desktop, Tablet, Mobile

---

## 📋 Production Wiki Pages to Test

**IMPORTANT:** Test ONLY production `wiki-*.html` files. Do NOT test `mockup-*.html` files.

**Production Pages (17):**
1. wiki-home.html - Home/Landing Page
2. wiki-page.html - Individual Wiki Page View
3. wiki-editor.html - Content Creation/Editing
4. wiki-guides.html - Guides Listing
5. wiki-events.html - Events Calendar/Listing
6. wiki-map.html - Interactive Map
7. wiki-favorites.html - User Favorites
8. wiki-deleted-content.html - Soft Delete Management
9. wiki-about.html - About Page
10. wiki-admin.html - Admin Dashboard
11. wiki-my-content.html - User's Own Content
12. wiki-issues.html - Issue Tracking
13. wiki-settings.html - User Settings
14. wiki-login.html - Login Page
15. wiki-signup.html - Signup Page
16. wiki-forgot-password.html - Password Recovery
17. wiki-reset-password.html - Password Reset
18. wiki-privacy.html - Privacy Policy
19. wiki-terms.html - Terms of Service

**Mockup Files (EXCLUDED from testing):**
- mockup-* files are prototypes/demos only - NOT for production testing

---

## 📋 Wiki Pages Testing

### 1. wiki-home.html - Home/Landing Page

**URL:** `/wiki/wiki-home.html`

**Visual Elements:**
- [ ] Navigation menu displays correctly
  - [ ] Logo/brand visible
  - [ ] All menu items present (Home, Guides, Events, Map, Favorites)
  - [ ] User profile icon/menu
  - [ ] Language selector
- [ ] Hero section loads
  - [ ] Welcome message displays
  - [ ] Call-to-action buttons work
- [ ] Content sections visible
  - [ ] Recent guides preview
  - [ ] Upcoming events preview
  - [ ] Featured locations
- [ ] Footer displays
  - [ ] Links functional
  - [ ] Copyright info present

**Functionality:**
- [ ] Click "Home" navigates correctly
- [ ] Click "Guides" navigates to guides page
- [ ] Click "Events" navigates to events page
- [ ] Click "Map" navigates to map page
- [ ] Click "Favorites" navigates to favorites
- [ ] Language selector changes language
- [ ] User menu opens/closes
- [ ] Search box accepts input
- [ ] All external links work

**Data Loading:**
- [ ] Recent guides load from database
- [ ] Events load from database
- [ ] Locations load from database
- [ ] Counts display correctly
- [ ] No console errors

**Responsive Design:**
- [ ] Desktop view (1280px+)
- [ ] Tablet view (768px - 1279px)
- [ ] Mobile view (< 768px)
- [ ] Navigation menu collapses on mobile
- [ ] Touch targets adequate on mobile

---

### 2. wiki-page.html - Individual Wiki Page View

**URL:** `/wiki/wiki-page.html?id=<page_id>`

**Visual Elements:**
- [ ] Page title displays
- [ ] Author information shows
- [ ] Created/updated dates visible
- [ ] Category badge displays
- [ ] Theme group tag visible
- [ ] View count shows
- [ ] Content area renders properly
- [ ] Table of contents (if applicable)
- [ ] Related pages section
- [ ] Comments section (if enabled)
- [ ] Share buttons
- [ ] Edit button (for owner)
- [ ] Delete button (for owner)
- [ ] Favorite button

**Functionality:**
- [ ] Page loads with valid ID
- [ ] Invalid ID shows error message
- [ ] Deleted page shows "not found"
- [ ] Content renders HTML safely (no XSS)
- [ ] Images load correctly
- [ ] Links within content work
- [ ] External links open in new tab
- [ ] Click edit button opens editor
- [ ] Click delete button prompts confirmation
- [ ] Click favorite button adds to favorites
- [ ] Share buttons work (copy link, social)
- [ ] View count increments on page view
- [ ] Related pages clickable

**Data Loading:**
- [ ] Page content loads from database
- [ ] Author details populated
- [ ] Category information correct
- [ ] Theme group correct
- [ ] Multilingual content switches
- [ ] No console errors

**Permissions:**
- [ ] Non-owner cannot see edit button
- [ ] Non-owner cannot see delete button
- [ ] Anonymous users can view public pages
- [ ] Private pages require authentication

**Responsive Design:**
- [ ] Content readable on mobile
- [ ] Images scale appropriately
- [ ] Buttons accessible on touch
- [ ] No horizontal scroll

---

### 3. wiki-editor.html - Content Creation/Editing

**URL:** `/wiki/wiki-editor.html` (new) or `/wiki/wiki-editor.html?id=<page_id>` (edit)

**Visual Elements:**
- [ ] Editor toolbar displays (Quill)
- [ ] Title input field
- [ ] Category dropdown/selector
- [ ] Theme group selector (cascading)
- [ ] Language selector
- [ ] Tags input
- [ ] Content editor (rich text)
- [ ] Save button
- [ ] Cancel button
- [ ] Preview button
- [ ] Image upload button
- [ ] Draft indicator

**Functionality:**

#### Creating New Page:
- [ ] Title input accepts text
- [ ] Category selector populated from DB
- [ ] Theme selector updates based on category
- [ ] Language selector works
- [ ] Quill editor toolbar functions:
  - [ ] Bold
  - [ ] Italic
  - [ ] Underline
  - [ ] Headers (H1, H2, H3)
  - [ ] Lists (ordered, unordered)
  - [ ] Links
  - [ ] Images
  - [ ] Code blocks
  - [ ] Quotes
- [ ] Image upload works
- [ ] Preview shows rendered content
- [ ] Save creates new database entry
- [ ] Redirect to view page after save
- [ ] Cancel prompts if unsaved changes

#### Editing Existing Page:
- [ ] Loads existing content
- [ ] Populates title field
- [ ] Selects correct category
- [ ] Selects correct theme
- [ ] Loads content into editor
- [ ] Shows correct language
- [ ] Save updates database
- [ ] Version history tracked (if enabled)

**Data Validation:**
- [ ] Title required (cannot save without)
- [ ] Category required
- [ ] Content required (minimum length)
- [ ] XSS protection active
- [ ] SQL injection prevented
- [ ] Image file type validated
- [ ] Image size limit enforced

**Permissions:**
- [ ] Authenticated users can create
- [ ] Only owner can edit
- [ ] Only owner can delete
- [ ] Admin can edit any page

**Responsive Design:**
- [ ] Editor usable on tablet
- [ ] Toolbar accessible on mobile
- [ ] Virtual keyboard doesn't obscure editor

---

### 4. wiki-guides.html - Guides Listing Page

**URL:** `/wiki/wiki-guides.html`

**Visual Elements:**
- [ ] Page title/header
- [ ] Search box
- [ ] Category filter dropdown
- [ ] Theme group filter
- [ ] Sort options (recent, popular, alphabetical)
- [ ] Guides grid/list view
- [ ] Guide cards with:
  - [ ] Thumbnail image
  - [ ] Title
  - [ ] Excerpt/preview
  - [ ] Author name
  - [ ] Category badge
  - [ ] View count
  - [ ] Date
  - [ ] Favorite icon
- [ ] Pagination controls
- [ ] "Create New Guide" button
- [ ] Empty state (if no guides)

**Functionality:**
- [ ] All guides load on page load
- [ ] Search filters guides in real-time
- [ ] Category filter updates results
- [ ] Theme filter works
- [ ] Multiple filters work together
- [ ] Sort changes order
- [ ] Click guide card opens detail page
- [ ] Click favorite adds to favorites
- [ ] Pagination loads next/prev pages
- [ ] "Create New" opens editor
- [ ] Edit button visible for own guides
- [ ] Delete button visible for own guides
- [ ] Soft-deleted guides NOT shown
- [ ] View counts display

**Data Loading:**
- [ ] Guides load from wiki_guides table
- [ ] Categories populate filter
- [ ] Theme groups populate filter
- [ ] Authors load correctly
- [ ] Images load or show placeholder
- [ ] Deleted content filtered out
- [ ] No console errors

**Performance:**
- [ ] Page loads within 2 seconds
- [ ] Search responsive (< 500ms)
- [ ] Filters update quickly
- [ ] Lazy loading for images
- [ ] Pagination smooth

**Responsive Design:**
- [ ] Grid adapts to screen size
- [ ] Cards stack on mobile
- [ ] Filters collapse into dropdown on mobile
- [ ] Touch-friendly buttons

---

### 5. wiki-events.html - Events Calendar/Listing

**URL:** `/wiki/wiki-events.html`

**Visual Elements:**
- [ ] Page title/header
- [ ] View toggle (calendar / list / map)
- [ ] Date range filter
- [ ] Category filter
- [ ] Location filter
- [ ] Search box
- [ ] Events display:
  - [ ] Event title
  - [ ] Date/time
  - [ ] Location name
  - [ ] Category
  - [ ] Thumbnail
  - [ ] Attendee count
  - [ ] RSVP button
- [ ] "Create New Event" button
- [ ] Calendar view (if selected)
- [ ] Map view (if selected)
- [ ] Empty state

**Functionality:**
- [ ] Events load from wiki_events table
- [ ] Switch between calendar/list/map views
- [ ] Calendar shows events on correct dates
- [ ] Click event opens detail modal/page
- [ ] Date filter updates results
- [ ] Category filter works
- [ ] Location filter works
- [ ] Search finds events
- [ ] RSVP button works
- [ ] "Create New" opens event editor
- [ ] Edit visible for own events
- [ ] Delete visible for own events
- [ ] Soft-deleted events NOT shown
- [ ] Future events vs past events toggle

**Data Loading:**
- [ ] All events load correctly
- [ ] Dates parse and display properly
- [ ] Locations linked correctly
- [ ] Categories display
- [ ] RSVP counts accurate
- [ ] No console errors

**Calendar View:**
- [ ] Current month displays
- [ ] Navigate prev/next month
- [ ] Events show on correct dates
- [ ] Click date opens day view
- [ ] Multi-day events span correctly

**Map View:**
- [ ] Events show as map markers
- [ ] Click marker shows event popup
- [ ] Clustering for nearby events
- [ ] Map controls functional

**Responsive Design:**
- [ ] Calendar adapts to mobile
- [ ] List view stacks events
- [ ] Filters collapse on mobile
- [ ] Touch-friendly controls

---

### 6. wiki-map.html - Interactive Map

**URL:** `/wiki/wiki-map.html`

**Visual Elements:**
- [ ] Full map display (Leaflet)
- [ ] Map controls (zoom, pan)
- [ ] Layer selector (guides, events, locations)
- [ ] Search box
- [ ] Location filter panel
- [ ] Category filter
- [ ] Markers for locations
- [ ] Marker clusters
- [ ] Popup on marker click
- [ ] Legend
- [ ] "Add Location" button

**Functionality:**
- [ ] Map initializes to default location
- [ ] Markers load from wiki_locations table
- [ ] Click marker opens info popup
- [ ] Popup shows:
  - [ ] Location name
  - [ ] Type/category
  - [ ] Description
  - [ ] Link to detail page
  - [ ] Images
- [ ] Search finds locations
- [ ] Filter by category updates markers
- [ ] Filter by type updates markers
- [ ] Layer toggle shows/hides marker types
- [ ] Zoom controls work
- [ ] Pan/drag works
- [ ] Marker clustering at zoom levels
- [ ] "Add Location" opens editor
- [ ] Edit visible for own locations
- [ ] Delete visible for own locations
- [ ] Soft-deleted locations NOT shown

**Map Features:**
- [ ] OpenStreetMap tiles load
- [ ] Custom markers display
- [ ] Marker colors by category
- [ ] Cluster animation smooth
- [ ] Geolocation "find me" button works
- [ ] Full screen mode

**Data Loading:**
- [ ] Locations load from database
- [ ] Coordinates valid
- [ ] Categories populate filters
- [ ] Images load in popups
- [ ] No console errors
- [ ] Performs well with 100+ markers

**Responsive Design:**
- [ ] Map fills viewport on mobile
- [ ] Controls accessible on mobile
- [ ] Popups sized for mobile
- [ ] Touch gestures work (pinch zoom)

---

### 7. wiki-favorites.html - User Favorites

**URL:** `/wiki/wiki-favorites.html`

**Visual Elements:**
- [ ] Page title/header
- [ ] Tabs/sections:
  - [ ] Favorite Guides
  - [ ] Favorite Events
  - [ ] Favorite Locations
- [ ] Items display similar to main pages
- [ ] Remove from favorites button
- [ ] Empty state per category
- [ ] Export favorites button (optional)

**Functionality:**
- [ ] Loads user's favorited items
- [ ] Tabs switch between types
- [ ] Click item opens detail page
- [ ] Remove button unfavorites item
- [ ] Confirmation prompt for remove
- [ ] Counts update after removal
- [ ] Only shows active items (not deleted)
- [ ] Requires authentication

**Data Loading:**
- [ ] Favorites load from favorites table
- [ ] Join with guides/events/locations
- [ ] Shows only user's favorites
- [ ] Handles deleted content gracefully
- [ ] No console errors

**Permissions:**
- [ ] Only accessible when logged in
- [ ] Shows only current user's favorites
- [ ] Cannot see other users' favorites

**Responsive Design:**
- [ ] Tabs work on mobile
- [ ] Items stack appropriately
- [ ] Remove button accessible

---

### 8. wiki-deleted-content.html - Soft Delete Management

**URL:** `/wiki/wiki-deleted-content.html`

**Visual Elements:**
- [ ] Page title "Deleted Content"
- [ ] Tabs for content types:
  - [ ] Deleted Guides
  - [ ] Deleted Events
  - [ ] Deleted Locations
- [ ] List of soft-deleted items
- [ ] Each item shows:
  - [ ] Title
  - [ ] Deleted date
  - [ ] Deleted by (user)
  - [ ] Restore button
  - [ ] Permanently delete button
- [ ] Empty state
- [ ] Bulk actions (optional)

**Functionality:**
- [ ] Loads user's deleted content
- [ ] Deleted_at IS NOT NULL filter
- [ ] Shows only user's own deleted items
- [ ] Restore button calls restore function
- [ ] Restored item appears in main listing
- [ ] Permanent delete confirms
- [ ] Permanent delete removes from DB
- [ ] Auto-purge indicator (if enabled)

**Data Loading:**
- [ ] Queries with deleted_at filter
- [ ] Loads soft_delete_content function
- [ ] Restore updates deleted_at to NULL
- [ ] No console errors

**Permissions:**
- [ ] Only owner can see deleted content
- [ ] Admin can see all deleted content (optional)
- [ ] Only owner can restore
- [ ] Only owner can permanently delete

**Responsive Design:**
- [ ] List stacks on mobile
- [ ] Buttons accessible
- [ ] Confirmations clear

---

### 9. wiki-about.html - About Page

**URL:** `/wiki/wiki-about.html`

**Testing:**
- [ ] Page loads correctly
- [ ] Content displays properly
- [ ] Navigation works
- [ ] Links functional
- [ ] Responsive design

---

### 10. wiki-admin.html - Admin Dashboard

**URL:** `/wiki/wiki-admin.html`

**Testing:**
- [ ] Requires admin authentication
- [ ] Non-admin redirected
- [ ] Admin controls visible
- [ ] User management works
- [ ] Content moderation tools
- [ ] Analytics display
- [ ] System settings accessible

---

### 11. wiki-my-content.html - User's Own Content

**URL:** `/wiki/wiki-my-content.html`

**Testing:**
- [ ] Requires authentication
- [ ] Shows user's guides
- [ ] Shows user's events
- [ ] Shows user's locations
- [ ] Edit buttons visible
- [ ] Delete buttons visible
- [ ] Quick edit functionality
- [ ] Content statistics

---

### 12. wiki-issues.html - Issue Tracking

**URL:** `/wiki/wiki-issues.html`

**Testing:**
- [ ] Issue list displays
- [ ] Create new issue works
- [ ] Issue details view
- [ ] Comment functionality
- [ ] Issue status updates
- [ ] Assign to user
- [ ] Search/filter issues

---

### 13. wiki-settings.html - User Settings

**URL:** `/wiki/wiki-settings.html`

**Testing:**
- [ ] Requires authentication
- [ ] Profile settings section
- [ ] Privacy settings
- [ ] Notification preferences
- [ ] Language preference
- [ ] Theme preference (if enabled)
- [ ] Account deletion option
- [ ] Save changes works

---

### 14. wiki-login.html - Login Page

**URL:** `/wiki/wiki-login.html`

**Testing:**
- [ ] Email input field
- [ ] Password input field
- [ ] "Remember me" checkbox
- [ ] Login button
- [ ] "Forgot password" link
- [ ] "Sign up" link
- [ ] Magic link option
- [ ] Social login (if enabled)
- [ ] Error messages display
- [ ] Successful login redirects
- [ ] Validation works

---

### 15. wiki-signup.html - Signup Page

**URL:** `/wiki/wiki-signup.html`

**Testing:**
- [ ] Email input field
- [ ] Password input field
- [ ] Confirm password field
- [ ] Display name field
- [ ] Terms acceptance checkbox
- [ ] Signup button
- [ ] "Already have account" link
- [ ] Password strength indicator
- [ ] Email validation
- [ ] Password match validation
- [ ] Creates user in database
- [ ] Sends verification email
- [ ] Redirects after signup

---

### 16. wiki-forgot-password.html - Password Recovery

**URL:** `/wiki/wiki-forgot-password.html`

**Testing:**
- [ ] Email input field
- [ ] Submit button
- [ ] Sends recovery email
- [ ] Confirmation message
- [ ] "Back to login" link
- [ ] Email validation
- [ ] Handles non-existent email
- [ ] Rate limiting works

---

### 17. wiki-reset-password.html - Password Reset

**URL:** `/wiki/wiki-reset-password.html?token=<token>`

**Testing:**
- [ ] Validates reset token
- [ ] New password field
- [ ] Confirm password field
- [ ] Submit button
- [ ] Password strength indicator
- [ ] Password match validation
- [ ] Updates password in DB
- [ ] Invalidates token after use
- [ ] Redirects to login
- [ ] Expired token handling

---

### 18. wiki-privacy.html - Privacy Policy

**URL:** `/wiki/wiki-privacy.html`

**Testing:**
- [ ] Page loads
- [ ] Content displays
- [ ] Navigation works
- [ ] Links functional
- [ ] Last updated date shown
- [ ] Responsive design

---

### 19. wiki-terms.html - Terms of Service

**URL:** `/wiki/wiki-terms.html`

**Testing:**
- [ ] Page loads
- [ ] Content displays
- [ ] Navigation works
- [ ] Links functional
- [ ] Last updated date shown
- [ ] Responsive design

---

## 🔧 Feature Testing

### Authentication & User Management

**Sign Up:**
- [ ] Email/password signup works
- [ ] Magic link signup sends email
- [ ] Email verification required
- [ ] Profile created in users table
- [ ] Redirect after signup
- [ ] Error handling for existing email
- [ ] Password strength validation

**Sign In:**
- [ ] Email/password login works
- [ ] Magic link login sends email
- [ ] Magic link login authenticates
- [ ] Remember me option works
- [ ] Redirect after login
- [ ] Error handling for wrong credentials
- [ ] Account lockout after failed attempts (if enabled)

**Password Reset:**
- [ ] "Forgot password" link works
- [ ] Reset email sends
- [ ] Reset link validates
- [ ] New password saves
- [ ] Login with new password works

**Profile:**
- [ ] View own profile
- [ ] Edit profile fields:
  - [ ] Display name
  - [ ] Bio
  - [ ] Location
  - [ ] Avatar upload
  - [ ] Privacy settings
- [ ] Save updates database
- [ ] View other user profiles (if public)

**Logout:**
- [ ] Logout button clears session
- [ ] Redirects to home
- [ ] Cannot access protected pages

---

### Search Functionality

**Global Search:**
- [ ] Search box visible on all pages
- [ ] Search finds guides
- [ ] Search finds events
- [ ] Search finds locations
- [ ] Search by title
- [ ] Search by content
- [ ] Search by author
- [ ] Search by tags
- [ ] Results show relevant items
- [ ] Click result navigates to item
- [ ] Handles special characters
- [ ] Handles empty search
- [ ] Shows "no results" message

**Category Filtering:**
- [ ] Category dropdown populates
- [ ] Select category filters results
- [ ] Multiple categories (if enabled)
- [ ] "All categories" shows all
- [ ] Category counts accurate

**Theme Filtering:**
- [ ] Theme groups load from DB
- [ ] Selecting theme filters categories
- [ ] Cascading filter works
- [ ] Theme counts accurate

---

### CRUD Operations

**Create:**
- [ ] Create guide saves to DB
- [ ] Create event saves to DB
- [ ] Create location saves to DB
- [ ] Required fields validated
- [ ] Timestamps recorded (created_at)
- [ ] Author linked (created_by)
- [ ] Redirect after create

**Read:**
- [ ] View any public guide
- [ ] View any public event
- [ ] View any public location
- [ ] Private content requires auth
- [ ] Deleted content hidden
- [ ] View counts increment

**Update:**
- [ ] Edit own guide saves
- [ ] Edit own event saves
- [ ] Edit own location saves
- [ ] Cannot edit others' content
- [ ] Timestamps updated (updated_at)
- [ ] Version history (if enabled)

**Delete (Soft):**
- [ ] Delete sets deleted_at
- [ ] Delete sets deleted_by
- [ ] Deleted content hidden from listings
- [ ] Deleted content still in DB
- [ ] Can view in deleted content page
- [ ] Restore clears deleted_at

**Delete (Permanent):**
- [ ] Permanent delete removes from DB
- [ ] Confirmation required
- [ ] Cannot undo
- [ ] References cleaned up

---

### Favorites System

- [ ] Add to favorites button works
- [ ] Remove from favorites works
- [ ] Favorite icon toggles state
- [ ] Favorites count updates
- [ ] Favorites persist across sessions
- [ ] Cannot favorite own content (optional)
- [ ] Favorites page shows all favorites
- [ ] Favorite deleted content handled

---

### Multilingual Content

**Language Switching:**
- [ ] Language selector shows all languages
- [ ] Select language changes UI
- [ ] Content translates (if available)
- [ ] Falls back to default if no translation
- [ ] Language preference saved
- [ ] URL parameter language override

**Translated Content:**
- [ ] Guides have translations
- [ ] Events have translations
- [ ] UI elements translate
- [ ] Category names translate
- [ ] Error messages translate

---

### Notifications (if enabled)

- [ ] Notification bell/icon visible
- [ ] Unread count shows
- [ ] Click opens notifications list
- [ ] Notifications load from DB
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Delete notification works
- [ ] Real-time updates (if Pub/Sub enabled)

---

## 🎨 UI/UX Testing

### Visual Consistency

- [ ] Consistent color scheme across pages
- [ ] Fonts consistent
- [ ] Button styles uniform
- [ ] Icon set consistent
- [ ] Spacing/padding consistent
- [ ] Borders/shadows consistent

### Accessibility

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Screen reader compatible (ARIA labels)
- [ ] Alt text on images
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Form labels associated with inputs
- [ ] Error messages clear

### Usability

- [ ] Navigation intuitive
- [ ] Loading states shown (spinners)
- [ ] Error states clear
- [ ] Success confirmations shown
- [ ] Empty states helpful
- [ ] Forms easy to fill
- [ ] Buttons clearly labeled
- [ ] Links distinguishable

---

## ⚡ Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Search response < 500ms
- [ ] Database queries optimized
- [ ] Images optimized/lazy loaded
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No layout shift (CLS)
- [ ] Interactions responsive (< 100ms)

---

## 🔒 Security Testing

**XSS Prevention:**
- [ ] User input sanitized
- [ ] HTML rendered safely
- [ ] Scripts stripped from content
- [ ] DOMPurify or equivalent used

**SQL Injection:**
- [ ] Supabase prepared statements (automatic)
- [ ] No raw SQL in client
- [ ] Input validation

**Authentication:**
- [ ] Protected routes require auth
- [ ] Sessions timeout appropriately
- [ ] CSRF protection (Supabase handles)

**Authorization:**
- [ ] Users can only edit own content
- [ ] RLS policies enforced
- [ ] Admin-only features protected

---

## 📱 Cross-Browser Testing

### Desktop Browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

### Checks Per Browser:
- [ ] All features functional
- [ ] Layout correct
- [ ] No console errors
- [ ] Forms submittable
- [ ] Animations smooth

---

## 📲 Device Testing

### Desktop:
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Laptop)
- [ ] 2560x1440 (2K)

### Tablet:
- [ ] iPad (1024x768)
- [ ] Android tablet (various)
- [ ] Landscape and portrait

### Mobile:
- [ ] iPhone (various sizes)
- [ ] Android (various sizes)
- [ ] Landscape and portrait
- [ ] Small screens (320px)

---

## 🐛 Error Handling

**Network Errors:**
- [ ] Offline detection
- [ ] Failed API calls show error
- [ ] Retry mechanism
- [ ] Graceful degradation

**Data Errors:**
- [ ] Invalid data handled
- [ ] Missing data shows placeholder
- [ ] Malformed JSON caught
- [ ] Database errors logged

**User Errors:**
- [ ] Form validation messages clear
- [ ] Required field indicators
- [ ] Invalid input prevented
- [ ] Helpful error messages

---

## ✅ Test Execution

### How to Test:

1. **Start local Supabase:** `supabase start`
2. **Verify migrations:** Check all 20 applied
3. **Start dev server:** `npm run dev`
4. **Open browser:** Navigate to http://localhost:3000
5. **Test each page systematically**
6. **Document issues** in bug tracker
7. **Retest after fixes**

### Test Reporting:

Create issue for each bug found:
- **Title:** Brief description
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots**
- **Browser/device**
- **Console errors**

### Pass Criteria:

- ✅ All critical features work
- ✅ No data loss
- ✅ No security vulnerabilities
- ✅ Acceptable performance
- ✅ Works on target browsers/devices
- ✅ Meets accessibility standards

---

## 📊 Testing Summary Template

```markdown
# Wiki UI Regression Test - [Date]

**Tester:** [Name]
**Environment:** Local Supabase
**Browser:** [Browser + Version]
**Device:** [Desktop/Tablet/Mobile]

## Pages Tested:
- [ ] wiki-home.html (Landing)
- [ ] wiki-page.html (Individual page view)
- [ ] wiki-editor.html (Content editor)
- [ ] wiki-guides.html (Guides listing)
- [ ] wiki-events.html (Events calendar)
- [ ] wiki-map.html (Interactive map)
- [ ] wiki-favorites.html (User favorites)
- [ ] wiki-deleted-content.html (Soft deletes)
- [ ] wiki-about.html (About page)
- [ ] wiki-admin.html (Admin dashboard)
- [ ] wiki-my-content.html (User's content)
- [ ] wiki-issues.html (Issue tracking)
- [ ] wiki-settings.html (User settings)
- [ ] wiki-login.html (Login)
- [ ] wiki-signup.html (Signup)
- [ ] wiki-forgot-password.html (Password recovery)
- [ ] wiki-reset-password.html (Password reset)
- [ ] wiki-privacy.html (Privacy policy)
- [ ] wiki-terms.html (Terms of service)

**Note:** Mockup files (mockup-*.html) are NOT included in testing

## Critical Issues Found: [Count]
## Minor Issues Found: [Count]
## Passed Tests: [Count / Total]

## Recommendation:
[ ] Ready for cloud deployment
[ ] Needs fixes before deployment
[ ] Major rework required

## Notes:
[Additional comments]
```

---

**Last Updated:** 2025-01-18
**Status:** Ready for execution
**Next Action:** Begin systematic testing of all wiki pages
