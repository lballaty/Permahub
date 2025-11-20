# Wiki Editor Test Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/testing/WIKI_EDITOR_TEST_PLAN.md

**Description:** Comprehensive test cases for wiki content management (create, edit, delete, publish)

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-20

**Last Updated:** 2025-11-20

---

## Overview

This document defines test cases for the complete wiki content management lifecycle including guides, events, and locations.

## Test Environment

- **Local Database:** PostgreSQL (127.0.0.1:5432)
- **Dev Server:** http://localhost:3001
- **Test User:** liborballaty@gmail.com
- **User ID:** 66cdbb7a-ddaf-43b3-beaa-fec777f07dd1

---

## 1. CREATE Operations

### 1.1 Create Guide as Draft

**Preconditions:**
- User logged in
- On wiki-editor.html page

**Test Steps:**
1. Fill in title: "Test Guide for Creation"
2. Add summary: "This is a test summary"
3. Add content: "This is test content with multiple paragraphs"
4. Select 2-3 categories
5. Keep status as "Draft"
6. Click "Save as Draft" button

**Expected Results:**
- ✅ Loading spinner appears
- ✅ No console errors
- ✅ Success message: "✅ Draft saved successfully!"
- ✅ Spinner disappears
- ✅ Redirects to My Content page (wiki-my-content.html)
- ✅ New guide appears in list with status "Draft"
- ✅ Database check: `SELECT * FROM wiki_guides WHERE slug = 'test-guide-for-creation'`
  - author_id = 66cdbb7a-ddaf-43b3-beaa-fec777f07dd1
  - status = 'draft'
  - created_at is recent timestamp

**Database Verification:**
```sql
SELECT id, title, slug, status, author_id, created_at
FROM wiki_guides
WHERE slug = 'test-guide-for-creation';
```

---

### 1.2 Create Guide as Published

**Test Steps:**
1. Fill in all required fields
2. Select categories
3. Change status to "Publish"
4. Click "Publish" button

**Expected Results:**
- ✅ Success message: "✅ Guide published successfully!"
- ✅ Redirects to wiki-page.html?slug=test-guide-published
- ✅ Guide displays correctly on public page
- ✅ Database: status = 'published', published_at is set

---

### 1.3 Create Event as Draft

**Test Steps:**
1. Switch content type to "Event"
2. Fill in: title, summary, description, date, time, location
3. Add organizer contact info
4. Save as draft

**Expected Results:**
- ✅ Saves to wiki_events table
- ✅ organizer_id = current user ID
- ✅ Status = 'draft'
- ✅ Redirects to My Content page

---

### 1.4 Create Location

**Test Steps:**
1. Switch content type to "Location"
2. Fill in: name, description, address, coordinates
3. Add contact information
4. Save

**Expected Results:**
- ✅ Saves to wiki_locations table
- ✅ created_by = current user ID
- ✅ Redirects to wiki-map.html with location highlighted

---

### 1.5 Create with Categories

**Test Steps:**
1. Create guide
2. Select 3 categories from different themes
3. Save as draft

**Expected Results:**
- ✅ Guide saved
- ✅ Category associations created in wiki_guide_categories
- ✅ Database check shows 3 rows with guide_id

**Database Verification:**
```sql
SELECT gc.*, c.name
FROM wiki_guide_categories gc
JOIN wiki_categories c ON gc.category_id = c.id
WHERE gc.guide_id = '<guide-id>';
```

---

### 1.6 Create with Featured Image

**Test Steps:**
1. Upload image via image picker
2. Complete guide details
3. Save

**Expected Results:**
- ✅ Image uploaded to storage
- ✅ featured_image path saved in database

---

## 2. EDIT Operations

### 2.1 Edit Existing Draft

**Preconditions:**
- Draft guide exists in database
- User is the author

**Test Steps:**
1. Navigate to My Content page
2. Click "Edit" button on draft guide
3. Verify editor loads with existing data:
   - Title field populated
   - Summary populated
   - Content in Quill editor
   - Categories selected
4. Modify title to "Test Guide - EDITED"
5. Change summary
6. Add more content
7. Click "Save as Draft"

**Expected Results:**
- ✅ Editor loads with all existing data
- ✅ No data loss
- ✅ Updates saved to database
- ✅ updated_at timestamp changes
- ✅ Redirects to My Content page
- ✅ Changes visible immediately

**Database Verification:**
```sql
SELECT title, summary, updated_at
FROM wiki_guides
WHERE id = '<guide-id>';
```

---

### 2.2 Edit and Publish Draft

**Test Steps:**
1. Open draft in editor
2. Make changes
3. Change status to "Publish"
4. Click "Publish"

**Expected Results:**
- ✅ Status changes from 'draft' to 'published'
- ✅ published_at timestamp set
- ✅ Redirects to public view page
- ✅ Guide now visible on Guides page (wiki-guides.html)

---

### 2.3 Edit Published Guide

**Test Steps:**
1. From Guides page, click "Edit" on published guide
2. Modify content
3. Save

**Expected Results:**
- ✅ Changes saved
- ✅ updated_at changes
- ✅ published_at unchanged
- ✅ Status remains 'published'

---

### 2.4 Edit Categories

**Test Steps:**
1. Open guide with 3 categories
2. Remove 1 category
3. Add 2 new categories
4. Save

**Expected Results:**
- ✅ Old category associations deleted
- ✅ New associations created
- ✅ Final count: 4 categories

**Database Verification:**
```sql
SELECT COUNT(*) FROM wiki_guide_categories WHERE guide_id = '<guide-id>';
-- Should return 4
```

---

### 2.5 Cannot Edit Other User's Content

**Test Steps:**
1. Create guide with different user account
2. Log in as original test user
3. Try to access editor URL directly: `wiki-editor.html?slug=other-user-guide`

**Expected Results:**
- ✅ Shows error or redirects
- ✅ Cannot modify other user's content
- ✅ Edit button not visible on guide cards owned by others

---

## 3. DELETE Operations

### 3.1 Soft Delete Draft Guide

**Preconditions:**
- Draft guide exists
- User is the author

**Test Steps:**
1. Navigate to My Content page
2. Click "Delete" button on draft guide
3. Confirm deletion in alert dialog

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ After confirm: Success message "✅ Guide deleted successfully!"
- ✅ Guide removed from My Content list
- ✅ Database: is_deleted = true, deleted_at timestamp set
- ✅ Guide appears in "Deleted Content" page

**Database Verification:**
```sql
SELECT is_deleted, deleted_at, deleted_by
FROM wiki_guides
WHERE id = '<guide-id>';
-- is_deleted should be TRUE
-- deleted_at should have timestamp
-- deleted_by should be user ID
```

---

### 3.2 Soft Delete Published Guide

**Test Steps:**
1. Delete published guide from My Content
2. Confirm deletion

**Expected Results:**
- ✅ Soft deleted (is_deleted = true)
- ✅ No longer visible on public Guides page
- ✅ No longer visible on My Content page
- ✅ Appears in Deleted Content page
- ✅ Can be restored within 30 days

---

### 3.3 Restore Deleted Guide

**Preconditions:**
- Guide soft deleted (is_deleted = true)

**Test Steps:**
1. Navigate to Deleted Content page (wiki-deleted-content.html)
2. Find deleted guide
3. Click "Restore" button
4. Confirm restoration

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Success message: "✅ Guide restored successfully!"
- ✅ Database: is_deleted = false, deleted_at = null
- ✅ Status changed to 'draft'
- ✅ Guide reappears in My Content page
- ✅ Can edit and republish

**Database Verification:**
```sql
SELECT is_deleted, deleted_at, status
FROM wiki_guides
WHERE id = '<guide-id>';
-- is_deleted should be FALSE
-- deleted_at should be NULL
-- status should be 'draft'
```

---

### 3.4 Delete Event

**Test Steps:**
1. Create event
2. Delete from My Content
3. Verify soft delete

**Expected Results:**
- ✅ Soft deleted in wiki_events table
- ✅ Removed from Events page
- ✅ Appears in Deleted Content

---

### 3.5 Delete Location

**Test Steps:**
1. Create location
2. Delete from My Content or Map page
3. Verify soft delete

**Expected Results:**
- ✅ Soft deleted in wiki_locations table
- ✅ Removed from Map page
- ✅ Can be restored

---

## 4. PUBLISH/UNPUBLISH Workflows

### 4.1 Publish Draft

**Test Steps:**
1. Create draft guide
2. Edit draft
3. Change status to "Publish"
4. Click "Publish"

**Expected Results:**
- ✅ Status: 'draft' → 'published'
- ✅ published_at timestamp set
- ✅ Visible on public Guides page
- ✅ Searchable by all users

---

### 4.2 Unpublish Guide (Archive)

**Test Steps:**
1. Open published guide in editor
2. Change status to "Archived"
3. Save

**Expected Results:**
- ✅ Status: 'published' → 'archived'
- ✅ Not visible on public Guides page
- ✅ Still in My Content with "Archived" badge
- ✅ Can be re-published

---

### 4.3 Schedule Future Publication

**Note:** This feature may not be implemented yet

**Test Steps:**
1. Create guide
2. Set publish_date to future date
3. Save as draft

**Expected Results:**
- ✅ Status = 'draft'
- ✅ publish_date stored
- ✅ Auto-publishes when date reached (requires cron job)

---

## 5. CATEGORY MANAGEMENT

### 5.1 Assign Multiple Categories

**Test Steps:**
1. Create guide
2. Select 5 categories from different themes
3. Save

**Expected Results:**
- ✅ 5 rows in wiki_guide_categories
- ✅ Guide appears in all 5 category filters

---

### 5.2 Change Categories

**Test Steps:**
1. Edit guide with 3 categories
2. Deselect all
3. Select 2 different categories
4. Save

**Expected Results:**
- ✅ Old associations deleted
- ✅ New associations created
- ✅ Count changes: 3 → 2

---

### 5.3 Remove All Categories

**Test Steps:**
1. Edit guide with categories
2. Deselect all categories
3. Save

**Expected Results:**
- ✅ All category associations deleted
- ✅ Guide still exists
- ✅ No errors

---

## 6. VALIDATION & ERROR HANDLING

### 6.1 Required Field Validation

**Test Steps:**
1. Leave title empty
2. Try to save

**Expected Results:**
- ✅ Error message: "Title is required"
- ✅ Form not submitted
- ✅ No database entry created

---

### 6.2 Slug Uniqueness

**Test Steps:**
1. Create guide "Test Guide"
2. Create another guide "Test Guide" (same title)

**Expected Results:**
- ✅ Second guide gets slug "test-guide-2" or similar
- ✅ No database constraint violation

---

### 6.3 Network Error Handling

**Test Steps:**
1. Stop Supabase: `supabase stop`
2. Try to save guide

**Expected Results:**
- ✅ Error message shown
- ✅ Spinner stops
- ✅ Form data not lost
- ✅ User can retry after reconnecting

---

### 6.4 Invalid Date/Time (Events)

**Test Steps:**
1. Create event
2. Set end_time before start_time
3. Try to save

**Expected Results:**
- ✅ Validation error
- ✅ Helpful error message

---

## 7. PERMISSIONS & SECURITY

### 7.1 Unauthenticated User

**Test Steps:**
1. Log out
2. Navigate to wiki-editor.html

**Expected Results:**
- ✅ Shows "Please log in" banner
- ✅ Save/Publish buttons disabled
- ✅ Cannot submit form

---

### 7.2 RLS Policy Enforcement

**Test Steps:**
1. Try to insert with different author_id via SQL

**Expected Results:**
- ✅ Database rejects insert
- ✅ RLS policy violation error

**Database Test:**
```sql
-- This should FAIL with RLS violation
INSERT INTO wiki_guides (title, slug, author_id, status)
VALUES ('Hack Attempt', 'hack-attempt', '00000000-0000-0000-0000-000000000001', 'published');
```

---

### 7.3 Cannot Delete Other User's Content

**Test Steps:**
1. As User A, create guide
2. Log in as User B
3. Try to delete User A's guide

**Expected Results:**
- ✅ Delete button not visible
- ✅ Direct API call fails
- ✅ RLS policy blocks deletion

---

## 8. EDGE CASES

### 8.1 Very Long Title

**Test Steps:**
1. Enter 500 character title
2. Save

**Expected Results:**
- ✅ Title truncated or validation error
- ✅ No database error

---

### 8.2 Special Characters in Title

**Test Steps:**
1. Title: "Guide with 'quotes', \"double quotes\", & ampersands"
2. Save

**Expected Results:**
- ✅ Characters properly escaped
- ✅ Slug sanitized: "guide-with-quotes-double-quotes-ampersands"
- ✅ No XSS vulnerability

---

### 8.3 Large Content (10,000+ words)

**Test Steps:**
1. Paste 10,000 word article into Quill editor
2. Save

**Expected Results:**
- ✅ Saves successfully
- ✅ No timeout
- ✅ Content intact when reloaded

---

### 8.4 Concurrent Edits

**Test Steps:**
1. Open same guide in two browser tabs
2. Edit in Tab 1, save
3. Edit in Tab 2, save

**Expected Results:**
- ✅ Last save wins (no merge)
- ✅ No data corruption
- ⚠️  Optional: Show warning about concurrent edits

---

## 9. INTEGRATION TESTS

### 9.1 Create → Edit → Publish → Delete Flow

**Full workflow test:**

1. **Create Draft**
   - Create guide "Integration Test Guide"
   - Save as draft
   - ✅ Appears in My Content

2. **Edit Draft**
   - Click edit
   - Change title to "Integration Test Guide - Updated"
   - Add more content
   - Save
   - ✅ Changes saved

3. **Publish**
   - Edit again
   - Change status to Publish
   - ✅ Appears on public Guides page

4. **Edit Published**
   - Make minor content changes
   - Save
   - ✅ Still published, changes visible

5. **Unpublish (Archive)**
   - Change status to Archived
   - ✅ Removed from public pages

6. **Delete**
   - Delete from My Content
   - ✅ Soft deleted

7. **Restore**
   - Restore from Deleted Content
   - ✅ Status = draft

8. **Re-publish**
   - Publish again
   - ✅ Back on public pages

---

### 9.2 Multi-Content Type Test

**Test Steps:**
1. Create 1 guide (draft)
2. Create 1 event (published)
3. Create 1 location
4. Navigate to My Content
5. Verify all 3 appear with correct badges

**Expected Results:**
- ✅ All 3 items listed
- ✅ Correct icons/badges for each type
- ✅ Can filter by type

---

## 10. PERFORMANCE TESTS

### 10.1 Large Category Selection

**Test Steps:**
1. Select 20+ categories
2. Save guide

**Expected Results:**
- ✅ Saves without timeout
- ✅ All associations created

---

### 10.2 Rapid Successive Saves

**Test Steps:**
1. Click Save button 5 times rapidly

**Expected Results:**
- ✅ Only one save operation executes
- ✅ Button disabled during save
- ✅ No duplicate database entries

---

## Test Execution Checklist

### Manual Testing Session

- [ ] 1.1 Create Guide as Draft
- [ ] 1.2 Create Guide as Published
- [ ] 1.3 Create Event as Draft
- [ ] 1.4 Create Location
- [ ] 1.5 Create with Categories
- [ ] 2.1 Edit Existing Draft
- [ ] 2.2 Edit and Publish Draft
- [ ] 2.3 Edit Published Guide
- [ ] 2.4 Edit Categories
- [ ] 3.1 Soft Delete Draft Guide
- [ ] 3.2 Soft Delete Published Guide
- [ ] 3.3 Restore Deleted Guide
- [ ] 4.1 Publish Draft
- [ ] 4.2 Unpublish Guide (Archive)
- [ ] 5.1 Assign Multiple Categories
- [ ] 5.2 Change Categories
- [ ] 6.1 Required Field Validation
- [ ] 6.2 Slug Uniqueness
- [ ] 7.1 Unauthenticated User
- [ ] 7.2 RLS Policy Enforcement
- [ ] 8.1 Very Long Title
- [ ] 8.2 Special Characters in Title
- [ ] 9.1 Full Create → Edit → Publish → Delete Flow

### Database Verification Queries

```sql
-- Count user's content
SELECT
  (SELECT COUNT(*) FROM wiki_guides WHERE author_id = '66cdbb7a-ddaf-43b3-beaa-fec777f07dd1') as guides,
  (SELECT COUNT(*) FROM wiki_events WHERE organizer_id = '66cdbb7a-ddaf-43b3-beaa-fec777f07dd1') as events,
  (SELECT COUNT(*) FROM wiki_locations WHERE created_by = '66cdbb7a-ddaf-43b3-beaa-fec777f07dd1') as locations;

-- Check deleted content
SELECT COUNT(*) FROM wiki_guides WHERE is_deleted = true AND author_id = '66cdbb7a-ddaf-43b3-beaa-fec777f07dd1';

-- Verify RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('wiki_guides', 'wiki_events', 'wiki_locations');
```

---

## Bug Tracking

Document any bugs found during testing:

| Test Case | Bug Description | Severity | Status |
|-----------|----------------|----------|--------|
| 1.1 | Spinner not disappearing | High | ✅ Fixed (v1.0.29) |
| 1.1 | No redirect after draft save | Medium | ✅ Fixed (v1.0.29) |
| 1.1 | RLS policy violation | Critical | ✅ Fixed (v1.0.25) |
| 1.1 | JSON parse error on insert | High | ✅ Fixed (v1.0.27) |
| - | Missing i18n translations | Low | ✅ Fixed (v1.0.30) |

---

## Next Steps

1. **Execute all test cases** manually
2. **Document results** in this file
3. **File bugs** for any failures
4. **Create automated tests** using Playwright
5. **Set up CI/CD** to run tests on every commit

---

**Last Test Run:** Not yet executed

**Test Status:** Ready for execution

**Tester:** TBD
