# Permahub Wiki Implementation TODO

**Last Updated:** 2025-01-14

---

## Phase 1: Database Backend (Current Phase)

### ✅ Completed
- [x] Local Supabase setup with analytics disabled
- [x] Database schema with 13 wiki tables
- [x] RLS policies for all tables
- [x] Initial seed data (Madeira locations)
- [x] Extended seed data (Brasil, Portugal, Czech Republic, Germany)
- [x] Environment configuration (.env.local)
- [x] Base Supabase client (src/js/supabase-client.js)
- [x] Wiki-specific API methods (src/wiki/js/wiki-supabase.js)

### 🔄 In Progress
- [ ] Complete seed data for all 10 categories:
  - Gardening 🌱
  - Water Management 💧
  - Composting ♻️
  - Renewable Energy ☀️
  - Food Production 🥕
  - Agroforestry 🌲
  - Natural Building 🏡
  - Waste Management ♻️
  - Irrigation 💧
  - Community 👥
- [ ] Add 1-2 real guides per category with source citations
- [ ] Add 1-2 real events per category with verified organizations
- [ ] Ensure all locations have correct types (Farms, Gardens, Education Centers, Community Spaces, Businesses)
- [ ] Ensure all events have correct types (Workshops, Meetups, Tours, Courses, Work Days)

### ⏳ Pending
- [ ] Apply seed data to local database
- [ ] Verify data integrity and foreign key relationships
- [ ] Test API endpoints with curl/browser

---

## Phase 2: Admin Interface for Dynamic Management

### Requirements
**Goal:** Allow admins to add/edit/delete categories, location types, and event types without code changes

### Database Changes Needed

#### 1. Create Lookup Tables
```sql
-- Store categories dynamically
CREATE TABLE wiki_category_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- emoji or icon name
  description TEXT,
  color TEXT, -- hex color for UI
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store location types dynamically
CREATE TABLE wiki_location_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- emoji or icon name
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store event types dynamically
CREATE TABLE wiki_event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- emoji or icon name
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. Migrate Existing Data
- Seed wiki_category_types with current 10 categories
- Seed wiki_location_types with: Farms, Gardens, Education Centers, Community Spaces, Businesses
- Seed wiki_event_types with: Workshops, Meetups, Tours, Courses, Work Days

#### 3. Update Existing Tables
- Add foreign key to wiki_locations: `location_type_id UUID REFERENCES wiki_location_types(id)`
- Add foreign key to wiki_events: `event_type_id UUID REFERENCES wiki_event_types(id)`
- Migrate existing string-based types to FK references
- Keep `location_type` and `event_type` columns for backward compatibility (mark as deprecated)

#### 4. RLS Policies
```sql
-- Public can view active types
CREATE POLICY "Active types viewable by everyone" ON wiki_category_types
  FOR SELECT USING (active = true);

-- Only admins can manage types
CREATE POLICY "Admins can manage types" ON wiki_category_types
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Apply similar policies to location_types and event_types
```

### Admin UI Pages

#### 1. Admin Dashboard (`src/wiki/admin/admin-dashboard.html`)
**URL:** `/wiki/admin/dashboard`
**Access:** Admin role only
**Features:**
- Overview statistics
- Quick links to management pages
- Recent activity log
- System health status

#### 2. Category Management (`src/wiki/admin/admin-categories.html`)
**URL:** `/wiki/admin/categories`
**Features:**
- List all categories with edit/delete actions
- Add new category form:
  - Name (required)
  - Slug (auto-generated, editable)
  - Icon (emoji picker or text input)
  - Description (textarea)
  - Color (color picker)
  - Sort order (number input)
  - Active toggle
- Drag-and-drop reordering
- Bulk actions (activate/deactivate, delete)
- Preview how category appears in UI

#### 3. Location Type Management (`src/wiki/admin/admin-location-types.html`)
**URL:** `/wiki/admin/location-types`
**Features:**
- List all location types
- Add/edit/delete location types
- Same form fields as categories
- Show count of locations using each type
- Prevent deletion if locations reference the type

#### 4. Event Type Management (`src/wiki/admin/admin-event-types.html`)
**URL:** `/wiki/admin/event-types`
**Features:**
- List all event types
- Add/edit/delete event types
- Same form fields as categories
- Show count of events using each type
- Prevent deletion if events reference the type

### Authentication & Authorization

#### Admin Role Setup
```sql
-- Add admin role to user metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

#### Middleware for Admin Pages
```javascript
// src/wiki/js/admin-auth.js
export async function requireAdmin() {
  const user = await supabase.getCurrentUser();

  if (!user) {
    window.location.href = '/wiki/wiki-login.html?redirect=' +
      encodeURIComponent(window.location.pathname);
    return false;
  }

  // Check if user has admin role
  const { data, error } = await supabase.client
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || data?.role !== 'admin') {
    window.location.href = '/wiki/wiki-home.html';
    return false;
  }

  return true;
}
```

### UI Components Needed

#### 1. Admin Navigation Menu
- Add to existing wiki navigation (only visible to admins)
- Dropdown menu with links to all admin pages
- Visual indicator that user is in admin mode

#### 2. Reusable Admin Components
```
src/wiki/components/
├── AdminTable.js       # Sortable, filterable table
├── AdminForm.js        # Form with validation
├── IconPicker.js       # Emoji/icon picker
├── ColorPicker.js      # Color selection
├── ConfirmDialog.js    # Confirmation modal
└── DragDropList.js     # Drag-and-drop reordering
```

#### 3. Styling
- Use existing CSS variables for consistency
- Add admin-specific styles in `src/wiki/css/admin.css`
- Responsive design for tablet/mobile admin access

### API Endpoints (via wiki-supabase.js)

```javascript
// Category management
async getCategories(includeInactive = false)
async createCategory(data)
async updateCategory(id, data)
async deleteCategory(id)
async reorderCategories(orderedIds)

// Location type management
async getLocationTypes(includeInactive = false)
async createLocationType(data)
async updateLocationType(id, data)
async deleteLocationType(id)

// Event type management
async getEventTypes(includeInactive = false)
async createEventType(data)
async updateEventType(id, data)
async deleteEventType(id)
```

### Testing Checklist
- [ ] Admin can view all management pages
- [ ] Non-admin users redirected from admin pages
- [ ] Categories can be created/edited/deleted
- [ ] Location types can be managed
- [ ] Event types can be managed
- [ ] Drag-and-drop reordering works
- [ ] New categories appear in public UI immediately
- [ ] Inactive types hidden from public UI
- [ ] Cannot delete types that are in use
- [ ] Form validation works correctly
- [ ] Changes persist after page reload
- [ ] Mobile responsive design works

---

## Phase 3: Frontend Wire-Up (After Admin Interface)

### Pages to Wire Up
- [ ] wiki-home.html - Display guides from database
- [ ] wiki-events.html - Display events from database
- [ ] wiki-map.html - Display locations on map
- [ ] wiki-page.html - Display individual guide content
- [ ] wiki-editor.html - Create/edit wiki content
- [ ] wiki-favorites.html - Display user favorites

### Features Needed
- [ ] Infinite scroll or pagination for guides
- [ ] Category filtering
- [ ] Search functionality
- [ ] Location map with clustering
- [ ] Event calendar view
- [ ] Multi-language support integration
- [ ] User authentication flows
- [ ] Favorite/bookmark functionality

---

## Phase 4: Cloud Deployment

### Prerequisites
- [ ] All functionality tested locally
- [ ] Admin interface complete and tested
- [ ] Seed data finalized
- [ ] RLS policies verified
- [ ] Performance tested with large datasets

### Deployment Steps
- [ ] Apply schema to cloud Supabase (via Dashboard SQL Editor)
- [ ] Apply seed data to cloud database
- [ ] Update environment variables for production
- [ ] Test all functionality in cloud environment
- [ ] Set up staging environment for testing
- [ ] Configure custom domain if needed
- [ ] Set up monitoring and logging

---

## Notes

### Why Admin Interface First?
- Makes content management sustainable
- Avoids hardcoded categories in multiple places
- Allows non-technical admins to expand content types
- Prevents database migrations for simple changes
- Better separation of concerns

### Why Separate Admin Pages?
- Keeps user-facing UI clean and simple
- Easier to secure (single auth check point)
- Can use different design patterns for admin tasks
- Reduces cognitive load on regular users
- Easier to maintain and extend

### Future Enhancements
- [ ] **User-Configurable Landing Page** - Allow users to customize their wiki home page
  - Save preferred categories to show
  - Custom layout (grid, list, compact)
  - Favorite locations/guides pinned to top
  - Preferred language/region
  - Widget preferences (recent guides, upcoming events, nearby locations)
  - Store preferences in user_preferences table
- [ ] Bulk import/export for categories and types
- [ ] Activity log for admin actions
- [ ] Content moderation queue
- [ ] User role management UI
- [ ] Analytics dashboard
- [ ] Automated content suggestions
- [ ] API for external integrations
