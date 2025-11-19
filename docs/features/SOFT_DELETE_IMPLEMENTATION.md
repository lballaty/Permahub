# Soft Delete Implementation

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/features/SOFT_DELETE_IMPLEMENTATION.md

**Description:** Complete implementation of soft deletes with restore functionality for wiki content

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-17

---

## 🎯 Overview

Implemented a comprehensive soft delete system for wiki content (guides, events, locations) that allows users to restore accidentally deleted content within 30 days before automatic purging.

## ✅ What Was Implemented

### 1. Database Layer

**Migration:** [supabase/migrations/014_add_soft_deletes.sql](../../supabase/migrations/014_add_soft_deletes.sql)

**Changes:**
- Added `deleted_at` and `deleted_by` columns to:
  - `wiki_guides`
  - `wiki_events`
  - `wiki_locations`
- Created indexes for performance optimization
- Created helper functions:
  - `soft_delete_content()` - Soft delete with user tracking
  - `restore_deleted_content()` - Restore with permission check
  - `purge_old_deleted_content()` - Auto-purge content older than 30 days

**Schema:**
```sql
ALTER TABLE wiki_guides
ADD COLUMN deleted_at TIMESTAMPTZ,
ADD COLUMN deleted_by UUID REFERENCES users(id);

-- Plus indexes and helper functions
```

### 2. API Layer

**File:** [src/js/supabase-client.js](../../src/js/supabase-client.js)

**New Methods:**
```javascript
// Soft delete (recommended)
await supabase.softDelete(table, id, userId);

// Restore deleted content
await supabase.restore(table, id, userId);

// Get user's deleted content
const deleted = await supabase.getDeletedContent(table, userId, limit);

// Hard delete (warning added, use with caution)
await supabase.delete(table, id);
```

**Automatic Filtering:**
- `getAll()` method now automatically excludes soft-deleted records
- Use `includeDeleted: true` option to include deleted records

### 3. Editor Integration

**File:** [src/wiki/js/wiki-editor.js](../../src/wiki/js/wiki-editor.js)

**Changes:**
- Delete button now uses `softDelete()` instead of hard delete
- Shows user message: "You can restore this from your 'Deleted Content' page within 30 days"
- Tracks who deleted the content for permission checks

### 4. Deleted Content Page

**Files:**
- [src/wiki/wiki-deleted-content.html](../../src/wiki/wiki-deleted-content.html)
- [src/wiki/js/wiki-deleted-content.js](../../src/wiki/js/wiki-deleted-content.js)

**Features:**
- View all deleted content (guides, events, locations)
- Filter by content type
- See days remaining before auto-purge
- **Restore** - Recover deleted content as draft
- **Preview** - View content before restoring
- **Permanently Delete** - Hard delete with double confirmation

**URL:** `http://localhost:3001/src/wiki/wiki-deleted-content.html`

---

## 🔒 Security Features

### Double Confirmation on Delete

1. **Standard confirm dialog:** "Are you sure you want to delete [title]?"
2. **Type "DELETE" to confirm:** Prevents accidental clicks

Already implemented in [wiki-editor.js:1054-1074](../../src/wiki/js/wiki-editor.js#L1054-L1074)

### Permission Checks

- Users can only restore content **they** deleted
- Admin role support (TODO: when roles are implemented)
- Prevents unauthorized restoration

### Auto-Purge Protection

- Content kept for **30 days** after deletion
- Visual countdown on deleted content page
- Warning when content is close to being purged

---

## 📊 User Workflow

### Deleting Content

1. User clicks "Delete" button on guide/event/location
2. Confirms deletion (double confirmation)
3. Content is soft-deleted (status → archived, deleted_at timestamp set)
4. User sees: "You can restore this from your 'Deleted Content' page within 30 days"
5. Content disappears from public listings

### Restoring Content

1. User goes to "Deleted Content" page
2. Sees list of deleted items with days remaining
3. Can **Preview** content before restoring
4. Clicks "Restore" button
5. Content restored as **draft** (allows re-editing before republishing)
6. Content appears in editor/drafts

### Permanent Deletion

1. User can choose "Delete Permanently" on deleted content page
2. Double confirmation required (type "DELETE")
3. Content permanently removed from database
4. **Cannot be recovered**

---

## 🔧 Implementation Details

### Database Queries

**Exclude deleted content (automatic):**
```javascript
// Automatically filters out deleted records
const guides = await supabase.getAll('wiki_guides', {
  where: 'status',
  operator: 'eq',
  value: 'published'
});
// Returns only non-deleted, published guides
```

**Include deleted content (explicit):**
```javascript
// Include deleted records in results
const allGuides = await supabase.getAll('wiki_guides', {
  includeDeleted: true
});
```

**Get only deleted content:**
```javascript
// Get user's deleted content
const deleted = await supabase.getDeletedContent('wiki_guides', userId, 50);
```

### Status Flow

```
┌─────────┐
│  Draft  │
└────┬────┘
     │
     ▼
┌───────────┐
│ Published │
└────┬──────┘
     │
     ▼ (Delete button)
┌──────────┐
│ Archived │ (soft deleted, deleted_at set)
└────┬─────┘
     │
     ├──► (Restore) ──► Back to Draft
     │
     └──► (30 days) ──► Purged (hard delete)
```

---

## 🚀 Next Steps

### To Deploy:

1. **Run migration:**
   ```sql
   -- In Supabase SQL Editor, run:
   -- supabase/migrations/014_add_soft_deletes.sql
   ```

2. **Test soft delete:**
   - Create test guide/event/location
   - Delete it
   - Verify it appears in "Deleted Content" page
   - Restore it
   - Verify it's back as draft

3. **Add navigation link:**
   Add "Deleted Content" link to user menu/profile dropdown

4. **Optional: Schedule auto-purge:**
   Set up cron job to run `purge_old_deleted_content()` daily

### Future Enhancements:

- [ ] Admin panel to view all deleted content (moderation)
- [ ] Bulk restore/delete operations
- [ ] Email notification before auto-purge (e.g., 3 days warning)
- [ ] Export deleted content before purging
- [ ] Audit log of all delete/restore actions
- [ ] Configurable purge timeframe (per content type)

---

## 📋 Files Modified/Created

### Created:
- `supabase/migrations/014_add_soft_deletes.sql`
- `src/wiki/wiki-deleted-content.html`
- `src/wiki/js/wiki-deleted-content.js`
- `docs/features/SOFT_DELETE_IMPLEMENTATION.md`

### Modified:
- `src/js/supabase-client.js`
  - Added `softDelete()` method
  - Added `restore()` method
  - Added `getDeletedContent()` method
  - Updated `getAll()` to auto-filter deleted records
  - Added warning to `delete()` method

- `src/wiki/js/wiki-editor.js`
  - Changed delete to use `softDelete()` instead of hard delete
  - Updated delete confirmation message

### Not Modified (auto-handled):
- `src/wiki/js/wiki-guides.js` - No changes needed (auto-filters deleted)
- `src/wiki/js/wiki-events.js` - No changes needed (auto-filters deleted)
- `src/wiki/js/wiki-map.js` - No changes needed (auto-filters deleted)

---

## 🧪 Testing Checklist

- [ ] Run migration in Supabase
- [ ] Create test guide and soft delete it
- [ ] Verify deleted guide doesn't appear in guides list
- [ ] Verify deleted guide appears in "Deleted Content" page
- [ ] Restore deleted guide
- [ ] Verify restored guide is in draft status
- [ ] Edit and republish restored guide
- [ ] Test permanent delete with double confirmation
- [ ] Test permission check (try to restore someone else's deleted content)
- [ ] Verify auto-filtering in all content queries
- [ ] Test filter by content type on deleted page
- [ ] Test preview deleted content
- [ ] Test countdown timer (days remaining)

---

## 💡 Benefits

✅ **User Safety** - Protect against accidental deletions
✅ **Data Preservation** - Keep content for analytics/compliance
✅ **Undo Capability** - Users can recover mistakes
✅ **Audit Trail** - Track who deleted what and when
✅ **Relationship Integrity** - Don't break foreign keys
✅ **Performance** - Indexed queries for fast filtering
✅ **Auto-Cleanup** - Automatic purging prevents database bloat

---

## 📞 Support

For questions or issues with soft delete functionality:
- Review this documentation
- Check migration logs in Supabase
- Verify indexes are created (`idx_wiki_*_deleted_at`)
- Check browser console for error messages
- Contact: Libor Ballaty <libor@arionetworks.com>

---

**Status:** ✅ Implementation Complete - Ready for Testing

**Last Updated:** 2025-11-17
